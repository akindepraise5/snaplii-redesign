import { createRoot } from 'react-dom/client'
import { InstantPicture, StackPicture, WalletPicture, ProtectStat } from './Benefits'

const parts: Record<string, () => JSX.Element> = {
  instant: () => <InstantPicture />,
  stack: () => <StackPicture />,
  wallet: () => <WalletPicture />,
  protect: () => <ProtectStat />,
}

function mount() {
  document.querySelectorAll<HTMLElement>('[data-snb]').forEach((el) => {
    const make = parts[el.dataset.snb || '']
    if (!make || el.dataset.snbMounted) return
    el.dataset.snbMounted = '1'
    el.textContent = ''
    createRoot(el).render(make())
  })
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount)
else mount()
