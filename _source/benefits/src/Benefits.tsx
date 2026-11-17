import { useLayoutEffect, useRef, useState } from 'react'
import { Collapse, Count, Phone, Spinner, Stage, States } from '../kit'
import type { Act } from '../kit'



// Snaplii homepage, "Save on what you already buy." A hero and strip grid:
//
//   Tile       Span   Kind        The one thing                                Moves
//   Instant    4      Hero UI     a checkout: Pay, then +$8.00 Snaplii Cash     tap, paid, balance rolls
//   Stack      2      Object      three payment cards, Snaplii Cash on top      cards settle, badge arrives
//   Wallet     2      Component   a gift card's QR and its number + Copy        copy, copied
//   Protect    2      Stat        120 days                                      counts up
//   Free       2      Statement   No annual fee                                 (still)
//
// Two of five tiles are UI, one phone and no window. Neighbors differ in kind
// across and down. Every claim comes from snaplii.com, its Terms and catalogue.

// The page's own icon set (Hugeicons sprite in index.html), one stroke weight
function PageIcon({ id, size = 16, className }: { id: string; size?: number; className?: string }) {
  return (
    <svg className={`snb-icon${className ? ` ${className}` : ''}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <use href={`#icon-${id}`} />
    </svg>
  )
}

const LEAD = 350

function usePictureWidth(fallback: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(fallback)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => setWidth(Math.round(node.clientWidth) || fallback)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(node)
    return () => ro.disconnect()
  }, [fallback])
  return [ref, width] as const
}

/* ---------------- Instant (hero) ---------------- */

type Pay = { phase: 'idle' | 'busy' | 'paid'; credited: boolean }
const payStart: Pay = { phase: 'idle', credited: false }
const payEnd: Pay = { phase: 'paid', credited: true }

const payScript = async (a: Act<Pay>) => {
  await a.wait(LEAD + 500)
  await a.click('pay')
  await a.set({ phase: 'busy' })
  await a.wait(700)
  await a.set({ phase: 'paid' })
  await a.wait(450)
  await a.set({ credited: true })
}

export function InstantPicture() {
  const [ref, width] = usePictureWidth(460)
  const compact = width < 380
  const phoneW = compact ? Math.min(320, width - 44) : Math.min(340, width - 40)
  const height = compact ? 430 : 456
  return (
    <div ref={ref} className="snb-measure">
      <Stage<Pay>
        width={width}
        height={height}
        initial={payStart}
        poster={payEnd}
        play="once"
        script={payScript}
        cursor={{ at: { x: width / 2 + 40, y: height - 20 }, style: 'touch' }}
        className="snb-stage"
      >
        {(s) => (
          <Phone width={phoneW} frame="soft" className="snb-phone" style={{ left: (width - phoneW) / 2, top: 26 }}>
            <div className="snb-app">
              <div className="snb-app__bar">
                <span className="snb-app__title">Checkout</span>
              </div>
              <div className="snb-balance" data-on={s.credited || undefined}>
                <span className="snb-balance__label">Snaplii Cash</span>
                <span className="snb-balance__value">
                  <span className="snb-cur">$</span>
                  <Count value={s.credited ? 20.4 : 12.4} duration={900} format={(n) => n.toFixed(2)} />
                </span>
                <span className="snb-balance__chip" aria-hidden>+$8.00</span>
              </div>
              <div className="snb-item">
                <span className="snb-item__art">Columbia</span>
                <span className="snb-item__text">
                  <span className="snb-item__name">Columbia</span>
                  <span className="snb-item__sub">Digital gift card</span>
                </span>
                <span className="snb-item__price">$100.00</span>
              </div>
              <div className="snb-earn">
                <span>Snaplii Cash you'll earn</span>
                <b>+$8.00</b>
              </div>
              <button className="snb-pay" data-target="pay" data-state={s.phase} tabIndex={-1}>
                <States
                  value={s.phase}
                  states={{
                    idle: <span>Pay $100.00</span>,
                    busy: <Spinner size={16} />,
                    paid: <span className="snb-pay__done"><PageIcon id="checkmark-circle-02" size={16} /> Added to your Wallet</span>,
                  }}
                />
              </button>
              <Collapse open={s.credited} reveal="drop">
                <div className="snb-arrived">
                  <span className="snb-arrived__label">In your Wallet</span>
                  <div className="snb-arrived__row">
                    <span className="snb-item__art snb-item__art--sm">Columbia</span>
                    <span className="snb-item__text">
                      <span className="snb-item__name">Columbia · $100.00</span>
                      <span className="snb-item__sub">Ready to use in store or online</span>
                    </span>
                  </div>
                </div>
              </Collapse>
            </div>
          </Phone>
        )}
      </Stage>
    </div>
  )
}

export { StackPicture } from './StackPicture'
export { WalletPicture } from './WalletPicture'
export { ProtectStat } from './ProtectStat'
