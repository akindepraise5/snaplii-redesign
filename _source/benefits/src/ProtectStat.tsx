import { useLayoutEffect, useRef, useState } from 'react'
import { Count, useReducedMotion } from '../kit'

// The bento gold's one-shot statistic, with three retained digit columns.
// Keeping 000 mounted lets Count roll existing digits instead of inserting 12.
export function ProtectStat() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [seen, setSeen] = useState(false)

  useLayoutEffect(() => {
    if (reduced) { setSeen(true); return }
    const element = ref.current
    if (!element || seen) return
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    let timer: number | undefined
    const observer = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer)
      if (!entry.isIntersecting) return
      timer = window.setTimeout(() => {
        setSeen(true)
        observer.disconnect()
      }, 680)
    }, { threshold: 0.65 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [reduced, seen])

  const ready = seen || reduced
  return (
    <span ref={ref} className="snb-stat__number snb-protect-motion" data-ready={ready || undefined}>
      <span className="visually-hidden">120 days</span>
      <span className="snb-stat__value" aria-hidden>
        <span className="snb-stat__sizer">120</span>
        <Count value={ready ? 120 : 0} duration={1250} stagger={70} format={(n) => String(Math.round(n)).padStart(3, '0')} />
      </span>
      <span className="snb-stat__unit" aria-hidden>days</span>
    </span>
  )
}
