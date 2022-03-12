import { useEffect, useRef } from 'react'

export function useDidMountEffect(fn: () => void, deps: any[]): void {
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      fn()
    } else mounted.current = true
    return () => {
      fn()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
