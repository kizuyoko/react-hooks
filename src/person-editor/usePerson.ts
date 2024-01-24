import {
  useState,
  useEffect,
  useCallback,
  useDebugValue,
  SetStateAction,
  useReducer,
  useMemo,
} from "react"
import localforage from "localforage"

import type { Person } from "../types/person"
import { sleep } from "../utils"
import { useIsMounted } from "../hooks/useIsMounted"
import { useDebouce } from "../hooks/useDebounce"
import { useWillUnmount } from "../hooks/useWillUnmount"
import { useThrottle } from "../hooks/useThrottle"
import { personEditorReducer } from "./personEditorReducer"

function savePerson(person: Person | null): void {
  console.log("Saving", person)
  localforage.setItem("person", person)
}

interface Metadata {
  isDirty: boolean
  isValid: boolean
}

export function usePerson(initialPerson: Person) {
  //const [person, setPerson] = useState<Person | null>(null)
  //const [metaData, setMetadata] = useState<Metadata>({ isDirty: false, isValid: true })

  const [{ person, metadata }, dispatch] = useReducer(personEditorReducer, {
    person: null,
    metadata: { isDirty: false, isValid: true },
  })

  const isMounted = useIsMounted()

  useDebugValue(person, (p) => `${p?.firstname} ${p?.surname}`)

  const firstAndSurName = useMemo(
    () => ({
      firstname: person?.firstname,
      surname: person?.surname,
    }),
    [person?.firstname, person?.surname]
  )

  useEffect(() => {
    console.log("firstAndSurName: ", firstAndSurName)
  }, [firstAndSurName])

  useEffect(() => {
    const getPerson = async () => {
      const person = await localforage.getItem<Person>("person")
      //await sleep(50)
      if (isMounted.current) {
        //setPerson(person ?? initialPerson)
        dispatch({
          type: "set-initial-person",
          payload: person ?? initialPerson,
        })
      }
    }
    getPerson()
  }, [initialPerson, isMounted])

  //const [, setNow] = useState(new Date())

  //useEffect(() => {
  //  const handle = setInterval(() => setNow(new Date()), 500)
  //  return () => clearInterval(handle)
  //}, [])

  const saveFn = useCallback(() => {
    savePerson(person)
  }, [person])

  useThrottle(saveFn, 10000)
  useWillUnmount(saveFn)

  function setPersonAndMeta(value: SetStateAction<Person | null>) {
    //setPerson(value)
    //setMetadata((m) => ({ ...m, isDirty: true }))
  }

  function setProperty(name: keyof Person, value: unknown) {
    dispatch({ type: "set-property", payload: { name, value } })
  }

  function setProperties(payload: Partial<Person>) {
    dispatch({ type: "set-properties", payload })
  }

  return [person, setProperty, setProperties, metadata] as const
}
