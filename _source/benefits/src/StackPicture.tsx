import { useLayoutEffect, useRef, useState } from 'react'
import { BrandMark, Stage, type Act } from '../kit'

// Preserve the existing wallet composition. Like payout-flow's cursorless
// arrivals, each related object settles before the result joins it.
type StackScene = { back: boolean; middle: boolean; front: boolean; cash: boolean }
const START: StackScene = { back: false, middle: false, front: false, cash: false }
const POSTER: StackScene = { back: true, middle: true, front: true, cash: true }

const stackScript = async (a: Act<StackScene>) => {
  await a.wait(400)
  a.mark('stack')
  await a.set({ back: true })
  await a.wait(100)
  await a.set({ middle: true })
  await a.wait(100)
  await a.set({ front: true })
  await a.wait(600)
  a.mark('rewards')
  await a.set({ cash: true })
  await a.wait(900)
}

function useStackWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(360)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => setWidth(Math.round(node.clientWidth) || 360)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

export function StackPicture() {
  const [ref, width] = useStackWidth()
  return (
    <div ref={ref} className="snb-measure">
      <Stage<StackScene>
        width={width}
        height={248}
        initial={START}
        poster={POSTER}
        play="once"
        script={stackScript}
        className="snb-stage snb-stack-motion"
      >
        {(s) => (
          <div
            className="snb-cards"
            data-back={s.back || undefined}
            data-middle={s.middle || undefined}
            data-front={s.front || undefined}
            data-cash={s.cash || undefined}
            style={{ ['--w' as string]: `${Math.min(width - 64, 286)}px` }}
          >
            <span className="snb-card snb-card--back">
              <span className="snb-card__bank">Credit</span>
              <BrandMark brand="amex" size={24} />
            </span>
            <span className="snb-card snb-card--mid">
              <span className="snb-card__bank">Debit</span>
              <BrandMark brand="mastercard" size={24} />
            </span>
            <span className="snb-card snb-card--front">
              <span className="snb-card__top">
                <span className="snb-card__bank snb-card__bank--dark">Credit</span>
                <BrandMark brand="visa" size={20} />
              </span>
              <span className="snb-card__chip" aria-hidden />
              <span className="snb-card__dots">•••• 2048</span>
            </span>
            <span className="snb-plus">+ Snaplii Cash</span>
          </div>
        )}
      </Stage>
    </div>
  )
}
