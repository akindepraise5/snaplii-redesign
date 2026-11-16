set -e
cd "$(dirname "$0")"
rm -rf dist && mkdir -p dist/kit
./node_modules/.bin/esbuild src/mount.tsx --bundle --minify --format=iife --jsx=automatic --loader:.svg=dataurl --define:process.env.NODE_ENV='"production"' --outfile=dist/snaplii-benefits.js --log-level=error
mv dist/snaplii-benefits.css dist/kit/stageshow-kit.css
./node_modules/.bin/esbuild src/benefits.css --minify --outfile=dist/snaplii-benefits.css --log-level=error
