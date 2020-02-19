import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment";
import ReconnectingWebSocket from "reconnecting-websocket";
import { GraphQLTaggedNode, Variables } from "react-relay";
import {
  GraphQLSubscriptionConfig,
  requestSubscription,
  CacheConfig,
  Observer
} from "relay-runtime";

class SubscriptionHandler {
  subscriptions: Object;
  subscriptionEnvironment: RelayModernEnvironment;
  websocket: ReconnectingWebSocket;

  /**
   * The SubscriptionHandler constructor. Will setup a new websocket and bind
   * it to internal method to handle receving messages from the ws server.
   *
   * @param  {string} websocketUrl      - The WebSocket URL to listen to.
   * @param  {Object} webSocketSettings - The options object.
   *                                      See ReconnectingWebSocket.
   */
  constructor(websocketUrl: string, webSocketSettings: WebSocketSettings) {
    // All subscription hashes and objects will be stored in the
    // this.subscriptions attribute on the subscription handler.
    this.subscriptions = {};

    // Store the given environment internally to be reused when registering new
    // subscriptions. This is required as per the requestRelaySubscription spec
    // (method requestSubscription).
    this.subscriptionEnvironment = null;

    // Create a new WebSocket instance to be able to receive messages on the
    // given URL. Always opt for default protocol for the RWS, second arg.
    this.websocket = new ReconnectingWebSocket(
      websocketUrl,
      undefined, // Protocol.
      webSocketSettings
    );

    // Bind an internal method to handle incoming messages from the websocket.
    this.websocket.onmessage = this.receiveSubscriptionPayload;
  }

  /**
   * Method to attach the Relay Environment to the subscription handler.
   * This is required as the Network needs to be instantiated with the
   * SubscriptionHandler's methods, and the Environment needs the Network Layer.
   *
   * @param  {Object} environment - The apps environment.
   */
  attachEnvironment = (environment: RelayModernEnvironment) => {
    this.subscriptionEnvironment = environment;
  };

  /**
   * Generates a hash from a given query and variable pair. The method
   * used is a recreatable MD5 hash, which is used as a 'key' for the given
   * subscription. Using the MD5 hash we can identify what subscription is valid
   * based on the query/variable given from the server.
   *
   * @param  {string} query     - A string representation of the subscription.
   * @param  {Object} variables - An object containing all variables used
   *                              in the query.
   * @return {string}             The MD5 hash of the query and variables.
   */
  getHash = (query: string, variables: HashVariables) => {
    const queryString = query.replace(/\s+/gm, "");
    const variablesString = JSON.stringify(variables);
    const hash = md5(queryString + variablesString).toString();
    return hash;
  };

  /**
   * Method to be bound to the class websocket instance. The method will be
   * called each time the WebSocket receives a message on the subscribed URL
   * (see this.websocket options).
   *
   * @param  {string} message - The message received from the websocket.
   */
  receiveSubscriptionPayload = (message: ServerResponseMessage) => {
    const response: ServerResponseMessageParsed = JSON.parse(message.data);
    const { query, variables } = response.request;
    const hash = this.getHash(query, variables);

    // Fetch the subscription instance from the subscription handlers stored
    // subscriptions.
    const subscription = this.subscriptions[hash];

    if (subscription) {
      // Execute the onNext method with the received payload after validating
      // that the received hash is currently stored. If a diff occurs, meaning
      // no hash is stored for the received response, ignore the execution.
      subscription.observer.onNext(response.payload);
    } else {
      console.warn(`Received payload for unregistered hash: ${hash}`);
    }
  };

  /**
   * Method to generate new subscriptions that will be bound to the
   * SubscriptionHandler's environment and will be stored internally in the
   * instantiated handler object.
   *
   * @param {string} subscriptionQuery - The query to subscribe to. Needs to
   *                                     be a validated subscription type.
   * @param {Object} variables         - The variables for the passed query.
   * @param {Object} configs           - A subscription configuration. If
   *                                     override is required.
   */
  newSubscription = (
    subscriptionQuery: GraphQLTaggedNode,
    variables: Variables,
    configs: GraphQLSubscriptionConfig
  ) => {
    const config = configs || DEFAULT_CONFIG;

    requestSubscription(this.subscriptionEnvironment, {
      subscription: subscriptionQuery,
      variables: {},
      ...config
    });
  };

  setupSubscription = (
    config: ConcreteBatch,
    variables: Variables,
    cacheConfig: CacheConfig | null | undefined,
    observer: Observer
  ) => {
    const query = config.text;

    // Get the hash from the given subscriptionQuery and variables. Used to
    // identify this specific subscription.
    const hash = this.getHash(query, variables);

    // Store the newly created subscription request internally to be re-used
    // upon message receival or local data updates.
    this.subscriptions[hash] = { query, variables };

    const subscription = this.subscriptions[hash];
    subscription.observer = observer;

    // Temp fix to avoid WS Connection state.
    setTimeout(() => {
      this.websocket.send(JSON.stringify({ query, variables }));
    }, 100);
  };
}

const subscriptionHandler = new SubscriptionHandler(WS_URL, WS_OPTIONS);

export default subscriptionHandler;
