# "Save on what you already buy." section

Built with the stageshow kit (MIT, assets/kit/LICENSE.txt).

- src/Benefits.tsx: checkout phone and benefit-scene exports
- src/StackPicture.tsx: cards settle in order, then Snaplii Cash arrives
- src/WalletPicture.tsx: gift card arrives and Copy confirms Copied
- src/ProtectStat.tsx: three retained digit columns roll to 120 days
- src/benefits.css: section styles (Snaplii tokens)
- src/mount.tsx: mounts each picture into its [data-snb] slot in index.html
- build.mjs (or build.sh): rebuilds assets/snaplii-benefits.js, assets/snaplii-benefits.css and assets/kit/stageshow-kit.css

The tile copy is plain HTML in index.html, so it is readable without JavaScript.

Run `npm ci`, `npm run typecheck`, and `npm run build` in this directory.
The Stageshow kit is resolved from `./kit`, then the workspace skill at
`../../.agents/skills/stageshow/kit`. Set `STAGESHOW_KIT` to an absolute kit
directory to use another installation. Build dependencies are pinned in
package-lock.json; the deployed site still serves plain static assets.

The supporting stories play once when visible and hold their result. Reduced
motion shows the finished poster. See REHEARSAL.md for checks and limitations.
