import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useCountdown(initialSeconds: number, onExpire: () => void) {
  const expiresAtRef = useRef(0)
  const onExpireRef = useRef(onExpire)
  const intervalRef = useRef<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  const tick = useCallback(() => {
    const next = Math.max(0, Math.ceil((expiresAtRef.current - Date.now()) / 1000))
    setSecondsLeft(next)
    if (next === 0 && intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
      onExpireRef.current()
    }
  }, [])

  useEffect(() => {
    expiresAtRef.current = Date.now() + initialSeconds * 1000
    tick()
    intervalRef.current = window.setInterval(tick, 1000)

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        tick()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [initialSeconds, tick])

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [secondsLeft])

  return {
    secondsLeft,
    formattedTime,
    isWarning: secondsLeft < 300,
    isDanger: secondsLeft < 60
  }
}
