import React, { useEffect } from "react";
import {
  createFragmentContainer,
  graphql,
  RelayProp,
  commitMutation,
  requestSubscription
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
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { CounterContainerSubscriptionResponse } from "./__generated__/CounterContainerSubscription.graphql";

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

const subscriptionQuery = graphql`
  subscription CounterContainerSubscription {
    counterChanged {
      counter
      id
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
  useEffect(() => {
    const subscriptionConfig: GraphQLSubscriptionConfig<CounterContainerSubscriptionResponse> = {
      subscription: subscriptionQuery,
      variables: { input: {} },
      onCompleted: () => {},
      onError: error => console.error(error),
      onNext: response => {},
      updater: (store, data) => {
        const payload = store.getRootField("counterChanged");
        const newValue = payload.getValue("counter");
        const counterStore = store.get(
          "Q291bnRlcjo1ZTQxM2M3NDFjOWQ0NDAwMDA2NDdkNzg="
        );
        counterStore?.setValue(newValue, "counter");
      }
    };

    requestSubscription(RelayEnvironment, subscriptionConfig);
  });

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
