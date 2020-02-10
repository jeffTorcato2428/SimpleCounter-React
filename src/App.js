import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import CounterContainer from "./components/App/CounterContainer/CounterContainer";
import ErrorOverlay from "./components/App/ErrorOverlay/ErrorOverlay";

const serverURI =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "http://192.168.1.191:3001";

const client = io.connect(serverURI);

const App = () => {
  const [counter, setCounter] = useState(0);
  //const [hasError, setHasError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  //const [someCount, setSomeCount] = useState(0);

  useEffect(() => {
    client.on("socket connection", data => {
      console.log("Socket Connected");
      setIsConnected(true);
      setCounter(data.counter);
    });

    client.on("server response", data => {
      setCounter(data.counter);
    });
  });

  const onIncrement = () => {
    const newCounter = counter + 1;
    setCounter(newCounter);
    client.emit("counter change", { counter: newCounter });
    console.log("Incremented");
  };

  const onDecrement = () => {
    const newCounter = counter - 1;
    setCounter(newCounter);
    client.emit("counter change", { counter: newCounter });
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
