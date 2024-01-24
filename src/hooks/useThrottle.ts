import { useEffect, useRef, useDebugValue } from "react"

export function useThrottle(fn: () => void, timeout: number): void {
  const previourRef = useRef<(() => void) | null>(null)
  const currentRef = useRef<(() => void) | null>(fn)

  if (previourRef.current !== fn) {
    currentRef.current = fn
  }

  useDebugValue(currentRef.current, (fn) => fn?.toString())

  useEffect(() => {
    const handle = setInterval(() => {
      if (currentRef.current) {
        previourRef.current = currentRef.current
        currentRef.current()
        currentRef.current = null
      }
    }, timeout)

    return () => clearInterval(handle)
  }, [timeout])
}
