import React from 'react'

const CounterContainer = (props) => {

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

export default CounterContainer