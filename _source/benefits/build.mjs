import { build } from 'esbuild'
import ts from 'typescript'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../..')
const kit = process.env.STAGESHOW_KIT
  ? resolve(process.env.STAGESHOW_KIT)
  : existsSync(resolve(here, 'kit/index.ts'))
    ? resolve(here, 'kit')
    : resolve(root, '.agents/skills/stageshow/kit')

if (!existsSync(resolve(kit, 'index.ts'))) {
  throw new Error('Stageshow kit missing. Set STAGESHOW_KIT to its kit directory; see README.md.')
}

// This page only needs the marks named by its scenes. A computed brand prop
// opts into the full registry so future dynamic scenes keep their artwork.
const sceneSource = readdirSync(resolve(here, 'src')).filter((file) => file.endsWith('.tsx'))
  .map((file) => readFileSync(resolve(here, 'src', file), 'utf8')).join('\n')
const usedBrands = new Set([...sceneSource.matchAll(/\bbrand\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]))
const dynamicBrands = /\bbrand\s*=\s*\{/.test(sceneSource)

function brandRegistry(source) {
  if (dynamicBrands || !usedBrands.size) return source
  const ast = ts.createSourceFile('brands.ts', source, ts.ScriptTarget.Latest, true)
  let registry
  const find = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'brandMarks') {
      let value = node.initializer
      while (value && (ts.isAsExpression(value) || ts.isSatisfiesExpression(value))) value = value.expression
      if (value && ts.isObjectLiteralExpression(value)) registry = value
    }
    ts.forEachChild(node, find)
  }
  find(ast)
  if (!registry) throw new Error('Stageshow brand registry structure changed.')
  const kept = registry.properties.filter((property) => usedBrands.has(property.name?.text))
  if (kept.length !== usedBrands.size) throw new Error('A scene names an unknown Stageshow brand.')
  return source.slice(0, registry.getStart(ast)) + '{' + kept.map((property) => property.getText(ast)).join(',') + '}' + source.slice(registry.end)
}

const product = await build({
  absWorkingDir: here,
  entryPoints: ['src/mount.tsx'],
  outfile: resolve(root, 'assets/snaplii-benefits.js'),
  bundle: true,
  minify: true,
  format: 'iife',
  jsx: 'automatic',
  loader: { '.svg': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"' },
  nodePaths: [resolve(here, 'node_modules')],
  plugins: [{
    name: 'stageshow-kit',
    setup(context) {
      context.onResolve({ filter: /^\.\.\/kit$/ }, () => ({ path: resolve(kit, 'index.ts') }))
      // The published demos are a classic script, so inline the kit's brand
      // marks instead of leaving import.meta-relative image URLs at runtime.
      context.onLoad({ filter: /[\\/]brands[\\/]index\.ts$/ }, ({ path }) => ({
        loader: 'ts',
        resolveDir: dirname(path),
        contents: brandRegistry(readFileSync(path, 'utf8')).replace(
          /new URL\('([^']+\.svg)', import\.meta\.url\)\.href/g,
          (_, image) => JSON.stringify('data:image/svg+xml;base64,' + readFileSync(resolve(dirname(path), image)).toString('base64')),
        ),
      }))
    },
  }],
  write: false,
})

for (const output of product.outputFiles) {
  const destination = output.path.endsWith('.css')
    ? resolve(root, 'assets/kit/stageshow-kit.css')
    : output.path
  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, output.contents)
}

await build({
  absWorkingDir: here,
  entryPoints: ['src/benefits.css'],
  outfile: resolve(root, 'assets/snaplii-benefits.css'),
  bundle: true,
  minify: true,
})
console.log('Built Snaplii benefit demos and styles.')
