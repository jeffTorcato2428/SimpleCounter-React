import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { QueryRenderer } from "react-relay";
import {graphql} from 'babel-plugin-relay/macro'
import "./App.css";
import CounterContainer from "./components/App/CounterContainer/CounterContainer";
import ErrorOverlay from "./components/App/ErrorOverlay/ErrorOverlay";
import RelayEnvironment from "./data/Environment";
import { AppQueryVariables } from "./__generated__/AppQuery.graphql";

const serverURI =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "http://192.168.1.191:3001";

// interface ServerPayload {
//   counter: number;
//   _id: string;
// }

const client = io.connect(serverURI);

const query = graphql`
  query AppQuery($counterId: String) {
    counter(id: $counterId) {
      ...CounterContainer_count
    }
  }
`;

const variables = {
  counterId: "5e413c741c9d440000647d78"
};

const App = () => {
  const [counter, setCounter] = useState(0);
  //const [hasError, setHasError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  //const [someCount, setSomeCount] = useState(0);

  // useEffect(() => {
  //   client.on("socket connection", (data: ServerPayload) => {
  //     console.log("Socket Connected");
  //     setIsConnected(true);
  //     setCounter(data.counter);
  //   });

  //   client.on("server response", (data: ServerPayload) => {
  //     setCounter(data.counter);
  //   });
  // });

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
      <QueryRenderer
        environment={RelayEnvironment}
        query={query}
        variables={variables}
        render={({ error, props, retry }) => {
          if (props) {
            console.log(props);
            return <div />;
          } else if (error) {
            return <div>{error.message}</div>;
          }

          return <ErrorOverlay />;
        }}
      />
    </div>
  );
};

export default App;
