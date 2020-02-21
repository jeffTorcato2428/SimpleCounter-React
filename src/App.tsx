import React from "react";
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
