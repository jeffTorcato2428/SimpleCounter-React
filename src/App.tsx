import React, { useState } from "react";
//import io from "socket.io-client";
import {
  QueryRenderer,
  graphql
} from "react-relay";
import "./App.css";
import CounterContainer from "./components/App/CounterContainer/CounterContainer";
import ErrorOverlay from "./components/App/ErrorOverlay/ErrorOverlay";
import RelayEnvironment from "./data/Environment";


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
  //const [isConnected, setIsConnected] = useState(true);
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

  // const onIncrement = () => {
  //   const newCounter = counter + 1;
  //   setCounter(newCounter);
  //   console.log("[New Counter]", newCounter)
  //   //client.emit("counter change", { counter: newCounter });
  //   //updateCounter(RelayEnvironment, { counterInput: { counter: newCounter } });
  //   console.log("Incremented");
  // };

  // const onDecrement = () => {
  //   const newCounter = counter - 1;
  //   setCounter(newCounter);
  //   //client.emit("counter change", { counter: newCounter });
  //   //updateCounter(RelayEnvironment, { counterInput: { counter: newCounter } });
  //   console.log("Decremented");
  // };

  return (
    <div className="App">
      <header className="App-header">
        <p>Socket Counter</p>
      </header>
      <QueryRenderer
        environment={RelayEnvironment}
        query={query}
        variables={variables}
        render={({
          error,
          props,
          retry
        }: {
          error: Error | null;
          props: any;
          retry: any;
        }) => {
          if (props) {
            
            return (
              <CounterContainer
                count={props.counter}
              />
            );
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
