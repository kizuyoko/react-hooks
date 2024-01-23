import { useState, useEffect } from "react"
import localforage from "localforage"

import type { Person } from "../types/person"
import { sleep } from "../utils"
import { useIsMounted } from "../hooks/useIsMounted"

function savePerson(person: Person | null): void {
  console.log("Saving", person)
  localforage.setItem("person", person)
}

export function usePerson(initialPerson: Person) {
  const [person, setPerson] = useState<Person | null>(null)
  const isMounted = useIsMounted()

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

  useEffect(() => {
    savePerson(person)
  }, [person])

  return [person, setPerson] as const
}
