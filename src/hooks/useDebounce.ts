import { useEffect } from "react"

export function useDebouce(fn: () => void, timeout: number): void {
  useEffect(() => {
    const handle = setTimeout(fn, timeout)

    return () => clearTimeout(handle)
  }, [fn, timeout])
}
