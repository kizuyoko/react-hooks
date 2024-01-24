import {
  useState,
  useEffect,
  useCallback,
  useDebugValue,
  SetStateAction,
} from "react"
import localforage from "localforage"

import type { Person } from "../types/person"
import { sleep } from "../utils"
import { useIsMounted } from "../hooks/useIsMounted"
import { useDebouce } from "../hooks/useDebounce"
import { useWillUnmount } from "../hooks/useWillUnmount"
import { useThrottle } from "../hooks/useThrottle"

function savePerson(person: Person | null): void {
  console.log("Saving", person)
  localforage.setItem("person", person)
}

interface Metadata {
  isDirty: boolean
  isValid: boolean
}

export function usePerson(initialPerson: Person) {
  const [person, setPerson] = useState<Person | null>(null)
  const [metaData, setMetadata] = useState<Metadata>({
    isDirty: false,
    isValid: true,
  })
  const isMounted = useIsMounted()

  useDebugValue(person, (p) => `${p?.firstname} ${p?.surname}`)

  useEffect(() => {
    const getPerson = async () => {
      const person = await localforage.getItem<Person>("person")
      await sleep(50)
      if (isMounted.current) {
        setPerson(person ?? initialPerson)
      }
      setPerson(person ?? initialPerson)
    }
    getPerson()
  }, [initialPerson, isMounted])

  const [, setNow] = useState(new Date())

  useEffect(() => {
    const handle = setInterval(() => setNow(new Date()), 500)
    return () => clearInterval(handle)
  }, [])

  const saveFn = useCallback(() => {
    savePerson(person)
  }, [person])

  useThrottle(saveFn, 10000)
  useWillUnmount(saveFn)

  function setPersonAndMeta(value: SetStateAction<Person | null>) {
    setPerson(value)
    setMetadata((m) => ({ ...m, isDirty: true }))
  }

  return [person, setPersonAndMeta, metaData] as const
}
