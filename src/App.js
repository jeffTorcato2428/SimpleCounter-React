import React, { useEffect, useState } from "react";
import "./App.css";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import CounterContainer from "./components/App/CounterContainer/CounterContainer";
import ErrorOverlay from "./components/App/ErrorOverlay/ErrorOverlay";

const client = new W3CWebSocket("ws://192.168.1.191:3001");

const App = () => {
  const [counter, setCounter] = useState(0);
  //const [hasError, setHasError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Clinet Connected");
      client.send(JSON.stringify({ type: "initialHandshake" }));
      setIsConnected(true);
    };

    client.onerror = () => {
      //setHasError(true);
    };

    client.onmessage = message => {
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
    client.send(JSON.stringify({ type: "counterChange", counter: newCounter }));
    console.log("Decremented");
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Socket Counter</p>
      </header>
      {!isConnected ? (
        <ErrorOverlay />
      ) : (
        <CounterContainer
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          counter={counter}
        />
      )}
    </div>
  );
};

export default App;
