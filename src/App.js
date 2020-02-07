import React, { useEffect, useState } from "react";
import "./App.css";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://127.0.0.1:3001");

const App = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Clinet Connected");
    };
    client.onmessage = message => {
      console.log(message)
      const dataFromServer = JSON.parse(message.data);
      
      if (dataFromServer.type === "counterChange") {
        setCounter(dataFromServer.data.counter);
      }
    };
  });

  const onIncrement = () => {
    const newCounter = counter + 1;
    setCounter(newCounter);
    client.send(JSON.stringify({ type: "counterChange", counter: newCounter }));
    console.log("Incremented");
  };

  const onDecrement = () => {
    const newCounter = counter - 1;
    setCounter(newCounter);
    client.send(JSON.stringify({ type: "counterChange",  counter: newCounter }));
    console.log("Decremented");
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Socket Counter</p>
      </header>
      <section className="App-body">
        <div className="Counter">{counter}</div>
        <div className="Counter-button-container">
          <button onClick={onIncrement} className="Counter-button">
            Increment
          </button>
          <button onClick={onDecrement} className="Counter-button">
            Decrement
          </button>
        </div>
      </section>
    </div>
  );
};

export default App;
