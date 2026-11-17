import ts from 'typescript'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const kit = process.env.STAGESHOW_KIT
  ? resolve(process.env.STAGESHOW_KIT)
  : existsSync(resolve(here, 'kit/index.ts'))
    ? resolve(here, 'kit')
    : resolve(here, '../../.agents/skills/stageshow/kit')
const options = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  strict: true,
  esModuleInterop: true,
  skipLibCheck: true,
  noEmit: true,
  baseUrl: here,
  typeRoots: [resolve(here, 'node_modules/@types')],
  paths: {
    react: ['node_modules/@types/react'],
    'react/*': ['node_modules/@types/react/*'],
    'react-dom/*': ['node_modules/@types/react-dom/*'],
    'lucide-react': ['node_modules/lucide-react'],
  },
}
const host = ts.createCompilerHost(options)
host.resolveModuleNames = (names, from) => names.map((name) => name === '../kit'
  ? { resolvedFileName: resolve(kit, 'index.ts'), extension: ts.Extension.Ts }
  : ts.resolveModuleName(name, from, options, host).resolvedModule)
const program = ts.createProgram([resolve(here, 'src/mount.tsx')], options, host)
const diagnostics = ts.getPreEmitDiagnostics(program)
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => here,
    getNewLine: () => '\n',
  }))
  process.exitCode = 1
} else {
  console.log('Benefit scenes and their Stageshow dependencies typecheck cleanly.')
}
