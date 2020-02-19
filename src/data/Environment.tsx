import {
  Environment,
  Network,
  RecordSource,
  Store,
  Variables,
  CacheConfig,
  UploadableMap
} from "relay-runtime";

const fetchQuery = async (
  operation: any,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null
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

const network = Network.create(fetchQuery);
const source = new RecordSource();
const store = new Store(source);


const RelayEnvironment = new Environment({
  network,
  store
});

export default RelayEnvironment;
