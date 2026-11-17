# Rehearsal: Snaplii benefit animations

Gold: Stageshow `examples/bento` (the existing hero-and-strip composition,
native-sized pictures, once-in-view supporting beats, a page-sized statistic).
The payment stack also uses the cursorless arrival pattern from `payout-flow`.
This update extends the existing pictures and preserves the page layout and colours.

Beats:

- Payment stack: three opaque cards settle upward in reading order; the
  Snaplii Cash badge arrives after them; the finished stack holds.
- Wallet: the existing card settles upward; a measured touch presses Copy;
  the same button confirms Copied; the result holds.
- Protection: after the number is visible, retained digit columns roll from
  000 to 120; the days unit settles alongside it. Leaving before the start
  cancels the pending timer. The value is announced as a static 120 days.

Reduced motion: all pictures show their finished posters; no count or travel.
There are no new loops or replay controls. Checkout remains the lead story.

Checks: production bundle builds without warnings; all scene and kit TypeScript
dependencies typecheck. Additional behavioural checks are recorded locally in
`.preview/benefit-motion-verification.json`.

Captured: none. Browser access host and native pipe were unavailable during this
session. Wide/narrow playback, live interruption, visual framing, contact sheets,
and the Stageshow film gate have not been verified. No film-gate pass is claimed.

Review: source review covers widths, retained state, reduced motion, copy timing
and unchanged final composition. It cannot verify actual pixels or frame pacing.
