import {
  Environment,
  Network,
  RecordSource,
  Store
} from "relay-runtime";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { execute } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";

const webSocketURL = "ws://localhost:3001/subscriptions";

const fetchQuery = async (
  operation,
  variables,
  cacheConfig,
  uploadables
) => {
  let response = await fetch("http://127.0.0.1:3001/api/graphql/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables
    })
  });
  //console.log("Response", await response.json())
  return await response.json();
};

const subscriptionClient = new SubscriptionClient(webSocketURL, {
  reconnect: true
});

const subscriptionLink = new WebSocketLink(subscriptionClient);
const networkSubscriptions = (
  operation,
  variables,
  cacheConfig,
  observer
) =>
  execute(subscriptionLink, {
    query: operation.text,
    variables
  });

const network = Network.create(fetchQuery, networkSubscriptions);
const source = new RecordSource();
const store = new Store(source);

const RelayEnvironment = new Environment({
  network,
  store
});

export default RelayEnvironment;
