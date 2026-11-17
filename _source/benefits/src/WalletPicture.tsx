import { useLayoutEffect, useRef, useState } from 'react'
import { Button, Stage, States, type Act } from '../kit'
import { QR_PATH, QR_SIZE } from './qr'

// One supporting beat: the existing gift card arrives, its number is copied,
// and the confirmation stays. The checkout remains the grid's lead story.
type WalletState = { arrived: boolean; copied: boolean }

const initial: WalletState = { arrived: false, copied: false }
const poster: WalletState = { arrived: true, copied: true }

export async function walletScript(a: Act<WalletState>) {
  await a.wait(570)
  a.mark('card-arrives')
  await a.set({ arrived: true })
  await a.wait(1000)
  a.mark('copy-number')
  // Measure the control; the touch lands on its icon lane, clear of its label.
  await a.click({ at: 'wallet-copy', x: 0.18, y: 0.5 })
  await a.set({ copied: true })
  a.mark('number-copied')
  await a.wait(2200)
}

function PageIcon({ id }: { id: string }) {
  return (
    <svg className="snb-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <use href={`#icon-${id}`} />
    </svg>
  )
}

function usePictureWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(360)
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => setWidth(Math.round(element.clientWidth) || 360)
    measure()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

export function WalletPicture() {
  const [ref, width] = usePictureWidth()
  return (
    <div ref={ref} className="snb-measure">
      <Stage<WalletState>
        width={width}
        height={214}
        compact={{ below: 310, width, height: 214 }}
        initial={initial}
        poster={poster}
        script={walletScript}
        play="once"
        cursor={{ at: { x: width - 24, y: 190 }, style: 'touch' }}
        className="snb-stage snb-wallet-story"
      >
        {(s, _rect, layout) => {
          const compact = layout === 'compact'
          return (
            <div className="snb-gift" data-arrived={s.arrived || undefined} data-compact={compact || undefined} style={{ width: Math.min(width - (compact ? 32 : 56), 300) }}>
              <div className="snb-gift__head">
                <span className="snb-gift__brand">Tim Hortons</span>
                <span className="snb-gift__amt">$25.00</span>
              </div>
              <div className="snb-gift__body">
                <svg className="snb-qr" viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} width={compact ? 64 : 84} height={compact ? 64 : 84} shapeRendering="crispEdges" aria-hidden>
                  <path d={QR_PATH} fill="#161a18" />
                </svg>
                <div className="snb-gift__meta">
                  <span className="snb-gift__label">Card number</span>
                  <span className="snb-gift__num">6347 •••• 4821</span>
                  <Button className="snb-copybtn" data-target="wallet-copy" data-copied={s.copied || undefined} tabIndex={-1}>
                    <States
                      value={s.copied ? 'copied' : 'copy'}
                      states={{
                        copy: <span className="snb-wallet-copy-state"><PageIcon id="copy" /><span>Copy</span></span>,
                        copied: <span className="snb-wallet-copy-state"><PageIcon id="checkmark-circle-02" /><span>Copied</span></span>,
                      }}
                    />
                  </Button>
                </div>
              </div>
            </div>
          )
        }}
      </Stage>
    </div>
  )
}
