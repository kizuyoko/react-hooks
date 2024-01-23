import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

export function Counter(): ReactElement {
  const [counter, setCounter] = useState(0)
  //const [focus, setFocus] = useState(false)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setTimeout(() => {
      button.current?.focus()
    }, 1000)
  }, [])

  // useEffect - Renders after component. The button shows blue in the first sequence, and then green.
  // useLayoutEffect - Renders before component. The button shows green from the beggining..
  useLayoutEffect(() => {
    if (button.current) {
      button.current.style.backgroundColor = "green"
    }
  }, [])

  return (
    <div>
      <div>Count: {counter}</div>
      <div>
        <button
          ref={button}
          className="btn btn-primary"
          onClick={() => setCounter(counter + 1)}
        >
          Increment
        </button>
      </div>
    </div>
  )
}
