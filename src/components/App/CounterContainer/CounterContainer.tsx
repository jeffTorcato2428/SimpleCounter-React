import React from "react";
import {
  createFragmentContainer,
  graphql,
  RelayProp,
  commitMutation
} from "react-relay";

import { CounterContainer_count } from "./__generated__/CounterContainer_count.graphql";
import {
  UpdateCounterInput,
  CounterContainerMutationVariables,
  CounterContainerMutation,
  CounterContainerMutationResponse
} from "./__generated__/CounterContainerMutation.graphql";
import { Environment } from "relay-runtime/lib/store/RelayStoreTypes";
import RelayEnvironment from "../../../data/Environment";

interface IProps {
  relay: RelayProp;
  count: CounterContainer_count;
}

const mutation = graphql`
  mutation CounterContainerMutation($counterInputData: UpdateCounterInput!) {
    updateCounter(input: $counterInputData) {
      newCounter {
        counter
      }
    }
  }
`;

const updateCounter = (
  environment: Environment,
  counterInputData: UpdateCounterInput,
  counter: any
) => {
  const variables: CounterContainerMutationVariables = {
    counterInputData
  };
  return commitMutation<CounterContainerMutation>(environment, {
    mutation,
    variables,
    updater: store => {
      const payload = store.getRootField("updateCounter");
      const linkedRecord = payload.getLinkedRecord("newCounter");
      const newValue = linkedRecord.getValue("counter");
      const counterProxy = store.get(counter.id);
      counterProxy?.setValue(newValue, "counter");
    },
    optimisticUpdater: store => {
      const counterProxy = store.get(counter.id);
      counterProxy?.setValue(counterInputData.counterInput.counter, "counter");
    },
    onCompleted: (response: CounterContainerMutationResponse) => {
      console.log("[COUNTER MUTATION]");
    },
    onError: (err: Error) => console.error(err)
  });
};

const CounterContainer: React.FunctionComponent<IProps> = props => {
  const onIncrementHandler = () => {
    const newCounter = props.count.counter + 1;
    //console.log(newCounter);
    updateCounter(
      RelayEnvironment,
      { counterInput: { counter: newCounter } },
      props.count
    );
  };

  const onDecrementHandler = () => {
    const newCounter = props.count.counter - 1;
    updateCounter(
      RelayEnvironment,
      { counterInput: { counter: newCounter } },
      props.count
    );
  };

  return (
    <section className="App-body">
      <div className="Counter">{props.count.counter}</div>
      <div className="Counter-button-container">
        <button onClick={onIncrementHandler} className="Counter-button">
          Increment
        </button>
        <button onClick={onDecrementHandler} className="Counter-button">
          Decrement
        </button>
      </div>
    </section>
  );
};

export default createFragmentContainer(CounterContainer, {
  count: graphql`
    fragment CounterContainer_count on Counter {
      id
      counter
    }
  `
});
