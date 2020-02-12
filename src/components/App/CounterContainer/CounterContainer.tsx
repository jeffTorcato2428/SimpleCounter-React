import React from 'react'

import { createFragmentContainer, graphql, RelayProp } from 'react-relay'
import { CounterContainer_count } from './__generated__/CounterContainer_count.graphql'

interface IProps {
  relay: RelayProp
  counter: CounterContainer_count
  onIncrement: Function
  onDecrement: Function
}

const CounterContainer: React.FunctionComponent<IProps> = (props) => {

    const onIncrementHandler = () => {
        props.onIncrement()
    }

    const onDecrementHandler = () => {
        props.onDecrement()
    }

    return (
        <section className="App-body">
        <div className="Counter">{props.counter}</div>
        <div className="Counter-button-container">
          <button onClick={onIncrementHandler} className="Counter-button">
            Increment
          </button>
          <button onClick={onDecrementHandler} className="Counter-button">
            Decrement
          </button>
        </div>
      </section>
    )
}

export default createFragmentContainer(CounterContainer, {
  count: graphql`
    fragment CounterContainer_count on Counter {
      counter
    }
  `
})