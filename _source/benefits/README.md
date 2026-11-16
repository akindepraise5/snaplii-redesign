# "Save on what you already buy." section

Built with the stageshow kit (MIT, assets/kit/LICENSE.txt).

- src/Benefits.tsx: the animated pictures (checkout phone, payment cards, wallet card, 120-day count)
- src/benefits.css: section styles (Snaplii tokens)
- src/mount.tsx: mounts each picture into its [data-snb] slot in index.html
- build.sh: rebuilds assets/snaplii-benefits.js, assets/snaplii-benefits.css and assets/kit/stageshow-kit.css
  (needs the stageshow kit in ./kit and its node_modules)

The tile copy is plain HTML in index.html, so it is readable without JavaScript.
