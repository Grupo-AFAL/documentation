(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from4, except, desc) => {
    if (from4 && typeof from4 === "object" || typeof from4 === "function") {
      for (let key of __getOwnPropNames(from4))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from4[key], enumerable: !(desc = __getOwnPropDesc(from4, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: self.console,
        WebSocket: self.WebSocket
      };
    }
  });

  // node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection_monitor.js
  var now, secondsSince, ConnectionMonitor, connection_monitor_default;
  var init_connection_monitor = __esm({
    "node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now = () => new Date().getTime();
      secondsSince = (time) => (now() - time) / 1e3;
      ConnectionMonitor = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordPing() {
          this.pingedAt = now();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(() => {
            this.reconnectIfStale();
            this.poll();
          }, this.getPollInterval());
        }
        getPollInterval() {
          const { staleThreshold, reconnectionBackoffRate } = this.constructor;
          const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
          const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
          const jitter = jitterMax * Math.random();
          return staleThreshold * 1e3 * backoff * (1 + jitter);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        get refreshedAt() {
          return this.pingedAt ? this.pingedAt : this.startedAt;
        }
        connectionIsStale() {
          return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(() => {
              if (this.connectionIsStale() || !this.connection.isOpen()) {
                logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                this.connection.reopen();
              }
            }, 200);
          }
        }
      };
      ConnectionMonitor.staleThreshold = 6;
      ConnectionMonitor.reconnectionBackoffRate = 0.15;
      connection_monitor_default = ConnectionMonitor;
    }
  });

  // node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection.js
  var message_types, protocols, supportedProtocols, indexOf, Connection, connection_default;
  var init_connection = __esm({
    "node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types, protocols } = internal_default);
      supportedProtocols = protocols.slice(0, protocols.length - 1);
      indexOf = [].indexOf;
      Connection = class {
        constructor(consumer2) {
          this.open = this.open.bind(this);
          this.consumer = consumer2;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${protocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error2) {
              logger_default.log("Failed to reopen WebSocket", error2);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        isProtocolSupported() {
          return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection.reopenDelay = 500;
      Connection.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
          switch (type) {
            case message_types.welcome:
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types.ping:
              return this.monitor.recordPing();
            case message_types.confirmation:
              this.subscriptions.confirmSubscription(identifier);
              return this.subscriptions.notify(identifier, "connected");
            case message_types.rejection:
              return this.subscriptions.reject(identifier);
            default:
              return this.subscriptions.notify(identifier, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection;
    }
  });

  // node_modules/@rails/actioncable/src/subscription.js
  var extend, Subscription;
  var init_subscription = __esm({
    "node_modules/@rails/actioncable/src/subscription.js"() {
      extend = function(object, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object[key] = value;
          }
        }
        return object;
      };
      Subscription = class {
        constructor(consumer2, params = {}, mixin) {
          this.consumer = consumer2;
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/subscription_guarantor.js
  var SubscriptionGuarantor, subscription_guarantor_default;
  var init_subscription_guarantor = __esm({
    "node_modules/@rails/actioncable/src/subscription_guarantor.js"() {
      init_logger();
      SubscriptionGuarantor = class {
        constructor(subscriptions) {
          this.subscriptions = subscriptions;
          this.pendingSubscriptions = [];
        }
        guarantee(subscription) {
          if (this.pendingSubscriptions.indexOf(subscription) == -1) {
            logger_default.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
            this.pendingSubscriptions.push(subscription);
          } else {
            logger_default.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
          }
          this.startGuaranteeing();
        }
        forget(subscription) {
          logger_default.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
          this.pendingSubscriptions = this.pendingSubscriptions.filter((s) => s !== subscription);
        }
        startGuaranteeing() {
          this.stopGuaranteeing();
          this.retrySubscribing();
        }
        stopGuaranteeing() {
          clearTimeout(this.retryTimeout);
        }
        retrySubscribing() {
          this.retryTimeout = setTimeout(() => {
            if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
              this.pendingSubscriptions.map((subscription) => {
                logger_default.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
                this.subscriptions.subscribe(subscription);
              });
            }
          }, 500);
        }
      };
      subscription_guarantor_default = SubscriptionGuarantor;
    }
  });

  // node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_subscription();
      init_subscription_guarantor();
      init_logger();
      Subscriptions = class {
        constructor(consumer2) {
          this.consumer = consumer2;
          this.guarantor = new subscription_guarantor_default(this);
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        }
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.subscribe(subscription);
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier) {
          return this.findAll(identifier).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.guarantor.forget(subscription);
          this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
          return subscription;
        }
        findAll(identifier) {
          return this.subscriptions.filter((s) => s.identifier === identifier);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.subscribe(subscription));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        subscribe(subscription) {
          if (this.sendCommand(subscription, "subscribe")) {
            this.guarantor.guarantee(subscription);
          }
        }
        confirmSubscription(identifier) {
          logger_default.log(`Subscription confirmed ${identifier}`);
          this.findAll(identifier).map((subscription) => this.guarantor.forget(subscription));
        }
        sendCommand(subscription, command2) {
          const { identifier } = subscription;
          return this.consumer.send({ command: command2, identifier });
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      const a = document.createElement("a");
      a.href = url;
      a.href = a.href;
      a.protocol = a.protocol.replace("http", "ws");
      return a.href;
    } else {
      return url;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url) {
          this._url = url;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    SubscriptionGuarantor: () => subscription_guarantor_default,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "node_modules/@rails/actioncable/src/index.js"() {
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_subscription();
      init_subscriptions();
      init_subscription_guarantor();
      init_adapters();
      init_logger();
    }
  });

  // node_modules/lodash.throttle/index.js
  var require_lodash = __commonJS({
    "node_modules/lodash.throttle/index.js"(exports2, module2) {
      var FUNC_ERROR_TEXT = "Expected a function";
      var NAN = 0 / 0;
      var symbolTag = "[object Symbol]";
      var reTrim = /^\s+|\s+$/g;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsOctal = /^0o[0-7]+$/i;
      var freeParseInt = parseInt;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var objectProto = Object.prototype;
      var objectToString = objectProto.toString;
      var nativeMax = Math.max;
      var nativeMin = Math.min;
      var now2 = function() {
        return root.Date.now();
      };
      function debounce3(func, wait, options) {
        var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject2(options)) {
          leading = !!options.leading;
          maxing = "maxWait" in options;
          maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
          var args = lastArgs, thisArg = lastThis;
          lastArgs = lastThis = void 0;
          lastInvokeTime = time;
          result2 = func.apply(thisArg, args);
          return result2;
        }
        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout(timerExpired, wait);
          return leading ? invokeFunc(time) : result2;
        }
        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result3 = wait - timeSinceLastCall;
          return maxing ? nativeMin(result3, maxWait - timeSinceLastInvoke) : result3;
        }
        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
          return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
          var time = now2();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          timerId = setTimeout(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
          timerId = void 0;
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = void 0;
          return result2;
        }
        function cancel() {
          if (timerId !== void 0) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = void 0;
        }
        function flush2() {
          return timerId === void 0 ? result2 : trailingEdge(now2());
        }
        function debounced() {
          var time = now2(), isInvoking = shouldInvoke(time);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;
          if (isInvoking) {
            if (timerId === void 0) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === void 0) {
            timerId = setTimeout(timerExpired, wait);
          }
          return result2;
        }
        debounced.cancel = cancel;
        debounced.flush = flush2;
        return debounced;
      }
      function throttle2(func, wait, options) {
        var leading = true, trailing = true;
        if (typeof func != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (isObject2(options)) {
          leading = "leading" in options ? !!options.leading : leading;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        return debounce3(func, wait, {
          "leading": leading,
          "maxWait": wait,
          "trailing": trailing
        });
      }
      function isObject2(value) {
        var type = typeof value;
        return !!value && (type == "object" || type == "function");
      }
      function isObjectLike(value) {
        return !!value && typeof value == "object";
      }
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
      }
      function toNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        if (isObject2(value)) {
          var other = typeof value.valueOf == "function" ? value.valueOf() : value;
          value = isObject2(other) ? other + "" : other;
        }
        if (typeof value != "string") {
          return value === 0 ? value : +value;
        }
        value = value.replace(reTrim, "");
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
      }
      module2.exports = throttle2;
    }
  });

  // node_modules/slim-select/dist/slimselect.min.mjs
  var slimselect_min_exports = {};
  __export(slimselect_min_exports, {
    default: () => slimselect_min_default
  });
  var exports, slimselect_min_default;
  var init_slimselect_min = __esm({
    "node_modules/slim-select/dist/slimselect.min.mjs"() {
      exports = {};
      !function(e, t) {
        typeof exports == "object" && typeof module == "object" ? module.exports = t() : typeof define == "function" && define.amd ? define([], t) : typeof exports == "object" ? exports.SlimSelect = t() : e.SlimSelect = t();
      }(window, function() {
        return n = {}, s.m = i = [function(e, t, i2) {
          "use strict";
          function n2(e2, t2) {
            t2 = t2 || { bubbles: false, cancelable: false, detail: void 0 };
            var i3 = document.createEvent("CustomEvent");
            return i3.initCustomEvent(e2, t2.bubbles, t2.cancelable, t2.detail), i3;
          }
          t.__esModule = true, t.kebabCase = t.highlight = t.isValueInArrayOfObjects = t.debounce = t.putContent = t.ensureElementInView = t.hasClassInTree = void 0, t.hasClassInTree = function(e2, t2) {
            function n3(e3, t3) {
              return t3 && e3 && e3.classList && e3.classList.contains(t3) ? e3 : null;
            }
            return n3(e2, t2) || function e3(t3, i3) {
              return t3 && t3 !== document ? n3(t3, i3) ? t3 : e3(t3.parentNode, i3) : null;
            }(e2, t2);
          }, t.ensureElementInView = function(e2, t2) {
            var i3 = e2.scrollTop + e2.offsetTop, n3 = i3 + e2.clientHeight, s2 = t2.offsetTop, t2 = s2 + t2.clientHeight;
            s2 < i3 ? e2.scrollTop -= i3 - s2 : n3 < t2 && (e2.scrollTop += t2 - n3);
          }, t.putContent = function(e2, t2, i3) {
            var n3 = e2.offsetHeight, s2 = e2.getBoundingClientRect(), e2 = i3 ? s2.top : s2.top - n3, n3 = i3 ? s2.bottom : s2.bottom + n3;
            return e2 <= 0 ? "below" : n3 >= window.innerHeight ? "above" : i3 ? t2 : "below";
          }, t.debounce = function(s2, a, o) {
            var l;
            return a === void 0 && (a = 100), o === void 0 && (o = false), function() {
              for (var e2 = [], t2 = 0; t2 < arguments.length; t2++)
                e2[t2] = arguments[t2];
              var i3 = self, n3 = o && !l;
              clearTimeout(l), l = setTimeout(function() {
                l = null, o || s2.apply(i3, e2);
              }, a), n3 && s2.apply(i3, e2);
            };
          }, t.isValueInArrayOfObjects = function(e2, t2, i3) {
            if (!Array.isArray(e2))
              return e2[t2] === i3;
            for (var n3 = 0, s2 = e2; n3 < s2.length; n3++) {
              var a = s2[n3];
              if (a && a[t2] && a[t2] === i3)
                return true;
            }
            return false;
          }, t.highlight = function(e2, t2, i3) {
            var n3 = e2, s2 = new RegExp("(" + t2.trim() + ")(?![^<]*>[^<>]*</)", "i");
            if (!e2.match(s2))
              return e2;
            var a = e2.match(s2).index, t2 = a + e2.match(s2)[0].toString().length, t2 = e2.substring(a, t2);
            return n3 = n3.replace(s2, '<mark class="'.concat(i3, '">').concat(t2, "</mark>"));
          }, t.kebabCase = function(e2) {
            var t2 = e2.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, function(e3) {
              return "-" + e3.toLowerCase();
            });
            return e2[0] === e2[0].toUpperCase() ? t2.substring(1) : t2;
          }, typeof (t = window).CustomEvent != "function" && (n2.prototype = t.Event.prototype, t.CustomEvent = n2);
        }, function(e, t, i2) {
          "use strict";
          t.__esModule = true, t.validateOption = t.validateData = t.Data = void 0;
          var n2 = (s2.prototype.newOption = function(e2) {
            return { id: e2.id || String(Math.floor(1e8 * Math.random())), value: e2.value || "", text: e2.text || "", innerHTML: e2.innerHTML || "", selected: e2.selected || false, display: e2.display === void 0 || e2.display, disabled: e2.disabled || false, placeholder: e2.placeholder || false, class: e2.class || void 0, data: e2.data || {}, mandatory: e2.mandatory || false };
          }, s2.prototype.add = function(e2) {
            this.data.push({ id: String(Math.floor(1e8 * Math.random())), value: e2.value, text: e2.text, innerHTML: "", selected: false, display: true, disabled: false, placeholder: false, class: void 0, mandatory: e2.mandatory, data: {} });
          }, s2.prototype.parseSelectData = function() {
            this.data = [];
            for (var e2 = 0, t2 = this.main.select.element.childNodes; e2 < t2.length; e2++) {
              var i3 = t2[e2];
              if (i3.nodeName === "OPTGROUP") {
                for (var n3 = { label: i3.label, options: [] }, s3 = 0, a = i3.childNodes; s3 < a.length; s3++) {
                  var o, l = a[s3];
                  l.nodeName === "OPTION" && (o = this.pullOptionData(l), n3.options.push(o), o.placeholder && o.text.trim() !== "" && (this.main.config.placeholderText = o.text));
                }
                this.data.push(n3);
              } else
                i3.nodeName === "OPTION" && (o = this.pullOptionData(i3), this.data.push(o), o.placeholder && o.text.trim() !== "" && (this.main.config.placeholderText = o.text));
            }
          }, s2.prototype.pullOptionData = function(e2) {
            return { id: !!e2.dataset && e2.dataset.id || String(Math.floor(1e8 * Math.random())), value: e2.value, text: e2.text, innerHTML: e2.innerHTML, selected: e2.selected, disabled: e2.disabled, placeholder: e2.dataset.placeholder === "true", class: e2.className, style: e2.style.cssText, data: e2.dataset, mandatory: !!e2.dataset && e2.dataset.mandatory === "true" };
          }, s2.prototype.setSelectedFromSelect = function() {
            if (this.main.config.isMultiple) {
              for (var e2 = [], t2 = 0, i3 = this.main.select.element.options; t2 < i3.length; t2++) {
                var n3 = i3[t2];
                !n3.selected || (n3 = this.getObjectFromData(n3.value, "value")) && n3.id && e2.push(n3.id);
              }
              this.setSelected(e2, "id");
            } else {
              var s3 = this.main.select.element;
              s3.selectedIndex !== -1 && (s3 = s3.options[s3.selectedIndex].value, this.setSelected(s3, "value"));
            }
          }, s2.prototype.setSelected = function(e2, t2) {
            t2 === void 0 && (t2 = "id");
            for (var i3 = 0, n3 = this.data; i3 < n3.length; i3++) {
              var s3 = n3[i3];
              if (s3.hasOwnProperty("label")) {
                if (s3.hasOwnProperty("options")) {
                  var a = s3.options;
                  if (a)
                    for (var o = 0, l = a; o < l.length; o++) {
                      var r2 = l[o];
                      r2.placeholder || (r2.selected = this.shouldBeSelected(r2, e2, t2));
                    }
                }
              } else
                s3.selected = this.shouldBeSelected(s3, e2, t2);
            }
          }, s2.prototype.shouldBeSelected = function(e2, t2, i3) {
            if (i3 === void 0 && (i3 = "id"), Array.isArray(t2))
              for (var n3 = 0, s3 = t2; n3 < s3.length; n3++) {
                var a = s3[n3];
                if (i3 in e2 && String(e2[i3]) === String(a))
                  return true;
              }
            else if (i3 in e2 && String(e2[i3]) === String(t2))
              return true;
            return false;
          }, s2.prototype.getSelected = function() {
            for (var e2 = { text: "", placeholder: this.main.config.placeholderText }, t2 = [], i3 = 0, n3 = this.data; i3 < n3.length; i3++) {
              var s3 = n3[i3];
              if (s3.hasOwnProperty("label")) {
                if (s3.hasOwnProperty("options")) {
                  var a = s3.options;
                  if (a)
                    for (var o = 0, l = a; o < l.length; o++) {
                      var r2 = l[o];
                      r2.selected && (this.main.config.isMultiple ? t2.push(r2) : e2 = r2);
                    }
                }
              } else
                s3.selected && (this.main.config.isMultiple ? t2.push(s3) : e2 = s3);
            }
            return this.main.config.isMultiple ? t2 : e2;
          }, s2.prototype.addToSelected = function(e2, t2) {
            if (t2 === void 0 && (t2 = "id"), this.main.config.isMultiple) {
              var i3 = [], n3 = this.getSelected();
              if (Array.isArray(n3))
                for (var s3 = 0, a = n3; s3 < a.length; s3++) {
                  var o = a[s3];
                  i3.push(o[t2]);
                }
              i3.push(e2), this.setSelected(i3, t2);
            }
          }, s2.prototype.removeFromSelected = function(e2, t2) {
            if (t2 === void 0 && (t2 = "id"), this.main.config.isMultiple) {
              for (var i3 = [], n3 = 0, s3 = this.getSelected(); n3 < s3.length; n3++) {
                var a = s3[n3];
                String(a[t2]) !== String(e2) && i3.push(a[t2]);
              }
              this.setSelected(i3, t2);
            }
          }, s2.prototype.onDataChange = function() {
            this.main.onChange && this.isOnChangeEnabled && this.main.onChange(JSON.parse(JSON.stringify(this.getSelected())));
          }, s2.prototype.getObjectFromData = function(e2, t2) {
            t2 === void 0 && (t2 = "id");
            for (var i3 = 0, n3 = this.data; i3 < n3.length; i3++) {
              var s3 = n3[i3];
              if (t2 in s3 && String(s3[t2]) === String(e2))
                return s3;
              if (s3.hasOwnProperty("options")) {
                if (s3.options)
                  for (var a = 0, o = s3.options; a < o.length; a++) {
                    var l = o[a];
                    if (String(l[t2]) === String(e2))
                      return l;
                  }
              }
            }
            return null;
          }, s2.prototype.search = function(n3) {
            var s3, e2;
            (this.searchValue = n3).trim() !== "" ? (s3 = this.main.config.searchFilter, e2 = this.data.slice(0), n3 = n3.trim(), e2 = e2.map(function(e3) {
              if (e3.hasOwnProperty("options")) {
                var t2 = e3, i3 = [];
                if ((i3 = t2.options ? t2.options.filter(function(e4) {
                  return s3(e4, n3);
                }) : i3).length !== 0) {
                  t2 = Object.assign({}, t2);
                  return t2.options = i3, t2;
                }
              }
              if (e3.hasOwnProperty("text") && s3(e3, n3))
                return e3;
              return null;
            }), this.filtered = e2.filter(function(e3) {
              return e3;
            })) : this.filtered = null;
          }, s2);
          function s2(e2) {
            this.contentOpen = false, this.contentPosition = "below", this.isOnChangeEnabled = true, this.main = e2.main, this.searchValue = "", this.data = [], this.filtered = null, this.parseSelectData(), this.setSelectedFromSelect();
          }
          function r(e2) {
            return e2.text !== void 0 || (console.error("Data object option must have at least have a text value. Check object: " + JSON.stringify(e2)), false);
          }
          t.Data = n2, t.validateData = function(e2) {
            if (!e2)
              return console.error("Data must be an array of objects"), false;
            for (var t2 = 0, i3 = 0, n3 = e2; i3 < n3.length; i3++) {
              var s3 = n3[i3];
              if (s3.hasOwnProperty("label")) {
                if (s3.hasOwnProperty("options")) {
                  var a = s3.options;
                  if (a)
                    for (var o = 0, l = a; o < l.length; o++)
                      r(l[o]) || t2++;
                }
              } else
                r(s3) || t2++;
            }
            return t2 === 0;
          }, t.validateOption = r;
        }, function(e, t, i2) {
          "use strict";
          t.__esModule = true;
          var n2 = i2(3), s2 = i2(4), a = i2(5), r = i2(1), o = i2(0), i2 = (l.prototype.validate = function(e2) {
            e2 = typeof e2.select == "string" ? document.querySelector(e2.select) : e2.select;
            if (!e2)
              throw new Error("Could not find select element");
            if (e2.tagName !== "SELECT")
              throw new Error("Element isnt of type select");
            return e2;
          }, l.prototype.selected = function() {
            if (this.config.isMultiple) {
              for (var e2 = [], t2 = 0, i3 = s3 = this.data.getSelected(); t2 < i3.length; t2++) {
                var n3 = i3[t2];
                e2.push(n3.value);
              }
              return e2;
            }
            var s3;
            return (s3 = this.data.getSelected()) ? s3.value : "";
          }, l.prototype.set = function(e2, t2, i3, n3) {
            t2 === void 0 && (t2 = "value"), i3 === void 0 && (i3 = true), n3 === void 0 && (n3 = true), this.config.isMultiple && !Array.isArray(e2) ? this.data.addToSelected(e2, t2) : this.data.setSelected(e2, t2), this.select.setValue(), this.data.onDataChange(), this.render(), (i3 = this.config.hideSelectedOption && this.config.isMultiple && this.data.getSelected().length === this.data.data.length ? true : i3) && this.close();
          }, l.prototype.setSelected = function(e2, t2, i3, n3) {
            this.set(e2, t2 = t2 === void 0 ? "value" : t2, i3 = i3 === void 0 ? true : i3, n3 = n3 === void 0 ? true : n3);
          }, l.prototype.setData = function(e2) {
            if ((0, r.validateData)(e2)) {
              for (var t2 = JSON.parse(JSON.stringify(e2)), i3 = this.data.getSelected(), n3 = 0; n3 < t2.length; n3++)
                t2[n3].value || t2[n3].placeholder || (t2[n3].value = t2[n3].text);
              if (this.config.isAjax && i3)
                if (this.config.isMultiple)
                  for (var s3 = 0, a2 = i3.reverse(); s3 < a2.length; s3++) {
                    var o2 = a2[s3];
                    t2.unshift(o2);
                  }
                else {
                  t2.unshift(i3);
                  for (n3 = 0; n3 < t2.length; n3++)
                    t2[n3].placeholder || t2[n3].value !== i3.value || t2[n3].text !== i3.text || t2.splice(n3, 1);
                  for (var l2 = false, n3 = 0; n3 < t2.length; n3++)
                    t2[n3].placeholder && (l2 = true);
                  l2 || t2.unshift({ text: "", placeholder: true });
                }
              this.select.create(t2), this.data.parseSelectData(), this.data.setSelectedFromSelect();
            } else
              console.error("Validation problem on: #" + this.select.element.id);
          }, l.prototype.addData = function(e2) {
            (0, r.validateData)([e2]) ? (this.data.add(this.data.newOption(e2)), this.select.create(this.data.data), this.data.parseSelectData(), this.data.setSelectedFromSelect(), this.render()) : console.error("Validation problem on: #" + this.select.element.id);
          }, l.prototype.open = function() {
            var e2, t2 = this;
            this.config.isEnabled && (this.data.contentOpen || this.config.hideSelectedOption && this.config.isMultiple && this.data.getSelected().length === this.data.data.length || (this.beforeOpen && this.beforeOpen(), this.config.isMultiple && this.slim.multiSelected ? this.slim.multiSelected.plus.classList.add("ss-cross") : this.slim.singleSelected && (this.slim.singleSelected.arrowIcon.arrow.classList.remove("arrow-down"), this.slim.singleSelected.arrowIcon.arrow.classList.add("arrow-up")), this.slim[this.config.isMultiple ? "multiSelected" : "singleSelected"].container.classList.add(this.data.contentPosition === "above" ? this.config.openAbove : this.config.openBelow), this.config.addToBody && (e2 = this.slim.container.getBoundingClientRect(), this.slim.content.style.top = e2.top + e2.height + window.scrollY + "px", this.slim.content.style.left = e2.left + window.scrollX + "px", this.slim.content.style.width = e2.width + "px"), this.slim.content.classList.add(this.config.open), this.config.showContent.toLowerCase() === "up" || this.config.showContent.toLowerCase() !== "down" && (0, o.putContent)(this.slim.content, this.data.contentPosition, this.data.contentOpen) === "above" ? this.moveContentAbove() : this.moveContentBelow(), this.config.isMultiple || (e2 = this.data.getSelected()) && (e2 = e2.id, (e2 = this.slim.list.querySelector('[data-id="' + e2 + '"]')) && (0, o.ensureElementInView)(this.slim.list, e2)), setTimeout(function() {
              t2.data.contentOpen = true, t2.config.searchFocus && t2.slim.search.input.focus(), t2.afterOpen && t2.afterOpen();
            }, this.config.timeoutDelay)));
          }, l.prototype.close = function() {
            var e2 = this;
            this.data.contentOpen && (this.beforeClose && this.beforeClose(), this.config.isMultiple && this.slim.multiSelected ? (this.slim.multiSelected.container.classList.remove(this.config.openAbove), this.slim.multiSelected.container.classList.remove(this.config.openBelow), this.slim.multiSelected.plus.classList.remove("ss-cross")) : this.slim.singleSelected && (this.slim.singleSelected.container.classList.remove(this.config.openAbove), this.slim.singleSelected.container.classList.remove(this.config.openBelow), this.slim.singleSelected.arrowIcon.arrow.classList.add("arrow-down"), this.slim.singleSelected.arrowIcon.arrow.classList.remove("arrow-up")), this.slim.content.classList.remove(this.config.open), this.data.contentOpen = false, this.search(""), setTimeout(function() {
              e2.slim.content.removeAttribute("style"), e2.data.contentPosition = "below", e2.config.isMultiple && e2.slim.multiSelected ? (e2.slim.multiSelected.container.classList.remove(e2.config.openAbove), e2.slim.multiSelected.container.classList.remove(e2.config.openBelow)) : e2.slim.singleSelected && (e2.slim.singleSelected.container.classList.remove(e2.config.openAbove), e2.slim.singleSelected.container.classList.remove(e2.config.openBelow)), e2.slim.search.input.blur(), e2.afterClose && e2.afterClose();
            }, this.config.timeoutDelay));
          }, l.prototype.moveContentAbove = function() {
            var e2 = 0;
            this.config.isMultiple && this.slim.multiSelected ? e2 = this.slim.multiSelected.container.offsetHeight : this.slim.singleSelected && (e2 = this.slim.singleSelected.container.offsetHeight);
            var t2 = e2 + this.slim.content.offsetHeight - 1;
            this.slim.content.style.margin = "-" + t2 + "px 0 0 0", this.slim.content.style.height = t2 - e2 + 1 + "px", this.slim.content.style.transformOrigin = "center bottom", this.data.contentPosition = "above", this.config.isMultiple && this.slim.multiSelected ? (this.slim.multiSelected.container.classList.remove(this.config.openBelow), this.slim.multiSelected.container.classList.add(this.config.openAbove)) : this.slim.singleSelected && (this.slim.singleSelected.container.classList.remove(this.config.openBelow), this.slim.singleSelected.container.classList.add(this.config.openAbove));
          }, l.prototype.moveContentBelow = function() {
            this.data.contentPosition = "below", this.config.isMultiple && this.slim.multiSelected ? (this.slim.multiSelected.container.classList.remove(this.config.openAbove), this.slim.multiSelected.container.classList.add(this.config.openBelow)) : this.slim.singleSelected && (this.slim.singleSelected.container.classList.remove(this.config.openAbove), this.slim.singleSelected.container.classList.add(this.config.openBelow));
          }, l.prototype.enable = function() {
            this.config.isEnabled = true, this.config.isMultiple && this.slim.multiSelected ? this.slim.multiSelected.container.classList.remove(this.config.disabled) : this.slim.singleSelected && this.slim.singleSelected.container.classList.remove(this.config.disabled), this.select.triggerMutationObserver = false, this.select.element.disabled = false, this.slim.search.input.disabled = false, this.select.triggerMutationObserver = true;
          }, l.prototype.disable = function() {
            this.config.isEnabled = false, this.config.isMultiple && this.slim.multiSelected ? this.slim.multiSelected.container.classList.add(this.config.disabled) : this.slim.singleSelected && this.slim.singleSelected.container.classList.add(this.config.disabled), this.select.triggerMutationObserver = false, this.select.element.disabled = true, this.slim.search.input.disabled = true, this.select.triggerMutationObserver = true;
          }, l.prototype.search = function(t2) {
            var i3;
            this.data.searchValue !== t2 && (this.slim.search.input.value = t2, this.config.isAjax ? ((i3 = this).config.isSearching = true, this.render(), this.ajax && this.ajax(t2, function(e2) {
              i3.config.isSearching = false, Array.isArray(e2) ? (e2.unshift({ text: "", placeholder: true }), i3.setData(e2), i3.data.search(t2), i3.render()) : typeof e2 == "string" ? i3.slim.options(e2) : i3.render();
            })) : (this.data.search(t2), this.render()));
          }, l.prototype.setSearchText = function(e2) {
            this.config.searchText = e2;
          }, l.prototype.render = function() {
            this.config.isMultiple ? this.slim.values() : (this.slim.placeholder(), this.slim.deselect()), this.slim.options();
          }, l.prototype.destroy = function(e2) {
            var t2 = (e2 = e2 === void 0 ? null : e2) ? document.querySelector("." + e2 + ".ss-main") : this.slim.container, i3 = e2 ? document.querySelector("[data-ssid=".concat(e2, "]")) : this.select.element;
            t2 && i3 && (document.removeEventListener("click", this.documentClick), this.config.showContent === "auto" && window.removeEventListener("scroll", this.windowScroll, false), i3.style.display = "", delete i3.dataset.ssid, i3.slim = null, t2.parentElement && t2.parentElement.removeChild(t2), !this.config.addToBody || (e2 = e2 ? document.querySelector("." + e2 + ".ss-content") : this.slim.content) && document.body.removeChild(e2));
          }, l);
          function l(e2) {
            var t2 = this;
            this.ajax = null, this.addable = null, this.beforeOnChange = null, this.onChange = null, this.beforeOpen = null, this.afterOpen = null, this.beforeClose = null, this.afterClose = null, this.windowScroll = (0, o.debounce)(function(e3) {
              t2.data.contentOpen && ((0, o.putContent)(t2.slim.content, t2.data.contentPosition, t2.data.contentOpen) === "above" ? t2.moveContentAbove() : t2.moveContentBelow());
            }), this.documentClick = function(e3) {
              e3.target && !(0, o.hasClassInTree)(e3.target, t2.config.id) && t2.close();
            };
            var i3 = this.validate(e2);
            i3.dataset.ssid && this.destroy(i3.dataset.ssid), e2.ajax && (this.ajax = e2.ajax), e2.addable && (this.addable = e2.addable), this.config = new n2.Config({ select: i3, isAjax: !!e2.ajax, showSearch: e2.showSearch, searchPlaceholder: e2.searchPlaceholder, searchText: e2.searchText, searchingText: e2.searchingText, searchFocus: e2.searchFocus, searchHighlight: e2.searchHighlight, searchFilter: e2.searchFilter, closeOnSelect: e2.closeOnSelect, showContent: e2.showContent, placeholderText: e2.placeholder, allowDeselect: e2.allowDeselect, allowDeselectOption: e2.allowDeselectOption, hideSelectedOption: e2.hideSelectedOption, deselectLabel: e2.deselectLabel, isEnabled: e2.isEnabled, valuesUseText: e2.valuesUseText, showOptionTooltips: e2.showOptionTooltips, selectByGroup: e2.selectByGroup, limit: e2.limit, timeoutDelay: e2.timeoutDelay, addToBody: e2.addToBody }), this.select = new s2.Select({ select: i3, main: this }), this.data = new r.Data({ main: this }), this.slim = new a.Slim({ main: this }), this.select.element.parentNode && this.select.element.parentNode.insertBefore(this.slim.container, this.select.element.nextSibling), e2.data ? this.setData(e2.data) : this.render(), document.addEventListener("click", this.documentClick), this.config.showContent === "auto" && window.addEventListener("scroll", this.windowScroll, false), e2.beforeOnChange && (this.beforeOnChange = e2.beforeOnChange), e2.onChange && (this.onChange = e2.onChange), e2.beforeOpen && (this.beforeOpen = e2.beforeOpen), e2.afterOpen && (this.afterOpen = e2.afterOpen), e2.beforeClose && (this.beforeClose = e2.beforeClose), e2.afterClose && (this.afterClose = e2.afterClose), this.config.isEnabled || this.disable();
          }
          t.default = i2;
        }, function(e, t, i2) {
          "use strict";
          t.__esModule = true, t.Config = void 0;
          var n2 = (s2.prototype.searchFilter = function(e2, t2) {
            return e2.text.toLowerCase().indexOf(t2.toLowerCase()) !== -1;
          }, s2);
          function s2(e2) {
            this.id = "", this.isMultiple = false, this.isAjax = false, this.isSearching = false, this.showSearch = true, this.searchFocus = true, this.searchHighlight = false, this.closeOnSelect = true, this.showContent = "auto", this.searchPlaceholder = "Search", this.searchText = "No Results", this.searchingText = "Searching...", this.placeholderText = "Select Value", this.allowDeselect = false, this.allowDeselectOption = false, this.hideSelectedOption = false, this.deselectLabel = "x", this.isEnabled = true, this.valuesUseText = false, this.showOptionTooltips = false, this.selectByGroup = false, this.limit = 0, this.timeoutDelay = 200, this.addToBody = false, this.main = "ss-main", this.singleSelected = "ss-single-selected", this.arrow = "ss-arrow", this.multiSelected = "ss-multi-selected", this.add = "ss-add", this.plus = "ss-plus", this.values = "ss-values", this.value = "ss-value", this.valueText = "ss-value-text", this.valueDelete = "ss-value-delete", this.content = "ss-content", this.open = "ss-open", this.openAbove = "ss-open-above", this.openBelow = "ss-open-below", this.search = "ss-search", this.searchHighlighter = "ss-search-highlight", this.addable = "ss-addable", this.list = "ss-list", this.optgroup = "ss-optgroup", this.optgroupLabel = "ss-optgroup-label", this.optgroupLabelSelectable = "ss-optgroup-label-selectable", this.option = "ss-option", this.optionSelected = "ss-option-selected", this.highlighted = "ss-highlighted", this.disabled = "ss-disabled", this.hide = "ss-hide", this.id = "ss-" + Math.floor(1e5 * Math.random()), this.style = e2.select.style.cssText, this.class = e2.select.className.split(" "), this.isMultiple = e2.select.multiple, this.isAjax = e2.isAjax, this.showSearch = e2.showSearch !== false, this.searchFocus = e2.searchFocus !== false, this.searchHighlight = e2.searchHighlight === true, this.closeOnSelect = e2.closeOnSelect !== false, e2.showContent && (this.showContent = e2.showContent), this.isEnabled = e2.isEnabled !== false, e2.searchPlaceholder && (this.searchPlaceholder = e2.searchPlaceholder), e2.searchText && (this.searchText = e2.searchText), e2.searchingText && (this.searchingText = e2.searchingText), e2.placeholderText && (this.placeholderText = e2.placeholderText), this.allowDeselect = e2.allowDeselect === true, this.allowDeselectOption = e2.allowDeselectOption === true, this.hideSelectedOption = e2.hideSelectedOption === true, e2.deselectLabel && (this.deselectLabel = e2.deselectLabel), e2.valuesUseText && (this.valuesUseText = e2.valuesUseText), e2.showOptionTooltips && (this.showOptionTooltips = e2.showOptionTooltips), e2.selectByGroup && (this.selectByGroup = e2.selectByGroup), e2.limit && (this.limit = e2.limit), e2.searchFilter && (this.searchFilter = e2.searchFilter), e2.timeoutDelay != null && (this.timeoutDelay = e2.timeoutDelay), this.addToBody = e2.addToBody === true;
          }
          t.Config = n2;
        }, function(e, t, i2) {
          "use strict";
          t.__esModule = true, t.Select = void 0;
          var n2 = i2(0), i2 = (s2.prototype.setValue = function() {
            if (this.main.data.getSelected()) {
              if (this.main.config.isMultiple)
                for (var e2 = this.main.data.getSelected(), t2 = 0, i3 = this.element.options; t2 < i3.length; t2++) {
                  var n3 = i3[t2];
                  n3.selected = false;
                  for (var s3 = 0, a = e2; s3 < a.length; s3++)
                    a[s3].value === n3.value && (n3.selected = true);
                }
              else {
                e2 = this.main.data.getSelected();
                this.element.value = e2 ? e2.value : "";
              }
              this.main.data.isOnChangeEnabled = false, this.element.dispatchEvent(new CustomEvent("change", { bubbles: true })), this.main.data.isOnChangeEnabled = true;
            }
          }, s2.prototype.addAttributes = function() {
            this.element.tabIndex = -1, this.element.style.display = "none", this.element.dataset.ssid = this.main.config.id, this.element.setAttribute("aria-hidden", "true");
          }, s2.prototype.addEventListeners = function() {
            var t2 = this;
            this.element.addEventListener("change", function(e2) {
              t2.main.data.setSelectedFromSelect(), t2.main.render();
            });
          }, s2.prototype.addMutationObserver = function() {
            var t2 = this;
            this.main.config.isAjax || (this.mutationObserver = new MutationObserver(function(e2) {
              t2.triggerMutationObserver && (t2.main.data.parseSelectData(), t2.main.data.setSelectedFromSelect(), t2.main.render(), e2.forEach(function(e3) {
                e3.attributeName === "class" && t2.main.slim.updateContainerDivClass(t2.main.slim.container);
              }));
            }), this.observeMutationObserver());
          }, s2.prototype.observeMutationObserver = function() {
            this.mutationObserver && this.mutationObserver.observe(this.element, { attributes: true, childList: true, characterData: true });
          }, s2.prototype.disconnectMutationObserver = function() {
            this.mutationObserver && this.mutationObserver.disconnect();
          }, s2.prototype.create = function(e2) {
            this.element.innerHTML = "";
            for (var t2 = 0, i3 = e2; t2 < i3.length; t2++) {
              var n3 = i3[t2];
              if (n3.hasOwnProperty("options")) {
                var s3 = n3, a = document.createElement("optgroup");
                if (a.label = s3.label, s3.options)
                  for (var o = 0, l = s3.options; o < l.length; o++) {
                    var r = l[o];
                    a.appendChild(this.createOption(r));
                  }
                this.element.appendChild(a);
              } else
                this.element.appendChild(this.createOption(n3));
            }
          }, s2.prototype.createOption = function(t2) {
            var i3 = document.createElement("option");
            return i3.value = t2.value !== "" ? t2.value : t2.text, i3.innerHTML = t2.innerHTML || t2.text, t2.selected && (i3.selected = t2.selected), t2.display === false && (i3.style.display = "none"), t2.disabled && (i3.disabled = true), t2.placeholder && i3.setAttribute("data-placeholder", "true"), t2.mandatory && i3.setAttribute("data-mandatory", "true"), t2.class && t2.class.split(" ").forEach(function(e2) {
              i3.classList.add(e2);
            }), t2.data && typeof t2.data == "object" && Object.keys(t2.data).forEach(function(e2) {
              i3.setAttribute("data-" + (0, n2.kebabCase)(e2), t2.data[e2]);
            }), i3;
          }, s2);
          function s2(e2) {
            this.triggerMutationObserver = true, this.element = e2.select, this.main = e2.main, this.element.disabled && (this.main.config.isEnabled = false), this.addAttributes(), this.addEventListeners(), this.mutationObserver = null, this.addMutationObserver(), this.element.slim = e2.main;
          }
          t.Select = i2;
        }, function(e, t, i2) {
          "use strict";
          t.__esModule = true, t.Slim = void 0;
          var n2 = i2(0), o = i2(1), i2 = (s2.prototype.containerDiv = function() {
            var e2 = document.createElement("div");
            return e2.style.cssText = this.main.config.style, this.updateContainerDivClass(e2), e2;
          }, s2.prototype.updateContainerDivClass = function(e2) {
            this.main.config.class = this.main.select.element.className.split(" "), e2.className = "", e2.classList.add(this.main.config.id), e2.classList.add(this.main.config.main);
            for (var t2 = 0, i3 = this.main.config.class; t2 < i3.length; t2++) {
              var n3 = i3[t2];
              n3.trim() !== "" && e2.classList.add(n3);
            }
          }, s2.prototype.singleSelectedDiv = function() {
            var t2 = this, e2 = document.createElement("div");
            e2.classList.add(this.main.config.singleSelected);
            var i3 = document.createElement("span");
            i3.classList.add("placeholder"), e2.appendChild(i3);
            var n3 = document.createElement("span");
            n3.innerHTML = this.main.config.deselectLabel, n3.classList.add("ss-deselect"), n3.onclick = function(e3) {
              e3.stopPropagation(), t2.main.config.isEnabled && t2.main.set("");
            }, e2.appendChild(n3);
            var s3 = document.createElement("span");
            s3.classList.add(this.main.config.arrow);
            var a = document.createElement("span");
            return a.classList.add("arrow-down"), s3.appendChild(a), e2.appendChild(s3), e2.onclick = function() {
              t2.main.config.isEnabled && (t2.main.data.contentOpen ? t2.main.close() : t2.main.open());
            }, { container: e2, placeholder: i3, deselect: n3, arrowIcon: { container: s3, arrow: a } };
          }, s2.prototype.placeholder = function() {
            var e2, t2 = this.main.data.getSelected();
            t2 === null || t2 && t2.placeholder ? ((e2 = document.createElement("span")).classList.add(this.main.config.disabled), e2.innerHTML = this.main.config.placeholderText, this.singleSelected && (this.singleSelected.placeholder.innerHTML = e2.outerHTML)) : (e2 = "", t2 && (e2 = t2.innerHTML && this.main.config.valuesUseText !== true ? t2.innerHTML : t2.text), this.singleSelected && (this.singleSelected.placeholder.innerHTML = t2 ? e2 : ""));
          }, s2.prototype.deselect = function() {
            this.singleSelected && (!this.main.config.allowDeselect || this.main.selected() === "" ? this.singleSelected.deselect.classList.add("ss-hide") : this.singleSelected.deselect.classList.remove("ss-hide"));
          }, s2.prototype.multiSelectedDiv = function() {
            var t2 = this, e2 = document.createElement("div");
            e2.classList.add(this.main.config.multiSelected);
            var i3 = document.createElement("div");
            i3.classList.add(this.main.config.values), e2.appendChild(i3);
            var n3 = document.createElement("div");
            n3.classList.add(this.main.config.add);
            var s3 = document.createElement("span");
            return s3.classList.add(this.main.config.plus), s3.onclick = function(e3) {
              t2.main.data.contentOpen && (t2.main.close(), e3.stopPropagation());
            }, n3.appendChild(s3), e2.appendChild(n3), e2.onclick = function(e3) {
              t2.main.config.isEnabled && (e3.target.classList.contains(t2.main.config.valueDelete) || (t2.main.data.contentOpen ? t2.main.close() : t2.main.open()));
            }, { container: e2, values: i3, add: n3, plus: s3 };
          }, s2.prototype.values = function() {
            if (this.multiSelected) {
              for (var e2 = this.multiSelected.values.childNodes, t2 = this.main.data.getSelected(), i3 = [], n3 = 0, s3 = e2; n3 < s3.length; n3++) {
                for (var a = s3[n3], o2 = true, l = 0, r = t2; l < r.length; l++) {
                  var c = r[l];
                  String(c.id) === String(a.dataset.id) && (o2 = false);
                }
                o2 && i3.push(a);
              }
              for (var d = 0, h = i3; d < h.length; d++) {
                var u = h[d];
                u.classList.add("ss-out"), this.multiSelected.values.removeChild(u);
              }
              for (var p, e2 = this.multiSelected.values.childNodes, c = 0; c < t2.length; c++) {
                o2 = false;
                for (var m = 0, f = e2; m < f.length; m++) {
                  a = f[m];
                  String(t2[c].id) === String(a.dataset.id) && (o2 = true);
                }
                o2 || (e2.length !== 0 && HTMLElement.prototype.insertAdjacentElement ? c === 0 ? this.multiSelected.values.insertBefore(this.valueDiv(t2[c]), e2[c]) : e2[c - 1].insertAdjacentElement("afterend", this.valueDiv(t2[c])) : this.multiSelected.values.appendChild(this.valueDiv(t2[c])));
              }
              t2.length === 0 && ((p = document.createElement("span")).classList.add(this.main.config.disabled), p.innerHTML = this.main.config.placeholderText, this.multiSelected.values.innerHTML = p.outerHTML);
            }
          }, s2.prototype.valueDiv = function(s3) {
            var a = this, e2 = document.createElement("div");
            e2.classList.add(this.main.config.value), e2.dataset.id = s3.id;
            var t2 = document.createElement("span");
            return t2.classList.add(this.main.config.valueText), t2.innerHTML = s3.innerHTML && this.main.config.valuesUseText !== true ? s3.innerHTML : s3.text, e2.appendChild(t2), s3.mandatory || ((t2 = document.createElement("span")).classList.add(this.main.config.valueDelete), t2.innerHTML = this.main.config.deselectLabel, t2.onclick = function(e3) {
              e3.preventDefault(), e3.stopPropagation();
              var t3 = false;
              if (a.main.beforeOnChange || (t3 = true), a.main.beforeOnChange) {
                for (var e3 = a.main.data.getSelected(), i3 = JSON.parse(JSON.stringify(e3)), n3 = 0; n3 < i3.length; n3++)
                  i3[n3].id === s3.id && i3.splice(n3, 1);
                a.main.beforeOnChange(i3) !== false && (t3 = true);
              }
              t3 && (a.main.data.removeFromSelected(s3.id, "id"), a.main.render(), a.main.select.setValue(), a.main.data.onDataChange());
            }, e2.appendChild(t2)), e2;
          }, s2.prototype.contentDiv = function() {
            var e2 = document.createElement("div");
            return e2.classList.add(this.main.config.content), e2;
          }, s2.prototype.searchDiv = function() {
            var n3 = this, e2 = document.createElement("div"), s3 = document.createElement("input"), a = document.createElement("div");
            e2.classList.add(this.main.config.search);
            var t2 = { container: e2, input: s3 };
            return this.main.config.showSearch || (e2.classList.add(this.main.config.hide), s3.readOnly = true), s3.type = "search", s3.placeholder = this.main.config.searchPlaceholder, s3.tabIndex = 0, s3.setAttribute("aria-label", this.main.config.searchPlaceholder), s3.setAttribute("autocapitalize", "off"), s3.setAttribute("autocomplete", "off"), s3.setAttribute("autocorrect", "off"), s3.onclick = function(e3) {
              setTimeout(function() {
                e3.target.value === "" && n3.main.search("");
              }, 10);
            }, s3.onkeydown = function(e3) {
              e3.key === "ArrowUp" ? (n3.main.open(), n3.highlightUp(), e3.preventDefault()) : e3.key === "ArrowDown" ? (n3.main.open(), n3.highlightDown(), e3.preventDefault()) : e3.key === "Tab" ? n3.main.data.contentOpen ? n3.main.close() : setTimeout(function() {
                n3.main.close();
              }, n3.main.config.timeoutDelay) : e3.key === "Enter" && e3.preventDefault();
            }, s3.onkeyup = function(e3) {
              var t3 = e3.target;
              if (e3.key === "Enter") {
                if (n3.main.addable && e3.ctrlKey)
                  return a.click(), e3.preventDefault(), void e3.stopPropagation();
                var i3 = n3.list.querySelector("." + n3.main.config.highlighted);
                i3 && i3.click();
              } else
                e3.key === "ArrowUp" || e3.key === "ArrowDown" || (e3.key === "Escape" ? n3.main.close() : n3.main.config.showSearch && n3.main.data.contentOpen ? n3.main.search(t3.value) : s3.value = "");
              e3.preventDefault(), e3.stopPropagation();
            }, s3.onfocus = function() {
              n3.main.open();
            }, e2.appendChild(s3), this.main.addable && (a.classList.add(this.main.config.addable), a.innerHTML = "+", a.onclick = function(e3) {
              var t3;
              n3.main.addable && (e3.preventDefault(), e3.stopPropagation(), (e3 = n3.search.input.value).trim() !== "" ? (e3 = n3.main.addable(e3), t3 = "", e3 && (typeof e3 == "object" ? (0, o.validateOption)(e3) && (n3.main.addData(e3), t3 = e3.value || e3.text) : (n3.main.addData(n3.main.data.newOption({ text: e3, value: e3 })), t3 = e3), n3.main.search(""), setTimeout(function() {
                n3.main.set(t3, "value", false, false);
              }, 100), n3.main.config.closeOnSelect && setTimeout(function() {
                n3.main.close();
              }, 100))) : n3.search.input.focus());
            }, e2.appendChild(a), t2.addable = a), t2;
          }, s2.prototype.highlightUp = function() {
            var e2 = this.list.querySelector("." + this.main.config.highlighted), t2 = null;
            if (e2)
              for (t2 = e2.previousSibling; t2 !== null && t2.classList.contains(this.main.config.disabled); )
                t2 = t2.previousSibling;
            else
              var i3 = this.list.querySelectorAll("." + this.main.config.option + ":not(." + this.main.config.disabled + ")"), t2 = i3[i3.length - 1];
            (t2 = t2 && t2.classList.contains(this.main.config.optgroupLabel) ? null : t2) !== null || (i3 = e2.parentNode).classList.contains(this.main.config.optgroup) && (!i3.previousSibling || (i3 = i3.previousSibling.querySelectorAll("." + this.main.config.option + ":not(." + this.main.config.disabled + ")")).length && (t2 = i3[i3.length - 1])), t2 && (e2 && e2.classList.remove(this.main.config.highlighted), t2.classList.add(this.main.config.highlighted), (0, n2.ensureElementInView)(this.list, t2));
          }, s2.prototype.highlightDown = function() {
            var e2, t2 = this.list.querySelector("." + this.main.config.highlighted), i3 = null;
            if (t2)
              for (i3 = t2.nextSibling; i3 !== null && i3.classList.contains(this.main.config.disabled); )
                i3 = i3.nextSibling;
            else
              i3 = this.list.querySelector("." + this.main.config.option + ":not(." + this.main.config.disabled + ")");
            i3 !== null || t2 === null || (e2 = t2.parentNode).classList.contains(this.main.config.optgroup) && e2.nextSibling && (i3 = e2.nextSibling.querySelector("." + this.main.config.option + ":not(." + this.main.config.disabled + ")")), i3 && (t2 && t2.classList.remove(this.main.config.highlighted), i3.classList.add(this.main.config.highlighted), (0, n2.ensureElementInView)(this.list, i3));
          }, s2.prototype.listDiv = function() {
            var e2 = document.createElement("div");
            return e2.classList.add(this.main.config.list), e2.setAttribute("role", "listbox"), e2;
          }, s2.prototype.options = function(e2) {
            e2 === void 0 && (e2 = "");
            var t2 = this.main.data.filtered || this.main.data.data;
            if ((this.list.innerHTML = "") !== e2)
              return (i3 = document.createElement("div")).classList.add(this.main.config.option), i3.classList.add(this.main.config.disabled), i3.innerHTML = e2, void this.list.appendChild(i3);
            if (this.main.config.isAjax && this.main.config.isSearching)
              return (i3 = document.createElement("div")).classList.add(this.main.config.option), i3.classList.add(this.main.config.disabled), i3.innerHTML = this.main.config.searchingText, void this.list.appendChild(i3);
            if (t2.length === 0) {
              var i3 = document.createElement("div");
              return i3.classList.add(this.main.config.option), i3.classList.add(this.main.config.disabled), i3.innerHTML = this.main.config.searchText, void this.list.appendChild(i3);
            }
            for (var r = this, n3 = 0, s3 = t2; n3 < s3.length; n3++)
              !function(e3) {
                if (e3.hasOwnProperty("label")) {
                  var t3 = e3, s4 = document.createElement("div");
                  s4.classList.add(r.main.config.optgroup);
                  var i4 = document.createElement("div");
                  i4.classList.add(r.main.config.optgroupLabel), r.main.config.selectByGroup && r.main.config.isMultiple && i4.classList.add(r.main.config.optgroupLabelSelectable), i4.innerHTML = t3.label, s4.appendChild(i4);
                  t3 = t3.options;
                  if (t3) {
                    for (var a, n4 = 0, o2 = t3; n4 < o2.length; n4++) {
                      var l = o2[n4];
                      s4.appendChild(r.option(l));
                    }
                    r.main.config.selectByGroup && r.main.config.isMultiple && (a = r, i4.addEventListener("click", function(e4) {
                      e4.preventDefault(), e4.stopPropagation();
                      for (var t4 = 0, i5 = s4.children; t4 < i5.length; t4++) {
                        var n5 = i5[t4];
                        n5.className.indexOf(a.main.config.option) !== -1 && n5.click();
                      }
                    }));
                  }
                  r.list.appendChild(s4);
                } else
                  r.list.appendChild(r.option(e3));
              }(s3[n3]);
          }, s2.prototype.option = function(o2) {
            if (o2.placeholder) {
              var e2 = document.createElement("div");
              return e2.classList.add(this.main.config.option), e2.classList.add(this.main.config.hide), e2;
            }
            var t2 = document.createElement("div");
            t2.classList.add(this.main.config.option), t2.setAttribute("role", "option"), o2.class && o2.class.split(" ").forEach(function(e3) {
              t2.classList.add(e3);
            }), o2.style && (t2.style.cssText = o2.style);
            var l = this.main.data.getSelected();
            t2.dataset.id = o2.id, this.main.config.searchHighlight && this.main.slim && o2.innerHTML && this.main.slim.search.input.value.trim() !== "" ? t2.innerHTML = (0, n2.highlight)(o2.innerHTML, this.main.slim.search.input.value, this.main.config.searchHighlighter) : o2.innerHTML && (t2.innerHTML = o2.innerHTML), this.main.config.showOptionTooltips && t2.textContent && t2.setAttribute("title", t2.textContent);
            var r = this;
            t2.addEventListener("click", function(e3) {
              e3.preventDefault(), e3.stopPropagation();
              var t3 = this.dataset.id;
              if (o2.selected === true && r.main.config.allowDeselectOption) {
                var i3 = false;
                if (r.main.beforeOnChange && r.main.config.isMultiple || (i3 = true), r.main.beforeOnChange && r.main.config.isMultiple) {
                  for (var n3 = r.main.data.getSelected(), s3 = JSON.parse(JSON.stringify(n3)), a = 0; a < s3.length; a++)
                    s3[a].id === t3 && s3.splice(a, 1);
                  r.main.beforeOnChange(s3) !== false && (i3 = true);
                }
                i3 && (r.main.config.isMultiple ? (r.main.data.removeFromSelected(t3, "id"), r.main.render(), r.main.select.setValue(), r.main.data.onDataChange()) : r.main.set(""));
              } else
                o2.disabled || o2.selected || r.main.config.limit && Array.isArray(l) && r.main.config.limit <= l.length || (r.main.beforeOnChange ? (n3 = void 0, (i3 = JSON.parse(JSON.stringify(r.main.data.getObjectFromData(t3)))).selected = true, r.main.config.isMultiple ? (n3 = JSON.parse(JSON.stringify(l))).push(i3) : n3 = JSON.parse(JSON.stringify(i3)), r.main.beforeOnChange(n3) !== false && r.main.set(t3, "id", r.main.config.closeOnSelect)) : r.main.set(t3, "id", r.main.config.closeOnSelect));
            });
            e2 = l && (0, n2.isValueInArrayOfObjects)(l, "id", o2.id);
            return (o2.disabled || e2) && (t2.onclick = null, r.main.config.allowDeselectOption || t2.classList.add(this.main.config.disabled), r.main.config.hideSelectedOption && t2.classList.add(this.main.config.hide)), e2 ? t2.classList.add(this.main.config.optionSelected) : t2.classList.remove(this.main.config.optionSelected), t2;
          }, s2);
          function s2(e2) {
            this.main = e2.main, this.container = this.containerDiv(), this.content = this.contentDiv(), this.search = this.searchDiv(), this.list = this.listDiv(), this.options(), this.singleSelected = null, this.multiSelected = null, this.main.config.isMultiple ? (this.multiSelected = this.multiSelectedDiv(), this.multiSelected && this.container.appendChild(this.multiSelected.container)) : (this.singleSelected = this.singleSelectedDiv(), this.container.appendChild(this.singleSelected.container)), this.main.config.addToBody ? (this.content.classList.add(this.main.config.id), document.body.appendChild(this.content)) : this.container.appendChild(this.content), this.content.appendChild(this.search.container), this.content.appendChild(this.list);
          }
          t.Slim = i2;
        }], s.c = n, s.d = function(e, t, i2) {
          s.o(e, t) || Object.defineProperty(e, t, { enumerable: true, get: i2 });
        }, s.r = function(e) {
          typeof Symbol != "undefined" && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: true });
        }, s.t = function(t, e) {
          if (1 & e && (t = s(t)), 8 & e)
            return t;
          if (4 & e && typeof t == "object" && t && t.__esModule)
            return t;
          var i2 = /* @__PURE__ */ Object.create(null);
          if (s.r(i2), Object.defineProperty(i2, "default", { enumerable: true, value: t }), 2 & e && typeof t != "string")
            for (var n2 in t)
              s.d(i2, n2, function(e2) {
                return t[e2];
              }.bind(null, n2));
          return i2;
        }, s.n = function(e) {
          var t = e && e.__esModule ? function() {
            return e.default;
          } : function() {
            return e;
          };
          return s.d(t, "a", t), t;
        }, s.o = function(e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        }, s.p = "", s(s.s = 2).default;
        function s(e) {
          if (n[e])
            return n[e].exports;
          var t = n[e] = { i: e, l: false, exports: {} };
          return i[e].call(t.exports, t, t.exports, s), t.l = true, t.exports;
        }
        var i, n;
      });
      slimselect_min_default = exports.SlimSelect;
    }
  });

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  (function() {
    if (window.Reflect === void 0 || window.customElements === void 0 || window.customElements.polyfillWrapFlushCallback) {
      return;
    }
    const BuiltInHTMLElement = HTMLElement;
    const wrapperForTheName = {
      "HTMLElement": function HTMLElement2() {
        return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
      }
    };
    window.HTMLElement = wrapperForTheName["HTMLElement"];
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
  })();
  (function(prototype) {
    if (typeof prototype.requestSubmit == "function")
      return;
    prototype.requestSubmit = function(submitter) {
      if (submitter) {
        validateSubmitter(submitter, this);
        submitter.click();
      } else {
        submitter = document.createElement("input");
        submitter.type = "submit";
        submitter.hidden = true;
        this.appendChild(submitter);
        submitter.click();
        this.removeChild(submitter);
      }
    };
    function validateSubmitter(submitter, form) {
      submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
      submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
      submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
    }
    function raise(errorConstructor, message, name) {
      throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
    }
  })(HTMLFormElement.prototype);
  var submittersByForm = /* @__PURE__ */ new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return (candidate === null || candidate === void 0 ? void 0 : candidate.type) == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
      submittersByForm.set(submitter.form, submitter);
    }
  }
  (function() {
    if ("submitter" in Event.prototype)
      return;
    let prototype;
    if ("SubmitEvent" in window && /Apple Computer/.test(navigator.vendor)) {
      prototype = window.SubmitEvent.prototype;
    } else if ("SubmitEvent" in window) {
      return;
    } else {
      prototype = window.Event.prototype;
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle;
  (function(FrameLoadingStyle2) {
    FrameLoadingStyle2["eager"] = "eager";
    FrameLoadingStyle2["lazy"] = "lazy";
  })(FrameLoadingStyle || (FrameLoadingStyle = {}));
  var FrameElement = class extends HTMLElement {
    constructor() {
      super();
      this.loaded = Promise.resolve();
      this.delegate = new FrameElement.delegateConstructor(this);
    }
    static get observedAttributes() {
      return ["disabled", "loading", "src"];
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      const { src } = this;
      this.src = null;
      this.src = src;
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else {
        this.delegate.disabledChanged();
      }
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    get complete() {
      return !this.delegate.isLoading;
    }
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    get isPreview() {
      var _a, _b;
      return (_b = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style2) {
    switch (style2.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
      return url.hash.slice(1);
    } else if (anchorMatch = url.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction(form, submitter) {
    const action = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formaction")) || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isHTML(url) {
    return !!getExtension(url).match(/^(?:|\.(?:htm|html|xhtml))$/);
  }
  function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && isHTML(location2);
  }
  function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
  }
  function toCacheKey(url) {
    return getRequestURL(url);
  }
  function urlsAreEqual(left2, right2) {
    return expandURL(left2).href == expandURL(right2).href;
  }
  function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
  }
  function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, { cancelable, bubbles: true, detail });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function nextAnimationFrame() {
    return new Promise((resolve7) => requestAnimationFrame(() => resolve7()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve7) => setTimeout(() => resolve7(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result2, string, i) => {
      const value = values[i] == void 0 ? "" : values[i];
      return result2 + string + value;
    }, "");
  }
  function uuid() {
    return Array.apply(null, { length: 36 }).map((_, i) => {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        return "-";
      } else if (i == 14) {
        return "4";
      } else if (i == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element === null || element === void 0 ? void 0 : element.getAttribute(attributeName))) {
      if (typeof value == "string")
        return value;
    }
    return null;
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  var FetchMethod;
  (function(FetchMethod2) {
    FetchMethod2[FetchMethod2["get"] = 0] = "get";
    FetchMethod2[FetchMethod2["post"] = 1] = "post";
    FetchMethod2[FetchMethod2["put"] = 2] = "put";
    FetchMethod2[FetchMethod2["patch"] = 3] = "patch";
    FetchMethod2[FetchMethod2["delete"] = 4] = "delete";
  })(FetchMethod || (FetchMethod = {}));
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchRequest = class {
    constructor(delegate, method, location2, body = new URLSearchParams(), target = null) {
      this.abortController = new AbortController();
      this.resolveRequestPromise = (value) => {
      };
      this.delegate = delegate;
      this.method = method;
      this.headers = this.defaultHeaders;
      this.body = body;
      this.url = location2;
      this.target = target;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      var _a, _b;
      const { fetchOptions } = this;
      (_b = (_a = this.delegate).prepareHeadersForRequest) === null || _b === void 0 ? void 0 : _b.call(_a, this.headers, this);
      await this.allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        const response = await fetch(this.url.href, fetchOptions);
        return await this.receive(response);
      } catch (error2) {
        if (error2.name !== "AbortError") {
          this.delegate.requestErrored(this, error2);
          throw error2;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", { cancelable: true, detail: { fetchResponse }, target: this.target });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get fetchOptions() {
      var _a;
      return {
        method: FetchMethod[this.method].toUpperCase(),
        credentials: "same-origin",
        headers: this.headers,
        redirect: "follow",
        body: this.isIdempotent ? null : this.body,
        signal: this.abortSignal,
        referrer: (_a = this.delegate.referrer) === null || _a === void 0 ? void 0 : _a.href
      };
    }
    get defaultHeaders() {
      return {
        "Accept": "text/html, application/xhtml+xml"
      };
    }
    get isIdempotent() {
      return this.method == FetchMethod.get;
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    async allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve7) => this.resolveRequestPromise = resolve7);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.resolveRequestPromise
        },
        target: this.target
      });
      if (event.defaultPrevented)
        await requestInterception;
    }
  };
  var AppearanceObserver = class {
    constructor(delegate, element) {
      this.started = false;
      this.intersect = (entries) => {
        const lastEntry = entries.slice(-1)[0];
        if (lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.isIntersecting) {
          this.delegate.elementAppearedInViewport(this.element);
        }
      };
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
  };
  var StreamMessage = class {
    constructor(html) {
      this.templateElement = document.createElement("template");
      this.templateElement.innerHTML = html;
    }
    static wrap(message) {
      if (typeof message == "string") {
        return new this(message);
      } else {
        return message;
      }
    }
    get fragment() {
      const fragment = document.createDocumentFragment();
      for (const element of this.foreignElements) {
        fragment.appendChild(document.importNode(element, true));
      }
      return fragment;
    }
    get foreignElements() {
      return this.templateChildren.reduce((streamElements, child3) => {
        if (child3.tagName.toLowerCase() == "turbo-stream") {
          return [...streamElements, child3];
        } else {
          return streamElements;
        }
      }, []);
    }
    get templateChildren() {
      return Array.from(this.templateElement.content.children);
    }
  };
  StreamMessage.contentType = "text/vnd.turbo-stream.html";
  var FormSubmissionState;
  (function(FormSubmissionState2) {
    FormSubmissionState2[FormSubmissionState2["initialized"] = 0] = "initialized";
    FormSubmissionState2[FormSubmissionState2["requesting"] = 1] = "requesting";
    FormSubmissionState2[FormSubmissionState2["waiting"] = 2] = "waiting";
    FormSubmissionState2[FormSubmissionState2["receiving"] = 3] = "receiving";
    FormSubmissionState2[FormSubmissionState2["stopping"] = 4] = "stopping";
    FormSubmissionState2[FormSubmissionState2["stopped"] = 5] = "stopped";
  })(FormSubmissionState || (FormSubmissionState = {}));
  var FormEnctype;
  (function(FormEnctype2) {
    FormEnctype2["urlEncoded"] = "application/x-www-form-urlencoded";
    FormEnctype2["multipart"] = "multipart/form-data";
    FormEnctype2["plain"] = "text/plain";
  })(FormEnctype || (FormEnctype = {}));
  function formEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FormEnctype.multipart:
        return FormEnctype.multipart;
      case FormEnctype.plain:
        return FormEnctype.plain;
      default:
        return FormEnctype.urlEncoded;
    }
  }
  var FormSubmission = class {
    constructor(delegate, formElement, submitter, mustRedirect = false) {
      this.state = FormSubmissionState.initialized;
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter;
      this.formData = buildFormData(formElement, submitter);
      this.location = expandURL(this.action);
      if (this.method == FetchMethod.get) {
        mergeFormDataEntries(this.location, [...this.body.entries()]);
      }
      this.fetchRequest = new FetchRequest(this, this.method, this.location, this.body, this.formElement);
      this.mustRedirect = mustRedirect;
    }
    static confirmMethod(message, element) {
      return confirm(message);
    }
    get method() {
      var _a;
      const method = ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formmethod")) || this.formElement.getAttribute("method") || "";
      return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
    }
    get action() {
      var _a;
      const formElementAction = typeof this.formElement.action === "string" ? this.formElement.action : null;
      return ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formaction")) || this.formElement.getAttribute("action") || formElementAction || "";
    }
    get body() {
      if (this.enctype == FormEnctype.urlEncoded || this.method == FetchMethod.get) {
        return new URLSearchParams(this.stringFormData);
      } else {
        return this.formData;
      }
    }
    get enctype() {
      var _a;
      return formEnctypeFromString(((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formenctype")) || this.formElement.enctype);
    }
    get isIdempotent() {
      return this.fetchRequest.isIdempotent;
    }
    get stringFormData() {
      return [...this.formData].reduce((entries, [name, value]) => {
        return entries.concat(typeof value == "string" ? [[name, value]] : []);
      }, []);
    }
    get confirmationMessage() {
      return this.formElement.getAttribute("data-turbo-confirm");
    }
    get needsConfirmation() {
      return this.confirmationMessage !== null;
    }
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      if (this.needsConfirmation) {
        const answer = FormSubmission.confirmMethod(this.confirmationMessage, this.formElement);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    prepareHeadersForRequest(headers, request) {
      if (!request.isIdempotent) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          headers["X-CSRF-Token"] = token;
        }
        headers["Accept"] = [StreamMessage.contentType, headers["Accept"]].join(", ");
      }
    }
    requestStarted(request) {
      var _a;
      this.state = FormSubmissionState.waiting;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.setAttribute("disabled", "");
      dispatch("turbo:submit-start", { target: this.formElement, detail: { formSubmission: this } });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
      } else if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
        const error2 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error2);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error2) {
      this.result = { success: false, error: error2 };
      this.delegate.formSubmissionErrored(this, error2);
    }
    requestFinished(request) {
      var _a;
      this.state = FormSubmissionState.stopped;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
      dispatch("turbo:submit-end", { target: this.formElement, detail: Object.assign({ formSubmission: this }, this.result) });
      this.delegate.formSubmissionFinished(this);
    }
    requestMustRedirect(request) {
      return !request.isIdempotent && this.mustRedirect;
    }
  };
  function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("name");
    const value = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("value");
    if (name && value != null && formData.get(name) != value) {
      formData.append(name, value);
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function getMetaContent(name) {
    const element = document.querySelector(`meta[name="${name}"]`);
    return element && element.content;
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function mergeFormDataEntries(url, entries) {
    const searchParams = new URLSearchParams();
    for (const [name, value] of entries) {
      if (value instanceof File)
        continue;
      searchParams.append(name, value);
    }
    url.search = searchParams.toString();
    return url;
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      return this.element.querySelector("[autofocus]");
    }
    get permanentElements() {
      return [...this.element.querySelectorAll("[id][data-turbo-permanent]")];
    }
    getPermanentElementById(id) {
      return this.element.querySelector(`#${id}[data-turbo-permanent]`);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id);
        if (newPermanentElement) {
          permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  var FormInterceptor = class {
    constructor(delegate, element) {
      this.submitBubbled = (event) => {
        const form = event.target;
        if (!event.defaultPrevented && form instanceof HTMLFormElement && form.closest("turbo-frame, html") == this.element) {
          const submitter = event.submitter || void 0;
          const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.method;
          if (method != "dialog" && this.delegate.shouldInterceptFormSubmission(form, submitter)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.delegate.formSubmissionIntercepted(form, submitter);
          }
        }
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("submit", this.submitBubbled);
    }
    stop() {
      this.element.removeEventListener("submit", this.submitBubbled);
    }
  };
  var View = class {
    constructor(delegate, element) {
      this.resolveRenderPromise = (value) => {
      };
      this.resolveInterceptionPromise = (value) => {
      };
      this.delegate = delegate;
      this.element = element;
    }
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
        this.focusElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y }) {
      this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    async render(renderer) {
      const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve7) => this.resolveRenderPromise = resolve7);
          this.renderer = renderer;
          this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve7) => this.resolveInterceptionPromise = resolve7);
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, this.resolveInterceptionPromise);
          if (!immediateRender)
            await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else {
        this.invalidate();
      }
    }
    invalidate() {
      this.delegate.viewInvalidated();
    }
    prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    invalidate() {
      this.element.innerHTML = "";
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.clickBubbled = (event) => {
        if (this.respondsToEventTarget(event.target)) {
          this.clickEvent = event;
        } else {
          delete this.clickEvent;
        }
      };
      this.linkClicked = (event) => {
        if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
          if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url)) {
            this.clickEvent.preventDefault();
            event.preventDefault();
            this.delegate.linkClickIntercepted(event.target, event.detail.url);
          }
        }
        delete this.clickEvent;
      };
      this.willVisit = () => {
        delete this.clickEvent;
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    respondsToEventTarget(target) {
      const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      return element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var Bardo = class {
    constructor(permanentElementMap) {
      this.permanentElementMap = permanentElementMap;
    }
    static preservingPermanentElements(permanentElementMap, callback) {
      const bardo = new this(permanentElementMap);
      bardo.enter();
      callback();
      bardo.leave();
    }
    enter() {
      for (const id in this.permanentElementMap) {
        const [, newPermanentElement] = this.permanentElementMap[id];
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder === null || placeholder === void 0 ? void 0 : placeholder.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
      return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    constructor(currentSnapshot, newSnapshot, isPreview, willRender = true) {
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.promise = new Promise((resolve7, reject) => this.resolvingFunctions = { resolve: resolve7, reject });
    }
    get shouldRender() {
      return true;
    }
    prepareToRender() {
      return;
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    createScriptElement(element) {
      if (element.getAttribute("data-turbo-eval") == "false") {
        return element;
      } else {
        const createdScriptElement = document.createElement("script");
        if (this.cspNonce) {
          createdScriptElement.nonce = this.cspNonce;
        }
        createdScriptElement.textContent = element.textContent;
        createdScriptElement.async = false;
        copyElementAttributes(createdScriptElement, element);
        return createdScriptElement;
      }
    }
    preservingPermanentElements(callback) {
      Bardo.preservingPermanentElements(this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      const element = this.connectedSnapshot.firstAutofocusableElement;
      if (elementIsFocusable(element)) {
        element.focus();
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
    get cspNonce() {
      var _a;
      return (_a = document.head.querySelector('meta[name="csp-nonce"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content");
    }
  };
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of [...sourceElement.attributes]) {
      destinationElement.setAttribute(name, value);
    }
  }
  function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
  }
  var FrameRenderer = class extends Renderer {
    get shouldRender() {
      return true;
    }
    async render() {
      await nextAnimationFrame();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextAnimationFrame();
      this.focusFirstAutofocusableElement();
      await nextAnimationFrame();
      this.activateScriptElements();
    }
    loadFrameElement() {
      var _a;
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(this.currentElement);
      destinationRange.deleteContents();
      const frameElement = this.newElement;
      const sourceRange = (_a = frameElement.ownerDocument) === null || _a === void 0 ? void 0 : _a.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        this.currentElement.appendChild(sourceRange.extractContents());
      }
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        if (element) {
          element.scrollIntoView({ block });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = this.createScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var ProgressBar = class {
    constructor() {
      this.hiding = false;
      this.value = 0;
      this.visible = false;
      this.trickle = () => {
        this.setValue(this.value + Math.random() / 100);
      };
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 9999;
        transition:
          width ${ProgressBar.animationDuration}ms ease-out,
          opacity ${ProgressBar.animationDuration / 2}ms ${ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = ProgressBar.defaultCSS;
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
  };
  ProgressBar.animationDuration = 300;
  var HeadSnapshot = class extends Snapshot {
    constructor() {
      super(...arguments);
      this.detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result2, element) => {
        const { outerHTML } = element;
        const details = outerHTML in result2 ? result2[outerHTML] : {
          type: elementType(element),
          tracked: elementIsTracked(element),
          elements: []
        };
        return Object.assign(Object.assign({}, result2), { [outerHTML]: Object.assign(Object.assign({}, details), { elements: [...details.elements, element] }) });
      }, {});
    }
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result2, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result2, ...elements];
        } else if (elements.length > 1) {
          return [...result2, ...elements.slice(1)];
        } else {
          return result2;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result2, outerHTML) => {
        const { elements: [element] } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result2;
      }, void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.tagName.toLowerCase();
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class extends Snapshot {
    constructor(element, headSnapshot) {
      super(element);
      this.headSnapshot = headSnapshot;
    }
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ head, body }) {
      return new this(body, new HeadSnapshot(head));
    }
    clone() {
      return new PageSnapshot(this.element.cloneNode(true), this.headSnapshot);
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      var _a;
      const root = (_a = this.getSetting("root")) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var TimingMetric;
  (function(TimingMetric2) {
    TimingMetric2["visitStart"] = "visitStart";
    TimingMetric2["requestStart"] = "requestStart";
    TimingMetric2["requestEnd"] = "requestEnd";
    TimingMetric2["visitEnd"] = "visitEnd";
  })(TimingMetric || (TimingMetric = {}));
  var VisitState;
  (function(VisitState2) {
    VisitState2["initialized"] = "initialized";
    VisitState2["started"] = "started";
    VisitState2["canceled"] = "canceled";
    VisitState2["failed"] = "failed";
    VisitState2["completed"] = "completed";
  })(VisitState || (VisitState = {}));
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true
  };
  var SystemStatusCode;
  (function(SystemStatusCode2) {
    SystemStatusCode2[SystemStatusCode2["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode2[SystemStatusCode2["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode2[SystemStatusCode2["contentTypeMismatch"] = -2] = "contentTypeMismatch";
  })(SystemStatusCode || (SystemStatusCode = {}));
  var Visit = class {
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.identifier = uuid();
      this.timingMetrics = {};
      this.followedRedirect = false;
      this.historyChanged = false;
      this.scrolled = false;
      this.snapshotCached = false;
      this.state = VisitState.initialized;
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const { action, historyChanged, referrer, snapshotHTML, response, visitCachedSnapshot, willRender } = Object.assign(Object.assign({}, defaultOptions), options);
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.scrolled = !willRender;
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.state = VisitState.completed;
        this.adapter.visitCompleted(this);
        this.delegate.visitCompleted(this);
        this.followRedirect();
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
      }
    }
    changeHistory() {
      var _a;
      if (!this.historyChanged) {
        const actionForHistory = this.location.href === ((_a = this.referrer) === null || _a === void 0 ? void 0 : _a.href) ? "replace" : this.action;
        const method = this.getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          this.cacheSnapshot();
          if (this.view.renderPromise)
            await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            await this.view.renderPage(PageSnapshot.fromHTMLString(responseHTML), false, this.willRender);
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML));
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise)
              await this.view.renderPromise;
            await this.view.renderPage(snapshot, isPreview, this.willRender);
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      var _a;
      if (this.redirectedToLocation && !this.followedRedirect && ((_a = this.response) === null || _a === void 0 ? void 0 : _a.redirected)) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.adapter.visitRendered(this);
        });
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(request, response) {
    }
    async requestSucceededWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({ statusCode: SystemStatusCode.contentTypeMismatch, redirected });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({ statusCode: SystemStatusCode.contentTypeMismatch, redirected });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(request, error2) {
      this.recordResponse({ statusCode: SystemStatusCode.networkFailure, redirected: false });
    }
    requestFinished() {
      this.finishRequest();
    }
    performScroll() {
      if (!this.scrolled) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = new Date().getTime();
    }
    getTimingMetrics() {
      return Object.assign({}, this.timingMetrics);
    }
    getHistoryMethodForAction(action) {
      switch (action) {
        case "replace":
          return history.replaceState;
        case "advance":
        case "restore":
          return history.pushState;
      }
    }
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot().then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      await new Promise((resolve7) => {
        this.frame = requestAnimationFrame(() => resolve7());
      });
      await callback();
      delete this.frame;
      this.performScroll();
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    constructor(session2) {
      this.progressBar = new ProgressBar();
      this.showProgressBar = () => {
        this.progressBar.show();
      };
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      this.navigator.startVisit(location2, uuid(), options);
    }
    visitStarted(visit2) {
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
      visit2.changeHistory();
      visit2.goToSamePageAnchor();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload();
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(visit2) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitCompleted(visit2) {
    }
    pageInvalidated() {
      this.reload();
    }
    visitFailed(visit2) {
    }
    visitRendered(visit2) {
    }
    formSubmissionStarted(formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    reload() {
      window.location.reload();
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    constructor() {
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
    removeStaleElements() {
      const staleElements = [...document.querySelectorAll('[data-turbo-cache="false"]')];
      for (const element of staleElements) {
        element.remove();
      }
    }
  };
  var FormSubmitObserver = class {
    constructor(delegate) {
      this.started = false;
      this.submitCaptured = () => {
        removeEventListener("submit", this.submitBubbled, false);
        addEventListener("submit", this.submitBubbled, false);
      };
      this.submitBubbled = (event) => {
        if (!event.defaultPrevented) {
          const form = event.target instanceof HTMLFormElement ? event.target : void 0;
          const submitter = event.submitter || void 0;
          if (form) {
            const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.getAttribute("method");
            if (method != "dialog" && this.delegate.willSubmitForm(form, submitter)) {
              event.preventDefault();
              this.delegate.formSubmitted(form, submitter);
            }
          }
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
  };
  var FrameRedirector = class {
    constructor(element) {
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formInterceptor = new FormInterceptor(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formInterceptor.stop();
    }
    shouldInterceptLinkClick(element, url) {
      return this.shouldRedirect(element);
    }
    linkClickIntercepted(element, url) {
      const frame = this.findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url);
      }
    }
    shouldInterceptFormSubmission(element, submitter) {
      return this.shouldSubmit(element, submitter);
    }
    formSubmissionIntercepted(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      if (frame) {
        frame.removeAttribute("reloadable");
        frame.delegate.formSubmissionIntercepted(element, submitter);
      }
    }
    shouldSubmit(form, submitter) {
      var _a;
      const action = getAction(form, submitter);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL((_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/");
      return this.shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    shouldRedirect(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      return frame ? frame != element.closest("turbo-frame") : false;
    }
    findFrameElement(element, submitter) {
      const id = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame");
      if (id && id != "_top") {
        const frame = this.element.querySelector(`#${id}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    constructor(delegate) {
      this.restorationIdentifier = uuid();
      this.restorationData = {};
      this.started = false;
      this.pageLoaded = false;
      this.onPopState = (event) => {
        if (this.shouldHandlePopState()) {
          const { turbo } = event.state || {};
          if (turbo) {
            this.location = new URL(window.location.href);
            const { restorationIdentifier } = turbo;
            this.restorationIdentifier = restorationIdentifier;
            this.delegate.historyPoppedToLocationWithRestorationIdentifier(this.location, restorationIdentifier);
          }
        }
      };
      this.onPageLoad = async (event) => {
        await nextMicrotask();
        this.pageLoaded = true;
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      const state = { turbo: { restorationIdentifier } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = Object.assign(Object.assign({}, restorationData), additionalData);
    }
    assumeControlOfScrollRestoration() {
      var _a;
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = (_a = history.scrollRestoration) !== null && _a !== void 0 ? _a : "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var LinkClickObserver = class {
    constructor(delegate) {
      this.started = false;
      this.clickCaptured = () => {
        removeEventListener("click", this.clickBubbled, false);
        addEventListener("click", this.clickBubbled, false);
      };
      this.clickBubbled = (event) => {
        if (this.clickEventIsSignificant(event)) {
          const target = event.composedPath && event.composedPath()[0] || event.target;
          const link = this.findLinkFromClickTarget(target);
          if (link) {
            const location2 = this.getLocationForLink(link);
            if (this.delegate.willFollowLinkToLocation(link, location2)) {
              event.preventDefault();
              this.delegate.followedLinkToLocation(link, location2);
            }
          }
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
    findLinkFromClickTarget(target) {
      if (target instanceof Element) {
        return target.closest("a[href]:not([target^=_]):not([download])");
      }
    }
    getLocationForLink(link) {
      return expandURL(link.getAttribute("href") || "");
    }
  };
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        if (locationIsVisitable(location2, this.view.snapshot.rootLocation)) {
          this.delegate.visitProposedToLocation(location2, options);
        } else {
          window.location.href = location2.toString();
        }
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, Object.assign({ referrer: this.location }, options));
      this.currentVisit.start();
    }
    submitForm(form, submitter) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          if (formSubmission.method != FetchMethod.get) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.getActionForFormSubmission(formSubmission);
          const visitOptions = { action, response: { statusCode, responseHTML, redirected } };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot);
        } else {
          await this.view.renderPage(snapshot);
        }
        this.view.scrollToTop();
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    getActionForFormSubmission(formSubmission) {
      const { formElement, submitter } = formSubmission;
      const action = getAttribute("data-turbo-action", submitter, formElement);
      return isAction(action) ? action : "advance";
    }
  };
  var PageStage;
  (function(PageStage2) {
    PageStage2[PageStage2["initial"] = 0] = "initial";
    PageStage2[PageStage2["loading"] = 1] = "loading";
    PageStage2[PageStage2["interactive"] = 2] = "interactive";
    PageStage2[PageStage2["complete"] = 3] = "complete";
  })(PageStage || (PageStage = {}));
  var PageObserver = class {
    constructor(delegate) {
      this.stage = PageStage.initial;
      this.started = false;
      this.interpretReadyState = () => {
        const { readyState } = this;
        if (readyState == "interactive") {
          this.pageIsInteractive();
        } else if (readyState == "complete") {
          this.pageIsComplete();
        }
      };
      this.pageWillUnload = () => {
        this.delegate.pageWillUnload();
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    constructor(delegate) {
      this.started = false;
      this.onScroll = () => {
        this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamObserver = class {
    constructor(delegate) {
      this.sources = /* @__PURE__ */ new Set();
      this.started = false;
      this.inspectFetchResponse = (event) => {
        const response = fetchResponseFromEvent(event);
        if (response && fetchResponseIsStream(response)) {
          event.preventDefault();
          this.receiveMessageResponse(response);
        }
      };
      this.receiveMessageEvent = (event) => {
        if (this.started && typeof event.data == "string") {
          this.receiveMessageHTML(event.data);
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(new StreamMessage(html));
    }
  };
  function fetchResponseFromEvent(event) {
    var _a;
    const fetchResponse = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    var _a;
    const contentType = (_a = response.contentType) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head, body } = document;
      documentElement.replaceChild(this.newHead, head);
      documentElement.replaceChild(this.newElement, body);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode2 = replaceableElement.parentNode;
        if (parentNode2) {
          const element = this.createScriptElement(replaceableElement);
          parentNode2.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return [...document.documentElement.querySelectorAll("script")];
    }
  };
  var PageRenderer = class extends Renderer {
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    prepareToRender() {
      this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    mergeHead() {
      this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      this.removeCurrentHeadProvisionalElements();
      this.copyNewHeadProvisionalElements();
    }
    replaceBody() {
      this.preservingPermanentElements(() => {
        this.activateNewBody();
        this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    copyNewHeadStylesheetElements() {
      for (const element of this.newHeadStylesheetElements) {
        document.head.appendChild(element);
      }
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(this.createScriptElement(element));
      }
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = this.createScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    assignNewBody() {
      if (document.body && this.newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(this.newElement);
      } else {
        document.documentElement.appendChild(this.newElement);
      }
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var SnapshotCache = class {
    constructor(size) {
      this.keys = [];
      this.snapshots = {};
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index2 = this.keys.indexOf(key);
      if (index2 > -1)
        this.keys.splice(index2, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    constructor() {
      super(...arguments);
      this.snapshotCache = new SnapshotCache(10);
      this.lastRenderedLocation = new URL(location.href);
    }
    renderPage(snapshot, isPreview = false, willRender = true) {
      const renderer = new PageRenderer(this.snapshot, snapshot, isPreview, willRender);
      return this.render(renderer);
    }
    renderError(snapshot) {
      const renderer = new ErrorRenderer(this.snapshot, snapshot, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot() {
      if (this.shouldCacheSnapshot) {
        this.delegate.viewWillCacheSnapshot();
        const { snapshot, lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
    get shouldCacheSnapshot() {
      return this.snapshot.isCacheable;
    }
  };
  var Session = class {
    constructor() {
      this.navigator = new Navigator(this);
      this.history = new History(this);
      this.view = new PageView(this, document.documentElement);
      this.adapter = new BrowserAdapter(this);
      this.pageObserver = new PageObserver(this);
      this.cacheObserver = new CacheObserver();
      this.linkClickObserver = new LinkClickObserver(this);
      this.formSubmitObserver = new FormSubmitObserver(this);
      this.scrollObserver = new ScrollObserver(this);
      this.streamObserver = new StreamObserver(this);
      this.frameRedirector = new FrameRedirector(document.documentElement);
      this.drive = true;
      this.enabled = true;
      this.progressBarDelay = 500;
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      this.navigator.proposeVisit(expandURL(location2), options);
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      document.documentElement.appendChild(StreamMessage.wrap(message).fragment);
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      this.progressBarDelay = delay;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    historyPoppedToLocationWithRestorationIdentifier(location2, restorationIdentifier) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, { action: "restore", historyChanged: true });
      } else {
        this.adapter.pageInvalidated();
      }
    }
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    willFollowLinkToLocation(link, location2) {
      return this.elementDriveEnabled(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      this.convertLinkWithMethodClickToFormSubmission(link) || this.visit(location2.href, { action });
    }
    convertLinkWithMethodClickToFormSubmission(link) {
      const linkMethod = link.getAttribute("data-turbo-method");
      if (linkMethod) {
        const form = document.createElement("form");
        form.method = linkMethod;
        form.action = link.getAttribute("href") || "undefined";
        form.hidden = true;
        if (link.hasAttribute("data-turbo-confirm")) {
          form.setAttribute("data-turbo-confirm", link.getAttribute("data-turbo-confirm"));
        }
        const frame = this.getTargetFrameForLink(link);
        if (frame) {
          form.setAttribute("data-turbo-frame", frame);
          form.addEventListener("turbo:submit-start", () => form.remove());
        } else {
          form.addEventListener("submit", () => form.remove());
        }
        document.body.appendChild(form);
        return dispatch("submit", { cancelable: true, target: form });
      } else {
        return false;
      }
    }
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    visitStarted(visit2) {
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    willSubmitForm(form, submitter) {
      const action = getAction(form, submitter);
      return this.elementDriveEnabled(form) && (!submitter || this.elementDriveEnabled(submitter)) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter) {
      this.navigator.submitForm(form, submitter);
    }
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    viewWillCacheSnapshot() {
      var _a;
      if (!((_a = this.navigator.currentVisit) === null || _a === void 0 ? void 0 : _a.silent)) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, resume) {
      const event = this.notifyApplicationBeforeRender(element, resume);
      return !event.defaultPrevented;
    }
    viewRenderedSnapshot(snapshot, isPreview) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender();
    }
    viewInvalidated() {
      this.adapter.pageInvalidated();
    }
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    applicationAllowsFollowingLinkToLocation(link, location2) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2) {
      return dispatch("turbo:click", { target: link, detail: { url: location2.href }, cancelable: true });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", { detail: { url: location2.href }, cancelable: true });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      markAsBusy(document.documentElement);
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, resume) {
      return dispatch("turbo:before-render", { detail: { newBody, resume }, cancelable: true });
    }
    notifyApplicationAfterRender() {
      return dispatch("turbo:render");
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      clearBusyState(document.documentElement);
      return dispatch("turbo:load", { detail: { url: this.location.href, timing } });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(new HashChangeEvent("hashchange", { oldURL: oldURL.toString(), newURL: newURL.toString() }));
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", { detail: { fetchResponse }, target: frame, cancelable: true });
    }
    elementDriveEnabled(element) {
      const container = element === null || element === void 0 ? void 0 : element.closest("[data-turbo]");
      if (this.drive) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    getActionForLink(link) {
      const action = link.getAttribute("data-turbo-action");
      return isAction(action) ? action : "advance";
    }
    getTargetFrameForLink(link) {
      const frame = link.getAttribute("data-turbo-frame");
      if (frame) {
        return frame;
      } else {
        const container = link.closest("turbo-frame");
        if (container) {
          return container.id;
        }
      }
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var session = new Session();
  var { navigator: navigator$1 } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
  }
  function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
  }
  var Turbo = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    PageRenderer,
    PageSnapshot,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay,
    setConfirmMethod
  });
  var FrameController = class {
    constructor(element) {
      this.fetchResponseLoaded = (fetchResponse) => {
      };
      this.currentFetchRequest = null;
      this.resolveVisitPromise = () => {
      };
      this.connected = false;
      this.hasBeenLoaded = false;
      this.settingSourceURL = false;
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.formInterceptor = new FormInterceptor(this, this.element);
    }
    connect() {
      if (!this.connected) {
        this.connected = true;
        this.reloadable = false;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        }
        this.linkInterceptor.start();
        this.formInterceptor.start();
        this.sourceURLChanged();
      }
    }
    disconnect() {
      if (this.connected) {
        this.connected = false;
        this.appearanceObserver.stop();
        this.linkInterceptor.stop();
        this.formInterceptor.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager || this.hasBeenLoaded) {
        this.loadSourceURL();
      }
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.loadSourceURL();
      }
    }
    async loadSourceURL() {
      if (!this.settingSourceURL && this.enabled && this.isActive && (this.reloadable || this.sourceURL != this.currentURL)) {
        const previousURL = this.currentURL;
        this.currentURL = this.sourceURL;
        if (this.sourceURL) {
          try {
            this.element.loaded = this.visit(expandURL(this.sourceURL));
            this.appearanceObserver.stop();
            await this.element.loaded;
            this.hasBeenLoaded = true;
          } catch (error2) {
            this.currentURL = previousURL;
            throw error2;
          }
        }
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const { body } = parseHTMLDocument(html);
          const snapshot = new Snapshot(await this.extractForeignFrameElement(body));
          const renderer = new FrameRenderer(this.view.snapshot, snapshot, false, false);
          if (this.view.renderPromise)
            await this.view.renderPromise;
          await this.view.render(renderer);
          session.frameRendered(fetchResponse, this.element);
          session.frameLoaded(this.element);
          this.fetchResponseLoaded(fetchResponse);
        }
      } catch (error2) {
        console.error(error2);
        this.view.invalidate();
      } finally {
        this.fetchResponseLoaded = () => {
        };
      }
    }
    elementAppearedInViewport(element) {
      this.loadSourceURL();
    }
    shouldInterceptLinkClick(element, url) {
      if (element.hasAttribute("data-turbo-method")) {
        return false;
      } else {
        return this.shouldInterceptNavigation(element);
      }
    }
    linkClickIntercepted(element, url) {
      this.reloadable = true;
      this.navigateFrame(element, url);
    }
    shouldInterceptFormSubmission(element, submitter) {
      return this.shouldInterceptNavigation(element, submitter);
    }
    formSubmissionIntercepted(element, submitter) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.reloadable = false;
      this.formSubmission = new FormSubmission(this, element, submitter);
      const { fetchRequest } = this.formSubmission;
      this.prepareHeadersForRequest(fetchRequest.headers, fetchRequest);
      this.formSubmission.start();
    }
    prepareHeadersForRequest(headers, request) {
      headers["Turbo-Frame"] = this.id;
    }
    requestStarted(request) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(request, response) {
      this.resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
      await this.loadResponse(response);
      this.resolveVisitPromise();
    }
    requestFailedWithResponse(request, response) {
      console.error(response);
      this.resolveVisitPromise();
    }
    requestErrored(request, error2) {
      console.error(error2);
      this.resolveVisitPromise();
    }
    requestFinished(request) {
      clearBusyState(this.element);
    }
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.findFrameElement(formSubmission.formElement, formSubmission.submitter);
      this.proposeVisitIfNavigatedWithAction(frame, formSubmission.formElement, formSubmission.submitter);
      frame.delegate.loadResponse(response);
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.findFrameElement(formElement));
    }
    allowsImmediateRender(snapshot, resume) {
      return true;
    }
    viewRenderedSnapshot(snapshot, isPreview) {
    }
    viewInvalidated() {
    }
    async visit(url) {
      var _a;
      const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
      (_a = this.currentFetchRequest) === null || _a === void 0 ? void 0 : _a.cancel();
      this.currentFetchRequest = request;
      return new Promise((resolve7) => {
        this.resolveVisitPromise = () => {
          this.resolveVisitPromise = () => {
          };
          this.currentFetchRequest = null;
          resolve7();
        };
        request.perform();
      });
    }
    navigateFrame(element, url, submitter) {
      const frame = this.findFrameElement(element, submitter);
      this.proposeVisitIfNavigatedWithAction(frame, element, submitter);
      frame.setAttribute("reloadable", "");
      frame.src = url;
    }
    proposeVisitIfNavigatedWithAction(frame, element, submitter) {
      const action = getAttribute("data-turbo-action", submitter, element, frame);
      if (isAction(action)) {
        const { visitCachedSnapshot } = new SnapshotSubstitution(frame);
        frame.delegate.fetchResponseLoaded = (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = frame.ownerDocument.documentElement.outerHTML;
            const response = { statusCode, redirected, responseHTML };
            session.visit(frame.src, { action, response, visitCachedSnapshot, willRender: false });
          }
        };
      }
    }
    findFrameElement(element, submitter) {
      var _a;
      const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      return (_a = getFrameElementById(id)) !== null && _a !== void 0 ? _a : this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id = CSS.escape(this.id);
      try {
        if (element = activateElement(container.querySelector(`turbo-frame#${id}`), this.currentURL)) {
          return element;
        }
        if (element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.currentURL)) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
        console.error(`Response has no matching <turbo-frame id="${id}"> element`);
      } catch (error2) {
        console.error(error2);
      }
      return new FrameElement();
    }
    formActionIsVisitable(form, submitter) {
      const action = getAction(form, submitter);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    shouldInterceptNavigation(element, submitter) {
      const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.formActionIsVisitable(element, submitter)) {
        return false;
      }
      if (!this.enabled || id == "_top") {
        return false;
      }
      if (id) {
        const frameElement = getFrameElementById(id);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementDriveEnabled(element)) {
        return false;
      }
      if (submitter && !session.elementDriveEnabled(submitter)) {
        return false;
      }
      return true;
    }
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    get reloadable() {
      const frame = this.findFrameElement(this.element);
      return frame.hasAttribute("reloadable");
    }
    set reloadable(value) {
      const frame = this.findFrameElement(this.element);
      if (value) {
        frame.setAttribute("reloadable", "");
      } else {
        frame.removeAttribute("reloadable");
      }
    }
    set sourceURL(sourceURL) {
      this.settingSourceURL = true;
      this.element.src = sourceURL !== null && sourceURL !== void 0 ? sourceURL : null;
      this.currentURL = this.element.src;
      this.settingSourceURL = false;
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.resolveVisitPromise() !== void 0;
    }
    get isActive() {
      return this.element.isActive && this.connected;
    }
    get rootLocation() {
      var _a;
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root = (_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
  };
  var SnapshotSubstitution = class {
    constructor(element) {
      this.visitCachedSnapshot = ({ element: element2 }) => {
        var _a;
        const { id, clone } = this;
        (_a = element2.querySelector("#" + id)) === null || _a === void 0 ? void 0 : _a.replaceWith(clone);
      };
      this.clone = element.cloneNode(true);
      this.id = element.id;
    }
  };
  function getFrameElementById(id) {
    if (id != null) {
      const element = document.getElementById(id);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamActions = {
    after() {
      this.targetElements.forEach((e) => {
        var _a;
        return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e.nextSibling);
      });
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e) => {
        var _a;
        return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e);
      });
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e) => e.remove());
    },
    replace() {
      this.targetElements.forEach((e) => e.replaceWith(this.templateContent));
    },
    update() {
      this.targetElements.forEach((e) => {
        e.innerHTML = "";
        e.append(this.templateContent);
      });
    }
  };
  var StreamElement = class extends HTMLElement {
    async connectedCallback() {
      try {
        await this.render();
      } catch (error2) {
        console.error(error2);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      var _a;
      return (_a = this.renderPromise) !== null && _a !== void 0 ? _a : this.renderPromise = (async () => {
        if (this.dispatchEvent(this.beforeRenderEvent)) {
          await nextAnimationFrame();
          this.performAction();
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch (_a) {
      }
    }
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c) => c.remove());
    }
    get duplicateChildren() {
      var _a;
      const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.id);
      const newChildrenIds = [...(_a = this.templateContent) === null || _a === void 0 ? void 0 : _a.children].filter((c) => !!c.id).map((c) => c.id);
      return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.raise("unknown action");
      }
      this.raise("action attribute is missing");
    }
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.raise("target or targets attribute is missing");
      }
    }
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    get templateElement() {
      if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.raise("first child element must be a <template> element");
    }
    get action() {
      return this.getAttribute("action");
    }
    get target() {
      return this.getAttribute("target");
    }
    get targets() {
      return this.getAttribute("targets");
    }
    raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      var _a, _b;
      return (_b = ((_a = this.outerHTML.match(/<[^>]+>/)) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", { bubbles: true, cancelable: true });
    }
    get targetElementsById() {
      var _a;
      const element = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      var _a;
      const elements = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  FrameElement.delegateConstructor = FrameController;
  customElements.define("turbo-frame", FrameElement);
  customElements.define("turbo-stream", StreamElement);
  (() => {
    let element = document.currentScript;
    if (!element)
      return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
      return;
    while (element = element.parentElement) {
      if (element == document.body) {
        return console.warn(unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, element.outerHTML);
      }
    }
  })();
  window.Turbo = Turbo;
  start();

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer3 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer3();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, { received: this.dispatchMessageEvent.bind(this) });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription)
        this.subscription.unsubscribe();
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name };
    }
  };
  customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = /* @__PURE__ */ new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left2, right2) => {
        const leftIndex = left2.index, rightIndex = right2.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = /* @__PURE__ */ new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map15) => listeners.concat(Array.from(map15.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
    }
    handleError(error2, message, detail = {}) {
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = /* @__PURE__ */ new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches2 = source.match(descriptorPattern) || [];
    return {
      eventTarget: parseEventTarget(matches2[4]),
      eventName: matches2[2],
      eventOptions: matches2[9] ? parseEventOptions(matches2[9]) : {},
      identifier: matches2[5],
      methodName: matches2[7]
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  var Action = class {
    constructor(element, index2, descriptor) {
      this.element = element;
      this.index = index2;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
    }
    static forToken(token) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content));
    }
    toString() {
      const eventNameSuffix = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventNameSuffix}->${this.identifier}#${this.methodName}`;
    }
    get params() {
      if (this.eventTarget instanceof Element) {
        return this.getParamsFromEventTargetAttributes(this.eventTarget);
      } else {
        return {};
      }
    }
    getParamsFromEventTargetAttributes(eventTarget) {
      const params = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`);
      const attributes = Array.from(eventTarget.attributes);
      attributes.forEach(({ name, value }) => {
        const match = name.match(pattern);
        const key = match && match[1];
        if (key) {
          Object.assign(params, { [camelize(key)]: typecast(value) });
        }
      });
      return params;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
  };
  var defaultEventNames = {
    "a": (e) => "click",
    "button": (e) => "click",
    "form": (e) => "submit",
    "details": (e) => "toggle",
    "input": (e) => e.getAttribute("type") == "submit" ? "click" : "input",
    "select": (e) => "change",
    "textarea": (e) => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
      return defaultEventNames[tagName](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      if (this.willBeInvokedByEvent(event)) {
        this.invokeWithEvent(event);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        const { params } = this.action;
        const actionEvent = Object.assign(event, { params });
        this.method.call(this.controller, actionEvent);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error2) {
        const { identifier, controller, element, index: index2 } = this;
        const detail = { identifier, controller, element, index: index2, event };
        this.context.handleError(error2, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = /* @__PURE__ */ new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches2 = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches2.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches2)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(node4, attributeName) {
      const element = node4;
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node4 of Array.from(nodes)) {
        const element = this.elementFromNode(node4);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node4 of Array.from(nodes)) {
        const element = this.elementFromNode(node4);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node4) {
      if (node4.nodeType == Node.ELEMENT_NODE) {
        return node4;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches2 = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches2);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = /* @__PURE__ */ new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  function add(map15, key, value) {
    fetch2(map15, key).add(value);
  }
  function del(map15, key, value) {
    fetch2(map15, key).delete(value);
    prune(map15, key);
  }
  function fetch2(map15, key) {
    let values = map15.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      map15.set(key, values);
    }
    return values;
  }
  function prune(map15, key) {
    const values = map15.get(key);
    if (values != null && values.size == 0) {
      map15.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = /* @__PURE__ */ new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set2) => values.concat(Array.from(set2)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set2) => size + set2.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set2) => set2.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([key, values]) => values.has(value)).map(([key, values]) => key);
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content2) => content2.length).map((content2, index2) => ({ element, attributeName, content: content2, index: index2 }));
  }
  function zip(left2, right2) {
    const length = Math.max(left2.length, right2.length);
    return Array.from({ length }, (_, index2) => [left2[index2], right2[index2]]);
  }
  function tokensAreEqual(left2, right2) {
    return left2 && right2 && left2.index == right2.index && left2.content == right2.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
      this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = /* @__PURE__ */ new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error2) {
        return { error: error2 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
      this.invokeChangedCallbacksForDefaultValues();
    }
    start() {
      this.stringMapObserver.start();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        const value = descriptor.reader(rawValue);
        let oldValue = rawOldValue;
        if (rawOldValue) {
          oldValue = descriptor.reader(rawOldValue);
        }
        changedMethod.call(this.receiver, value, oldValue);
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors[descriptor.name] = descriptor;
      });
      return descriptors;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var Context = class {
    constructor(module2, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module2;
      this.scope = scope;
      this.controller = new module2.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error2) {
        this.handleError(error2, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error2) {
        this.handleError(error2, "connecting controller");
      }
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error2) {
        this.handleError(error2, "disconnecting controller");
      }
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error2, message, detail = {}) {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend2(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [
        ...Object.getOwnPropertyNames(object),
        ...Object.getOwnPropertySymbols(object)
      ];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend2 = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error2) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = /* @__PURE__ */ new WeakMap();
      this.connectedContexts = /* @__PURE__ */ new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger) {
      this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
      this.logger = logger;
    }
    warn(object, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object);
      if (!warnedKeys) {
        warnedKeys = /* @__PURE__ */ new Set();
        this.warnedKeysByObject.set(object, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var Scope = class {
    constructor(schema, element, identifier, logger) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema;
      this.element = element;
      this.identifier = identifier;
      this.guide = new Guide(logger);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema, delegate) {
      this.element = element;
      this.schema = schema;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
      this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier } = token;
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = /* @__PURE__ */ new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = /* @__PURE__ */ new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module2) => contexts.concat(module2.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module2 = new Module(this.application, definition);
      this.connectModule(module2);
    }
    unloadIdentifier(identifier) {
      const module2 = this.modulesByIdentifier.get(identifier);
      if (module2) {
        this.disconnectModule(module2);
      }
    }
    getContextForElementAndIdentifier(element, identifier) {
      const module2 = this.modulesByIdentifier.get(identifier);
      if (module2) {
        return module2.contexts.find((context) => context.element == element);
      }
    }
    handleError(error2, message, detail) {
      this.application.handleError(error2, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
      return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module2 = this.modulesByIdentifier.get(scope.identifier);
      if (module2) {
        module2.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module2 = this.modulesByIdentifier.get(scope.identifier);
      if (module2) {
        module2.disconnectContextForScope(scope);
      }
    }
    connectModule(module2) {
      this.modulesByIdentifier.set(module2.identifier, module2);
      const scopes = this.scopesByIdentifier.getValuesForKey(module2.identifier);
      scopes.forEach((scope) => module2.connectContextForScope(scope));
    }
    disconnectModule(module2) {
      this.modulesByIdentifier.delete(module2.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module2.identifier);
      scopes.forEach((scope) => module2.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`
  };
  var Application = class {
    constructor(element = document.documentElement, schema = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
    }
    static start(element, schema) {
      const application2 = new Application(element, schema);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
      if (controllerConstructor.shouldLoad) {
        this.load({ identifier, controllerConstructor });
      }
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => this.router.loadDefinition(definition));
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier);
      return context ? context.controller : null;
    }
    handleError(error2, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error2, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error2);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve7) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve7());
      } else {
        resolve7();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result2, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result2, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair) {
    const definition = parseValueDefinitionPair(valueDefinitionPair);
    const { key, name, reader: read2, writer: write2 } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read2(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write2(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition]) {
    return valueDescriptorForTokenAndTypeDefinition(token, typeDefinition);
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(typeObject) {
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    if (typeFromObject) {
      const defaultValueType = parseValueTypeDefault(typeObject.default);
      if (typeFromObject !== defaultValueType) {
        throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`);
      }
      return typeFromObject;
    }
  }
  function parseValueTypeDefinition(typeDefinition) {
    const typeFromObject = parseValueTypeObject(typeDefinition);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    throw new Error(`Unknown value type "${typeDefinition}"`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== void 0)
      return defaultValue;
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(token, typeDefinition) {
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(typeDefinition);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError("Expected array");
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || value == "false");
    },
    number(value) {
      return Number(value);
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError("Expected object");
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing];
  Controller.targets = [];
  Controller.values = {};

  // node_modules/frontend-helpers/javascript/src/controllers/disappear-controller.js
  var DisappearController = class extends Controller {
    connect() {
      this.closed = false;
      setTimeout(() => this.close(), this.delayValue);
    }
    disconnect() {
      if (this.closed)
        return;
      this.removeElement();
    }
    close() {
      const animationClass = this.hasAnimationClass ? this.animationClass : "fadeOutRight";
      this.element.classList.add(animationClass);
      this.element.addEventListener("animationend", () => {
        this.closed = true;
        this.removeElement();
      });
    }
    removeElement() {
      if (!this.hasRemoveValue) {
        this.element.remove();
      }
    }
  };
  __publicField(DisappearController, "classes", ["animation"]);
  __publicField(DisappearController, "values", {
    delay: { type: Number, default: 3e3 },
    remove: Boolean
  });

  // node_modules/frontend-helpers/javascript/src/controllers/dropdown-controller.js
  var DropdownController = class extends Controller {
    connect() {
      document.addEventListener("click", this.closeDropdowns);
      if (!(this.hasHoverableValue && this.hoverableValue)) {
        return;
      }
      this.element.addEventListener("mouseenter", (event) => this.toggleMenu(event));
      this.element.addEventListener("mouseleave", this.closeDropdowns);
    }
    disconnect() {
      document.removeEventListener("click", this.closeDropdowns);
      if (!(this.hasHoverableValue && this.hoverableValue)) {
        return;
      }
      this.element.removeEventListener("mouseenter", this.closeDropdowns);
      this.element.removeEventListener("mouseleave", this.closeDropdowns);
    }
    toggleMenu(e) {
      e.stopPropagation();
      e.preventDefault();
      this.element.classList.toggle("is-active");
    }
    closeDropdowns = () => {
      this.element.classList.remove("is-active");
    };
  };
  __publicField(DropdownController, "values", { hoverable: Boolean });

  // node_modules/@popperjs/core/lib/enums.js
  var top = "top";
  var bottom = "bottom";
  var right = "right";
  var left = "left";
  var auto = "auto";
  var basePlacements = [top, bottom, right, left];
  var start2 = "start";
  var end = "end";
  var clippingParents = "clippingParents";
  var viewport = "viewport";
  var popper = "popper";
  var reference = "reference";
  var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
    return acc.concat([placement + "-" + start2, placement + "-" + end]);
  }, []);
  var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
    return acc.concat([placement, placement + "-" + start2, placement + "-" + end]);
  }, []);
  var beforeRead = "beforeRead";
  var read = "read";
  var afterRead = "afterRead";
  var beforeMain = "beforeMain";
  var main = "main";
  var afterMain = "afterMain";
  var beforeWrite = "beforeWrite";
  var write = "write";
  var afterWrite = "afterWrite";
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  // node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
  function getNodeName(element) {
    return element ? (element.nodeName || "").toLowerCase() : null;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getWindow.js
  function getWindow(node4) {
    if (node4 == null) {
      return window;
    }
    if (node4.toString() !== "[object Window]") {
      var ownerDocument = node4.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }
    return node4;
  }

  // node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
  function isElement(node4) {
    var OwnElement = getWindow(node4).Element;
    return node4 instanceof OwnElement || node4 instanceof Element;
  }
  function isHTMLElement(node4) {
    var OwnElement = getWindow(node4).HTMLElement;
    return node4 instanceof OwnElement || node4 instanceof HTMLElement;
  }
  function isShadowRoot(node4) {
    if (typeof ShadowRoot === "undefined") {
      return false;
    }
    var OwnElement = getWindow(node4).ShadowRoot;
    return node4 instanceof OwnElement || node4 instanceof ShadowRoot;
  }

  // node_modules/@popperjs/core/lib/modifiers/applyStyles.js
  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function(name) {
      var style2 = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name];
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style2);
      Object.keys(attributes).forEach(function(name2) {
        var value = attributes[name2];
        if (value === false) {
          element.removeAttribute(name2);
        } else {
          element.setAttribute(name2, value === true ? "" : value);
        }
      });
    });
  }
  function effect(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }
    return function() {
      Object.keys(state.elements).forEach(function(name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
        var style2 = styleProperties.reduce(function(style3, property) {
          style3[property] = "";
          return style3;
        }, {});
        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }
        Object.assign(element.style, style2);
        Object.keys(attributes).forEach(function(attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  }
  var applyStyles_default = {
    name: "applyStyles",
    enabled: true,
    phase: "write",
    fn: applyStyles,
    effect,
    requires: ["computeStyles"]
  };

  // node_modules/@popperjs/core/lib/utils/getBasePlacement.js
  function getBasePlacement(placement) {
    return placement.split("-")[0];
  }

  // node_modules/@popperjs/core/lib/utils/math.js
  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  // node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
  function getBoundingClientRect(element, includeScale) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    var rect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;
    if (isHTMLElement(element) && includeScale) {
      var offsetHeight = element.offsetHeight;
      var offsetWidth = element.offsetWidth;
      if (offsetWidth > 0) {
        scaleX = round(rect.width) / offsetWidth || 1;
      }
      if (offsetHeight > 0) {
        scaleY = round(rect.height) / offsetHeight || 1;
      }
    }
    return {
      width: rect.width / scaleX,
      height: rect.height / scaleY,
      top: rect.top / scaleY,
      right: rect.right / scaleX,
      bottom: rect.bottom / scaleY,
      left: rect.left / scaleX,
      x: rect.left / scaleX,
      y: rect.top / scaleY
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
  function getLayoutRect(element) {
    var clientRect2 = getBoundingClientRect(element);
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    if (Math.abs(clientRect2.width - width) <= 1) {
      width = clientRect2.width;
    }
    if (Math.abs(clientRect2.height - height) <= 1) {
      height = clientRect2.height;
    }
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width,
      height
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/contains.js
  function contains(parent, child3) {
    var rootNode = child3.getRootNode && child3.getRootNode();
    if (parent.contains(child3)) {
      return true;
    } else if (rootNode && isShadowRoot(rootNode)) {
      var next = child3;
      do {
        if (next && parent.isSameNode(next)) {
          return true;
        }
        next = next.parentNode || next.host;
      } while (next);
    }
    return false;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
  function getComputedStyle2(element) {
    return getWindow(element).getComputedStyle(element);
  }

  // node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
  function isTableElement(element) {
    return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
  function getDocumentElement(element) {
    return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
  function getParentNode(element) {
    if (getNodeName(element) === "html") {
      return element;
    }
    return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
  }

  // node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
      return null;
    }
    return element.offsetParent;
  }
  function getContainingBlock(element) {
    var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
    var isIE = navigator.userAgent.indexOf("Trident") !== -1;
    if (isIE && isHTMLElement(element)) {
      var elementCss = getComputedStyle2(element);
      if (elementCss.position === "fixed") {
        return null;
      }
    }
    var currentNode = getParentNode(element);
    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }
    while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle2(currentNode);
      if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }
    return null;
  }
  function getOffsetParent(element) {
    var window2 = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);
    while (offsetParent && isTableElement(offsetParent) && getComputedStyle2(offsetParent).position === "static") {
      offsetParent = getTrueOffsetParent(offsetParent);
    }
    if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle2(offsetParent).position === "static")) {
      return window2;
    }
    return offsetParent || getContainingBlock(element) || window2;
  }

  // node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
  function getMainAxisFromPlacement(placement) {
    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
  }

  // node_modules/@popperjs/core/lib/utils/within.js
  function within(min3, value, max3) {
    return max(min3, min(value, max3));
  }
  function withinMaxClamp(min3, value, max3) {
    var v = within(min3, value, max3);
    return v > max3 ? max3 : v;
  }

  // node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  // node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  // node_modules/@popperjs/core/lib/utils/expandToHashMap.js
  function expandToHashMap(value, keys2) {
    return keys2.reduce(function(hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  // node_modules/@popperjs/core/lib/modifiers/arrow.js
  var toPaddingObject = function toPaddingObject2(padding, state) {
    padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  };
  function arrow(_ref) {
    var _state$modifiersData$;
    var state = _ref.state, name = _ref.name, options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets2 = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? "height" : "width";
    if (!arrowElement || !popperOffsets2) {
      return;
    }
    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === "y" ? top : left;
    var maxProp = axis === "y" ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
    var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2;
    var min3 = paddingObject[minProp];
    var max3 = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset3 = within(min3, center, max3);
    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset3, _state$modifiersData$.centerOffset = offset3 - center, _state$modifiersData$);
  }
  function effect2(_ref2) {
    var state = _ref2.state, options = _ref2.options;
    var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
    if (arrowElement == null) {
      return;
    }
    if (typeof arrowElement === "string") {
      arrowElement = state.elements.popper.querySelector(arrowElement);
      if (!arrowElement) {
        return;
      }
    }
    if (true) {
      if (!isHTMLElement(arrowElement)) {
        console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow."].join(" "));
      }
    }
    if (!contains(state.elements.popper, arrowElement)) {
      if (true) {
        console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', "element."].join(" "));
      }
      return;
    }
    state.elements.arrow = arrowElement;
  }
  var arrow_default = {
    name: "arrow",
    enabled: true,
    phase: "main",
    fn: arrow,
    effect: effect2,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  };

  // node_modules/@popperjs/core/lib/utils/getVariation.js
  function getVariation(placement) {
    return placement.split("-")[1];
  }

  // node_modules/@popperjs/core/lib/modifiers/computeStyles.js
  var unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
  };
  function roundOffsetsByDPR(_ref) {
    var x = _ref.x, y = _ref.y;
    var win = window;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(x * dpr) / dpr || 0,
      y: round(y * dpr) / dpr || 0
    };
  }
  function mapToStyles(_ref2) {
    var _Object$assign2;
    var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
    var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
      x,
      y
    }) : {
      x,
      y
    };
    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty("x");
    var hasY = offsets.hasOwnProperty("y");
    var sideX = left;
    var sideY = top;
    var win = window;
    if (adaptive) {
      var offsetParent = getOffsetParent(popper2);
      var heightProp = "clientHeight";
      var widthProp = "clientWidth";
      if (offsetParent === getWindow(popper2)) {
        offsetParent = getDocumentElement(popper2);
        if (getComputedStyle2(offsetParent).position !== "static" && position === "absolute") {
          heightProp = "scrollHeight";
          widthProp = "scrollWidth";
        }
      }
      offsetParent = offsetParent;
      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom;
        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
        y -= offsetY - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }
      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right;
        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
        x -= offsetX - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }
    var commonStyles = Object.assign({
      position
    }, adaptive && unsetSides);
    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
      x,
      y
    }) : {
      x,
      y
    };
    x = _ref4.x;
    y = _ref4.y;
    if (gpuAcceleration) {
      var _Object$assign;
      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }
    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
  }
  function computeStyles(_ref5) {
    var state = _ref5.state, options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    if (true) {
      var transitionProperty = getComputedStyle2(state.elements.popper).transitionProperty || "";
      if (adaptive && ["transform", "top", "right", "bottom", "left"].some(function(property) {
        return transitionProperty.indexOf(property) >= 0;
      })) {
        console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', "\n\n", 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", "\n\n", "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
      }
    }
    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration,
      isFixed: state.options.strategy === "fixed"
    };
    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive,
        roundOffsets
      })));
    }
    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: "absolute",
        adaptive: false,
        roundOffsets
      })));
    }
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-placement": state.placement
    });
  }
  var computeStyles_default = {
    name: "computeStyles",
    enabled: true,
    phase: "beforeWrite",
    fn: computeStyles,
    data: {}
  };

  // node_modules/@popperjs/core/lib/modifiers/eventListeners.js
  var passive = {
    passive: true
  };
  function effect3(_ref) {
    var state = _ref.state, instance = _ref.instance, options = _ref.options;
    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
    var window2 = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.addEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.addEventListener("resize", instance.update, passive);
    }
    return function() {
      if (scroll) {
        scrollParents.forEach(function(scrollParent) {
          scrollParent.removeEventListener("scroll", instance.update, passive);
        });
      }
      if (resize) {
        window2.removeEventListener("resize", instance.update, passive);
      }
    };
  }
  var eventListeners_default = {
    name: "eventListeners",
    enabled: true,
    phase: "write",
    fn: function fn() {
    },
    effect: effect3,
    data: {}
  };

  // node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
  var hash = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function(matched) {
      return hash[matched];
    });
  }

  // node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
  var hash2 = {
    start: "end",
    end: "start"
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function(matched) {
      return hash2[matched];
    });
  }

  // node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
  function getWindowScroll(node4) {
    var win = getWindow(node4);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft,
      scrollTop
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
  function getWindowScrollBarX(element) {
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
  function getViewportRect(element) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    return {
      width,
      height,
      x: x + getWindowScrollBarX(element),
      y
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
  function getDocumentRect(element) {
    var _element$ownerDocumen;
    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;
    if (getComputedStyle2(body || html).direction === "rtl") {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
  function isScrollParent(element) {
    var _getComputedStyle = getComputedStyle2(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  // node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
  function getScrollParent(node4) {
    if (["html", "body", "#document"].indexOf(getNodeName(node4)) >= 0) {
      return node4.ownerDocument.body;
    }
    if (isHTMLElement(node4) && isScrollParent(node4)) {
      return node4;
    }
    return getScrollParent(getParentNode(node4));
  }

  // node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
  function listScrollParents(element, list) {
    var _element$ownerDocumen;
    if (list === void 0) {
      list = [];
    }
    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
  }

  // node_modules/@popperjs/core/lib/utils/rectToClientRect.js
  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }

  // node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
  function getInnerBoundingClientRect(element) {
    var rect = getBoundingClientRect(element);
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }
  function getClientRectFromMixedType(element, clippingParent) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  }
  function getClippingParents(element) {
    var clippingParents2 = listScrollParents(getParentNode(element));
    var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle2(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
    if (!isElement(clipperElement)) {
      return [];
    }
    return clippingParents2.filter(function(clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
    });
  }
  function getClippingRect(element, boundary, rootBoundary) {
    var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
    var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents2[0];
    var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  // node_modules/@popperjs/core/lib/utils/computeOffsets.js
  function computeOffsets(_ref) {
    var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference2.x + reference2.width / 2 - element.width / 2;
    var commonY = reference2.y + reference2.height / 2 - element.height / 2;
    var offsets;
    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference2.y - element.height
        };
        break;
      case bottom:
        offsets = {
          x: commonX,
          y: reference2.y + reference2.height
        };
        break;
      case right:
        offsets = {
          x: reference2.x + reference2.width,
          y: commonY
        };
        break;
      case left:
        offsets = {
          x: reference2.x - element.width,
          y: commonY
        };
        break;
      default:
        offsets = {
          x: reference2.x,
          y: reference2.y
        };
    }
    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
    if (mainAxis != null) {
      var len = mainAxis === "y" ? "height" : "width";
      switch (variation) {
        case start2:
          offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
          break;
        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
          break;
        default:
      }
    }
    return offsets;
  }

  // node_modules/@popperjs/core/lib/utils/detectOverflow.js
  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
    var referenceClientRect = getBoundingClientRect(state.elements.reference);
    var popperOffsets2 = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: "absolute",
      placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset;
    if (elementContext === popper && offsetData) {
      var offset3 = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function(key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
        overflowOffsets[key] += offset3[axis] * multiply;
      });
    }
    return overflowOffsets;
  }

  // node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements2 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
      return getVariation(placement2) === variation;
    }) : basePlacements;
    var allowedPlacements = placements2.filter(function(placement2) {
      return allowedAutoPlacements.indexOf(placement2) >= 0;
    });
    if (allowedPlacements.length === 0) {
      allowedPlacements = placements2;
      if (true) {
        console.error(["Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(" "));
      }
    }
    var overflows = allowedPlacements.reduce(function(acc, placement2) {
      acc[placement2] = detectOverflow(state, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding
      })[getBasePlacement(placement2)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function(a, b) {
      return overflows[a] - overflows[b];
    });
  }

  // node_modules/@popperjs/core/lib/modifiers/flip.js
  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }
    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }
  function flip(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    if (state.modifiersData[name]._skip) {
      return;
    }
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
      return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding,
        flipVariations,
        allowedAutoPlacements
      }) : placement2);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = /* @__PURE__ */ new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements2[0];
    for (var i = 0; i < placements2.length; i++) {
      var placement = placements2[i];
      var _basePlacement = getBasePlacement(placement);
      var isStartVariation = getVariation(placement) === start2;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? "width" : "height";
      var overflow = detectOverflow(state, {
        placement,
        boundary,
        rootBoundary,
        altBoundary,
        padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }
      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];
      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }
      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }
      if (checks.every(function(check2) {
        return check2;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }
      checksMap.set(placement, checks);
    }
    if (makeFallbackChecks) {
      var numberOfChecks = flipVariations ? 3 : 1;
      var _loop = function _loop2(_i2) {
        var fittingPlacement = placements2.find(function(placement2) {
          var checks2 = checksMap.get(placement2);
          if (checks2) {
            return checks2.slice(0, _i2).every(function(check2) {
              return check2;
            });
          }
        });
        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };
      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);
        if (_ret === "break")
          break;
      }
    }
    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  }
  var flip_default = {
    name: "flip",
    enabled: true,
    phase: "main",
    fn: flip,
    requiresIfExists: ["offset"],
    data: {
      _skip: false
    }
  };

  // node_modules/@popperjs/core/lib/modifiers/hide.js
  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }
    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }
  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function(side) {
      return overflow[side] >= 0;
    });
  }
  function hide(_ref) {
    var state = _ref.state, name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: "reference"
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets,
      popperEscapeOffsets,
      isReferenceHidden,
      hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-reference-hidden": isReferenceHidden,
      "data-popper-escaped": hasPopperEscaped
    });
  }
  var hide_default = {
    name: "hide",
    enabled: true,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: hide
  };

  // node_modules/@popperjs/core/lib/modifiers/offset.js
  function distanceAndSkiddingToXY(placement, rects, offset3) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
    var _ref = typeof offset3 === "function" ? offset3(Object.assign({}, rects, {
      placement
    })) : offset3, skidding = _ref[0], distance = _ref[1];
    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }
  function offset(_ref2) {
    var state = _ref2.state, options = _ref2.options, name = _ref2.name;
    var _options$offset = options.offset, offset3 = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function(acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset3);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }
    state.modifiersData[name] = data;
  }
  var offset_default = {
    name: "offset",
    enabled: true,
    phase: "main",
    requires: ["popperOffsets"],
    fn: offset
  };

  // node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
  function popperOffsets(_ref) {
    var state = _ref.state, name = _ref.name;
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: "absolute",
      placement: state.placement
    });
  }
  var popperOffsets_default = {
    name: "popperOffsets",
    enabled: true,
    phase: "read",
    fn: popperOffsets,
    data: {}
  };

  // node_modules/@popperjs/core/lib/utils/getAltAxis.js
  function getAltAxis(axis) {
    return axis === "x" ? "y" : "x";
  }

  // node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
  function preventOverflow(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary,
      rootBoundary,
      padding,
      altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets2 = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
      mainAxis: tetherOffsetValue,
      altAxis: tetherOffsetValue
    } : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
    var data = {
      x: 0,
      y: 0
    };
    if (!popperOffsets2) {
      return;
    }
    if (checkMainAxis) {
      var _offsetModifierState$;
      var mainSide = mainAxis === "y" ? top : left;
      var altSide = mainAxis === "y" ? bottom : right;
      var len = mainAxis === "y" ? "height" : "width";
      var offset3 = popperOffsets2[mainAxis];
      var min3 = offset3 + overflow[mainSide];
      var max3 = offset3 - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start2 ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start2 ? -popperRect[len] : -referenceRect[len];
      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide];
      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
      var tetherMin = offset3 + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = offset3 + maxOffset - offsetModifierValue;
      var preventedOffset = within(tether ? min(min3, tetherMin) : min3, offset3, tether ? max(max3, tetherMax) : max3);
      popperOffsets2[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset3;
    }
    if (checkAltAxis) {
      var _offsetModifierState$2;
      var _mainSide = mainAxis === "x" ? top : left;
      var _altSide = mainAxis === "x" ? bottom : right;
      var _offset = popperOffsets2[altAxis];
      var _len = altAxis === "y" ? "height" : "width";
      var _min = _offset + overflow[_mainSide];
      var _max = _offset - overflow[_altSide];
      var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
      var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
      popperOffsets2[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
    state.modifiersData[name] = data;
  }
  var preventOverflow_default = {
    name: "preventOverflow",
    enabled: true,
    phase: "main",
    fn: preventOverflow,
    requiresIfExists: ["offset"]
  };

  // node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
  function getNodeScroll(node4) {
    if (node4 === getWindow(node4) || !isHTMLElement(node4)) {
      return getWindowScroll(node4);
    } else {
      return getHTMLElementScroll(node4);
    }
  }

  // node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round(rect.width) / element.offsetWidth || 1;
    var scaleY = round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  }
  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  // node_modules/@popperjs/core/lib/utils/orderModifiers.js
  function order(modifiers2) {
    var map15 = /* @__PURE__ */ new Map();
    var visited = /* @__PURE__ */ new Set();
    var result2 = [];
    modifiers2.forEach(function(modifier) {
      map15.set(modifier.name, modifier);
    });
    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function(dep) {
        if (!visited.has(dep)) {
          var depModifier = map15.get(dep);
          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result2.push(modifier);
    }
    modifiers2.forEach(function(modifier) {
      if (!visited.has(modifier.name)) {
        sort(modifier);
      }
    });
    return result2;
  }
  function orderModifiers(modifiers2) {
    var orderedModifiers = order(modifiers2);
    return modifierPhases.reduce(function(acc, phase) {
      return acc.concat(orderedModifiers.filter(function(modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  // node_modules/@popperjs/core/lib/utils/debounce.js
  function debounce(fn2) {
    var pending;
    return function() {
      if (!pending) {
        pending = new Promise(function(resolve7) {
          Promise.resolve().then(function() {
            pending = void 0;
            resolve7(fn2());
          });
        });
      }
      return pending;
    };
  }

  // node_modules/@popperjs/core/lib/utils/format.js
  function format(str) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return [].concat(args).reduce(function(p, c) {
      return p.replace(/%s/, c);
    }, str);
  }

  // node_modules/@popperjs/core/lib/utils/validateModifiers.js
  var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
  var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
  var VALID_PROPERTIES = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
  function validateModifiers(modifiers2) {
    modifiers2.forEach(function(modifier) {
      [].concat(Object.keys(modifier), VALID_PROPERTIES).filter(function(value, index2, self2) {
        return self2.indexOf(value) === index2;
      }).forEach(function(key) {
        switch (key) {
          case "name":
            if (typeof modifier.name !== "string") {
              console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', '"' + String(modifier.name) + '"'));
            }
            break;
          case "enabled":
            if (typeof modifier.enabled !== "boolean") {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', '"' + String(modifier.enabled) + '"'));
            }
            break;
          case "phase":
            if (modifierPhases.indexOf(modifier.phase) < 0) {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(", "), '"' + String(modifier.phase) + '"'));
            }
            break;
          case "fn":
            if (typeof modifier.fn !== "function") {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', '"' + String(modifier.fn) + '"'));
            }
            break;
          case "effect":
            if (modifier.effect != null && typeof modifier.effect !== "function") {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', '"' + String(modifier.fn) + '"'));
            }
            break;
          case "requires":
            if (modifier.requires != null && !Array.isArray(modifier.requires)) {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', '"' + String(modifier.requires) + '"'));
            }
            break;
          case "requiresIfExists":
            if (!Array.isArray(modifier.requiresIfExists)) {
              console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', '"' + String(modifier.requiresIfExists) + '"'));
            }
            break;
          case "options":
          case "data":
            break;
          default:
            console.error('PopperJS: an invalid property has been provided to the "' + modifier.name + '" modifier, valid properties are ' + VALID_PROPERTIES.map(function(s) {
              return '"' + s + '"';
            }).join(", ") + '; but "' + key + '" was provided.');
        }
        modifier.requires && modifier.requires.forEach(function(requirement) {
          if (modifiers2.find(function(mod) {
            return mod.name === requirement;
          }) == null) {
            console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
          }
        });
      });
    });
  }

  // node_modules/@popperjs/core/lib/utils/uniqueBy.js
  function uniqueBy(arr, fn2) {
    var identifiers = /* @__PURE__ */ new Set();
    return arr.filter(function(item) {
      var identifier = fn2(item);
      if (!identifiers.has(identifier)) {
        identifiers.add(identifier);
        return true;
      }
    });
  }

  // node_modules/@popperjs/core/lib/utils/mergeByName.js
  function mergeByName(modifiers2) {
    var merged = modifiers2.reduce(function(merged2, current) {
      var existing = merged2[current.name];
      merged2[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged2;
    }, {});
    return Object.keys(merged).map(function(key) {
      return merged[key];
    });
  }

  // node_modules/@popperjs/core/lib/createPopper.js
  var INVALID_ELEMENT_ERROR = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.";
  var INFINITE_LOOP_ERROR = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.";
  var DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
  };
  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return !args.some(function(element) {
      return !(element && typeof element.getBoundingClientRect === "function");
    });
  }
  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }
    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper2(reference2, popper2, options) {
      if (options === void 0) {
        options = defaultOptions2;
      }
      var state = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions2),
        modifiersData: {},
        elements: {
          reference: reference2,
          popper: popper2
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state,
        setOptions: function setOptions(setOptionsAction) {
          var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions2, state.options, options2);
          state.scrollParents = {
            reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
            popper: listScrollParents(popper2)
          };
          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
          state.orderedModifiers = orderedModifiers.filter(function(m) {
            return m.enabled;
          });
          if (true) {
            var modifiers2 = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function(_ref) {
              var name = _ref.name;
              return name;
            });
            validateModifiers(modifiers2);
            if (getBasePlacement(state.options.placement) === auto) {
              var flipModifier = state.orderedModifiers.find(function(_ref2) {
                var name = _ref2.name;
                return name === "flip";
              });
              if (!flipModifier) {
                console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
              }
            }
            var _getComputedStyle = getComputedStyle2(popper2), marginTop = _getComputedStyle.marginTop, marginRight = _getComputedStyle.marginRight, marginBottom = _getComputedStyle.marginBottom, marginLeft = _getComputedStyle.marginLeft;
            if ([marginTop, marginRight, marginBottom, marginLeft].some(function(margin) {
              return parseFloat(margin);
            })) {
              console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "));
            }
          }
          runModifierEffects();
          return instance.update();
        },
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }
          var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
          if (!areValidElements(reference3, popper3)) {
            if (true) {
              console.error(INVALID_ELEMENT_ERROR);
            }
            return;
          }
          state.rects = {
            reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
            popper: getLayoutRect(popper3)
          };
          state.reset = false;
          state.placement = state.options.placement;
          state.orderedModifiers.forEach(function(modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });
          var __debug_loops__ = 0;
          for (var index2 = 0; index2 < state.orderedModifiers.length; index2++) {
            if (true) {
              __debug_loops__ += 1;
              if (__debug_loops__ > 100) {
                console.error(INFINITE_LOOP_ERROR);
                break;
              }
            }
            if (state.reset === true) {
              state.reset = false;
              index2 = -1;
              continue;
            }
            var _state$orderedModifie = state.orderedModifiers[index2], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
            if (typeof fn2 === "function") {
              state = fn2({
                state,
                options: _options,
                name,
                instance
              }) || state;
            }
          }
        },
        update: debounce(function() {
          return new Promise(function(resolve7) {
            instance.forceUpdate();
            resolve7(state);
          });
        }),
        destroy: function destroy5() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };
      if (!areValidElements(reference2, popper2)) {
        if (true) {
          console.error(INVALID_ELEMENT_ERROR);
        }
        return instance;
      }
      instance.setOptions(options).then(function(state2) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state2);
        }
      });
      function runModifierEffects() {
        state.orderedModifiers.forEach(function(_ref3) {
          var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect5 = _ref3.effect;
          if (typeof effect5 === "function") {
            var cleanupFn = effect5({
              state,
              name,
              instance,
              options: options2
            });
            var noopFn = function noopFn2() {
            };
            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }
      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function(fn2) {
          return fn2();
        });
        effectCleanupFns = [];
      }
      return instance;
    };
  }

  // node_modules/@popperjs/core/lib/popper.js
  var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
  var createPopper = /* @__PURE__ */ popperGenerator({
    defaultModifiers
  });

  // node_modules/frontend-helpers/javascript/src/controllers/notification-controller.js
  var NotificationController = class extends DisappearController {
    connect() {
      this.closed = false;
      if (!this.hasDelayValue) {
        return;
      }
      setTimeout(() => this.close(), this.delayValue);
    }
  };
  __publicField(NotificationController, "values", {
    delay: Number,
    remove: Boolean
  });

  // node_modules/frontend-helpers/javascript/src/controllers/slim-select-controller.js
  var SlimSelectController = class extends Controller {
    async connect() {
      const { default: SlimSelect } = await Promise.resolve().then(() => (init_slimselect_min(), slimselect_min_exports));
      const options = {
        select: this.selectTarget,
        placeholder: this.hasPlaceholderValue && this.placeholderValue,
        showContent: this.showContentValue === "undefined" ? "down" : this.showContentValue,
        showSearch: this.showSearchValue,
        searchPlaceholder: this.searchPlaceholderValue,
        addToBody: this.addToBodyValue,
        closeOnSelect: this.closeOnSelectValue,
        allowDeselectOption: this.allowDeselectOptionValue,
        addable: this.addable()
      };
      if (this.hasInnerHTML()) {
        options.data = this.dataWithHTML();
      }
      this.select = new SlimSelect(options);
    }
    disconnect() {
      this.select.destroy();
    }
    addable() {
      if (!this.addItemsValue)
        return;
      return function(value) {
        return value;
      };
    }
    dataWithHTML() {
      return Array.from(this.selectTarget.children).map((option) => {
        return {
          text: option.text,
          value: option.value,
          innerHTML: option.dataset.innerHtml,
          selected: option.selected,
          disabled: option.disabled
        };
      });
    }
    hasInnerHTML() {
      const firstOption = this.selectTarget.children[0];
      return firstOption && !!firstOption.dataset.innerHtml;
    }
    selectAll() {
      const allValues = Array.from(this.selectTarget.children).map((option) => option.value);
      this.select.set(allValues);
      this.selectAllButtonTarget.style.display = "none";
      this.deselectAllButtonTarget.style.display = "block";
    }
    deselectAll() {
      this.select.set([]);
      this.deselectAllButtonTarget.style.display = "none";
      this.selectAllButtonTarget.style.display = "block";
    }
  };
  __publicField(SlimSelectController, "values", {
    placeholder: String,
    addItems: Boolean,
    showContent: String,
    showSearch: Boolean,
    searchPlaceholder: String,
    addToBody: Boolean,
    closeOnSelect: Boolean,
    allowDeselectOption: Boolean
  });
  __publicField(SlimSelectController, "targets", ["select", "selectAllButton", "deselectAllButton"]);

  // node_modules/orderedmap/index.es.js
  function OrderedMap(content2) {
    this.content = content2;
  }
  OrderedMap.prototype = {
    constructor: OrderedMap,
    find: function(key) {
      for (var i = 0; i < this.content.length; i += 2)
        if (this.content[i] === key)
          return i;
      return -1;
    },
    get: function(key) {
      var found2 = this.find(key);
      return found2 == -1 ? void 0 : this.content[found2 + 1];
    },
    update: function(key, value, newKey) {
      var self2 = newKey && newKey != key ? this.remove(newKey) : this;
      var found2 = self2.find(key), content2 = self2.content.slice();
      if (found2 == -1) {
        content2.push(newKey || key, value);
      } else {
        content2[found2 + 1] = value;
        if (newKey)
          content2[found2] = newKey;
      }
      return new OrderedMap(content2);
    },
    remove: function(key) {
      var found2 = this.find(key);
      if (found2 == -1)
        return this;
      var content2 = this.content.slice();
      content2.splice(found2, 2);
      return new OrderedMap(content2);
    },
    addToStart: function(key, value) {
      return new OrderedMap([key, value].concat(this.remove(key).content));
    },
    addToEnd: function(key, value) {
      var content2 = this.remove(key).content.slice();
      content2.push(key, value);
      return new OrderedMap(content2);
    },
    addBefore: function(place, key, value) {
      var without = this.remove(key), content2 = without.content.slice();
      var found2 = without.find(place);
      content2.splice(found2 == -1 ? content2.length : found2, 0, key, value);
      return new OrderedMap(content2);
    },
    forEach: function(f) {
      for (var i = 0; i < this.content.length; i += 2)
        f(this.content[i], this.content[i + 1]);
    },
    prepend: function(map15) {
      map15 = OrderedMap.from(map15);
      if (!map15.size)
        return this;
      return new OrderedMap(map15.content.concat(this.subtract(map15).content));
    },
    append: function(map15) {
      map15 = OrderedMap.from(map15);
      if (!map15.size)
        return this;
      return new OrderedMap(this.subtract(map15).content.concat(map15.content));
    },
    subtract: function(map15) {
      var result2 = this;
      map15 = OrderedMap.from(map15);
      for (var i = 0; i < map15.content.length; i += 2)
        result2 = result2.remove(map15.content[i]);
      return result2;
    },
    get size() {
      return this.content.length >> 1;
    }
  };
  OrderedMap.from = function(value) {
    if (value instanceof OrderedMap)
      return value;
    var content2 = [];
    if (value)
      for (var prop in value)
        content2.push(prop, value[prop]);
    return new OrderedMap(content2);
  };
  var orderedmap = OrderedMap;
  var index_es_default = orderedmap;

  // node_modules/prosemirror-model/dist/index.es.js
  function findDiffStart(a, b, pos) {
    for (var i = 0; ; i++) {
      if (i == a.childCount || i == b.childCount) {
        return a.childCount == b.childCount ? null : pos;
      }
      var childA = a.child(i), childB = b.child(i);
      if (childA == childB) {
        pos += childA.nodeSize;
        continue;
      }
      if (!childA.sameMarkup(childB)) {
        return pos;
      }
      if (childA.isText && childA.text != childB.text) {
        for (var j = 0; childA.text[j] == childB.text[j]; j++) {
          pos++;
        }
        return pos;
      }
      if (childA.content.size || childB.content.size) {
        var inner = findDiffStart(childA.content, childB.content, pos + 1);
        if (inner != null) {
          return inner;
        }
      }
      pos += childA.nodeSize;
    }
  }
  function findDiffEnd(a, b, posA, posB) {
    for (var iA = a.childCount, iB = b.childCount; ; ) {
      if (iA == 0 || iB == 0) {
        return iA == iB ? null : { a: posA, b: posB };
      }
      var childA = a.child(--iA), childB = b.child(--iB), size = childA.nodeSize;
      if (childA == childB) {
        posA -= size;
        posB -= size;
        continue;
      }
      if (!childA.sameMarkup(childB)) {
        return { a: posA, b: posB };
      }
      if (childA.isText && childA.text != childB.text) {
        var same = 0, minSize = Math.min(childA.text.length, childB.text.length);
        while (same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]) {
          same++;
          posA--;
          posB--;
        }
        return { a: posA, b: posB };
      }
      if (childA.content.size || childB.content.size) {
        var inner = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1);
        if (inner) {
          return inner;
        }
      }
      posA -= size;
      posB -= size;
    }
  }
  var Fragment = function Fragment2(content2, size) {
    this.content = content2;
    this.size = size || 0;
    if (size == null) {
      for (var i = 0; i < content2.length; i++) {
        this.size += content2[i].nodeSize;
      }
    }
  };
  var prototypeAccessors = { firstChild: { configurable: true }, lastChild: { configurable: true }, childCount: { configurable: true } };
  Fragment.prototype.nodesBetween = function nodesBetween(from4, to, f, nodeStart, parent) {
    if (nodeStart === void 0)
      nodeStart = 0;
    for (var i = 0, pos = 0; pos < to; i++) {
      var child3 = this.content[i], end3 = pos + child3.nodeSize;
      if (end3 > from4 && f(child3, nodeStart + pos, parent, i) !== false && child3.content.size) {
        var start5 = pos + 1;
        child3.nodesBetween(Math.max(0, from4 - start5), Math.min(child3.content.size, to - start5), f, nodeStart + start5);
      }
      pos = end3;
    }
  };
  Fragment.prototype.descendants = function descendants(f) {
    this.nodesBetween(0, this.size, f);
  };
  Fragment.prototype.textBetween = function textBetween(from4, to, blockSeparator, leafText) {
    var text2 = "", separated = true;
    this.nodesBetween(from4, to, function(node4, pos) {
      if (node4.isText) {
        text2 += node4.text.slice(Math.max(from4, pos) - pos, to - pos);
        separated = !blockSeparator;
      } else if (node4.isLeaf && leafText) {
        text2 += typeof leafText === "function" ? leafText(node4) : leafText;
        separated = !blockSeparator;
      } else if (!separated && node4.isBlock) {
        text2 += blockSeparator;
        separated = true;
      }
    }, 0);
    return text2;
  };
  Fragment.prototype.append = function append(other) {
    if (!other.size) {
      return this;
    }
    if (!this.size) {
      return other;
    }
    var last = this.lastChild, first2 = other.firstChild, content2 = this.content.slice(), i = 0;
    if (last.isText && last.sameMarkup(first2)) {
      content2[content2.length - 1] = last.withText(last.text + first2.text);
      i = 1;
    }
    for (; i < other.content.length; i++) {
      content2.push(other.content[i]);
    }
    return new Fragment(content2, this.size + other.size);
  };
  Fragment.prototype.cut = function cut(from4, to) {
    if (to == null) {
      to = this.size;
    }
    if (from4 == 0 && to == this.size) {
      return this;
    }
    var result2 = [], size = 0;
    if (to > from4) {
      for (var i = 0, pos = 0; pos < to; i++) {
        var child3 = this.content[i], end3 = pos + child3.nodeSize;
        if (end3 > from4) {
          if (pos < from4 || end3 > to) {
            if (child3.isText) {
              child3 = child3.cut(Math.max(0, from4 - pos), Math.min(child3.text.length, to - pos));
            } else {
              child3 = child3.cut(Math.max(0, from4 - pos - 1), Math.min(child3.content.size, to - pos - 1));
            }
          }
          result2.push(child3);
          size += child3.nodeSize;
        }
        pos = end3;
      }
    }
    return new Fragment(result2, size);
  };
  Fragment.prototype.cutByIndex = function cutByIndex(from4, to) {
    if (from4 == to) {
      return Fragment.empty;
    }
    if (from4 == 0 && to == this.content.length) {
      return this;
    }
    return new Fragment(this.content.slice(from4, to));
  };
  Fragment.prototype.replaceChild = function replaceChild(index2, node4) {
    var current = this.content[index2];
    if (current == node4) {
      return this;
    }
    var copy5 = this.content.slice();
    var size = this.size + node4.nodeSize - current.nodeSize;
    copy5[index2] = node4;
    return new Fragment(copy5, size);
  };
  Fragment.prototype.addToStart = function addToStart(node4) {
    return new Fragment([node4].concat(this.content), this.size + node4.nodeSize);
  };
  Fragment.prototype.addToEnd = function addToEnd(node4) {
    return new Fragment(this.content.concat(node4), this.size + node4.nodeSize);
  };
  Fragment.prototype.eq = function eq(other) {
    if (this.content.length != other.content.length) {
      return false;
    }
    for (var i = 0; i < this.content.length; i++) {
      if (!this.content[i].eq(other.content[i])) {
        return false;
      }
    }
    return true;
  };
  prototypeAccessors.firstChild.get = function() {
    return this.content.length ? this.content[0] : null;
  };
  prototypeAccessors.lastChild.get = function() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  };
  prototypeAccessors.childCount.get = function() {
    return this.content.length;
  };
  Fragment.prototype.child = function child(index2) {
    var found2 = this.content[index2];
    if (!found2) {
      throw new RangeError("Index " + index2 + " out of range for " + this);
    }
    return found2;
  };
  Fragment.prototype.maybeChild = function maybeChild(index2) {
    return this.content[index2];
  };
  Fragment.prototype.forEach = function forEach(f) {
    for (var i = 0, p = 0; i < this.content.length; i++) {
      var child3 = this.content[i];
      f(child3, p, i);
      p += child3.nodeSize;
    }
  };
  Fragment.prototype.findDiffStart = function findDiffStart$1(other, pos) {
    if (pos === void 0)
      pos = 0;
    return findDiffStart(this, other, pos);
  };
  Fragment.prototype.findDiffEnd = function findDiffEnd$1(other, pos, otherPos) {
    if (pos === void 0)
      pos = this.size;
    if (otherPos === void 0)
      otherPos = other.size;
    return findDiffEnd(this, other, pos, otherPos);
  };
  Fragment.prototype.findIndex = function findIndex(pos, round2) {
    if (round2 === void 0)
      round2 = -1;
    if (pos == 0) {
      return retIndex(0, pos);
    }
    if (pos == this.size) {
      return retIndex(this.content.length, pos);
    }
    if (pos > this.size || pos < 0) {
      throw new RangeError("Position " + pos + " outside of fragment (" + this + ")");
    }
    for (var i = 0, curPos = 0; ; i++) {
      var cur = this.child(i), end3 = curPos + cur.nodeSize;
      if (end3 >= pos) {
        if (end3 == pos || round2 > 0) {
          return retIndex(i + 1, end3);
        }
        return retIndex(i, curPos);
      }
      curPos = end3;
    }
  };
  Fragment.prototype.toString = function toString() {
    return "<" + this.toStringInner() + ">";
  };
  Fragment.prototype.toStringInner = function toStringInner() {
    return this.content.join(", ");
  };
  Fragment.prototype.toJSON = function toJSON() {
    return this.content.length ? this.content.map(function(n) {
      return n.toJSON();
    }) : null;
  };
  Fragment.fromJSON = function fromJSON(schema, value) {
    if (!value) {
      return Fragment.empty;
    }
    if (!Array.isArray(value)) {
      throw new RangeError("Invalid input for Fragment.fromJSON");
    }
    return new Fragment(value.map(schema.nodeFromJSON));
  };
  Fragment.fromArray = function fromArray(array) {
    if (!array.length) {
      return Fragment.empty;
    }
    var joined, size = 0;
    for (var i = 0; i < array.length; i++) {
      var node4 = array[i];
      size += node4.nodeSize;
      if (i && node4.isText && array[i - 1].sameMarkup(node4)) {
        if (!joined) {
          joined = array.slice(0, i);
        }
        joined[joined.length - 1] = node4.withText(joined[joined.length - 1].text + node4.text);
      } else if (joined) {
        joined.push(node4);
      }
    }
    return new Fragment(joined || array, size);
  };
  Fragment.from = function from(nodes) {
    if (!nodes) {
      return Fragment.empty;
    }
    if (nodes instanceof Fragment) {
      return nodes;
    }
    if (Array.isArray(nodes)) {
      return this.fromArray(nodes);
    }
    if (nodes.attrs) {
      return new Fragment([nodes], nodes.nodeSize);
    }
    throw new RangeError("Can not convert " + nodes + " to a Fragment" + (nodes.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  };
  Object.defineProperties(Fragment.prototype, prototypeAccessors);
  var found = { index: 0, offset: 0 };
  function retIndex(index2, offset3) {
    found.index = index2;
    found.offset = offset3;
    return found;
  }
  Fragment.empty = new Fragment([], 0);
  function compareDeep(a, b) {
    if (a === b) {
      return true;
    }
    if (!(a && typeof a == "object") || !(b && typeof b == "object")) {
      return false;
    }
    var array = Array.isArray(a);
    if (Array.isArray(b) != array) {
      return false;
    }
    if (array) {
      if (a.length != b.length) {
        return false;
      }
      for (var i = 0; i < a.length; i++) {
        if (!compareDeep(a[i], b[i])) {
          return false;
        }
      }
    } else {
      for (var p in a) {
        if (!(p in b) || !compareDeep(a[p], b[p])) {
          return false;
        }
      }
      for (var p$1 in b) {
        if (!(p$1 in a)) {
          return false;
        }
      }
    }
    return true;
  }
  var Mark = function Mark2(type, attrs) {
    this.type = type;
    this.attrs = attrs;
  };
  Mark.prototype.addToSet = function addToSet(set2) {
    var copy5, placed = false;
    for (var i = 0; i < set2.length; i++) {
      var other = set2[i];
      if (this.eq(other)) {
        return set2;
      }
      if (this.type.excludes(other.type)) {
        if (!copy5) {
          copy5 = set2.slice(0, i);
        }
      } else if (other.type.excludes(this.type)) {
        return set2;
      } else {
        if (!placed && other.type.rank > this.type.rank) {
          if (!copy5) {
            copy5 = set2.slice(0, i);
          }
          copy5.push(this);
          placed = true;
        }
        if (copy5) {
          copy5.push(other);
        }
      }
    }
    if (!copy5) {
      copy5 = set2.slice();
    }
    if (!placed) {
      copy5.push(this);
    }
    return copy5;
  };
  Mark.prototype.removeFromSet = function removeFromSet(set2) {
    for (var i = 0; i < set2.length; i++) {
      if (this.eq(set2[i])) {
        return set2.slice(0, i).concat(set2.slice(i + 1));
      }
    }
    return set2;
  };
  Mark.prototype.isInSet = function isInSet(set2) {
    for (var i = 0; i < set2.length; i++) {
      if (this.eq(set2[i])) {
        return true;
      }
    }
    return false;
  };
  Mark.prototype.eq = function eq2(other) {
    return this == other || this.type == other.type && compareDeep(this.attrs, other.attrs);
  };
  Mark.prototype.toJSON = function toJSON2() {
    var obj = { type: this.type.name };
    for (var _ in this.attrs) {
      obj.attrs = this.attrs;
      break;
    }
    return obj;
  };
  Mark.fromJSON = function fromJSON2(schema, json) {
    if (!json) {
      throw new RangeError("Invalid input for Mark.fromJSON");
    }
    var type = schema.marks[json.type];
    if (!type) {
      throw new RangeError("There is no mark type " + json.type + " in this schema");
    }
    return type.create(json.attrs);
  };
  Mark.sameSet = function sameSet(a, b) {
    if (a == b) {
      return true;
    }
    if (a.length != b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i++) {
      if (!a[i].eq(b[i])) {
        return false;
      }
    }
    return true;
  };
  Mark.setFrom = function setFrom(marks2) {
    if (!marks2 || marks2.length == 0) {
      return Mark.none;
    }
    if (marks2 instanceof Mark) {
      return [marks2];
    }
    var copy5 = marks2.slice();
    copy5.sort(function(a, b) {
      return a.type.rank - b.type.rank;
    });
    return copy5;
  };
  Mark.none = [];
  function ReplaceError(message) {
    var err2 = Error.call(this, message);
    err2.__proto__ = ReplaceError.prototype;
    return err2;
  }
  ReplaceError.prototype = Object.create(Error.prototype);
  ReplaceError.prototype.constructor = ReplaceError;
  ReplaceError.prototype.name = "ReplaceError";
  var Slice = function Slice2(content2, openStart, openEnd) {
    this.content = content2;
    this.openStart = openStart;
    this.openEnd = openEnd;
  };
  var prototypeAccessors$1 = { size: { configurable: true } };
  prototypeAccessors$1.size.get = function() {
    return this.content.size - this.openStart - this.openEnd;
  };
  Slice.prototype.insertAt = function insertAt(pos, fragment) {
    var content2 = insertInto(this.content, pos + this.openStart, fragment, null);
    return content2 && new Slice(content2, this.openStart, this.openEnd);
  };
  Slice.prototype.removeBetween = function removeBetween(from4, to) {
    return new Slice(removeRange(this.content, from4 + this.openStart, to + this.openStart), this.openStart, this.openEnd);
  };
  Slice.prototype.eq = function eq3(other) {
    return this.content.eq(other.content) && this.openStart == other.openStart && this.openEnd == other.openEnd;
  };
  Slice.prototype.toString = function toString2() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  };
  Slice.prototype.toJSON = function toJSON3() {
    if (!this.content.size) {
      return null;
    }
    var json = { content: this.content.toJSON() };
    if (this.openStart > 0) {
      json.openStart = this.openStart;
    }
    if (this.openEnd > 0) {
      json.openEnd = this.openEnd;
    }
    return json;
  };
  Slice.fromJSON = function fromJSON3(schema, json) {
    if (!json) {
      return Slice.empty;
    }
    var openStart = json.openStart || 0, openEnd = json.openEnd || 0;
    if (typeof openStart != "number" || typeof openEnd != "number") {
      throw new RangeError("Invalid input for Slice.fromJSON");
    }
    return new Slice(Fragment.fromJSON(schema, json.content), openStart, openEnd);
  };
  Slice.maxOpen = function maxOpen(fragment, openIsolating) {
    if (openIsolating === void 0)
      openIsolating = true;
    var openStart = 0, openEnd = 0;
    for (var n = fragment.firstChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.firstChild) {
      openStart++;
    }
    for (var n$1 = fragment.lastChild; n$1 && !n$1.isLeaf && (openIsolating || !n$1.type.spec.isolating); n$1 = n$1.lastChild) {
      openEnd++;
    }
    return new Slice(fragment, openStart, openEnd);
  };
  Object.defineProperties(Slice.prototype, prototypeAccessors$1);
  function removeRange(content2, from4, to) {
    var ref = content2.findIndex(from4);
    var index2 = ref.index;
    var offset3 = ref.offset;
    var child3 = content2.maybeChild(index2);
    var ref$1 = content2.findIndex(to);
    var indexTo = ref$1.index;
    var offsetTo = ref$1.offset;
    if (offset3 == from4 || child3.isText) {
      if (offsetTo != to && !content2.child(indexTo).isText) {
        throw new RangeError("Removing non-flat range");
      }
      return content2.cut(0, from4).append(content2.cut(to));
    }
    if (index2 != indexTo) {
      throw new RangeError("Removing non-flat range");
    }
    return content2.replaceChild(index2, child3.copy(removeRange(child3.content, from4 - offset3 - 1, to - offset3 - 1)));
  }
  function insertInto(content2, dist, insert, parent) {
    var ref = content2.findIndex(dist);
    var index2 = ref.index;
    var offset3 = ref.offset;
    var child3 = content2.maybeChild(index2);
    if (offset3 == dist || child3.isText) {
      if (parent && !parent.canReplace(index2, index2, insert)) {
        return null;
      }
      return content2.cut(0, dist).append(insert).append(content2.cut(dist));
    }
    var inner = insertInto(child3.content, dist - offset3 - 1, insert);
    return inner && content2.replaceChild(index2, child3.copy(inner));
  }
  Slice.empty = new Slice(Fragment.empty, 0, 0);
  function replace($from, $to, slice4) {
    if (slice4.openStart > $from.depth) {
      throw new ReplaceError("Inserted content deeper than insertion position");
    }
    if ($from.depth - slice4.openStart != $to.depth - slice4.openEnd) {
      throw new ReplaceError("Inconsistent open depths");
    }
    return replaceOuter($from, $to, slice4, 0);
  }
  function replaceOuter($from, $to, slice4, depth) {
    var index2 = $from.index(depth), node4 = $from.node(depth);
    if (index2 == $to.index(depth) && depth < $from.depth - slice4.openStart) {
      var inner = replaceOuter($from, $to, slice4, depth + 1);
      return node4.copy(node4.content.replaceChild(index2, inner));
    } else if (!slice4.content.size) {
      return close(node4, replaceTwoWay($from, $to, depth));
    } else if (!slice4.openStart && !slice4.openEnd && $from.depth == depth && $to.depth == depth) {
      var parent = $from.parent, content2 = parent.content;
      return close(parent, content2.cut(0, $from.parentOffset).append(slice4.content).append(content2.cut($to.parentOffset)));
    } else {
      var ref = prepareSliceForReplace(slice4, $from);
      var start5 = ref.start;
      var end3 = ref.end;
      return close(node4, replaceThreeWay($from, start5, end3, $to, depth));
    }
  }
  function checkJoin(main2, sub) {
    if (!sub.type.compatibleContent(main2.type)) {
      throw new ReplaceError("Cannot join " + sub.type.name + " onto " + main2.type.name);
    }
  }
  function joinable($before, $after, depth) {
    var node4 = $before.node(depth);
    checkJoin(node4, $after.node(depth));
    return node4;
  }
  function addNode(child3, target) {
    var last = target.length - 1;
    if (last >= 0 && child3.isText && child3.sameMarkup(target[last])) {
      target[last] = child3.withText(target[last].text + child3.text);
    } else {
      target.push(child3);
    }
  }
  function addRange($start, $end, depth, target) {
    var node4 = ($end || $start).node(depth);
    var startIndex = 0, endIndex = $end ? $end.index(depth) : node4.childCount;
    if ($start) {
      startIndex = $start.index(depth);
      if ($start.depth > depth) {
        startIndex++;
      } else if ($start.textOffset) {
        addNode($start.nodeAfter, target);
        startIndex++;
      }
    }
    for (var i = startIndex; i < endIndex; i++) {
      addNode(node4.child(i), target);
    }
    if ($end && $end.depth == depth && $end.textOffset) {
      addNode($end.nodeBefore, target);
    }
  }
  function close(node4, content2) {
    if (!node4.type.validContent(content2)) {
      throw new ReplaceError("Invalid content for node " + node4.type.name);
    }
    return node4.copy(content2);
  }
  function replaceThreeWay($from, $start, $end, $to, depth) {
    var openStart = $from.depth > depth && joinable($from, $start, depth + 1);
    var openEnd = $to.depth > depth && joinable($end, $to, depth + 1);
    var content2 = [];
    addRange(null, $from, depth, content2);
    if (openStart && openEnd && $start.index(depth) == $end.index(depth)) {
      checkJoin(openStart, openEnd);
      addNode(close(openStart, replaceThreeWay($from, $start, $end, $to, depth + 1)), content2);
    } else {
      if (openStart) {
        addNode(close(openStart, replaceTwoWay($from, $start, depth + 1)), content2);
      }
      addRange($start, $end, depth, content2);
      if (openEnd) {
        addNode(close(openEnd, replaceTwoWay($end, $to, depth + 1)), content2);
      }
    }
    addRange($to, null, depth, content2);
    return new Fragment(content2);
  }
  function replaceTwoWay($from, $to, depth) {
    var content2 = [];
    addRange(null, $from, depth, content2);
    if ($from.depth > depth) {
      var type = joinable($from, $to, depth + 1);
      addNode(close(type, replaceTwoWay($from, $to, depth + 1)), content2);
    }
    addRange($to, null, depth, content2);
    return new Fragment(content2);
  }
  function prepareSliceForReplace(slice4, $along) {
    var extra = $along.depth - slice4.openStart, parent = $along.node(extra);
    var node4 = parent.copy(slice4.content);
    for (var i = extra - 1; i >= 0; i--) {
      node4 = $along.node(i).copy(Fragment.from(node4));
    }
    return {
      start: node4.resolveNoCache(slice4.openStart + extra),
      end: node4.resolveNoCache(node4.content.size - slice4.openEnd - extra)
    };
  }
  var ResolvedPos = function ResolvedPos2(pos, path, parentOffset) {
    this.pos = pos;
    this.path = path;
    this.depth = path.length / 3 - 1;
    this.parentOffset = parentOffset;
  };
  var prototypeAccessors$2 = { parent: { configurable: true }, doc: { configurable: true }, textOffset: { configurable: true }, nodeAfter: { configurable: true }, nodeBefore: { configurable: true } };
  ResolvedPos.prototype.resolveDepth = function resolveDepth(val) {
    if (val == null) {
      return this.depth;
    }
    if (val < 0) {
      return this.depth + val;
    }
    return val;
  };
  prototypeAccessors$2.parent.get = function() {
    return this.node(this.depth);
  };
  prototypeAccessors$2.doc.get = function() {
    return this.node(0);
  };
  ResolvedPos.prototype.node = function node(depth) {
    return this.path[this.resolveDepth(depth) * 3];
  };
  ResolvedPos.prototype.index = function index(depth) {
    return this.path[this.resolveDepth(depth) * 3 + 1];
  };
  ResolvedPos.prototype.indexAfter = function indexAfter(depth) {
    depth = this.resolveDepth(depth);
    return this.index(depth) + (depth == this.depth && !this.textOffset ? 0 : 1);
  };
  ResolvedPos.prototype.start = function start3(depth) {
    depth = this.resolveDepth(depth);
    return depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
  };
  ResolvedPos.prototype.end = function end2(depth) {
    depth = this.resolveDepth(depth);
    return this.start(depth) + this.node(depth).content.size;
  };
  ResolvedPos.prototype.before = function before(depth) {
    depth = this.resolveDepth(depth);
    if (!depth) {
      throw new RangeError("There is no position before the top-level node");
    }
    return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1];
  };
  ResolvedPos.prototype.after = function after(depth) {
    depth = this.resolveDepth(depth);
    if (!depth) {
      throw new RangeError("There is no position after the top-level node");
    }
    return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1] + this.path[depth * 3].nodeSize;
  };
  prototypeAccessors$2.textOffset.get = function() {
    return this.pos - this.path[this.path.length - 1];
  };
  prototypeAccessors$2.nodeAfter.get = function() {
    var parent = this.parent, index2 = this.index(this.depth);
    if (index2 == parent.childCount) {
      return null;
    }
    var dOff = this.pos - this.path[this.path.length - 1], child3 = parent.child(index2);
    return dOff ? parent.child(index2).cut(dOff) : child3;
  };
  prototypeAccessors$2.nodeBefore.get = function() {
    var index2 = this.index(this.depth);
    var dOff = this.pos - this.path[this.path.length - 1];
    if (dOff) {
      return this.parent.child(index2).cut(0, dOff);
    }
    return index2 == 0 ? null : this.parent.child(index2 - 1);
  };
  ResolvedPos.prototype.posAtIndex = function posAtIndex(index2, depth) {
    depth = this.resolveDepth(depth);
    var node4 = this.path[depth * 3], pos = depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
    for (var i = 0; i < index2; i++) {
      pos += node4.child(i).nodeSize;
    }
    return pos;
  };
  ResolvedPos.prototype.marks = function marks() {
    var parent = this.parent, index2 = this.index();
    if (parent.content.size == 0) {
      return Mark.none;
    }
    if (this.textOffset) {
      return parent.child(index2).marks;
    }
    var main2 = parent.maybeChild(index2 - 1), other = parent.maybeChild(index2);
    if (!main2) {
      var tmp = main2;
      main2 = other;
      other = tmp;
    }
    var marks2 = main2.marks;
    for (var i = 0; i < marks2.length; i++) {
      if (marks2[i].type.spec.inclusive === false && (!other || !marks2[i].isInSet(other.marks))) {
        marks2 = marks2[i--].removeFromSet(marks2);
      }
    }
    return marks2;
  };
  ResolvedPos.prototype.marksAcross = function marksAcross($end) {
    var after2 = this.parent.maybeChild(this.index());
    if (!after2 || !after2.isInline) {
      return null;
    }
    var marks2 = after2.marks, next = $end.parent.maybeChild($end.index());
    for (var i = 0; i < marks2.length; i++) {
      if (marks2[i].type.spec.inclusive === false && (!next || !marks2[i].isInSet(next.marks))) {
        marks2 = marks2[i--].removeFromSet(marks2);
      }
    }
    return marks2;
  };
  ResolvedPos.prototype.sharedDepth = function sharedDepth(pos) {
    for (var depth = this.depth; depth > 0; depth--) {
      if (this.start(depth) <= pos && this.end(depth) >= pos) {
        return depth;
      }
    }
    return 0;
  };
  ResolvedPos.prototype.blockRange = function blockRange(other, pred) {
    if (other === void 0)
      other = this;
    if (other.pos < this.pos) {
      return other.blockRange(this);
    }
    for (var d = this.depth - (this.parent.inlineContent || this.pos == other.pos ? 1 : 0); d >= 0; d--) {
      if (other.pos <= this.end(d) && (!pred || pred(this.node(d)))) {
        return new NodeRange(this, other, d);
      }
    }
  };
  ResolvedPos.prototype.sameParent = function sameParent(other) {
    return this.pos - this.parentOffset == other.pos - other.parentOffset;
  };
  ResolvedPos.prototype.max = function max2(other) {
    return other.pos > this.pos ? other : this;
  };
  ResolvedPos.prototype.min = function min2(other) {
    return other.pos < this.pos ? other : this;
  };
  ResolvedPos.prototype.toString = function toString3() {
    var str = "";
    for (var i = 1; i <= this.depth; i++) {
      str += (str ? "/" : "") + this.node(i).type.name + "_" + this.index(i - 1);
    }
    return str + ":" + this.parentOffset;
  };
  ResolvedPos.resolve = function resolve(doc2, pos) {
    if (!(pos >= 0 && pos <= doc2.content.size)) {
      throw new RangeError("Position " + pos + " out of range");
    }
    var path = [];
    var start5 = 0, parentOffset = pos;
    for (var node4 = doc2; ; ) {
      var ref = node4.content.findIndex(parentOffset);
      var index2 = ref.index;
      var offset3 = ref.offset;
      var rem = parentOffset - offset3;
      path.push(node4, index2, start5 + offset3);
      if (!rem) {
        break;
      }
      node4 = node4.child(index2);
      if (node4.isText) {
        break;
      }
      parentOffset = rem - 1;
      start5 += offset3 + 1;
    }
    return new ResolvedPos(pos, path, parentOffset);
  };
  ResolvedPos.resolveCached = function resolveCached(doc2, pos) {
    for (var i = 0; i < resolveCache.length; i++) {
      var cached = resolveCache[i];
      if (cached.pos == pos && cached.doc == doc2) {
        return cached;
      }
    }
    var result2 = resolveCache[resolveCachePos] = ResolvedPos.resolve(doc2, pos);
    resolveCachePos = (resolveCachePos + 1) % resolveCacheSize;
    return result2;
  };
  Object.defineProperties(ResolvedPos.prototype, prototypeAccessors$2);
  var resolveCache = [];
  var resolveCachePos = 0;
  var resolveCacheSize = 12;
  var NodeRange = function NodeRange2($from, $to, depth) {
    this.$from = $from;
    this.$to = $to;
    this.depth = depth;
  };
  var prototypeAccessors$1$1 = { start: { configurable: true }, end: { configurable: true }, parent: { configurable: true }, startIndex: { configurable: true }, endIndex: { configurable: true } };
  prototypeAccessors$1$1.start.get = function() {
    return this.$from.before(this.depth + 1);
  };
  prototypeAccessors$1$1.end.get = function() {
    return this.$to.after(this.depth + 1);
  };
  prototypeAccessors$1$1.parent.get = function() {
    return this.$from.node(this.depth);
  };
  prototypeAccessors$1$1.startIndex.get = function() {
    return this.$from.index(this.depth);
  };
  prototypeAccessors$1$1.endIndex.get = function() {
    return this.$to.indexAfter(this.depth);
  };
  Object.defineProperties(NodeRange.prototype, prototypeAccessors$1$1);
  var emptyAttrs = /* @__PURE__ */ Object.create(null);
  var Node2 = function Node3(type, attrs, content2, marks2) {
    this.type = type;
    this.attrs = attrs;
    this.content = content2 || Fragment.empty;
    this.marks = marks2 || Mark.none;
  };
  var prototypeAccessors$3 = { nodeSize: { configurable: true }, childCount: { configurable: true }, textContent: { configurable: true }, firstChild: { configurable: true }, lastChild: { configurable: true }, isBlock: { configurable: true }, isTextblock: { configurable: true }, inlineContent: { configurable: true }, isInline: { configurable: true }, isText: { configurable: true }, isLeaf: { configurable: true }, isAtom: { configurable: true } };
  prototypeAccessors$3.nodeSize.get = function() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  };
  prototypeAccessors$3.childCount.get = function() {
    return this.content.childCount;
  };
  Node2.prototype.child = function child2(index2) {
    return this.content.child(index2);
  };
  Node2.prototype.maybeChild = function maybeChild2(index2) {
    return this.content.maybeChild(index2);
  };
  Node2.prototype.forEach = function forEach2(f) {
    this.content.forEach(f);
  };
  Node2.prototype.nodesBetween = function nodesBetween2(from4, to, f, startPos) {
    if (startPos === void 0)
      startPos = 0;
    this.content.nodesBetween(from4, to, f, startPos, this);
  };
  Node2.prototype.descendants = function descendants2(f) {
    this.nodesBetween(0, this.content.size, f);
  };
  prototypeAccessors$3.textContent.get = function() {
    return this.textBetween(0, this.content.size, "");
  };
  Node2.prototype.textBetween = function textBetween2(from4, to, blockSeparator, leafText) {
    return this.content.textBetween(from4, to, blockSeparator, leafText);
  };
  prototypeAccessors$3.firstChild.get = function() {
    return this.content.firstChild;
  };
  prototypeAccessors$3.lastChild.get = function() {
    return this.content.lastChild;
  };
  Node2.prototype.eq = function eq4(other) {
    return this == other || this.sameMarkup(other) && this.content.eq(other.content);
  };
  Node2.prototype.sameMarkup = function sameMarkup(other) {
    return this.hasMarkup(other.type, other.attrs, other.marks);
  };
  Node2.prototype.hasMarkup = function hasMarkup(type, attrs, marks2) {
    return this.type == type && compareDeep(this.attrs, attrs || type.defaultAttrs || emptyAttrs) && Mark.sameSet(this.marks, marks2 || Mark.none);
  };
  Node2.prototype.copy = function copy(content2) {
    if (content2 === void 0)
      content2 = null;
    if (content2 == this.content) {
      return this;
    }
    return new this.constructor(this.type, this.attrs, content2, this.marks);
  };
  Node2.prototype.mark = function mark(marks2) {
    return marks2 == this.marks ? this : new this.constructor(this.type, this.attrs, this.content, marks2);
  };
  Node2.prototype.cut = function cut2(from4, to) {
    if (from4 == 0 && to == this.content.size) {
      return this;
    }
    return this.copy(this.content.cut(from4, to));
  };
  Node2.prototype.slice = function slice(from4, to, includeParents) {
    if (to === void 0)
      to = this.content.size;
    if (includeParents === void 0)
      includeParents = false;
    if (from4 == to) {
      return Slice.empty;
    }
    var $from = this.resolve(from4), $to = this.resolve(to);
    var depth = includeParents ? 0 : $from.sharedDepth(to);
    var start5 = $from.start(depth), node4 = $from.node(depth);
    var content2 = node4.content.cut($from.pos - start5, $to.pos - start5);
    return new Slice(content2, $from.depth - depth, $to.depth - depth);
  };
  Node2.prototype.replace = function replace$1(from4, to, slice4) {
    return replace(this.resolve(from4), this.resolve(to), slice4);
  };
  Node2.prototype.nodeAt = function nodeAt(pos) {
    for (var node4 = this; ; ) {
      var ref = node4.content.findIndex(pos);
      var index2 = ref.index;
      var offset3 = ref.offset;
      node4 = node4.maybeChild(index2);
      if (!node4) {
        return null;
      }
      if (offset3 == pos || node4.isText) {
        return node4;
      }
      pos -= offset3 + 1;
    }
  };
  Node2.prototype.childAfter = function childAfter(pos) {
    var ref = this.content.findIndex(pos);
    var index2 = ref.index;
    var offset3 = ref.offset;
    return { node: this.content.maybeChild(index2), index: index2, offset: offset3 };
  };
  Node2.prototype.childBefore = function childBefore(pos) {
    if (pos == 0) {
      return { node: null, index: 0, offset: 0 };
    }
    var ref = this.content.findIndex(pos);
    var index2 = ref.index;
    var offset3 = ref.offset;
    if (offset3 < pos) {
      return { node: this.content.child(index2), index: index2, offset: offset3 };
    }
    var node4 = this.content.child(index2 - 1);
    return { node: node4, index: index2 - 1, offset: offset3 - node4.nodeSize };
  };
  Node2.prototype.resolve = function resolve2(pos) {
    return ResolvedPos.resolveCached(this, pos);
  };
  Node2.prototype.resolveNoCache = function resolveNoCache(pos) {
    return ResolvedPos.resolve(this, pos);
  };
  Node2.prototype.rangeHasMark = function rangeHasMark(from4, to, type) {
    var found2 = false;
    if (to > from4) {
      this.nodesBetween(from4, to, function(node4) {
        if (type.isInSet(node4.marks)) {
          found2 = true;
        }
        return !found2;
      });
    }
    return found2;
  };
  prototypeAccessors$3.isBlock.get = function() {
    return this.type.isBlock;
  };
  prototypeAccessors$3.isTextblock.get = function() {
    return this.type.isTextblock;
  };
  prototypeAccessors$3.inlineContent.get = function() {
    return this.type.inlineContent;
  };
  prototypeAccessors$3.isInline.get = function() {
    return this.type.isInline;
  };
  prototypeAccessors$3.isText.get = function() {
    return this.type.isText;
  };
  prototypeAccessors$3.isLeaf.get = function() {
    return this.type.isLeaf;
  };
  prototypeAccessors$3.isAtom.get = function() {
    return this.type.isAtom;
  };
  Node2.prototype.toString = function toString4() {
    if (this.type.spec.toDebugString) {
      return this.type.spec.toDebugString(this);
    }
    var name = this.type.name;
    if (this.content.size) {
      name += "(" + this.content.toStringInner() + ")";
    }
    return wrapMarks(this.marks, name);
  };
  Node2.prototype.contentMatchAt = function contentMatchAt(index2) {
    var match = this.type.contentMatch.matchFragment(this.content, 0, index2);
    if (!match) {
      throw new Error("Called contentMatchAt on a node with invalid content");
    }
    return match;
  };
  Node2.prototype.canReplace = function canReplace(from4, to, replacement, start5, end3) {
    if (replacement === void 0)
      replacement = Fragment.empty;
    if (start5 === void 0)
      start5 = 0;
    if (end3 === void 0)
      end3 = replacement.childCount;
    var one = this.contentMatchAt(from4).matchFragment(replacement, start5, end3);
    var two = one && one.matchFragment(this.content, to);
    if (!two || !two.validEnd) {
      return false;
    }
    for (var i = start5; i < end3; i++) {
      if (!this.type.allowsMarks(replacement.child(i).marks)) {
        return false;
      }
    }
    return true;
  };
  Node2.prototype.canReplaceWith = function canReplaceWith(from4, to, type, marks2) {
    if (marks2 && !this.type.allowsMarks(marks2)) {
      return false;
    }
    var start5 = this.contentMatchAt(from4).matchType(type);
    var end3 = start5 && start5.matchFragment(this.content, to);
    return end3 ? end3.validEnd : false;
  };
  Node2.prototype.canAppend = function canAppend(other) {
    if (other.content.size) {
      return this.canReplace(this.childCount, this.childCount, other.content);
    } else {
      return this.type.compatibleContent(other.type);
    }
  };
  Node2.prototype.check = function check() {
    if (!this.type.validContent(this.content)) {
      throw new RangeError("Invalid content for node " + this.type.name + ": " + this.content.toString().slice(0, 50));
    }
    var copy5 = Mark.none;
    for (var i = 0; i < this.marks.length; i++) {
      copy5 = this.marks[i].addToSet(copy5);
    }
    if (!Mark.sameSet(copy5, this.marks)) {
      throw new RangeError("Invalid collection of marks for node " + this.type.name + ": " + this.marks.map(function(m) {
        return m.type.name;
      }));
    }
    this.content.forEach(function(node4) {
      return node4.check();
    });
  };
  Node2.prototype.toJSON = function toJSON4() {
    var obj = { type: this.type.name };
    for (var _ in this.attrs) {
      obj.attrs = this.attrs;
      break;
    }
    if (this.content.size) {
      obj.content = this.content.toJSON();
    }
    if (this.marks.length) {
      obj.marks = this.marks.map(function(n) {
        return n.toJSON();
      });
    }
    return obj;
  };
  Node2.fromJSON = function fromJSON4(schema, json) {
    if (!json) {
      throw new RangeError("Invalid input for Node.fromJSON");
    }
    var marks2 = null;
    if (json.marks) {
      if (!Array.isArray(json.marks)) {
        throw new RangeError("Invalid mark data for Node.fromJSON");
      }
      marks2 = json.marks.map(schema.markFromJSON);
    }
    if (json.type == "text") {
      if (typeof json.text != "string") {
        throw new RangeError("Invalid text node in JSON");
      }
      return schema.text(json.text, marks2);
    }
    var content2 = Fragment.fromJSON(schema, json.content);
    return schema.nodeType(json.type).create(json.attrs, content2, marks2);
  };
  Object.defineProperties(Node2.prototype, prototypeAccessors$3);
  var TextNode = /* @__PURE__ */ function(Node5) {
    function TextNode2(type, attrs, content2, marks2) {
      Node5.call(this, type, attrs, null, marks2);
      if (!content2) {
        throw new RangeError("Empty text nodes are not allowed");
      }
      this.text = content2;
    }
    if (Node5)
      TextNode2.__proto__ = Node5;
    TextNode2.prototype = Object.create(Node5 && Node5.prototype);
    TextNode2.prototype.constructor = TextNode2;
    var prototypeAccessors$15 = { textContent: { configurable: true }, nodeSize: { configurable: true } };
    TextNode2.prototype.toString = function toString7() {
      if (this.type.spec.toDebugString) {
        return this.type.spec.toDebugString(this);
      }
      return wrapMarks(this.marks, JSON.stringify(this.text));
    };
    prototypeAccessors$15.textContent.get = function() {
      return this.text;
    };
    TextNode2.prototype.textBetween = function textBetween3(from4, to) {
      return this.text.slice(from4, to);
    };
    prototypeAccessors$15.nodeSize.get = function() {
      return this.text.length;
    };
    TextNode2.prototype.mark = function mark3(marks2) {
      return marks2 == this.marks ? this : new TextNode2(this.type, this.attrs, this.text, marks2);
    };
    TextNode2.prototype.withText = function withText(text2) {
      if (text2 == this.text) {
        return this;
      }
      return new TextNode2(this.type, this.attrs, text2, this.marks);
    };
    TextNode2.prototype.cut = function cut3(from4, to) {
      if (from4 === void 0)
        from4 = 0;
      if (to === void 0)
        to = this.text.length;
      if (from4 == 0 && to == this.text.length) {
        return this;
      }
      return this.withText(this.text.slice(from4, to));
    };
    TextNode2.prototype.eq = function eq12(other) {
      return this.sameMarkup(other) && this.text == other.text;
    };
    TextNode2.prototype.toJSON = function toJSON7() {
      var base2 = Node5.prototype.toJSON.call(this);
      base2.text = this.text;
      return base2;
    };
    Object.defineProperties(TextNode2.prototype, prototypeAccessors$15);
    return TextNode2;
  }(Node2);
  function wrapMarks(marks2, str) {
    for (var i = marks2.length - 1; i >= 0; i--) {
      str = marks2[i].type.name + "(" + str + ")";
    }
    return str;
  }
  var ContentMatch = function ContentMatch2(validEnd) {
    this.validEnd = validEnd;
    this.next = [];
    this.wrapCache = [];
  };
  var prototypeAccessors$4 = { inlineContent: { configurable: true }, defaultType: { configurable: true }, edgeCount: { configurable: true } };
  ContentMatch.parse = function parse(string, nodeTypes) {
    var stream = new TokenStream(string, nodeTypes);
    if (stream.next == null) {
      return ContentMatch.empty;
    }
    var expr = parseExpr(stream);
    if (stream.next) {
      stream.err("Unexpected trailing text");
    }
    var match = dfa(nfa(expr));
    checkForDeadEnds(match, stream);
    return match;
  };
  ContentMatch.prototype.matchType = function matchType(type) {
    for (var i = 0; i < this.next.length; i += 2) {
      if (this.next[i] == type) {
        return this.next[i + 1];
      }
    }
    return null;
  };
  ContentMatch.prototype.matchFragment = function matchFragment(frag, start5, end3) {
    if (start5 === void 0)
      start5 = 0;
    if (end3 === void 0)
      end3 = frag.childCount;
    var cur = this;
    for (var i = start5; cur && i < end3; i++) {
      cur = cur.matchType(frag.child(i).type);
    }
    return cur;
  };
  prototypeAccessors$4.inlineContent.get = function() {
    var first2 = this.next[0];
    return first2 ? first2.isInline : false;
  };
  prototypeAccessors$4.defaultType.get = function() {
    for (var i = 0; i < this.next.length; i += 2) {
      var type = this.next[i];
      if (!(type.isText || type.hasRequiredAttrs())) {
        return type;
      }
    }
  };
  ContentMatch.prototype.compatible = function compatible(other) {
    for (var i = 0; i < this.next.length; i += 2) {
      for (var j = 0; j < other.next.length; j += 2) {
        if (this.next[i] == other.next[j]) {
          return true;
        }
      }
    }
    return false;
  };
  ContentMatch.prototype.fillBefore = function fillBefore(after2, toEnd, startIndex) {
    if (toEnd === void 0)
      toEnd = false;
    if (startIndex === void 0)
      startIndex = 0;
    var seen = [this];
    function search(match, types) {
      var finished = match.matchFragment(after2, startIndex);
      if (finished && (!toEnd || finished.validEnd)) {
        return Fragment.from(types.map(function(tp) {
          return tp.createAndFill();
        }));
      }
      for (var i = 0; i < match.next.length; i += 2) {
        var type = match.next[i], next = match.next[i + 1];
        if (!(type.isText || type.hasRequiredAttrs()) && seen.indexOf(next) == -1) {
          seen.push(next);
          var found2 = search(next, types.concat(type));
          if (found2) {
            return found2;
          }
        }
      }
    }
    return search(this, []);
  };
  ContentMatch.prototype.findWrapping = function findWrapping(target) {
    for (var i = 0; i < this.wrapCache.length; i += 2) {
      if (this.wrapCache[i] == target) {
        return this.wrapCache[i + 1];
      }
    }
    var computed = this.computeWrapping(target);
    this.wrapCache.push(target, computed);
    return computed;
  };
  ContentMatch.prototype.computeWrapping = function computeWrapping(target) {
    var seen = /* @__PURE__ */ Object.create(null), active = [{ match: this, type: null, via: null }];
    while (active.length) {
      var current = active.shift(), match = current.match;
      if (match.matchType(target)) {
        var result2 = [];
        for (var obj = current; obj.type; obj = obj.via) {
          result2.push(obj.type);
        }
        return result2.reverse();
      }
      for (var i = 0; i < match.next.length; i += 2) {
        var type = match.next[i];
        if (!type.isLeaf && !type.hasRequiredAttrs() && !(type.name in seen) && (!current.type || match.next[i + 1].validEnd)) {
          active.push({ match: type.contentMatch, type, via: current });
          seen[type.name] = true;
        }
      }
    }
  };
  prototypeAccessors$4.edgeCount.get = function() {
    return this.next.length >> 1;
  };
  ContentMatch.prototype.edge = function edge(n) {
    var i = n << 1;
    if (i >= this.next.length) {
      throw new RangeError("There's no " + n + "th edge in this content match");
    }
    return { type: this.next[i], next: this.next[i + 1] };
  };
  ContentMatch.prototype.toString = function toString5() {
    var seen = [];
    function scan(m) {
      seen.push(m);
      for (var i = 1; i < m.next.length; i += 2) {
        if (seen.indexOf(m.next[i]) == -1) {
          scan(m.next[i]);
        }
      }
    }
    scan(this);
    return seen.map(function(m, i) {
      var out = i + (m.validEnd ? "*" : " ") + " ";
      for (var i$1 = 0; i$1 < m.next.length; i$1 += 2) {
        out += (i$1 ? ", " : "") + m.next[i$1].name + "->" + seen.indexOf(m.next[i$1 + 1]);
      }
      return out;
    }).join("\n");
  };
  Object.defineProperties(ContentMatch.prototype, prototypeAccessors$4);
  ContentMatch.empty = new ContentMatch(true);
  var TokenStream = function TokenStream2(string, nodeTypes) {
    this.string = string;
    this.nodeTypes = nodeTypes;
    this.inline = null;
    this.pos = 0;
    this.tokens = string.split(/\s*(?=\b|\W|$)/);
    if (this.tokens[this.tokens.length - 1] == "") {
      this.tokens.pop();
    }
    if (this.tokens[0] == "") {
      this.tokens.shift();
    }
  };
  var prototypeAccessors$1$2 = { next: { configurable: true } };
  prototypeAccessors$1$2.next.get = function() {
    return this.tokens[this.pos];
  };
  TokenStream.prototype.eat = function eat(tok) {
    return this.next == tok && (this.pos++ || true);
  };
  TokenStream.prototype.err = function err(str) {
    throw new SyntaxError(str + " (in content expression '" + this.string + "')");
  };
  Object.defineProperties(TokenStream.prototype, prototypeAccessors$1$2);
  function parseExpr(stream) {
    var exprs = [];
    do {
      exprs.push(parseExprSeq(stream));
    } while (stream.eat("|"));
    return exprs.length == 1 ? exprs[0] : { type: "choice", exprs };
  }
  function parseExprSeq(stream) {
    var exprs = [];
    do {
      exprs.push(parseExprSubscript(stream));
    } while (stream.next && stream.next != ")" && stream.next != "|");
    return exprs.length == 1 ? exprs[0] : { type: "seq", exprs };
  }
  function parseExprSubscript(stream) {
    var expr = parseExprAtom(stream);
    for (; ; ) {
      if (stream.eat("+")) {
        expr = { type: "plus", expr };
      } else if (stream.eat("*")) {
        expr = { type: "star", expr };
      } else if (stream.eat("?")) {
        expr = { type: "opt", expr };
      } else if (stream.eat("{")) {
        expr = parseExprRange(stream, expr);
      } else {
        break;
      }
    }
    return expr;
  }
  function parseNum(stream) {
    if (/\D/.test(stream.next)) {
      stream.err("Expected number, got '" + stream.next + "'");
    }
    var result2 = Number(stream.next);
    stream.pos++;
    return result2;
  }
  function parseExprRange(stream, expr) {
    var min3 = parseNum(stream), max3 = min3;
    if (stream.eat(",")) {
      if (stream.next != "}") {
        max3 = parseNum(stream);
      } else {
        max3 = -1;
      }
    }
    if (!stream.eat("}")) {
      stream.err("Unclosed braced range");
    }
    return { type: "range", min: min3, max: max3, expr };
  }
  function resolveName(stream, name) {
    var types = stream.nodeTypes, type = types[name];
    if (type) {
      return [type];
    }
    var result2 = [];
    for (var typeName in types) {
      var type$1 = types[typeName];
      if (type$1.groups.indexOf(name) > -1) {
        result2.push(type$1);
      }
    }
    if (result2.length == 0) {
      stream.err("No node type or group '" + name + "' found");
    }
    return result2;
  }
  function parseExprAtom(stream) {
    if (stream.eat("(")) {
      var expr = parseExpr(stream);
      if (!stream.eat(")")) {
        stream.err("Missing closing paren");
      }
      return expr;
    } else if (!/\W/.test(stream.next)) {
      var exprs = resolveName(stream, stream.next).map(function(type) {
        if (stream.inline == null) {
          stream.inline = type.isInline;
        } else if (stream.inline != type.isInline) {
          stream.err("Mixing inline and block content");
        }
        return { type: "name", value: type };
      });
      stream.pos++;
      return exprs.length == 1 ? exprs[0] : { type: "choice", exprs };
    } else {
      stream.err("Unexpected token '" + stream.next + "'");
    }
  }
  function nfa(expr) {
    var nfa2 = [[]];
    connect(compile3(expr, 0), node4());
    return nfa2;
    function node4() {
      return nfa2.push([]) - 1;
    }
    function edge2(from4, to, term) {
      var edge3 = { term, to };
      nfa2[from4].push(edge3);
      return edge3;
    }
    function connect(edges, to) {
      edges.forEach(function(edge3) {
        return edge3.to = to;
      });
    }
    function compile3(expr2, from4) {
      if (expr2.type == "choice") {
        return expr2.exprs.reduce(function(out, expr3) {
          return out.concat(compile3(expr3, from4));
        }, []);
      } else if (expr2.type == "seq") {
        for (var i = 0; ; i++) {
          var next = compile3(expr2.exprs[i], from4);
          if (i == expr2.exprs.length - 1) {
            return next;
          }
          connect(next, from4 = node4());
        }
      } else if (expr2.type == "star") {
        var loop = node4();
        edge2(from4, loop);
        connect(compile3(expr2.expr, loop), loop);
        return [edge2(loop)];
      } else if (expr2.type == "plus") {
        var loop$1 = node4();
        connect(compile3(expr2.expr, from4), loop$1);
        connect(compile3(expr2.expr, loop$1), loop$1);
        return [edge2(loop$1)];
      } else if (expr2.type == "opt") {
        return [edge2(from4)].concat(compile3(expr2.expr, from4));
      } else if (expr2.type == "range") {
        var cur = from4;
        for (var i$1 = 0; i$1 < expr2.min; i$1++) {
          var next$1 = node4();
          connect(compile3(expr2.expr, cur), next$1);
          cur = next$1;
        }
        if (expr2.max == -1) {
          connect(compile3(expr2.expr, cur), cur);
        } else {
          for (var i$2 = expr2.min; i$2 < expr2.max; i$2++) {
            var next$2 = node4();
            edge2(cur, next$2);
            connect(compile3(expr2.expr, cur), next$2);
            cur = next$2;
          }
        }
        return [edge2(cur)];
      } else if (expr2.type == "name") {
        return [edge2(from4, null, expr2.value)];
      }
    }
  }
  function cmp(a, b) {
    return b - a;
  }
  function nullFrom(nfa2, node4) {
    var result2 = [];
    scan(node4);
    return result2.sort(cmp);
    function scan(node5) {
      var edges = nfa2[node5];
      if (edges.length == 1 && !edges[0].term) {
        return scan(edges[0].to);
      }
      result2.push(node5);
      for (var i = 0; i < edges.length; i++) {
        var ref = edges[i];
        var term = ref.term;
        var to = ref.to;
        if (!term && result2.indexOf(to) == -1) {
          scan(to);
        }
      }
    }
  }
  function dfa(nfa2) {
    var labeled = /* @__PURE__ */ Object.create(null);
    return explore(nullFrom(nfa2, 0));
    function explore(states) {
      var out = [];
      states.forEach(function(node4) {
        nfa2[node4].forEach(function(ref) {
          var term = ref.term;
          var to = ref.to;
          if (!term) {
            return;
          }
          var known = out.indexOf(term), set2 = known > -1 && out[known + 1];
          nullFrom(nfa2, to).forEach(function(node5) {
            if (!set2) {
              out.push(term, set2 = []);
            }
            if (set2.indexOf(node5) == -1) {
              set2.push(node5);
            }
          });
        });
      });
      var state = labeled[states.join(",")] = new ContentMatch(states.indexOf(nfa2.length - 1) > -1);
      for (var i = 0; i < out.length; i += 2) {
        var states$1 = out[i + 1].sort(cmp);
        state.next.push(out[i], labeled[states$1.join(",")] || explore(states$1));
      }
      return state;
    }
  }
  function checkForDeadEnds(match, stream) {
    for (var i = 0, work = [match]; i < work.length; i++) {
      var state = work[i], dead = !state.validEnd, nodes = [];
      for (var j = 0; j < state.next.length; j += 2) {
        var node4 = state.next[j], next = state.next[j + 1];
        nodes.push(node4.name);
        if (dead && !(node4.isText || node4.hasRequiredAttrs())) {
          dead = false;
        }
        if (work.indexOf(next) == -1) {
          work.push(next);
        }
      }
      if (dead) {
        stream.err("Only non-generatable nodes (" + nodes.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
      }
    }
  }
  function defaultAttrs(attrs) {
    var defaults = /* @__PURE__ */ Object.create(null);
    for (var attrName in attrs) {
      var attr = attrs[attrName];
      if (!attr.hasDefault) {
        return null;
      }
      defaults[attrName] = attr.default;
    }
    return defaults;
  }
  function computeAttrs(attrs, value) {
    var built = /* @__PURE__ */ Object.create(null);
    for (var name in attrs) {
      var given = value && value[name];
      if (given === void 0) {
        var attr = attrs[name];
        if (attr.hasDefault) {
          given = attr.default;
        } else {
          throw new RangeError("No value supplied for attribute " + name);
        }
      }
      built[name] = given;
    }
    return built;
  }
  function initAttrs(attrs) {
    var result2 = /* @__PURE__ */ Object.create(null);
    if (attrs) {
      for (var name in attrs) {
        result2[name] = new Attribute(attrs[name]);
      }
    }
    return result2;
  }
  var NodeType = function NodeType2(name, schema, spec) {
    this.name = name;
    this.schema = schema;
    this.spec = spec;
    this.groups = spec.group ? spec.group.split(" ") : [];
    this.attrs = initAttrs(spec.attrs);
    this.defaultAttrs = defaultAttrs(this.attrs);
    this.contentMatch = null;
    this.markSet = null;
    this.inlineContent = null;
    this.isBlock = !(spec.inline || name == "text");
    this.isText = name == "text";
  };
  var prototypeAccessors$5 = { isInline: { configurable: true }, isTextblock: { configurable: true }, isLeaf: { configurable: true }, isAtom: { configurable: true }, whitespace: { configurable: true } };
  prototypeAccessors$5.isInline.get = function() {
    return !this.isBlock;
  };
  prototypeAccessors$5.isTextblock.get = function() {
    return this.isBlock && this.inlineContent;
  };
  prototypeAccessors$5.isLeaf.get = function() {
    return this.contentMatch == ContentMatch.empty;
  };
  prototypeAccessors$5.isAtom.get = function() {
    return this.isLeaf || this.spec.atom;
  };
  prototypeAccessors$5.whitespace.get = function() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  };
  NodeType.prototype.hasRequiredAttrs = function hasRequiredAttrs() {
    for (var n in this.attrs) {
      if (this.attrs[n].isRequired) {
        return true;
      }
    }
    return false;
  };
  NodeType.prototype.compatibleContent = function compatibleContent(other) {
    return this == other || this.contentMatch.compatible(other.contentMatch);
  };
  NodeType.prototype.computeAttrs = function computeAttrs$1(attrs) {
    if (!attrs && this.defaultAttrs) {
      return this.defaultAttrs;
    } else {
      return computeAttrs(this.attrs, attrs);
    }
  };
  NodeType.prototype.create = function create(attrs, content2, marks2) {
    if (this.isText) {
      throw new Error("NodeType.create can't construct text nodes");
    }
    return new Node2(this, this.computeAttrs(attrs), Fragment.from(content2), Mark.setFrom(marks2));
  };
  NodeType.prototype.createChecked = function createChecked(attrs, content2, marks2) {
    content2 = Fragment.from(content2);
    if (!this.validContent(content2)) {
      throw new RangeError("Invalid content for node " + this.name);
    }
    return new Node2(this, this.computeAttrs(attrs), content2, Mark.setFrom(marks2));
  };
  NodeType.prototype.createAndFill = function createAndFill(attrs, content2, marks2) {
    attrs = this.computeAttrs(attrs);
    content2 = Fragment.from(content2);
    if (content2.size) {
      var before2 = this.contentMatch.fillBefore(content2);
      if (!before2) {
        return null;
      }
      content2 = before2.append(content2);
    }
    var after2 = this.contentMatch.matchFragment(content2).fillBefore(Fragment.empty, true);
    if (!after2) {
      return null;
    }
    return new Node2(this, attrs, content2.append(after2), Mark.setFrom(marks2));
  };
  NodeType.prototype.validContent = function validContent(content2) {
    var result2 = this.contentMatch.matchFragment(content2);
    if (!result2 || !result2.validEnd) {
      return false;
    }
    for (var i = 0; i < content2.childCount; i++) {
      if (!this.allowsMarks(content2.child(i).marks)) {
        return false;
      }
    }
    return true;
  };
  NodeType.prototype.allowsMarkType = function allowsMarkType(markType) {
    return this.markSet == null || this.markSet.indexOf(markType) > -1;
  };
  NodeType.prototype.allowsMarks = function allowsMarks(marks2) {
    if (this.markSet == null) {
      return true;
    }
    for (var i = 0; i < marks2.length; i++) {
      if (!this.allowsMarkType(marks2[i].type)) {
        return false;
      }
    }
    return true;
  };
  NodeType.prototype.allowedMarks = function allowedMarks(marks2) {
    if (this.markSet == null) {
      return marks2;
    }
    var copy5;
    for (var i = 0; i < marks2.length; i++) {
      if (!this.allowsMarkType(marks2[i].type)) {
        if (!copy5) {
          copy5 = marks2.slice(0, i);
        }
      } else if (copy5) {
        copy5.push(marks2[i]);
      }
    }
    return !copy5 ? marks2 : copy5.length ? copy5 : Mark.empty;
  };
  NodeType.compile = function compile(nodes, schema) {
    var result2 = /* @__PURE__ */ Object.create(null);
    nodes.forEach(function(name, spec) {
      return result2[name] = new NodeType(name, schema, spec);
    });
    var topType = schema.spec.topNode || "doc";
    if (!result2[topType]) {
      throw new RangeError("Schema is missing its top node type ('" + topType + "')");
    }
    if (!result2.text) {
      throw new RangeError("Every schema needs a 'text' type");
    }
    for (var _ in result2.text.attrs) {
      throw new RangeError("The text node type should not have attributes");
    }
    return result2;
  };
  Object.defineProperties(NodeType.prototype, prototypeAccessors$5);
  var Attribute = function Attribute2(options) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(options, "default");
    this.default = options.default;
  };
  var prototypeAccessors$1$3 = { isRequired: { configurable: true } };
  prototypeAccessors$1$3.isRequired.get = function() {
    return !this.hasDefault;
  };
  Object.defineProperties(Attribute.prototype, prototypeAccessors$1$3);
  var MarkType = function MarkType2(name, rank, schema, spec) {
    this.name = name;
    this.schema = schema;
    this.spec = spec;
    this.attrs = initAttrs(spec.attrs);
    this.rank = rank;
    this.excluded = null;
    var defaults = defaultAttrs(this.attrs);
    this.instance = defaults && new Mark(this, defaults);
  };
  MarkType.prototype.create = function create2(attrs) {
    if (!attrs && this.instance) {
      return this.instance;
    }
    return new Mark(this, computeAttrs(this.attrs, attrs));
  };
  MarkType.compile = function compile2(marks2, schema) {
    var result2 = /* @__PURE__ */ Object.create(null), rank = 0;
    marks2.forEach(function(name, spec) {
      return result2[name] = new MarkType(name, rank++, schema, spec);
    });
    return result2;
  };
  MarkType.prototype.removeFromSet = function removeFromSet2(set2) {
    for (var i = 0; i < set2.length; i++) {
      if (set2[i].type == this) {
        set2 = set2.slice(0, i).concat(set2.slice(i + 1));
        i--;
      }
    }
    return set2;
  };
  MarkType.prototype.isInSet = function isInSet2(set2) {
    for (var i = 0; i < set2.length; i++) {
      if (set2[i].type == this) {
        return set2[i];
      }
    }
  };
  MarkType.prototype.excludes = function excludes(other) {
    return this.excluded.indexOf(other) > -1;
  };
  var Schema = function Schema2(spec) {
    this.spec = {};
    for (var prop in spec) {
      this.spec[prop] = spec[prop];
    }
    this.spec.nodes = index_es_default.from(spec.nodes);
    this.spec.marks = index_es_default.from(spec.marks);
    this.nodes = NodeType.compile(this.spec.nodes, this);
    this.marks = MarkType.compile(this.spec.marks, this);
    var contentExprCache = /* @__PURE__ */ Object.create(null);
    for (var prop$1 in this.nodes) {
      if (prop$1 in this.marks) {
        throw new RangeError(prop$1 + " can not be both a node and a mark");
      }
      var type = this.nodes[prop$1], contentExpr = type.spec.content || "", markExpr = type.spec.marks;
      type.contentMatch = contentExprCache[contentExpr] || (contentExprCache[contentExpr] = ContentMatch.parse(contentExpr, this.nodes));
      type.inlineContent = type.contentMatch.inlineContent;
      type.markSet = markExpr == "_" ? null : markExpr ? gatherMarks(this, markExpr.split(" ")) : markExpr == "" || !type.inlineContent ? [] : null;
    }
    for (var prop$2 in this.marks) {
      var type$1 = this.marks[prop$2], excl = type$1.spec.excludes;
      type$1.excluded = excl == null ? [type$1] : excl == "" ? [] : gatherMarks(this, excl.split(" "));
    }
    this.nodeFromJSON = this.nodeFromJSON.bind(this);
    this.markFromJSON = this.markFromJSON.bind(this);
    this.topNodeType = this.nodes[this.spec.topNode || "doc"];
    this.cached = /* @__PURE__ */ Object.create(null);
    this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  };
  Schema.prototype.node = function node2(type, attrs, content2, marks2) {
    if (typeof type == "string") {
      type = this.nodeType(type);
    } else if (!(type instanceof NodeType)) {
      throw new RangeError("Invalid node type: " + type);
    } else if (type.schema != this) {
      throw new RangeError("Node type from different schema used (" + type.name + ")");
    }
    return type.createChecked(attrs, content2, marks2);
  };
  Schema.prototype.text = function text(text$1, marks2) {
    var type = this.nodes.text;
    return new TextNode(type, type.defaultAttrs, text$1, Mark.setFrom(marks2));
  };
  Schema.prototype.mark = function mark2(type, attrs) {
    if (typeof type == "string") {
      type = this.marks[type];
    }
    return type.create(attrs);
  };
  Schema.prototype.nodeFromJSON = function nodeFromJSON(json) {
    return Node2.fromJSON(this, json);
  };
  Schema.prototype.markFromJSON = function markFromJSON(json) {
    return Mark.fromJSON(this, json);
  };
  Schema.prototype.nodeType = function nodeType(name) {
    var found2 = this.nodes[name];
    if (!found2) {
      throw new RangeError("Unknown node type: " + name);
    }
    return found2;
  };
  function gatherMarks(schema, marks2) {
    var found2 = [];
    for (var i = 0; i < marks2.length; i++) {
      var name = marks2[i], mark3 = schema.marks[name], ok2 = mark3;
      if (mark3) {
        found2.push(mark3);
      } else {
        for (var prop in schema.marks) {
          var mark$1 = schema.marks[prop];
          if (name == "_" || mark$1.spec.group && mark$1.spec.group.split(" ").indexOf(name) > -1) {
            found2.push(ok2 = mark$1);
          }
        }
      }
      if (!ok2) {
        throw new SyntaxError("Unknown mark type: '" + marks2[i] + "'");
      }
    }
    return found2;
  }
  var DOMParser2 = function DOMParser3(schema, rules) {
    var this$1 = this;
    this.schema = schema;
    this.rules = rules;
    this.tags = [];
    this.styles = [];
    rules.forEach(function(rule) {
      if (rule.tag) {
        this$1.tags.push(rule);
      } else if (rule.style) {
        this$1.styles.push(rule);
      }
    });
    this.normalizeLists = !this.tags.some(function(r) {
      if (!/^(ul|ol)\b/.test(r.tag) || !r.node) {
        return false;
      }
      var node4 = schema.nodes[r.node];
      return node4.contentMatch.matchType(node4);
    });
  };
  DOMParser2.prototype.parse = function parse2(dom, options) {
    if (options === void 0)
      options = {};
    var context = new ParseContext(this, options, false);
    context.addAll(dom, null, options.from, options.to);
    return context.finish();
  };
  DOMParser2.prototype.parseSlice = function parseSlice(dom, options) {
    if (options === void 0)
      options = {};
    var context = new ParseContext(this, options, true);
    context.addAll(dom, null, options.from, options.to);
    return Slice.maxOpen(context.finish());
  };
  DOMParser2.prototype.matchTag = function matchTag(dom, context, after2) {
    for (var i = after2 ? this.tags.indexOf(after2) + 1 : 0; i < this.tags.length; i++) {
      var rule = this.tags[i];
      if (matches(dom, rule.tag) && (rule.namespace === void 0 || dom.namespaceURI == rule.namespace) && (!rule.context || context.matchesContext(rule.context))) {
        if (rule.getAttrs) {
          var result2 = rule.getAttrs(dom);
          if (result2 === false) {
            continue;
          }
          rule.attrs = result2;
        }
        return rule;
      }
    }
  };
  DOMParser2.prototype.matchStyle = function matchStyle(prop, value, context, after2) {
    for (var i = after2 ? this.styles.indexOf(after2) + 1 : 0; i < this.styles.length; i++) {
      var rule = this.styles[i];
      if (rule.style.indexOf(prop) != 0 || rule.context && !context.matchesContext(rule.context) || rule.style.length > prop.length && (rule.style.charCodeAt(prop.length) != 61 || rule.style.slice(prop.length + 1) != value)) {
        continue;
      }
      if (rule.getAttrs) {
        var result2 = rule.getAttrs(value);
        if (result2 === false) {
          continue;
        }
        rule.attrs = result2;
      }
      return rule;
    }
  };
  DOMParser2.schemaRules = function schemaRules(schema) {
    var result2 = [];
    function insert(rule) {
      var priority = rule.priority == null ? 50 : rule.priority, i = 0;
      for (; i < result2.length; i++) {
        var next = result2[i], nextPriority = next.priority == null ? 50 : next.priority;
        if (nextPriority < priority) {
          break;
        }
      }
      result2.splice(i, 0, rule);
    }
    var loop = function(name2) {
      var rules = schema.marks[name2].spec.parseDOM;
      if (rules) {
        rules.forEach(function(rule) {
          insert(rule = copy2(rule));
          rule.mark = name2;
        });
      }
    };
    for (var name in schema.marks)
      loop(name);
    var loop$1 = function(name2) {
      var rules$1 = schema.nodes[name$1].spec.parseDOM;
      if (rules$1) {
        rules$1.forEach(function(rule) {
          insert(rule = copy2(rule));
          rule.node = name$1;
        });
      }
    };
    for (var name$1 in schema.nodes)
      loop$1();
    return result2;
  };
  DOMParser2.fromSchema = function fromSchema(schema) {
    return schema.cached.domParser || (schema.cached.domParser = new DOMParser2(schema, DOMParser2.schemaRules(schema)));
  };
  var blockTags = {
    address: true,
    article: true,
    aside: true,
    blockquote: true,
    canvas: true,
    dd: true,
    div: true,
    dl: true,
    fieldset: true,
    figcaption: true,
    figure: true,
    footer: true,
    form: true,
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    h5: true,
    h6: true,
    header: true,
    hgroup: true,
    hr: true,
    li: true,
    noscript: true,
    ol: true,
    output: true,
    p: true,
    pre: true,
    section: true,
    table: true,
    tfoot: true,
    ul: true
  };
  var ignoreTags = {
    head: true,
    noscript: true,
    object: true,
    script: true,
    style: true,
    title: true
  };
  var listTags = { ol: true, ul: true };
  var OPT_PRESERVE_WS = 1;
  var OPT_PRESERVE_WS_FULL = 2;
  var OPT_OPEN_LEFT = 4;
  function wsOptionsFor(type, preserveWhitespace, base2) {
    if (preserveWhitespace != null) {
      return (preserveWhitespace ? OPT_PRESERVE_WS : 0) | (preserveWhitespace === "full" ? OPT_PRESERVE_WS_FULL : 0);
    }
    return type && type.whitespace == "pre" ? OPT_PRESERVE_WS | OPT_PRESERVE_WS_FULL : base2 & ~OPT_OPEN_LEFT;
  }
  var NodeContext = function NodeContext2(type, attrs, marks2, pendingMarks, solid, match, options) {
    this.type = type;
    this.attrs = attrs;
    this.solid = solid;
    this.match = match || (options & OPT_OPEN_LEFT ? null : type.contentMatch);
    this.options = options;
    this.content = [];
    this.marks = marks2;
    this.activeMarks = Mark.none;
    this.pendingMarks = pendingMarks;
    this.stashMarks = [];
  };
  NodeContext.prototype.findWrapping = function findWrapping2(node4) {
    if (!this.match) {
      if (!this.type) {
        return [];
      }
      var fill = this.type.contentMatch.fillBefore(Fragment.from(node4));
      if (fill) {
        this.match = this.type.contentMatch.matchFragment(fill);
      } else {
        var start5 = this.type.contentMatch, wrap;
        if (wrap = start5.findWrapping(node4.type)) {
          this.match = start5;
          return wrap;
        } else {
          return null;
        }
      }
    }
    return this.match.findWrapping(node4.type);
  };
  NodeContext.prototype.finish = function finish(openEnd) {
    if (!(this.options & OPT_PRESERVE_WS)) {
      var last = this.content[this.content.length - 1], m;
      if (last && last.isText && (m = /[ \t\r\n\u000c]+$/.exec(last.text))) {
        if (last.text.length == m[0].length) {
          this.content.pop();
        } else {
          this.content[this.content.length - 1] = last.withText(last.text.slice(0, last.text.length - m[0].length));
        }
      }
    }
    var content2 = Fragment.from(this.content);
    if (!openEnd && this.match) {
      content2 = content2.append(this.match.fillBefore(Fragment.empty, true));
    }
    return this.type ? this.type.create(this.attrs, content2, this.marks) : content2;
  };
  NodeContext.prototype.popFromStashMark = function popFromStashMark(mark3) {
    for (var i = this.stashMarks.length - 1; i >= 0; i--) {
      if (mark3.eq(this.stashMarks[i])) {
        return this.stashMarks.splice(i, 1)[0];
      }
    }
  };
  NodeContext.prototype.applyPending = function applyPending(nextType) {
    for (var i = 0, pending = this.pendingMarks; i < pending.length; i++) {
      var mark3 = pending[i];
      if ((this.type ? this.type.allowsMarkType(mark3.type) : markMayApply(mark3.type, nextType)) && !mark3.isInSet(this.activeMarks)) {
        this.activeMarks = mark3.addToSet(this.activeMarks);
        this.pendingMarks = mark3.removeFromSet(this.pendingMarks);
      }
    }
  };
  NodeContext.prototype.inlineContext = function inlineContext(node4) {
    if (this.type) {
      return this.type.inlineContent;
    }
    if (this.content.length) {
      return this.content[0].isInline;
    }
    return node4.parentNode && !blockTags.hasOwnProperty(node4.parentNode.nodeName.toLowerCase());
  };
  var ParseContext = function ParseContext2(parser, options, open) {
    this.parser = parser;
    this.options = options;
    this.isOpen = open;
    var topNode = options.topNode, topContext;
    var topOptions = wsOptionsFor(null, options.preserveWhitespace, 0) | (open ? OPT_OPEN_LEFT : 0);
    if (topNode) {
      topContext = new NodeContext(topNode.type, topNode.attrs, Mark.none, Mark.none, true, options.topMatch || topNode.type.contentMatch, topOptions);
    } else if (open) {
      topContext = new NodeContext(null, null, Mark.none, Mark.none, true, null, topOptions);
    } else {
      topContext = new NodeContext(parser.schema.topNodeType, null, Mark.none, Mark.none, true, null, topOptions);
    }
    this.nodes = [topContext];
    this.open = 0;
    this.find = options.findPositions;
    this.needsBlock = false;
  };
  var prototypeAccessors$6 = { top: { configurable: true }, currentPos: { configurable: true } };
  prototypeAccessors$6.top.get = function() {
    return this.nodes[this.open];
  };
  ParseContext.prototype.addDOM = function addDOM(dom) {
    if (dom.nodeType == 3) {
      this.addTextNode(dom);
    } else if (dom.nodeType == 1) {
      var style2 = dom.getAttribute("style");
      var marks2 = style2 ? this.readStyles(parseStyles(style2)) : null, top2 = this.top;
      if (marks2 != null) {
        for (var i = 0; i < marks2.length; i++) {
          this.addPendingMark(marks2[i]);
        }
      }
      this.addElement(dom);
      if (marks2 != null) {
        for (var i$1 = 0; i$1 < marks2.length; i$1++) {
          this.removePendingMark(marks2[i$1], top2);
        }
      }
    }
  };
  ParseContext.prototype.addTextNode = function addTextNode(dom) {
    var value = dom.nodeValue;
    var top2 = this.top;
    if (top2.options & OPT_PRESERVE_WS_FULL || top2.inlineContext(dom) || /[^ \t\r\n\u000c]/.test(value)) {
      if (!(top2.options & OPT_PRESERVE_WS)) {
        value = value.replace(/[ \t\r\n\u000c]+/g, " ");
        if (/^[ \t\r\n\u000c]/.test(value) && this.open == this.nodes.length - 1) {
          var nodeBefore = top2.content[top2.content.length - 1];
          var domNodeBefore = dom.previousSibling;
          if (!nodeBefore || domNodeBefore && domNodeBefore.nodeName == "BR" || nodeBefore.isText && /[ \t\r\n\u000c]$/.test(nodeBefore.text)) {
            value = value.slice(1);
          }
        }
      } else if (!(top2.options & OPT_PRESERVE_WS_FULL)) {
        value = value.replace(/\r?\n|\r/g, " ");
      } else {
        value = value.replace(/\r\n?/g, "\n");
      }
      if (value) {
        this.insertNode(this.parser.schema.text(value));
      }
      this.findInText(dom);
    } else {
      this.findInside(dom);
    }
  };
  ParseContext.prototype.addElement = function addElement(dom, matchAfter) {
    var name = dom.nodeName.toLowerCase(), ruleID;
    if (listTags.hasOwnProperty(name) && this.parser.normalizeLists) {
      normalizeList(dom);
    }
    var rule = this.options.ruleFromNode && this.options.ruleFromNode(dom) || (ruleID = this.parser.matchTag(dom, this, matchAfter));
    if (rule ? rule.ignore : ignoreTags.hasOwnProperty(name)) {
      this.findInside(dom);
      this.ignoreFallback(dom);
    } else if (!rule || rule.skip || rule.closeParent) {
      if (rule && rule.closeParent) {
        this.open = Math.max(0, this.open - 1);
      } else if (rule && rule.skip.nodeType) {
        dom = rule.skip;
      }
      var sync2, top2 = this.top, oldNeedsBlock = this.needsBlock;
      if (blockTags.hasOwnProperty(name)) {
        sync2 = true;
        if (!top2.type) {
          this.needsBlock = true;
        }
      } else if (!dom.firstChild) {
        this.leafFallback(dom);
        return;
      }
      this.addAll(dom);
      if (sync2) {
        this.sync(top2);
      }
      this.needsBlock = oldNeedsBlock;
    } else {
      this.addElementByRule(dom, rule, rule.consuming === false ? ruleID : null);
    }
  };
  ParseContext.prototype.leafFallback = function leafFallback(dom) {
    if (dom.nodeName == "BR" && this.top.type && this.top.type.inlineContent) {
      this.addTextNode(dom.ownerDocument.createTextNode("\n"));
    }
  };
  ParseContext.prototype.ignoreFallback = function ignoreFallback(dom) {
    if (dom.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent)) {
      this.findPlace(this.parser.schema.text("-"));
    }
  };
  ParseContext.prototype.readStyles = function readStyles(styles) {
    var marks2 = Mark.none;
    style:
      for (var i = 0; i < styles.length; i += 2) {
        for (var after2 = null; ; ) {
          var rule = this.parser.matchStyle(styles[i], styles[i + 1], this, after2);
          if (!rule) {
            continue style;
          }
          if (rule.ignore) {
            return null;
          }
          marks2 = this.parser.schema.marks[rule.mark].create(rule.attrs).addToSet(marks2);
          if (rule.consuming === false) {
            after2 = rule;
          } else {
            break;
          }
        }
      }
    return marks2;
  };
  ParseContext.prototype.addElementByRule = function addElementByRule(dom, rule, continueAfter) {
    var this$1 = this;
    var sync2, nodeType2, markType, mark3;
    if (rule.node) {
      nodeType2 = this.parser.schema.nodes[rule.node];
      if (!nodeType2.isLeaf) {
        sync2 = this.enter(nodeType2, rule.attrs, rule.preserveWhitespace);
      } else if (!this.insertNode(nodeType2.create(rule.attrs))) {
        this.leafFallback(dom);
      }
    } else {
      markType = this.parser.schema.marks[rule.mark];
      mark3 = markType.create(rule.attrs);
      this.addPendingMark(mark3);
    }
    var startIn = this.top;
    if (nodeType2 && nodeType2.isLeaf) {
      this.findInside(dom);
    } else if (continueAfter) {
      this.addElement(dom, continueAfter);
    } else if (rule.getContent) {
      this.findInside(dom);
      rule.getContent(dom, this.parser.schema).forEach(function(node4) {
        return this$1.insertNode(node4);
      });
    } else {
      var contentDOM = rule.contentElement;
      if (typeof contentDOM == "string") {
        contentDOM = dom.querySelector(contentDOM);
      } else if (typeof contentDOM == "function") {
        contentDOM = contentDOM(dom);
      }
      if (!contentDOM) {
        contentDOM = dom;
      }
      this.findAround(dom, contentDOM, true);
      this.addAll(contentDOM, sync2);
    }
    if (sync2) {
      this.sync(startIn);
      this.open--;
    }
    if (mark3) {
      this.removePendingMark(mark3, startIn);
    }
  };
  ParseContext.prototype.addAll = function addAll(parent, sync2, startIndex, endIndex) {
    var index2 = startIndex || 0;
    for (var dom = startIndex ? parent.childNodes[startIndex] : parent.firstChild, end3 = endIndex == null ? null : parent.childNodes[endIndex]; dom != end3; dom = dom.nextSibling, ++index2) {
      this.findAtPoint(parent, index2);
      this.addDOM(dom);
      if (sync2 && blockTags.hasOwnProperty(dom.nodeName.toLowerCase())) {
        this.sync(sync2);
      }
    }
    this.findAtPoint(parent, index2);
  };
  ParseContext.prototype.findPlace = function findPlace(node4) {
    var route, sync2;
    for (var depth = this.open; depth >= 0; depth--) {
      var cx = this.nodes[depth];
      var found2 = cx.findWrapping(node4);
      if (found2 && (!route || route.length > found2.length)) {
        route = found2;
        sync2 = cx;
        if (!found2.length) {
          break;
        }
      }
      if (cx.solid) {
        break;
      }
    }
    if (!route) {
      return false;
    }
    this.sync(sync2);
    for (var i = 0; i < route.length; i++) {
      this.enterInner(route[i], null, false);
    }
    return true;
  };
  ParseContext.prototype.insertNode = function insertNode(node4) {
    if (node4.isInline && this.needsBlock && !this.top.type) {
      var block = this.textblockFromContext();
      if (block) {
        this.enterInner(block);
      }
    }
    if (this.findPlace(node4)) {
      this.closeExtra();
      var top2 = this.top;
      top2.applyPending(node4.type);
      if (top2.match) {
        top2.match = top2.match.matchType(node4.type);
      }
      var marks2 = top2.activeMarks;
      for (var i = 0; i < node4.marks.length; i++) {
        if (!top2.type || top2.type.allowsMarkType(node4.marks[i].type)) {
          marks2 = node4.marks[i].addToSet(marks2);
        }
      }
      top2.content.push(node4.mark(marks2));
      return true;
    }
    return false;
  };
  ParseContext.prototype.enter = function enter(type, attrs, preserveWS) {
    var ok2 = this.findPlace(type.create(attrs));
    if (ok2) {
      this.enterInner(type, attrs, true, preserveWS);
    }
    return ok2;
  };
  ParseContext.prototype.enterInner = function enterInner(type, attrs, solid, preserveWS) {
    this.closeExtra();
    var top2 = this.top;
    top2.applyPending(type);
    top2.match = top2.match && top2.match.matchType(type, attrs);
    var options = wsOptionsFor(type, preserveWS, top2.options);
    if (top2.options & OPT_OPEN_LEFT && top2.content.length == 0) {
      options |= OPT_OPEN_LEFT;
    }
    this.nodes.push(new NodeContext(type, attrs, top2.activeMarks, top2.pendingMarks, solid, null, options));
    this.open++;
  };
  ParseContext.prototype.closeExtra = function closeExtra(openEnd) {
    var i = this.nodes.length - 1;
    if (i > this.open) {
      for (; i > this.open; i--) {
        this.nodes[i - 1].content.push(this.nodes[i].finish(openEnd));
      }
      this.nodes.length = this.open + 1;
    }
  };
  ParseContext.prototype.finish = function finish2() {
    this.open = 0;
    this.closeExtra(this.isOpen);
    return this.nodes[0].finish(this.isOpen || this.options.topOpen);
  };
  ParseContext.prototype.sync = function sync(to) {
    for (var i = this.open; i >= 0; i--) {
      if (this.nodes[i] == to) {
        this.open = i;
        return;
      }
    }
  };
  prototypeAccessors$6.currentPos.get = function() {
    this.closeExtra();
    var pos = 0;
    for (var i = this.open; i >= 0; i--) {
      var content2 = this.nodes[i].content;
      for (var j = content2.length - 1; j >= 0; j--) {
        pos += content2[j].nodeSize;
      }
      if (i) {
        pos++;
      }
    }
    return pos;
  };
  ParseContext.prototype.findAtPoint = function findAtPoint(parent, offset3) {
    if (this.find) {
      for (var i = 0; i < this.find.length; i++) {
        if (this.find[i].node == parent && this.find[i].offset == offset3) {
          this.find[i].pos = this.currentPos;
        }
      }
    }
  };
  ParseContext.prototype.findInside = function findInside(parent) {
    if (this.find) {
      for (var i = 0; i < this.find.length; i++) {
        if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node)) {
          this.find[i].pos = this.currentPos;
        }
      }
    }
  };
  ParseContext.prototype.findAround = function findAround(parent, content2, before2) {
    if (parent != content2 && this.find) {
      for (var i = 0; i < this.find.length; i++) {
        if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node)) {
          var pos = content2.compareDocumentPosition(this.find[i].node);
          if (pos & (before2 ? 2 : 4)) {
            this.find[i].pos = this.currentPos;
          }
        }
      }
    }
  };
  ParseContext.prototype.findInText = function findInText(textNode) {
    if (this.find) {
      for (var i = 0; i < this.find.length; i++) {
        if (this.find[i].node == textNode) {
          this.find[i].pos = this.currentPos - (textNode.nodeValue.length - this.find[i].offset);
        }
      }
    }
  };
  ParseContext.prototype.matchesContext = function matchesContext(context) {
    var this$1 = this;
    if (context.indexOf("|") > -1) {
      return context.split(/\s*\|\s*/).some(this.matchesContext, this);
    }
    var parts = context.split("/");
    var option = this.options.context;
    var useRoot = !this.isOpen && (!option || option.parent.type == this.nodes[0].type);
    var minDepth = -(option ? option.depth + 1 : 0) + (useRoot ? 0 : 1);
    var match = function(i, depth) {
      for (; i >= 0; i--) {
        var part = parts[i];
        if (part == "") {
          if (i == parts.length - 1 || i == 0) {
            continue;
          }
          for (; depth >= minDepth; depth--) {
            if (match(i - 1, depth)) {
              return true;
            }
          }
          return false;
        } else {
          var next = depth > 0 || depth == 0 && useRoot ? this$1.nodes[depth].type : option && depth >= minDepth ? option.node(depth - minDepth).type : null;
          if (!next || next.name != part && next.groups.indexOf(part) == -1) {
            return false;
          }
          depth--;
        }
      }
      return true;
    };
    return match(parts.length - 1, this.open);
  };
  ParseContext.prototype.textblockFromContext = function textblockFromContext() {
    var $context = this.options.context;
    if ($context) {
      for (var d = $context.depth; d >= 0; d--) {
        var deflt = $context.node(d).contentMatchAt($context.indexAfter(d)).defaultType;
        if (deflt && deflt.isTextblock && deflt.defaultAttrs) {
          return deflt;
        }
      }
    }
    for (var name in this.parser.schema.nodes) {
      var type = this.parser.schema.nodes[name];
      if (type.isTextblock && type.defaultAttrs) {
        return type;
      }
    }
  };
  ParseContext.prototype.addPendingMark = function addPendingMark(mark3) {
    var found2 = findSameMarkInSet(mark3, this.top.pendingMarks);
    if (found2) {
      this.top.stashMarks.push(found2);
    }
    this.top.pendingMarks = mark3.addToSet(this.top.pendingMarks);
  };
  ParseContext.prototype.removePendingMark = function removePendingMark(mark3, upto) {
    for (var depth = this.open; depth >= 0; depth--) {
      var level = this.nodes[depth];
      var found2 = level.pendingMarks.lastIndexOf(mark3);
      if (found2 > -1) {
        level.pendingMarks = mark3.removeFromSet(level.pendingMarks);
      } else {
        level.activeMarks = mark3.removeFromSet(level.activeMarks);
        var stashMark = level.popFromStashMark(mark3);
        if (stashMark && level.type && level.type.allowsMarkType(stashMark.type)) {
          level.activeMarks = stashMark.addToSet(level.activeMarks);
        }
      }
      if (level == upto) {
        break;
      }
    }
  };
  Object.defineProperties(ParseContext.prototype, prototypeAccessors$6);
  function normalizeList(dom) {
    for (var child3 = dom.firstChild, prevItem = null; child3; child3 = child3.nextSibling) {
      var name = child3.nodeType == 1 ? child3.nodeName.toLowerCase() : null;
      if (name && listTags.hasOwnProperty(name) && prevItem) {
        prevItem.appendChild(child3);
        child3 = prevItem;
      } else if (name == "li") {
        prevItem = child3;
      } else if (name) {
        prevItem = null;
      }
    }
  }
  function matches(dom, selector) {
    return (dom.matches || dom.msMatchesSelector || dom.webkitMatchesSelector || dom.mozMatchesSelector).call(dom, selector);
  }
  function parseStyles(style2) {
    var re = /\s*([\w-]+)\s*:\s*([^;]+)/g, m, result2 = [];
    while (m = re.exec(style2)) {
      result2.push(m[1], m[2].trim());
    }
    return result2;
  }
  function copy2(obj) {
    var copy5 = {};
    for (var prop in obj) {
      copy5[prop] = obj[prop];
    }
    return copy5;
  }
  function markMayApply(markType, nodeType2) {
    var nodes = nodeType2.schema.nodes;
    var loop = function(name2) {
      var parent = nodes[name2];
      if (!parent.allowsMarkType(markType)) {
        return;
      }
      var seen = [], scan = function(match) {
        seen.push(match);
        for (var i = 0; i < match.edgeCount; i++) {
          var ref = match.edge(i);
          var type = ref.type;
          var next = ref.next;
          if (type == nodeType2) {
            return true;
          }
          if (seen.indexOf(next) < 0 && scan(next)) {
            return true;
          }
        }
      };
      if (scan(parent.contentMatch)) {
        return { v: true };
      }
    };
    for (var name in nodes) {
      var returned = loop(name);
      if (returned)
        return returned.v;
    }
  }
  function findSameMarkInSet(mark3, set2) {
    for (var i = 0; i < set2.length; i++) {
      if (mark3.eq(set2[i])) {
        return set2[i];
      }
    }
  }
  var DOMSerializer = function DOMSerializer2(nodes, marks2) {
    this.nodes = nodes || {};
    this.marks = marks2 || {};
  };
  DOMSerializer.prototype.serializeFragment = function serializeFragment(fragment, options, target) {
    var this$1 = this;
    if (options === void 0)
      options = {};
    if (!target) {
      target = doc(options).createDocumentFragment();
    }
    var top2 = target, active = null;
    fragment.forEach(function(node4) {
      if (active || node4.marks.length) {
        if (!active) {
          active = [];
        }
        var keep = 0, rendered = 0;
        while (keep < active.length && rendered < node4.marks.length) {
          var next = node4.marks[rendered];
          if (!this$1.marks[next.type.name]) {
            rendered++;
            continue;
          }
          if (!next.eq(active[keep]) || next.type.spec.spanning === false) {
            break;
          }
          keep += 2;
          rendered++;
        }
        while (keep < active.length) {
          top2 = active.pop();
          active.pop();
        }
        while (rendered < node4.marks.length) {
          var add3 = node4.marks[rendered++];
          var markDOM = this$1.serializeMark(add3, node4.isInline, options);
          if (markDOM) {
            active.push(add3, top2);
            top2.appendChild(markDOM.dom);
            top2 = markDOM.contentDOM || markDOM.dom;
          }
        }
      }
      top2.appendChild(this$1.serializeNodeInner(node4, options));
    });
    return target;
  };
  DOMSerializer.prototype.serializeNodeInner = function serializeNodeInner(node4, options) {
    if (options === void 0)
      options = {};
    var ref = DOMSerializer.renderSpec(doc(options), this.nodes[node4.type.name](node4));
    var dom = ref.dom;
    var contentDOM = ref.contentDOM;
    if (contentDOM) {
      if (node4.isLeaf) {
        throw new RangeError("Content hole not allowed in a leaf node spec");
      }
      if (options.onContent) {
        options.onContent(node4, contentDOM, options);
      } else {
        this.serializeFragment(node4.content, options, contentDOM);
      }
    }
    return dom;
  };
  DOMSerializer.prototype.serializeNode = function serializeNode(node4, options) {
    if (options === void 0)
      options = {};
    var dom = this.serializeNodeInner(node4, options);
    for (var i = node4.marks.length - 1; i >= 0; i--) {
      var wrap = this.serializeMark(node4.marks[i], node4.isInline, options);
      if (wrap) {
        (wrap.contentDOM || wrap.dom).appendChild(dom);
        dom = wrap.dom;
      }
    }
    return dom;
  };
  DOMSerializer.prototype.serializeMark = function serializeMark(mark3, inline2, options) {
    if (options === void 0)
      options = {};
    var toDOM = this.marks[mark3.type.name];
    return toDOM && DOMSerializer.renderSpec(doc(options), toDOM(mark3, inline2));
  };
  DOMSerializer.renderSpec = function renderSpec(doc2, structure, xmlNS) {
    if (xmlNS === void 0)
      xmlNS = null;
    if (typeof structure == "string") {
      return { dom: doc2.createTextNode(structure) };
    }
    if (structure.nodeType != null) {
      return { dom: structure };
    }
    if (structure.dom && structure.dom.nodeType != null) {
      return structure;
    }
    var tagName = structure[0], space = tagName.indexOf(" ");
    if (space > 0) {
      xmlNS = tagName.slice(0, space);
      tagName = tagName.slice(space + 1);
    }
    var contentDOM = null, dom = xmlNS ? doc2.createElementNS(xmlNS, tagName) : doc2.createElement(tagName);
    var attrs = structure[1], start5 = 1;
    if (attrs && typeof attrs == "object" && attrs.nodeType == null && !Array.isArray(attrs)) {
      start5 = 2;
      for (var name in attrs) {
        if (attrs[name] != null) {
          var space$1 = name.indexOf(" ");
          if (space$1 > 0) {
            dom.setAttributeNS(name.slice(0, space$1), name.slice(space$1 + 1), attrs[name]);
          } else {
            dom.setAttribute(name, attrs[name]);
          }
        }
      }
    }
    for (var i = start5; i < structure.length; i++) {
      var child3 = structure[i];
      if (child3 === 0) {
        if (i < structure.length - 1 || i > start5) {
          throw new RangeError("Content hole must be the only child of its parent node");
        }
        return { dom, contentDOM: dom };
      } else {
        var ref = DOMSerializer.renderSpec(doc2, child3, xmlNS);
        var inner = ref.dom;
        var innerContent = ref.contentDOM;
        dom.appendChild(inner);
        if (innerContent) {
          if (contentDOM) {
            throw new RangeError("Multiple content holes");
          }
          contentDOM = innerContent;
        }
      }
    }
    return { dom, contentDOM };
  };
  DOMSerializer.fromSchema = function fromSchema2(schema) {
    return schema.cached.domSerializer || (schema.cached.domSerializer = new DOMSerializer(this.nodesFromSchema(schema), this.marksFromSchema(schema)));
  };
  DOMSerializer.nodesFromSchema = function nodesFromSchema(schema) {
    var result2 = gatherToDOM(schema.nodes);
    if (!result2.text) {
      result2.text = function(node4) {
        return node4.text;
      };
    }
    return result2;
  };
  DOMSerializer.marksFromSchema = function marksFromSchema(schema) {
    return gatherToDOM(schema.marks);
  };
  function gatherToDOM(obj) {
    var result2 = {};
    for (var name in obj) {
      var toDOM = obj[name].spec.toDOM;
      if (toDOM) {
        result2[name] = toDOM;
      }
    }
    return result2;
  }
  function doc(options) {
    return options.document || window.document;
  }

  // node_modules/prosemirror-transform/dist/index.es.js
  var lower16 = 65535;
  var factor16 = Math.pow(2, 16);
  function makeRecover(index2, offset3) {
    return index2 + offset3 * factor16;
  }
  function recoverIndex(value) {
    return value & lower16;
  }
  function recoverOffset(value) {
    return (value - (value & lower16)) / factor16;
  }
  var MapResult = function MapResult2(pos, deleted, recover2) {
    if (deleted === void 0)
      deleted = false;
    if (recover2 === void 0)
      recover2 = null;
    this.pos = pos;
    this.deleted = deleted;
    this.recover = recover2;
  };
  var StepMap = function StepMap2(ranges, inverted) {
    if (inverted === void 0)
      inverted = false;
    if (!ranges.length && StepMap2.empty) {
      return StepMap2.empty;
    }
    this.ranges = ranges;
    this.inverted = inverted;
  };
  StepMap.prototype.recover = function recover(value) {
    var diff = 0, index2 = recoverIndex(value);
    if (!this.inverted) {
      for (var i = 0; i < index2; i++) {
        diff += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
      }
    }
    return this.ranges[index2 * 3] + diff + recoverOffset(value);
  };
  StepMap.prototype.mapResult = function mapResult(pos, assoc) {
    if (assoc === void 0)
      assoc = 1;
    return this._map(pos, assoc, false);
  };
  StepMap.prototype.map = function map(pos, assoc) {
    if (assoc === void 0)
      assoc = 1;
    return this._map(pos, assoc, true);
  };
  StepMap.prototype._map = function _map(pos, assoc, simple) {
    var diff = 0, oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
    for (var i = 0; i < this.ranges.length; i += 3) {
      var start5 = this.ranges[i] - (this.inverted ? diff : 0);
      if (start5 > pos) {
        break;
      }
      var oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex], end3 = start5 + oldSize;
      if (pos <= end3) {
        var side = !oldSize ? assoc : pos == start5 ? -1 : pos == end3 ? 1 : assoc;
        var result2 = start5 + diff + (side < 0 ? 0 : newSize);
        if (simple) {
          return result2;
        }
        var recover2 = pos == (assoc < 0 ? start5 : end3) ? null : makeRecover(i / 3, pos - start5);
        return new MapResult(result2, assoc < 0 ? pos != start5 : pos != end3, recover2);
      }
      diff += newSize - oldSize;
    }
    return simple ? pos + diff : new MapResult(pos + diff);
  };
  StepMap.prototype.touches = function touches(pos, recover2) {
    var diff = 0, index2 = recoverIndex(recover2);
    var oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
    for (var i = 0; i < this.ranges.length; i += 3) {
      var start5 = this.ranges[i] - (this.inverted ? diff : 0);
      if (start5 > pos) {
        break;
      }
      var oldSize = this.ranges[i + oldIndex], end3 = start5 + oldSize;
      if (pos <= end3 && i == index2 * 3) {
        return true;
      }
      diff += this.ranges[i + newIndex] - oldSize;
    }
    return false;
  };
  StepMap.prototype.forEach = function forEach3(f) {
    var oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
    for (var i = 0, diff = 0; i < this.ranges.length; i += 3) {
      var start5 = this.ranges[i], oldStart = start5 - (this.inverted ? diff : 0), newStart = start5 + (this.inverted ? 0 : diff);
      var oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex];
      f(oldStart, oldStart + oldSize, newStart, newStart + newSize);
      diff += newSize - oldSize;
    }
  };
  StepMap.prototype.invert = function invert() {
    return new StepMap(this.ranges, !this.inverted);
  };
  StepMap.prototype.toString = function toString6() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  };
  StepMap.offset = function offset2(n) {
    return n == 0 ? StepMap.empty : new StepMap(n < 0 ? [0, -n, 0] : [0, 0, n]);
  };
  StepMap.empty = new StepMap([]);
  var Mapping = function Mapping2(maps, mirror, from4, to) {
    this.maps = maps || [];
    this.from = from4 || 0;
    this.to = to == null ? this.maps.length : to;
    this.mirror = mirror;
  };
  Mapping.prototype.slice = function slice2(from4, to) {
    if (from4 === void 0)
      from4 = 0;
    if (to === void 0)
      to = this.maps.length;
    return new Mapping(this.maps, this.mirror, from4, to);
  };
  Mapping.prototype.copy = function copy3() {
    return new Mapping(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
  };
  Mapping.prototype.appendMap = function appendMap(map15, mirrors) {
    this.to = this.maps.push(map15);
    if (mirrors != null) {
      this.setMirror(this.maps.length - 1, mirrors);
    }
  };
  Mapping.prototype.appendMapping = function appendMapping(mapping) {
    for (var i = 0, startSize = this.maps.length; i < mapping.maps.length; i++) {
      var mirr = mapping.getMirror(i);
      this.appendMap(mapping.maps[i], mirr != null && mirr < i ? startSize + mirr : null);
    }
  };
  Mapping.prototype.getMirror = function getMirror(n) {
    if (this.mirror) {
      for (var i = 0; i < this.mirror.length; i++) {
        if (this.mirror[i] == n) {
          return this.mirror[i + (i % 2 ? -1 : 1)];
        }
      }
    }
  };
  Mapping.prototype.setMirror = function setMirror(n, m) {
    if (!this.mirror) {
      this.mirror = [];
    }
    this.mirror.push(n, m);
  };
  Mapping.prototype.appendMappingInverted = function appendMappingInverted(mapping) {
    for (var i = mapping.maps.length - 1, totalSize = this.maps.length + mapping.maps.length; i >= 0; i--) {
      var mirr = mapping.getMirror(i);
      this.appendMap(mapping.maps[i].invert(), mirr != null && mirr > i ? totalSize - mirr - 1 : null);
    }
  };
  Mapping.prototype.invert = function invert2() {
    var inverse = new Mapping();
    inverse.appendMappingInverted(this);
    return inverse;
  };
  Mapping.prototype.map = function map2(pos, assoc) {
    if (assoc === void 0)
      assoc = 1;
    if (this.mirror) {
      return this._map(pos, assoc, true);
    }
    for (var i = this.from; i < this.to; i++) {
      pos = this.maps[i].map(pos, assoc);
    }
    return pos;
  };
  Mapping.prototype.mapResult = function mapResult2(pos, assoc) {
    if (assoc === void 0)
      assoc = 1;
    return this._map(pos, assoc, false);
  };
  Mapping.prototype._map = function _map2(pos, assoc, simple) {
    var deleted = false;
    for (var i = this.from; i < this.to; i++) {
      var map15 = this.maps[i], result2 = map15.mapResult(pos, assoc);
      if (result2.recover != null) {
        var corr = this.getMirror(i);
        if (corr != null && corr > i && corr < this.to) {
          i = corr;
          pos = this.maps[corr].recover(result2.recover);
          continue;
        }
      }
      if (result2.deleted) {
        deleted = true;
      }
      pos = result2.pos;
    }
    return simple ? pos : new MapResult(pos, deleted);
  };
  function TransformError(message) {
    var err2 = Error.call(this, message);
    err2.__proto__ = TransformError.prototype;
    return err2;
  }
  TransformError.prototype = Object.create(Error.prototype);
  TransformError.prototype.constructor = TransformError;
  TransformError.prototype.name = "TransformError";
  var Transform = function Transform2(doc2) {
    this.doc = doc2;
    this.steps = [];
    this.docs = [];
    this.mapping = new Mapping();
  };
  var prototypeAccessors2 = { before: { configurable: true }, docChanged: { configurable: true } };
  prototypeAccessors2.before.get = function() {
    return this.docs.length ? this.docs[0] : this.doc;
  };
  Transform.prototype.step = function step(object) {
    var result2 = this.maybeStep(object);
    if (result2.failed) {
      throw new TransformError(result2.failed);
    }
    return this;
  };
  Transform.prototype.maybeStep = function maybeStep(step2) {
    var result2 = step2.apply(this.doc);
    if (!result2.failed) {
      this.addStep(step2, result2.doc);
    }
    return result2;
  };
  prototypeAccessors2.docChanged.get = function() {
    return this.steps.length > 0;
  };
  Transform.prototype.addStep = function addStep(step2, doc2) {
    this.docs.push(this.doc);
    this.steps.push(step2);
    this.mapping.appendMap(step2.getMap());
    this.doc = doc2;
  };
  Object.defineProperties(Transform.prototype, prototypeAccessors2);
  function mustOverride() {
    throw new Error("Override me");
  }
  var stepsByID = /* @__PURE__ */ Object.create(null);
  var Step = function Step2() {
  };
  Step.prototype.apply = function apply(_doc) {
    return mustOverride();
  };
  Step.prototype.getMap = function getMap() {
    return StepMap.empty;
  };
  Step.prototype.invert = function invert3(_doc) {
    return mustOverride();
  };
  Step.prototype.map = function map3(_mapping) {
    return mustOverride();
  };
  Step.prototype.merge = function merge(_other) {
    return null;
  };
  Step.prototype.toJSON = function toJSON5() {
    return mustOverride();
  };
  Step.fromJSON = function fromJSON5(schema, json) {
    if (!json || !json.stepType) {
      throw new RangeError("Invalid input for Step.fromJSON");
    }
    var type = stepsByID[json.stepType];
    if (!type) {
      throw new RangeError("No step type " + json.stepType + " defined");
    }
    return type.fromJSON(schema, json);
  };
  Step.jsonID = function jsonID(id, stepClass) {
    if (id in stepsByID) {
      throw new RangeError("Duplicate use of step JSON ID " + id);
    }
    stepsByID[id] = stepClass;
    stepClass.prototype.jsonID = id;
    return stepClass;
  };
  var StepResult = function StepResult2(doc2, failed) {
    this.doc = doc2;
    this.failed = failed;
  };
  StepResult.ok = function ok(doc2) {
    return new StepResult(doc2, null);
  };
  StepResult.fail = function fail(message) {
    return new StepResult(null, message);
  };
  StepResult.fromReplace = function fromReplace(doc2, from4, to, slice4) {
    try {
      return StepResult.ok(doc2.replace(from4, to, slice4));
    } catch (e) {
      if (e instanceof ReplaceError) {
        return StepResult.fail(e.message);
      }
      throw e;
    }
  };
  var ReplaceStep = /* @__PURE__ */ function(Step3) {
    function ReplaceStep2(from4, to, slice4, structure) {
      Step3.call(this);
      this.from = from4;
      this.to = to;
      this.slice = slice4;
      this.structure = !!structure;
    }
    if (Step3)
      ReplaceStep2.__proto__ = Step3;
    ReplaceStep2.prototype = Object.create(Step3 && Step3.prototype);
    ReplaceStep2.prototype.constructor = ReplaceStep2;
    ReplaceStep2.prototype.apply = function apply8(doc2) {
      if (this.structure && contentBetween(doc2, this.from, this.to)) {
        return StepResult.fail("Structure replace would overwrite content");
      }
      return StepResult.fromReplace(doc2, this.from, this.to, this.slice);
    };
    ReplaceStep2.prototype.getMap = function getMap2() {
      return new StepMap([this.from, this.to - this.from, this.slice.size]);
    };
    ReplaceStep2.prototype.invert = function invert4(doc2) {
      return new ReplaceStep2(this.from, this.from + this.slice.size, doc2.slice(this.from, this.to));
    };
    ReplaceStep2.prototype.map = function map15(mapping) {
      var from4 = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
      if (from4.deleted && to.deleted) {
        return null;
      }
      return new ReplaceStep2(from4.pos, Math.max(from4.pos, to.pos), this.slice);
    };
    ReplaceStep2.prototype.merge = function merge3(other) {
      if (!(other instanceof ReplaceStep2) || other.structure || this.structure) {
        return null;
      }
      if (this.from + this.slice.size == other.from && !this.slice.openEnd && !other.slice.openStart) {
        var slice4 = this.slice.size + other.slice.size == 0 ? Slice.empty : new Slice(this.slice.content.append(other.slice.content), this.slice.openStart, other.slice.openEnd);
        return new ReplaceStep2(this.from, this.to + (other.to - other.from), slice4, this.structure);
      } else if (other.to == this.from && !this.slice.openStart && !other.slice.openEnd) {
        var slice$1 = this.slice.size + other.slice.size == 0 ? Slice.empty : new Slice(other.slice.content.append(this.slice.content), other.slice.openStart, this.slice.openEnd);
        return new ReplaceStep2(other.from, this.to, slice$1, this.structure);
      } else {
        return null;
      }
    };
    ReplaceStep2.prototype.toJSON = function toJSON7() {
      var json = { stepType: "replace", from: this.from, to: this.to };
      if (this.slice.size) {
        json.slice = this.slice.toJSON();
      }
      if (this.structure) {
        json.structure = true;
      }
      return json;
    };
    ReplaceStep2.fromJSON = function fromJSON8(schema, json) {
      if (typeof json.from != "number" || typeof json.to != "number") {
        throw new RangeError("Invalid input for ReplaceStep.fromJSON");
      }
      return new ReplaceStep2(json.from, json.to, Slice.fromJSON(schema, json.slice), !!json.structure);
    };
    return ReplaceStep2;
  }(Step);
  Step.jsonID("replace", ReplaceStep);
  var ReplaceAroundStep = /* @__PURE__ */ function(Step3) {
    function ReplaceAroundStep2(from4, to, gapFrom, gapTo, slice4, insert, structure) {
      Step3.call(this);
      this.from = from4;
      this.to = to;
      this.gapFrom = gapFrom;
      this.gapTo = gapTo;
      this.slice = slice4;
      this.insert = insert;
      this.structure = !!structure;
    }
    if (Step3)
      ReplaceAroundStep2.__proto__ = Step3;
    ReplaceAroundStep2.prototype = Object.create(Step3 && Step3.prototype);
    ReplaceAroundStep2.prototype.constructor = ReplaceAroundStep2;
    ReplaceAroundStep2.prototype.apply = function apply8(doc2) {
      if (this.structure && (contentBetween(doc2, this.from, this.gapFrom) || contentBetween(doc2, this.gapTo, this.to))) {
        return StepResult.fail("Structure gap-replace would overwrite content");
      }
      var gap = doc2.slice(this.gapFrom, this.gapTo);
      if (gap.openStart || gap.openEnd) {
        return StepResult.fail("Gap is not a flat range");
      }
      var inserted = this.slice.insertAt(this.insert, gap.content);
      if (!inserted) {
        return StepResult.fail("Content does not fit in gap");
      }
      return StepResult.fromReplace(doc2, this.from, this.to, inserted);
    };
    ReplaceAroundStep2.prototype.getMap = function getMap2() {
      return new StepMap([
        this.from,
        this.gapFrom - this.from,
        this.insert,
        this.gapTo,
        this.to - this.gapTo,
        this.slice.size - this.insert
      ]);
    };
    ReplaceAroundStep2.prototype.invert = function invert4(doc2) {
      var gap = this.gapTo - this.gapFrom;
      return new ReplaceAroundStep2(this.from, this.from + this.slice.size + gap, this.from + this.insert, this.from + this.insert + gap, doc2.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
    };
    ReplaceAroundStep2.prototype.map = function map15(mapping) {
      var from4 = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
      var gapFrom = mapping.map(this.gapFrom, -1), gapTo = mapping.map(this.gapTo, 1);
      if (from4.deleted && to.deleted || gapFrom < from4.pos || gapTo > to.pos) {
        return null;
      }
      return new ReplaceAroundStep2(from4.pos, to.pos, gapFrom, gapTo, this.slice, this.insert, this.structure);
    };
    ReplaceAroundStep2.prototype.toJSON = function toJSON7() {
      var json = {
        stepType: "replaceAround",
        from: this.from,
        to: this.to,
        gapFrom: this.gapFrom,
        gapTo: this.gapTo,
        insert: this.insert
      };
      if (this.slice.size) {
        json.slice = this.slice.toJSON();
      }
      if (this.structure) {
        json.structure = true;
      }
      return json;
    };
    ReplaceAroundStep2.fromJSON = function fromJSON8(schema, json) {
      if (typeof json.from != "number" || typeof json.to != "number" || typeof json.gapFrom != "number" || typeof json.gapTo != "number" || typeof json.insert != "number") {
        throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
      }
      return new ReplaceAroundStep2(json.from, json.to, json.gapFrom, json.gapTo, Slice.fromJSON(schema, json.slice), json.insert, !!json.structure);
    };
    return ReplaceAroundStep2;
  }(Step);
  Step.jsonID("replaceAround", ReplaceAroundStep);
  function contentBetween(doc2, from4, to) {
    var $from = doc2.resolve(from4), dist = to - from4, depth = $from.depth;
    while (dist > 0 && depth > 0 && $from.indexAfter(depth) == $from.node(depth).childCount) {
      depth--;
      dist--;
    }
    if (dist > 0) {
      var next = $from.node(depth).maybeChild($from.indexAfter(depth));
      while (dist > 0) {
        if (!next || next.isLeaf) {
          return true;
        }
        next = next.firstChild;
        dist--;
      }
    }
    return false;
  }
  function canCut(node4, start5, end3) {
    return (start5 == 0 || node4.canReplace(start5, node4.childCount)) && (end3 == node4.childCount || node4.canReplace(0, end3));
  }
  function liftTarget(range) {
    var parent = range.parent;
    var content2 = parent.content.cutByIndex(range.startIndex, range.endIndex);
    for (var depth = range.depth; ; --depth) {
      var node4 = range.$from.node(depth);
      var index2 = range.$from.index(depth), endIndex = range.$to.indexAfter(depth);
      if (depth < range.depth && node4.canReplace(index2, endIndex, content2)) {
        return depth;
      }
      if (depth == 0 || node4.type.spec.isolating || !canCut(node4, index2, endIndex)) {
        break;
      }
    }
  }
  Transform.prototype.lift = function(range, target) {
    var $from = range.$from;
    var $to = range.$to;
    var depth = range.depth;
    var gapStart = $from.before(depth + 1), gapEnd = $to.after(depth + 1);
    var start5 = gapStart, end3 = gapEnd;
    var before2 = Fragment.empty, openStart = 0;
    for (var d = depth, splitting = false; d > target; d--) {
      if (splitting || $from.index(d) > 0) {
        splitting = true;
        before2 = Fragment.from($from.node(d).copy(before2));
        openStart++;
      } else {
        start5--;
      }
    }
    var after2 = Fragment.empty, openEnd = 0;
    for (var d$1 = depth, splitting$1 = false; d$1 > target; d$1--) {
      if (splitting$1 || $to.after(d$1 + 1) < $to.end(d$1)) {
        splitting$1 = true;
        after2 = Fragment.from($to.node(d$1).copy(after2));
        openEnd++;
      } else {
        end3++;
      }
    }
    return this.step(new ReplaceAroundStep(start5, end3, gapStart, gapEnd, new Slice(before2.append(after2), openStart, openEnd), before2.size - openStart, true));
  };
  function findWrapping3(range, nodeType2, attrs, innerRange) {
    if (innerRange === void 0)
      innerRange = range;
    var around = findWrappingOutside(range, nodeType2);
    var inner = around && findWrappingInside(innerRange, nodeType2);
    if (!inner) {
      return null;
    }
    return around.map(withAttrs).concat({ type: nodeType2, attrs }).concat(inner.map(withAttrs));
  }
  function withAttrs(type) {
    return { type, attrs: null };
  }
  function findWrappingOutside(range, type) {
    var parent = range.parent;
    var startIndex = range.startIndex;
    var endIndex = range.endIndex;
    var around = parent.contentMatchAt(startIndex).findWrapping(type);
    if (!around) {
      return null;
    }
    var outer = around.length ? around[0] : type;
    return parent.canReplaceWith(startIndex, endIndex, outer) ? around : null;
  }
  function findWrappingInside(range, type) {
    var parent = range.parent;
    var startIndex = range.startIndex;
    var endIndex = range.endIndex;
    var inner = parent.child(startIndex);
    var inside = type.contentMatch.findWrapping(inner.type);
    if (!inside) {
      return null;
    }
    var lastType = inside.length ? inside[inside.length - 1] : type;
    var innerMatch = lastType.contentMatch;
    for (var i = startIndex; innerMatch && i < endIndex; i++) {
      innerMatch = innerMatch.matchType(parent.child(i).type);
    }
    if (!innerMatch || !innerMatch.validEnd) {
      return null;
    }
    return inside;
  }
  Transform.prototype.wrap = function(range, wrappers) {
    var content2 = Fragment.empty;
    for (var i = wrappers.length - 1; i >= 0; i--) {
      if (content2.size) {
        var match = wrappers[i].type.contentMatch.matchFragment(content2);
        if (!match || !match.validEnd) {
          throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
        }
      }
      content2 = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content2));
    }
    var start5 = range.start, end3 = range.end;
    return this.step(new ReplaceAroundStep(start5, end3, start5, end3, new Slice(content2, 0, 0), wrappers.length, true));
  };
  Transform.prototype.setBlockType = function(from4, to, type, attrs) {
    var this$1 = this;
    if (to === void 0)
      to = from4;
    if (!type.isTextblock) {
      throw new RangeError("Type given to setBlockType should be a textblock");
    }
    var mapFrom = this.steps.length;
    this.doc.nodesBetween(from4, to, function(node4, pos) {
      if (node4.isTextblock && !node4.hasMarkup(type, attrs) && canChangeType(this$1.doc, this$1.mapping.slice(mapFrom).map(pos), type)) {
        this$1.clearIncompatible(this$1.mapping.slice(mapFrom).map(pos, 1), type);
        var mapping = this$1.mapping.slice(mapFrom);
        var startM = mapping.map(pos, 1), endM = mapping.map(pos + node4.nodeSize, 1);
        this$1.step(new ReplaceAroundStep(startM, endM, startM + 1, endM - 1, new Slice(Fragment.from(type.create(attrs, null, node4.marks)), 0, 0), 1, true));
        return false;
      }
    });
    return this;
  };
  function canChangeType(doc2, pos, type) {
    var $pos = doc2.resolve(pos), index2 = $pos.index();
    return $pos.parent.canReplaceWith(index2, index2 + 1, type);
  }
  Transform.prototype.setNodeMarkup = function(pos, type, attrs, marks2) {
    var node4 = this.doc.nodeAt(pos);
    if (!node4) {
      throw new RangeError("No node at given position");
    }
    if (!type) {
      type = node4.type;
    }
    var newNode = type.create(attrs, null, marks2 || node4.marks);
    if (node4.isLeaf) {
      return this.replaceWith(pos, pos + node4.nodeSize, newNode);
    }
    if (!type.validContent(node4.content)) {
      throw new RangeError("Invalid content for node type " + type.name);
    }
    return this.step(new ReplaceAroundStep(pos, pos + node4.nodeSize, pos + 1, pos + node4.nodeSize - 1, new Slice(Fragment.from(newNode), 0, 0), 1, true));
  };
  function canSplit(doc2, pos, depth, typesAfter) {
    if (depth === void 0)
      depth = 1;
    var $pos = doc2.resolve(pos), base2 = $pos.depth - depth;
    var innerType = typesAfter && typesAfter[typesAfter.length - 1] || $pos.parent;
    if (base2 < 0 || $pos.parent.type.spec.isolating || !$pos.parent.canReplace($pos.index(), $pos.parent.childCount) || !innerType.type.validContent($pos.parent.content.cutByIndex($pos.index(), $pos.parent.childCount))) {
      return false;
    }
    for (var d = $pos.depth - 1, i = depth - 2; d > base2; d--, i--) {
      var node4 = $pos.node(d), index$1 = $pos.index(d);
      if (node4.type.spec.isolating) {
        return false;
      }
      var rest = node4.content.cutByIndex(index$1, node4.childCount);
      var after2 = typesAfter && typesAfter[i] || node4;
      if (after2 != node4) {
        rest = rest.replaceChild(0, after2.type.create(after2.attrs));
      }
      if (!node4.canReplace(index$1 + 1, node4.childCount) || !after2.type.validContent(rest)) {
        return false;
      }
    }
    var index2 = $pos.indexAfter(base2);
    var baseType = typesAfter && typesAfter[0];
    return $pos.node(base2).canReplaceWith(index2, index2, baseType ? baseType.type : $pos.node(base2 + 1).type);
  }
  Transform.prototype.split = function(pos, depth, typesAfter) {
    if (depth === void 0)
      depth = 1;
    var $pos = this.doc.resolve(pos), before2 = Fragment.empty, after2 = Fragment.empty;
    for (var d = $pos.depth, e = $pos.depth - depth, i = depth - 1; d > e; d--, i--) {
      before2 = Fragment.from($pos.node(d).copy(before2));
      var typeAfter = typesAfter && typesAfter[i];
      after2 = Fragment.from(typeAfter ? typeAfter.type.create(typeAfter.attrs, after2) : $pos.node(d).copy(after2));
    }
    return this.step(new ReplaceStep(pos, pos, new Slice(before2.append(after2), depth, depth), true));
  };
  function canJoin(doc2, pos) {
    var $pos = doc2.resolve(pos), index2 = $pos.index();
    return joinable2($pos.nodeBefore, $pos.nodeAfter) && $pos.parent.canReplace(index2, index2 + 1);
  }
  function joinable2(a, b) {
    return a && b && !a.isLeaf && a.canAppend(b);
  }
  Transform.prototype.join = function(pos, depth) {
    if (depth === void 0)
      depth = 1;
    var step2 = new ReplaceStep(pos - depth, pos + depth, Slice.empty, true);
    return this.step(step2);
  };
  function insertPoint(doc2, pos, nodeType2) {
    var $pos = doc2.resolve(pos);
    if ($pos.parent.canReplaceWith($pos.index(), $pos.index(), nodeType2)) {
      return pos;
    }
    if ($pos.parentOffset == 0) {
      for (var d = $pos.depth - 1; d >= 0; d--) {
        var index2 = $pos.index(d);
        if ($pos.node(d).canReplaceWith(index2, index2, nodeType2)) {
          return $pos.before(d + 1);
        }
        if (index2 > 0) {
          return null;
        }
      }
    }
    if ($pos.parentOffset == $pos.parent.content.size) {
      for (var d$1 = $pos.depth - 1; d$1 >= 0; d$1--) {
        var index$1 = $pos.indexAfter(d$1);
        if ($pos.node(d$1).canReplaceWith(index$1, index$1, nodeType2)) {
          return $pos.after(d$1 + 1);
        }
        if (index$1 < $pos.node(d$1).childCount) {
          return null;
        }
      }
    }
  }
  function dropPoint(doc2, pos, slice4) {
    var $pos = doc2.resolve(pos);
    if (!slice4.content.size) {
      return pos;
    }
    var content2 = slice4.content;
    for (var i = 0; i < slice4.openStart; i++) {
      content2 = content2.firstChild.content;
    }
    for (var pass = 1; pass <= (slice4.openStart == 0 && slice4.size ? 2 : 1); pass++) {
      for (var d = $pos.depth; d >= 0; d--) {
        var bias = d == $pos.depth ? 0 : $pos.pos <= ($pos.start(d + 1) + $pos.end(d + 1)) / 2 ? -1 : 1;
        var insertPos = $pos.index(d) + (bias > 0 ? 1 : 0);
        var parent = $pos.node(d), fits = false;
        if (pass == 1) {
          fits = parent.canReplace(insertPos, insertPos, content2);
        } else {
          var wrapping = parent.contentMatchAt(insertPos).findWrapping(content2.firstChild.type);
          fits = wrapping && parent.canReplaceWith(insertPos, insertPos, wrapping[0]);
        }
        if (fits) {
          return bias == 0 ? $pos.pos : bias < 0 ? $pos.before(d + 1) : $pos.after(d + 1);
        }
      }
    }
    return null;
  }
  function mapFragment(fragment, f, parent) {
    var mapped = [];
    for (var i = 0; i < fragment.childCount; i++) {
      var child3 = fragment.child(i);
      if (child3.content.size) {
        child3 = child3.copy(mapFragment(child3.content, f, child3));
      }
      if (child3.isInline) {
        child3 = f(child3, parent, i);
      }
      mapped.push(child3);
    }
    return Fragment.fromArray(mapped);
  }
  var AddMarkStep = /* @__PURE__ */ function(Step3) {
    function AddMarkStep2(from4, to, mark3) {
      Step3.call(this);
      this.from = from4;
      this.to = to;
      this.mark = mark3;
    }
    if (Step3)
      AddMarkStep2.__proto__ = Step3;
    AddMarkStep2.prototype = Object.create(Step3 && Step3.prototype);
    AddMarkStep2.prototype.constructor = AddMarkStep2;
    AddMarkStep2.prototype.apply = function apply8(doc2) {
      var this$1 = this;
      var oldSlice = doc2.slice(this.from, this.to), $from = doc2.resolve(this.from);
      var parent = $from.node($from.sharedDepth(this.to));
      var slice4 = new Slice(mapFragment(oldSlice.content, function(node4, parent2) {
        if (!node4.isAtom || !parent2.type.allowsMarkType(this$1.mark.type)) {
          return node4;
        }
        return node4.mark(this$1.mark.addToSet(node4.marks));
      }, parent), oldSlice.openStart, oldSlice.openEnd);
      return StepResult.fromReplace(doc2, this.from, this.to, slice4);
    };
    AddMarkStep2.prototype.invert = function invert4() {
      return new RemoveMarkStep(this.from, this.to, this.mark);
    };
    AddMarkStep2.prototype.map = function map15(mapping) {
      var from4 = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
      if (from4.deleted && to.deleted || from4.pos >= to.pos) {
        return null;
      }
      return new AddMarkStep2(from4.pos, to.pos, this.mark);
    };
    AddMarkStep2.prototype.merge = function merge3(other) {
      if (other instanceof AddMarkStep2 && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from) {
        return new AddMarkStep2(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
      }
    };
    AddMarkStep2.prototype.toJSON = function toJSON7() {
      return {
        stepType: "addMark",
        mark: this.mark.toJSON(),
        from: this.from,
        to: this.to
      };
    };
    AddMarkStep2.fromJSON = function fromJSON8(schema, json) {
      if (typeof json.from != "number" || typeof json.to != "number") {
        throw new RangeError("Invalid input for AddMarkStep.fromJSON");
      }
      return new AddMarkStep2(json.from, json.to, schema.markFromJSON(json.mark));
    };
    return AddMarkStep2;
  }(Step);
  Step.jsonID("addMark", AddMarkStep);
  var RemoveMarkStep = /* @__PURE__ */ function(Step3) {
    function RemoveMarkStep2(from4, to, mark3) {
      Step3.call(this);
      this.from = from4;
      this.to = to;
      this.mark = mark3;
    }
    if (Step3)
      RemoveMarkStep2.__proto__ = Step3;
    RemoveMarkStep2.prototype = Object.create(Step3 && Step3.prototype);
    RemoveMarkStep2.prototype.constructor = RemoveMarkStep2;
    RemoveMarkStep2.prototype.apply = function apply8(doc2) {
      var this$1 = this;
      var oldSlice = doc2.slice(this.from, this.to);
      var slice4 = new Slice(mapFragment(oldSlice.content, function(node4) {
        return node4.mark(this$1.mark.removeFromSet(node4.marks));
      }), oldSlice.openStart, oldSlice.openEnd);
      return StepResult.fromReplace(doc2, this.from, this.to, slice4);
    };
    RemoveMarkStep2.prototype.invert = function invert4() {
      return new AddMarkStep(this.from, this.to, this.mark);
    };
    RemoveMarkStep2.prototype.map = function map15(mapping) {
      var from4 = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
      if (from4.deleted && to.deleted || from4.pos >= to.pos) {
        return null;
      }
      return new RemoveMarkStep2(from4.pos, to.pos, this.mark);
    };
    RemoveMarkStep2.prototype.merge = function merge3(other) {
      if (other instanceof RemoveMarkStep2 && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from) {
        return new RemoveMarkStep2(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
      }
    };
    RemoveMarkStep2.prototype.toJSON = function toJSON7() {
      return {
        stepType: "removeMark",
        mark: this.mark.toJSON(),
        from: this.from,
        to: this.to
      };
    };
    RemoveMarkStep2.fromJSON = function fromJSON8(schema, json) {
      if (typeof json.from != "number" || typeof json.to != "number") {
        throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
      }
      return new RemoveMarkStep2(json.from, json.to, schema.markFromJSON(json.mark));
    };
    return RemoveMarkStep2;
  }(Step);
  Step.jsonID("removeMark", RemoveMarkStep);
  Transform.prototype.addMark = function(from4, to, mark3) {
    var this$1 = this;
    var removed = [], added = [], removing = null, adding = null;
    this.doc.nodesBetween(from4, to, function(node4, pos, parent) {
      if (!node4.isInline) {
        return;
      }
      var marks2 = node4.marks;
      if (!mark3.isInSet(marks2) && parent.type.allowsMarkType(mark3.type)) {
        var start5 = Math.max(pos, from4), end3 = Math.min(pos + node4.nodeSize, to);
        var newSet = mark3.addToSet(marks2);
        for (var i = 0; i < marks2.length; i++) {
          if (!marks2[i].isInSet(newSet)) {
            if (removing && removing.to == start5 && removing.mark.eq(marks2[i])) {
              removing.to = end3;
            } else {
              removed.push(removing = new RemoveMarkStep(start5, end3, marks2[i]));
            }
          }
        }
        if (adding && adding.to == start5) {
          adding.to = end3;
        } else {
          added.push(adding = new AddMarkStep(start5, end3, mark3));
        }
      }
    });
    removed.forEach(function(s) {
      return this$1.step(s);
    });
    added.forEach(function(s) {
      return this$1.step(s);
    });
    return this;
  };
  Transform.prototype.removeMark = function(from4, to, mark3) {
    var this$1 = this;
    if (mark3 === void 0)
      mark3 = null;
    var matched = [], step2 = 0;
    this.doc.nodesBetween(from4, to, function(node4, pos) {
      if (!node4.isInline) {
        return;
      }
      step2++;
      var toRemove = null;
      if (mark3 instanceof MarkType) {
        var set2 = node4.marks, found2;
        while (found2 = mark3.isInSet(set2)) {
          (toRemove || (toRemove = [])).push(found2);
          set2 = found2.removeFromSet(set2);
        }
      } else if (mark3) {
        if (mark3.isInSet(node4.marks)) {
          toRemove = [mark3];
        }
      } else {
        toRemove = node4.marks;
      }
      if (toRemove && toRemove.length) {
        var end3 = Math.min(pos + node4.nodeSize, to);
        for (var i = 0; i < toRemove.length; i++) {
          var style2 = toRemove[i], found$1 = void 0;
          for (var j = 0; j < matched.length; j++) {
            var m = matched[j];
            if (m.step == step2 - 1 && style2.eq(matched[j].style)) {
              found$1 = m;
            }
          }
          if (found$1) {
            found$1.to = end3;
            found$1.step = step2;
          } else {
            matched.push({ style: style2, from: Math.max(pos, from4), to: end3, step: step2 });
          }
        }
      }
    });
    matched.forEach(function(m) {
      return this$1.step(new RemoveMarkStep(m.from, m.to, m.style));
    });
    return this;
  };
  Transform.prototype.clearIncompatible = function(pos, parentType, match) {
    if (match === void 0)
      match = parentType.contentMatch;
    var node4 = this.doc.nodeAt(pos);
    var delSteps = [], cur = pos + 1;
    for (var i = 0; i < node4.childCount; i++) {
      var child3 = node4.child(i), end3 = cur + child3.nodeSize;
      var allowed = match.matchType(child3.type, child3.attrs);
      if (!allowed) {
        delSteps.push(new ReplaceStep(cur, end3, Slice.empty));
      } else {
        match = allowed;
        for (var j = 0; j < child3.marks.length; j++) {
          if (!parentType.allowsMarkType(child3.marks[j].type)) {
            this.step(new RemoveMarkStep(cur, end3, child3.marks[j]));
          }
        }
      }
      cur = end3;
    }
    if (!match.validEnd) {
      var fill = match.fillBefore(Fragment.empty, true);
      this.replace(cur, cur, new Slice(fill, 0, 0));
    }
    for (var i$1 = delSteps.length - 1; i$1 >= 0; i$1--) {
      this.step(delSteps[i$1]);
    }
    return this;
  };
  function replaceStep(doc2, from4, to, slice4) {
    if (to === void 0)
      to = from4;
    if (slice4 === void 0)
      slice4 = Slice.empty;
    if (from4 == to && !slice4.size) {
      return null;
    }
    var $from = doc2.resolve(from4), $to = doc2.resolve(to);
    if (fitsTrivially($from, $to, slice4)) {
      return new ReplaceStep(from4, to, slice4);
    }
    return new Fitter($from, $to, slice4).fit();
  }
  Transform.prototype.replace = function(from4, to, slice4) {
    if (to === void 0)
      to = from4;
    if (slice4 === void 0)
      slice4 = Slice.empty;
    var step2 = replaceStep(this.doc, from4, to, slice4);
    if (step2) {
      this.step(step2);
    }
    return this;
  };
  Transform.prototype.replaceWith = function(from4, to, content2) {
    return this.replace(from4, to, new Slice(Fragment.from(content2), 0, 0));
  };
  Transform.prototype.delete = function(from4, to) {
    return this.replace(from4, to, Slice.empty);
  };
  Transform.prototype.insert = function(pos, content2) {
    return this.replaceWith(pos, pos, content2);
  };
  function fitsTrivially($from, $to, slice4) {
    return !slice4.openStart && !slice4.openEnd && $from.start() == $to.start() && $from.parent.canReplace($from.index(), $to.index(), slice4.content);
  }
  var Fitter = function Fitter2($from, $to, slice4) {
    this.$to = $to;
    this.$from = $from;
    this.unplaced = slice4;
    this.frontier = [];
    for (var i = 0; i <= $from.depth; i++) {
      var node4 = $from.node(i);
      this.frontier.push({
        type: node4.type,
        match: node4.contentMatchAt($from.indexAfter(i))
      });
    }
    this.placed = Fragment.empty;
    for (var i$1 = $from.depth; i$1 > 0; i$1--) {
      this.placed = Fragment.from($from.node(i$1).copy(this.placed));
    }
  };
  var prototypeAccessors$12 = { depth: { configurable: true } };
  prototypeAccessors$12.depth.get = function() {
    return this.frontier.length - 1;
  };
  Fitter.prototype.fit = function fit() {
    while (this.unplaced.size) {
      var fit2 = this.findFittable();
      if (fit2) {
        this.placeNodes(fit2);
      } else {
        this.openMore() || this.dropNode();
      }
    }
    var moveInline = this.mustMoveInline(), placedSize = this.placed.size - this.depth - this.$from.depth;
    var $from = this.$from, $to = this.close(moveInline < 0 ? this.$to : $from.doc.resolve(moveInline));
    if (!$to) {
      return null;
    }
    var content2 = this.placed, openStart = $from.depth, openEnd = $to.depth;
    while (openStart && openEnd && content2.childCount == 1) {
      content2 = content2.firstChild.content;
      openStart--;
      openEnd--;
    }
    var slice4 = new Slice(content2, openStart, openEnd);
    if (moveInline > -1) {
      return new ReplaceAroundStep($from.pos, moveInline, this.$to.pos, this.$to.end(), slice4, placedSize);
    }
    if (slice4.size || $from.pos != this.$to.pos) {
      return new ReplaceStep($from.pos, $to.pos, slice4);
    }
  };
  Fitter.prototype.findFittable = function findFittable() {
    for (var pass = 1; pass <= 2; pass++) {
      for (var sliceDepth = this.unplaced.openStart; sliceDepth >= 0; sliceDepth--) {
        var fragment = void 0, parent = void 0;
        if (sliceDepth) {
          parent = contentAt(this.unplaced.content, sliceDepth - 1).firstChild;
          fragment = parent.content;
        } else {
          fragment = this.unplaced.content;
        }
        var first2 = fragment.firstChild;
        for (var frontierDepth = this.depth; frontierDepth >= 0; frontierDepth--) {
          var ref = this.frontier[frontierDepth];
          var type = ref.type;
          var match = ref.match;
          var wrap = void 0, inject = void 0;
          if (pass == 1 && (first2 ? match.matchType(first2.type) || (inject = match.fillBefore(Fragment.from(first2), false)) : type.compatibleContent(parent.type))) {
            return { sliceDepth, frontierDepth, parent, inject };
          } else if (pass == 2 && first2 && (wrap = match.findWrapping(first2.type))) {
            return { sliceDepth, frontierDepth, parent, wrap };
          }
          if (parent && match.matchType(parent.type)) {
            break;
          }
        }
      }
    }
  };
  Fitter.prototype.openMore = function openMore() {
    var ref = this.unplaced;
    var content2 = ref.content;
    var openStart = ref.openStart;
    var openEnd = ref.openEnd;
    var inner = contentAt(content2, openStart);
    if (!inner.childCount || inner.firstChild.isLeaf) {
      return false;
    }
    this.unplaced = new Slice(content2, openStart + 1, Math.max(openEnd, inner.size + openStart >= content2.size - openEnd ? openStart + 1 : 0));
    return true;
  };
  Fitter.prototype.dropNode = function dropNode() {
    var ref = this.unplaced;
    var content2 = ref.content;
    var openStart = ref.openStart;
    var openEnd = ref.openEnd;
    var inner = contentAt(content2, openStart);
    if (inner.childCount <= 1 && openStart > 0) {
      var openAtEnd = content2.size - openStart <= openStart + inner.size;
      this.unplaced = new Slice(dropFromFragment(content2, openStart - 1, 1), openStart - 1, openAtEnd ? openStart - 1 : openEnd);
    } else {
      this.unplaced = new Slice(dropFromFragment(content2, openStart, 1), openStart, openEnd);
    }
  };
  Fitter.prototype.placeNodes = function placeNodes(ref) {
    var sliceDepth = ref.sliceDepth;
    var frontierDepth = ref.frontierDepth;
    var parent = ref.parent;
    var inject = ref.inject;
    var wrap = ref.wrap;
    while (this.depth > frontierDepth) {
      this.closeFrontierNode();
    }
    if (wrap) {
      for (var i = 0; i < wrap.length; i++) {
        this.openFrontierNode(wrap[i]);
      }
    }
    var slice4 = this.unplaced, fragment = parent ? parent.content : slice4.content;
    var openStart = slice4.openStart - sliceDepth;
    var taken = 0, add3 = [];
    var ref$1 = this.frontier[frontierDepth];
    var match = ref$1.match;
    var type = ref$1.type;
    if (inject) {
      for (var i$1 = 0; i$1 < inject.childCount; i$1++) {
        add3.push(inject.child(i$1));
      }
      match = match.matchFragment(inject);
    }
    var openEndCount = fragment.size + sliceDepth - (slice4.content.size - slice4.openEnd);
    while (taken < fragment.childCount) {
      var next = fragment.child(taken), matches2 = match.matchType(next.type);
      if (!matches2) {
        break;
      }
      taken++;
      if (taken > 1 || openStart == 0 || next.content.size) {
        match = matches2;
        add3.push(closeNodeStart(next.mark(type.allowedMarks(next.marks)), taken == 1 ? openStart : 0, taken == fragment.childCount ? openEndCount : -1));
      }
    }
    var toEnd = taken == fragment.childCount;
    if (!toEnd) {
      openEndCount = -1;
    }
    this.placed = addToFragment(this.placed, frontierDepth, Fragment.from(add3));
    this.frontier[frontierDepth].match = match;
    if (toEnd && openEndCount < 0 && parent && parent.type == this.frontier[this.depth].type && this.frontier.length > 1) {
      this.closeFrontierNode();
    }
    for (var i$2 = 0, cur = fragment; i$2 < openEndCount; i$2++) {
      var node4 = cur.lastChild;
      this.frontier.push({ type: node4.type, match: node4.contentMatchAt(node4.childCount) });
      cur = node4.content;
    }
    this.unplaced = !toEnd ? new Slice(dropFromFragment(slice4.content, sliceDepth, taken), slice4.openStart, slice4.openEnd) : sliceDepth == 0 ? Slice.empty : new Slice(dropFromFragment(slice4.content, sliceDepth - 1, 1), sliceDepth - 1, openEndCount < 0 ? slice4.openEnd : sliceDepth - 1);
  };
  Fitter.prototype.mustMoveInline = function mustMoveInline() {
    if (!this.$to.parent.isTextblock || this.$to.end() == this.$to.pos) {
      return -1;
    }
    var top2 = this.frontier[this.depth], level;
    if (!top2.type.isTextblock || !contentAfterFits(this.$to, this.$to.depth, top2.type, top2.match, false) || this.$to.depth == this.depth && (level = this.findCloseLevel(this.$to)) && level.depth == this.depth) {
      return -1;
    }
    var ref = this.$to;
    var depth = ref.depth;
    var after2 = this.$to.after(depth);
    while (depth > 1 && after2 == this.$to.end(--depth)) {
      ++after2;
    }
    return after2;
  };
  Fitter.prototype.findCloseLevel = function findCloseLevel($to) {
    scan:
      for (var i = Math.min(this.depth, $to.depth); i >= 0; i--) {
        var ref = this.frontier[i];
        var match = ref.match;
        var type = ref.type;
        var dropInner = i < $to.depth && $to.end(i + 1) == $to.pos + ($to.depth - (i + 1));
        var fit2 = contentAfterFits($to, i, type, match, dropInner);
        if (!fit2) {
          continue;
        }
        for (var d = i - 1; d >= 0; d--) {
          var ref$1 = this.frontier[d];
          var match$1 = ref$1.match;
          var type$1 = ref$1.type;
          var matches2 = contentAfterFits($to, d, type$1, match$1, true);
          if (!matches2 || matches2.childCount) {
            continue scan;
          }
        }
        return { depth: i, fit: fit2, move: dropInner ? $to.doc.resolve($to.after(i + 1)) : $to };
      }
  };
  Fitter.prototype.close = function close2($to) {
    var close3 = this.findCloseLevel($to);
    if (!close3) {
      return null;
    }
    while (this.depth > close3.depth) {
      this.closeFrontierNode();
    }
    if (close3.fit.childCount) {
      this.placed = addToFragment(this.placed, close3.depth, close3.fit);
    }
    $to = close3.move;
    for (var d = close3.depth + 1; d <= $to.depth; d++) {
      var node4 = $to.node(d), add3 = node4.type.contentMatch.fillBefore(node4.content, true, $to.index(d));
      this.openFrontierNode(node4.type, node4.attrs, add3);
    }
    return $to;
  };
  Fitter.prototype.openFrontierNode = function openFrontierNode(type, attrs, content2) {
    var top2 = this.frontier[this.depth];
    top2.match = top2.match.matchType(type);
    this.placed = addToFragment(this.placed, this.depth, Fragment.from(type.create(attrs, content2)));
    this.frontier.push({ type, match: type.contentMatch });
  };
  Fitter.prototype.closeFrontierNode = function closeFrontierNode() {
    var open = this.frontier.pop();
    var add3 = open.match.fillBefore(Fragment.empty, true);
    if (add3.childCount) {
      this.placed = addToFragment(this.placed, this.frontier.length, add3);
    }
  };
  Object.defineProperties(Fitter.prototype, prototypeAccessors$12);
  function dropFromFragment(fragment, depth, count) {
    if (depth == 0) {
      return fragment.cutByIndex(count);
    }
    return fragment.replaceChild(0, fragment.firstChild.copy(dropFromFragment(fragment.firstChild.content, depth - 1, count)));
  }
  function addToFragment(fragment, depth, content2) {
    if (depth == 0) {
      return fragment.append(content2);
    }
    return fragment.replaceChild(fragment.childCount - 1, fragment.lastChild.copy(addToFragment(fragment.lastChild.content, depth - 1, content2)));
  }
  function contentAt(fragment, depth) {
    for (var i = 0; i < depth; i++) {
      fragment = fragment.firstChild.content;
    }
    return fragment;
  }
  function closeNodeStart(node4, openStart, openEnd) {
    if (openStart <= 0) {
      return node4;
    }
    var frag = node4.content;
    if (openStart > 1) {
      frag = frag.replaceChild(0, closeNodeStart(frag.firstChild, openStart - 1, frag.childCount == 1 ? openEnd - 1 : 0));
    }
    if (openStart > 0) {
      frag = node4.type.contentMatch.fillBefore(frag).append(frag);
      if (openEnd <= 0) {
        frag = frag.append(node4.type.contentMatch.matchFragment(frag).fillBefore(Fragment.empty, true));
      }
    }
    return node4.copy(frag);
  }
  function contentAfterFits($to, depth, type, match, open) {
    var node4 = $to.node(depth), index2 = open ? $to.indexAfter(depth) : $to.index(depth);
    if (index2 == node4.childCount && !type.compatibleContent(node4.type)) {
      return null;
    }
    var fit2 = match.fillBefore(node4.content, true, index2);
    return fit2 && !invalidMarks(type, node4.content, index2) ? fit2 : null;
  }
  function invalidMarks(type, fragment, start5) {
    for (var i = start5; i < fragment.childCount; i++) {
      if (!type.allowsMarks(fragment.child(i).marks)) {
        return true;
      }
    }
    return false;
  }
  function definesContent(type) {
    return type.spec.defining || type.spec.definingForContent;
  }
  Transform.prototype.replaceRange = function(from4, to, slice4) {
    if (!slice4.size) {
      return this.deleteRange(from4, to);
    }
    var $from = this.doc.resolve(from4), $to = this.doc.resolve(to);
    if (fitsTrivially($from, $to, slice4)) {
      return this.step(new ReplaceStep(from4, to, slice4));
    }
    var targetDepths = coveredDepths($from, this.doc.resolve(to));
    if (targetDepths[targetDepths.length - 1] == 0) {
      targetDepths.pop();
    }
    var preferredTarget = -($from.depth + 1);
    targetDepths.unshift(preferredTarget);
    for (var d = $from.depth, pos = $from.pos - 1; d > 0; d--, pos--) {
      var spec = $from.node(d).type.spec;
      if (spec.defining || spec.definingAsContext || spec.isolating) {
        break;
      }
      if (targetDepths.indexOf(d) > -1) {
        preferredTarget = d;
      } else if ($from.before(d) == pos) {
        targetDepths.splice(1, 0, -d);
      }
    }
    var preferredTargetIndex = targetDepths.indexOf(preferredTarget);
    var leftNodes = [], preferredDepth = slice4.openStart;
    for (var content2 = slice4.content, i = 0; ; i++) {
      var node4 = content2.firstChild;
      leftNodes.push(node4);
      if (i == slice4.openStart) {
        break;
      }
      content2 = node4.content;
    }
    if (preferredDepth > 0 && definesContent(leftNodes[preferredDepth - 1].type) && $from.node(preferredTargetIndex).type != leftNodes[preferredDepth - 1].type) {
      preferredDepth -= 1;
    } else if (preferredDepth >= 2 && leftNodes[preferredDepth - 1].isTextblock && definesContent(leftNodes[preferredDepth - 2].type) && $from.node(preferredTargetIndex).type != leftNodes[preferredDepth - 2].type) {
      preferredDepth -= 2;
    }
    for (var j = slice4.openStart; j >= 0; j--) {
      var openDepth = (j + preferredDepth + 1) % (slice4.openStart + 1);
      var insert = leftNodes[openDepth];
      if (!insert) {
        continue;
      }
      for (var i$1 = 0; i$1 < targetDepths.length; i$1++) {
        var targetDepth = targetDepths[(i$1 + preferredTargetIndex) % targetDepths.length], expand = true;
        if (targetDepth < 0) {
          expand = false;
          targetDepth = -targetDepth;
        }
        var parent = $from.node(targetDepth - 1), index2 = $from.index(targetDepth - 1);
        if (parent.canReplaceWith(index2, index2, insert.type, insert.marks)) {
          return this.replace($from.before(targetDepth), expand ? $to.after(targetDepth) : to, new Slice(closeFragment(slice4.content, 0, slice4.openStart, openDepth), openDepth, slice4.openEnd));
        }
      }
    }
    var startSteps = this.steps.length;
    for (var i$2 = targetDepths.length - 1; i$2 >= 0; i$2--) {
      this.replace(from4, to, slice4);
      if (this.steps.length > startSteps) {
        break;
      }
      var depth = targetDepths[i$2];
      if (depth < 0) {
        continue;
      }
      from4 = $from.before(depth);
      to = $to.after(depth);
    }
    return this;
  };
  function closeFragment(fragment, depth, oldOpen, newOpen, parent) {
    if (depth < oldOpen) {
      var first2 = fragment.firstChild;
      fragment = fragment.replaceChild(0, first2.copy(closeFragment(first2.content, depth + 1, oldOpen, newOpen, first2)));
    }
    if (depth > newOpen) {
      var match = parent.contentMatchAt(0);
      var start5 = match.fillBefore(fragment).append(fragment);
      fragment = start5.append(match.matchFragment(start5).fillBefore(Fragment.empty, true));
    }
    return fragment;
  }
  Transform.prototype.replaceRangeWith = function(from4, to, node4) {
    if (!node4.isInline && from4 == to && this.doc.resolve(from4).parent.content.size) {
      var point = insertPoint(this.doc, from4, node4.type);
      if (point != null) {
        from4 = to = point;
      }
    }
    return this.replaceRange(from4, to, new Slice(Fragment.from(node4), 0, 0));
  };
  Transform.prototype.deleteRange = function(from4, to) {
    var $from = this.doc.resolve(from4), $to = this.doc.resolve(to);
    var covered = coveredDepths($from, $to);
    for (var i = 0; i < covered.length; i++) {
      var depth = covered[i], last = i == covered.length - 1;
      if (last && depth == 0 || $from.node(depth).type.contentMatch.validEnd) {
        return this.delete($from.start(depth), $to.end(depth));
      }
      if (depth > 0 && (last || $from.node(depth - 1).canReplace($from.index(depth - 1), $to.indexAfter(depth - 1)))) {
        return this.delete($from.before(depth), $to.after(depth));
      }
    }
    for (var d = 1; d <= $from.depth && d <= $to.depth; d++) {
      if (from4 - $from.start(d) == $from.depth - d && to > $from.end(d) && $to.end(d) - to != $to.depth - d) {
        return this.delete($from.before(d), to);
      }
    }
    return this.delete(from4, to);
  };
  function coveredDepths($from, $to) {
    var result2 = [], minDepth = Math.min($from.depth, $to.depth);
    for (var d = minDepth; d >= 0; d--) {
      var start5 = $from.start(d);
      if (start5 < $from.pos - ($from.depth - d) || $to.end(d) > $to.pos + ($to.depth - d) || $from.node(d).type.spec.isolating || $to.node(d).type.spec.isolating) {
        break;
      }
      if (start5 == $to.start(d) || d == $from.depth && d == $to.depth && $from.parent.inlineContent && $to.parent.inlineContent && d && $to.start(d - 1) == start5 - 1) {
        result2.push(d);
      }
    }
    return result2;
  }

  // node_modules/prosemirror-state/dist/index.es.js
  var classesById = /* @__PURE__ */ Object.create(null);
  var Selection = function Selection2($anchor, $head, ranges) {
    this.ranges = ranges || [new SelectionRange($anchor.min($head), $anchor.max($head))];
    this.$anchor = $anchor;
    this.$head = $head;
  };
  var prototypeAccessors3 = { anchor: { configurable: true }, head: { configurable: true }, from: { configurable: true }, to: { configurable: true }, $from: { configurable: true }, $to: { configurable: true }, empty: { configurable: true } };
  prototypeAccessors3.anchor.get = function() {
    return this.$anchor.pos;
  };
  prototypeAccessors3.head.get = function() {
    return this.$head.pos;
  };
  prototypeAccessors3.from.get = function() {
    return this.$from.pos;
  };
  prototypeAccessors3.to.get = function() {
    return this.$to.pos;
  };
  prototypeAccessors3.$from.get = function() {
    return this.ranges[0].$from;
  };
  prototypeAccessors3.$to.get = function() {
    return this.ranges[0].$to;
  };
  prototypeAccessors3.empty.get = function() {
    var ranges = this.ranges;
    for (var i = 0; i < ranges.length; i++) {
      if (ranges[i].$from.pos != ranges[i].$to.pos) {
        return false;
      }
    }
    return true;
  };
  Selection.prototype.content = function content() {
    return this.$from.node(0).slice(this.from, this.to, true);
  };
  Selection.prototype.replace = function replace2(tr, content2) {
    if (content2 === void 0)
      content2 = Slice.empty;
    var lastNode = content2.content.lastChild, lastParent = null;
    for (var i = 0; i < content2.openEnd; i++) {
      lastParent = lastNode;
      lastNode = lastNode.lastChild;
    }
    var mapFrom = tr.steps.length, ranges = this.ranges;
    for (var i$1 = 0; i$1 < ranges.length; i$1++) {
      var ref = ranges[i$1];
      var $from = ref.$from;
      var $to = ref.$to;
      var mapping = tr.mapping.slice(mapFrom);
      tr.replaceRange(mapping.map($from.pos), mapping.map($to.pos), i$1 ? Slice.empty : content2);
      if (i$1 == 0) {
        selectionToInsertionEnd(tr, mapFrom, (lastNode ? lastNode.isInline : lastParent && lastParent.isTextblock) ? -1 : 1);
      }
    }
  };
  Selection.prototype.replaceWith = function replaceWith(tr, node4) {
    var mapFrom = tr.steps.length, ranges = this.ranges;
    for (var i = 0; i < ranges.length; i++) {
      var ref = ranges[i];
      var $from = ref.$from;
      var $to = ref.$to;
      var mapping = tr.mapping.slice(mapFrom);
      var from4 = mapping.map($from.pos), to = mapping.map($to.pos);
      if (i) {
        tr.deleteRange(from4, to);
      } else {
        tr.replaceRangeWith(from4, to, node4);
        selectionToInsertionEnd(tr, mapFrom, node4.isInline ? -1 : 1);
      }
    }
  };
  Selection.findFrom = function findFrom($pos, dir, textOnly) {
    var inner = $pos.parent.inlineContent ? new TextSelection($pos) : findSelectionIn($pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, textOnly);
    if (inner) {
      return inner;
    }
    for (var depth = $pos.depth - 1; depth >= 0; depth--) {
      var found2 = dir < 0 ? findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, textOnly) : findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, textOnly);
      if (found2) {
        return found2;
      }
    }
  };
  Selection.near = function near($pos, bias) {
    if (bias === void 0)
      bias = 1;
    return this.findFrom($pos, bias) || this.findFrom($pos, -bias) || new AllSelection($pos.node(0));
  };
  Selection.atStart = function atStart(doc2) {
    return findSelectionIn(doc2, doc2, 0, 0, 1) || new AllSelection(doc2);
  };
  Selection.atEnd = function atEnd(doc2) {
    return findSelectionIn(doc2, doc2, doc2.content.size, doc2.childCount, -1) || new AllSelection(doc2);
  };
  Selection.fromJSON = function fromJSON6(doc2, json) {
    if (!json || !json.type) {
      throw new RangeError("Invalid input for Selection.fromJSON");
    }
    var cls = classesById[json.type];
    if (!cls) {
      throw new RangeError("No selection type " + json.type + " defined");
    }
    return cls.fromJSON(doc2, json);
  };
  Selection.jsonID = function jsonID2(id, selectionClass) {
    if (id in classesById) {
      throw new RangeError("Duplicate use of selection JSON ID " + id);
    }
    classesById[id] = selectionClass;
    selectionClass.prototype.jsonID = id;
    return selectionClass;
  };
  Selection.prototype.getBookmark = function getBookmark() {
    return TextSelection.between(this.$anchor, this.$head).getBookmark();
  };
  Object.defineProperties(Selection.prototype, prototypeAccessors3);
  Selection.prototype.visible = true;
  var SelectionRange = function SelectionRange2($from, $to) {
    this.$from = $from;
    this.$to = $to;
  };
  var TextSelection = /* @__PURE__ */ function(Selection3) {
    function TextSelection2($anchor, $head) {
      if ($head === void 0)
        $head = $anchor;
      Selection3.call(this, $anchor, $head);
    }
    if (Selection3)
      TextSelection2.__proto__ = Selection3;
    TextSelection2.prototype = Object.create(Selection3 && Selection3.prototype);
    TextSelection2.prototype.constructor = TextSelection2;
    var prototypeAccessors$15 = { $cursor: { configurable: true } };
    prototypeAccessors$15.$cursor.get = function() {
      return this.$anchor.pos == this.$head.pos ? this.$head : null;
    };
    TextSelection2.prototype.map = function map15(doc2, mapping) {
      var $head = doc2.resolve(mapping.map(this.head));
      if (!$head.parent.inlineContent) {
        return Selection3.near($head);
      }
      var $anchor = doc2.resolve(mapping.map(this.anchor));
      return new TextSelection2($anchor.parent.inlineContent ? $anchor : $head, $head);
    };
    TextSelection2.prototype.replace = function replace3(tr, content2) {
      if (content2 === void 0)
        content2 = Slice.empty;
      Selection3.prototype.replace.call(this, tr, content2);
      if (content2 == Slice.empty) {
        var marks2 = this.$from.marksAcross(this.$to);
        if (marks2) {
          tr.ensureMarks(marks2);
        }
      }
    };
    TextSelection2.prototype.eq = function eq12(other) {
      return other instanceof TextSelection2 && other.anchor == this.anchor && other.head == this.head;
    };
    TextSelection2.prototype.getBookmark = function getBookmark2() {
      return new TextBookmark(this.anchor, this.head);
    };
    TextSelection2.prototype.toJSON = function toJSON7() {
      return { type: "text", anchor: this.anchor, head: this.head };
    };
    TextSelection2.fromJSON = function fromJSON8(doc2, json) {
      if (typeof json.anchor != "number" || typeof json.head != "number") {
        throw new RangeError("Invalid input for TextSelection.fromJSON");
      }
      return new TextSelection2(doc2.resolve(json.anchor), doc2.resolve(json.head));
    };
    TextSelection2.create = function create5(doc2, anchor, head) {
      if (head === void 0)
        head = anchor;
      var $anchor = doc2.resolve(anchor);
      return new this($anchor, head == anchor ? $anchor : doc2.resolve(head));
    };
    TextSelection2.between = function between($anchor, $head, bias) {
      var dPos = $anchor.pos - $head.pos;
      if (!bias || dPos) {
        bias = dPos >= 0 ? 1 : -1;
      }
      if (!$head.parent.inlineContent) {
        var found2 = Selection3.findFrom($head, bias, true) || Selection3.findFrom($head, -bias, true);
        if (found2) {
          $head = found2.$head;
        } else {
          return Selection3.near($head, bias);
        }
      }
      if (!$anchor.parent.inlineContent) {
        if (dPos == 0) {
          $anchor = $head;
        } else {
          $anchor = (Selection3.findFrom($anchor, -bias, true) || Selection3.findFrom($anchor, bias, true)).$anchor;
          if ($anchor.pos < $head.pos != dPos < 0) {
            $anchor = $head;
          }
        }
      }
      return new TextSelection2($anchor, $head);
    };
    Object.defineProperties(TextSelection2.prototype, prototypeAccessors$15);
    return TextSelection2;
  }(Selection);
  Selection.jsonID("text", TextSelection);
  var TextBookmark = function TextBookmark2(anchor, head) {
    this.anchor = anchor;
    this.head = head;
  };
  TextBookmark.prototype.map = function map4(mapping) {
    return new TextBookmark(mapping.map(this.anchor), mapping.map(this.head));
  };
  TextBookmark.prototype.resolve = function resolve3(doc2) {
    return TextSelection.between(doc2.resolve(this.anchor), doc2.resolve(this.head));
  };
  var NodeSelection = /* @__PURE__ */ function(Selection3) {
    function NodeSelection2($pos) {
      var node4 = $pos.nodeAfter;
      var $end = $pos.node(0).resolve($pos.pos + node4.nodeSize);
      Selection3.call(this, $pos, $end);
      this.node = node4;
    }
    if (Selection3)
      NodeSelection2.__proto__ = Selection3;
    NodeSelection2.prototype = Object.create(Selection3 && Selection3.prototype);
    NodeSelection2.prototype.constructor = NodeSelection2;
    NodeSelection2.prototype.map = function map15(doc2, mapping) {
      var ref = mapping.mapResult(this.anchor);
      var deleted = ref.deleted;
      var pos = ref.pos;
      var $pos = doc2.resolve(pos);
      if (deleted) {
        return Selection3.near($pos);
      }
      return new NodeSelection2($pos);
    };
    NodeSelection2.prototype.content = function content2() {
      return new Slice(Fragment.from(this.node), 0, 0);
    };
    NodeSelection2.prototype.eq = function eq12(other) {
      return other instanceof NodeSelection2 && other.anchor == this.anchor;
    };
    NodeSelection2.prototype.toJSON = function toJSON7() {
      return { type: "node", anchor: this.anchor };
    };
    NodeSelection2.prototype.getBookmark = function getBookmark2() {
      return new NodeBookmark(this.anchor);
    };
    NodeSelection2.fromJSON = function fromJSON8(doc2, json) {
      if (typeof json.anchor != "number") {
        throw new RangeError("Invalid input for NodeSelection.fromJSON");
      }
      return new NodeSelection2(doc2.resolve(json.anchor));
    };
    NodeSelection2.create = function create5(doc2, from4) {
      return new this(doc2.resolve(from4));
    };
    NodeSelection2.isSelectable = function isSelectable(node4) {
      return !node4.isText && node4.type.spec.selectable !== false;
    };
    return NodeSelection2;
  }(Selection);
  NodeSelection.prototype.visible = false;
  Selection.jsonID("node", NodeSelection);
  var NodeBookmark = function NodeBookmark2(anchor) {
    this.anchor = anchor;
  };
  NodeBookmark.prototype.map = function map5(mapping) {
    var ref = mapping.mapResult(this.anchor);
    var deleted = ref.deleted;
    var pos = ref.pos;
    return deleted ? new TextBookmark(pos, pos) : new NodeBookmark(pos);
  };
  NodeBookmark.prototype.resolve = function resolve4(doc2) {
    var $pos = doc2.resolve(this.anchor), node4 = $pos.nodeAfter;
    if (node4 && NodeSelection.isSelectable(node4)) {
      return new NodeSelection($pos);
    }
    return Selection.near($pos);
  };
  var AllSelection = /* @__PURE__ */ function(Selection3) {
    function AllSelection2(doc2) {
      Selection3.call(this, doc2.resolve(0), doc2.resolve(doc2.content.size));
    }
    if (Selection3)
      AllSelection2.__proto__ = Selection3;
    AllSelection2.prototype = Object.create(Selection3 && Selection3.prototype);
    AllSelection2.prototype.constructor = AllSelection2;
    AllSelection2.prototype.replace = function replace3(tr, content2) {
      if (content2 === void 0)
        content2 = Slice.empty;
      if (content2 == Slice.empty) {
        tr.delete(0, tr.doc.content.size);
        var sel = Selection3.atStart(tr.doc);
        if (!sel.eq(tr.selection)) {
          tr.setSelection(sel);
        }
      } else {
        Selection3.prototype.replace.call(this, tr, content2);
      }
    };
    AllSelection2.prototype.toJSON = function toJSON7() {
      return { type: "all" };
    };
    AllSelection2.fromJSON = function fromJSON8(doc2) {
      return new AllSelection2(doc2);
    };
    AllSelection2.prototype.map = function map15(doc2) {
      return new AllSelection2(doc2);
    };
    AllSelection2.prototype.eq = function eq12(other) {
      return other instanceof AllSelection2;
    };
    AllSelection2.prototype.getBookmark = function getBookmark2() {
      return AllBookmark;
    };
    return AllSelection2;
  }(Selection);
  Selection.jsonID("all", AllSelection);
  var AllBookmark = {
    map: function map6() {
      return this;
    },
    resolve: function resolve5(doc2) {
      return new AllSelection(doc2);
    }
  };
  function findSelectionIn(doc2, node4, pos, index2, dir, text2) {
    if (node4.inlineContent) {
      return TextSelection.create(doc2, pos);
    }
    for (var i = index2 - (dir > 0 ? 0 : 1); dir > 0 ? i < node4.childCount : i >= 0; i += dir) {
      var child3 = node4.child(i);
      if (!child3.isAtom) {
        var inner = findSelectionIn(doc2, child3, pos + dir, dir < 0 ? child3.childCount : 0, dir, text2);
        if (inner) {
          return inner;
        }
      } else if (!text2 && NodeSelection.isSelectable(child3)) {
        return NodeSelection.create(doc2, pos - (dir < 0 ? child3.nodeSize : 0));
      }
      pos += child3.nodeSize * dir;
    }
  }
  function selectionToInsertionEnd(tr, startLen, bias) {
    var last = tr.steps.length - 1;
    if (last < startLen) {
      return;
    }
    var step2 = tr.steps[last];
    if (!(step2 instanceof ReplaceStep || step2 instanceof ReplaceAroundStep)) {
      return;
    }
    var map15 = tr.mapping.maps[last], end3;
    map15.forEach(function(_from, _to, _newFrom, newTo) {
      if (end3 == null) {
        end3 = newTo;
      }
    });
    tr.setSelection(Selection.near(tr.doc.resolve(end3), bias));
  }
  var UPDATED_SEL = 1;
  var UPDATED_MARKS = 2;
  var UPDATED_SCROLL = 4;
  var Transaction = /* @__PURE__ */ function(Transform3) {
    function Transaction2(state) {
      Transform3.call(this, state.doc);
      this.time = Date.now();
      this.curSelection = state.selection;
      this.curSelectionFor = 0;
      this.storedMarks = state.storedMarks;
      this.updated = 0;
      this.meta = /* @__PURE__ */ Object.create(null);
    }
    if (Transform3)
      Transaction2.__proto__ = Transform3;
    Transaction2.prototype = Object.create(Transform3 && Transform3.prototype);
    Transaction2.prototype.constructor = Transaction2;
    var prototypeAccessors5 = { selection: { configurable: true }, selectionSet: { configurable: true }, storedMarksSet: { configurable: true }, isGeneric: { configurable: true }, scrolledIntoView: { configurable: true } };
    prototypeAccessors5.selection.get = function() {
      if (this.curSelectionFor < this.steps.length) {
        this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor));
        this.curSelectionFor = this.steps.length;
      }
      return this.curSelection;
    };
    Transaction2.prototype.setSelection = function setSelection2(selection) {
      if (selection.$from.doc != this.doc) {
        throw new RangeError("Selection passed to setSelection must point at the current document");
      }
      this.curSelection = selection;
      this.curSelectionFor = this.steps.length;
      this.updated = (this.updated | UPDATED_SEL) & ~UPDATED_MARKS;
      this.storedMarks = null;
      return this;
    };
    prototypeAccessors5.selectionSet.get = function() {
      return (this.updated & UPDATED_SEL) > 0;
    };
    Transaction2.prototype.setStoredMarks = function setStoredMarks(marks2) {
      this.storedMarks = marks2;
      this.updated |= UPDATED_MARKS;
      return this;
    };
    Transaction2.prototype.ensureMarks = function ensureMarks2(marks2) {
      if (!Mark.sameSet(this.storedMarks || this.selection.$from.marks(), marks2)) {
        this.setStoredMarks(marks2);
      }
      return this;
    };
    Transaction2.prototype.addStoredMark = function addStoredMark(mark3) {
      return this.ensureMarks(mark3.addToSet(this.storedMarks || this.selection.$head.marks()));
    };
    Transaction2.prototype.removeStoredMark = function removeStoredMark(mark3) {
      return this.ensureMarks(mark3.removeFromSet(this.storedMarks || this.selection.$head.marks()));
    };
    prototypeAccessors5.storedMarksSet.get = function() {
      return (this.updated & UPDATED_MARKS) > 0;
    };
    Transaction2.prototype.addStep = function addStep2(step2, doc2) {
      Transform3.prototype.addStep.call(this, step2, doc2);
      this.updated = this.updated & ~UPDATED_MARKS;
      this.storedMarks = null;
    };
    Transaction2.prototype.setTime = function setTime(time) {
      this.time = time;
      return this;
    };
    Transaction2.prototype.replaceSelection = function replaceSelection(slice4) {
      this.selection.replace(this, slice4);
      return this;
    };
    Transaction2.prototype.replaceSelectionWith = function replaceSelectionWith(node4, inheritMarks) {
      var selection = this.selection;
      if (inheritMarks !== false) {
        node4 = node4.mark(this.storedMarks || (selection.empty ? selection.$from.marks() : selection.$from.marksAcross(selection.$to) || Mark.none));
      }
      selection.replaceWith(this, node4);
      return this;
    };
    Transaction2.prototype.deleteSelection = function deleteSelection3() {
      this.selection.replace(this);
      return this;
    };
    Transaction2.prototype.insertText = function insertText(text2, from4, to) {
      if (to === void 0)
        to = from4;
      var schema = this.doc.type.schema;
      if (from4 == null) {
        if (!text2) {
          return this.deleteSelection();
        }
        return this.replaceSelectionWith(schema.text(text2), true);
      } else {
        if (!text2) {
          return this.deleteRange(from4, to);
        }
        var marks2 = this.storedMarks;
        if (!marks2) {
          var $from = this.doc.resolve(from4);
          marks2 = to == from4 ? $from.marks() : $from.marksAcross(this.doc.resolve(to));
        }
        this.replaceRangeWith(from4, to, schema.text(text2, marks2));
        if (!this.selection.empty) {
          this.setSelection(Selection.near(this.selection.$to));
        }
        return this;
      }
    };
    Transaction2.prototype.setMeta = function setMeta2(key, value) {
      this.meta[typeof key == "string" ? key : key.key] = value;
      return this;
    };
    Transaction2.prototype.getMeta = function getMeta(key) {
      return this.meta[typeof key == "string" ? key : key.key];
    };
    prototypeAccessors5.isGeneric.get = function() {
      for (var _ in this.meta) {
        return false;
      }
      return true;
    };
    Transaction2.prototype.scrollIntoView = function scrollIntoView2() {
      this.updated |= UPDATED_SCROLL;
      return this;
    };
    prototypeAccessors5.scrolledIntoView.get = function() {
      return (this.updated & UPDATED_SCROLL) > 0;
    };
    Object.defineProperties(Transaction2.prototype, prototypeAccessors5);
    return Transaction2;
  }(Transform);
  function bind(f, self2) {
    return !self2 || !f ? f : f.bind(self2);
  }
  var FieldDesc = function FieldDesc2(name, desc, self2) {
    this.name = name;
    this.init = bind(desc.init, self2);
    this.apply = bind(desc.apply, self2);
  };
  var baseFields = [
    new FieldDesc("doc", {
      init: function init(config) {
        return config.doc || config.schema.topNodeType.createAndFill();
      },
      apply: function apply2(tr) {
        return tr.doc;
      }
    }),
    new FieldDesc("selection", {
      init: function init2(config, instance) {
        return config.selection || Selection.atStart(instance.doc);
      },
      apply: function apply3(tr) {
        return tr.selection;
      }
    }),
    new FieldDesc("storedMarks", {
      init: function init3(config) {
        return config.storedMarks || null;
      },
      apply: function apply4(tr, _marks, _old, state) {
        return state.selection.$cursor ? tr.storedMarks : null;
      }
    }),
    new FieldDesc("scrollToSelection", {
      init: function init4() {
        return 0;
      },
      apply: function apply5(tr, prev) {
        return tr.scrolledIntoView ? prev + 1 : prev;
      }
    })
  ];
  var Configuration = function Configuration2(schema, plugins) {
    var this$1 = this;
    this.schema = schema;
    this.fields = baseFields.concat();
    this.plugins = [];
    this.pluginsByKey = /* @__PURE__ */ Object.create(null);
    if (plugins) {
      plugins.forEach(function(plugin) {
        if (this$1.pluginsByKey[plugin.key]) {
          throw new RangeError("Adding different instances of a keyed plugin (" + plugin.key + ")");
        }
        this$1.plugins.push(plugin);
        this$1.pluginsByKey[plugin.key] = plugin;
        if (plugin.spec.state) {
          this$1.fields.push(new FieldDesc(plugin.key, plugin.spec.state, plugin));
        }
      });
    }
  };
  var EditorState = function EditorState2(config) {
    this.config = config;
  };
  var prototypeAccessors$13 = { schema: { configurable: true }, plugins: { configurable: true }, tr: { configurable: true } };
  prototypeAccessors$13.schema.get = function() {
    return this.config.schema;
  };
  prototypeAccessors$13.plugins.get = function() {
    return this.config.plugins;
  };
  EditorState.prototype.apply = function apply6(tr) {
    return this.applyTransaction(tr).state;
  };
  EditorState.prototype.filterTransaction = function filterTransaction(tr, ignore) {
    if (ignore === void 0)
      ignore = -1;
    for (var i = 0; i < this.config.plugins.length; i++) {
      if (i != ignore) {
        var plugin = this.config.plugins[i];
        if (plugin.spec.filterTransaction && !plugin.spec.filterTransaction.call(plugin, tr, this)) {
          return false;
        }
      }
    }
    return true;
  };
  EditorState.prototype.applyTransaction = function applyTransaction(rootTr) {
    if (!this.filterTransaction(rootTr)) {
      return { state: this, transactions: [] };
    }
    var trs = [rootTr], newState = this.applyInner(rootTr), seen = null;
    for (; ; ) {
      var haveNew = false;
      for (var i = 0; i < this.config.plugins.length; i++) {
        var plugin = this.config.plugins[i];
        if (plugin.spec.appendTransaction) {
          var n = seen ? seen[i].n : 0, oldState = seen ? seen[i].state : this;
          var tr = n < trs.length && plugin.spec.appendTransaction.call(plugin, n ? trs.slice(n) : trs, oldState, newState);
          if (tr && newState.filterTransaction(tr, i)) {
            tr.setMeta("appendedTransaction", rootTr);
            if (!seen) {
              seen = [];
              for (var j = 0; j < this.config.plugins.length; j++) {
                seen.push(j < i ? { state: newState, n: trs.length } : { state: this, n: 0 });
              }
            }
            trs.push(tr);
            newState = newState.applyInner(tr);
            haveNew = true;
          }
          if (seen) {
            seen[i] = { state: newState, n: trs.length };
          }
        }
      }
      if (!haveNew) {
        return { state: newState, transactions: trs };
      }
    }
  };
  EditorState.prototype.applyInner = function applyInner(tr) {
    if (!tr.before.eq(this.doc)) {
      throw new RangeError("Applying a mismatched transaction");
    }
    var newInstance = new EditorState(this.config), fields = this.config.fields;
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      newInstance[field.name] = field.apply(tr, this[field.name], this, newInstance);
    }
    for (var i$1 = 0; i$1 < applyListeners.length; i$1++) {
      applyListeners[i$1](this, tr, newInstance);
    }
    return newInstance;
  };
  prototypeAccessors$13.tr.get = function() {
    return new Transaction(this);
  };
  EditorState.create = function create3(config) {
    var $config = new Configuration(config.doc ? config.doc.type.schema : config.schema, config.plugins);
    var instance = new EditorState($config);
    for (var i = 0; i < $config.fields.length; i++) {
      instance[$config.fields[i].name] = $config.fields[i].init(config, instance);
    }
    return instance;
  };
  EditorState.prototype.reconfigure = function reconfigure(config) {
    var $config = new Configuration(this.schema, config.plugins);
    var fields = $config.fields, instance = new EditorState($config);
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i].name;
      instance[name] = this.hasOwnProperty(name) ? this[name] : fields[i].init(config, instance);
    }
    return instance;
  };
  EditorState.prototype.toJSON = function toJSON6(pluginFields) {
    var result2 = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks) {
      result2.storedMarks = this.storedMarks.map(function(m) {
        return m.toJSON();
      });
    }
    if (pluginFields && typeof pluginFields == "object") {
      for (var prop in pluginFields) {
        if (prop == "doc" || prop == "selection") {
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        }
        var plugin = pluginFields[prop], state = plugin.spec.state;
        if (state && state.toJSON) {
          result2[prop] = state.toJSON.call(plugin, this[plugin.key]);
        }
      }
    }
    return result2;
  };
  EditorState.fromJSON = function fromJSON7(config, json, pluginFields) {
    if (!json) {
      throw new RangeError("Invalid input for EditorState.fromJSON");
    }
    if (!config.schema) {
      throw new RangeError("Required config field 'schema' missing");
    }
    var $config = new Configuration(config.schema, config.plugins);
    var instance = new EditorState($config);
    $config.fields.forEach(function(field) {
      if (field.name == "doc") {
        instance.doc = Node2.fromJSON(config.schema, json.doc);
      } else if (field.name == "selection") {
        instance.selection = Selection.fromJSON(instance.doc, json.selection);
      } else if (field.name == "storedMarks") {
        if (json.storedMarks) {
          instance.storedMarks = json.storedMarks.map(config.schema.markFromJSON);
        }
      } else {
        if (pluginFields) {
          for (var prop in pluginFields) {
            var plugin = pluginFields[prop], state = plugin.spec.state;
            if (plugin.key == field.name && state && state.fromJSON && Object.prototype.hasOwnProperty.call(json, prop)) {
              instance[field.name] = state.fromJSON.call(plugin, config, json[prop], instance);
              return;
            }
          }
        }
        instance[field.name] = field.init(config, instance);
      }
    });
    return instance;
  };
  EditorState.addApplyListener = function addApplyListener(f) {
    applyListeners.push(f);
  };
  EditorState.removeApplyListener = function removeApplyListener(f) {
    var found2 = applyListeners.indexOf(f);
    if (found2 > -1) {
      applyListeners.splice(found2, 1);
    }
  };
  Object.defineProperties(EditorState.prototype, prototypeAccessors$13);
  var applyListeners = [];
  function bindProps(obj, self2, target) {
    for (var prop in obj) {
      var val = obj[prop];
      if (val instanceof Function) {
        val = val.bind(self2);
      } else if (prop == "handleDOMEvents") {
        val = bindProps(val, self2, {});
      }
      target[prop] = val;
    }
    return target;
  }
  var Plugin = function Plugin2(spec) {
    this.props = {};
    if (spec.props) {
      bindProps(spec.props, this, this.props);
    }
    this.spec = spec;
    this.key = spec.key ? spec.key.key : createKey("plugin");
  };
  Plugin.prototype.getState = function getState(state) {
    return state[this.key];
  };
  var keys = /* @__PURE__ */ Object.create(null);
  function createKey(name) {
    if (name in keys) {
      return name + "$" + ++keys[name];
    }
    keys[name] = 0;
    return name + "$";
  }
  var PluginKey = function PluginKey2(name) {
    if (name === void 0)
      name = "key";
    this.key = createKey(name);
  };
  PluginKey.prototype.get = function get(state) {
    return state.config.pluginsByKey[this.key];
  };
  PluginKey.prototype.getState = function getState2(state) {
    return state[this.key];
  };

  // node_modules/prosemirror-commands/dist/index.es.js
  function deleteSelection(state, dispatch3) {
    if (state.selection.empty) {
      return false;
    }
    if (dispatch3) {
      dispatch3(state.tr.deleteSelection().scrollIntoView());
    }
    return true;
  }
  function joinBackward(state, dispatch3, view) {
    var ref = state.selection;
    var $cursor = ref.$cursor;
    if (!$cursor || (view ? !view.endOfTextblock("backward", state) : $cursor.parentOffset > 0)) {
      return false;
    }
    var $cut = findCutBefore($cursor);
    if (!$cut) {
      var range = $cursor.blockRange(), target = range && liftTarget(range);
      if (target == null) {
        return false;
      }
      if (dispatch3) {
        dispatch3(state.tr.lift(range, target).scrollIntoView());
      }
      return true;
    }
    var before2 = $cut.nodeBefore;
    if (!before2.type.spec.isolating && deleteBarrier(state, $cut, dispatch3)) {
      return true;
    }
    if ($cursor.parent.content.size == 0 && (textblockAt(before2, "end") || NodeSelection.isSelectable(before2))) {
      var delStep = replaceStep(state.doc, $cursor.before(), $cursor.after(), Slice.empty);
      if (delStep.slice.size < delStep.to - delStep.from) {
        if (dispatch3) {
          var tr = state.tr.step(delStep);
          tr.setSelection(textblockAt(before2, "end") ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos, -1)), -1) : NodeSelection.create(tr.doc, $cut.pos - before2.nodeSize));
          dispatch3(tr.scrollIntoView());
        }
        return true;
      }
    }
    if (before2.isAtom && $cut.depth == $cursor.depth - 1) {
      if (dispatch3) {
        dispatch3(state.tr.delete($cut.pos - before2.nodeSize, $cut.pos).scrollIntoView());
      }
      return true;
    }
    return false;
  }
  function textblockAt(node4, side, only) {
    for (; node4; node4 = side == "start" ? node4.firstChild : node4.lastChild) {
      if (node4.isTextblock) {
        return true;
      }
      if (only && node4.childCount != 1) {
        return false;
      }
    }
    return false;
  }
  function selectNodeBackward(state, dispatch3, view) {
    var ref = state.selection;
    var $head = ref.$head;
    var empty2 = ref.empty;
    var $cut = $head;
    if (!empty2) {
      return false;
    }
    if ($head.parent.isTextblock) {
      if (view ? !view.endOfTextblock("backward", state) : $head.parentOffset > 0) {
        return false;
      }
      $cut = findCutBefore($head);
    }
    var node4 = $cut && $cut.nodeBefore;
    if (!node4 || !NodeSelection.isSelectable(node4)) {
      return false;
    }
    if (dispatch3) {
      dispatch3(state.tr.setSelection(NodeSelection.create(state.doc, $cut.pos - node4.nodeSize)).scrollIntoView());
    }
    return true;
  }
  function findCutBefore($pos) {
    if (!$pos.parent.type.spec.isolating) {
      for (var i = $pos.depth - 1; i >= 0; i--) {
        if ($pos.index(i) > 0) {
          return $pos.doc.resolve($pos.before(i + 1));
        }
        if ($pos.node(i).type.spec.isolating) {
          break;
        }
      }
    }
    return null;
  }
  function joinForward(state, dispatch3, view) {
    var ref = state.selection;
    var $cursor = ref.$cursor;
    if (!$cursor || (view ? !view.endOfTextblock("forward", state) : $cursor.parentOffset < $cursor.parent.content.size)) {
      return false;
    }
    var $cut = findCutAfter($cursor);
    if (!$cut) {
      return false;
    }
    var after2 = $cut.nodeAfter;
    if (deleteBarrier(state, $cut, dispatch3)) {
      return true;
    }
    if ($cursor.parent.content.size == 0 && (textblockAt(after2, "start") || NodeSelection.isSelectable(after2))) {
      var delStep = replaceStep(state.doc, $cursor.before(), $cursor.after(), Slice.empty);
      if (delStep.slice.size < delStep.to - delStep.from) {
        if (dispatch3) {
          var tr = state.tr.step(delStep);
          tr.setSelection(textblockAt(after2, "start") ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos)), 1) : NodeSelection.create(tr.doc, tr.mapping.map($cut.pos)));
          dispatch3(tr.scrollIntoView());
        }
        return true;
      }
    }
    if (after2.isAtom && $cut.depth == $cursor.depth - 1) {
      if (dispatch3) {
        dispatch3(state.tr.delete($cut.pos, $cut.pos + after2.nodeSize).scrollIntoView());
      }
      return true;
    }
    return false;
  }
  function selectNodeForward(state, dispatch3, view) {
    var ref = state.selection;
    var $head = ref.$head;
    var empty2 = ref.empty;
    var $cut = $head;
    if (!empty2) {
      return false;
    }
    if ($head.parent.isTextblock) {
      if (view ? !view.endOfTextblock("forward", state) : $head.parentOffset < $head.parent.content.size) {
        return false;
      }
      $cut = findCutAfter($head);
    }
    var node4 = $cut && $cut.nodeAfter;
    if (!node4 || !NodeSelection.isSelectable(node4)) {
      return false;
    }
    if (dispatch3) {
      dispatch3(state.tr.setSelection(NodeSelection.create(state.doc, $cut.pos)).scrollIntoView());
    }
    return true;
  }
  function findCutAfter($pos) {
    if (!$pos.parent.type.spec.isolating) {
      for (var i = $pos.depth - 1; i >= 0; i--) {
        var parent = $pos.node(i);
        if ($pos.index(i) + 1 < parent.childCount) {
          return $pos.doc.resolve($pos.after(i + 1));
        }
        if (parent.type.spec.isolating) {
          break;
        }
      }
    }
    return null;
  }
  function lift(state, dispatch3) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    var range = $from.blockRange($to), target = range && liftTarget(range);
    if (target == null) {
      return false;
    }
    if (dispatch3) {
      dispatch3(state.tr.lift(range, target).scrollIntoView());
    }
    return true;
  }
  function newlineInCode(state, dispatch3) {
    var ref = state.selection;
    var $head = ref.$head;
    var $anchor = ref.$anchor;
    if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) {
      return false;
    }
    if (dispatch3) {
      dispatch3(state.tr.insertText("\n").scrollIntoView());
    }
    return true;
  }
  function defaultBlockAt(match) {
    for (var i = 0; i < match.edgeCount; i++) {
      var ref = match.edge(i);
      var type = ref.type;
      if (type.isTextblock && !type.hasRequiredAttrs()) {
        return type;
      }
    }
    return null;
  }
  function exitCode(state, dispatch3) {
    var ref = state.selection;
    var $head = ref.$head;
    var $anchor = ref.$anchor;
    if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) {
      return false;
    }
    var above = $head.node(-1), after2 = $head.indexAfter(-1), type = defaultBlockAt(above.contentMatchAt(after2));
    if (!above.canReplaceWith(after2, after2, type)) {
      return false;
    }
    if (dispatch3) {
      var pos = $head.after(), tr = state.tr.replaceWith(pos, pos, type.createAndFill());
      tr.setSelection(Selection.near(tr.doc.resolve(pos), 1));
      dispatch3(tr.scrollIntoView());
    }
    return true;
  }
  function createParagraphNear(state, dispatch3) {
    var sel = state.selection;
    var $from = sel.$from;
    var $to = sel.$to;
    if (sel instanceof AllSelection || $from.parent.inlineContent || $to.parent.inlineContent) {
      return false;
    }
    var type = defaultBlockAt($to.parent.contentMatchAt($to.indexAfter()));
    if (!type || !type.isTextblock) {
      return false;
    }
    if (dispatch3) {
      var side = (!$from.parentOffset && $to.index() < $to.parent.childCount ? $from : $to).pos;
      var tr = state.tr.insert(side, type.createAndFill());
      tr.setSelection(TextSelection.create(tr.doc, side + 1));
      dispatch3(tr.scrollIntoView());
    }
    return true;
  }
  function liftEmptyBlock(state, dispatch3) {
    var ref = state.selection;
    var $cursor = ref.$cursor;
    if (!$cursor || $cursor.parent.content.size) {
      return false;
    }
    if ($cursor.depth > 1 && $cursor.after() != $cursor.end(-1)) {
      var before2 = $cursor.before();
      if (canSplit(state.doc, before2)) {
        if (dispatch3) {
          dispatch3(state.tr.split(before2).scrollIntoView());
        }
        return true;
      }
    }
    var range = $cursor.blockRange(), target = range && liftTarget(range);
    if (target == null) {
      return false;
    }
    if (dispatch3) {
      dispatch3(state.tr.lift(range, target).scrollIntoView());
    }
    return true;
  }
  function splitBlock(state, dispatch3) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    if (state.selection instanceof NodeSelection && state.selection.node.isBlock) {
      if (!$from.parentOffset || !canSplit(state.doc, $from.pos)) {
        return false;
      }
      if (dispatch3) {
        dispatch3(state.tr.split($from.pos).scrollIntoView());
      }
      return true;
    }
    if (!$from.parent.isBlock) {
      return false;
    }
    if (dispatch3) {
      var atEnd2 = $to.parentOffset == $to.parent.content.size;
      var tr = state.tr;
      if (state.selection instanceof TextSelection || state.selection instanceof AllSelection) {
        tr.deleteSelection();
      }
      var deflt = $from.depth == 0 ? null : defaultBlockAt($from.node(-1).contentMatchAt($from.indexAfter(-1)));
      var types = atEnd2 && deflt ? [{ type: deflt }] : null;
      var can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types);
      if (!types && !can && canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt && [{ type: deflt }])) {
        types = [{ type: deflt }];
        can = true;
      }
      if (can) {
        tr.split(tr.mapping.map($from.pos), 1, types);
        if (!atEnd2 && !$from.parentOffset && $from.parent.type != deflt) {
          var first2 = tr.mapping.map($from.before()), $first = tr.doc.resolve(first2);
          if ($from.node(-1).canReplaceWith($first.index(), $first.index() + 1, deflt)) {
            tr.setNodeMarkup(tr.mapping.map($from.before()), deflt);
          }
        }
      }
      dispatch3(tr.scrollIntoView());
    }
    return true;
  }
  function selectParentNode(state, dispatch3) {
    var ref = state.selection;
    var $from = ref.$from;
    var to = ref.to;
    var pos;
    var same = $from.sharedDepth(to);
    if (same == 0) {
      return false;
    }
    pos = $from.before(same);
    if (dispatch3) {
      dispatch3(state.tr.setSelection(NodeSelection.create(state.doc, pos)));
    }
    return true;
  }
  function selectAll(state, dispatch3) {
    if (dispatch3) {
      dispatch3(state.tr.setSelection(new AllSelection(state.doc)));
    }
    return true;
  }
  function joinMaybeClear(state, $pos, dispatch3) {
    var before2 = $pos.nodeBefore, after2 = $pos.nodeAfter, index2 = $pos.index();
    if (!before2 || !after2 || !before2.type.compatibleContent(after2.type)) {
      return false;
    }
    if (!before2.content.size && $pos.parent.canReplace(index2 - 1, index2)) {
      if (dispatch3) {
        dispatch3(state.tr.delete($pos.pos - before2.nodeSize, $pos.pos).scrollIntoView());
      }
      return true;
    }
    if (!$pos.parent.canReplace(index2, index2 + 1) || !(after2.isTextblock || canJoin(state.doc, $pos.pos))) {
      return false;
    }
    if (dispatch3) {
      dispatch3(state.tr.clearIncompatible($pos.pos, before2.type, before2.contentMatchAt(before2.childCount)).join($pos.pos).scrollIntoView());
    }
    return true;
  }
  function deleteBarrier(state, $cut, dispatch3) {
    var before2 = $cut.nodeBefore, after2 = $cut.nodeAfter, conn, match;
    if (before2.type.spec.isolating || after2.type.spec.isolating) {
      return false;
    }
    if (joinMaybeClear(state, $cut, dispatch3)) {
      return true;
    }
    var canDelAfter = $cut.parent.canReplace($cut.index(), $cut.index() + 1);
    if (canDelAfter && (conn = (match = before2.contentMatchAt(before2.childCount)).findWrapping(after2.type)) && match.matchType(conn[0] || after2.type).validEnd) {
      if (dispatch3) {
        var end3 = $cut.pos + after2.nodeSize, wrap = Fragment.empty;
        for (var i = conn.length - 1; i >= 0; i--) {
          wrap = Fragment.from(conn[i].create(null, wrap));
        }
        wrap = Fragment.from(before2.copy(wrap));
        var tr = state.tr.step(new ReplaceAroundStep($cut.pos - 1, end3, $cut.pos, end3, new Slice(wrap, 1, 0), conn.length, true));
        var joinAt = end3 + 2 * conn.length;
        if (canJoin(tr.doc, joinAt)) {
          tr.join(joinAt);
        }
        dispatch3(tr.scrollIntoView());
      }
      return true;
    }
    var selAfter = Selection.findFrom($cut, 1);
    var range = selAfter && selAfter.$from.blockRange(selAfter.$to), target = range && liftTarget(range);
    if (target != null && target >= $cut.depth) {
      if (dispatch3) {
        dispatch3(state.tr.lift(range, target).scrollIntoView());
      }
      return true;
    }
    if (canDelAfter && textblockAt(after2, "start", true) && textblockAt(before2, "end")) {
      var at = before2, wrap$1 = [];
      for (; ; ) {
        wrap$1.push(at);
        if (at.isTextblock) {
          break;
        }
        at = at.lastChild;
      }
      var afterText = after2, afterDepth = 1;
      for (; !afterText.isTextblock; afterText = afterText.firstChild) {
        afterDepth++;
      }
      if (at.canReplace(at.childCount, at.childCount, afterText.content)) {
        if (dispatch3) {
          var end$1 = Fragment.empty;
          for (var i$1 = wrap$1.length - 1; i$1 >= 0; i$1--) {
            end$1 = Fragment.from(wrap$1[i$1].copy(end$1));
          }
          var tr$1 = state.tr.step(new ReplaceAroundStep($cut.pos - wrap$1.length, $cut.pos + after2.nodeSize, $cut.pos + afterDepth, $cut.pos + after2.nodeSize - afterDepth, new Slice(end$1, wrap$1.length, 0), 0, true));
          dispatch3(tr$1.scrollIntoView());
        }
        return true;
      }
    }
    return false;
  }
  function selectTextblockSide(side) {
    return function(state, dispatch3) {
      var sel = state.selection, $pos = side < 0 ? sel.$from : sel.$to;
      var depth = $pos.depth;
      while ($pos.node(depth).isInline) {
        if (!depth) {
          return false;
        }
        depth--;
      }
      if (!$pos.node(depth).isTextblock) {
        return false;
      }
      if (dispatch3) {
        dispatch3(state.tr.setSelection(TextSelection.create(state.doc, side < 0 ? $pos.start(depth) : $pos.end(depth))));
      }
      return true;
    };
  }
  var selectTextblockStart = selectTextblockSide(-1);
  var selectTextblockEnd = selectTextblockSide(1);
  function wrapIn(nodeType2, attrs) {
    return function(state, dispatch3) {
      var ref = state.selection;
      var $from = ref.$from;
      var $to = ref.$to;
      var range = $from.blockRange($to), wrapping = range && findWrapping3(range, nodeType2, attrs);
      if (!wrapping) {
        return false;
      }
      if (dispatch3) {
        dispatch3(state.tr.wrap(range, wrapping).scrollIntoView());
      }
      return true;
    };
  }
  function setBlockType(nodeType2, attrs) {
    return function(state, dispatch3) {
      var ref = state.selection;
      var from4 = ref.from;
      var to = ref.to;
      var applicable = false;
      state.doc.nodesBetween(from4, to, function(node4, pos) {
        if (applicable) {
          return false;
        }
        if (!node4.isTextblock || node4.hasMarkup(nodeType2, attrs)) {
          return;
        }
        if (node4.type == nodeType2) {
          applicable = true;
        } else {
          var $pos = state.doc.resolve(pos), index2 = $pos.index();
          applicable = $pos.parent.canReplaceWith(index2, index2 + 1, nodeType2);
        }
      });
      if (!applicable) {
        return false;
      }
      if (dispatch3) {
        dispatch3(state.tr.setBlockType(from4, to, nodeType2, attrs).scrollIntoView());
      }
      return true;
    };
  }
  function chainCommands() {
    var commands = [], len = arguments.length;
    while (len--)
      commands[len] = arguments[len];
    return function(state, dispatch3, view) {
      for (var i = 0; i < commands.length; i++) {
        if (commands[i](state, dispatch3, view)) {
          return true;
        }
      }
      return false;
    };
  }
  var backspace = chainCommands(deleteSelection, joinBackward, selectNodeBackward);
  var del2 = chainCommands(deleteSelection, joinForward, selectNodeForward);
  var pcBaseKeymap = {
    "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
    "Mod-Enter": exitCode,
    "Backspace": backspace,
    "Mod-Backspace": backspace,
    "Shift-Backspace": backspace,
    "Delete": del2,
    "Mod-Delete": del2,
    "Mod-a": selectAll
  };
  var macBaseKeymap = {
    "Ctrl-h": pcBaseKeymap["Backspace"],
    "Alt-Backspace": pcBaseKeymap["Mod-Backspace"],
    "Ctrl-d": pcBaseKeymap["Delete"],
    "Ctrl-Alt-Backspace": pcBaseKeymap["Mod-Delete"],
    "Alt-Delete": pcBaseKeymap["Mod-Delete"],
    "Alt-d": pcBaseKeymap["Mod-Delete"],
    "Ctrl-a": selectTextblockStart,
    "Ctrl-e": selectTextblockEnd
  };
  for (key in pcBaseKeymap) {
    macBaseKeymap[key] = pcBaseKeymap[key];
  }
  var key;
  var mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os != "undefined" ? os.platform() == "darwin" : false;

  // node_modules/prosemirror-schema-list/dist/index.es.js
  function wrapInList(listType, attrs) {
    return function(state, dispatch3) {
      var ref = state.selection;
      var $from = ref.$from;
      var $to = ref.$to;
      var range = $from.blockRange($to), doJoin = false, outerRange = range;
      if (!range) {
        return false;
      }
      if (range.depth >= 2 && $from.node(range.depth - 1).type.compatibleContent(listType) && range.startIndex == 0) {
        if ($from.index(range.depth - 1) == 0) {
          return false;
        }
        var $insert = state.doc.resolve(range.start - 2);
        outerRange = new NodeRange($insert, $insert, range.depth);
        if (range.endIndex < range.parent.childCount) {
          range = new NodeRange($from, state.doc.resolve($to.end(range.depth)), range.depth);
        }
        doJoin = true;
      }
      var wrap = findWrapping3(outerRange, listType, attrs, range);
      if (!wrap) {
        return false;
      }
      if (dispatch3) {
        dispatch3(doWrapInList(state.tr, range, wrap, doJoin, listType).scrollIntoView());
      }
      return true;
    };
  }
  function doWrapInList(tr, range, wrappers, joinBefore, listType) {
    var content2 = Fragment.empty;
    for (var i = wrappers.length - 1; i >= 0; i--) {
      content2 = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content2));
    }
    tr.step(new ReplaceAroundStep(range.start - (joinBefore ? 2 : 0), range.end, range.start, range.end, new Slice(content2, 0, 0), wrappers.length, true));
    var found2 = 0;
    for (var i$1 = 0; i$1 < wrappers.length; i$1++) {
      if (wrappers[i$1].type == listType) {
        found2 = i$1 + 1;
      }
    }
    var splitDepth = wrappers.length - found2;
    var splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0), parent = range.parent;
    for (var i$2 = range.startIndex, e = range.endIndex, first2 = true; i$2 < e; i$2++, first2 = false) {
      if (!first2 && canSplit(tr.doc, splitPos, splitDepth)) {
        tr.split(splitPos, splitDepth);
        splitPos += 2 * splitDepth;
      }
      splitPos += parent.child(i$2).nodeSize;
    }
    return tr;
  }
  function liftListItem(itemType) {
    return function(state, dispatch3) {
      var ref = state.selection;
      var $from = ref.$from;
      var $to = ref.$to;
      var range = $from.blockRange($to, function(node4) {
        return node4.childCount && node4.firstChild.type == itemType;
      });
      if (!range) {
        return false;
      }
      if (!dispatch3) {
        return true;
      }
      if ($from.node(range.depth - 1).type == itemType) {
        return liftToOuterList(state, dispatch3, itemType, range);
      } else {
        return liftOutOfList(state, dispatch3, range);
      }
    };
  }
  function liftToOuterList(state, dispatch3, itemType, range) {
    var tr = state.tr, end3 = range.end, endOfList = range.$to.end(range.depth);
    if (end3 < endOfList) {
      tr.step(new ReplaceAroundStep(end3 - 1, endOfList, end3, endOfList, new Slice(Fragment.from(itemType.create(null, range.parent.copy())), 1, 0), 1, true));
      range = new NodeRange(tr.doc.resolve(range.$from.pos), tr.doc.resolve(endOfList), range.depth);
    }
    dispatch3(tr.lift(range, liftTarget(range)).scrollIntoView());
    return true;
  }
  function liftOutOfList(state, dispatch3, range) {
    var tr = state.tr, list = range.parent;
    for (var pos = range.end, i = range.endIndex - 1, e = range.startIndex; i > e; i--) {
      pos -= list.child(i).nodeSize;
      tr.delete(pos - 1, pos + 1);
    }
    var $start = tr.doc.resolve(range.start), item = $start.nodeAfter;
    if (tr.mapping.map(range.end) != range.start + $start.nodeAfter.nodeSize) {
      return false;
    }
    var atStart2 = range.startIndex == 0, atEnd2 = range.endIndex == list.childCount;
    var parent = $start.node(-1), indexBefore = $start.index(-1);
    if (!parent.canReplace(indexBefore + (atStart2 ? 0 : 1), indexBefore + 1, item.content.append(atEnd2 ? Fragment.empty : Fragment.from(list)))) {
      return false;
    }
    var start5 = $start.pos, end3 = start5 + item.nodeSize;
    tr.step(new ReplaceAroundStep(start5 - (atStart2 ? 1 : 0), end3 + (atEnd2 ? 1 : 0), start5 + 1, end3 - 1, new Slice((atStart2 ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))).append(atEnd2 ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))), atStart2 ? 0 : 1, atEnd2 ? 0 : 1), atStart2 ? 0 : 1));
    dispatch3(tr.scrollIntoView());
    return true;
  }
  function sinkListItem(itemType) {
    return function(state, dispatch3) {
      var ref = state.selection;
      var $from = ref.$from;
      var $to = ref.$to;
      var range = $from.blockRange($to, function(node4) {
        return node4.childCount && node4.firstChild.type == itemType;
      });
      if (!range) {
        return false;
      }
      var startIndex = range.startIndex;
      if (startIndex == 0) {
        return false;
      }
      var parent = range.parent, nodeBefore = parent.child(startIndex - 1);
      if (nodeBefore.type != itemType) {
        return false;
      }
      if (dispatch3) {
        var nestedBefore = nodeBefore.lastChild && nodeBefore.lastChild.type == parent.type;
        var inner = Fragment.from(nestedBefore ? itemType.create() : null);
        var slice4 = new Slice(Fragment.from(itemType.create(null, Fragment.from(parent.type.create(null, inner)))), nestedBefore ? 3 : 1, 0);
        var before2 = range.start, after2 = range.end;
        dispatch3(state.tr.step(new ReplaceAroundStep(before2 - (nestedBefore ? 3 : 1), after2, before2, after2, slice4, 1, true)).scrollIntoView());
      }
      return true;
    };
  }

  // node_modules/prosemirror-view/dist/index.es.js
  var result = {};
  if (typeof navigator != "undefined" && typeof document != "undefined") {
    ie_edge = /Edge\/(\d+)/.exec(navigator.userAgent);
    ie_upto10 = /MSIE \d/.test(navigator.userAgent);
    ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
    ie2 = result.ie = !!(ie_upto10 || ie_11up || ie_edge);
    result.ie_version = ie_upto10 ? document.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : null;
    result.gecko = !ie2 && /gecko\/(\d+)/i.test(navigator.userAgent);
    result.gecko_version = result.gecko && +(/Firefox\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1];
    chrome2 = !ie2 && /Chrome\/(\d+)/.exec(navigator.userAgent);
    result.chrome = !!chrome2;
    result.chrome_version = chrome2 && +chrome2[1];
    result.safari = !ie2 && /Apple Computer/.test(navigator.vendor);
    result.ios = result.safari && (/Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2);
    result.mac = result.ios || /Mac/.test(navigator.platform);
    result.android = /Android \d/.test(navigator.userAgent);
    result.webkit = "webkitFontSmoothing" in document.documentElement.style;
    result.webkit_version = result.webkit && +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1];
  }
  var ie_edge;
  var ie_upto10;
  var ie_11up;
  var ie2;
  var chrome2;
  var domIndex = function(node4) {
    for (var index2 = 0; ; index2++) {
      node4 = node4.previousSibling;
      if (!node4) {
        return index2;
      }
    }
  };
  var parentNode = function(node4) {
    var parent = node4.assignedSlot || node4.parentNode;
    return parent && parent.nodeType == 11 ? parent.host : parent;
  };
  var reusedRange = null;
  var textRange = function(node4, from4, to) {
    var range = reusedRange || (reusedRange = document.createRange());
    range.setEnd(node4, to == null ? node4.nodeValue.length : to);
    range.setStart(node4, from4 || 0);
    return range;
  };
  var isEquivalentPosition = function(node4, off, targetNode, targetOff) {
    return targetNode && (scanFor(node4, off, targetNode, targetOff, -1) || scanFor(node4, off, targetNode, targetOff, 1));
  };
  var atomElements = /^(img|br|input|textarea|hr)$/i;
  function scanFor(node4, off, targetNode, targetOff, dir) {
    for (; ; ) {
      if (node4 == targetNode && off == targetOff) {
        return true;
      }
      if (off == (dir < 0 ? 0 : nodeSize(node4))) {
        var parent = node4.parentNode;
        if (!parent || parent.nodeType != 1 || hasBlockDesc(node4) || atomElements.test(node4.nodeName) || node4.contentEditable == "false") {
          return false;
        }
        off = domIndex(node4) + (dir < 0 ? 0 : 1);
        node4 = parent;
      } else if (node4.nodeType == 1) {
        node4 = node4.childNodes[off + (dir < 0 ? -1 : 0)];
        if (node4.contentEditable == "false") {
          return false;
        }
        off = dir < 0 ? nodeSize(node4) : 0;
      } else {
        return false;
      }
    }
  }
  function nodeSize(node4) {
    return node4.nodeType == 3 ? node4.nodeValue.length : node4.childNodes.length;
  }
  function isOnEdge(node4, offset3, parent) {
    for (var atStart2 = offset3 == 0, atEnd2 = offset3 == nodeSize(node4); atStart2 || atEnd2; ) {
      if (node4 == parent) {
        return true;
      }
      var index2 = domIndex(node4);
      node4 = node4.parentNode;
      if (!node4) {
        return false;
      }
      atStart2 = atStart2 && index2 == 0;
      atEnd2 = atEnd2 && index2 == nodeSize(node4);
    }
  }
  function hasBlockDesc(dom) {
    var desc;
    for (var cur = dom; cur; cur = cur.parentNode) {
      if (desc = cur.pmViewDesc) {
        break;
      }
    }
    return desc && desc.node && desc.node.isBlock && (desc.dom == dom || desc.contentDOM == dom);
  }
  var selectionCollapsed = function(domSel) {
    var collapsed = domSel.isCollapsed;
    if (collapsed && result.chrome && domSel.rangeCount && !domSel.getRangeAt(0).collapsed) {
      collapsed = false;
    }
    return collapsed;
  };
  function keyEvent(keyCode, key) {
    var event = document.createEvent("Event");
    event.initEvent("keydown", true, true);
    event.keyCode = keyCode;
    event.key = event.code = key;
    return event;
  }
  function windowRect(doc2) {
    return {
      left: 0,
      right: doc2.documentElement.clientWidth,
      top: 0,
      bottom: doc2.documentElement.clientHeight
    };
  }
  function getSide(value, side) {
    return typeof value == "number" ? value : value[side];
  }
  function clientRect(node4) {
    var rect = node4.getBoundingClientRect();
    var scaleX = rect.width / node4.offsetWidth || 1;
    var scaleY = rect.height / node4.offsetHeight || 1;
    return {
      left: rect.left,
      right: rect.left + node4.clientWidth * scaleX,
      top: rect.top,
      bottom: rect.top + node4.clientHeight * scaleY
    };
  }
  function scrollRectIntoView(view, rect, startDOM) {
    var scrollThreshold = view.someProp("scrollThreshold") || 0, scrollMargin = view.someProp("scrollMargin") || 5;
    var doc2 = view.dom.ownerDocument;
    for (var parent = startDOM || view.dom; ; parent = parentNode(parent)) {
      if (!parent) {
        break;
      }
      if (parent.nodeType != 1) {
        continue;
      }
      var atTop = parent == doc2.body || parent.nodeType != 1;
      var bounding = atTop ? windowRect(doc2) : clientRect(parent);
      var moveX = 0, moveY = 0;
      if (rect.top < bounding.top + getSide(scrollThreshold, "top")) {
        moveY = -(bounding.top - rect.top + getSide(scrollMargin, "top"));
      } else if (rect.bottom > bounding.bottom - getSide(scrollThreshold, "bottom")) {
        moveY = rect.bottom - bounding.bottom + getSide(scrollMargin, "bottom");
      }
      if (rect.left < bounding.left + getSide(scrollThreshold, "left")) {
        moveX = -(bounding.left - rect.left + getSide(scrollMargin, "left"));
      } else if (rect.right > bounding.right - getSide(scrollThreshold, "right")) {
        moveX = rect.right - bounding.right + getSide(scrollMargin, "right");
      }
      if (moveX || moveY) {
        if (atTop) {
          doc2.defaultView.scrollBy(moveX, moveY);
        } else {
          var startX = parent.scrollLeft, startY = parent.scrollTop;
          if (moveY) {
            parent.scrollTop += moveY;
          }
          if (moveX) {
            parent.scrollLeft += moveX;
          }
          var dX = parent.scrollLeft - startX, dY = parent.scrollTop - startY;
          rect = { left: rect.left - dX, top: rect.top - dY, right: rect.right - dX, bottom: rect.bottom - dY };
        }
      }
      if (atTop) {
        break;
      }
    }
  }
  function storeScrollPos(view) {
    var rect = view.dom.getBoundingClientRect(), startY = Math.max(0, rect.top);
    var refDOM, refTop;
    for (var x = (rect.left + rect.right) / 2, y = startY + 1; y < Math.min(innerHeight, rect.bottom); y += 5) {
      var dom = view.root.elementFromPoint(x, y);
      if (dom == view.dom || !view.dom.contains(dom)) {
        continue;
      }
      var localRect = dom.getBoundingClientRect();
      if (localRect.top >= startY - 20) {
        refDOM = dom;
        refTop = localRect.top;
        break;
      }
    }
    return { refDOM, refTop, stack: scrollStack(view.dom) };
  }
  function scrollStack(dom) {
    var stack = [], doc2 = dom.ownerDocument;
    for (; dom; dom = parentNode(dom)) {
      stack.push({ dom, top: dom.scrollTop, left: dom.scrollLeft });
      if (dom == doc2) {
        break;
      }
    }
    return stack;
  }
  function resetScrollPos(ref) {
    var refDOM = ref.refDOM;
    var refTop = ref.refTop;
    var stack = ref.stack;
    var newRefTop = refDOM ? refDOM.getBoundingClientRect().top : 0;
    restoreScrollStack(stack, newRefTop == 0 ? 0 : newRefTop - refTop);
  }
  function restoreScrollStack(stack, dTop) {
    for (var i = 0; i < stack.length; i++) {
      var ref = stack[i];
      var dom = ref.dom;
      var top2 = ref.top;
      var left2 = ref.left;
      if (dom.scrollTop != top2 + dTop) {
        dom.scrollTop = top2 + dTop;
      }
      if (dom.scrollLeft != left2) {
        dom.scrollLeft = left2;
      }
    }
  }
  var preventScrollSupported = null;
  function focusPreventScroll(dom) {
    if (dom.setActive) {
      return dom.setActive();
    }
    if (preventScrollSupported) {
      return dom.focus(preventScrollSupported);
    }
    var stored = scrollStack(dom);
    dom.focus(preventScrollSupported == null ? {
      get preventScroll() {
        preventScrollSupported = { preventScroll: true };
        return true;
      }
    } : void 0);
    if (!preventScrollSupported) {
      preventScrollSupported = false;
      restoreScrollStack(stored, 0);
    }
  }
  function findOffsetInNode(node4, coords) {
    var closest, dxClosest = 2e8, coordsClosest, offset3 = 0;
    var rowBot = coords.top, rowTop = coords.top;
    for (var child3 = node4.firstChild, childIndex = 0; child3; child3 = child3.nextSibling, childIndex++) {
      var rects = void 0;
      if (child3.nodeType == 1) {
        rects = child3.getClientRects();
      } else if (child3.nodeType == 3) {
        rects = textRange(child3).getClientRects();
      } else {
        continue;
      }
      for (var i = 0; i < rects.length; i++) {
        var rect = rects[i];
        if (rect.top <= rowBot && rect.bottom >= rowTop) {
          rowBot = Math.max(rect.bottom, rowBot);
          rowTop = Math.min(rect.top, rowTop);
          var dx = rect.left > coords.left ? rect.left - coords.left : rect.right < coords.left ? coords.left - rect.right : 0;
          if (dx < dxClosest) {
            closest = child3;
            dxClosest = dx;
            coordsClosest = dx && closest.nodeType == 3 ? { left: rect.right < coords.left ? rect.right : rect.left, top: coords.top } : coords;
            if (child3.nodeType == 1 && dx) {
              offset3 = childIndex + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0);
            }
            continue;
          }
        }
        if (!closest && (coords.left >= rect.right && coords.top >= rect.top || coords.left >= rect.left && coords.top >= rect.bottom)) {
          offset3 = childIndex + 1;
        }
      }
    }
    if (closest && closest.nodeType == 3) {
      return findOffsetInText(closest, coordsClosest);
    }
    if (!closest || dxClosest && closest.nodeType == 1) {
      return { node: node4, offset: offset3 };
    }
    return findOffsetInNode(closest, coordsClosest);
  }
  function findOffsetInText(node4, coords) {
    var len = node4.nodeValue.length;
    var range = document.createRange();
    for (var i = 0; i < len; i++) {
      range.setEnd(node4, i + 1);
      range.setStart(node4, i);
      var rect = singleRect(range, 1);
      if (rect.top == rect.bottom) {
        continue;
      }
      if (inRect(coords, rect)) {
        return { node: node4, offset: i + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0) };
      }
    }
    return { node: node4, offset: 0 };
  }
  function inRect(coords, rect) {
    return coords.left >= rect.left - 1 && coords.left <= rect.right + 1 && coords.top >= rect.top - 1 && coords.top <= rect.bottom + 1;
  }
  function targetKludge(dom, coords) {
    var parent = dom.parentNode;
    if (parent && /^li$/i.test(parent.nodeName) && coords.left < dom.getBoundingClientRect().left) {
      return parent;
    }
    return dom;
  }
  function posFromElement(view, elt, coords) {
    var ref = findOffsetInNode(elt, coords);
    var node4 = ref.node;
    var offset3 = ref.offset;
    var bias = -1;
    if (node4.nodeType == 1 && !node4.firstChild) {
      var rect = node4.getBoundingClientRect();
      bias = rect.left != rect.right && coords.left > (rect.left + rect.right) / 2 ? 1 : -1;
    }
    return view.docView.posFromDOM(node4, offset3, bias);
  }
  function posFromCaret(view, node4, offset3, coords) {
    var outside = -1;
    for (var cur = node4; ; ) {
      if (cur == view.dom) {
        break;
      }
      var desc = view.docView.nearestDesc(cur, true);
      if (!desc) {
        return null;
      }
      if (desc.node.isBlock && desc.parent) {
        var rect = desc.dom.getBoundingClientRect();
        if (rect.left > coords.left || rect.top > coords.top) {
          outside = desc.posBefore;
        } else if (rect.right < coords.left || rect.bottom < coords.top) {
          outside = desc.posAfter;
        } else {
          break;
        }
      }
      cur = desc.dom.parentNode;
    }
    return outside > -1 ? outside : view.docView.posFromDOM(node4, offset3);
  }
  function elementFromPoint(element, coords, box) {
    var len = element.childNodes.length;
    if (len && box.top < box.bottom) {
      for (var startI = Math.max(0, Math.min(len - 1, Math.floor(len * (coords.top - box.top) / (box.bottom - box.top)) - 2)), i = startI; ; ) {
        var child3 = element.childNodes[i];
        if (child3.nodeType == 1) {
          var rects = child3.getClientRects();
          for (var j = 0; j < rects.length; j++) {
            var rect = rects[j];
            if (inRect(coords, rect)) {
              return elementFromPoint(child3, coords, rect);
            }
          }
        }
        if ((i = (i + 1) % len) == startI) {
          break;
        }
      }
    }
    return element;
  }
  function posAtCoords(view, coords) {
    var assign, assign$1;
    var doc2 = view.dom.ownerDocument, node4, offset3;
    if (doc2.caretPositionFromPoint) {
      try {
        var pos$1 = doc2.caretPositionFromPoint(coords.left, coords.top);
        if (pos$1) {
          assign = pos$1, node4 = assign.offsetNode, offset3 = assign.offset;
        }
      } catch (_) {
      }
    }
    if (!node4 && doc2.caretRangeFromPoint) {
      var range = doc2.caretRangeFromPoint(coords.left, coords.top);
      if (range) {
        assign$1 = range, node4 = assign$1.startContainer, offset3 = assign$1.startOffset;
      }
    }
    var elt = (view.root.elementFromPoint ? view.root : doc2).elementFromPoint(coords.left, coords.top + 1), pos;
    if (!elt || !view.dom.contains(elt.nodeType != 1 ? elt.parentNode : elt)) {
      var box = view.dom.getBoundingClientRect();
      if (!inRect(coords, box)) {
        return null;
      }
      elt = elementFromPoint(view.dom, coords, box);
      if (!elt) {
        return null;
      }
    }
    if (result.safari) {
      for (var p = elt; node4 && p; p = parentNode(p)) {
        if (p.draggable) {
          node4 = offset3 = null;
        }
      }
    }
    elt = targetKludge(elt, coords);
    if (node4) {
      if (result.gecko && node4.nodeType == 1) {
        offset3 = Math.min(offset3, node4.childNodes.length);
        if (offset3 < node4.childNodes.length) {
          var next = node4.childNodes[offset3], box$1;
          if (next.nodeName == "IMG" && (box$1 = next.getBoundingClientRect()).right <= coords.left && box$1.bottom > coords.top) {
            offset3++;
          }
        }
      }
      if (node4 == view.dom && offset3 == node4.childNodes.length - 1 && node4.lastChild.nodeType == 1 && coords.top > node4.lastChild.getBoundingClientRect().bottom) {
        pos = view.state.doc.content.size;
      } else if (offset3 == 0 || node4.nodeType != 1 || node4.childNodes[offset3 - 1].nodeName != "BR") {
        pos = posFromCaret(view, node4, offset3, coords);
      }
    }
    if (pos == null) {
      pos = posFromElement(view, elt, coords);
    }
    var desc = view.docView.nearestDesc(elt, true);
    return { pos, inside: desc ? desc.posAtStart - desc.border : -1 };
  }
  function singleRect(object, bias) {
    var rects = object.getClientRects();
    return !rects.length ? object.getBoundingClientRect() : rects[bias < 0 ? 0 : rects.length - 1];
  }
  var BIDI = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
  function coordsAtPos(view, pos, side) {
    var ref = view.docView.domFromPos(pos, side < 0 ? -1 : 1);
    var node4 = ref.node;
    var offset3 = ref.offset;
    var supportEmptyRange = result.webkit || result.gecko;
    if (node4.nodeType == 3) {
      if (supportEmptyRange && (BIDI.test(node4.nodeValue) || (side < 0 ? !offset3 : offset3 == node4.nodeValue.length))) {
        var rect = singleRect(textRange(node4, offset3, offset3), side);
        if (result.gecko && offset3 && /\s/.test(node4.nodeValue[offset3 - 1]) && offset3 < node4.nodeValue.length) {
          var rectBefore = singleRect(textRange(node4, offset3 - 1, offset3 - 1), -1);
          if (rectBefore.top == rect.top) {
            var rectAfter = singleRect(textRange(node4, offset3, offset3 + 1), -1);
            if (rectAfter.top != rect.top) {
              return flattenV(rectAfter, rectAfter.left < rectBefore.left);
            }
          }
        }
        return rect;
      } else {
        var from4 = offset3, to = offset3, takeSide = side < 0 ? 1 : -1;
        if (side < 0 && !offset3) {
          to++;
          takeSide = -1;
        } else if (side >= 0 && offset3 == node4.nodeValue.length) {
          from4--;
          takeSide = 1;
        } else if (side < 0) {
          from4--;
        } else {
          to++;
        }
        return flattenV(singleRect(textRange(node4, from4, to), takeSide), takeSide < 0);
      }
    }
    if (!view.state.doc.resolve(pos).parent.inlineContent) {
      if (offset3 && (side < 0 || offset3 == nodeSize(node4))) {
        var before2 = node4.childNodes[offset3 - 1];
        if (before2.nodeType == 1) {
          return flattenH(before2.getBoundingClientRect(), false);
        }
      }
      if (offset3 < nodeSize(node4)) {
        var after2 = node4.childNodes[offset3];
        if (after2.nodeType == 1) {
          return flattenH(after2.getBoundingClientRect(), true);
        }
      }
      return flattenH(node4.getBoundingClientRect(), side >= 0);
    }
    if (offset3 && (side < 0 || offset3 == nodeSize(node4))) {
      var before$1 = node4.childNodes[offset3 - 1];
      var target = before$1.nodeType == 3 ? textRange(before$1, nodeSize(before$1) - (supportEmptyRange ? 0 : 1)) : before$1.nodeType == 1 && (before$1.nodeName != "BR" || !before$1.nextSibling) ? before$1 : null;
      if (target) {
        return flattenV(singleRect(target, 1), false);
      }
    }
    if (offset3 < nodeSize(node4)) {
      var after$1 = node4.childNodes[offset3];
      while (after$1.pmViewDesc && after$1.pmViewDesc.ignoreForCoords) {
        after$1 = after$1.nextSibling;
      }
      var target$1 = !after$1 ? null : after$1.nodeType == 3 ? textRange(after$1, 0, supportEmptyRange ? 0 : 1) : after$1.nodeType == 1 ? after$1 : null;
      if (target$1) {
        return flattenV(singleRect(target$1, -1), true);
      }
    }
    return flattenV(singleRect(node4.nodeType == 3 ? textRange(node4) : node4, -side), side >= 0);
  }
  function flattenV(rect, left2) {
    if (rect.width == 0) {
      return rect;
    }
    var x = left2 ? rect.left : rect.right;
    return { top: rect.top, bottom: rect.bottom, left: x, right: x };
  }
  function flattenH(rect, top2) {
    if (rect.height == 0) {
      return rect;
    }
    var y = top2 ? rect.top : rect.bottom;
    return { top: y, bottom: y, left: rect.left, right: rect.right };
  }
  function withFlushedState(view, state, f) {
    var viewState = view.state, active = view.root.activeElement;
    if (viewState != state) {
      view.updateState(state);
    }
    if (active != view.dom) {
      view.focus();
    }
    try {
      return f();
    } finally {
      if (viewState != state) {
        view.updateState(viewState);
      }
      if (active != view.dom && active) {
        active.focus();
      }
    }
  }
  function endOfTextblockVertical(view, state, dir) {
    var sel = state.selection;
    var $pos = dir == "up" ? sel.$from : sel.$to;
    return withFlushedState(view, state, function() {
      var ref = view.docView.domFromPos($pos.pos, dir == "up" ? -1 : 1);
      var dom = ref.node;
      for (; ; ) {
        var nearest = view.docView.nearestDesc(dom, true);
        if (!nearest) {
          break;
        }
        if (nearest.node.isBlock) {
          dom = nearest.dom;
          break;
        }
        dom = nearest.dom.parentNode;
      }
      var coords = coordsAtPos(view, $pos.pos, 1);
      for (var child3 = dom.firstChild; child3; child3 = child3.nextSibling) {
        var boxes = void 0;
        if (child3.nodeType == 1) {
          boxes = child3.getClientRects();
        } else if (child3.nodeType == 3) {
          boxes = textRange(child3, 0, child3.nodeValue.length).getClientRects();
        } else {
          continue;
        }
        for (var i = 0; i < boxes.length; i++) {
          var box = boxes[i];
          if (box.bottom > box.top + 1 && (dir == "up" ? coords.top - box.top > (box.bottom - coords.top) * 2 : box.bottom - coords.bottom > (coords.bottom - box.top) * 2)) {
            return false;
          }
        }
      }
      return true;
    });
  }
  var maybeRTL = /[\u0590-\u08ac]/;
  function endOfTextblockHorizontal(view, state, dir) {
    var ref = state.selection;
    var $head = ref.$head;
    if (!$head.parent.isTextblock) {
      return false;
    }
    var offset3 = $head.parentOffset, atStart2 = !offset3, atEnd2 = offset3 == $head.parent.content.size;
    var sel = view.root.getSelection();
    if (!maybeRTL.test($head.parent.textContent) || !sel.modify) {
      return dir == "left" || dir == "backward" ? atStart2 : atEnd2;
    }
    return withFlushedState(view, state, function() {
      var oldRange = sel.getRangeAt(0), oldNode = sel.focusNode, oldOff = sel.focusOffset;
      var oldBidiLevel = sel.caretBidiLevel;
      sel.modify("move", dir, "character");
      var parentDOM = $head.depth ? view.docView.domAfterPos($head.before()) : view.dom;
      var result2 = !parentDOM.contains(sel.focusNode.nodeType == 1 ? sel.focusNode : sel.focusNode.parentNode) || oldNode == sel.focusNode && oldOff == sel.focusOffset;
      sel.removeAllRanges();
      sel.addRange(oldRange);
      if (oldBidiLevel != null) {
        sel.caretBidiLevel = oldBidiLevel;
      }
      return result2;
    });
  }
  var cachedState = null;
  var cachedDir = null;
  var cachedResult = false;
  function endOfTextblock(view, state, dir) {
    if (cachedState == state && cachedDir == dir) {
      return cachedResult;
    }
    cachedState = state;
    cachedDir = dir;
    return cachedResult = dir == "up" || dir == "down" ? endOfTextblockVertical(view, state, dir) : endOfTextblockHorizontal(view, state, dir);
  }
  var NOT_DIRTY = 0;
  var CHILD_DIRTY = 1;
  var CONTENT_DIRTY = 2;
  var NODE_DIRTY = 3;
  var ViewDesc = function ViewDesc2(parent, children, dom, contentDOM) {
    this.parent = parent;
    this.children = children;
    this.dom = dom;
    dom.pmViewDesc = this;
    this.contentDOM = contentDOM;
    this.dirty = NOT_DIRTY;
  };
  var prototypeAccessors4 = { size: { configurable: true }, border: { configurable: true }, posBefore: { configurable: true }, posAtStart: { configurable: true }, posAfter: { configurable: true }, posAtEnd: { configurable: true }, contentLost: { configurable: true }, domAtom: { configurable: true }, ignoreForCoords: { configurable: true } };
  ViewDesc.prototype.matchesWidget = function matchesWidget() {
    return false;
  };
  ViewDesc.prototype.matchesMark = function matchesMark() {
    return false;
  };
  ViewDesc.prototype.matchesNode = function matchesNode() {
    return false;
  };
  ViewDesc.prototype.matchesHack = function matchesHack(_nodeName) {
    return false;
  };
  ViewDesc.prototype.parseRule = function parseRule() {
    return null;
  };
  ViewDesc.prototype.stopEvent = function stopEvent() {
    return false;
  };
  prototypeAccessors4.size.get = function() {
    var size = 0;
    for (var i = 0; i < this.children.length; i++) {
      size += this.children[i].size;
    }
    return size;
  };
  prototypeAccessors4.border.get = function() {
    return 0;
  };
  ViewDesc.prototype.destroy = function destroy() {
    this.parent = null;
    if (this.dom.pmViewDesc == this) {
      this.dom.pmViewDesc = null;
    }
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].destroy();
    }
  };
  ViewDesc.prototype.posBeforeChild = function posBeforeChild(child3) {
    for (var i = 0, pos = this.posAtStart; i < this.children.length; i++) {
      var cur = this.children[i];
      if (cur == child3) {
        return pos;
      }
      pos += cur.size;
    }
  };
  prototypeAccessors4.posBefore.get = function() {
    return this.parent.posBeforeChild(this);
  };
  prototypeAccessors4.posAtStart.get = function() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  };
  prototypeAccessors4.posAfter.get = function() {
    return this.posBefore + this.size;
  };
  prototypeAccessors4.posAtEnd.get = function() {
    return this.posAtStart + this.size - 2 * this.border;
  };
  ViewDesc.prototype.localPosFromDOM = function localPosFromDOM(dom, offset3, bias) {
    if (this.contentDOM && this.contentDOM.contains(dom.nodeType == 1 ? dom : dom.parentNode)) {
      if (bias < 0) {
        var domBefore, desc;
        if (dom == this.contentDOM) {
          domBefore = dom.childNodes[offset3 - 1];
        } else {
          while (dom.parentNode != this.contentDOM) {
            dom = dom.parentNode;
          }
          domBefore = dom.previousSibling;
        }
        while (domBefore && !((desc = domBefore.pmViewDesc) && desc.parent == this)) {
          domBefore = domBefore.previousSibling;
        }
        return domBefore ? this.posBeforeChild(desc) + desc.size : this.posAtStart;
      } else {
        var domAfter, desc$1;
        if (dom == this.contentDOM) {
          domAfter = dom.childNodes[offset3];
        } else {
          while (dom.parentNode != this.contentDOM) {
            dom = dom.parentNode;
          }
          domAfter = dom.nextSibling;
        }
        while (domAfter && !((desc$1 = domAfter.pmViewDesc) && desc$1.parent == this)) {
          domAfter = domAfter.nextSibling;
        }
        return domAfter ? this.posBeforeChild(desc$1) : this.posAtEnd;
      }
    }
    var atEnd2;
    if (dom == this.dom && this.contentDOM) {
      atEnd2 = offset3 > domIndex(this.contentDOM);
    } else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) {
      atEnd2 = dom.compareDocumentPosition(this.contentDOM) & 2;
    } else if (this.dom.firstChild) {
      if (offset3 == 0) {
        for (var search = dom; ; search = search.parentNode) {
          if (search == this.dom) {
            atEnd2 = false;
            break;
          }
          if (search.parentNode.firstChild != search) {
            break;
          }
        }
      }
      if (atEnd2 == null && offset3 == dom.childNodes.length) {
        for (var search$1 = dom; ; search$1 = search$1.parentNode) {
          if (search$1 == this.dom) {
            atEnd2 = true;
            break;
          }
          if (search$1.parentNode.lastChild != search$1) {
            break;
          }
        }
      }
    }
    return (atEnd2 == null ? bias > 0 : atEnd2) ? this.posAtEnd : this.posAtStart;
  };
  ViewDesc.prototype.nearestDesc = function nearestDesc(dom, onlyNodes) {
    for (var first2 = true, cur = dom; cur; cur = cur.parentNode) {
      var desc = this.getDesc(cur);
      if (desc && (!onlyNodes || desc.node)) {
        if (first2 && desc.nodeDOM && !(desc.nodeDOM.nodeType == 1 ? desc.nodeDOM.contains(dom.nodeType == 1 ? dom : dom.parentNode) : desc.nodeDOM == dom)) {
          first2 = false;
        } else {
          return desc;
        }
      }
    }
  };
  ViewDesc.prototype.getDesc = function getDesc(dom) {
    var desc = dom.pmViewDesc;
    for (var cur = desc; cur; cur = cur.parent) {
      if (cur == this) {
        return desc;
      }
    }
  };
  ViewDesc.prototype.posFromDOM = function posFromDOM(dom, offset3, bias) {
    for (var scan = dom; scan; scan = scan.parentNode) {
      var desc = this.getDesc(scan);
      if (desc) {
        return desc.localPosFromDOM(dom, offset3, bias);
      }
    }
    return -1;
  };
  ViewDesc.prototype.descAt = function descAt(pos) {
    for (var i = 0, offset3 = 0; i < this.children.length; i++) {
      var child3 = this.children[i], end3 = offset3 + child3.size;
      if (offset3 == pos && end3 != offset3) {
        while (!child3.border && child3.children.length) {
          child3 = child3.children[0];
        }
        return child3;
      }
      if (pos < end3) {
        return child3.descAt(pos - offset3 - child3.border);
      }
      offset3 = end3;
    }
  };
  ViewDesc.prototype.domFromPos = function domFromPos(pos, side) {
    if (!this.contentDOM) {
      return { node: this.dom, offset: 0 };
    }
    var i = 0, offset3 = 0;
    for (var curPos = 0; i < this.children.length; i++) {
      var child3 = this.children[i], end3 = curPos + child3.size;
      if (end3 > pos || child3 instanceof TrailingHackViewDesc) {
        offset3 = pos - curPos;
        break;
      }
      curPos = end3;
    }
    if (offset3) {
      return this.children[i].domFromPos(offset3 - this.children[i].border, side);
    }
    for (var prev = void 0; i && !(prev = this.children[i - 1]).size && prev instanceof WidgetViewDesc && prev.widget.type.side >= 0; i--) {
    }
    if (side <= 0) {
      var prev$1, enter3 = true;
      for (; ; i--, enter3 = false) {
        prev$1 = i ? this.children[i - 1] : null;
        if (!prev$1 || prev$1.dom.parentNode == this.contentDOM) {
          break;
        }
      }
      if (prev$1 && side && enter3 && !prev$1.border && !prev$1.domAtom) {
        return prev$1.domFromPos(prev$1.size, side);
      }
      return { node: this.contentDOM, offset: prev$1 ? domIndex(prev$1.dom) + 1 : 0 };
    } else {
      var next, enter$12 = true;
      for (; ; i++, enter$12 = false) {
        next = i < this.children.length ? this.children[i] : null;
        if (!next || next.dom.parentNode == this.contentDOM) {
          break;
        }
      }
      if (next && enter$12 && !next.border && !next.domAtom) {
        return next.domFromPos(0, side);
      }
      return { node: this.contentDOM, offset: next ? domIndex(next.dom) : this.contentDOM.childNodes.length };
    }
  };
  ViewDesc.prototype.parseRange = function parseRange(from4, to, base2) {
    if (base2 === void 0)
      base2 = 0;
    if (this.children.length == 0) {
      return { node: this.contentDOM, from: from4, to, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    }
    var fromOffset = -1, toOffset = -1;
    for (var offset3 = base2, i = 0; ; i++) {
      var child3 = this.children[i], end3 = offset3 + child3.size;
      if (fromOffset == -1 && from4 <= end3) {
        var childBase = offset3 + child3.border;
        if (from4 >= childBase && to <= end3 - child3.border && child3.node && child3.contentDOM && this.contentDOM.contains(child3.contentDOM)) {
          return child3.parseRange(from4, to, childBase);
        }
        from4 = offset3;
        for (var j = i; j > 0; j--) {
          var prev = this.children[j - 1];
          if (prev.size && prev.dom.parentNode == this.contentDOM && !prev.emptyChildAt(1)) {
            fromOffset = domIndex(prev.dom) + 1;
            break;
          }
          from4 -= prev.size;
        }
        if (fromOffset == -1) {
          fromOffset = 0;
        }
      }
      if (fromOffset > -1 && (end3 > to || i == this.children.length - 1)) {
        to = end3;
        for (var j$1 = i + 1; j$1 < this.children.length; j$1++) {
          var next = this.children[j$1];
          if (next.size && next.dom.parentNode == this.contentDOM && !next.emptyChildAt(-1)) {
            toOffset = domIndex(next.dom);
            break;
          }
          to += next.size;
        }
        if (toOffset == -1) {
          toOffset = this.contentDOM.childNodes.length;
        }
        break;
      }
      offset3 = end3;
    }
    return { node: this.contentDOM, from: from4, to, fromOffset, toOffset };
  };
  ViewDesc.prototype.emptyChildAt = function emptyChildAt(side) {
    if (this.border || !this.contentDOM || !this.children.length) {
      return false;
    }
    var child3 = this.children[side < 0 ? 0 : this.children.length - 1];
    return child3.size == 0 || child3.emptyChildAt(side);
  };
  ViewDesc.prototype.domAfterPos = function domAfterPos(pos) {
    var ref = this.domFromPos(pos, 0);
    var node4 = ref.node;
    var offset3 = ref.offset;
    if (node4.nodeType != 1 || offset3 == node4.childNodes.length) {
      throw new RangeError("No node after pos " + pos);
    }
    return node4.childNodes[offset3];
  };
  ViewDesc.prototype.setSelection = function setSelection(anchor, head, root, force) {
    var from4 = Math.min(anchor, head), to = Math.max(anchor, head);
    for (var i = 0, offset3 = 0; i < this.children.length; i++) {
      var child3 = this.children[i], end3 = offset3 + child3.size;
      if (from4 > offset3 && to < end3) {
        return child3.setSelection(anchor - offset3 - child3.border, head - offset3 - child3.border, root, force);
      }
      offset3 = end3;
    }
    var anchorDOM = this.domFromPos(anchor, anchor ? -1 : 1);
    var headDOM = head == anchor ? anchorDOM : this.domFromPos(head, head ? -1 : 1);
    var domSel = root.getSelection();
    var brKludge = false;
    if ((result.gecko || result.safari) && anchor == head) {
      var node4 = anchorDOM.node;
      var offset$1 = anchorDOM.offset;
      if (node4.nodeType == 3) {
        brKludge = offset$1 && node4.nodeValue[offset$1 - 1] == "\n";
        if (brKludge && offset$1 == node4.nodeValue.length) {
          for (var scan = node4, after2 = void 0; scan; scan = scan.parentNode) {
            if (after2 = scan.nextSibling) {
              if (after2.nodeName == "BR") {
                anchorDOM = headDOM = { node: after2.parentNode, offset: domIndex(after2) + 1 };
              }
              break;
            }
            var desc = scan.pmViewDesc;
            if (desc && desc.node && desc.node.isBlock) {
              break;
            }
          }
        }
      } else {
        var prev = node4.childNodes[offset$1 - 1];
        brKludge = prev && (prev.nodeName == "BR" || prev.contentEditable == "false");
      }
    }
    if (result.gecko && domSel.focusNode && domSel.focusNode != headDOM.node && domSel.focusNode.nodeType == 1) {
      var after$1 = domSel.focusNode.childNodes[domSel.focusOffset];
      if (after$1 && after$1.contentEditable == "false") {
        force = true;
      }
    }
    if (!(force || brKludge && result.safari) && isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset) && isEquivalentPosition(headDOM.node, headDOM.offset, domSel.focusNode, domSel.focusOffset)) {
      return;
    }
    var domSelExtended = false;
    if ((domSel.extend || anchor == head) && !brKludge) {
      domSel.collapse(anchorDOM.node, anchorDOM.offset);
      try {
        if (anchor != head) {
          domSel.extend(headDOM.node, headDOM.offset);
        }
        domSelExtended = true;
      } catch (err2) {
        if (!(err2 instanceof DOMException)) {
          throw err2;
        }
      }
    }
    if (!domSelExtended) {
      if (anchor > head) {
        var tmp = anchorDOM;
        anchorDOM = headDOM;
        headDOM = tmp;
      }
      var range = document.createRange();
      range.setEnd(headDOM.node, headDOM.offset);
      range.setStart(anchorDOM.node, anchorDOM.offset);
      domSel.removeAllRanges();
      domSel.addRange(range);
    }
  };
  ViewDesc.prototype.ignoreMutation = function ignoreMutation(mutation) {
    return !this.contentDOM && mutation.type != "selection";
  };
  prototypeAccessors4.contentLost.get = function() {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
  };
  ViewDesc.prototype.markDirty = function markDirty(from4, to) {
    for (var offset3 = 0, i = 0; i < this.children.length; i++) {
      var child3 = this.children[i], end3 = offset3 + child3.size;
      if (offset3 == end3 ? from4 <= end3 && to >= offset3 : from4 < end3 && to > offset3) {
        var startInside = offset3 + child3.border, endInside = end3 - child3.border;
        if (from4 >= startInside && to <= endInside) {
          this.dirty = from4 == offset3 || to == end3 ? CONTENT_DIRTY : CHILD_DIRTY;
          if (from4 == startInside && to == endInside && (child3.contentLost || child3.dom.parentNode != this.contentDOM)) {
            child3.dirty = NODE_DIRTY;
          } else {
            child3.markDirty(from4 - startInside, to - startInside);
          }
          return;
        } else {
          child3.dirty = child3.dom == child3.contentDOM && child3.dom.parentNode == this.contentDOM && !child3.children.length ? CONTENT_DIRTY : NODE_DIRTY;
        }
      }
      offset3 = end3;
    }
    this.dirty = CONTENT_DIRTY;
  };
  ViewDesc.prototype.markParentsDirty = function markParentsDirty() {
    var level = 1;
    for (var node4 = this.parent; node4; node4 = node4.parent, level++) {
      var dirty = level == 1 ? CONTENT_DIRTY : CHILD_DIRTY;
      if (node4.dirty < dirty) {
        node4.dirty = dirty;
      }
    }
  };
  prototypeAccessors4.domAtom.get = function() {
    return false;
  };
  prototypeAccessors4.ignoreForCoords.get = function() {
    return false;
  };
  Object.defineProperties(ViewDesc.prototype, prototypeAccessors4);
  var nothing = [];
  var WidgetViewDesc = /* @__PURE__ */ function(ViewDesc3) {
    function WidgetViewDesc2(parent, widget2, view, pos) {
      var self2, dom = widget2.type.toDOM;
      if (typeof dom == "function") {
        dom = dom(view, function() {
          if (!self2) {
            return pos;
          }
          if (self2.parent) {
            return self2.parent.posBeforeChild(self2);
          }
        });
      }
      if (!widget2.type.spec.raw) {
        if (dom.nodeType != 1) {
          var wrap = document.createElement("span");
          wrap.appendChild(dom);
          dom = wrap;
        }
        dom.contentEditable = false;
        dom.classList.add("ProseMirror-widget");
      }
      ViewDesc3.call(this, parent, nothing, dom, null);
      this.widget = widget2;
      self2 = this;
    }
    if (ViewDesc3)
      WidgetViewDesc2.__proto__ = ViewDesc3;
    WidgetViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
    WidgetViewDesc2.prototype.constructor = WidgetViewDesc2;
    var prototypeAccessors$15 = { domAtom: { configurable: true } };
    WidgetViewDesc2.prototype.matchesWidget = function matchesWidget2(widget2) {
      return this.dirty == NOT_DIRTY && widget2.type.eq(this.widget.type);
    };
    WidgetViewDesc2.prototype.parseRule = function parseRule2() {
      return { ignore: true };
    };
    WidgetViewDesc2.prototype.stopEvent = function stopEvent2(event) {
      var stop2 = this.widget.spec.stopEvent;
      return stop2 ? stop2(event) : false;
    };
    WidgetViewDesc2.prototype.ignoreMutation = function ignoreMutation2(mutation) {
      return mutation.type != "selection" || this.widget.spec.ignoreSelection;
    };
    WidgetViewDesc2.prototype.destroy = function destroy5() {
      this.widget.type.destroy(this.dom);
      ViewDesc3.prototype.destroy.call(this);
    };
    prototypeAccessors$15.domAtom.get = function() {
      return true;
    };
    Object.defineProperties(WidgetViewDesc2.prototype, prototypeAccessors$15);
    return WidgetViewDesc2;
  }(ViewDesc);
  var CompositionViewDesc = /* @__PURE__ */ function(ViewDesc3) {
    function CompositionViewDesc2(parent, dom, textDOM, text2) {
      ViewDesc3.call(this, parent, nothing, dom, null);
      this.textDOM = textDOM;
      this.text = text2;
    }
    if (ViewDesc3)
      CompositionViewDesc2.__proto__ = ViewDesc3;
    CompositionViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
    CompositionViewDesc2.prototype.constructor = CompositionViewDesc2;
    var prototypeAccessors$23 = { size: { configurable: true } };
    prototypeAccessors$23.size.get = function() {
      return this.text.length;
    };
    CompositionViewDesc2.prototype.localPosFromDOM = function localPosFromDOM2(dom, offset3) {
      if (dom != this.textDOM) {
        return this.posAtStart + (offset3 ? this.size : 0);
      }
      return this.posAtStart + offset3;
    };
    CompositionViewDesc2.prototype.domFromPos = function domFromPos2(pos) {
      return { node: this.textDOM, offset: pos };
    };
    CompositionViewDesc2.prototype.ignoreMutation = function ignoreMutation2(mut) {
      return mut.type === "characterData" && mut.target.nodeValue == mut.oldValue;
    };
    Object.defineProperties(CompositionViewDesc2.prototype, prototypeAccessors$23);
    return CompositionViewDesc2;
  }(ViewDesc);
  var MarkViewDesc = /* @__PURE__ */ function(ViewDesc3) {
    function MarkViewDesc2(parent, mark3, dom, contentDOM) {
      ViewDesc3.call(this, parent, [], dom, contentDOM);
      this.mark = mark3;
    }
    if (ViewDesc3)
      MarkViewDesc2.__proto__ = ViewDesc3;
    MarkViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
    MarkViewDesc2.prototype.constructor = MarkViewDesc2;
    MarkViewDesc2.create = function create5(parent, mark3, inline2, view) {
      var custom = view.nodeViews[mark3.type.name];
      var spec = custom && custom(mark3, view, inline2);
      if (!spec || !spec.dom) {
        spec = DOMSerializer.renderSpec(document, mark3.type.spec.toDOM(mark3, inline2));
      }
      return new MarkViewDesc2(parent, mark3, spec.dom, spec.contentDOM || spec.dom);
    };
    MarkViewDesc2.prototype.parseRule = function parseRule2() {
      if (this.dirty & NODE_DIRTY || this.mark.type.spec.reparseInView) {
        return null;
      }
      return { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
    };
    MarkViewDesc2.prototype.matchesMark = function matchesMark2(mark3) {
      return this.dirty != NODE_DIRTY && this.mark.eq(mark3);
    };
    MarkViewDesc2.prototype.markDirty = function markDirty2(from4, to) {
      ViewDesc3.prototype.markDirty.call(this, from4, to);
      if (this.dirty != NOT_DIRTY) {
        var parent = this.parent;
        while (!parent.node) {
          parent = parent.parent;
        }
        if (parent.dirty < this.dirty) {
          parent.dirty = this.dirty;
        }
        this.dirty = NOT_DIRTY;
      }
    };
    MarkViewDesc2.prototype.slice = function slice4(from4, to, view) {
      var copy5 = MarkViewDesc2.create(this.parent, this.mark, true, view);
      var nodes = this.children, size = this.size;
      if (to < size) {
        nodes = replaceNodes(nodes, to, size, view);
      }
      if (from4 > 0) {
        nodes = replaceNodes(nodes, 0, from4, view);
      }
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].parent = copy5;
      }
      copy5.children = nodes;
      return copy5;
    };
    return MarkViewDesc2;
  }(ViewDesc);
  var NodeViewDesc = /* @__PURE__ */ function(ViewDesc3) {
    function NodeViewDesc2(parent, node4, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, view, pos) {
      ViewDesc3.call(this, parent, node4.isLeaf ? nothing : [], dom, contentDOM);
      this.nodeDOM = nodeDOM2;
      this.node = node4;
      this.outerDeco = outerDeco;
      this.innerDeco = innerDeco;
      if (contentDOM) {
        this.updateChildren(view, pos);
      }
    }
    if (ViewDesc3)
      NodeViewDesc2.__proto__ = ViewDesc3;
    NodeViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
    NodeViewDesc2.prototype.constructor = NodeViewDesc2;
    var prototypeAccessors$32 = { size: { configurable: true }, border: { configurable: true }, domAtom: { configurable: true } };
    NodeViewDesc2.create = function create5(parent, node4, outerDeco, innerDeco, view, pos) {
      var assign;
      var custom = view.nodeViews[node4.type.name], descObj;
      var spec = custom && custom(node4, view, function() {
        if (!descObj) {
          return pos;
        }
        if (descObj.parent) {
          return descObj.parent.posBeforeChild(descObj);
        }
      }, outerDeco, innerDeco);
      var dom = spec && spec.dom, contentDOM = spec && spec.contentDOM;
      if (node4.isText) {
        if (!dom) {
          dom = document.createTextNode(node4.text);
        } else if (dom.nodeType != 3) {
          throw new RangeError("Text must be rendered as a DOM text node");
        }
      } else if (!dom) {
        assign = DOMSerializer.renderSpec(document, node4.type.spec.toDOM(node4)), dom = assign.dom, contentDOM = assign.contentDOM;
      }
      if (!contentDOM && !node4.isText && dom.nodeName != "BR") {
        if (!dom.hasAttribute("contenteditable")) {
          dom.contentEditable = false;
        }
        if (node4.type.spec.draggable) {
          dom.draggable = true;
        }
      }
      var nodeDOM2 = dom;
      dom = applyOuterDeco(dom, outerDeco, node4);
      if (spec) {
        return descObj = new CustomNodeViewDesc(parent, node4, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, spec, view, pos + 1);
      } else if (node4.isText) {
        return new TextViewDesc(parent, node4, outerDeco, innerDeco, dom, nodeDOM2, view);
      } else {
        return new NodeViewDesc2(parent, node4, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, view, pos + 1);
      }
    };
    NodeViewDesc2.prototype.parseRule = function parseRule2() {
      var this$1 = this;
      if (this.node.type.spec.reparseInView) {
        return null;
      }
      var rule = { node: this.node.type.name, attrs: this.node.attrs };
      if (this.node.type.whitespace == "pre") {
        rule.preserveWhitespace = "full";
      }
      if (this.contentDOM && !this.contentLost) {
        rule.contentElement = this.contentDOM;
      } else {
        rule.getContent = function() {
          return this$1.contentDOM ? Fragment.empty : this$1.node.content;
        };
      }
      return rule;
    };
    NodeViewDesc2.prototype.matchesNode = function matchesNode2(node4, outerDeco, innerDeco) {
      return this.dirty == NOT_DIRTY && node4.eq(this.node) && sameOuterDeco(outerDeco, this.outerDeco) && innerDeco.eq(this.innerDeco);
    };
    prototypeAccessors$32.size.get = function() {
      return this.node.nodeSize;
    };
    prototypeAccessors$32.border.get = function() {
      return this.node.isLeaf ? 0 : 1;
    };
    NodeViewDesc2.prototype.updateChildren = function updateChildren(view, pos) {
      var this$1 = this;
      var inline2 = this.node.inlineContent, off = pos;
      var composition = view.composing && this.localCompositionInfo(view, pos);
      var localComposition = composition && composition.pos > -1 ? composition : null;
      var compositionInChild = composition && composition.pos < 0;
      var updater = new ViewTreeUpdater(this, localComposition && localComposition.node);
      iterDeco(this.node, this.innerDeco, function(widget2, i, insideNode) {
        if (widget2.spec.marks) {
          updater.syncToMarks(widget2.spec.marks, inline2, view);
        } else if (widget2.type.side >= 0 && !insideNode) {
          updater.syncToMarks(i == this$1.node.childCount ? Mark.none : this$1.node.child(i).marks, inline2, view);
        }
        updater.placeWidget(widget2, view, off);
      }, function(child3, outerDeco, innerDeco, i) {
        updater.syncToMarks(child3.marks, inline2, view);
        var compIndex;
        if (updater.findNodeMatch(child3, outerDeco, innerDeco, i))
          ;
        else if (compositionInChild && view.state.selection.from > off && view.state.selection.to < off + child3.nodeSize && (compIndex = updater.findIndexWithChild(composition.node)) > -1 && updater.updateNodeAt(child3, outerDeco, innerDeco, compIndex, view))
          ;
        else if (updater.updateNextNode(child3, outerDeco, innerDeco, view, i))
          ;
        else {
          updater.addNode(child3, outerDeco, innerDeco, view, off);
        }
        off += child3.nodeSize;
      });
      updater.syncToMarks(nothing, inline2, view);
      if (this.node.isTextblock) {
        updater.addTextblockHacks();
      }
      updater.destroyRest();
      if (updater.changed || this.dirty == CONTENT_DIRTY) {
        if (localComposition) {
          this.protectLocalComposition(view, localComposition);
        }
        renderDescs(this.contentDOM, this.children, view);
        if (result.ios) {
          iosHacks(this.dom);
        }
      }
    };
    NodeViewDesc2.prototype.localCompositionInfo = function localCompositionInfo(view, pos) {
      var ref = view.state.selection;
      var from4 = ref.from;
      var to = ref.to;
      if (!(view.state.selection instanceof TextSelection) || from4 < pos || to > pos + this.node.content.size) {
        return;
      }
      var sel = view.root.getSelection();
      var textNode = nearbyTextNode(sel.focusNode, sel.focusOffset);
      if (!textNode || !this.dom.contains(textNode.parentNode)) {
        return;
      }
      if (this.node.inlineContent) {
        var text2 = textNode.nodeValue;
        var textPos = findTextInFragment(this.node.content, text2, from4 - pos, to - pos);
        return textPos < 0 ? null : { node: textNode, pos: textPos, text: text2 };
      } else {
        return { node: textNode, pos: -1 };
      }
    };
    NodeViewDesc2.prototype.protectLocalComposition = function protectLocalComposition(view, ref) {
      var node4 = ref.node;
      var pos = ref.pos;
      var text2 = ref.text;
      if (this.getDesc(node4)) {
        return;
      }
      var topNode = node4;
      for (; ; topNode = topNode.parentNode) {
        if (topNode.parentNode == this.contentDOM) {
          break;
        }
        while (topNode.previousSibling) {
          topNode.parentNode.removeChild(topNode.previousSibling);
        }
        while (topNode.nextSibling) {
          topNode.parentNode.removeChild(topNode.nextSibling);
        }
        if (topNode.pmViewDesc) {
          topNode.pmViewDesc = null;
        }
      }
      var desc = new CompositionViewDesc(this, topNode, node4, text2);
      view.compositionNodes.push(desc);
      this.children = replaceNodes(this.children, pos, pos + text2.length, view, desc);
    };
    NodeViewDesc2.prototype.update = function update3(node4, outerDeco, innerDeco, view) {
      if (this.dirty == NODE_DIRTY || !node4.sameMarkup(this.node)) {
        return false;
      }
      this.updateInner(node4, outerDeco, innerDeco, view);
      return true;
    };
    NodeViewDesc2.prototype.updateInner = function updateInner(node4, outerDeco, innerDeco, view) {
      this.updateOuterDeco(outerDeco);
      this.node = node4;
      this.innerDeco = innerDeco;
      if (this.contentDOM) {
        this.updateChildren(view, this.posAtStart);
      }
      this.dirty = NOT_DIRTY;
    };
    NodeViewDesc2.prototype.updateOuterDeco = function updateOuterDeco(outerDeco) {
      if (sameOuterDeco(outerDeco, this.outerDeco)) {
        return;
      }
      var needsWrap = this.nodeDOM.nodeType != 1;
      var oldDOM = this.dom;
      this.dom = patchOuterDeco(this.dom, this.nodeDOM, computeOuterDeco(this.outerDeco, this.node, needsWrap), computeOuterDeco(outerDeco, this.node, needsWrap));
      if (this.dom != oldDOM) {
        oldDOM.pmViewDesc = null;
        this.dom.pmViewDesc = this;
      }
      this.outerDeco = outerDeco;
    };
    NodeViewDesc2.prototype.selectNode = function selectNode() {
      this.nodeDOM.classList.add("ProseMirror-selectednode");
      if (this.contentDOM || !this.node.type.spec.draggable) {
        this.dom.draggable = true;
      }
    };
    NodeViewDesc2.prototype.deselectNode = function deselectNode() {
      this.nodeDOM.classList.remove("ProseMirror-selectednode");
      if (this.contentDOM || !this.node.type.spec.draggable) {
        this.dom.removeAttribute("draggable");
      }
    };
    prototypeAccessors$32.domAtom.get = function() {
      return this.node.isAtom;
    };
    Object.defineProperties(NodeViewDesc2.prototype, prototypeAccessors$32);
    return NodeViewDesc2;
  }(ViewDesc);
  function docViewDesc(doc2, outerDeco, innerDeco, dom, view) {
    applyOuterDeco(dom, outerDeco, doc2);
    return new NodeViewDesc(null, doc2, outerDeco, innerDeco, dom, dom, dom, view, 0);
  }
  var TextViewDesc = /* @__PURE__ */ function(NodeViewDesc2) {
    function TextViewDesc2(parent, node4, outerDeco, innerDeco, dom, nodeDOM2, view) {
      NodeViewDesc2.call(this, parent, node4, outerDeco, innerDeco, dom, null, nodeDOM2, view);
    }
    if (NodeViewDesc2)
      TextViewDesc2.__proto__ = NodeViewDesc2;
    TextViewDesc2.prototype = Object.create(NodeViewDesc2 && NodeViewDesc2.prototype);
    TextViewDesc2.prototype.constructor = TextViewDesc2;
    var prototypeAccessors$42 = { domAtom: { configurable: true } };
    TextViewDesc2.prototype.parseRule = function parseRule2() {
      var skip = this.nodeDOM.parentNode;
      while (skip && skip != this.dom && !skip.pmIsDeco) {
        skip = skip.parentNode;
      }
      return { skip: skip || true };
    };
    TextViewDesc2.prototype.update = function update3(node4, outerDeco, _, view) {
      if (this.dirty == NODE_DIRTY || this.dirty != NOT_DIRTY && !this.inParent() || !node4.sameMarkup(this.node)) {
        return false;
      }
      this.updateOuterDeco(outerDeco);
      if ((this.dirty != NOT_DIRTY || node4.text != this.node.text) && node4.text != this.nodeDOM.nodeValue) {
        this.nodeDOM.nodeValue = node4.text;
        if (view.trackWrites == this.nodeDOM) {
          view.trackWrites = null;
        }
      }
      this.node = node4;
      this.dirty = NOT_DIRTY;
      return true;
    };
    TextViewDesc2.prototype.inParent = function inParent() {
      var parentDOM = this.parent.contentDOM;
      for (var n = this.nodeDOM; n; n = n.parentNode) {
        if (n == parentDOM) {
          return true;
        }
      }
      return false;
    };
    TextViewDesc2.prototype.domFromPos = function domFromPos2(pos) {
      return { node: this.nodeDOM, offset: pos };
    };
    TextViewDesc2.prototype.localPosFromDOM = function localPosFromDOM2(dom, offset3, bias) {
      if (dom == this.nodeDOM) {
        return this.posAtStart + Math.min(offset3, this.node.text.length);
      }
      return NodeViewDesc2.prototype.localPosFromDOM.call(this, dom, offset3, bias);
    };
    TextViewDesc2.prototype.ignoreMutation = function ignoreMutation2(mutation) {
      return mutation.type != "characterData" && mutation.type != "selection";
    };
    TextViewDesc2.prototype.slice = function slice4(from4, to, view) {
      var node4 = this.node.cut(from4, to), dom = document.createTextNode(node4.text);
      return new TextViewDesc2(this.parent, node4, this.outerDeco, this.innerDeco, dom, dom, view);
    };
    TextViewDesc2.prototype.markDirty = function markDirty2(from4, to) {
      NodeViewDesc2.prototype.markDirty.call(this, from4, to);
      if (this.dom != this.nodeDOM && (from4 == 0 || to == this.nodeDOM.nodeValue.length)) {
        this.dirty = NODE_DIRTY;
      }
    };
    prototypeAccessors$42.domAtom.get = function() {
      return false;
    };
    Object.defineProperties(TextViewDesc2.prototype, prototypeAccessors$42);
    return TextViewDesc2;
  }(NodeViewDesc);
  var TrailingHackViewDesc = /* @__PURE__ */ function(ViewDesc3) {
    function TrailingHackViewDesc2() {
      ViewDesc3.apply(this, arguments);
    }
    if (ViewDesc3)
      TrailingHackViewDesc2.__proto__ = ViewDesc3;
    TrailingHackViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
    TrailingHackViewDesc2.prototype.constructor = TrailingHackViewDesc2;
    var prototypeAccessors$52 = { domAtom: { configurable: true }, ignoreForCoords: { configurable: true } };
    TrailingHackViewDesc2.prototype.parseRule = function parseRule2() {
      return { ignore: true };
    };
    TrailingHackViewDesc2.prototype.matchesHack = function matchesHack2(nodeName) {
      return this.dirty == NOT_DIRTY && this.dom.nodeName == nodeName;
    };
    prototypeAccessors$52.domAtom.get = function() {
      return true;
    };
    prototypeAccessors$52.ignoreForCoords.get = function() {
      return this.dom.nodeName == "IMG";
    };
    Object.defineProperties(TrailingHackViewDesc2.prototype, prototypeAccessors$52);
    return TrailingHackViewDesc2;
  }(ViewDesc);
  var CustomNodeViewDesc = /* @__PURE__ */ function(NodeViewDesc2) {
    function CustomNodeViewDesc2(parent, node4, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, spec, view, pos) {
      NodeViewDesc2.call(this, parent, node4, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, view, pos);
      this.spec = spec;
    }
    if (NodeViewDesc2)
      CustomNodeViewDesc2.__proto__ = NodeViewDesc2;
    CustomNodeViewDesc2.prototype = Object.create(NodeViewDesc2 && NodeViewDesc2.prototype);
    CustomNodeViewDesc2.prototype.constructor = CustomNodeViewDesc2;
    CustomNodeViewDesc2.prototype.update = function update3(node4, outerDeco, innerDeco, view) {
      if (this.dirty == NODE_DIRTY) {
        return false;
      }
      if (this.spec.update) {
        var result2 = this.spec.update(node4, outerDeco, innerDeco);
        if (result2) {
          this.updateInner(node4, outerDeco, innerDeco, view);
        }
        return result2;
      } else if (!this.contentDOM && !node4.isLeaf) {
        return false;
      } else {
        return NodeViewDesc2.prototype.update.call(this, node4, outerDeco, innerDeco, view);
      }
    };
    CustomNodeViewDesc2.prototype.selectNode = function selectNode() {
      this.spec.selectNode ? this.spec.selectNode() : NodeViewDesc2.prototype.selectNode.call(this);
    };
    CustomNodeViewDesc2.prototype.deselectNode = function deselectNode() {
      this.spec.deselectNode ? this.spec.deselectNode() : NodeViewDesc2.prototype.deselectNode.call(this);
    };
    CustomNodeViewDesc2.prototype.setSelection = function setSelection2(anchor, head, root, force) {
      this.spec.setSelection ? this.spec.setSelection(anchor, head, root) : NodeViewDesc2.prototype.setSelection.call(this, anchor, head, root, force);
    };
    CustomNodeViewDesc2.prototype.destroy = function destroy5() {
      if (this.spec.destroy) {
        this.spec.destroy();
      }
      NodeViewDesc2.prototype.destroy.call(this);
    };
    CustomNodeViewDesc2.prototype.stopEvent = function stopEvent2(event) {
      return this.spec.stopEvent ? this.spec.stopEvent(event) : false;
    };
    CustomNodeViewDesc2.prototype.ignoreMutation = function ignoreMutation2(mutation) {
      return this.spec.ignoreMutation ? this.spec.ignoreMutation(mutation) : NodeViewDesc2.prototype.ignoreMutation.call(this, mutation);
    };
    return CustomNodeViewDesc2;
  }(NodeViewDesc);
  function renderDescs(parentDOM, descs, view) {
    var dom = parentDOM.firstChild, written = false;
    for (var i = 0; i < descs.length; i++) {
      var desc = descs[i], childDOM = desc.dom;
      if (childDOM.parentNode == parentDOM) {
        while (childDOM != dom) {
          dom = rm(dom);
          written = true;
        }
        dom = dom.nextSibling;
      } else {
        written = true;
        parentDOM.insertBefore(childDOM, dom);
      }
      if (desc instanceof MarkViewDesc) {
        var pos = dom ? dom.previousSibling : parentDOM.lastChild;
        renderDescs(desc.contentDOM, desc.children, view);
        dom = pos ? pos.nextSibling : parentDOM.firstChild;
      }
    }
    while (dom) {
      dom = rm(dom);
      written = true;
    }
    if (written && view.trackWrites == parentDOM) {
      view.trackWrites = null;
    }
  }
  function OuterDecoLevel(nodeName) {
    if (nodeName) {
      this.nodeName = nodeName;
    }
  }
  OuterDecoLevel.prototype = /* @__PURE__ */ Object.create(null);
  var noDeco = [new OuterDecoLevel()];
  function computeOuterDeco(outerDeco, node4, needsWrap) {
    if (outerDeco.length == 0) {
      return noDeco;
    }
    var top2 = needsWrap ? noDeco[0] : new OuterDecoLevel(), result2 = [top2];
    for (var i = 0; i < outerDeco.length; i++) {
      var attrs = outerDeco[i].type.attrs;
      if (!attrs) {
        continue;
      }
      if (attrs.nodeName) {
        result2.push(top2 = new OuterDecoLevel(attrs.nodeName));
      }
      for (var name in attrs) {
        var val = attrs[name];
        if (val == null) {
          continue;
        }
        if (needsWrap && result2.length == 1) {
          result2.push(top2 = new OuterDecoLevel(node4.isInline ? "span" : "div"));
        }
        if (name == "class") {
          top2.class = (top2.class ? top2.class + " " : "") + val;
        } else if (name == "style") {
          top2.style = (top2.style ? top2.style + ";" : "") + val;
        } else if (name != "nodeName") {
          top2[name] = val;
        }
      }
    }
    return result2;
  }
  function patchOuterDeco(outerDOM, nodeDOM2, prevComputed, curComputed) {
    if (prevComputed == noDeco && curComputed == noDeco) {
      return nodeDOM2;
    }
    var curDOM = nodeDOM2;
    for (var i = 0; i < curComputed.length; i++) {
      var deco = curComputed[i], prev = prevComputed[i];
      if (i) {
        var parent = void 0;
        if (prev && prev.nodeName == deco.nodeName && curDOM != outerDOM && (parent = curDOM.parentNode) && parent.tagName.toLowerCase() == deco.nodeName) {
          curDOM = parent;
        } else {
          parent = document.createElement(deco.nodeName);
          parent.pmIsDeco = true;
          parent.appendChild(curDOM);
          prev = noDeco[0];
          curDOM = parent;
        }
      }
      patchAttributes(curDOM, prev || noDeco[0], deco);
    }
    return curDOM;
  }
  function patchAttributes(dom, prev, cur) {
    for (var name in prev) {
      if (name != "class" && name != "style" && name != "nodeName" && !(name in cur)) {
        dom.removeAttribute(name);
      }
    }
    for (var name$1 in cur) {
      if (name$1 != "class" && name$1 != "style" && name$1 != "nodeName" && cur[name$1] != prev[name$1]) {
        dom.setAttribute(name$1, cur[name$1]);
      }
    }
    if (prev.class != cur.class) {
      var prevList = prev.class ? prev.class.split(" ").filter(Boolean) : nothing;
      var curList = cur.class ? cur.class.split(" ").filter(Boolean) : nothing;
      for (var i = 0; i < prevList.length; i++) {
        if (curList.indexOf(prevList[i]) == -1) {
          dom.classList.remove(prevList[i]);
        }
      }
      for (var i$1 = 0; i$1 < curList.length; i$1++) {
        if (prevList.indexOf(curList[i$1]) == -1) {
          dom.classList.add(curList[i$1]);
        }
      }
      if (dom.classList.length == 0) {
        dom.removeAttribute("class");
      }
    }
    if (prev.style != cur.style) {
      if (prev.style) {
        var prop = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, m;
        while (m = prop.exec(prev.style)) {
          dom.style.removeProperty(m[1]);
        }
      }
      if (cur.style) {
        dom.style.cssText += cur.style;
      }
    }
  }
  function applyOuterDeco(dom, deco, node4) {
    return patchOuterDeco(dom, dom, noDeco, computeOuterDeco(deco, node4, dom.nodeType != 1));
  }
  function sameOuterDeco(a, b) {
    if (a.length != b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i++) {
      if (!a[i].type.eq(b[i].type)) {
        return false;
      }
    }
    return true;
  }
  function rm(dom) {
    var next = dom.nextSibling;
    dom.parentNode.removeChild(dom);
    return next;
  }
  var ViewTreeUpdater = function ViewTreeUpdater2(top2, lockedNode) {
    this.top = top2;
    this.lock = lockedNode;
    this.index = 0;
    this.stack = [];
    this.changed = false;
    this.preMatch = preMatch(top2.node.content, top2);
  };
  ViewTreeUpdater.prototype.destroyBetween = function destroyBetween(start5, end3) {
    if (start5 == end3) {
      return;
    }
    for (var i = start5; i < end3; i++) {
      this.top.children[i].destroy();
    }
    this.top.children.splice(start5, end3 - start5);
    this.changed = true;
  };
  ViewTreeUpdater.prototype.destroyRest = function destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  };
  ViewTreeUpdater.prototype.syncToMarks = function syncToMarks(marks2, inline2, view) {
    var keep = 0, depth = this.stack.length >> 1;
    var maxKeep = Math.min(depth, marks2.length);
    while (keep < maxKeep && (keep == depth - 1 ? this.top : this.stack[keep + 1 << 1]).matchesMark(marks2[keep]) && marks2[keep].type.spec.spanning !== false) {
      keep++;
    }
    while (keep < depth) {
      this.destroyRest();
      this.top.dirty = NOT_DIRTY;
      this.index = this.stack.pop();
      this.top = this.stack.pop();
      depth--;
    }
    while (depth < marks2.length) {
      this.stack.push(this.top, this.index + 1);
      var found2 = -1;
      for (var i = this.index; i < Math.min(this.index + 3, this.top.children.length); i++) {
        if (this.top.children[i].matchesMark(marks2[depth])) {
          found2 = i;
          break;
        }
      }
      if (found2 > -1) {
        if (found2 > this.index) {
          this.changed = true;
          this.destroyBetween(this.index, found2);
        }
        this.top = this.top.children[this.index];
      } else {
        var markDesc = MarkViewDesc.create(this.top, marks2[depth], inline2, view);
        this.top.children.splice(this.index, 0, markDesc);
        this.top = markDesc;
        this.changed = true;
      }
      this.index = 0;
      depth++;
    }
  };
  ViewTreeUpdater.prototype.findNodeMatch = function findNodeMatch(node4, outerDeco, innerDeco, index2) {
    var found2 = -1, targetDesc;
    if (index2 >= this.preMatch.index && (targetDesc = this.preMatch.matches[index2 - this.preMatch.index]).parent == this.top && targetDesc.matchesNode(node4, outerDeco, innerDeco)) {
      found2 = this.top.children.indexOf(targetDesc, this.index);
    } else {
      for (var i = this.index, e = Math.min(this.top.children.length, i + 5); i < e; i++) {
        var child3 = this.top.children[i];
        if (child3.matchesNode(node4, outerDeco, innerDeco) && !this.preMatch.matched.has(child3)) {
          found2 = i;
          break;
        }
      }
    }
    if (found2 < 0) {
      return false;
    }
    this.destroyBetween(this.index, found2);
    this.index++;
    return true;
  };
  ViewTreeUpdater.prototype.updateNodeAt = function updateNodeAt(node4, outerDeco, innerDeco, index2, view) {
    var child3 = this.top.children[index2];
    if (!child3.update(node4, outerDeco, innerDeco, view)) {
      return false;
    }
    this.destroyBetween(this.index, index2);
    this.index = index2 + 1;
    return true;
  };
  ViewTreeUpdater.prototype.findIndexWithChild = function findIndexWithChild(domNode) {
    for (; ; ) {
      var parent = domNode.parentNode;
      if (!parent) {
        return -1;
      }
      if (parent == this.top.contentDOM) {
        var desc = domNode.pmViewDesc;
        if (desc) {
          for (var i = this.index; i < this.top.children.length; i++) {
            if (this.top.children[i] == desc) {
              return i;
            }
          }
        }
        return -1;
      }
      domNode = parent;
    }
  };
  ViewTreeUpdater.prototype.updateNextNode = function updateNextNode(node4, outerDeco, innerDeco, view, index2) {
    for (var i = this.index; i < this.top.children.length; i++) {
      var next = this.top.children[i];
      if (next instanceof NodeViewDesc) {
        var preMatch2 = this.preMatch.matched.get(next);
        if (preMatch2 != null && preMatch2 != index2) {
          return false;
        }
        var nextDOM = next.dom;
        var locked = this.lock && (nextDOM == this.lock || nextDOM.nodeType == 1 && nextDOM.contains(this.lock.parentNode)) && !(node4.isText && next.node && next.node.isText && next.nodeDOM.nodeValue == node4.text && next.dirty != NODE_DIRTY && sameOuterDeco(outerDeco, next.outerDeco));
        if (!locked && next.update(node4, outerDeco, innerDeco, view)) {
          this.destroyBetween(this.index, i);
          if (next.dom != nextDOM) {
            this.changed = true;
          }
          this.index++;
          return true;
        }
        break;
      }
    }
    return false;
  };
  ViewTreeUpdater.prototype.addNode = function addNode2(node4, outerDeco, innerDeco, view, pos) {
    this.top.children.splice(this.index++, 0, NodeViewDesc.create(this.top, node4, outerDeco, innerDeco, view, pos));
    this.changed = true;
  };
  ViewTreeUpdater.prototype.placeWidget = function placeWidget(widget2, view, pos) {
    var next = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (next && next.matchesWidget(widget2) && (widget2 == next.widget || !next.widget.type.toDOM.parentNode)) {
      this.index++;
    } else {
      var desc = new WidgetViewDesc(this.top, widget2, view, pos);
      this.top.children.splice(this.index++, 0, desc);
      this.changed = true;
    }
  };
  ViewTreeUpdater.prototype.addTextblockHacks = function addTextblockHacks() {
    var lastChild = this.top.children[this.index - 1];
    while (lastChild instanceof MarkViewDesc) {
      lastChild = lastChild.children[lastChild.children.length - 1];
    }
    if (!lastChild || !(lastChild instanceof TextViewDesc) || /\n$/.test(lastChild.node.text)) {
      if ((result.safari || result.chrome) && lastChild && lastChild.dom.contentEditable == "false") {
        this.addHackNode("IMG");
      }
      this.addHackNode("BR");
    }
  };
  ViewTreeUpdater.prototype.addHackNode = function addHackNode(nodeName) {
    if (this.index < this.top.children.length && this.top.children[this.index].matchesHack(nodeName)) {
      this.index++;
    } else {
      var dom = document.createElement(nodeName);
      if (nodeName == "IMG") {
        dom.className = "ProseMirror-separator";
        dom.alt = "";
      }
      if (nodeName == "BR") {
        dom.className = "ProseMirror-trailingBreak";
      }
      this.top.children.splice(this.index++, 0, new TrailingHackViewDesc(this.top, nothing, dom, null));
      this.changed = true;
    }
  };
  function preMatch(frag, parentDesc) {
    var curDesc = parentDesc, descI = curDesc.children.length;
    var fI = frag.childCount, matched = /* @__PURE__ */ new Map(), matches2 = [];
    outer:
      while (fI > 0) {
        var desc = void 0;
        for (; ; ) {
          if (descI) {
            var next = curDesc.children[descI - 1];
            if (next instanceof MarkViewDesc) {
              curDesc = next;
              descI = next.children.length;
            } else {
              desc = next;
              descI--;
              break;
            }
          } else if (curDesc == parentDesc) {
            break outer;
          } else {
            descI = curDesc.parent.children.indexOf(curDesc);
            curDesc = curDesc.parent;
          }
        }
        var node4 = desc.node;
        if (!node4) {
          continue;
        }
        if (node4 != frag.child(fI - 1)) {
          break;
        }
        --fI;
        matched.set(desc, fI);
        matches2.push(desc);
      }
    return { index: fI, matched, matches: matches2.reverse() };
  }
  function compareSide(a, b) {
    return a.type.side - b.type.side;
  }
  function iterDeco(parent, deco, onWidget, onNode) {
    var locals3 = deco.locals(parent), offset3 = 0;
    if (locals3.length == 0) {
      for (var i = 0; i < parent.childCount; i++) {
        var child3 = parent.child(i);
        onNode(child3, locals3, deco.forChild(offset3, child3), i);
        offset3 += child3.nodeSize;
      }
      return;
    }
    var decoIndex = 0, active = [], restNode = null;
    for (var parentIndex = 0; ; ) {
      if (decoIndex < locals3.length && locals3[decoIndex].to == offset3) {
        var widget2 = locals3[decoIndex++], widgets = void 0;
        while (decoIndex < locals3.length && locals3[decoIndex].to == offset3) {
          (widgets || (widgets = [widget2])).push(locals3[decoIndex++]);
        }
        if (widgets) {
          widgets.sort(compareSide);
          for (var i$1 = 0; i$1 < widgets.length; i$1++) {
            onWidget(widgets[i$1], parentIndex, !!restNode);
          }
        } else {
          onWidget(widget2, parentIndex, !!restNode);
        }
      }
      var child$1 = void 0, index2 = void 0;
      if (restNode) {
        index2 = -1;
        child$1 = restNode;
        restNode = null;
      } else if (parentIndex < parent.childCount) {
        index2 = parentIndex;
        child$1 = parent.child(parentIndex++);
      } else {
        break;
      }
      for (var i$2 = 0; i$2 < active.length; i$2++) {
        if (active[i$2].to <= offset3) {
          active.splice(i$2--, 1);
        }
      }
      while (decoIndex < locals3.length && locals3[decoIndex].from <= offset3 && locals3[decoIndex].to > offset3) {
        active.push(locals3[decoIndex++]);
      }
      var end3 = offset3 + child$1.nodeSize;
      if (child$1.isText) {
        var cutAt = end3;
        if (decoIndex < locals3.length && locals3[decoIndex].from < cutAt) {
          cutAt = locals3[decoIndex].from;
        }
        for (var i$3 = 0; i$3 < active.length; i$3++) {
          if (active[i$3].to < cutAt) {
            cutAt = active[i$3].to;
          }
        }
        if (cutAt < end3) {
          restNode = child$1.cut(cutAt - offset3);
          child$1 = child$1.cut(0, cutAt - offset3);
          end3 = cutAt;
          index2 = -1;
        }
      }
      var outerDeco = !active.length ? nothing : child$1.isInline && !child$1.isLeaf ? active.filter(function(d) {
        return !d.inline;
      }) : active.slice();
      onNode(child$1, outerDeco, deco.forChild(offset3, child$1), index2);
      offset3 = end3;
    }
  }
  function iosHacks(dom) {
    if (dom.nodeName == "UL" || dom.nodeName == "OL") {
      var oldCSS = dom.style.cssText;
      dom.style.cssText = oldCSS + "; list-style: square !important";
      window.getComputedStyle(dom).listStyle;
      dom.style.cssText = oldCSS;
    }
  }
  function nearbyTextNode(node4, offset3) {
    for (; ; ) {
      if (node4.nodeType == 3) {
        return node4;
      }
      if (node4.nodeType == 1 && offset3 > 0) {
        if (node4.childNodes.length > offset3 && node4.childNodes[offset3].nodeType == 3) {
          return node4.childNodes[offset3];
        }
        node4 = node4.childNodes[offset3 - 1];
        offset3 = nodeSize(node4);
      } else if (node4.nodeType == 1 && offset3 < node4.childNodes.length) {
        node4 = node4.childNodes[offset3];
        offset3 = 0;
      } else {
        return null;
      }
    }
  }
  function findTextInFragment(frag, text2, from4, to) {
    for (var i = 0, pos = 0; i < frag.childCount && pos <= to; ) {
      var child3 = frag.child(i++), childStart = pos;
      pos += child3.nodeSize;
      if (!child3.isText) {
        continue;
      }
      var str = child3.text;
      while (i < frag.childCount) {
        var next = frag.child(i++);
        pos += next.nodeSize;
        if (!next.isText) {
          break;
        }
        str += next.text;
      }
      if (pos >= from4) {
        var found2 = childStart < to ? str.lastIndexOf(text2, to - childStart - 1) : -1;
        if (found2 >= 0 && found2 + text2.length + childStart >= from4) {
          return childStart + found2;
        }
        if (from4 == to && str.length >= to + text2.length - childStart && str.slice(to - childStart, to - childStart + text2.length) == text2) {
          return to;
        }
      }
    }
    return -1;
  }
  function replaceNodes(nodes, from4, to, view, replacement) {
    var result2 = [];
    for (var i = 0, off = 0; i < nodes.length; i++) {
      var child3 = nodes[i], start5 = off, end3 = off += child3.size;
      if (start5 >= to || end3 <= from4) {
        result2.push(child3);
      } else {
        if (start5 < from4) {
          result2.push(child3.slice(0, from4 - start5, view));
        }
        if (replacement) {
          result2.push(replacement);
          replacement = null;
        }
        if (end3 > to) {
          result2.push(child3.slice(to - start5, child3.size, view));
        }
      }
    }
    return result2;
  }
  function selectionFromDOM(view, origin) {
    var domSel = view.root.getSelection(), doc2 = view.state.doc;
    if (!domSel.focusNode) {
      return null;
    }
    var nearestDesc2 = view.docView.nearestDesc(domSel.focusNode), inWidget = nearestDesc2 && nearestDesc2.size == 0;
    var head = view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset);
    if (head < 0) {
      return null;
    }
    var $head = doc2.resolve(head), $anchor, selection;
    if (selectionCollapsed(domSel)) {
      $anchor = $head;
      while (nearestDesc2 && !nearestDesc2.node) {
        nearestDesc2 = nearestDesc2.parent;
      }
      if (nearestDesc2 && nearestDesc2.node.isAtom && NodeSelection.isSelectable(nearestDesc2.node) && nearestDesc2.parent && !(nearestDesc2.node.isInline && isOnEdge(domSel.focusNode, domSel.focusOffset, nearestDesc2.dom))) {
        var pos = nearestDesc2.posBefore;
        selection = new NodeSelection(head == pos ? $head : doc2.resolve(pos));
      }
    } else {
      var anchor = view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset);
      if (anchor < 0) {
        return null;
      }
      $anchor = doc2.resolve(anchor);
    }
    if (!selection) {
      var bias = origin == "pointer" || view.state.selection.head < $head.pos && !inWidget ? 1 : -1;
      selection = selectionBetween(view, $anchor, $head, bias);
    }
    return selection;
  }
  function editorOwnsSelection(view) {
    return view.editable ? view.hasFocus() : hasSelection(view) && document.activeElement && document.activeElement.contains(view.dom);
  }
  function selectionToDOM(view, force) {
    var sel = view.state.selection;
    syncNodeSelection(view, sel);
    if (!editorOwnsSelection(view)) {
      return;
    }
    if (!force && view.mouseDown && view.mouseDown.allowDefault && result.chrome) {
      var domSel = view.root.getSelection(), curSel = view.domObserver.currentSelection;
      if (domSel.anchorNode && isEquivalentPosition(domSel.anchorNode, domSel.anchorOffset, curSel.anchorNode, curSel.anchorOffset)) {
        view.mouseDown.delayedSelectionSync = true;
        view.domObserver.setCurSelection();
        return;
      }
    }
    view.domObserver.disconnectSelection();
    if (view.cursorWrapper) {
      selectCursorWrapper(view);
    } else {
      var anchor = sel.anchor;
      var head = sel.head;
      var resetEditableFrom, resetEditableTo;
      if (brokenSelectBetweenUneditable && !(sel instanceof TextSelection)) {
        if (!sel.$from.parent.inlineContent) {
          resetEditableFrom = temporarilyEditableNear(view, sel.from);
        }
        if (!sel.empty && !sel.$from.parent.inlineContent) {
          resetEditableTo = temporarilyEditableNear(view, sel.to);
        }
      }
      view.docView.setSelection(anchor, head, view.root, force);
      if (brokenSelectBetweenUneditable) {
        if (resetEditableFrom) {
          resetEditable(resetEditableFrom);
        }
        if (resetEditableTo) {
          resetEditable(resetEditableTo);
        }
      }
      if (sel.visible) {
        view.dom.classList.remove("ProseMirror-hideselection");
      } else {
        view.dom.classList.add("ProseMirror-hideselection");
        if ("onselectionchange" in document) {
          removeClassOnSelectionChange(view);
        }
      }
    }
    view.domObserver.setCurSelection();
    view.domObserver.connectSelection();
  }
  var brokenSelectBetweenUneditable = result.safari || result.chrome && result.chrome_version < 63;
  function temporarilyEditableNear(view, pos) {
    var ref = view.docView.domFromPos(pos, 0);
    var node4 = ref.node;
    var offset3 = ref.offset;
    var after2 = offset3 < node4.childNodes.length ? node4.childNodes[offset3] : null;
    var before2 = offset3 ? node4.childNodes[offset3 - 1] : null;
    if (result.safari && after2 && after2.contentEditable == "false") {
      return setEditable(after2);
    }
    if ((!after2 || after2.contentEditable == "false") && (!before2 || before2.contentEditable == "false")) {
      if (after2) {
        return setEditable(after2);
      } else if (before2) {
        return setEditable(before2);
      }
    }
  }
  function setEditable(element) {
    element.contentEditable = "true";
    if (result.safari && element.draggable) {
      element.draggable = false;
      element.wasDraggable = true;
    }
    return element;
  }
  function resetEditable(element) {
    element.contentEditable = "false";
    if (element.wasDraggable) {
      element.draggable = true;
      element.wasDraggable = null;
    }
  }
  function removeClassOnSelectionChange(view) {
    var doc2 = view.dom.ownerDocument;
    doc2.removeEventListener("selectionchange", view.hideSelectionGuard);
    var domSel = view.root.getSelection();
    var node4 = domSel.anchorNode, offset3 = domSel.anchorOffset;
    doc2.addEventListener("selectionchange", view.hideSelectionGuard = function() {
      if (domSel.anchorNode != node4 || domSel.anchorOffset != offset3) {
        doc2.removeEventListener("selectionchange", view.hideSelectionGuard);
        setTimeout(function() {
          if (!editorOwnsSelection(view) || view.state.selection.visible) {
            view.dom.classList.remove("ProseMirror-hideselection");
          }
        }, 20);
      }
    });
  }
  function selectCursorWrapper(view) {
    var domSel = view.root.getSelection(), range = document.createRange();
    var node4 = view.cursorWrapper.dom, img = node4.nodeName == "IMG";
    if (img) {
      range.setEnd(node4.parentNode, domIndex(node4) + 1);
    } else {
      range.setEnd(node4, 0);
    }
    range.collapse(false);
    domSel.removeAllRanges();
    domSel.addRange(range);
    if (!img && !view.state.selection.visible && result.ie && result.ie_version <= 11) {
      node4.disabled = true;
      node4.disabled = false;
    }
  }
  function syncNodeSelection(view, sel) {
    if (sel instanceof NodeSelection) {
      var desc = view.docView.descAt(sel.from);
      if (desc != view.lastSelectedViewDesc) {
        clearNodeSelection(view);
        if (desc) {
          desc.selectNode();
        }
        view.lastSelectedViewDesc = desc;
      }
    } else {
      clearNodeSelection(view);
    }
  }
  function clearNodeSelection(view) {
    if (view.lastSelectedViewDesc) {
      if (view.lastSelectedViewDesc.parent) {
        view.lastSelectedViewDesc.deselectNode();
      }
      view.lastSelectedViewDesc = null;
    }
  }
  function selectionBetween(view, $anchor, $head, bias) {
    return view.someProp("createSelectionBetween", function(f) {
      return f(view, $anchor, $head);
    }) || TextSelection.between($anchor, $head, bias);
  }
  function hasFocusAndSelection(view) {
    if (view.editable && view.root.activeElement != view.dom) {
      return false;
    }
    return hasSelection(view);
  }
  function hasSelection(view) {
    var sel = view.root.getSelection();
    if (!sel.anchorNode) {
      return false;
    }
    try {
      return view.dom.contains(sel.anchorNode.nodeType == 3 ? sel.anchorNode.parentNode : sel.anchorNode) && (view.editable || view.dom.contains(sel.focusNode.nodeType == 3 ? sel.focusNode.parentNode : sel.focusNode));
    } catch (_) {
      return false;
    }
  }
  function anchorInRightPlace(view) {
    var anchorDOM = view.docView.domFromPos(view.state.selection.anchor, 0);
    var domSel = view.root.getSelection();
    return isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset);
  }
  function moveSelectionBlock(state, dir) {
    var ref = state.selection;
    var $anchor = ref.$anchor;
    var $head = ref.$head;
    var $side = dir > 0 ? $anchor.max($head) : $anchor.min($head);
    var $start = !$side.parent.inlineContent ? $side : $side.depth ? state.doc.resolve(dir > 0 ? $side.after() : $side.before()) : null;
    return $start && Selection.findFrom($start, dir);
  }
  function apply7(view, sel) {
    view.dispatch(view.state.tr.setSelection(sel).scrollIntoView());
    return true;
  }
  function selectHorizontally(view, dir, mods) {
    var sel = view.state.selection;
    if (sel instanceof TextSelection) {
      if (!sel.empty || mods.indexOf("s") > -1) {
        return false;
      } else if (view.endOfTextblock(dir > 0 ? "right" : "left")) {
        var next = moveSelectionBlock(view.state, dir);
        if (next && next instanceof NodeSelection) {
          return apply7(view, next);
        }
        return false;
      } else if (!(result.mac && mods.indexOf("m") > -1)) {
        var $head = sel.$head, node4 = $head.textOffset ? null : dir < 0 ? $head.nodeBefore : $head.nodeAfter, desc;
        if (!node4 || node4.isText) {
          return false;
        }
        var nodePos = dir < 0 ? $head.pos - node4.nodeSize : $head.pos;
        if (!(node4.isAtom || (desc = view.docView.descAt(nodePos)) && !desc.contentDOM)) {
          return false;
        }
        if (NodeSelection.isSelectable(node4)) {
          return apply7(view, new NodeSelection(dir < 0 ? view.state.doc.resolve($head.pos - node4.nodeSize) : $head));
        } else if (result.webkit) {
          return apply7(view, new TextSelection(view.state.doc.resolve(dir < 0 ? nodePos : nodePos + node4.nodeSize)));
        } else {
          return false;
        }
      }
    } else if (sel instanceof NodeSelection && sel.node.isInline) {
      return apply7(view, new TextSelection(dir > 0 ? sel.$to : sel.$from));
    } else {
      var next$1 = moveSelectionBlock(view.state, dir);
      if (next$1) {
        return apply7(view, next$1);
      }
      return false;
    }
  }
  function nodeLen(node4) {
    return node4.nodeType == 3 ? node4.nodeValue.length : node4.childNodes.length;
  }
  function isIgnorable(dom) {
    var desc = dom.pmViewDesc;
    return desc && desc.size == 0 && (dom.nextSibling || dom.nodeName != "BR");
  }
  function skipIgnoredNodesLeft(view) {
    var sel = view.root.getSelection();
    var node4 = sel.focusNode, offset3 = sel.focusOffset;
    if (!node4) {
      return;
    }
    var moveNode, moveOffset, force = false;
    if (result.gecko && node4.nodeType == 1 && offset3 < nodeLen(node4) && isIgnorable(node4.childNodes[offset3])) {
      force = true;
    }
    for (; ; ) {
      if (offset3 > 0) {
        if (node4.nodeType != 1) {
          break;
        } else {
          var before2 = node4.childNodes[offset3 - 1];
          if (isIgnorable(before2)) {
            moveNode = node4;
            moveOffset = --offset3;
          } else if (before2.nodeType == 3) {
            node4 = before2;
            offset3 = node4.nodeValue.length;
          } else {
            break;
          }
        }
      } else if (isBlockNode(node4)) {
        break;
      } else {
        var prev = node4.previousSibling;
        while (prev && isIgnorable(prev)) {
          moveNode = node4.parentNode;
          moveOffset = domIndex(prev);
          prev = prev.previousSibling;
        }
        if (!prev) {
          node4 = node4.parentNode;
          if (node4 == view.dom) {
            break;
          }
          offset3 = 0;
        } else {
          node4 = prev;
          offset3 = nodeLen(node4);
        }
      }
    }
    if (force) {
      setSelFocus(view, sel, node4, offset3);
    } else if (moveNode) {
      setSelFocus(view, sel, moveNode, moveOffset);
    }
  }
  function skipIgnoredNodesRight(view) {
    var sel = view.root.getSelection();
    var node4 = sel.focusNode, offset3 = sel.focusOffset;
    if (!node4) {
      return;
    }
    var len = nodeLen(node4);
    var moveNode, moveOffset;
    for (; ; ) {
      if (offset3 < len) {
        if (node4.nodeType != 1) {
          break;
        }
        var after2 = node4.childNodes[offset3];
        if (isIgnorable(after2)) {
          moveNode = node4;
          moveOffset = ++offset3;
        } else {
          break;
        }
      } else if (isBlockNode(node4)) {
        break;
      } else {
        var next = node4.nextSibling;
        while (next && isIgnorable(next)) {
          moveNode = next.parentNode;
          moveOffset = domIndex(next) + 1;
          next = next.nextSibling;
        }
        if (!next) {
          node4 = node4.parentNode;
          if (node4 == view.dom) {
            break;
          }
          offset3 = len = 0;
        } else {
          node4 = next;
          offset3 = 0;
          len = nodeLen(node4);
        }
      }
    }
    if (moveNode) {
      setSelFocus(view, sel, moveNode, moveOffset);
    }
  }
  function isBlockNode(dom) {
    var desc = dom.pmViewDesc;
    return desc && desc.node && desc.node.isBlock;
  }
  function setSelFocus(view, sel, node4, offset3) {
    if (selectionCollapsed(sel)) {
      var range = document.createRange();
      range.setEnd(node4, offset3);
      range.setStart(node4, offset3);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (sel.extend) {
      sel.extend(node4, offset3);
    }
    view.domObserver.setCurSelection();
    var state = view.state;
    setTimeout(function() {
      if (view.state == state) {
        selectionToDOM(view);
      }
    }, 50);
  }
  function selectVertically(view, dir, mods) {
    var sel = view.state.selection;
    if (sel instanceof TextSelection && !sel.empty || mods.indexOf("s") > -1) {
      return false;
    }
    if (result.mac && mods.indexOf("m") > -1) {
      return false;
    }
    var $from = sel.$from;
    var $to = sel.$to;
    if (!$from.parent.inlineContent || view.endOfTextblock(dir < 0 ? "up" : "down")) {
      var next = moveSelectionBlock(view.state, dir);
      if (next && next instanceof NodeSelection) {
        return apply7(view, next);
      }
    }
    if (!$from.parent.inlineContent) {
      var side = dir < 0 ? $from : $to;
      var beyond = sel instanceof AllSelection ? Selection.near(side, dir) : Selection.findFrom(side, dir);
      return beyond ? apply7(view, beyond) : false;
    }
    return false;
  }
  function stopNativeHorizontalDelete(view, dir) {
    if (!(view.state.selection instanceof TextSelection)) {
      return true;
    }
    var ref = view.state.selection;
    var $head = ref.$head;
    var $anchor = ref.$anchor;
    var empty2 = ref.empty;
    if (!$head.sameParent($anchor)) {
      return true;
    }
    if (!empty2) {
      return false;
    }
    if (view.endOfTextblock(dir > 0 ? "forward" : "backward")) {
      return true;
    }
    var nextNode = !$head.textOffset && (dir < 0 ? $head.nodeBefore : $head.nodeAfter);
    if (nextNode && !nextNode.isText) {
      var tr = view.state.tr;
      if (dir < 0) {
        tr.delete($head.pos - nextNode.nodeSize, $head.pos);
      } else {
        tr.delete($head.pos, $head.pos + nextNode.nodeSize);
      }
      view.dispatch(tr);
      return true;
    }
    return false;
  }
  function switchEditable(view, node4, state) {
    view.domObserver.stop();
    node4.contentEditable = state;
    view.domObserver.start();
  }
  function safariDownArrowBug(view) {
    if (!result.safari || view.state.selection.$head.parentOffset > 0) {
      return;
    }
    var ref = view.root.getSelection();
    var focusNode = ref.focusNode;
    var focusOffset = ref.focusOffset;
    if (focusNode && focusNode.nodeType == 1 && focusOffset == 0 && focusNode.firstChild && focusNode.firstChild.contentEditable == "false") {
      var child3 = focusNode.firstChild;
      switchEditable(view, child3, true);
      setTimeout(function() {
        return switchEditable(view, child3, false);
      }, 20);
    }
  }
  function getMods(event) {
    var result2 = "";
    if (event.ctrlKey) {
      result2 += "c";
    }
    if (event.metaKey) {
      result2 += "m";
    }
    if (event.altKey) {
      result2 += "a";
    }
    if (event.shiftKey) {
      result2 += "s";
    }
    return result2;
  }
  function captureKeyDown(view, event) {
    var code = event.keyCode, mods = getMods(event);
    if (code == 8 || result.mac && code == 72 && mods == "c") {
      return stopNativeHorizontalDelete(view, -1) || skipIgnoredNodesLeft(view);
    } else if (code == 46 || result.mac && code == 68 && mods == "c") {
      return stopNativeHorizontalDelete(view, 1) || skipIgnoredNodesRight(view);
    } else if (code == 13 || code == 27) {
      return true;
    } else if (code == 37) {
      return selectHorizontally(view, -1, mods) || skipIgnoredNodesLeft(view);
    } else if (code == 39) {
      return selectHorizontally(view, 1, mods) || skipIgnoredNodesRight(view);
    } else if (code == 38) {
      return selectVertically(view, -1, mods) || skipIgnoredNodesLeft(view);
    } else if (code == 40) {
      return safariDownArrowBug(view) || selectVertically(view, 1, mods) || skipIgnoredNodesRight(view);
    } else if (mods == (result.mac ? "m" : "c") && (code == 66 || code == 73 || code == 89 || code == 90)) {
      return true;
    }
    return false;
  }
  function parseBetween(view, from_, to_) {
    var ref = view.docView.parseRange(from_, to_);
    var parent = ref.node;
    var fromOffset = ref.fromOffset;
    var toOffset = ref.toOffset;
    var from4 = ref.from;
    var to = ref.to;
    var domSel = view.root.getSelection(), find2 = null, anchor = domSel.anchorNode;
    if (anchor && view.dom.contains(anchor.nodeType == 1 ? anchor : anchor.parentNode)) {
      find2 = [{ node: anchor, offset: domSel.anchorOffset }];
      if (!selectionCollapsed(domSel)) {
        find2.push({ node: domSel.focusNode, offset: domSel.focusOffset });
      }
    }
    if (result.chrome && view.lastKeyCode === 8) {
      for (var off = toOffset; off > fromOffset; off--) {
        var node4 = parent.childNodes[off - 1], desc = node4.pmViewDesc;
        if (node4.nodeName == "BR" && !desc) {
          toOffset = off;
          break;
        }
        if (!desc || desc.size) {
          break;
        }
      }
    }
    var startDoc = view.state.doc;
    var parser = view.someProp("domParser") || DOMParser2.fromSchema(view.state.schema);
    var $from = startDoc.resolve(from4);
    var sel = null, doc2 = parser.parse(parent, {
      topNode: $from.parent,
      topMatch: $from.parent.contentMatchAt($from.index()),
      topOpen: true,
      from: fromOffset,
      to: toOffset,
      preserveWhitespace: $from.parent.type.whitespace == "pre" ? "full" : true,
      editableContent: true,
      findPositions: find2,
      ruleFromNode,
      context: $from
    });
    if (find2 && find2[0].pos != null) {
      var anchor$1 = find2[0].pos, head = find2[1] && find2[1].pos;
      if (head == null) {
        head = anchor$1;
      }
      sel = { anchor: anchor$1 + from4, head: head + from4 };
    }
    return { doc: doc2, sel, from: from4, to };
  }
  function ruleFromNode(dom) {
    var desc = dom.pmViewDesc;
    if (desc) {
      return desc.parseRule();
    } else if (dom.nodeName == "BR" && dom.parentNode) {
      if (result.safari && /^(ul|ol)$/i.test(dom.parentNode.nodeName)) {
        var skip = document.createElement("div");
        skip.appendChild(document.createElement("li"));
        return { skip };
      } else if (dom.parentNode.lastChild == dom || result.safari && /^(tr|table)$/i.test(dom.parentNode.nodeName)) {
        return { ignore: true };
      }
    } else if (dom.nodeName == "IMG" && dom.getAttribute("mark-placeholder")) {
      return { ignore: true };
    }
  }
  function readDOMChange(view, from4, to, typeOver, addedNodes) {
    if (from4 < 0) {
      var origin = view.lastSelectionTime > Date.now() - 50 ? view.lastSelectionOrigin : null;
      var newSel = selectionFromDOM(view, origin);
      if (newSel && !view.state.selection.eq(newSel)) {
        var tr$1 = view.state.tr.setSelection(newSel);
        if (origin == "pointer") {
          tr$1.setMeta("pointer", true);
        } else if (origin == "key") {
          tr$1.scrollIntoView();
        }
        view.dispatch(tr$1);
      }
      return;
    }
    var $before = view.state.doc.resolve(from4);
    var shared = $before.sharedDepth(to);
    from4 = $before.before(shared + 1);
    to = view.state.doc.resolve(to).after(shared + 1);
    var sel = view.state.selection;
    var parse3 = parseBetween(view, from4, to);
    if (result.chrome && view.cursorWrapper && parse3.sel && parse3.sel.anchor == view.cursorWrapper.deco.from) {
      var text2 = view.cursorWrapper.deco.type.toDOM.nextSibling;
      var size = text2 && text2.nodeValue ? text2.nodeValue.length : 1;
      parse3.sel = { anchor: parse3.sel.anchor + size, head: parse3.sel.anchor + size };
    }
    var doc2 = view.state.doc, compare = doc2.slice(parse3.from, parse3.to);
    var preferredPos, preferredSide;
    if (view.lastKeyCode === 8 && Date.now() - 100 < view.lastKeyCodeTime) {
      preferredPos = view.state.selection.to;
      preferredSide = "end";
    } else {
      preferredPos = view.state.selection.from;
      preferredSide = "start";
    }
    view.lastKeyCode = null;
    var change = findDiff(compare.content, parse3.doc.content, parse3.from, preferredPos, preferredSide);
    if (!change) {
      if (typeOver && sel instanceof TextSelection && !sel.empty && sel.$head.sameParent(sel.$anchor) && !view.composing && !(parse3.sel && parse3.sel.anchor != parse3.sel.head)) {
        change = { start: sel.from, endA: sel.to, endB: sel.to };
      } else if ((result.ios && view.lastIOSEnter > Date.now() - 225 || result.android) && addedNodes.some(function(n) {
        return n.nodeName == "DIV" || n.nodeName == "P";
      }) && view.someProp("handleKeyDown", function(f) {
        return f(view, keyEvent(13, "Enter"));
      })) {
        view.lastIOSEnter = 0;
        return;
      } else {
        if (parse3.sel) {
          var sel$1 = resolveSelection(view, view.state.doc, parse3.sel);
          if (sel$1 && !sel$1.eq(view.state.selection)) {
            view.dispatch(view.state.tr.setSelection(sel$1));
          }
        }
        return;
      }
    }
    view.domChangeCount++;
    if (view.state.selection.from < view.state.selection.to && change.start == change.endB && view.state.selection instanceof TextSelection) {
      if (change.start > view.state.selection.from && change.start <= view.state.selection.from + 2 && view.state.selection.from >= parse3.from) {
        change.start = view.state.selection.from;
      } else if (change.endA < view.state.selection.to && change.endA >= view.state.selection.to - 2 && view.state.selection.to <= parse3.to) {
        change.endB += view.state.selection.to - change.endA;
        change.endA = view.state.selection.to;
      }
    }
    if (result.ie && result.ie_version <= 11 && change.endB == change.start + 1 && change.endA == change.start && change.start > parse3.from && parse3.doc.textBetween(change.start - parse3.from - 1, change.start - parse3.from + 1) == " \xA0") {
      change.start--;
      change.endA--;
      change.endB--;
    }
    var $from = parse3.doc.resolveNoCache(change.start - parse3.from);
    var $to = parse3.doc.resolveNoCache(change.endB - parse3.from);
    var inlineChange = $from.sameParent($to) && $from.parent.inlineContent;
    var nextSel;
    if ((result.ios && view.lastIOSEnter > Date.now() - 225 && (!inlineChange || addedNodes.some(function(n) {
      return n.nodeName == "DIV" || n.nodeName == "P";
    })) || !inlineChange && $from.pos < parse3.doc.content.size && (nextSel = Selection.findFrom(parse3.doc.resolve($from.pos + 1), 1, true)) && nextSel.head == $to.pos) && view.someProp("handleKeyDown", function(f) {
      return f(view, keyEvent(13, "Enter"));
    })) {
      view.lastIOSEnter = 0;
      return;
    }
    if (view.state.selection.anchor > change.start && looksLikeJoin(doc2, change.start, change.endA, $from, $to) && view.someProp("handleKeyDown", function(f) {
      return f(view, keyEvent(8, "Backspace"));
    })) {
      if (result.android && result.chrome) {
        view.domObserver.suppressSelectionUpdates();
      }
      return;
    }
    if (result.chrome && result.android && change.toB == change.from) {
      view.lastAndroidDelete = Date.now();
    }
    if (result.android && !inlineChange && $from.start() != $to.start() && $to.parentOffset == 0 && $from.depth == $to.depth && parse3.sel && parse3.sel.anchor == parse3.sel.head && parse3.sel.head == change.endA) {
      change.endB -= 2;
      $to = parse3.doc.resolveNoCache(change.endB - parse3.from);
      setTimeout(function() {
        view.someProp("handleKeyDown", function(f) {
          return f(view, keyEvent(13, "Enter"));
        });
      }, 20);
    }
    var chFrom = change.start, chTo = change.endA;
    var tr, storedMarks, markChange, $from1;
    if (inlineChange) {
      if ($from.pos == $to.pos) {
        if (result.ie && result.ie_version <= 11 && $from.parentOffset == 0) {
          view.domObserver.suppressSelectionUpdates();
          setTimeout(function() {
            return selectionToDOM(view);
          }, 20);
        }
        tr = view.state.tr.delete(chFrom, chTo);
        storedMarks = doc2.resolve(change.start).marksAcross(doc2.resolve(change.endA));
      } else if (change.endA == change.endB && ($from1 = doc2.resolve(change.start)) && (markChange = isMarkChange($from.parent.content.cut($from.parentOffset, $to.parentOffset), $from1.parent.content.cut($from1.parentOffset, change.endA - $from1.start())))) {
        tr = view.state.tr;
        if (markChange.type == "add") {
          tr.addMark(chFrom, chTo, markChange.mark);
        } else {
          tr.removeMark(chFrom, chTo, markChange.mark);
        }
      } else if ($from.parent.child($from.index()).isText && $from.index() == $to.index() - ($to.textOffset ? 0 : 1)) {
        var text$1 = $from.parent.textBetween($from.parentOffset, $to.parentOffset);
        if (view.someProp("handleTextInput", function(f) {
          return f(view, chFrom, chTo, text$1);
        })) {
          return;
        }
        tr = view.state.tr.insertText(text$1, chFrom, chTo);
      }
    }
    if (!tr) {
      tr = view.state.tr.replace(chFrom, chTo, parse3.doc.slice(change.start - parse3.from, change.endB - parse3.from));
    }
    if (parse3.sel) {
      var sel$2 = resolveSelection(view, tr.doc, parse3.sel);
      if (sel$2 && !(result.chrome && result.android && view.composing && sel$2.empty && (change.start != change.endB || view.lastAndroidDelete < Date.now() - 100) && (sel$2.head == chFrom || sel$2.head == tr.mapping.map(chTo) - 1) || result.ie && sel$2.empty && sel$2.head == chFrom)) {
        tr.setSelection(sel$2);
      }
    }
    if (storedMarks) {
      tr.ensureMarks(storedMarks);
    }
    view.dispatch(tr.scrollIntoView());
  }
  function resolveSelection(view, doc2, parsedSel) {
    if (Math.max(parsedSel.anchor, parsedSel.head) > doc2.content.size) {
      return null;
    }
    return selectionBetween(view, doc2.resolve(parsedSel.anchor), doc2.resolve(parsedSel.head));
  }
  function isMarkChange(cur, prev) {
    var curMarks = cur.firstChild.marks, prevMarks = prev.firstChild.marks;
    var added = curMarks, removed = prevMarks, type, mark3, update3;
    for (var i = 0; i < prevMarks.length; i++) {
      added = prevMarks[i].removeFromSet(added);
    }
    for (var i$1 = 0; i$1 < curMarks.length; i$1++) {
      removed = curMarks[i$1].removeFromSet(removed);
    }
    if (added.length == 1 && removed.length == 0) {
      mark3 = added[0];
      type = "add";
      update3 = function(node4) {
        return node4.mark(mark3.addToSet(node4.marks));
      };
    } else if (added.length == 0 && removed.length == 1) {
      mark3 = removed[0];
      type = "remove";
      update3 = function(node4) {
        return node4.mark(mark3.removeFromSet(node4.marks));
      };
    } else {
      return null;
    }
    var updated = [];
    for (var i$2 = 0; i$2 < prev.childCount; i$2++) {
      updated.push(update3(prev.child(i$2)));
    }
    if (Fragment.from(updated).eq(cur)) {
      return { mark: mark3, type };
    }
  }
  function looksLikeJoin(old, start5, end3, $newStart, $newEnd) {
    if (!$newStart.parent.isTextblock || end3 - start5 <= $newEnd.pos - $newStart.pos || skipClosingAndOpening($newStart, true, false) < $newEnd.pos) {
      return false;
    }
    var $start = old.resolve(start5);
    if ($start.parentOffset < $start.parent.content.size || !$start.parent.isTextblock) {
      return false;
    }
    var $next = old.resolve(skipClosingAndOpening($start, true, true));
    if (!$next.parent.isTextblock || $next.pos > end3 || skipClosingAndOpening($next, true, false) < end3) {
      return false;
    }
    return $newStart.parent.content.cut($newStart.parentOffset).eq($next.parent.content);
  }
  function skipClosingAndOpening($pos, fromEnd, mayOpen) {
    var depth = $pos.depth, end3 = fromEnd ? $pos.end() : $pos.pos;
    while (depth > 0 && (fromEnd || $pos.indexAfter(depth) == $pos.node(depth).childCount)) {
      depth--;
      end3++;
      fromEnd = false;
    }
    if (mayOpen) {
      var next = $pos.node(depth).maybeChild($pos.indexAfter(depth));
      while (next && !next.isLeaf) {
        next = next.firstChild;
        end3++;
      }
    }
    return end3;
  }
  function findDiff(a, b, pos, preferredPos, preferredSide) {
    var start5 = a.findDiffStart(b, pos);
    if (start5 == null) {
      return null;
    }
    var ref = a.findDiffEnd(b, pos + a.size, pos + b.size);
    var endA = ref.a;
    var endB = ref.b;
    if (preferredSide == "end") {
      var adjust = Math.max(0, start5 - Math.min(endA, endB));
      preferredPos -= endA + adjust - start5;
    }
    if (endA < start5 && a.size < b.size) {
      var move2 = preferredPos <= start5 && preferredPos >= endA ? start5 - preferredPos : 0;
      start5 -= move2;
      endB = start5 + (endB - endA);
      endA = start5;
    } else if (endB < start5) {
      var move$1 = preferredPos <= start5 && preferredPos >= endB ? start5 - preferredPos : 0;
      start5 -= move$1;
      endA = start5 + (endA - endB);
      endB = start5;
    }
    return { start: start5, endA, endB };
  }
  function serializeForClipboard(view, slice4) {
    var context = [];
    var content2 = slice4.content;
    var openStart = slice4.openStart;
    var openEnd = slice4.openEnd;
    while (openStart > 1 && openEnd > 1 && content2.childCount == 1 && content2.firstChild.childCount == 1) {
      openStart--;
      openEnd--;
      var node4 = content2.firstChild;
      context.push(node4.type.name, node4.attrs != node4.type.defaultAttrs ? node4.attrs : null);
      content2 = node4.content;
    }
    var serializer = view.someProp("clipboardSerializer") || DOMSerializer.fromSchema(view.state.schema);
    var doc2 = detachedDoc(), wrap = doc2.createElement("div");
    wrap.appendChild(serializer.serializeFragment(content2, { document: doc2 }));
    var firstChild = wrap.firstChild, needsWrap;
    while (firstChild && firstChild.nodeType == 1 && (needsWrap = wrapMap[firstChild.nodeName.toLowerCase()])) {
      for (var i = needsWrap.length - 1; i >= 0; i--) {
        var wrapper = doc2.createElement(needsWrap[i]);
        while (wrap.firstChild) {
          wrapper.appendChild(wrap.firstChild);
        }
        wrap.appendChild(wrapper);
        if (needsWrap[i] != "tbody") {
          openStart++;
          openEnd++;
        }
      }
      firstChild = wrap.firstChild;
    }
    if (firstChild && firstChild.nodeType == 1) {
      firstChild.setAttribute("data-pm-slice", openStart + " " + openEnd + " " + JSON.stringify(context));
    }
    var text2 = view.someProp("clipboardTextSerializer", function(f) {
      return f(slice4);
    }) || slice4.content.textBetween(0, slice4.content.size, "\n\n");
    return { dom: wrap, text: text2 };
  }
  function parseFromClipboard(view, text2, html, plainText, $context) {
    var dom, inCode = $context.parent.type.spec.code, slice4;
    if (!html && !text2) {
      return null;
    }
    var asText = text2 && (plainText || inCode || !html);
    if (asText) {
      view.someProp("transformPastedText", function(f) {
        text2 = f(text2, inCode || plainText);
      });
      if (inCode) {
        return text2 ? new Slice(Fragment.from(view.state.schema.text(text2.replace(/\r\n?/g, "\n"))), 0, 0) : Slice.empty;
      }
      var parsed = view.someProp("clipboardTextParser", function(f) {
        return f(text2, $context, plainText);
      });
      if (parsed) {
        slice4 = parsed;
      } else {
        var marks2 = $context.marks();
        var ref = view.state;
        var schema = ref.schema;
        var serializer = DOMSerializer.fromSchema(schema);
        dom = document.createElement("div");
        text2.split(/(?:\r\n?|\n)+/).forEach(function(block) {
          var p = dom.appendChild(document.createElement("p"));
          if (block) {
            p.appendChild(serializer.serializeNode(schema.text(block, marks2)));
          }
        });
      }
    } else {
      view.someProp("transformPastedHTML", function(f) {
        html = f(html);
      });
      dom = readHTML(html);
      if (result.webkit) {
        restoreReplacedSpaces(dom);
      }
    }
    var contextNode = dom && dom.querySelector("[data-pm-slice]");
    var sliceData = contextNode && /^(\d+) (\d+) (.*)/.exec(contextNode.getAttribute("data-pm-slice"));
    if (!slice4) {
      var parser = view.someProp("clipboardParser") || view.someProp("domParser") || DOMParser2.fromSchema(view.state.schema);
      slice4 = parser.parseSlice(dom, {
        preserveWhitespace: !!(asText || sliceData),
        context: $context,
        ruleFromNode: function ruleFromNode2(dom2) {
          if (dom2.nodeName == "BR" && !dom2.nextSibling && dom2.parentNode && !inlineParents.test(dom2.parentNode.nodeName)) {
            return { ignore: true };
          }
        }
      });
    }
    if (sliceData) {
      slice4 = addContext(closeSlice(slice4, +sliceData[1], +sliceData[2]), sliceData[3]);
    } else {
      slice4 = Slice.maxOpen(normalizeSiblings(slice4.content, $context), true);
      if (slice4.openStart || slice4.openEnd) {
        var openStart = 0, openEnd = 0;
        for (var node4 = slice4.content.firstChild; openStart < slice4.openStart && !node4.type.spec.isolating; openStart++, node4 = node4.firstChild) {
        }
        for (var node$1 = slice4.content.lastChild; openEnd < slice4.openEnd && !node$1.type.spec.isolating; openEnd++, node$1 = node$1.lastChild) {
        }
        slice4 = closeSlice(slice4, openStart, openEnd);
      }
    }
    view.someProp("transformPasted", function(f) {
      slice4 = f(slice4);
    });
    return slice4;
  }
  var inlineParents = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
  function normalizeSiblings(fragment, $context) {
    if (fragment.childCount < 2) {
      return fragment;
    }
    var loop = function(d2) {
      var parent = $context.node(d2);
      var match = parent.contentMatchAt($context.index(d2));
      var lastWrap = void 0, result2 = [];
      fragment.forEach(function(node4) {
        if (!result2) {
          return;
        }
        var wrap = match.findWrapping(node4.type), inLast;
        if (!wrap) {
          return result2 = null;
        }
        if (inLast = result2.length && lastWrap.length && addToSibling(wrap, lastWrap, node4, result2[result2.length - 1], 0)) {
          result2[result2.length - 1] = inLast;
        } else {
          if (result2.length) {
            result2[result2.length - 1] = closeRight(result2[result2.length - 1], lastWrap.length);
          }
          var wrapped = withWrappers(node4, wrap);
          result2.push(wrapped);
          match = match.matchType(wrapped.type, wrapped.attrs);
          lastWrap = wrap;
        }
      });
      if (result2) {
        return { v: Fragment.from(result2) };
      }
    };
    for (var d = $context.depth; d >= 0; d--) {
      var returned = loop(d);
      if (returned)
        return returned.v;
    }
    return fragment;
  }
  function withWrappers(node4, wrap, from4) {
    if (from4 === void 0)
      from4 = 0;
    for (var i = wrap.length - 1; i >= from4; i--) {
      node4 = wrap[i].create(null, Fragment.from(node4));
    }
    return node4;
  }
  function addToSibling(wrap, lastWrap, node4, sibling, depth) {
    if (depth < wrap.length && depth < lastWrap.length && wrap[depth] == lastWrap[depth]) {
      var inner = addToSibling(wrap, lastWrap, node4, sibling.lastChild, depth + 1);
      if (inner) {
        return sibling.copy(sibling.content.replaceChild(sibling.childCount - 1, inner));
      }
      var match = sibling.contentMatchAt(sibling.childCount);
      if (match.matchType(depth == wrap.length - 1 ? node4.type : wrap[depth + 1])) {
        return sibling.copy(sibling.content.append(Fragment.from(withWrappers(node4, wrap, depth + 1))));
      }
    }
  }
  function closeRight(node4, depth) {
    if (depth == 0) {
      return node4;
    }
    var fragment = node4.content.replaceChild(node4.childCount - 1, closeRight(node4.lastChild, depth - 1));
    var fill = node4.contentMatchAt(node4.childCount).fillBefore(Fragment.empty, true);
    return node4.copy(fragment.append(fill));
  }
  function closeRange(fragment, side, from4, to, depth, openEnd) {
    var node4 = side < 0 ? fragment.firstChild : fragment.lastChild, inner = node4.content;
    if (depth < to - 1) {
      inner = closeRange(inner, side, from4, to, depth + 1, openEnd);
    }
    if (depth >= from4) {
      inner = side < 0 ? node4.contentMatchAt(0).fillBefore(inner, fragment.childCount > 1 || openEnd <= depth).append(inner) : inner.append(node4.contentMatchAt(node4.childCount).fillBefore(Fragment.empty, true));
    }
    return fragment.replaceChild(side < 0 ? 0 : fragment.childCount - 1, node4.copy(inner));
  }
  function closeSlice(slice4, openStart, openEnd) {
    if (openStart < slice4.openStart) {
      slice4 = new Slice(closeRange(slice4.content, -1, openStart, slice4.openStart, 0, slice4.openEnd), openStart, slice4.openEnd);
    }
    if (openEnd < slice4.openEnd) {
      slice4 = new Slice(closeRange(slice4.content, 1, openEnd, slice4.openEnd, 0, 0), slice4.openStart, openEnd);
    }
    return slice4;
  }
  var wrapMap = {
    thead: ["table"],
    tbody: ["table"],
    tfoot: ["table"],
    caption: ["table"],
    colgroup: ["table"],
    col: ["table", "colgroup"],
    tr: ["table", "tbody"],
    td: ["table", "tbody", "tr"],
    th: ["table", "tbody", "tr"]
  };
  var _detachedDoc = null;
  function detachedDoc() {
    return _detachedDoc || (_detachedDoc = document.implementation.createHTMLDocument("title"));
  }
  function readHTML(html) {
    var metas = /^(\s*<meta [^>]*>)*/.exec(html);
    if (metas) {
      html = html.slice(metas[0].length);
    }
    var elt = detachedDoc().createElement("div");
    var firstTag = /<([a-z][^>\s]+)/i.exec(html), wrap;
    if (wrap = firstTag && wrapMap[firstTag[1].toLowerCase()]) {
      html = wrap.map(function(n) {
        return "<" + n + ">";
      }).join("") + html + wrap.map(function(n) {
        return "</" + n + ">";
      }).reverse().join("");
    }
    elt.innerHTML = html;
    if (wrap) {
      for (var i = 0; i < wrap.length; i++) {
        elt = elt.querySelector(wrap[i]) || elt;
      }
    }
    return elt;
  }
  function restoreReplacedSpaces(dom) {
    var nodes = dom.querySelectorAll(result.chrome ? "span:not([class]):not([style])" : "span.Apple-converted-space");
    for (var i = 0; i < nodes.length; i++) {
      var node4 = nodes[i];
      if (node4.childNodes.length == 1 && node4.textContent == "\xA0" && node4.parentNode) {
        node4.parentNode.replaceChild(dom.ownerDocument.createTextNode(" "), node4);
      }
    }
  }
  function addContext(slice4, context) {
    if (!slice4.size) {
      return slice4;
    }
    var schema = slice4.content.firstChild.type.schema, array;
    try {
      array = JSON.parse(context);
    } catch (e) {
      return slice4;
    }
    var content2 = slice4.content;
    var openStart = slice4.openStart;
    var openEnd = slice4.openEnd;
    for (var i = array.length - 2; i >= 0; i -= 2) {
      var type = schema.nodes[array[i]];
      if (!type || type.hasRequiredAttrs()) {
        break;
      }
      content2 = Fragment.from(type.create(array[i + 1], content2));
      openStart++;
      openEnd++;
    }
    return new Slice(content2, openStart, openEnd);
  }
  var observeOptions = {
    childList: true,
    characterData: true,
    characterDataOldValue: true,
    attributes: true,
    attributeOldValue: true,
    subtree: true
  };
  var useCharData = result.ie && result.ie_version <= 11;
  var SelectionState = function SelectionState2() {
    this.anchorNode = this.anchorOffset = this.focusNode = this.focusOffset = null;
  };
  SelectionState.prototype.set = function set(sel) {
    this.anchorNode = sel.anchorNode;
    this.anchorOffset = sel.anchorOffset;
    this.focusNode = sel.focusNode;
    this.focusOffset = sel.focusOffset;
  };
  SelectionState.prototype.eq = function eq5(sel) {
    return sel.anchorNode == this.anchorNode && sel.anchorOffset == this.anchorOffset && sel.focusNode == this.focusNode && sel.focusOffset == this.focusOffset;
  };
  var DOMObserver = function DOMObserver2(view, handleDOMChange) {
    var this$1 = this;
    this.view = view;
    this.handleDOMChange = handleDOMChange;
    this.queue = [];
    this.flushingSoon = -1;
    this.observer = window.MutationObserver && new window.MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        this$1.queue.push(mutations[i]);
      }
      if (result.ie && result.ie_version <= 11 && mutations.some(function(m) {
        return m.type == "childList" && m.removedNodes.length || m.type == "characterData" && m.oldValue.length > m.target.nodeValue.length;
      })) {
        this$1.flushSoon();
      } else {
        this$1.flush();
      }
    });
    this.currentSelection = new SelectionState();
    if (useCharData) {
      this.onCharData = function(e) {
        this$1.queue.push({ target: e.target, type: "characterData", oldValue: e.prevValue });
        this$1.flushSoon();
      };
    }
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.suppressingSelectionUpdates = false;
  };
  DOMObserver.prototype.flushSoon = function flushSoon() {
    var this$1 = this;
    if (this.flushingSoon < 0) {
      this.flushingSoon = window.setTimeout(function() {
        this$1.flushingSoon = -1;
        this$1.flush();
      }, 20);
    }
  };
  DOMObserver.prototype.forceFlush = function forceFlush() {
    if (this.flushingSoon > -1) {
      window.clearTimeout(this.flushingSoon);
      this.flushingSoon = -1;
      this.flush();
    }
  };
  DOMObserver.prototype.start = function start4() {
    if (this.observer) {
      this.observer.observe(this.view.dom, observeOptions);
    }
    if (useCharData) {
      this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData);
    }
    this.connectSelection();
  };
  DOMObserver.prototype.stop = function stop() {
    var this$1 = this;
    if (this.observer) {
      var take = this.observer.takeRecords();
      if (take.length) {
        for (var i = 0; i < take.length; i++) {
          this.queue.push(take[i]);
        }
        window.setTimeout(function() {
          return this$1.flush();
        }, 20);
      }
      this.observer.disconnect();
    }
    if (useCharData) {
      this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData);
    }
    this.disconnectSelection();
  };
  DOMObserver.prototype.connectSelection = function connectSelection() {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  };
  DOMObserver.prototype.disconnectSelection = function disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  };
  DOMObserver.prototype.suppressSelectionUpdates = function suppressSelectionUpdates() {
    var this$1 = this;
    this.suppressingSelectionUpdates = true;
    setTimeout(function() {
      return this$1.suppressingSelectionUpdates = false;
    }, 50);
  };
  DOMObserver.prototype.onSelectionChange = function onSelectionChange() {
    if (!hasFocusAndSelection(this.view)) {
      return;
    }
    if (this.suppressingSelectionUpdates) {
      return selectionToDOM(this.view);
    }
    if (result.ie && result.ie_version <= 11 && !this.view.state.selection.empty) {
      var sel = this.view.root.getSelection();
      if (sel.focusNode && isEquivalentPosition(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset)) {
        return this.flushSoon();
      }
    }
    this.flush();
  };
  DOMObserver.prototype.setCurSelection = function setCurSelection() {
    this.currentSelection.set(this.view.root.getSelection());
  };
  DOMObserver.prototype.ignoreSelectionChange = function ignoreSelectionChange(sel) {
    if (sel.rangeCount == 0) {
      return true;
    }
    var container = sel.getRangeAt(0).commonAncestorContainer;
    var desc = this.view.docView.nearestDesc(container);
    if (desc && desc.ignoreMutation({ type: "selection", target: container.nodeType == 3 ? container.parentNode : container })) {
      this.setCurSelection();
      return true;
    }
  };
  DOMObserver.prototype.flush = function flush() {
    if (!this.view.docView || this.flushingSoon > -1) {
      return;
    }
    var mutations = this.observer ? this.observer.takeRecords() : [];
    if (this.queue.length) {
      mutations = this.queue.concat(mutations);
      this.queue.length = 0;
    }
    var sel = this.view.root.getSelection();
    var newSel = !this.suppressingSelectionUpdates && !this.currentSelection.eq(sel) && hasSelection(this.view) && !this.ignoreSelectionChange(sel);
    var from4 = -1, to = -1, typeOver = false, added = [];
    if (this.view.editable) {
      for (var i = 0; i < mutations.length; i++) {
        var result$1 = this.registerMutation(mutations[i], added);
        if (result$1) {
          from4 = from4 < 0 ? result$1.from : Math.min(result$1.from, from4);
          to = to < 0 ? result$1.to : Math.max(result$1.to, to);
          if (result$1.typeOver) {
            typeOver = true;
          }
        }
      }
    }
    if (result.gecko && added.length > 1) {
      var brs = added.filter(function(n) {
        return n.nodeName == "BR";
      });
      if (brs.length == 2) {
        var a = brs[0];
        var b = brs[1];
        if (a.parentNode && a.parentNode.parentNode == b.parentNode) {
          b.remove();
        } else {
          a.remove();
        }
      }
    }
    if (from4 > -1 || newSel) {
      if (from4 > -1) {
        this.view.docView.markDirty(from4, to);
        checkCSS(this.view);
      }
      this.handleDOMChange(from4, to, typeOver, added);
      if (this.view.docView && this.view.docView.dirty) {
        this.view.updateState(this.view.state);
      } else if (!this.currentSelection.eq(sel)) {
        selectionToDOM(this.view);
      }
      this.currentSelection.set(sel);
    }
  };
  DOMObserver.prototype.registerMutation = function registerMutation(mut, added) {
    if (added.indexOf(mut.target) > -1) {
      return null;
    }
    var desc = this.view.docView.nearestDesc(mut.target);
    if (mut.type == "attributes" && (desc == this.view.docView || mut.attributeName == "contenteditable" || mut.attributeName == "style" && !mut.oldValue && !mut.target.getAttribute("style"))) {
      return null;
    }
    if (!desc || desc.ignoreMutation(mut)) {
      return null;
    }
    if (mut.type == "childList") {
      for (var i = 0; i < mut.addedNodes.length; i++) {
        added.push(mut.addedNodes[i]);
      }
      if (desc.contentDOM && desc.contentDOM != desc.dom && !desc.contentDOM.contains(mut.target)) {
        return { from: desc.posBefore, to: desc.posAfter };
      }
      var prev = mut.previousSibling, next = mut.nextSibling;
      if (result.ie && result.ie_version <= 11 && mut.addedNodes.length) {
        for (var i$1 = 0; i$1 < mut.addedNodes.length; i$1++) {
          var ref = mut.addedNodes[i$1];
          var previousSibling = ref.previousSibling;
          var nextSibling = ref.nextSibling;
          if (!previousSibling || Array.prototype.indexOf.call(mut.addedNodes, previousSibling) < 0) {
            prev = previousSibling;
          }
          if (!nextSibling || Array.prototype.indexOf.call(mut.addedNodes, nextSibling) < 0) {
            next = nextSibling;
          }
        }
      }
      var fromOffset = prev && prev.parentNode == mut.target ? domIndex(prev) + 1 : 0;
      var from4 = desc.localPosFromDOM(mut.target, fromOffset, -1);
      var toOffset = next && next.parentNode == mut.target ? domIndex(next) : mut.target.childNodes.length;
      var to = desc.localPosFromDOM(mut.target, toOffset, 1);
      return { from: from4, to };
    } else if (mut.type == "attributes") {
      return { from: desc.posAtStart - desc.border, to: desc.posAtEnd + desc.border };
    } else {
      return {
        from: desc.posAtStart,
        to: desc.posAtEnd,
        typeOver: mut.target.nodeValue == mut.oldValue
      };
    }
  };
  var cssChecked = false;
  function checkCSS(view) {
    if (cssChecked) {
      return;
    }
    cssChecked = true;
    if (getComputedStyle(view.dom).whiteSpace == "normal") {
      console["warn"]("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package.");
    }
  }
  var handlers = {};
  var editHandlers = {};
  function initInput(view) {
    view.shiftKey = false;
    view.mouseDown = null;
    view.lastKeyCode = null;
    view.lastKeyCodeTime = 0;
    view.lastClick = { time: 0, x: 0, y: 0, type: "" };
    view.lastSelectionOrigin = null;
    view.lastSelectionTime = 0;
    view.lastIOSEnter = 0;
    view.lastIOSEnterFallbackTimeout = null;
    view.lastAndroidDelete = 0;
    view.composing = false;
    view.composingTimeout = null;
    view.compositionNodes = [];
    view.compositionEndedAt = -2e8;
    view.domObserver = new DOMObserver(view, function(from4, to, typeOver, added) {
      return readDOMChange(view, from4, to, typeOver, added);
    });
    view.domObserver.start();
    view.domChangeCount = 0;
    view.eventHandlers = /* @__PURE__ */ Object.create(null);
    var loop = function(event2) {
      var handler = handlers[event2];
      view.dom.addEventListener(event2, view.eventHandlers[event2] = function(event3) {
        if (eventBelongsToView(view, event3) && !runCustomHandler(view, event3) && (view.editable || !(event3.type in editHandlers))) {
          handler(view, event3);
        }
      });
    };
    for (var event in handlers)
      loop(event);
    if (result.safari) {
      view.dom.addEventListener("input", function() {
        return null;
      });
    }
    ensureListeners(view);
  }
  function setSelectionOrigin(view, origin) {
    view.lastSelectionOrigin = origin;
    view.lastSelectionTime = Date.now();
  }
  function destroyInput(view) {
    view.domObserver.stop();
    for (var type in view.eventHandlers) {
      view.dom.removeEventListener(type, view.eventHandlers[type]);
    }
    clearTimeout(view.composingTimeout);
    clearTimeout(view.lastIOSEnterFallbackTimeout);
  }
  function ensureListeners(view) {
    view.someProp("handleDOMEvents", function(currentHandlers) {
      for (var type in currentHandlers) {
        if (!view.eventHandlers[type]) {
          view.dom.addEventListener(type, view.eventHandlers[type] = function(event) {
            return runCustomHandler(view, event);
          });
        }
      }
    });
  }
  function runCustomHandler(view, event) {
    return view.someProp("handleDOMEvents", function(handlers2) {
      var handler = handlers2[event.type];
      return handler ? handler(view, event) || event.defaultPrevented : false;
    });
  }
  function eventBelongsToView(view, event) {
    if (!event.bubbles) {
      return true;
    }
    if (event.defaultPrevented) {
      return false;
    }
    for (var node4 = event.target; node4 != view.dom; node4 = node4.parentNode) {
      if (!node4 || node4.nodeType == 11 || node4.pmViewDesc && node4.pmViewDesc.stopEvent(event)) {
        return false;
      }
    }
    return true;
  }
  function dispatchEvent2(view, event) {
    if (!runCustomHandler(view, event) && handlers[event.type] && (view.editable || !(event.type in editHandlers))) {
      handlers[event.type](view, event);
    }
  }
  editHandlers.keydown = function(view, event) {
    view.shiftKey = event.keyCode == 16 || event.shiftKey;
    if (inOrNearComposition(view, event)) {
      return;
    }
    view.lastKeyCode = event.keyCode;
    view.lastKeyCodeTime = Date.now();
    if (result.android && result.chrome && event.keyCode == 13) {
      return;
    }
    if (event.keyCode != 229) {
      view.domObserver.forceFlush();
    }
    if (result.ios && event.keyCode == 13 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      var now2 = Date.now();
      view.lastIOSEnter = now2;
      view.lastIOSEnterFallbackTimeout = setTimeout(function() {
        if (view.lastIOSEnter == now2) {
          view.someProp("handleKeyDown", function(f) {
            return f(view, keyEvent(13, "Enter"));
          });
          view.lastIOSEnter = 0;
        }
      }, 200);
    } else if (view.someProp("handleKeyDown", function(f) {
      return f(view, event);
    }) || captureKeyDown(view, event)) {
      event.preventDefault();
    } else {
      setSelectionOrigin(view, "key");
    }
  };
  editHandlers.keyup = function(view, e) {
    if (e.keyCode == 16) {
      view.shiftKey = false;
    }
  };
  editHandlers.keypress = function(view, event) {
    if (inOrNearComposition(view, event) || !event.charCode || event.ctrlKey && !event.altKey || result.mac && event.metaKey) {
      return;
    }
    if (view.someProp("handleKeyPress", function(f) {
      return f(view, event);
    })) {
      event.preventDefault();
      return;
    }
    var sel = view.state.selection;
    if (!(sel instanceof TextSelection) || !sel.$from.sameParent(sel.$to)) {
      var text2 = String.fromCharCode(event.charCode);
      if (!view.someProp("handleTextInput", function(f) {
        return f(view, sel.$from.pos, sel.$to.pos, text2);
      })) {
        view.dispatch(view.state.tr.insertText(text2).scrollIntoView());
      }
      event.preventDefault();
    }
  };
  function eventCoords(event) {
    return { left: event.clientX, top: event.clientY };
  }
  function isNear(event, click) {
    var dx = click.x - event.clientX, dy = click.y - event.clientY;
    return dx * dx + dy * dy < 100;
  }
  function runHandlerOnContext(view, propName, pos, inside, event) {
    if (inside == -1) {
      return false;
    }
    var $pos = view.state.doc.resolve(inside);
    var loop = function(i2) {
      if (view.someProp(propName, function(f) {
        return i2 > $pos.depth ? f(view, pos, $pos.nodeAfter, $pos.before(i2), event, true) : f(view, pos, $pos.node(i2), $pos.before(i2), event, false);
      })) {
        return { v: true };
      }
    };
    for (var i = $pos.depth + 1; i > 0; i--) {
      var returned = loop(i);
      if (returned)
        return returned.v;
    }
    return false;
  }
  function updateSelection(view, selection, origin) {
    if (!view.focused) {
      view.focus();
    }
    var tr = view.state.tr.setSelection(selection);
    if (origin == "pointer") {
      tr.setMeta("pointer", true);
    }
    view.dispatch(tr);
  }
  function selectClickedLeaf(view, inside) {
    if (inside == -1) {
      return false;
    }
    var $pos = view.state.doc.resolve(inside), node4 = $pos.nodeAfter;
    if (node4 && node4.isAtom && NodeSelection.isSelectable(node4)) {
      updateSelection(view, new NodeSelection($pos), "pointer");
      return true;
    }
    return false;
  }
  function selectClickedNode(view, inside) {
    if (inside == -1) {
      return false;
    }
    var sel = view.state.selection, selectedNode, selectAt;
    if (sel instanceof NodeSelection) {
      selectedNode = sel.node;
    }
    var $pos = view.state.doc.resolve(inside);
    for (var i = $pos.depth + 1; i > 0; i--) {
      var node4 = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
      if (NodeSelection.isSelectable(node4)) {
        if (selectedNode && sel.$from.depth > 0 && i >= sel.$from.depth && $pos.before(sel.$from.depth + 1) == sel.$from.pos) {
          selectAt = $pos.before(sel.$from.depth);
        } else {
          selectAt = $pos.before(i);
        }
        break;
      }
    }
    if (selectAt != null) {
      updateSelection(view, NodeSelection.create(view.state.doc, selectAt), "pointer");
      return true;
    } else {
      return false;
    }
  }
  function handleSingleClick(view, pos, inside, event, selectNode) {
    return runHandlerOnContext(view, "handleClickOn", pos, inside, event) || view.someProp("handleClick", function(f) {
      return f(view, pos, event);
    }) || (selectNode ? selectClickedNode(view, inside) : selectClickedLeaf(view, inside));
  }
  function handleDoubleClick(view, pos, inside, event) {
    return runHandlerOnContext(view, "handleDoubleClickOn", pos, inside, event) || view.someProp("handleDoubleClick", function(f) {
      return f(view, pos, event);
    });
  }
  function handleTripleClick(view, pos, inside, event) {
    return runHandlerOnContext(view, "handleTripleClickOn", pos, inside, event) || view.someProp("handleTripleClick", function(f) {
      return f(view, pos, event);
    }) || defaultTripleClick(view, inside, event);
  }
  function defaultTripleClick(view, inside, event) {
    if (event.button != 0) {
      return false;
    }
    var doc2 = view.state.doc;
    if (inside == -1) {
      if (doc2.inlineContent) {
        updateSelection(view, TextSelection.create(doc2, 0, doc2.content.size), "pointer");
        return true;
      }
      return false;
    }
    var $pos = doc2.resolve(inside);
    for (var i = $pos.depth + 1; i > 0; i--) {
      var node4 = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
      var nodePos = $pos.before(i);
      if (node4.inlineContent) {
        updateSelection(view, TextSelection.create(doc2, nodePos + 1, nodePos + 1 + node4.content.size), "pointer");
      } else if (NodeSelection.isSelectable(node4)) {
        updateSelection(view, NodeSelection.create(doc2, nodePos), "pointer");
      } else {
        continue;
      }
      return true;
    }
  }
  function forceDOMFlush(view) {
    return endComposition(view);
  }
  var selectNodeModifier = result.mac ? "metaKey" : "ctrlKey";
  handlers.mousedown = function(view, event) {
    view.shiftKey = event.shiftKey;
    var flushed = forceDOMFlush(view);
    var now2 = Date.now(), type = "singleClick";
    if (now2 - view.lastClick.time < 500 && isNear(event, view.lastClick) && !event[selectNodeModifier]) {
      if (view.lastClick.type == "singleClick") {
        type = "doubleClick";
      } else if (view.lastClick.type == "doubleClick") {
        type = "tripleClick";
      }
    }
    view.lastClick = { time: now2, x: event.clientX, y: event.clientY, type };
    var pos = view.posAtCoords(eventCoords(event));
    if (!pos) {
      return;
    }
    if (type == "singleClick") {
      if (view.mouseDown) {
        view.mouseDown.done();
      }
      view.mouseDown = new MouseDown(view, pos, event, flushed);
    } else if ((type == "doubleClick" ? handleDoubleClick : handleTripleClick)(view, pos.pos, pos.inside, event)) {
      event.preventDefault();
    } else {
      setSelectionOrigin(view, "pointer");
    }
  };
  var MouseDown = function MouseDown2(view, pos, event, flushed) {
    var this$1 = this;
    this.view = view;
    this.startDoc = view.state.doc;
    this.pos = pos;
    this.event = event;
    this.flushed = flushed;
    this.selectNode = event[selectNodeModifier];
    this.allowDefault = event.shiftKey;
    this.delayedSelectionSync = false;
    var targetNode, targetPos;
    if (pos.inside > -1) {
      targetNode = view.state.doc.nodeAt(pos.inside);
      targetPos = pos.inside;
    } else {
      var $pos = view.state.doc.resolve(pos.pos);
      targetNode = $pos.parent;
      targetPos = $pos.depth ? $pos.before() : 0;
    }
    this.mightDrag = null;
    var target = flushed ? null : event.target;
    var targetDesc = target ? view.docView.nearestDesc(target, true) : null;
    this.target = targetDesc ? targetDesc.dom : null;
    var ref = view.state;
    var selection = ref.selection;
    if (event.button == 0 && targetNode.type.spec.draggable && targetNode.type.spec.selectable !== false || selection instanceof NodeSelection && selection.from <= targetPos && selection.to > targetPos) {
      this.mightDrag = {
        node: targetNode,
        pos: targetPos,
        addAttr: this.target && !this.target.draggable,
        setUneditable: this.target && result.gecko && !this.target.hasAttribute("contentEditable")
      };
    }
    if (this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable)) {
      this.view.domObserver.stop();
      if (this.mightDrag.addAttr) {
        this.target.draggable = true;
      }
      if (this.mightDrag.setUneditable) {
        setTimeout(function() {
          if (this$1.view.mouseDown == this$1) {
            this$1.target.setAttribute("contentEditable", "false");
          }
        }, 20);
      }
      this.view.domObserver.start();
    }
    view.root.addEventListener("mouseup", this.up = this.up.bind(this));
    view.root.addEventListener("mousemove", this.move = this.move.bind(this));
    setSelectionOrigin(view, "pointer");
  };
  MouseDown.prototype.done = function done() {
    var this$1 = this;
    this.view.root.removeEventListener("mouseup", this.up);
    this.view.root.removeEventListener("mousemove", this.move);
    if (this.mightDrag && this.target) {
      this.view.domObserver.stop();
      if (this.mightDrag.addAttr) {
        this.target.removeAttribute("draggable");
      }
      if (this.mightDrag.setUneditable) {
        this.target.removeAttribute("contentEditable");
      }
      this.view.domObserver.start();
    }
    if (this.delayedSelectionSync) {
      setTimeout(function() {
        return selectionToDOM(this$1.view);
      });
    }
    this.view.mouseDown = null;
  };
  MouseDown.prototype.up = function up(event) {
    this.done();
    if (!this.view.dom.contains(event.target.nodeType == 3 ? event.target.parentNode : event.target)) {
      return;
    }
    var pos = this.pos;
    if (this.view.state.doc != this.startDoc) {
      pos = this.view.posAtCoords(eventCoords(event));
    }
    if (this.allowDefault || !pos) {
      setSelectionOrigin(this.view, "pointer");
    } else if (handleSingleClick(this.view, pos.pos, pos.inside, event, this.selectNode)) {
      event.preventDefault();
    } else if (event.button == 0 && (this.flushed || result.safari && this.mightDrag && !this.mightDrag.node.isAtom || result.chrome && !(this.view.state.selection instanceof TextSelection) && Math.min(Math.abs(pos.pos - this.view.state.selection.from), Math.abs(pos.pos - this.view.state.selection.to)) <= 2)) {
      updateSelection(this.view, Selection.near(this.view.state.doc.resolve(pos.pos)), "pointer");
      event.preventDefault();
    } else {
      setSelectionOrigin(this.view, "pointer");
    }
  };
  MouseDown.prototype.move = function move(event) {
    if (!this.allowDefault && (Math.abs(this.event.x - event.clientX) > 4 || Math.abs(this.event.y - event.clientY) > 4)) {
      this.allowDefault = true;
    }
    setSelectionOrigin(this.view, "pointer");
    if (event.buttons == 0) {
      this.done();
    }
  };
  handlers.touchdown = function(view) {
    forceDOMFlush(view);
    setSelectionOrigin(view, "pointer");
  };
  handlers.contextmenu = function(view) {
    return forceDOMFlush(view);
  };
  function inOrNearComposition(view, event) {
    if (view.composing) {
      return true;
    }
    if (result.safari && Math.abs(event.timeStamp - view.compositionEndedAt) < 500) {
      view.compositionEndedAt = -2e8;
      return true;
    }
    return false;
  }
  var timeoutComposition = result.android ? 5e3 : -1;
  editHandlers.compositionstart = editHandlers.compositionupdate = function(view) {
    if (!view.composing) {
      view.domObserver.flush();
      var state = view.state;
      var $pos = state.selection.$from;
      if (state.selection.empty && (state.storedMarks || !$pos.textOffset && $pos.parentOffset && $pos.nodeBefore.marks.some(function(m) {
        return m.type.spec.inclusive === false;
      }))) {
        view.markCursor = view.state.storedMarks || $pos.marks();
        endComposition(view, true);
        view.markCursor = null;
      } else {
        endComposition(view);
        if (result.gecko && state.selection.empty && $pos.parentOffset && !$pos.textOffset && $pos.nodeBefore.marks.length) {
          var sel = view.root.getSelection();
          for (var node4 = sel.focusNode, offset3 = sel.focusOffset; node4 && node4.nodeType == 1 && offset3 != 0; ) {
            var before2 = offset3 < 0 ? node4.lastChild : node4.childNodes[offset3 - 1];
            if (!before2) {
              break;
            }
            if (before2.nodeType == 3) {
              sel.collapse(before2, before2.nodeValue.length);
              break;
            } else {
              node4 = before2;
              offset3 = -1;
            }
          }
        }
      }
      view.composing = true;
    }
    scheduleComposeEnd(view, timeoutComposition);
  };
  editHandlers.compositionend = function(view, event) {
    if (view.composing) {
      view.composing = false;
      view.compositionEndedAt = event.timeStamp;
      scheduleComposeEnd(view, 20);
    }
  };
  function scheduleComposeEnd(view, delay) {
    clearTimeout(view.composingTimeout);
    if (delay > -1) {
      view.composingTimeout = setTimeout(function() {
        return endComposition(view);
      }, delay);
    }
  }
  function clearComposition(view) {
    if (view.composing) {
      view.composing = false;
      view.compositionEndedAt = timestampFromCustomEvent();
    }
    while (view.compositionNodes.length > 0) {
      view.compositionNodes.pop().markParentsDirty();
    }
  }
  function timestampFromCustomEvent() {
    var event = document.createEvent("Event");
    event.initEvent("event", true, true);
    return event.timeStamp;
  }
  function endComposition(view, forceUpdate) {
    if (result.android && view.domObserver.flushingSoon >= 0) {
      return;
    }
    view.domObserver.forceFlush();
    clearComposition(view);
    if (forceUpdate || view.docView && view.docView.dirty) {
      var sel = selectionFromDOM(view);
      if (sel && !sel.eq(view.state.selection)) {
        view.dispatch(view.state.tr.setSelection(sel));
      } else {
        view.updateState(view.state);
      }
      return true;
    }
    return false;
  }
  function captureCopy(view, dom) {
    if (!view.dom.parentNode) {
      return;
    }
    var wrap = view.dom.parentNode.appendChild(document.createElement("div"));
    wrap.appendChild(dom);
    wrap.style.cssText = "position: fixed; left: -10000px; top: 10px";
    var sel = getSelection(), range = document.createRange();
    range.selectNodeContents(dom);
    view.dom.blur();
    sel.removeAllRanges();
    sel.addRange(range);
    setTimeout(function() {
      if (wrap.parentNode) {
        wrap.parentNode.removeChild(wrap);
      }
      view.focus();
    }, 50);
  }
  var brokenClipboardAPI = result.ie && result.ie_version < 15 || result.ios && result.webkit_version < 604;
  handlers.copy = editHandlers.cut = function(view, e) {
    var sel = view.state.selection, cut3 = e.type == "cut";
    if (sel.empty) {
      return;
    }
    var data = brokenClipboardAPI ? null : e.clipboardData;
    var slice4 = sel.content();
    var ref = serializeForClipboard(view, slice4);
    var dom = ref.dom;
    var text2 = ref.text;
    if (data) {
      e.preventDefault();
      data.clearData();
      data.setData("text/html", dom.innerHTML);
      data.setData("text/plain", text2);
    } else {
      captureCopy(view, dom);
    }
    if (cut3) {
      view.dispatch(view.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
    }
  };
  function sliceSingleNode(slice4) {
    return slice4.openStart == 0 && slice4.openEnd == 0 && slice4.content.childCount == 1 ? slice4.content.firstChild : null;
  }
  function capturePaste(view, e) {
    if (!view.dom.parentNode) {
      return;
    }
    var plainText = view.shiftKey || view.state.selection.$from.parent.type.spec.code;
    var target = view.dom.parentNode.appendChild(document.createElement(plainText ? "textarea" : "div"));
    if (!plainText) {
      target.contentEditable = "true";
    }
    target.style.cssText = "position: fixed; left: -10000px; top: 10px";
    target.focus();
    setTimeout(function() {
      view.focus();
      if (target.parentNode) {
        target.parentNode.removeChild(target);
      }
      if (plainText) {
        doPaste(view, target.value, null, e);
      } else {
        doPaste(view, target.textContent, target.innerHTML, e);
      }
    }, 50);
  }
  function doPaste(view, text2, html, e) {
    var slice4 = parseFromClipboard(view, text2, html, view.shiftKey, view.state.selection.$from);
    if (view.someProp("handlePaste", function(f) {
      return f(view, e, slice4 || Slice.empty);
    })) {
      return true;
    }
    if (!slice4) {
      return false;
    }
    var singleNode = sliceSingleNode(slice4);
    var tr = singleNode ? view.state.tr.replaceSelectionWith(singleNode, view.shiftKey) : view.state.tr.replaceSelection(slice4);
    view.dispatch(tr.scrollIntoView().setMeta("paste", true).setMeta("uiEvent", "paste"));
    return true;
  }
  editHandlers.paste = function(view, e) {
    if (view.composing && !result.android) {
      return;
    }
    var data = brokenClipboardAPI ? null : e.clipboardData;
    if (data && doPaste(view, data.getData("text/plain"), data.getData("text/html"), e)) {
      e.preventDefault();
    } else {
      capturePaste(view, e);
    }
  };
  var Dragging = function Dragging2(slice4, move2) {
    this.slice = slice4;
    this.move = move2;
  };
  var dragCopyModifier = result.mac ? "altKey" : "ctrlKey";
  handlers.dragstart = function(view, e) {
    var mouseDown = view.mouseDown;
    if (mouseDown) {
      mouseDown.done();
    }
    if (!e.dataTransfer) {
      return;
    }
    var sel = view.state.selection;
    var pos = sel.empty ? null : view.posAtCoords(eventCoords(e));
    if (pos && pos.pos >= sel.from && pos.pos <= (sel instanceof NodeSelection ? sel.to - 1 : sel.to))
      ;
    else if (mouseDown && mouseDown.mightDrag) {
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, mouseDown.mightDrag.pos)));
    } else if (e.target && e.target.nodeType == 1) {
      var desc = view.docView.nearestDesc(e.target, true);
      if (desc && desc.node.type.spec.draggable && desc != view.docView) {
        view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, desc.posBefore)));
      }
    }
    var slice4 = view.state.selection.content();
    var ref = serializeForClipboard(view, slice4);
    var dom = ref.dom;
    var text2 = ref.text;
    e.dataTransfer.clearData();
    e.dataTransfer.setData(brokenClipboardAPI ? "Text" : "text/html", dom.innerHTML);
    e.dataTransfer.effectAllowed = "copyMove";
    if (!brokenClipboardAPI) {
      e.dataTransfer.setData("text/plain", text2);
    }
    view.dragging = new Dragging(slice4, !e[dragCopyModifier]);
  };
  handlers.dragend = function(view) {
    var dragging = view.dragging;
    window.setTimeout(function() {
      if (view.dragging == dragging) {
        view.dragging = null;
      }
    }, 50);
  };
  editHandlers.dragover = editHandlers.dragenter = function(_, e) {
    return e.preventDefault();
  };
  editHandlers.drop = function(view, e) {
    var dragging = view.dragging;
    view.dragging = null;
    if (!e.dataTransfer) {
      return;
    }
    var eventPos = view.posAtCoords(eventCoords(e));
    if (!eventPos) {
      return;
    }
    var $mouse = view.state.doc.resolve(eventPos.pos);
    if (!$mouse) {
      return;
    }
    var slice4 = dragging && dragging.slice;
    if (slice4) {
      view.someProp("transformPasted", function(f) {
        slice4 = f(slice4);
      });
    } else {
      slice4 = parseFromClipboard(view, e.dataTransfer.getData(brokenClipboardAPI ? "Text" : "text/plain"), brokenClipboardAPI ? null : e.dataTransfer.getData("text/html"), false, $mouse);
    }
    var move2 = dragging && !e[dragCopyModifier];
    if (view.someProp("handleDrop", function(f) {
      return f(view, e, slice4 || Slice.empty, move2);
    })) {
      e.preventDefault();
      return;
    }
    if (!slice4) {
      return;
    }
    e.preventDefault();
    var insertPos = slice4 ? dropPoint(view.state.doc, $mouse.pos, slice4) : $mouse.pos;
    if (insertPos == null) {
      insertPos = $mouse.pos;
    }
    var tr = view.state.tr;
    if (move2) {
      tr.deleteSelection();
    }
    var pos = tr.mapping.map(insertPos);
    var isNode = slice4.openStart == 0 && slice4.openEnd == 0 && slice4.content.childCount == 1;
    var beforeInsert = tr.doc;
    if (isNode) {
      tr.replaceRangeWith(pos, pos, slice4.content.firstChild);
    } else {
      tr.replaceRange(pos, pos, slice4);
    }
    if (tr.doc.eq(beforeInsert)) {
      return;
    }
    var $pos = tr.doc.resolve(pos);
    if (isNode && NodeSelection.isSelectable(slice4.content.firstChild) && $pos.nodeAfter && $pos.nodeAfter.sameMarkup(slice4.content.firstChild)) {
      tr.setSelection(new NodeSelection($pos));
    } else {
      var end3 = tr.mapping.map(insertPos);
      tr.mapping.maps[tr.mapping.maps.length - 1].forEach(function(_from, _to, _newFrom, newTo) {
        return end3 = newTo;
      });
      tr.setSelection(selectionBetween(view, $pos, tr.doc.resolve(end3)));
    }
    view.focus();
    view.dispatch(tr.setMeta("uiEvent", "drop"));
  };
  handlers.focus = function(view) {
    if (!view.focused) {
      view.domObserver.stop();
      view.dom.classList.add("ProseMirror-focused");
      view.domObserver.start();
      view.focused = true;
      setTimeout(function() {
        if (view.docView && view.hasFocus() && !view.domObserver.currentSelection.eq(view.root.getSelection())) {
          selectionToDOM(view);
        }
      }, 20);
    }
  };
  handlers.blur = function(view, e) {
    if (view.focused) {
      view.domObserver.stop();
      view.dom.classList.remove("ProseMirror-focused");
      view.domObserver.start();
      if (e.relatedTarget && view.dom.contains(e.relatedTarget)) {
        view.domObserver.currentSelection.set({});
      }
      view.focused = false;
    }
  };
  handlers.beforeinput = function(view, event) {
    if (result.chrome && result.android && event.inputType == "deleteContentBackward") {
      view.domObserver.flushSoon();
      var domChangeCount = view.domChangeCount;
      setTimeout(function() {
        if (view.domChangeCount != domChangeCount) {
          return;
        }
        view.dom.blur();
        view.focus();
        if (view.someProp("handleKeyDown", function(f) {
          return f(view, keyEvent(8, "Backspace"));
        })) {
          return;
        }
        var ref = view.state.selection;
        var $cursor = ref.$cursor;
        if ($cursor && $cursor.pos > 0) {
          view.dispatch(view.state.tr.delete($cursor.pos - 1, $cursor.pos).scrollIntoView());
        }
      }, 50);
    }
  };
  for (prop in editHandlers) {
    handlers[prop] = editHandlers[prop];
  }
  var prop;
  function compareObjs(a, b) {
    if (a == b) {
      return true;
    }
    for (var p in a) {
      if (a[p] !== b[p]) {
        return false;
      }
    }
    for (var p$1 in b) {
      if (!(p$1 in a)) {
        return false;
      }
    }
    return true;
  }
  var WidgetType = function WidgetType2(toDOM, spec) {
    this.spec = spec || noSpec;
    this.side = this.spec.side || 0;
    this.toDOM = toDOM;
  };
  WidgetType.prototype.map = function map7(mapping, span, offset3, oldOffset) {
    var ref = mapping.mapResult(span.from + oldOffset, this.side < 0 ? -1 : 1);
    var pos = ref.pos;
    var deleted = ref.deleted;
    return deleted ? null : new Decoration(pos - offset3, pos - offset3, this);
  };
  WidgetType.prototype.valid = function valid() {
    return true;
  };
  WidgetType.prototype.eq = function eq6(other) {
    return this == other || other instanceof WidgetType && (this.spec.key && this.spec.key == other.spec.key || this.toDOM == other.toDOM && compareObjs(this.spec, other.spec));
  };
  WidgetType.prototype.destroy = function destroy2(node4) {
    if (this.spec.destroy) {
      this.spec.destroy(node4);
    }
  };
  var InlineType = function InlineType2(attrs, spec) {
    this.spec = spec || noSpec;
    this.attrs = attrs;
  };
  InlineType.prototype.map = function map8(mapping, span, offset3, oldOffset) {
    var from4 = mapping.map(span.from + oldOffset, this.spec.inclusiveStart ? -1 : 1) - offset3;
    var to = mapping.map(span.to + oldOffset, this.spec.inclusiveEnd ? 1 : -1) - offset3;
    return from4 >= to ? null : new Decoration(from4, to, this);
  };
  InlineType.prototype.valid = function valid2(_, span) {
    return span.from < span.to;
  };
  InlineType.prototype.eq = function eq7(other) {
    return this == other || other instanceof InlineType && compareObjs(this.attrs, other.attrs) && compareObjs(this.spec, other.spec);
  };
  InlineType.is = function is(span) {
    return span.type instanceof InlineType;
  };
  var NodeType3 = function NodeType4(attrs, spec) {
    this.spec = spec || noSpec;
    this.attrs = attrs;
  };
  NodeType3.prototype.map = function map9(mapping, span, offset3, oldOffset) {
    var from4 = mapping.mapResult(span.from + oldOffset, 1);
    if (from4.deleted) {
      return null;
    }
    var to = mapping.mapResult(span.to + oldOffset, -1);
    if (to.deleted || to.pos <= from4.pos) {
      return null;
    }
    return new Decoration(from4.pos - offset3, to.pos - offset3, this);
  };
  NodeType3.prototype.valid = function valid3(node4, span) {
    var ref = node4.content.findIndex(span.from);
    var index2 = ref.index;
    var offset3 = ref.offset;
    var child3;
    return offset3 == span.from && !(child3 = node4.child(index2)).isText && offset3 + child3.nodeSize == span.to;
  };
  NodeType3.prototype.eq = function eq8(other) {
    return this == other || other instanceof NodeType3 && compareObjs(this.attrs, other.attrs) && compareObjs(this.spec, other.spec);
  };
  var Decoration = function Decoration2(from4, to, type) {
    this.from = from4;
    this.to = to;
    this.type = type;
  };
  var prototypeAccessors$14 = { spec: { configurable: true }, inline: { configurable: true } };
  Decoration.prototype.copy = function copy4(from4, to) {
    return new Decoration(from4, to, this.type);
  };
  Decoration.prototype.eq = function eq9(other, offset3) {
    if (offset3 === void 0)
      offset3 = 0;
    return this.type.eq(other.type) && this.from + offset3 == other.from && this.to + offset3 == other.to;
  };
  Decoration.prototype.map = function map10(mapping, offset3, oldOffset) {
    return this.type.map(mapping, this, offset3, oldOffset);
  };
  Decoration.widget = function widget(pos, toDOM, spec) {
    return new Decoration(pos, pos, new WidgetType(toDOM, spec));
  };
  Decoration.inline = function inline(from4, to, attrs, spec) {
    return new Decoration(from4, to, new InlineType(attrs, spec));
  };
  Decoration.node = function node3(from4, to, attrs, spec) {
    return new Decoration(from4, to, new NodeType3(attrs, spec));
  };
  prototypeAccessors$14.spec.get = function() {
    return this.type.spec;
  };
  prototypeAccessors$14.inline.get = function() {
    return this.type instanceof InlineType;
  };
  Object.defineProperties(Decoration.prototype, prototypeAccessors$14);
  var none = [];
  var noSpec = {};
  var DecorationSet = function DecorationSet2(local, children) {
    this.local = local && local.length ? local : none;
    this.children = children && children.length ? children : none;
  };
  DecorationSet.create = function create4(doc2, decorations) {
    return decorations.length ? buildTree(decorations, doc2, 0, noSpec) : empty;
  };
  DecorationSet.prototype.find = function find(start5, end3, predicate) {
    var result2 = [];
    this.findInner(start5 == null ? 0 : start5, end3 == null ? 1e9 : end3, result2, 0, predicate);
    return result2;
  };
  DecorationSet.prototype.findInner = function findInner(start5, end3, result2, offset3, predicate) {
    for (var i = 0; i < this.local.length; i++) {
      var span = this.local[i];
      if (span.from <= end3 && span.to >= start5 && (!predicate || predicate(span.spec))) {
        result2.push(span.copy(span.from + offset3, span.to + offset3));
      }
    }
    for (var i$1 = 0; i$1 < this.children.length; i$1 += 3) {
      if (this.children[i$1] < end3 && this.children[i$1 + 1] > start5) {
        var childOff = this.children[i$1] + 1;
        this.children[i$1 + 2].findInner(start5 - childOff, end3 - childOff, result2, offset3 + childOff, predicate);
      }
    }
  };
  DecorationSet.prototype.map = function map11(mapping, doc2, options) {
    if (this == empty || mapping.maps.length == 0) {
      return this;
    }
    return this.mapInner(mapping, doc2, 0, 0, options || noSpec);
  };
  DecorationSet.prototype.mapInner = function mapInner(mapping, node4, offset3, oldOffset, options) {
    var newLocal;
    for (var i = 0; i < this.local.length; i++) {
      var mapped = this.local[i].map(mapping, offset3, oldOffset);
      if (mapped && mapped.type.valid(node4, mapped)) {
        (newLocal || (newLocal = [])).push(mapped);
      } else if (options.onRemove) {
        options.onRemove(this.local[i].spec);
      }
    }
    if (this.children.length) {
      return mapChildren(this.children, newLocal, mapping, node4, offset3, oldOffset, options);
    } else {
      return newLocal ? new DecorationSet(newLocal.sort(byPos)) : empty;
    }
  };
  DecorationSet.prototype.add = function add2(doc2, decorations) {
    if (!decorations.length) {
      return this;
    }
    if (this == empty) {
      return DecorationSet.create(doc2, decorations);
    }
    return this.addInner(doc2, decorations, 0);
  };
  DecorationSet.prototype.addInner = function addInner(doc2, decorations, offset3) {
    var this$1 = this;
    var children, childIndex = 0;
    doc2.forEach(function(childNode, childOffset) {
      var baseOffset = childOffset + offset3, found2;
      if (!(found2 = takeSpansForNode(decorations, childNode, baseOffset))) {
        return;
      }
      if (!children) {
        children = this$1.children.slice();
      }
      while (childIndex < children.length && children[childIndex] < childOffset) {
        childIndex += 3;
      }
      if (children[childIndex] == childOffset) {
        children[childIndex + 2] = children[childIndex + 2].addInner(childNode, found2, baseOffset + 1);
      } else {
        children.splice(childIndex, 0, childOffset, childOffset + childNode.nodeSize, buildTree(found2, childNode, baseOffset + 1, noSpec));
      }
      childIndex += 3;
    });
    var local = moveSpans(childIndex ? withoutNulls(decorations) : decorations, -offset3);
    for (var i = 0; i < local.length; i++) {
      if (!local[i].type.valid(doc2, local[i])) {
        local.splice(i--, 1);
      }
    }
    return new DecorationSet(local.length ? this.local.concat(local).sort(byPos) : this.local, children || this.children);
  };
  DecorationSet.prototype.remove = function remove(decorations) {
    if (decorations.length == 0 || this == empty) {
      return this;
    }
    return this.removeInner(decorations, 0);
  };
  DecorationSet.prototype.removeInner = function removeInner(decorations, offset3) {
    var children = this.children, local = this.local;
    for (var i = 0; i < children.length; i += 3) {
      var found2 = void 0, from4 = children[i] + offset3, to = children[i + 1] + offset3;
      for (var j = 0, span = void 0; j < decorations.length; j++) {
        if (span = decorations[j]) {
          if (span.from > from4 && span.to < to) {
            decorations[j] = null;
            (found2 || (found2 = [])).push(span);
          }
        }
      }
      if (!found2) {
        continue;
      }
      if (children == this.children) {
        children = this.children.slice();
      }
      var removed = children[i + 2].removeInner(found2, from4 + 1);
      if (removed != empty) {
        children[i + 2] = removed;
      } else {
        children.splice(i, 3);
        i -= 3;
      }
    }
    if (local.length) {
      for (var i$1 = 0, span$1 = void 0; i$1 < decorations.length; i$1++) {
        if (span$1 = decorations[i$1]) {
          for (var j$1 = 0; j$1 < local.length; j$1++) {
            if (local[j$1].eq(span$1, offset3)) {
              if (local == this.local) {
                local = this.local.slice();
              }
              local.splice(j$1--, 1);
            }
          }
        }
      }
    }
    if (children == this.children && local == this.local) {
      return this;
    }
    return local.length || children.length ? new DecorationSet(local, children) : empty;
  };
  DecorationSet.prototype.forChild = function forChild(offset3, node4) {
    if (this == empty) {
      return this;
    }
    if (node4.isLeaf) {
      return DecorationSet.empty;
    }
    var child3, local;
    for (var i = 0; i < this.children.length; i += 3) {
      if (this.children[i] >= offset3) {
        if (this.children[i] == offset3) {
          child3 = this.children[i + 2];
        }
        break;
      }
    }
    var start5 = offset3 + 1, end3 = start5 + node4.content.size;
    for (var i$1 = 0; i$1 < this.local.length; i$1++) {
      var dec = this.local[i$1];
      if (dec.from < end3 && dec.to > start5 && dec.type instanceof InlineType) {
        var from4 = Math.max(start5, dec.from) - start5, to = Math.min(end3, dec.to) - start5;
        if (from4 < to) {
          (local || (local = [])).push(dec.copy(from4, to));
        }
      }
    }
    if (local) {
      var localSet = new DecorationSet(local.sort(byPos));
      return child3 ? new DecorationGroup([localSet, child3]) : localSet;
    }
    return child3 || empty;
  };
  DecorationSet.prototype.eq = function eq10(other) {
    if (this == other) {
      return true;
    }
    if (!(other instanceof DecorationSet) || this.local.length != other.local.length || this.children.length != other.children.length) {
      return false;
    }
    for (var i = 0; i < this.local.length; i++) {
      if (!this.local[i].eq(other.local[i])) {
        return false;
      }
    }
    for (var i$1 = 0; i$1 < this.children.length; i$1 += 3) {
      if (this.children[i$1] != other.children[i$1] || this.children[i$1 + 1] != other.children[i$1 + 1] || !this.children[i$1 + 2].eq(other.children[i$1 + 2])) {
        return false;
      }
    }
    return true;
  };
  DecorationSet.prototype.locals = function locals(node4) {
    return removeOverlap(this.localsInner(node4));
  };
  DecorationSet.prototype.localsInner = function localsInner(node4) {
    if (this == empty) {
      return none;
    }
    if (node4.inlineContent || !this.local.some(InlineType.is)) {
      return this.local;
    }
    var result2 = [];
    for (var i = 0; i < this.local.length; i++) {
      if (!(this.local[i].type instanceof InlineType)) {
        result2.push(this.local[i]);
      }
    }
    return result2;
  };
  var empty = new DecorationSet();
  DecorationSet.empty = empty;
  DecorationSet.removeOverlap = removeOverlap;
  var DecorationGroup = function DecorationGroup2(members) {
    this.members = members;
  };
  DecorationGroup.prototype.map = function map12(mapping, doc2) {
    var mappedDecos = this.members.map(function(member) {
      return member.map(mapping, doc2, noSpec);
    });
    return DecorationGroup.from(mappedDecos);
  };
  DecorationGroup.prototype.forChild = function forChild2(offset3, child3) {
    if (child3.isLeaf) {
      return DecorationSet.empty;
    }
    var found2 = [];
    for (var i = 0; i < this.members.length; i++) {
      var result2 = this.members[i].forChild(offset3, child3);
      if (result2 == empty) {
        continue;
      }
      if (result2 instanceof DecorationGroup) {
        found2 = found2.concat(result2.members);
      } else {
        found2.push(result2);
      }
    }
    return DecorationGroup.from(found2);
  };
  DecorationGroup.prototype.eq = function eq11(other) {
    if (!(other instanceof DecorationGroup) || other.members.length != this.members.length) {
      return false;
    }
    for (var i = 0; i < this.members.length; i++) {
      if (!this.members[i].eq(other.members[i])) {
        return false;
      }
    }
    return true;
  };
  DecorationGroup.prototype.locals = function locals2(node4) {
    var result2, sorted = true;
    for (var i = 0; i < this.members.length; i++) {
      var locals3 = this.members[i].localsInner(node4);
      if (!locals3.length) {
        continue;
      }
      if (!result2) {
        result2 = locals3;
      } else {
        if (sorted) {
          result2 = result2.slice();
          sorted = false;
        }
        for (var j = 0; j < locals3.length; j++) {
          result2.push(locals3[j]);
        }
      }
    }
    return result2 ? removeOverlap(sorted ? result2 : result2.sort(byPos)) : none;
  };
  DecorationGroup.from = function from2(members) {
    switch (members.length) {
      case 0:
        return empty;
      case 1:
        return members[0];
      default:
        return new DecorationGroup(members);
    }
  };
  function mapChildren(oldChildren, newLocal, mapping, node4, offset3, oldOffset, options) {
    var children = oldChildren.slice();
    var shift2 = function(oldStart, oldEnd, newStart, newEnd) {
      for (var i2 = 0; i2 < children.length; i2 += 3) {
        var end3 = children[i2 + 1], dSize = void 0;
        if (end3 < 0 || oldStart > end3 + oldOffset) {
          continue;
        }
        var start5 = children[i2] + oldOffset;
        if (oldEnd >= start5) {
          children[i2 + 1] = oldStart <= start5 ? -2 : -1;
        } else if (newStart >= offset3 && (dSize = newEnd - newStart - (oldEnd - oldStart))) {
          children[i2] += dSize;
          children[i2 + 1] += dSize;
        }
      }
    };
    for (var i = 0; i < mapping.maps.length; i++) {
      mapping.maps[i].forEach(shift2);
    }
    var mustRebuild = false;
    for (var i$1 = 0; i$1 < children.length; i$1 += 3) {
      if (children[i$1 + 1] < 0) {
        if (children[i$1 + 1] == -2) {
          mustRebuild = true;
          children[i$1 + 1] = -1;
          continue;
        }
        var from4 = mapping.map(oldChildren[i$1] + oldOffset), fromLocal = from4 - offset3;
        if (fromLocal < 0 || fromLocal >= node4.content.size) {
          mustRebuild = true;
          continue;
        }
        var to = mapping.map(oldChildren[i$1 + 1] + oldOffset, -1), toLocal = to - offset3;
        var ref = node4.content.findIndex(fromLocal);
        var index2 = ref.index;
        var childOffset = ref.offset;
        var childNode = node4.maybeChild(index2);
        if (childNode && childOffset == fromLocal && childOffset + childNode.nodeSize == toLocal) {
          var mapped = children[i$1 + 2].mapInner(mapping, childNode, from4 + 1, oldChildren[i$1] + oldOffset + 1, options);
          if (mapped != empty) {
            children[i$1] = fromLocal;
            children[i$1 + 1] = toLocal;
            children[i$1 + 2] = mapped;
          } else {
            children[i$1 + 1] = -2;
            mustRebuild = true;
          }
        } else {
          mustRebuild = true;
        }
      }
    }
    if (mustRebuild) {
      var decorations = mapAndGatherRemainingDecorations(children, oldChildren, newLocal || [], mapping, offset3, oldOffset, options);
      var built = buildTree(decorations, node4, 0, options);
      newLocal = built.local;
      for (var i$2 = 0; i$2 < children.length; i$2 += 3) {
        if (children[i$2 + 1] < 0) {
          children.splice(i$2, 3);
          i$2 -= 3;
        }
      }
      for (var i$3 = 0, j = 0; i$3 < built.children.length; i$3 += 3) {
        var from$1 = built.children[i$3];
        while (j < children.length && children[j] < from$1) {
          j += 3;
        }
        children.splice(j, 0, built.children[i$3], built.children[i$3 + 1], built.children[i$3 + 2]);
      }
    }
    return new DecorationSet(newLocal && newLocal.sort(byPos), children);
  }
  function moveSpans(spans, offset3) {
    if (!offset3 || !spans.length) {
      return spans;
    }
    var result2 = [];
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];
      result2.push(new Decoration(span.from + offset3, span.to + offset3, span.type));
    }
    return result2;
  }
  function mapAndGatherRemainingDecorations(children, oldChildren, decorations, mapping, offset3, oldOffset, options) {
    function gather(set2, oldOffset2) {
      for (var i2 = 0; i2 < set2.local.length; i2++) {
        var mapped = set2.local[i2].map(mapping, offset3, oldOffset2);
        if (mapped) {
          decorations.push(mapped);
        } else if (options.onRemove) {
          options.onRemove(set2.local[i2].spec);
        }
      }
      for (var i$1 = 0; i$1 < set2.children.length; i$1 += 3) {
        gather(set2.children[i$1 + 2], set2.children[i$1] + oldOffset2 + 1);
      }
    }
    for (var i = 0; i < children.length; i += 3) {
      if (children[i + 1] == -1) {
        gather(children[i + 2], oldChildren[i] + oldOffset + 1);
      }
    }
    return decorations;
  }
  function takeSpansForNode(spans, node4, offset3) {
    if (node4.isLeaf) {
      return null;
    }
    var end3 = offset3 + node4.nodeSize, found2 = null;
    for (var i = 0, span = void 0; i < spans.length; i++) {
      if ((span = spans[i]) && span.from > offset3 && span.to < end3) {
        (found2 || (found2 = [])).push(span);
        spans[i] = null;
      }
    }
    return found2;
  }
  function withoutNulls(array) {
    var result2 = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i] != null) {
        result2.push(array[i]);
      }
    }
    return result2;
  }
  function buildTree(spans, node4, offset3, options) {
    var children = [], hasNulls = false;
    node4.forEach(function(childNode, localStart) {
      var found2 = takeSpansForNode(spans, childNode, localStart + offset3);
      if (found2) {
        hasNulls = true;
        var subtree = buildTree(found2, childNode, offset3 + localStart + 1, options);
        if (subtree != empty) {
          children.push(localStart, localStart + childNode.nodeSize, subtree);
        }
      }
    });
    var locals3 = moveSpans(hasNulls ? withoutNulls(spans) : spans, -offset3).sort(byPos);
    for (var i = 0; i < locals3.length; i++) {
      if (!locals3[i].type.valid(node4, locals3[i])) {
        if (options.onRemove) {
          options.onRemove(locals3[i].spec);
        }
        locals3.splice(i--, 1);
      }
    }
    return locals3.length || children.length ? new DecorationSet(locals3, children) : empty;
  }
  function byPos(a, b) {
    return a.from - b.from || a.to - b.to;
  }
  function removeOverlap(spans) {
    var working = spans;
    for (var i = 0; i < working.length - 1; i++) {
      var span = working[i];
      if (span.from != span.to) {
        for (var j = i + 1; j < working.length; j++) {
          var next = working[j];
          if (next.from == span.from) {
            if (next.to != span.to) {
              if (working == spans) {
                working = spans.slice();
              }
              working[j] = next.copy(next.from, span.to);
              insertAhead(working, j + 1, next.copy(span.to, next.to));
            }
            continue;
          } else {
            if (next.from < span.to) {
              if (working == spans) {
                working = spans.slice();
              }
              working[i] = span.copy(span.from, next.from);
              insertAhead(working, j, span.copy(next.from, span.to));
            }
            break;
          }
        }
      }
    }
    return working;
  }
  function insertAhead(array, i, deco) {
    while (i < array.length && byPos(deco, array[i]) > 0) {
      i++;
    }
    array.splice(i, 0, deco);
  }
  function viewDecorations(view) {
    var found2 = [];
    view.someProp("decorations", function(f) {
      var result2 = f(view.state);
      if (result2 && result2 != empty) {
        found2.push(result2);
      }
    });
    if (view.cursorWrapper) {
      found2.push(DecorationSet.create(view.state.doc, [view.cursorWrapper.deco]));
    }
    return DecorationGroup.from(found2);
  }
  var EditorView = function EditorView2(place, props) {
    this._props = props;
    this.state = props.state;
    this.directPlugins = props.plugins || [];
    this.directPlugins.forEach(checkStateComponent);
    this.dispatch = this.dispatch.bind(this);
    this._root = null;
    this.focused = false;
    this.trackWrites = null;
    this.dom = place && place.mount || document.createElement("div");
    if (place) {
      if (place.appendChild) {
        place.appendChild(this.dom);
      } else if (place.apply) {
        place(this.dom);
      } else if (place.mount) {
        this.mounted = true;
      }
    }
    this.editable = getEditable(this);
    this.markCursor = null;
    this.cursorWrapper = null;
    updateCursorWrapper(this);
    this.nodeViews = buildNodeViews(this);
    this.docView = docViewDesc(this.state.doc, computeDocDeco(this), viewDecorations(this), this.dom, this);
    this.lastSelectedViewDesc = null;
    this.dragging = null;
    initInput(this);
    this.prevDirectPlugins = [];
    this.pluginViews = [];
    this.updatePluginViews();
  };
  var prototypeAccessors$22 = { props: { configurable: true }, root: { configurable: true }, isDestroyed: { configurable: true } };
  prototypeAccessors$22.props.get = function() {
    if (this._props.state != this.state) {
      var prev = this._props;
      this._props = {};
      for (var name in prev) {
        this._props[name] = prev[name];
      }
      this._props.state = this.state;
    }
    return this._props;
  };
  EditorView.prototype.update = function update(props) {
    if (props.handleDOMEvents != this._props.handleDOMEvents) {
      ensureListeners(this);
    }
    this._props = props;
    if (props.plugins) {
      props.plugins.forEach(checkStateComponent);
      this.directPlugins = props.plugins;
    }
    this.updateStateInner(props.state, true);
  };
  EditorView.prototype.setProps = function setProps(props) {
    var updated = {};
    for (var name in this._props) {
      updated[name] = this._props[name];
    }
    updated.state = this.state;
    for (var name$1 in props) {
      updated[name$1] = props[name$1];
    }
    this.update(updated);
  };
  EditorView.prototype.updateState = function updateState(state) {
    this.updateStateInner(state, this.state.plugins != state.plugins);
  };
  EditorView.prototype.updateStateInner = function updateStateInner(state, reconfigured) {
    var this$1 = this;
    var prev = this.state, redraw = false, updateSel = false;
    if (state.storedMarks && this.composing) {
      clearComposition(this);
      updateSel = true;
    }
    this.state = state;
    if (reconfigured) {
      var nodeViews = buildNodeViews(this);
      if (changedNodeViews(nodeViews, this.nodeViews)) {
        this.nodeViews = nodeViews;
        redraw = true;
      }
      ensureListeners(this);
    }
    this.editable = getEditable(this);
    updateCursorWrapper(this);
    var innerDeco = viewDecorations(this), outerDeco = computeDocDeco(this);
    var scroll = reconfigured ? "reset" : state.scrollToSelection > prev.scrollToSelection ? "to selection" : "preserve";
    var updateDoc = redraw || !this.docView.matchesNode(state.doc, outerDeco, innerDeco);
    if (updateDoc || !state.selection.eq(prev.selection)) {
      updateSel = true;
    }
    var oldScrollPos = scroll == "preserve" && updateSel && this.dom.style.overflowAnchor == null && storeScrollPos(this);
    if (updateSel) {
      this.domObserver.stop();
      var forceSelUpdate = updateDoc && (result.ie || result.chrome) && !this.composing && !prev.selection.empty && !state.selection.empty && selectionContextChanged(prev.selection, state.selection);
      if (updateDoc) {
        var chromeKludge = result.chrome ? this.trackWrites = this.root.getSelection().focusNode : null;
        if (redraw || !this.docView.update(state.doc, outerDeco, innerDeco, this)) {
          this.docView.updateOuterDeco([]);
          this.docView.destroy();
          this.docView = docViewDesc(state.doc, outerDeco, innerDeco, this.dom, this);
        }
        if (chromeKludge && !this.trackWrites) {
          forceSelUpdate = true;
        }
      }
      if (forceSelUpdate || !(this.mouseDown && this.domObserver.currentSelection.eq(this.root.getSelection()) && anchorInRightPlace(this))) {
        selectionToDOM(this, forceSelUpdate);
      } else {
        syncNodeSelection(this, state.selection);
        this.domObserver.setCurSelection();
      }
      this.domObserver.start();
    }
    this.updatePluginViews(prev);
    if (scroll == "reset") {
      this.dom.scrollTop = 0;
    } else if (scroll == "to selection") {
      var startDOM = this.root.getSelection().focusNode;
      if (this.someProp("handleScrollToSelection", function(f) {
        return f(this$1);
      }))
        ;
      else if (state.selection instanceof NodeSelection) {
        scrollRectIntoView(this, this.docView.domAfterPos(state.selection.from).getBoundingClientRect(), startDOM);
      } else {
        scrollRectIntoView(this, this.coordsAtPos(state.selection.head, 1), startDOM);
      }
    } else if (oldScrollPos) {
      resetScrollPos(oldScrollPos);
    }
  };
  EditorView.prototype.destroyPluginViews = function destroyPluginViews() {
    var view;
    while (view = this.pluginViews.pop()) {
      if (view.destroy) {
        view.destroy();
      }
    }
  };
  EditorView.prototype.updatePluginViews = function updatePluginViews(prevState) {
    if (!prevState || prevState.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins;
      this.destroyPluginViews();
      for (var i = 0; i < this.directPlugins.length; i++) {
        var plugin = this.directPlugins[i];
        if (plugin.spec.view) {
          this.pluginViews.push(plugin.spec.view(this));
        }
      }
      for (var i$1 = 0; i$1 < this.state.plugins.length; i$1++) {
        var plugin$1 = this.state.plugins[i$1];
        if (plugin$1.spec.view) {
          this.pluginViews.push(plugin$1.spec.view(this));
        }
      }
    } else {
      for (var i$2 = 0; i$2 < this.pluginViews.length; i$2++) {
        var pluginView = this.pluginViews[i$2];
        if (pluginView.update) {
          pluginView.update(this, prevState);
        }
      }
    }
  };
  EditorView.prototype.someProp = function someProp(propName, f) {
    var prop = this._props && this._props[propName], value;
    if (prop != null && (value = f ? f(prop) : prop)) {
      return value;
    }
    for (var i = 0; i < this.directPlugins.length; i++) {
      var prop$1 = this.directPlugins[i].props[propName];
      if (prop$1 != null && (value = f ? f(prop$1) : prop$1)) {
        return value;
      }
    }
    var plugins = this.state.plugins;
    if (plugins) {
      for (var i$1 = 0; i$1 < plugins.length; i$1++) {
        var prop$2 = plugins[i$1].props[propName];
        if (prop$2 != null && (value = f ? f(prop$2) : prop$2)) {
          return value;
        }
      }
    }
  };
  EditorView.prototype.hasFocus = function hasFocus() {
    return this.root.activeElement == this.dom;
  };
  EditorView.prototype.focus = function focus() {
    this.domObserver.stop();
    if (this.editable) {
      focusPreventScroll(this.dom);
    }
    selectionToDOM(this);
    this.domObserver.start();
  };
  prototypeAccessors$22.root.get = function() {
    var cached = this._root;
    if (cached == null) {
      for (var search = this.dom.parentNode; search; search = search.parentNode) {
        if (search.nodeType == 9 || search.nodeType == 11 && search.host) {
          if (!search.getSelection) {
            Object.getPrototypeOf(search).getSelection = function() {
              return document.getSelection();
            };
          }
          return this._root = search;
        }
      }
    }
    return cached || document;
  };
  EditorView.prototype.posAtCoords = function posAtCoords$1(coords) {
    return posAtCoords(this, coords);
  };
  EditorView.prototype.coordsAtPos = function coordsAtPos$1(pos, side) {
    if (side === void 0)
      side = 1;
    return coordsAtPos(this, pos, side);
  };
  EditorView.prototype.domAtPos = function domAtPos(pos, side) {
    if (side === void 0)
      side = 0;
    return this.docView.domFromPos(pos, side);
  };
  EditorView.prototype.nodeDOM = function nodeDOM(pos) {
    var desc = this.docView.descAt(pos);
    return desc ? desc.nodeDOM : null;
  };
  EditorView.prototype.posAtDOM = function posAtDOM(node4, offset3, bias) {
    if (bias === void 0)
      bias = -1;
    var pos = this.docView.posFromDOM(node4, offset3, bias);
    if (pos == null) {
      throw new RangeError("DOM position not inside the editor");
    }
    return pos;
  };
  EditorView.prototype.endOfTextblock = function endOfTextblock$1(dir, state) {
    return endOfTextblock(this, state || this.state, dir);
  };
  EditorView.prototype.destroy = function destroy3() {
    if (!this.docView) {
      return;
    }
    destroyInput(this);
    this.destroyPluginViews();
    if (this.mounted) {
      this.docView.update(this.state.doc, [], viewDecorations(this), this);
      this.dom.textContent = "";
    } else if (this.dom.parentNode) {
      this.dom.parentNode.removeChild(this.dom);
    }
    this.docView.destroy();
    this.docView = null;
  };
  prototypeAccessors$22.isDestroyed.get = function() {
    return this.docView == null;
  };
  EditorView.prototype.dispatchEvent = function dispatchEvent$1(event) {
    return dispatchEvent2(this, event);
  };
  EditorView.prototype.dispatch = function dispatch2(tr) {
    var dispatchTransaction = this._props.dispatchTransaction;
    if (dispatchTransaction) {
      dispatchTransaction.call(this, tr);
    } else {
      this.updateState(this.state.apply(tr));
    }
  };
  Object.defineProperties(EditorView.prototype, prototypeAccessors$22);
  function computeDocDeco(view) {
    var attrs = /* @__PURE__ */ Object.create(null);
    attrs.class = "ProseMirror";
    attrs.contenteditable = String(view.editable);
    attrs.translate = "no";
    view.someProp("attributes", function(value) {
      if (typeof value == "function") {
        value = value(view.state);
      }
      if (value) {
        for (var attr in value) {
          if (attr == "class") {
            attrs.class += " " + value[attr];
          }
          if (attr == "style") {
            attrs.style = (attrs.style ? attrs.style + ";" : "") + value[attr];
          } else if (!attrs[attr] && attr != "contenteditable" && attr != "nodeName") {
            attrs[attr] = String(value[attr]);
          }
        }
      }
    });
    return [Decoration.node(0, view.state.doc.content.size, attrs)];
  }
  function updateCursorWrapper(view) {
    if (view.markCursor) {
      var dom = document.createElement("img");
      dom.className = "ProseMirror-separator";
      dom.setAttribute("mark-placeholder", "true");
      dom.setAttribute("alt", "");
      view.cursorWrapper = { dom, deco: Decoration.widget(view.state.selection.head, dom, { raw: true, marks: view.markCursor }) };
    } else {
      view.cursorWrapper = null;
    }
  }
  function getEditable(view) {
    return !view.someProp("editable", function(value) {
      return value(view.state) === false;
    });
  }
  function selectionContextChanged(sel1, sel2) {
    var depth = Math.min(sel1.$anchor.sharedDepth(sel1.head), sel2.$anchor.sharedDepth(sel2.head));
    return sel1.$anchor.start(depth) != sel2.$anchor.start(depth);
  }
  function buildNodeViews(view) {
    var result2 = {};
    view.someProp("nodeViews", function(obj) {
      for (var prop in obj) {
        if (!Object.prototype.hasOwnProperty.call(result2, prop)) {
          result2[prop] = obj[prop];
        }
      }
    });
    return result2;
  }
  function changedNodeViews(a, b) {
    var nA = 0, nB = 0;
    for (var prop in a) {
      if (a[prop] != b[prop]) {
        return true;
      }
      nA++;
    }
    for (var _ in b) {
      nB++;
    }
    return nA != nB;
  }
  function checkStateComponent(plugin) {
    if (plugin.spec.state || plugin.spec.filterTransaction || plugin.spec.appendTransaction) {
      throw new RangeError("Plugins passed directly to the view must not have a state component");
    }
  }

  // node_modules/w3c-keyname/index.es.js
  var base = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
    229: "q"
  };
  var shift = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: '"',
    229: "Q"
  };
  var chrome = typeof navigator != "undefined" && /Chrome\/(\d+)/.exec(navigator.userAgent);
  var safari = typeof navigator != "undefined" && /Apple Computer/.test(navigator.vendor);
  var gecko = typeof navigator != "undefined" && /Gecko\/\d+/.test(navigator.userAgent);
  var mac2 = typeof navigator != "undefined" && /Mac/.test(navigator.platform);
  var ie = typeof navigator != "undefined" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
  var brokenModifierNames = chrome && (mac2 || +chrome[1] < 57) || gecko && mac2;
  for (i = 0; i < 10; i++)
    base[48 + i] = base[96 + i] = String(i);
  var i;
  for (i = 1; i <= 24; i++)
    base[i + 111] = "F" + i;
  var i;
  for (i = 65; i <= 90; i++) {
    base[i] = String.fromCharCode(i + 32);
    shift[i] = String.fromCharCode(i);
  }
  var i;
  for (code in base)
    if (!shift.hasOwnProperty(code))
      shift[code] = base[code];
  var code;
  function keyName(event) {
    var ignoreKey = brokenModifierNames && (event.ctrlKey || event.altKey || event.metaKey) || (safari || ie) && event.shiftKey && event.key && event.key.length == 1;
    var name = !ignoreKey && event.key || (event.shiftKey ? shift : base)[event.keyCode] || event.key || "Unidentified";
    if (name == "Esc")
      name = "Escape";
    if (name == "Del")
      name = "Delete";
    if (name == "Left")
      name = "ArrowLeft";
    if (name == "Up")
      name = "ArrowUp";
    if (name == "Right")
      name = "ArrowRight";
    if (name == "Down")
      name = "ArrowDown";
    return name;
  }

  // node_modules/prosemirror-keymap/dist/index.es.js
  var mac3 = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : false;
  function normalizeKeyName(name) {
    var parts = name.split(/-(?!$)/), result2 = parts[parts.length - 1];
    if (result2 == "Space") {
      result2 = " ";
    }
    var alt, ctrl, shift2, meta;
    for (var i = 0; i < parts.length - 1; i++) {
      var mod = parts[i];
      if (/^(cmd|meta|m)$/i.test(mod)) {
        meta = true;
      } else if (/^a(lt)?$/i.test(mod)) {
        alt = true;
      } else if (/^(c|ctrl|control)$/i.test(mod)) {
        ctrl = true;
      } else if (/^s(hift)?$/i.test(mod)) {
        shift2 = true;
      } else if (/^mod$/i.test(mod)) {
        if (mac3) {
          meta = true;
        } else {
          ctrl = true;
        }
      } else {
        throw new Error("Unrecognized modifier name: " + mod);
      }
    }
    if (alt) {
      result2 = "Alt-" + result2;
    }
    if (ctrl) {
      result2 = "Ctrl-" + result2;
    }
    if (meta) {
      result2 = "Meta-" + result2;
    }
    if (shift2) {
      result2 = "Shift-" + result2;
    }
    return result2;
  }
  function normalize(map15) {
    var copy5 = /* @__PURE__ */ Object.create(null);
    for (var prop in map15) {
      copy5[normalizeKeyName(prop)] = map15[prop];
    }
    return copy5;
  }
  function modifiers(name, event, shift2) {
    if (event.altKey) {
      name = "Alt-" + name;
    }
    if (event.ctrlKey) {
      name = "Ctrl-" + name;
    }
    if (event.metaKey) {
      name = "Meta-" + name;
    }
    if (shift2 !== false && event.shiftKey) {
      name = "Shift-" + name;
    }
    return name;
  }
  function keymap(bindings) {
    return new Plugin({ props: { handleKeyDown: keydownHandler(bindings) } });
  }
  function keydownHandler(bindings) {
    var map15 = normalize(bindings);
    return function(view, event) {
      var name = keyName(event), isChar = name.length == 1 && name != " ", baseName;
      var direct = map15[modifiers(name, event, !isChar)];
      if (direct && direct(view.state, view.dispatch, view)) {
        return true;
      }
      if (isChar && (event.shiftKey || event.altKey || event.metaKey || name.charCodeAt(0) > 127) && (baseName = base[event.keyCode]) && baseName != name) {
        var fromCode = map15[modifiers(baseName, event, true)];
        if (fromCode && fromCode(view.state, view.dispatch, view)) {
          return true;
        }
      } else if (isChar && event.shiftKey) {
        var withShift = map15[modifiers(name, event, true)];
        if (withShift && withShift(view.state, view.dispatch, view)) {
          return true;
        }
      }
      return false;
    };
  }

  // node_modules/@tiptap/core/dist/tiptap-core.esm.js
  function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  }
  function isPlainObject(value) {
    if (getType(value) !== "Object") {
      return false;
    }
    return value.constructor === Object && Object.getPrototypeOf(value) === Object.prototype;
  }
  function mergeDeep(target, source) {
    const output = { ...target };
    if (isPlainObject(target) && isPlainObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isPlainObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function callOrReturn(value, context = void 0, ...props) {
    if (isFunction(value)) {
      if (context) {
        return value.bind(context)(...props);
      }
      return value(...props);
    }
    return value;
  }
  function getExtensionField(extension, field, context) {
    if (extension.config[field] === void 0 && extension.parent) {
      return getExtensionField(extension.parent, field, context);
    }
    if (typeof extension.config[field] === "function") {
      const value = extension.config[field].bind({
        ...context,
        parent: extension.parent ? getExtensionField(extension.parent, field, context) : null
      });
      return value;
    }
    return extension.config[field];
  }
  var Extension = class {
    constructor(config = {}) {
      this.type = "extension";
      this.name = "extension";
      this.parent = null;
      this.child = null;
      this.config = {
        name: this.name,
        defaultOptions: {}
      };
      this.config = {
        ...this.config,
        ...config
      };
      this.name = this.config.name;
      if (config.defaultOptions) {
        console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`);
      }
      this.options = this.config.defaultOptions;
      if (this.config.addOptions) {
        this.options = callOrReturn(getExtensionField(this, "addOptions", {
          name: this.name
        }));
      }
      this.storage = callOrReturn(getExtensionField(this, "addStorage", {
        name: this.name,
        options: this.options
      })) || {};
    }
    static create(config = {}) {
      return new Extension(config);
    }
    configure(options = {}) {
      const extension = this.extend();
      extension.options = mergeDeep(this.options, options);
      extension.storage = callOrReturn(getExtensionField(extension, "addStorage", {
        name: extension.name,
        options: extension.options
      }));
      return extension;
    }
    extend(extendedConfig = {}) {
      const extension = new Extension(extendedConfig);
      extension.parent = this;
      this.child = extension;
      extension.name = extendedConfig.name ? extendedConfig.name : extension.parent.name;
      if (extendedConfig.defaultOptions) {
        console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${extension.name}".`);
      }
      extension.options = callOrReturn(getExtensionField(extension, "addOptions", {
        name: extension.name
      }));
      extension.storage = callOrReturn(getExtensionField(extension, "addStorage", {
        name: extension.name,
        options: extension.options
      }));
      return extension;
    }
  };
  function getTextBetween(startNode, range, options) {
    const { from: from4, to } = range;
    const { blockSeparator = "\n\n", textSerializers = {} } = options || {};
    let text2 = "";
    let separated = true;
    startNode.nodesBetween(from4, to, (node4, pos, parent, index2) => {
      var _a;
      const textSerializer = textSerializers === null || textSerializers === void 0 ? void 0 : textSerializers[node4.type.name];
      if (textSerializer) {
        if (node4.isBlock && !separated) {
          text2 += blockSeparator;
          separated = true;
        }
        text2 += textSerializer({
          node: node4,
          pos,
          parent,
          index: index2
        });
      } else if (node4.isText) {
        text2 += (_a = node4 === null || node4 === void 0 ? void 0 : node4.text) === null || _a === void 0 ? void 0 : _a.slice(Math.max(from4, pos) - pos, to - pos);
        separated = false;
      } else if (node4.isBlock && !separated) {
        text2 += blockSeparator;
        separated = true;
      }
    });
    return text2;
  }
  function getTextSeralizersFromSchema(schema) {
    return Object.fromEntries(Object.entries(schema.nodes).filter(([, node4]) => node4.spec.toText).map(([name, node4]) => [name, node4.spec.toText]));
  }
  var ClipboardTextSerializer = Extension.create({
    name: "clipboardTextSerializer",
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("clipboardTextSerializer"),
          props: {
            clipboardTextSerializer: () => {
              const { editor } = this;
              const { state, schema } = editor;
              const { doc: doc2, selection } = state;
              const { ranges } = selection;
              const from4 = Math.min(...ranges.map((range2) => range2.$from.pos));
              const to = Math.max(...ranges.map((range2) => range2.$to.pos));
              const textSerializers = getTextSeralizersFromSchema(schema);
              const range = { from: from4, to };
              return getTextBetween(doc2, range, {
                textSerializers
              });
            }
          }
        })
      ];
    }
  });
  var blur = () => ({ editor, view }) => {
    requestAnimationFrame(() => {
      var _a;
      if (!editor.isDestroyed) {
        view.dom.blur();
        (_a = window === null || window === void 0 ? void 0 : window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
      }
    });
    return true;
  };
  var blur$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    blur
  });
  var clearContent = (emitUpdate = false) => ({ commands }) => {
    return commands.setContent("", emitUpdate);
  };
  var clearContent$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    clearContent
  });
  var clearNodes = () => ({ state, tr, dispatch: dispatch3 }) => {
    const { selection } = tr;
    const { ranges } = selection;
    if (!dispatch3) {
      return true;
    }
    ranges.forEach(({ $from, $to }) => {
      state.doc.nodesBetween($from.pos, $to.pos, (node4, pos) => {
        if (node4.type.isText) {
          return;
        }
        const { doc: doc2, mapping } = tr;
        const $mappedFrom = doc2.resolve(mapping.map(pos));
        const $mappedTo = doc2.resolve(mapping.map(pos + node4.nodeSize));
        const nodeRange = $mappedFrom.blockRange($mappedTo);
        if (!nodeRange) {
          return;
        }
        const targetLiftDepth = liftTarget(nodeRange);
        if (node4.type.isTextblock) {
          const { defaultType } = $mappedFrom.parent.contentMatchAt($mappedFrom.index());
          tr.setNodeMarkup(nodeRange.start, defaultType);
        }
        if (targetLiftDepth || targetLiftDepth === 0) {
          tr.lift(nodeRange, targetLiftDepth);
        }
      });
    });
    return true;
  };
  var clearNodes$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    clearNodes
  });
  var command = (fn2) => (props) => {
    return fn2(props);
  };
  var command$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    command
  });
  var createParagraphNear2 = () => ({ state, dispatch: dispatch3 }) => {
    return createParagraphNear(state, dispatch3);
  };
  var createParagraphNear$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    createParagraphNear: createParagraphNear2
  });
  function getNodeType(nameOrType, schema) {
    if (typeof nameOrType === "string") {
      if (!schema.nodes[nameOrType]) {
        throw Error(`There is no node type named '${nameOrType}'. Maybe you forgot to add the extension?`);
      }
      return schema.nodes[nameOrType];
    }
    return nameOrType;
  }
  var deleteNode = (typeOrName) => ({ tr, state, dispatch: dispatch3 }) => {
    const type = getNodeType(typeOrName, state.schema);
    const $pos = tr.selection.$anchor;
    for (let depth = $pos.depth; depth > 0; depth -= 1) {
      const node4 = $pos.node(depth);
      if (node4.type === type) {
        if (dispatch3) {
          const from4 = $pos.before(depth);
          const to = $pos.after(depth);
          tr.delete(from4, to).scrollIntoView();
        }
        return true;
      }
    }
    return false;
  };
  var deleteNode$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    deleteNode
  });
  var deleteRange = (range) => ({ tr, dispatch: dispatch3 }) => {
    const { from: from4, to } = range;
    if (dispatch3) {
      tr.delete(from4, to);
    }
    return true;
  };
  var deleteRange$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    deleteRange
  });
  var deleteSelection2 = () => ({ state, dispatch: dispatch3 }) => {
    return deleteSelection(state, dispatch3);
  };
  var deleteSelection$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    deleteSelection: deleteSelection2
  });
  var enter2 = () => ({ commands }) => {
    return commands.keyboardShortcut("Enter");
  };
  var enter$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    enter: enter2
  });
  var exitCode2 = () => ({ state, dispatch: dispatch3 }) => {
    return exitCode(state, dispatch3);
  };
  var exitCode$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    exitCode: exitCode2
  });
  function getMarkType(nameOrType, schema) {
    if (typeof nameOrType === "string") {
      if (!schema.marks[nameOrType]) {
        throw Error(`There is no mark type named '${nameOrType}'. Maybe you forgot to add the extension?`);
      }
      return schema.marks[nameOrType];
    }
    return nameOrType;
  }
  function isRegExp(value) {
    return Object.prototype.toString.call(value) === "[object RegExp]";
  }
  function objectIncludes(object1, object2, options = { strict: true }) {
    const keys2 = Object.keys(object2);
    if (!keys2.length) {
      return true;
    }
    return keys2.every((key) => {
      if (options.strict) {
        return object2[key] === object1[key];
      }
      if (isRegExp(object2[key])) {
        return object2[key].test(object1[key]);
      }
      return object2[key] === object1[key];
    });
  }
  function findMarkInSet(marks2, type, attributes = {}) {
    return marks2.find((item) => {
      return item.type === type && objectIncludes(item.attrs, attributes);
    });
  }
  function isMarkInSet(marks2, type, attributes = {}) {
    return !!findMarkInSet(marks2, type, attributes);
  }
  function getMarkRange($pos, type, attributes = {}) {
    if (!$pos || !type) {
      return;
    }
    const start5 = $pos.parent.childAfter($pos.parentOffset);
    if (!start5.node) {
      return;
    }
    const mark3 = findMarkInSet(start5.node.marks, type, attributes);
    if (!mark3) {
      return;
    }
    let startIndex = $pos.index();
    let startPos = $pos.start() + start5.offset;
    let endIndex = startIndex + 1;
    let endPos = startPos + start5.node.nodeSize;
    findMarkInSet(start5.node.marks, type, attributes);
    while (startIndex > 0 && mark3.isInSet($pos.parent.child(startIndex - 1).marks)) {
      startIndex -= 1;
      startPos -= $pos.parent.child(startIndex).nodeSize;
    }
    while (endIndex < $pos.parent.childCount && isMarkInSet($pos.parent.child(endIndex).marks, type, attributes)) {
      endPos += $pos.parent.child(endIndex).nodeSize;
      endIndex += 1;
    }
    return {
      from: startPos,
      to: endPos
    };
  }
  var extendMarkRange = (typeOrName, attributes = {}) => ({ tr, state, dispatch: dispatch3 }) => {
    const type = getMarkType(typeOrName, state.schema);
    const { doc: doc2, selection } = tr;
    const { $from, from: from4, to } = selection;
    if (dispatch3) {
      const range = getMarkRange($from, type, attributes);
      if (range && range.from <= from4 && range.to >= to) {
        const newSelection = TextSelection.create(doc2, range.from, range.to);
        tr.setSelection(newSelection);
      }
    }
    return true;
  };
  var extendMarkRange$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    extendMarkRange
  });
  var first = (commands) => (props) => {
    const items = typeof commands === "function" ? commands(props) : commands;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i](props)) {
        return true;
      }
    }
    return false;
  };
  var first$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    first
  });
  function isClass(value) {
    var _a;
    if (((_a = value.constructor) === null || _a === void 0 ? void 0 : _a.toString().substring(0, 5)) !== "class") {
      return false;
    }
    return true;
  }
  function isObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) && !isClass(value);
  }
  function isTextSelection(value) {
    return isObject(value) && value instanceof TextSelection;
  }
  function isiOS() {
    return [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod"
    ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
  }
  function minMax(value = 0, min3 = 0, max3 = 0) {
    return Math.min(Math.max(value, min3), max3);
  }
  function resolveFocusPosition(doc2, position = null) {
    if (!position) {
      return null;
    }
    const selectionAtStart = Selection.atStart(doc2);
    const selectionAtEnd = Selection.atEnd(doc2);
    if (position === "start" || position === true) {
      return selectionAtStart;
    }
    if (position === "end") {
      return selectionAtEnd;
    }
    const minPos = selectionAtStart.from;
    const maxPos = selectionAtEnd.to;
    if (position === "all") {
      return TextSelection.create(doc2, minMax(0, minPos, maxPos), minMax(doc2.content.size, minPos, maxPos));
    }
    return TextSelection.create(doc2, minMax(position, minPos, maxPos), minMax(position, minPos, maxPos));
  }
  var focus2 = (position = null, options) => ({ editor, view, tr, dispatch: dispatch3 }) => {
    options = {
      scrollIntoView: true,
      ...options
    };
    const delayedFocus = () => {
      if (isiOS()) {
        view.dom.focus();
      }
      requestAnimationFrame(() => {
        if (!editor.isDestroyed) {
          view.focus();
          if (options === null || options === void 0 ? void 0 : options.scrollIntoView) {
            editor.commands.scrollIntoView();
          }
        }
      });
    };
    if (view.hasFocus() && position === null || position === false) {
      return true;
    }
    if (dispatch3 && position === null && !isTextSelection(editor.state.selection)) {
      delayedFocus();
      return true;
    }
    const selection = resolveFocusPosition(editor.state.doc, position) || editor.state.selection;
    const isSameSelection = editor.state.selection.eq(selection);
    if (dispatch3) {
      if (!isSameSelection) {
        tr.setSelection(selection);
      }
      if (isSameSelection && tr.storedMarks) {
        tr.setStoredMarks(tr.storedMarks);
      }
      delayedFocus();
    }
    return true;
  };
  var focus$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    focus: focus2
  });
  var forEach4 = (items, fn2) => (props) => {
    return items.every((item, index2) => fn2(item, { ...props, index: index2 }));
  };
  var forEach$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    forEach: forEach4
  });
  var insertContent = (value, options) => ({ tr, commands }) => {
    return commands.insertContentAt({ from: tr.selection.from, to: tr.selection.to }, value, options);
  };
  var insertContent$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    insertContent
  });
  function elementFromString(value) {
    const wrappedValue = `<body>${value}</body>`;
    return new window.DOMParser().parseFromString(wrappedValue, "text/html").body;
  }
  function createNodeFromContent(content2, schema, options) {
    options = {
      slice: true,
      parseOptions: {},
      ...options
    };
    if (typeof content2 === "object" && content2 !== null) {
      try {
        if (Array.isArray(content2)) {
          return Fragment.fromArray(content2.map((item) => schema.nodeFromJSON(item)));
        }
        return schema.nodeFromJSON(content2);
      } catch (error2) {
        console.warn("[tiptap warn]: Invalid content.", "Passed value:", content2, "Error:", error2);
        return createNodeFromContent("", schema, options);
      }
    }
    if (typeof content2 === "string") {
      const parser = DOMParser2.fromSchema(schema);
      return options.slice ? parser.parseSlice(elementFromString(content2), options.parseOptions).content : parser.parse(elementFromString(content2), options.parseOptions);
    }
    return createNodeFromContent("", schema, options);
  }
  function selectionToInsertionEnd2(tr, startLen, bias) {
    const last = tr.steps.length - 1;
    if (last < startLen) {
      return;
    }
    const step2 = tr.steps[last];
    if (!(step2 instanceof ReplaceStep || step2 instanceof ReplaceAroundStep)) {
      return;
    }
    const map15 = tr.mapping.maps[last];
    let end3 = 0;
    map15.forEach((_from, _to, _newFrom, newTo) => {
      if (end3 === 0) {
        end3 = newTo;
      }
    });
    tr.setSelection(Selection.near(tr.doc.resolve(end3), bias));
  }
  var isFragment = (nodeOrFragment) => {
    return nodeOrFragment.toString().startsWith("<");
  };
  var insertContentAt = (position, value, options) => ({ tr, dispatch: dispatch3, editor }) => {
    if (dispatch3) {
      options = {
        parseOptions: {},
        updateSelection: true,
        ...options
      };
      const content2 = createNodeFromContent(value, editor.schema, {
        parseOptions: {
          preserveWhitespace: "full",
          ...options.parseOptions
        }
      });
      if (content2.toString() === "<>") {
        return true;
      }
      let { from: from4, to } = typeof position === "number" ? { from: position, to: position } : position;
      let isOnlyTextContent = true;
      let isOnlyBlockContent = true;
      const nodes = isFragment(content2) ? content2 : [content2];
      nodes.forEach((node4) => {
        node4.check();
        isOnlyTextContent = isOnlyTextContent ? node4.isText && node4.marks.length === 0 : false;
        isOnlyBlockContent = isOnlyBlockContent ? node4.isBlock : false;
      });
      if (from4 === to && isOnlyBlockContent) {
        const { parent } = tr.doc.resolve(from4);
        const isEmptyTextBlock = parent.isTextblock && !parent.type.spec.code && !parent.childCount;
        if (isEmptyTextBlock) {
          from4 -= 1;
          to += 1;
        }
      }
      if (isOnlyTextContent) {
        tr.insertText(value, from4, to);
      } else {
        tr.replaceWith(from4, to, content2);
      }
      if (options.updateSelection) {
        selectionToInsertionEnd2(tr, tr.steps.length - 1, -1);
      }
    }
    return true;
  };
  var insertContentAt$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    insertContentAt
  });
  var joinBackward2 = () => ({ state, dispatch: dispatch3 }) => {
    return joinBackward(state, dispatch3);
  };
  var joinBackward$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    joinBackward: joinBackward2
  });
  var joinForward2 = () => ({ state, dispatch: dispatch3 }) => {
    return joinForward(state, dispatch3);
  };
  var joinForward$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    joinForward: joinForward2
  });
  function isMacOS() {
    return typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
  }
  function normalizeKeyName2(name) {
    const parts = name.split(/-(?!$)/);
    let result2 = parts[parts.length - 1];
    if (result2 === "Space") {
      result2 = " ";
    }
    let alt;
    let ctrl;
    let shift2;
    let meta;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const mod = parts[i];
      if (/^(cmd|meta|m)$/i.test(mod)) {
        meta = true;
      } else if (/^a(lt)?$/i.test(mod)) {
        alt = true;
      } else if (/^(c|ctrl|control)$/i.test(mod)) {
        ctrl = true;
      } else if (/^s(hift)?$/i.test(mod)) {
        shift2 = true;
      } else if (/^mod$/i.test(mod)) {
        if (isiOS() || isMacOS()) {
          meta = true;
        } else {
          ctrl = true;
        }
      } else {
        throw new Error(`Unrecognized modifier name: ${mod}`);
      }
    }
    if (alt) {
      result2 = `Alt-${result2}`;
    }
    if (ctrl) {
      result2 = `Ctrl-${result2}`;
    }
    if (meta) {
      result2 = `Meta-${result2}`;
    }
    if (shift2) {
      result2 = `Shift-${result2}`;
    }
    return result2;
  }
  var keyboardShortcut = (name) => ({ editor, view, tr, dispatch: dispatch3 }) => {
    const keys2 = normalizeKeyName2(name).split(/-(?!$)/);
    const key = keys2.find((item) => !["Alt", "Ctrl", "Meta", "Shift"].includes(item));
    const event = new KeyboardEvent("keydown", {
      key: key === "Space" ? " " : key,
      altKey: keys2.includes("Alt"),
      ctrlKey: keys2.includes("Ctrl"),
      metaKey: keys2.includes("Meta"),
      shiftKey: keys2.includes("Shift"),
      bubbles: true,
      cancelable: true
    });
    const capturedTransaction = editor.captureTransaction(() => {
      view.someProp("handleKeyDown", (f) => f(view, event));
    });
    capturedTransaction === null || capturedTransaction === void 0 ? void 0 : capturedTransaction.steps.forEach((step2) => {
      const newStep = step2.map(tr.mapping);
      if (newStep && dispatch3) {
        tr.maybeStep(newStep);
      }
    });
    return true;
  };
  var keyboardShortcut$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    keyboardShortcut
  });
  function isNodeActive(state, typeOrName, attributes = {}) {
    const { from: from4, to, empty: empty2 } = state.selection;
    const type = typeOrName ? getNodeType(typeOrName, state.schema) : null;
    const nodeRanges = [];
    state.doc.nodesBetween(from4, to, (node4, pos) => {
      if (node4.isText) {
        return;
      }
      const relativeFrom = Math.max(from4, pos);
      const relativeTo = Math.min(to, pos + node4.nodeSize);
      nodeRanges.push({
        node: node4,
        from: relativeFrom,
        to: relativeTo
      });
    });
    const selectionRange = to - from4;
    const matchedNodeRanges = nodeRanges.filter((nodeRange) => {
      if (!type) {
        return true;
      }
      return type.name === nodeRange.node.type.name;
    }).filter((nodeRange) => objectIncludes(nodeRange.node.attrs, attributes, { strict: false }));
    if (empty2) {
      return !!matchedNodeRanges.length;
    }
    const range = matchedNodeRanges.reduce((sum, nodeRange) => sum + nodeRange.to - nodeRange.from, 0);
    return range >= selectionRange;
  }
  var lift2 = (typeOrName, attributes = {}) => ({ state, dispatch: dispatch3 }) => {
    const type = getNodeType(typeOrName, state.schema);
    const isActive2 = isNodeActive(state, type, attributes);
    if (!isActive2) {
      return false;
    }
    return lift(state, dispatch3);
  };
  var lift$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    lift: lift2
  });
  var liftEmptyBlock2 = () => ({ state, dispatch: dispatch3 }) => {
    return liftEmptyBlock(state, dispatch3);
  };
  var liftEmptyBlock$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    liftEmptyBlock: liftEmptyBlock2
  });
  var liftListItem2 = (typeOrName) => ({ state, dispatch: dispatch3 }) => {
    const type = getNodeType(typeOrName, state.schema);
    return liftListItem(type)(state, dispatch3);
  };
  var liftListItem$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    liftListItem: liftListItem2
  });
  var newlineInCode2 = () => ({ state, dispatch: dispatch3 }) => {
    return newlineInCode(state, dispatch3);
  };
  var newlineInCode$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    newlineInCode: newlineInCode2
  });
  function getSchemaTypeNameByName(name, schema) {
    if (schema.nodes[name]) {
      return "node";
    }
    if (schema.marks[name]) {
      return "mark";
    }
    return null;
  }
  function deleteProps(obj, propOrProps) {
    const props = typeof propOrProps === "string" ? [propOrProps] : propOrProps;
    return Object.keys(obj).reduce((newObj, prop) => {
      if (!props.includes(prop)) {
        newObj[prop] = obj[prop];
      }
      return newObj;
    }, {});
  }
  var resetAttributes = (typeOrName, attributes) => ({ tr, state, dispatch: dispatch3 }) => {
    let nodeType2 = null;
    let markType = null;
    const schemaType = getSchemaTypeNameByName(typeof typeOrName === "string" ? typeOrName : typeOrName.name, state.schema);
    if (!schemaType) {
      return false;
    }
    if (schemaType === "node") {
      nodeType2 = getNodeType(typeOrName, state.schema);
    }
    if (schemaType === "mark") {
      markType = getMarkType(typeOrName, state.schema);
    }
    if (dispatch3) {
      tr.selection.ranges.forEach((range) => {
        state.doc.nodesBetween(range.$from.pos, range.$to.pos, (node4, pos) => {
          if (nodeType2 && nodeType2 === node4.type) {
            tr.setNodeMarkup(pos, void 0, deleteProps(node4.attrs, attributes));
          }
          if (markType && node4.marks.length) {
            node4.marks.forEach((mark3) => {
              if (markType === mark3.type) {
                tr.addMark(pos, pos + node4.nodeSize, markType.create(deleteProps(mark3.attrs, attributes)));
              }
            });
          }
        });
      });
    }
    return true;
  };
  var resetAttributes$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    resetAttributes
  });
  var scrollIntoView = () => ({ tr, dispatch: dispatch3 }) => {
    if (dispatch3) {
      tr.scrollIntoView();
    }
    return true;
  };
  var scrollIntoView$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    scrollIntoView
  });
  var selectAll2 = () => ({ tr, commands }) => {
    return commands.setTextSelection({
      from: 0,
      to: tr.doc.content.size
    });
  };
  var selectAll$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    selectAll: selectAll2
  });
  var selectNodeBackward2 = () => ({ state, dispatch: dispatch3 }) => {
    return selectNodeBackward(state, dispatch3);
  };
  var selectNodeBackward$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    selectNodeBackward: selectNodeBackward2
  });
  var selectNodeForward2 = () => ({ state, dispatch: dispatch3 }) => {
    return selectNodeForward(state, dispatch3);
  };
  var selectNodeForward$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    selectNodeForward: selectNodeForward2
  });
  var selectParentNode2 = () => ({ state, dispatch: dispatch3 }) => {
    return selectParentNode(state, dispatch3);
  };
  var selectParentNode$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    selectParentNode: selectParentNode2
  });
  var selectTextblockEnd2 = () => ({ state, dispatch: dispatch3 }) => {
    return selectTextblockEnd(state, dispatch3);
  };
  var selectTextblockEnd$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    selectTextblockEnd: selectTextblockEnd2
  });
  var selectTextblockStart2 = () => ({ state, dispatch: dispatch3 }) => {
    return selectTextblockStart(state, dispatch3);
  };
  var selectTextblockStart$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    selectTextblockStart: selectTextblockStart2
  });
  function createDocument(content2, schema, parseOptions = {}) {
    return createNodeFromContent(content2, schema, { slice: false, parseOptions });
  }
  var setContent = (content2, emitUpdate = false, parseOptions = {}) => ({ tr, editor, dispatch: dispatch3 }) => {
    const { doc: doc2 } = tr;
    const document2 = createDocument(content2, editor.schema, parseOptions);
    const selection = TextSelection.create(doc2, 0, doc2.content.size);
    if (dispatch3) {
      tr.setSelection(selection).replaceSelectionWith(document2, false).setMeta("preventUpdate", !emitUpdate);
    }
    return true;
  };
  var setContent$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    setContent
  });
  function getMarkAttributes(state, typeOrName) {
    const type = getMarkType(typeOrName, state.schema);
    const { from: from4, to, empty: empty2 } = state.selection;
    const marks2 = [];
    if (empty2) {
      if (state.storedMarks) {
        marks2.push(...state.storedMarks);
      }
      marks2.push(...state.selection.$head.marks());
    } else {
      state.doc.nodesBetween(from4, to, (node4) => {
        marks2.push(...node4.marks);
      });
    }
    const mark3 = marks2.find((markItem) => markItem.type.name === type.name);
    if (!mark3) {
      return {};
    }
    return { ...mark3.attrs };
  }
  var setMark = (typeOrName, attributes = {}) => ({ tr, state, dispatch: dispatch3 }) => {
    const { selection } = tr;
    const { empty: empty2, ranges } = selection;
    const type = getMarkType(typeOrName, state.schema);
    if (dispatch3) {
      if (empty2) {
        const oldAttributes = getMarkAttributes(state, type);
        tr.addStoredMark(type.create({
          ...oldAttributes,
          ...attributes
        }));
      } else {
        ranges.forEach((range) => {
          const from4 = range.$from.pos;
          const to = range.$to.pos;
          state.doc.nodesBetween(from4, to, (node4, pos) => {
            const trimmedFrom = Math.max(pos, from4);
            const trimmedTo = Math.min(pos + node4.nodeSize, to);
            const someHasMark = node4.marks.find((mark3) => mark3.type === type);
            if (someHasMark) {
              node4.marks.forEach((mark3) => {
                if (type === mark3.type) {
                  tr.addMark(trimmedFrom, trimmedTo, type.create({
                    ...mark3.attrs,
                    ...attributes
                  }));
                }
              });
            } else {
              tr.addMark(trimmedFrom, trimmedTo, type.create(attributes));
            }
          });
        });
      }
    }
    return true;
  };
  var setMark$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    setMark
  });
  var setMeta = (key, value) => ({ tr }) => {
    tr.setMeta(key, value);
    return true;
  };
  var setMeta$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    setMeta
  });
  var setNode = (typeOrName, attributes = {}) => ({ state, dispatch: dispatch3, chain }) => {
    const type = getNodeType(typeOrName, state.schema);
    if (!type.isTextblock) {
      console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.');
      return false;
    }
    return chain().command(({ commands }) => {
      const canSetBlock = setBlockType(type, attributes)(state);
      if (canSetBlock) {
        return true;
      }
      return commands.clearNodes();
    }).command(({ state: updatedState }) => {
      return setBlockType(type, attributes)(updatedState, dispatch3);
    }).run();
  };
  var setNode$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    setNode
  });
  var setNodeSelection = (position) => ({ tr, dispatch: dispatch3 }) => {
    if (dispatch3) {
      const { doc: doc2 } = tr;
      const minPos = Selection.atStart(doc2).from;
      const maxPos = Selection.atEnd(doc2).to;
      const resolvedPos = minMax(position, minPos, maxPos);
      const selection = NodeSelection.create(doc2, resolvedPos);
      tr.setSelection(selection);
    }
    return true;
  };
  var setNodeSelection$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    setNodeSelection
  });
  var setTextSelection = (position) => ({ tr, dispatch: dispatch3 }) => {
    if (dispatch3) {
      const { doc: doc2 } = tr;
      const { from: from4, to } = typeof position === "number" ? { from: position, to: position } : position;
      const minPos = TextSelection.atStart(doc2).from;
      const maxPos = TextSelection.atEnd(doc2).to;
      const resolvedFrom = minMax(from4, minPos, maxPos);
      const resolvedEnd = minMax(to, minPos, maxPos);
      const selection = TextSelection.create(doc2, resolvedFrom, resolvedEnd);
      tr.setSelection(selection);
    }
    return true;
  };
  var setTextSelection$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    setTextSelection
  });
  var sinkListItem2 = (typeOrName) => ({ state, dispatch: dispatch3 }) => {
    const type = getNodeType(typeOrName, state.schema);
    return sinkListItem(type)(state, dispatch3);
  };
  var sinkListItem$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    sinkListItem: sinkListItem2
  });
  function getSplittedAttributes(extensionAttributes, typeName, attributes) {
    return Object.fromEntries(Object.entries(attributes).filter(([name]) => {
      const extensionAttribute = extensionAttributes.find((item) => {
        return item.type === typeName && item.name === name;
      });
      if (!extensionAttribute) {
        return false;
      }
      return extensionAttribute.attribute.keepOnSplit;
    }));
  }
  function defaultBlockAt$1(match) {
    for (let i = 0; i < match.edgeCount; i += 1) {
      const { type } = match.edge(i);
      if (type.isTextblock && !type.hasRequiredAttrs()) {
        return type;
      }
    }
    return null;
  }
  function ensureMarks(state, splittableMarks) {
    const marks2 = state.storedMarks || state.selection.$to.parentOffset && state.selection.$from.marks();
    if (marks2) {
      const filteredMarks = marks2.filter((mark3) => splittableMarks === null || splittableMarks === void 0 ? void 0 : splittableMarks.includes(mark3.type.name));
      state.tr.ensureMarks(filteredMarks);
    }
  }
  var splitBlock2 = ({ keepMarks = true } = {}) => ({ tr, state, dispatch: dispatch3, editor }) => {
    const { selection, doc: doc2 } = tr;
    const { $from, $to } = selection;
    const extensionAttributes = editor.extensionManager.attributes;
    const newAttributes = getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs);
    if (selection instanceof NodeSelection && selection.node.isBlock) {
      if (!$from.parentOffset || !canSplit(doc2, $from.pos)) {
        return false;
      }
      if (dispatch3) {
        if (keepMarks) {
          ensureMarks(state, editor.extensionManager.splittableMarks);
        }
        tr.split($from.pos).scrollIntoView();
      }
      return true;
    }
    if (!$from.parent.isBlock) {
      return false;
    }
    if (dispatch3) {
      const atEnd2 = $to.parentOffset === $to.parent.content.size;
      if (selection instanceof TextSelection) {
        tr.deleteSelection();
      }
      const deflt = $from.depth === 0 ? void 0 : defaultBlockAt$1($from.node(-1).contentMatchAt($from.indexAfter(-1)));
      let types = atEnd2 && deflt ? [{
        type: deflt,
        attrs: newAttributes
      }] : void 0;
      let can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types);
      if (!types && !can && canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt ? [{ type: deflt }] : void 0)) {
        can = true;
        types = deflt ? [{
          type: deflt,
          attrs: newAttributes
        }] : void 0;
      }
      if (can) {
        tr.split(tr.mapping.map($from.pos), 1, types);
        if (deflt && !atEnd2 && !$from.parentOffset && $from.parent.type !== deflt) {
          const first2 = tr.mapping.map($from.before());
          const $first = tr.doc.resolve(first2);
          if ($from.node(-1).canReplaceWith($first.index(), $first.index() + 1, deflt)) {
            tr.setNodeMarkup(tr.mapping.map($from.before()), deflt);
          }
        }
      }
      if (keepMarks) {
        ensureMarks(state, editor.extensionManager.splittableMarks);
      }
      tr.scrollIntoView();
    }
    return true;
  };
  var splitBlock$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    splitBlock: splitBlock2
  });
  var splitListItem = (typeOrName) => ({ tr, state, dispatch: dispatch3, editor }) => {
    var _a;
    const type = getNodeType(typeOrName, state.schema);
    const { $from, $to } = state.selection;
    const node4 = state.selection.node;
    if (node4 && node4.isBlock || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }
    const grandParent = $from.node(-1);
    if (grandParent.type !== type) {
      return false;
    }
    const extensionAttributes = editor.extensionManager.attributes;
    if ($from.parent.content.size === 0 && $from.node(-1).childCount === $from.indexAfter(-1)) {
      if ($from.depth === 2 || $from.node(-3).type !== type || $from.index(-2) !== $from.node(-2).childCount - 1) {
        return false;
      }
      if (dispatch3) {
        let wrap = Fragment.empty;
        const depthBefore = $from.index(-1) ? 1 : $from.index(-2) ? 2 : 3;
        for (let d = $from.depth - depthBefore; d >= $from.depth - 3; d -= 1) {
          wrap = Fragment.from($from.node(d).copy(wrap));
        }
        const depthAfter = $from.indexAfter(-1) < $from.node(-2).childCount ? 1 : $from.indexAfter(-2) < $from.node(-3).childCount ? 2 : 3;
        const newNextTypeAttributes2 = getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs);
        const nextType2 = ((_a = type.contentMatch.defaultType) === null || _a === void 0 ? void 0 : _a.createAndFill(newNextTypeAttributes2)) || void 0;
        wrap = wrap.append(Fragment.from(type.createAndFill(null, nextType2) || void 0));
        const start5 = $from.before($from.depth - (depthBefore - 1));
        tr.replace(start5, $from.after(-depthAfter), new Slice(wrap, 4 - depthBefore, 0));
        let sel = -1;
        tr.doc.nodesBetween(start5, tr.doc.content.size, (n, pos) => {
          if (sel > -1) {
            return false;
          }
          if (n.isTextblock && n.content.size === 0) {
            sel = pos + 1;
          }
        });
        if (sel > -1) {
          tr.setSelection(TextSelection.near(tr.doc.resolve(sel)));
        }
        tr.scrollIntoView();
      }
      return true;
    }
    const nextType = $to.pos === $from.end() ? grandParent.contentMatchAt(0).defaultType : null;
    const newTypeAttributes = getSplittedAttributes(extensionAttributes, grandParent.type.name, grandParent.attrs);
    const newNextTypeAttributes = getSplittedAttributes(extensionAttributes, $from.node().type.name, $from.node().attrs);
    tr.delete($from.pos, $to.pos);
    const types = nextType ? [{ type, attrs: newTypeAttributes }, { type: nextType, attrs: newNextTypeAttributes }] : [{ type, attrs: newTypeAttributes }];
    if (!canSplit(tr.doc, $from.pos, 2)) {
      return false;
    }
    if (dispatch3) {
      tr.split($from.pos, 2, types).scrollIntoView();
    }
    return true;
  };
  var splitListItem$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    splitListItem
  });
  function findParentNodeClosestToPos($pos, predicate) {
    for (let i = $pos.depth; i > 0; i -= 1) {
      const node4 = $pos.node(i);
      if (predicate(node4)) {
        return {
          pos: i > 0 ? $pos.before(i) : 0,
          start: $pos.start(i),
          depth: i,
          node: node4
        };
      }
    }
  }
  function findParentNode(predicate) {
    return (selection) => findParentNodeClosestToPos(selection.$from, predicate);
  }
  function splitExtensions(extensions2) {
    const baseExtensions = extensions2.filter((extension) => extension.type === "extension");
    const nodeExtensions = extensions2.filter((extension) => extension.type === "node");
    const markExtensions = extensions2.filter((extension) => extension.type === "mark");
    return {
      baseExtensions,
      nodeExtensions,
      markExtensions
    };
  }
  function isList(name, extensions2) {
    const { nodeExtensions } = splitExtensions(extensions2);
    const extension = nodeExtensions.find((item) => item.name === name);
    if (!extension) {
      return false;
    }
    const context = {
      name: extension.name,
      options: extension.options,
      storage: extension.storage
    };
    const group = callOrReturn(getExtensionField(extension, "group", context));
    if (typeof group !== "string") {
      return false;
    }
    return group.split(" ").includes("list");
  }
  var joinListBackwards = (tr, listType) => {
    const list = findParentNode((node4) => node4.type === listType)(tr.selection);
    if (!list) {
      return true;
    }
    const before2 = tr.doc.resolve(Math.max(0, list.pos - 1)).before(list.depth);
    if (before2 === void 0) {
      return true;
    }
    const nodeBefore = tr.doc.nodeAt(before2);
    const canJoinBackwards = list.node.type === (nodeBefore === null || nodeBefore === void 0 ? void 0 : nodeBefore.type) && canJoin(tr.doc, list.pos);
    if (!canJoinBackwards) {
      return true;
    }
    tr.join(list.pos);
    return true;
  };
  var joinListForwards = (tr, listType) => {
    const list = findParentNode((node4) => node4.type === listType)(tr.selection);
    if (!list) {
      return true;
    }
    const after2 = tr.doc.resolve(list.start).after(list.depth);
    if (after2 === void 0) {
      return true;
    }
    const nodeAfter = tr.doc.nodeAt(after2);
    const canJoinForwards = list.node.type === (nodeAfter === null || nodeAfter === void 0 ? void 0 : nodeAfter.type) && canJoin(tr.doc, after2);
    if (!canJoinForwards) {
      return true;
    }
    tr.join(after2);
    return true;
  };
  var toggleList = (listTypeOrName, itemTypeOrName) => ({ editor, tr, state, dispatch: dispatch3, chain, commands, can }) => {
    const { extensions: extensions2 } = editor.extensionManager;
    const listType = getNodeType(listTypeOrName, state.schema);
    const itemType = getNodeType(itemTypeOrName, state.schema);
    const { selection } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);
    if (!range) {
      return false;
    }
    const parentList = findParentNode((node4) => isList(node4.type.name, extensions2))(selection);
    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      if (parentList.node.type === listType) {
        return commands.liftListItem(itemType);
      }
      if (isList(parentList.node.type.name, extensions2) && listType.validContent(parentList.node.content) && dispatch3) {
        return chain().command(() => {
          tr.setNodeMarkup(parentList.pos, listType);
          return true;
        }).command(() => joinListBackwards(tr, listType)).command(() => joinListForwards(tr, listType)).run();
      }
    }
    return chain().command(() => {
      const canWrapInList = can().wrapInList(listType);
      if (canWrapInList) {
        return true;
      }
      return commands.clearNodes();
    }).wrapInList(listType).command(() => joinListBackwards(tr, listType)).command(() => joinListForwards(tr, listType)).run();
  };
  var toggleList$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    toggleList
  });
  function isMarkActive(state, typeOrName, attributes = {}) {
    const { empty: empty2, ranges } = state.selection;
    const type = typeOrName ? getMarkType(typeOrName, state.schema) : null;
    if (empty2) {
      return !!(state.storedMarks || state.selection.$from.marks()).filter((mark3) => {
        if (!type) {
          return true;
        }
        return type.name === mark3.type.name;
      }).find((mark3) => objectIncludes(mark3.attrs, attributes, { strict: false }));
    }
    let selectionRange = 0;
    const markRanges = [];
    ranges.forEach(({ $from, $to }) => {
      const from4 = $from.pos;
      const to = $to.pos;
      state.doc.nodesBetween(from4, to, (node4, pos) => {
        if (!node4.isText && !node4.marks.length) {
          return;
        }
        const relativeFrom = Math.max(from4, pos);
        const relativeTo = Math.min(to, pos + node4.nodeSize);
        const range2 = relativeTo - relativeFrom;
        selectionRange += range2;
        markRanges.push(...node4.marks.map((mark3) => ({
          mark: mark3,
          from: relativeFrom,
          to: relativeTo
        })));
      });
    });
    if (selectionRange === 0) {
      return false;
    }
    const matchedRange = markRanges.filter((markRange) => {
      if (!type) {
        return true;
      }
      return type.name === markRange.mark.type.name;
    }).filter((markRange) => objectIncludes(markRange.mark.attrs, attributes, { strict: false })).reduce((sum, markRange) => sum + markRange.to - markRange.from, 0);
    const excludedRange = markRanges.filter((markRange) => {
      if (!type) {
        return true;
      }
      return markRange.mark.type !== type && markRange.mark.type.excludes(type);
    }).reduce((sum, markRange) => sum + markRange.to - markRange.from, 0);
    const range = matchedRange > 0 ? matchedRange + excludedRange : matchedRange;
    return range >= selectionRange;
  }
  var toggleMark = (typeOrName, attributes = {}, options = {}) => ({ state, commands }) => {
    const { extendEmptyMarkRange = false } = options;
    const type = getMarkType(typeOrName, state.schema);
    const isActive2 = isMarkActive(state, type, attributes);
    if (isActive2) {
      return commands.unsetMark(type, { extendEmptyMarkRange });
    }
    return commands.setMark(type, attributes);
  };
  var toggleMark$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    toggleMark
  });
  var toggleNode = (typeOrName, toggleTypeOrName, attributes = {}) => ({ state, commands }) => {
    const type = getNodeType(typeOrName, state.schema);
    const toggleType = getNodeType(toggleTypeOrName, state.schema);
    const isActive2 = isNodeActive(state, type, attributes);
    if (isActive2) {
      return commands.setNode(toggleType);
    }
    return commands.setNode(type, attributes);
  };
  var toggleNode$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    toggleNode
  });
  var toggleWrap = (typeOrName, attributes = {}) => ({ state, commands }) => {
    const type = getNodeType(typeOrName, state.schema);
    const isActive2 = isNodeActive(state, type, attributes);
    if (isActive2) {
      return commands.lift(type);
    }
    return commands.wrapIn(type, attributes);
  };
  var toggleWrap$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    toggleWrap
  });
  var undoInputRule = () => ({ state, dispatch: dispatch3 }) => {
    const plugins = state.plugins;
    for (let i = 0; i < plugins.length; i += 1) {
      const plugin = plugins[i];
      let undoable;
      if (plugin.spec.isInputRules && (undoable = plugin.getState(state))) {
        if (dispatch3) {
          const tr = state.tr;
          const toUndo = undoable.transform;
          for (let j = toUndo.steps.length - 1; j >= 0; j -= 1) {
            tr.step(toUndo.steps[j].invert(toUndo.docs[j]));
          }
          if (undoable.text) {
            const marks2 = tr.doc.resolve(undoable.from).marks();
            tr.replaceWith(undoable.from, undoable.to, state.schema.text(undoable.text, marks2));
          } else {
            tr.delete(undoable.from, undoable.to);
          }
        }
        return true;
      }
    }
    return false;
  };
  var undoInputRule$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    undoInputRule
  });
  var unsetAllMarks = () => ({ tr, dispatch: dispatch3 }) => {
    const { selection } = tr;
    const { empty: empty2, ranges } = selection;
    if (empty2) {
      return true;
    }
    if (dispatch3) {
      ranges.forEach((range) => {
        tr.removeMark(range.$from.pos, range.$to.pos);
      });
    }
    return true;
  };
  var unsetAllMarks$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    unsetAllMarks
  });
  var unsetMark = (typeOrName, options = {}) => ({ tr, state, dispatch: dispatch3 }) => {
    var _a;
    const { extendEmptyMarkRange = false } = options;
    const { selection } = tr;
    const type = getMarkType(typeOrName, state.schema);
    const { $from, empty: empty2, ranges } = selection;
    if (!dispatch3) {
      return true;
    }
    if (empty2 && extendEmptyMarkRange) {
      let { from: from4, to } = selection;
      const attrs = (_a = $from.marks().find((mark3) => mark3.type === type)) === null || _a === void 0 ? void 0 : _a.attrs;
      const range = getMarkRange($from, type, attrs);
      if (range) {
        from4 = range.from;
        to = range.to;
      }
      tr.removeMark(from4, to, type);
    } else {
      ranges.forEach((range) => {
        tr.removeMark(range.$from.pos, range.$to.pos, type);
      });
    }
    tr.removeStoredMark(type);
    return true;
  };
  var unsetMark$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    unsetMark
  });
  var updateAttributes = (typeOrName, attributes = {}) => ({ tr, state, dispatch: dispatch3 }) => {
    let nodeType2 = null;
    let markType = null;
    const schemaType = getSchemaTypeNameByName(typeof typeOrName === "string" ? typeOrName : typeOrName.name, state.schema);
    if (!schemaType) {
      return false;
    }
    if (schemaType === "node") {
      nodeType2 = getNodeType(typeOrName, state.schema);
    }
    if (schemaType === "mark") {
      markType = getMarkType(typeOrName, state.schema);
    }
    if (dispatch3) {
      tr.selection.ranges.forEach((range) => {
        const from4 = range.$from.pos;
        const to = range.$to.pos;
        state.doc.nodesBetween(from4, to, (node4, pos) => {
          if (nodeType2 && nodeType2 === node4.type) {
            tr.setNodeMarkup(pos, void 0, {
              ...node4.attrs,
              ...attributes
            });
          }
          if (markType && node4.marks.length) {
            node4.marks.forEach((mark3) => {
              if (markType === mark3.type) {
                const trimmedFrom = Math.max(pos, from4);
                const trimmedTo = Math.min(pos + node4.nodeSize, to);
                tr.addMark(trimmedFrom, trimmedTo, markType.create({
                  ...mark3.attrs,
                  ...attributes
                }));
              }
            });
          }
        });
      });
    }
    return true;
  };
  var updateAttributes$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    updateAttributes
  });
  var wrapIn2 = (typeOrName, attributes = {}) => ({ state, dispatch: dispatch3 }) => {
    const type = getNodeType(typeOrName, state.schema);
    return wrapIn(type, attributes)(state, dispatch3);
  };
  var wrapIn$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    wrapIn: wrapIn2
  });
  var wrapInList2 = (typeOrName, attributes = {}) => ({ state, dispatch: dispatch3 }) => {
    const type = getNodeType(typeOrName, state.schema);
    return wrapInList(type, attributes)(state, dispatch3);
  };
  var wrapInList$1 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    wrapInList: wrapInList2
  });
  var Commands = Extension.create({
    name: "commands",
    addCommands() {
      return {
        ...blur$1,
        ...clearContent$1,
        ...clearNodes$1,
        ...command$1,
        ...createParagraphNear$1,
        ...deleteNode$1,
        ...deleteRange$1,
        ...deleteSelection$1,
        ...enter$1,
        ...exitCode$1,
        ...extendMarkRange$1,
        ...first$1,
        ...focus$1,
        ...forEach$1,
        ...insertContent$1,
        ...insertContentAt$1,
        ...joinBackward$1,
        ...joinForward$1,
        ...keyboardShortcut$1,
        ...lift$1,
        ...liftEmptyBlock$1,
        ...liftListItem$1,
        ...newlineInCode$1,
        ...resetAttributes$1,
        ...scrollIntoView$1,
        ...selectAll$1,
        ...selectNodeBackward$1,
        ...selectNodeForward$1,
        ...selectParentNode$1,
        ...selectTextblockEnd$1,
        ...selectTextblockStart$1,
        ...setContent$1,
        ...setMark$1,
        ...setMeta$1,
        ...setNode$1,
        ...setNodeSelection$1,
        ...setTextSelection$1,
        ...sinkListItem$1,
        ...splitBlock$1,
        ...splitListItem$1,
        ...toggleList$1,
        ...toggleMark$1,
        ...toggleNode$1,
        ...toggleWrap$1,
        ...undoInputRule$1,
        ...unsetAllMarks$1,
        ...unsetMark$1,
        ...updateAttributes$1,
        ...wrapIn$1,
        ...wrapInList$1
      };
    }
  });
  var Editable = Extension.create({
    name: "editable",
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("editable"),
          props: {
            editable: () => this.editor.options.editable
          }
        })
      ];
    }
  });
  var FocusEvents = Extension.create({
    name: "focusEvents",
    addProseMirrorPlugins() {
      const { editor } = this;
      return [
        new Plugin({
          key: new PluginKey("focusEvents"),
          props: {
            handleDOMEvents: {
              focus: (view, event) => {
                editor.isFocused = true;
                const transaction = editor.state.tr.setMeta("focus", { event }).setMeta("addToHistory", false);
                view.dispatch(transaction);
                return false;
              },
              blur: (view, event) => {
                editor.isFocused = false;
                const transaction = editor.state.tr.setMeta("blur", { event }).setMeta("addToHistory", false);
                view.dispatch(transaction);
                return false;
              }
            }
          }
        })
      ];
    }
  });
  function createChainableState(config) {
    const { state, transaction } = config;
    let { selection } = transaction;
    let { doc: doc2 } = transaction;
    let { storedMarks } = transaction;
    return {
      ...state,
      schema: state.schema,
      plugins: state.plugins,
      apply: state.apply.bind(state),
      applyTransaction: state.applyTransaction.bind(state),
      reconfigure: state.reconfigure.bind(state),
      toJSON: state.toJSON.bind(state),
      get storedMarks() {
        return storedMarks;
      },
      get selection() {
        return selection;
      },
      get doc() {
        return doc2;
      },
      get tr() {
        selection = transaction.selection;
        doc2 = transaction.doc;
        storedMarks = transaction.storedMarks;
        return transaction;
      }
    };
  }
  var CommandManager = class {
    constructor(props) {
      this.editor = props.editor;
      this.rawCommands = this.editor.extensionManager.commands;
      this.customState = props.state;
    }
    get hasCustomState() {
      return !!this.customState;
    }
    get state() {
      return this.customState || this.editor.state;
    }
    get commands() {
      const { rawCommands, editor, state } = this;
      const { view } = editor;
      const { tr } = state;
      const props = this.buildProps(tr);
      return Object.fromEntries(Object.entries(rawCommands).map(([name, command2]) => {
        const method = (...args) => {
          const callback = command2(...args)(props);
          if (!tr.getMeta("preventDispatch") && !this.hasCustomState) {
            view.dispatch(tr);
          }
          return callback;
        };
        return [name, method];
      }));
    }
    get chain() {
      return () => this.createChain();
    }
    get can() {
      return () => this.createCan();
    }
    createChain(startTr, shouldDispatch = true) {
      const { rawCommands, editor, state } = this;
      const { view } = editor;
      const callbacks = [];
      const hasStartTransaction = !!startTr;
      const tr = startTr || state.tr;
      const run2 = () => {
        if (!hasStartTransaction && shouldDispatch && !tr.getMeta("preventDispatch") && !this.hasCustomState) {
          view.dispatch(tr);
        }
        return callbacks.every((callback) => callback === true);
      };
      const chain = {
        ...Object.fromEntries(Object.entries(rawCommands).map(([name, command2]) => {
          const chainedCommand = (...args) => {
            const props = this.buildProps(tr, shouldDispatch);
            const callback = command2(...args)(props);
            callbacks.push(callback);
            return chain;
          };
          return [name, chainedCommand];
        })),
        run: run2
      };
      return chain;
    }
    createCan(startTr) {
      const { rawCommands, state } = this;
      const dispatch3 = void 0;
      const tr = startTr || state.tr;
      const props = this.buildProps(tr, dispatch3);
      const formattedCommands = Object.fromEntries(Object.entries(rawCommands).map(([name, command2]) => {
        return [name, (...args) => command2(...args)({ ...props, dispatch: dispatch3 })];
      }));
      return {
        ...formattedCommands,
        chain: () => this.createChain(tr, dispatch3)
      };
    }
    buildProps(tr, shouldDispatch = true) {
      const { rawCommands, editor, state } = this;
      const { view } = editor;
      if (state.storedMarks) {
        tr.setStoredMarks(state.storedMarks);
      }
      const props = {
        tr,
        editor,
        view,
        state: createChainableState({
          state,
          transaction: tr
        }),
        dispatch: shouldDispatch ? () => void 0 : void 0,
        chain: () => this.createChain(tr),
        can: () => this.createCan(tr),
        get commands() {
          return Object.fromEntries(Object.entries(rawCommands).map(([name, command2]) => {
            return [name, (...args) => command2(...args)(props)];
          }));
        }
      };
      return props;
    }
  };
  var Keymap = Extension.create({
    name: "keymap",
    addKeyboardShortcuts() {
      const handleBackspace = () => this.editor.commands.first(({ commands }) => [
        () => commands.undoInputRule(),
        () => commands.command(({ tr }) => {
          const { selection, doc: doc2 } = tr;
          const { empty: empty2, $anchor } = selection;
          const { pos, parent } = $anchor;
          const isAtStart = Selection.atStart(doc2).from === pos;
          if (!empty2 || !isAtStart || !parent.type.isTextblock || parent.textContent.length) {
            return false;
          }
          return commands.clearNodes();
        }),
        () => commands.deleteSelection(),
        () => commands.joinBackward(),
        () => commands.selectNodeBackward()
      ]);
      const handleDelete = () => this.editor.commands.first(({ commands }) => [
        () => commands.deleteSelection(),
        () => commands.joinForward(),
        () => commands.selectNodeForward()
      ]);
      const handleEnter = () => this.editor.commands.first(({ commands }) => [
        () => commands.newlineInCode(),
        () => commands.createParagraphNear(),
        () => commands.liftEmptyBlock(),
        () => commands.splitBlock()
      ]);
      const baseKeymap = {
        Enter: handleEnter,
        "Mod-Enter": () => this.editor.commands.exitCode(),
        Backspace: handleBackspace,
        "Mod-Backspace": handleBackspace,
        "Shift-Backspace": handleBackspace,
        Delete: handleDelete,
        "Mod-Delete": handleDelete,
        "Mod-a": () => this.editor.commands.selectAll()
      };
      const pcKeymap = {
        ...baseKeymap,
        Home: () => this.editor.commands.selectTextblockStart(),
        End: () => this.editor.commands.selectTextblockEnd()
      };
      const macKeymap = {
        ...baseKeymap,
        "Ctrl-h": handleBackspace,
        "Alt-Backspace": handleBackspace,
        "Ctrl-d": handleDelete,
        "Ctrl-Alt-Backspace": handleDelete,
        "Alt-Delete": handleDelete,
        "Alt-d": handleDelete,
        "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
        "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
      };
      if (isiOS() || isMacOS()) {
        return macKeymap;
      }
      return pcKeymap;
    },
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("clearDocument"),
          appendTransaction: (transactions, oldState, newState) => {
            const docChanges = transactions.some((transaction) => transaction.docChanged) && !oldState.doc.eq(newState.doc);
            if (!docChanges) {
              return;
            }
            const { empty: empty2, from: from4, to } = oldState.selection;
            const allFrom = Selection.atStart(oldState.doc).from;
            const allEnd = Selection.atEnd(oldState.doc).to;
            const allWasSelected = from4 === allFrom && to === allEnd;
            const isEmpty = newState.doc.textBetween(0, newState.doc.content.size, " ", " ").length === 0;
            if (empty2 || !allWasSelected || !isEmpty) {
              return;
            }
            const tr = newState.tr;
            const state = createChainableState({
              state: newState,
              transaction: tr
            });
            const { commands } = new CommandManager({
              editor: this.editor,
              state
            });
            commands.clearNodes();
            if (!tr.steps.length) {
              return;
            }
            return tr;
          }
        })
      ];
    }
  });
  var Tabindex = Extension.create({
    name: "tabindex",
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("tabindex"),
          props: {
            attributes: () => {
              if (this.editor.isEditable) {
                return {
                  tabindex: "0"
                };
              }
            }
          }
        })
      ];
    }
  });
  var extensions = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    ClipboardTextSerializer,
    Commands,
    Editable,
    FocusEvents,
    Keymap,
    Tabindex
  });
  function getNodeAttributes(state, typeOrName) {
    const type = getNodeType(typeOrName, state.schema);
    const { from: from4, to } = state.selection;
    const nodes = [];
    state.doc.nodesBetween(from4, to, (node5) => {
      nodes.push(node5);
    });
    const node4 = nodes.reverse().find((nodeItem) => nodeItem.type.name === type.name);
    if (!node4) {
      return {};
    }
    return { ...node4.attrs };
  }
  function getAttributes(state, typeOrName) {
    const schemaType = getSchemaTypeNameByName(typeof typeOrName === "string" ? typeOrName : typeOrName.name, state.schema);
    if (schemaType === "node") {
      return getNodeAttributes(state, typeOrName);
    }
    if (schemaType === "mark") {
      return getMarkAttributes(state, typeOrName);
    }
    return {};
  }
  function isActive(state, name, attributes = {}) {
    if (!name) {
      return isNodeActive(state, null, attributes) || isMarkActive(state, null, attributes);
    }
    const schemaType = getSchemaTypeNameByName(name, state.schema);
    if (schemaType === "node") {
      return isNodeActive(state, name, attributes);
    }
    if (schemaType === "mark") {
      return isMarkActive(state, name, attributes);
    }
    return false;
  }
  function getHTMLFromFragment(fragment, schema) {
    const documentFragment = DOMSerializer.fromSchema(schema).serializeFragment(fragment);
    const temporaryDocument = document.implementation.createHTMLDocument();
    const container = temporaryDocument.createElement("div");
    container.appendChild(documentFragment);
    return container.innerHTML;
  }
  function getText(node4, options) {
    const range = {
      from: 0,
      to: node4.content.size
    };
    return getTextBetween(node4, range, options);
  }
  function isNodeEmpty(node4) {
    var _a;
    const defaultContent = (_a = node4.type.createAndFill()) === null || _a === void 0 ? void 0 : _a.toJSON();
    const content2 = node4.toJSON();
    return JSON.stringify(defaultContent) === JSON.stringify(content2);
  }
  function createStyleTag(style2) {
    const tipTapStyleTag = document.querySelector("style[data-tiptap-style]");
    if (tipTapStyleTag !== null) {
      return tipTapStyleTag;
    }
    const styleNode = document.createElement("style");
    styleNode.setAttribute("data-tiptap-style", "");
    styleNode.innerHTML = style2;
    document.getElementsByTagName("head")[0].appendChild(styleNode);
    return styleNode;
  }
  var InputRule = class {
    constructor(config) {
      this.find = config.find;
      this.handler = config.handler;
    }
  };
  var inputRuleMatcherHandler = (text2, find2) => {
    if (isRegExp(find2)) {
      return find2.exec(text2);
    }
    const inputRuleMatch = find2(text2);
    if (!inputRuleMatch) {
      return null;
    }
    const result2 = [];
    result2.push(inputRuleMatch.text);
    result2.index = inputRuleMatch.index;
    result2.input = text2;
    result2.data = inputRuleMatch.data;
    if (inputRuleMatch.replaceWith) {
      if (!inputRuleMatch.text.includes(inputRuleMatch.replaceWith)) {
        console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".');
      }
      result2.push(inputRuleMatch.replaceWith);
    }
    return result2;
  };
  function run$1(config) {
    var _a;
    const { editor, from: from4, to, text: text2, rules, plugin } = config;
    const { view } = editor;
    if (view.composing) {
      return false;
    }
    const $from = view.state.doc.resolve(from4);
    if ($from.parent.type.spec.code || !!((_a = $from.nodeBefore || $from.nodeAfter) === null || _a === void 0 ? void 0 : _a.marks.find((mark3) => mark3.type.spec.code))) {
      return false;
    }
    let matched = false;
    const maxMatch = 500;
    const textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - maxMatch), $from.parentOffset, void 0, " ") + text2;
    rules.forEach((rule) => {
      if (matched) {
        return;
      }
      const match = inputRuleMatcherHandler(textBefore, rule.find);
      if (!match) {
        return;
      }
      const tr = view.state.tr;
      const state = createChainableState({
        state: view.state,
        transaction: tr
      });
      const range = {
        from: from4 - (match[0].length - text2.length),
        to
      };
      const { commands, chain, can } = new CommandManager({
        editor,
        state
      });
      const handler = rule.handler({
        state,
        range,
        match,
        commands,
        chain,
        can
      });
      if (handler === null || !tr.steps.length) {
        return;
      }
      tr.setMeta(plugin, {
        transform: tr,
        from: from4,
        to,
        text: text2
      });
      view.dispatch(tr);
      matched = true;
    });
    return matched;
  }
  function inputRulesPlugin(props) {
    const { editor, rules } = props;
    const plugin = new Plugin({
      state: {
        init() {
          return null;
        },
        apply(tr, prev) {
          const stored = tr.getMeta(this);
          if (stored) {
            return stored;
          }
          return tr.selectionSet || tr.docChanged ? null : prev;
        }
      },
      props: {
        handleTextInput(view, from4, to, text2) {
          return run$1({
            editor,
            from: from4,
            to,
            text: text2,
            rules,
            plugin
          });
        },
        handleDOMEvents: {
          compositionend: (view) => {
            setTimeout(() => {
              const { $cursor } = view.state.selection;
              if ($cursor) {
                run$1({
                  editor,
                  from: $cursor.pos,
                  to: $cursor.pos,
                  text: "",
                  rules,
                  plugin
                });
              }
            });
            return false;
          }
        },
        handleKeyDown(view, event) {
          if (event.key !== "Enter") {
            return false;
          }
          const { $cursor } = view.state.selection;
          if ($cursor) {
            return run$1({
              editor,
              from: $cursor.pos,
              to: $cursor.pos,
              text: "\n",
              rules,
              plugin
            });
          }
          return false;
        }
      },
      isInputRules: true
    });
    return plugin;
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  var PasteRule = class {
    constructor(config) {
      this.find = config.find;
      this.handler = config.handler;
    }
  };
  var pasteRuleMatcherHandler = (text2, find2) => {
    if (isRegExp(find2)) {
      return [...text2.matchAll(find2)];
    }
    const matches2 = find2(text2);
    if (!matches2) {
      return [];
    }
    return matches2.map((pasteRuleMatch) => {
      const result2 = [];
      result2.push(pasteRuleMatch.text);
      result2.index = pasteRuleMatch.index;
      result2.input = text2;
      result2.data = pasteRuleMatch.data;
      if (pasteRuleMatch.replaceWith) {
        if (!pasteRuleMatch.text.includes(pasteRuleMatch.replaceWith)) {
          console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".');
        }
        result2.push(pasteRuleMatch.replaceWith);
      }
      return result2;
    });
  };
  function run(config) {
    const { editor, state, from: from4, to, rule } = config;
    const { commands, chain, can } = new CommandManager({
      editor,
      state
    });
    const handlers2 = [];
    state.doc.nodesBetween(from4, to, (node4, pos) => {
      if (!node4.isTextblock || node4.type.spec.code) {
        return;
      }
      const resolvedFrom = Math.max(from4, pos);
      const resolvedTo = Math.min(to, pos + node4.content.size);
      const textToMatch = node4.textBetween(resolvedFrom - pos, resolvedTo - pos, void 0, "\uFFFC");
      const matches2 = pasteRuleMatcherHandler(textToMatch, rule.find);
      matches2.forEach((match) => {
        if (match.index === void 0) {
          return;
        }
        const start5 = resolvedFrom + match.index + 1;
        const end3 = start5 + match[0].length;
        const range = {
          from: state.tr.mapping.map(start5),
          to: state.tr.mapping.map(end3)
        };
        const handler = rule.handler({
          state,
          range,
          match,
          commands,
          chain,
          can
        });
        handlers2.push(handler);
      });
    });
    const success = handlers2.every((handler) => handler !== null);
    return success;
  }
  function pasteRulesPlugin(props) {
    const { editor, rules } = props;
    let dragSourceElement = null;
    let isPastedFromProseMirror = false;
    let isDroppedFromProseMirror = false;
    const plugins = rules.map((rule) => {
      return new Plugin({
        view(view) {
          const handleDragstart = (event) => {
            var _a;
            dragSourceElement = ((_a = view.dom.parentElement) === null || _a === void 0 ? void 0 : _a.contains(event.target)) ? view.dom.parentElement : null;
          };
          window.addEventListener("dragstart", handleDragstart);
          return {
            destroy() {
              window.removeEventListener("dragstart", handleDragstart);
            }
          };
        },
        props: {
          handleDOMEvents: {
            drop: (view) => {
              isDroppedFromProseMirror = dragSourceElement === view.dom.parentElement;
              return false;
            },
            paste: (view, event) => {
              var _a;
              const html = (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.getData("text/html");
              isPastedFromProseMirror = !!(html === null || html === void 0 ? void 0 : html.includes("data-pm-slice"));
              return false;
            }
          }
        },
        appendTransaction: (transactions, oldState, state) => {
          const transaction = transactions[0];
          const isPaste = transaction.getMeta("uiEvent") === "paste" && !isPastedFromProseMirror;
          const isDrop = transaction.getMeta("uiEvent") === "drop" && !isDroppedFromProseMirror;
          if (!isPaste && !isDrop) {
            return;
          }
          const from4 = oldState.doc.content.findDiffStart(state.doc.content);
          const to = oldState.doc.content.findDiffEnd(state.doc.content);
          if (!isNumber(from4) || !to || from4 === to.b) {
            return;
          }
          const tr = state.tr;
          const chainableState = createChainableState({
            state,
            transaction: tr
          });
          const handler = run({
            editor,
            state: chainableState,
            from: Math.max(from4 - 1, 0),
            to: to.b,
            rule
          });
          if (!handler || !tr.steps.length) {
            return;
          }
          return tr;
        }
      });
    });
    return plugins;
  }
  function getAttributesFromExtensions(extensions2) {
    const extensionAttributes = [];
    const { nodeExtensions, markExtensions } = splitExtensions(extensions2);
    const nodeAndMarkExtensions = [...nodeExtensions, ...markExtensions];
    const defaultAttribute = {
      default: null,
      rendered: true,
      renderHTML: null,
      parseHTML: null,
      keepOnSplit: true
    };
    extensions2.forEach((extension) => {
      const context = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage
      };
      const addGlobalAttributes = getExtensionField(extension, "addGlobalAttributes", context);
      if (!addGlobalAttributes) {
        return;
      }
      const globalAttributes = addGlobalAttributes();
      globalAttributes.forEach((globalAttribute) => {
        globalAttribute.types.forEach((type) => {
          Object.entries(globalAttribute.attributes).forEach(([name, attribute]) => {
            extensionAttributes.push({
              type,
              name,
              attribute: {
                ...defaultAttribute,
                ...attribute
              }
            });
          });
        });
      });
    });
    nodeAndMarkExtensions.forEach((extension) => {
      const context = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage
      };
      const addAttributes = getExtensionField(extension, "addAttributes", context);
      if (!addAttributes) {
        return;
      }
      const attributes = addAttributes();
      Object.entries(attributes).forEach(([name, attribute]) => {
        extensionAttributes.push({
          type: extension.name,
          name,
          attribute: {
            ...defaultAttribute,
            ...attribute
          }
        });
      });
    });
    return extensionAttributes;
  }
  function mergeAttributes(...objects) {
    return objects.filter((item) => !!item).reduce((items, item) => {
      const mergedAttributes = { ...items };
      Object.entries(item).forEach(([key, value]) => {
        const exists = mergedAttributes[key];
        if (!exists) {
          mergedAttributes[key] = value;
          return;
        }
        if (key === "class") {
          mergedAttributes[key] = [mergedAttributes[key], value].join(" ");
        } else if (key === "style") {
          mergedAttributes[key] = [mergedAttributes[key], value].join("; ");
        } else {
          mergedAttributes[key] = value;
        }
      });
      return mergedAttributes;
    }, {});
  }
  function getRenderedAttributes(nodeOrMark, extensionAttributes) {
    return extensionAttributes.filter((item) => item.attribute.rendered).map((item) => {
      if (!item.attribute.renderHTML) {
        return {
          [item.name]: nodeOrMark.attrs[item.name]
        };
      }
      return item.attribute.renderHTML(nodeOrMark.attrs) || {};
    }).reduce((attributes, attribute) => mergeAttributes(attributes, attribute), {});
  }
  function isEmptyObject(value = {}) {
    return Object.keys(value).length === 0 && value.constructor === Object;
  }
  function fromString(value) {
    if (typeof value !== "string") {
      return value;
    }
    if (value.match(/^[+-]?(?:\d*\.)?\d+$/)) {
      return Number(value);
    }
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    return value;
  }
  function injectExtensionAttributesToParseRule(parseRule2, extensionAttributes) {
    if (parseRule2.style) {
      return parseRule2;
    }
    return {
      ...parseRule2,
      getAttrs: (node4) => {
        const oldAttributes = parseRule2.getAttrs ? parseRule2.getAttrs(node4) : parseRule2.attrs;
        if (oldAttributes === false) {
          return false;
        }
        const newAttributes = extensionAttributes.reduce((items, item) => {
          const value = item.attribute.parseHTML ? item.attribute.parseHTML(node4) : fromString(node4.getAttribute(item.name));
          if (value === null || value === void 0) {
            return items;
          }
          return {
            ...items,
            [item.name]: value
          };
        }, {});
        return { ...oldAttributes, ...newAttributes };
      }
    };
  }
  function cleanUpSchemaItem(data) {
    return Object.fromEntries(Object.entries(data).filter(([key, value]) => {
      if (key === "attrs" && isEmptyObject(value)) {
        return false;
      }
      return value !== null && value !== void 0;
    }));
  }
  function getSchemaByResolvedExtensions(extensions2) {
    var _a;
    const allAttributes = getAttributesFromExtensions(extensions2);
    const { nodeExtensions, markExtensions } = splitExtensions(extensions2);
    const topNode = (_a = nodeExtensions.find((extension) => getExtensionField(extension, "topNode"))) === null || _a === void 0 ? void 0 : _a.name;
    const nodes = Object.fromEntries(nodeExtensions.map((extension) => {
      const extensionAttributes = allAttributes.filter((attribute) => attribute.type === extension.name);
      const context = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage
      };
      const extraNodeFields = extensions2.reduce((fields, e) => {
        const extendNodeSchema = getExtensionField(e, "extendNodeSchema", context);
        return {
          ...fields,
          ...extendNodeSchema ? extendNodeSchema(extension) : {}
        };
      }, {});
      const schema = cleanUpSchemaItem({
        ...extraNodeFields,
        content: callOrReturn(getExtensionField(extension, "content", context)),
        marks: callOrReturn(getExtensionField(extension, "marks", context)),
        group: callOrReturn(getExtensionField(extension, "group", context)),
        inline: callOrReturn(getExtensionField(extension, "inline", context)),
        atom: callOrReturn(getExtensionField(extension, "atom", context)),
        selectable: callOrReturn(getExtensionField(extension, "selectable", context)),
        draggable: callOrReturn(getExtensionField(extension, "draggable", context)),
        code: callOrReturn(getExtensionField(extension, "code", context)),
        defining: callOrReturn(getExtensionField(extension, "defining", context)),
        isolating: callOrReturn(getExtensionField(extension, "isolating", context)),
        attrs: Object.fromEntries(extensionAttributes.map((extensionAttribute) => {
          var _a2;
          return [extensionAttribute.name, { default: (_a2 = extensionAttribute === null || extensionAttribute === void 0 ? void 0 : extensionAttribute.attribute) === null || _a2 === void 0 ? void 0 : _a2.default }];
        }))
      });
      const parseHTML = callOrReturn(getExtensionField(extension, "parseHTML", context));
      if (parseHTML) {
        schema.parseDOM = parseHTML.map((parseRule2) => injectExtensionAttributesToParseRule(parseRule2, extensionAttributes));
      }
      const renderHTML = getExtensionField(extension, "renderHTML", context);
      if (renderHTML) {
        schema.toDOM = (node4) => renderHTML({
          node: node4,
          HTMLAttributes: getRenderedAttributes(node4, extensionAttributes)
        });
      }
      const renderText = getExtensionField(extension, "renderText", context);
      if (renderText) {
        schema.toText = renderText;
      }
      return [extension.name, schema];
    }));
    const marks2 = Object.fromEntries(markExtensions.map((extension) => {
      const extensionAttributes = allAttributes.filter((attribute) => attribute.type === extension.name);
      const context = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage
      };
      const extraMarkFields = extensions2.reduce((fields, e) => {
        const extendMarkSchema = getExtensionField(e, "extendMarkSchema", context);
        return {
          ...fields,
          ...extendMarkSchema ? extendMarkSchema(extension) : {}
        };
      }, {});
      const schema = cleanUpSchemaItem({
        ...extraMarkFields,
        inclusive: callOrReturn(getExtensionField(extension, "inclusive", context)),
        excludes: callOrReturn(getExtensionField(extension, "excludes", context)),
        group: callOrReturn(getExtensionField(extension, "group", context)),
        spanning: callOrReturn(getExtensionField(extension, "spanning", context)),
        code: callOrReturn(getExtensionField(extension, "code", context)),
        attrs: Object.fromEntries(extensionAttributes.map((extensionAttribute) => {
          var _a2;
          return [extensionAttribute.name, { default: (_a2 = extensionAttribute === null || extensionAttribute === void 0 ? void 0 : extensionAttribute.attribute) === null || _a2 === void 0 ? void 0 : _a2.default }];
        }))
      });
      const parseHTML = callOrReturn(getExtensionField(extension, "parseHTML", context));
      if (parseHTML) {
        schema.parseDOM = parseHTML.map((parseRule2) => injectExtensionAttributesToParseRule(parseRule2, extensionAttributes));
      }
      const renderHTML = getExtensionField(extension, "renderHTML", context);
      if (renderHTML) {
        schema.toDOM = (mark3) => renderHTML({
          mark: mark3,
          HTMLAttributes: getRenderedAttributes(mark3, extensionAttributes)
        });
      }
      return [extension.name, schema];
    }));
    return new Schema({
      topNode,
      nodes,
      marks: marks2
    });
  }
  function getSchemaTypeByName(name, schema) {
    return schema.nodes[name] || schema.marks[name] || null;
  }
  function isExtensionRulesEnabled(extension, enabled) {
    if (Array.isArray(enabled)) {
      return enabled.some((enabledExtension) => {
        const name = typeof enabledExtension === "string" ? enabledExtension : enabledExtension.name;
        return name === extension.name;
      });
    }
    return enabled;
  }
  function findDuplicates(items) {
    const filtered = items.filter((el, index2) => items.indexOf(el) !== index2);
    return [...new Set(filtered)];
  }
  var ExtensionManager = class {
    constructor(extensions2, editor) {
      this.splittableMarks = [];
      this.editor = editor;
      this.extensions = ExtensionManager.resolve(extensions2);
      this.schema = getSchemaByResolvedExtensions(this.extensions);
      this.extensions.forEach((extension) => {
        var _a;
        this.editor.extensionStorage[extension.name] = extension.storage;
        const context = {
          name: extension.name,
          options: extension.options,
          storage: extension.storage,
          editor: this.editor,
          type: getSchemaTypeByName(extension.name, this.schema)
        };
        if (extension.type === "mark") {
          const keepOnSplit = (_a = callOrReturn(getExtensionField(extension, "keepOnSplit", context))) !== null && _a !== void 0 ? _a : true;
          if (keepOnSplit) {
            this.splittableMarks.push(extension.name);
          }
        }
        const onBeforeCreate = getExtensionField(extension, "onBeforeCreate", context);
        if (onBeforeCreate) {
          this.editor.on("beforeCreate", onBeforeCreate);
        }
        const onCreate2 = getExtensionField(extension, "onCreate", context);
        if (onCreate2) {
          this.editor.on("create", onCreate2);
        }
        const onUpdate = getExtensionField(extension, "onUpdate", context);
        if (onUpdate) {
          this.editor.on("update", onUpdate);
        }
        const onSelectionUpdate = getExtensionField(extension, "onSelectionUpdate", context);
        if (onSelectionUpdate) {
          this.editor.on("selectionUpdate", onSelectionUpdate);
        }
        const onTransaction = getExtensionField(extension, "onTransaction", context);
        if (onTransaction) {
          this.editor.on("transaction", onTransaction);
        }
        const onFocus = getExtensionField(extension, "onFocus", context);
        if (onFocus) {
          this.editor.on("focus", onFocus);
        }
        const onBlur = getExtensionField(extension, "onBlur", context);
        if (onBlur) {
          this.editor.on("blur", onBlur);
        }
        const onDestroy2 = getExtensionField(extension, "onDestroy", context);
        if (onDestroy2) {
          this.editor.on("destroy", onDestroy2);
        }
      });
    }
    static resolve(extensions2) {
      const resolvedExtensions = ExtensionManager.sort(ExtensionManager.flatten(extensions2));
      const duplicatedNames = findDuplicates(resolvedExtensions.map((extension) => extension.name));
      if (duplicatedNames.length) {
        console.warn(`[tiptap warn]: Duplicate extension names found: [${duplicatedNames.map((item) => `'${item}'`).join(", ")}]. This can lead to issues.`);
      }
      return resolvedExtensions;
    }
    static flatten(extensions2) {
      return extensions2.map((extension) => {
        const context = {
          name: extension.name,
          options: extension.options,
          storage: extension.storage
        };
        const addExtensions = getExtensionField(extension, "addExtensions", context);
        if (addExtensions) {
          return [
            extension,
            ...this.flatten(addExtensions())
          ];
        }
        return extension;
      }).flat(10);
    }
    static sort(extensions2) {
      const defaultPriority = 100;
      return extensions2.sort((a, b) => {
        const priorityA = getExtensionField(a, "priority") || defaultPriority;
        const priorityB = getExtensionField(b, "priority") || defaultPriority;
        if (priorityA > priorityB) {
          return -1;
        }
        if (priorityA < priorityB) {
          return 1;
        }
        return 0;
      });
    }
    get commands() {
      return this.extensions.reduce((commands, extension) => {
        const context = {
          name: extension.name,
          options: extension.options,
          storage: extension.storage,
          editor: this.editor,
          type: getSchemaTypeByName(extension.name, this.schema)
        };
        const addCommands = getExtensionField(extension, "addCommands", context);
        if (!addCommands) {
          return commands;
        }
        return {
          ...commands,
          ...addCommands()
        };
      }, {});
    }
    get plugins() {
      const { editor } = this;
      const extensions2 = ExtensionManager.sort([...this.extensions].reverse());
      const inputRules = [];
      const pasteRules = [];
      const allPlugins = extensions2.map((extension) => {
        const context = {
          name: extension.name,
          options: extension.options,
          storage: extension.storage,
          editor,
          type: getSchemaTypeByName(extension.name, this.schema)
        };
        const plugins = [];
        const addKeyboardShortcuts = getExtensionField(extension, "addKeyboardShortcuts", context);
        if (addKeyboardShortcuts) {
          const bindings = Object.fromEntries(Object.entries(addKeyboardShortcuts()).map(([shortcut, method]) => {
            return [shortcut, () => method({ editor })];
          }));
          const keyMapPlugin = keymap(bindings);
          plugins.push(keyMapPlugin);
        }
        const addInputRules = getExtensionField(extension, "addInputRules", context);
        if (isExtensionRulesEnabled(extension, editor.options.enableInputRules) && addInputRules) {
          inputRules.push(...addInputRules());
        }
        const addPasteRules = getExtensionField(extension, "addPasteRules", context);
        if (isExtensionRulesEnabled(extension, editor.options.enablePasteRules) && addPasteRules) {
          pasteRules.push(...addPasteRules());
        }
        const addProseMirrorPlugins = getExtensionField(extension, "addProseMirrorPlugins", context);
        if (addProseMirrorPlugins) {
          const proseMirrorPlugins = addProseMirrorPlugins();
          plugins.push(...proseMirrorPlugins);
        }
        return plugins;
      }).flat();
      return [
        inputRulesPlugin({
          editor,
          rules: inputRules
        }),
        ...pasteRulesPlugin({
          editor,
          rules: pasteRules
        }),
        ...allPlugins
      ];
    }
    get attributes() {
      return getAttributesFromExtensions(this.extensions);
    }
    get nodeViews() {
      const { editor } = this;
      const { nodeExtensions } = splitExtensions(this.extensions);
      return Object.fromEntries(nodeExtensions.filter((extension) => !!getExtensionField(extension, "addNodeView")).map((extension) => {
        const extensionAttributes = this.attributes.filter((attribute) => attribute.type === extension.name);
        const context = {
          name: extension.name,
          options: extension.options,
          storage: extension.storage,
          editor,
          type: getNodeType(extension.name, this.schema)
        };
        const addNodeView = getExtensionField(extension, "addNodeView", context);
        if (!addNodeView) {
          return [];
        }
        const nodeview = (node4, view, getPos, decorations) => {
          const HTMLAttributes = getRenderedAttributes(node4, extensionAttributes);
          return addNodeView()({
            editor,
            node: node4,
            getPos,
            decorations,
            HTMLAttributes,
            extension
          });
        };
        return [extension.name, nodeview];
      }));
    }
  };
  var EventEmitter = class {
    constructor() {
      this.callbacks = {};
    }
    on(event, fn2) {
      if (!this.callbacks[event]) {
        this.callbacks[event] = [];
      }
      this.callbacks[event].push(fn2);
      return this;
    }
    emit(event, ...args) {
      const callbacks = this.callbacks[event];
      if (callbacks) {
        callbacks.forEach((callback) => callback.apply(this, args));
      }
      return this;
    }
    off(event, fn2) {
      const callbacks = this.callbacks[event];
      if (callbacks) {
        if (fn2) {
          this.callbacks[event] = callbacks.filter((callback) => callback !== fn2);
        } else {
          delete this.callbacks[event];
        }
      }
      return this;
    }
    removeAllListeners() {
      this.callbacks = {};
    }
  };
  var style = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 1px !important;
  height: 1px !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.tippy-box[data-animation=fade][data-state=hidden] {
  opacity: 0
}`;
  var Editor = class extends EventEmitter {
    constructor(options = {}) {
      super();
      this.isFocused = false;
      this.extensionStorage = {};
      this.options = {
        element: document.createElement("div"),
        content: "",
        injectCSS: true,
        extensions: [],
        autofocus: false,
        editable: true,
        editorProps: {},
        parseOptions: {},
        enableInputRules: true,
        enablePasteRules: true,
        enableCoreExtensions: true,
        onBeforeCreate: () => null,
        onCreate: () => null,
        onUpdate: () => null,
        onSelectionUpdate: () => null,
        onTransaction: () => null,
        onFocus: () => null,
        onBlur: () => null,
        onDestroy: () => null
      };
      this.isCapturingTransaction = false;
      this.capturedTransaction = null;
      this.setOptions(options);
      this.createExtensionManager();
      this.createCommandManager();
      this.createSchema();
      this.on("beforeCreate", this.options.onBeforeCreate);
      this.emit("beforeCreate", { editor: this });
      this.createView();
      this.injectCSS();
      this.on("create", this.options.onCreate);
      this.on("update", this.options.onUpdate);
      this.on("selectionUpdate", this.options.onSelectionUpdate);
      this.on("transaction", this.options.onTransaction);
      this.on("focus", this.options.onFocus);
      this.on("blur", this.options.onBlur);
      this.on("destroy", this.options.onDestroy);
      window.setTimeout(() => {
        if (this.isDestroyed) {
          return;
        }
        this.commands.focus(this.options.autofocus);
        this.emit("create", { editor: this });
      }, 0);
    }
    get storage() {
      return this.extensionStorage;
    }
    get commands() {
      return this.commandManager.commands;
    }
    chain() {
      return this.commandManager.chain();
    }
    can() {
      return this.commandManager.can();
    }
    injectCSS() {
      if (this.options.injectCSS && document) {
        this.css = createStyleTag(style);
      }
    }
    setOptions(options = {}) {
      this.options = {
        ...this.options,
        ...options
      };
      if (!this.view || !this.state || this.isDestroyed) {
        return;
      }
      if (this.options.editorProps) {
        this.view.setProps(this.options.editorProps);
      }
      this.view.updateState(this.state);
    }
    setEditable(editable) {
      this.setOptions({ editable });
    }
    get isEditable() {
      return this.options.editable && this.view && this.view.editable;
    }
    get state() {
      return this.view.state;
    }
    registerPlugin(plugin, handlePlugins) {
      const plugins = isFunction(handlePlugins) ? handlePlugins(plugin, this.state.plugins) : [...this.state.plugins, plugin];
      const state = this.state.reconfigure({ plugins });
      this.view.updateState(state);
    }
    unregisterPlugin(nameOrPluginKey) {
      if (this.isDestroyed) {
        return;
      }
      const name = typeof nameOrPluginKey === "string" ? `${nameOrPluginKey}$` : nameOrPluginKey.key;
      const state = this.state.reconfigure({
        plugins: this.state.plugins.filter((plugin) => !plugin.key.startsWith(name))
      });
      this.view.updateState(state);
    }
    createExtensionManager() {
      const coreExtensions = this.options.enableCoreExtensions ? Object.values(extensions) : [];
      const allExtensions = [...coreExtensions, ...this.options.extensions].filter((extension) => {
        return ["extension", "node", "mark"].includes(extension === null || extension === void 0 ? void 0 : extension.type);
      });
      this.extensionManager = new ExtensionManager(allExtensions, this);
    }
    createCommandManager() {
      this.commandManager = new CommandManager({
        editor: this
      });
    }
    createSchema() {
      this.schema = this.extensionManager.schema;
    }
    createView() {
      const doc2 = createDocument(this.options.content, this.schema, this.options.parseOptions);
      const selection = resolveFocusPosition(doc2, this.options.autofocus);
      this.view = new EditorView(this.options.element, {
        ...this.options.editorProps,
        dispatchTransaction: this.dispatchTransaction.bind(this),
        state: EditorState.create({
          doc: doc2,
          selection
        })
      });
      const newState = this.state.reconfigure({
        plugins: this.extensionManager.plugins
      });
      this.view.updateState(newState);
      this.createNodeViews();
      const dom = this.view.dom;
      dom.editor = this;
    }
    createNodeViews() {
      this.view.setProps({
        nodeViews: this.extensionManager.nodeViews
      });
    }
    captureTransaction(fn2) {
      this.isCapturingTransaction = true;
      fn2();
      this.isCapturingTransaction = false;
      const tr = this.capturedTransaction;
      this.capturedTransaction = null;
      return tr;
    }
    dispatchTransaction(transaction) {
      if (this.isCapturingTransaction) {
        if (!this.capturedTransaction) {
          this.capturedTransaction = transaction;
          return;
        }
        transaction.steps.forEach((step2) => {
          var _a;
          return (_a = this.capturedTransaction) === null || _a === void 0 ? void 0 : _a.step(step2);
        });
        return;
      }
      const state = this.state.apply(transaction);
      const selectionHasChanged = !this.state.selection.eq(state.selection);
      this.view.updateState(state);
      this.emit("transaction", {
        editor: this,
        transaction
      });
      if (selectionHasChanged) {
        this.emit("selectionUpdate", {
          editor: this,
          transaction
        });
      }
      const focus3 = transaction.getMeta("focus");
      const blur2 = transaction.getMeta("blur");
      if (focus3) {
        this.emit("focus", {
          editor: this,
          event: focus3.event,
          transaction
        });
      }
      if (blur2) {
        this.emit("blur", {
          editor: this,
          event: blur2.event,
          transaction
        });
      }
      if (!transaction.docChanged || transaction.getMeta("preventUpdate")) {
        return;
      }
      this.emit("update", {
        editor: this,
        transaction
      });
    }
    getAttributes(nameOrType) {
      return getAttributes(this.state, nameOrType);
    }
    isActive(nameOrAttributes, attributesOrUndefined) {
      const name = typeof nameOrAttributes === "string" ? nameOrAttributes : null;
      const attributes = typeof nameOrAttributes === "string" ? attributesOrUndefined : nameOrAttributes;
      return isActive(this.state, name, attributes);
    }
    getJSON() {
      return this.state.doc.toJSON();
    }
    getHTML() {
      return getHTMLFromFragment(this.state.doc.content, this.schema);
    }
    getText(options) {
      const { blockSeparator = "\n\n", textSerializers = {} } = options || {};
      return getText(this.state.doc, {
        blockSeparator,
        textSerializers: {
          ...textSerializers,
          ...getTextSeralizersFromSchema(this.schema)
        }
      });
    }
    get isEmpty() {
      return isNodeEmpty(this.state.doc);
    }
    getCharacterCount() {
      console.warn('[tiptap warn]: "editor.getCharacterCount()" is deprecated. Please use "editor.storage.characterCount.characters()" instead.');
      return this.state.doc.content.size - 2;
    }
    destroy() {
      this.emit("destroy");
      if (this.view) {
        this.view.destroy();
      }
      this.removeAllListeners();
    }
    get isDestroyed() {
      var _a;
      return !((_a = this.view) === null || _a === void 0 ? void 0 : _a.docView);
    }
  };
  var Node4 = class {
    constructor(config = {}) {
      this.type = "node";
      this.name = "node";
      this.parent = null;
      this.child = null;
      this.config = {
        name: this.name,
        defaultOptions: {}
      };
      this.config = {
        ...this.config,
        ...config
      };
      this.name = this.config.name;
      if (config.defaultOptions) {
        console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`);
      }
      this.options = this.config.defaultOptions;
      if (this.config.addOptions) {
        this.options = callOrReturn(getExtensionField(this, "addOptions", {
          name: this.name
        }));
      }
      this.storage = callOrReturn(getExtensionField(this, "addStorage", {
        name: this.name,
        options: this.options
      })) || {};
    }
    static create(config = {}) {
      return new Node4(config);
    }
    configure(options = {}) {
      const extension = this.extend();
      extension.options = mergeDeep(this.options, options);
      extension.storage = callOrReturn(getExtensionField(extension, "addStorage", {
        name: extension.name,
        options: extension.options
      }));
      return extension;
    }
    extend(extendedConfig = {}) {
      const extension = new Node4(extendedConfig);
      extension.parent = this;
      this.child = extension;
      extension.name = extendedConfig.name ? extendedConfig.name : extension.parent.name;
      if (extendedConfig.defaultOptions) {
        console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${extension.name}".`);
      }
      extension.options = callOrReturn(getExtensionField(extension, "addOptions", {
        name: extension.name
      }));
      extension.storage = callOrReturn(getExtensionField(extension, "addStorage", {
        name: extension.name,
        options: extension.options
      }));
      return extension;
    }
  };
  var Mark3 = class {
    constructor(config = {}) {
      this.type = "mark";
      this.name = "mark";
      this.parent = null;
      this.child = null;
      this.config = {
        name: this.name,
        defaultOptions: {}
      };
      this.config = {
        ...this.config,
        ...config
      };
      this.name = this.config.name;
      if (config.defaultOptions) {
        console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`);
      }
      this.options = this.config.defaultOptions;
      if (this.config.addOptions) {
        this.options = callOrReturn(getExtensionField(this, "addOptions", {
          name: this.name
        }));
      }
      this.storage = callOrReturn(getExtensionField(this, "addStorage", {
        name: this.name,
        options: this.options
      })) || {};
    }
    static create(config = {}) {
      return new Mark3(config);
    }
    configure(options = {}) {
      const extension = this.extend();
      extension.options = mergeDeep(this.options, options);
      extension.storage = callOrReturn(getExtensionField(extension, "addStorage", {
        name: extension.name,
        options: extension.options
      }));
      return extension;
    }
    extend(extendedConfig = {}) {
      const extension = new Mark3(extendedConfig);
      extension.parent = this;
      this.child = extension;
      extension.name = extendedConfig.name ? extendedConfig.name : extension.parent.name;
      if (extendedConfig.defaultOptions) {
        console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${extension.name}".`);
      }
      extension.options = callOrReturn(getExtensionField(extension, "addOptions", {
        name: extension.name
      }));
      extension.storage = callOrReturn(getExtensionField(extension, "addStorage", {
        name: extension.name,
        options: extension.options
      }));
      return extension;
    }
  };
  function nodeInputRule(config) {
    return new InputRule({
      find: config.find,
      handler: ({ state, range, match }) => {
        const attributes = callOrReturn(config.getAttributes, void 0, match) || {};
        const { tr } = state;
        const start5 = range.from;
        let end3 = range.to;
        if (match[1]) {
          const offset3 = match[0].lastIndexOf(match[1]);
          let matchStart = start5 + offset3;
          if (matchStart > end3) {
            matchStart = end3;
          } else {
            end3 = matchStart + match[1].length;
          }
          const lastChar = match[0][match[0].length - 1];
          tr.insertText(lastChar, start5 + match[0].length - 1);
          tr.replaceWith(matchStart, end3, config.type.create(attributes));
        } else if (match[0]) {
          tr.replaceWith(start5, end3, config.type.create(attributes));
        }
      }
    });
  }
  function getMarksBetween(from4, to, doc2) {
    const marks2 = [];
    if (from4 === to) {
      doc2.resolve(from4).marks().forEach((mark3) => {
        const $pos = doc2.resolve(from4 - 1);
        const range = getMarkRange($pos, mark3.type);
        if (!range) {
          return;
        }
        marks2.push({
          mark: mark3,
          ...range
        });
      });
    } else {
      doc2.nodesBetween(from4, to, (node4, pos) => {
        marks2.push(...node4.marks.map((mark3) => ({
          from: pos,
          to: pos + node4.nodeSize,
          mark: mark3
        })));
      });
    }
    return marks2;
  }
  function markInputRule(config) {
    return new InputRule({
      find: config.find,
      handler: ({ state, range, match }) => {
        const attributes = callOrReturn(config.getAttributes, void 0, match);
        if (attributes === false || attributes === null) {
          return null;
        }
        const { tr } = state;
        const captureGroup = match[match.length - 1];
        const fullMatch = match[0];
        let markEnd = range.to;
        if (captureGroup) {
          const startSpaces = fullMatch.search(/\S/);
          const textStart = range.from + fullMatch.indexOf(captureGroup);
          const textEnd = textStart + captureGroup.length;
          const excludedMarks = getMarksBetween(range.from, range.to, state.doc).filter((item) => {
            const excluded = item.mark.type.excluded;
            return excluded.find((type) => type === config.type && type !== item.mark.type);
          }).filter((item) => item.to > textStart);
          if (excludedMarks.length) {
            return null;
          }
          if (textEnd < range.to) {
            tr.delete(textEnd, range.to);
          }
          if (textStart > range.from) {
            tr.delete(range.from + startSpaces, textStart);
          }
          markEnd = range.from + startSpaces + captureGroup.length;
          tr.addMark(range.from + startSpaces, markEnd, config.type.create(attributes || {}));
          tr.removeStoredMark(config.type);
        }
      }
    });
  }
  function textblockTypeInputRule(config) {
    return new InputRule({
      find: config.find,
      handler: ({ state, range, match }) => {
        const $start = state.doc.resolve(range.from);
        const attributes = callOrReturn(config.getAttributes, void 0, match) || {};
        if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), config.type)) {
          return null;
        }
        state.tr.delete(range.from, range.to).setBlockType(range.from, range.from, config.type, attributes);
      }
    });
  }
  function wrappingInputRule(config) {
    return new InputRule({
      find: config.find,
      handler: ({ state, range, match }) => {
        const attributes = callOrReturn(config.getAttributes, void 0, match) || {};
        const tr = state.tr.delete(range.from, range.to);
        const $start = tr.doc.resolve(range.from);
        const blockRange2 = $start.blockRange();
        const wrapping = blockRange2 && findWrapping3(blockRange2, config.type, attributes);
        if (!wrapping) {
          return null;
        }
        tr.wrap(blockRange2, wrapping);
        const before2 = tr.doc.resolve(range.from - 1).nodeBefore;
        if (before2 && before2.type === config.type && canJoin(tr.doc, range.from - 1) && (!config.joinPredicate || config.joinPredicate(match, before2))) {
          tr.join(range.from - 1);
        }
      }
    });
  }
  function markPasteRule(config) {
    return new PasteRule({
      find: config.find,
      handler: ({ state, range, match }) => {
        const attributes = callOrReturn(config.getAttributes, void 0, match);
        if (attributes === false || attributes === null) {
          return null;
        }
        const { tr } = state;
        const captureGroup = match[match.length - 1];
        const fullMatch = match[0];
        let markEnd = range.to;
        if (captureGroup) {
          const startSpaces = fullMatch.search(/\S/);
          const textStart = range.from + fullMatch.indexOf(captureGroup);
          const textEnd = textStart + captureGroup.length;
          const excludedMarks = getMarksBetween(range.from, range.to, state.doc).filter((item) => {
            const excluded = item.mark.type.excluded;
            return excluded.find((type) => type === config.type && type !== item.mark.type);
          }).filter((item) => item.to > textStart);
          if (excludedMarks.length) {
            return null;
          }
          if (textEnd < range.to) {
            tr.delete(textEnd, range.to);
          }
          if (textStart > range.from) {
            tr.delete(range.from + startSpaces, textStart);
          }
          markEnd = range.from + startSpaces + captureGroup.length;
          tr.addMark(range.from + startSpaces, markEnd, config.type.create(attributes || {}));
          tr.removeStoredMark(config.type);
        }
      }
    });
  }
  function isNodeSelection(value) {
    return isObject(value) && value instanceof NodeSelection;
  }
  function posToDOMRect(view, from4, to) {
    const minPos = 0;
    const maxPos = view.state.doc.content.size;
    const resolvedFrom = minMax(from4, minPos, maxPos);
    const resolvedEnd = minMax(to, minPos, maxPos);
    const start5 = view.coordsAtPos(resolvedFrom);
    const end3 = view.coordsAtPos(resolvedEnd, -1);
    const top2 = Math.min(start5.top, end3.top);
    const bottom2 = Math.max(start5.bottom, end3.bottom);
    const left2 = Math.min(start5.left, end3.left);
    const right2 = Math.max(start5.right, end3.right);
    const width = right2 - left2;
    const height = bottom2 - top2;
    const x = left2;
    const y = top2;
    const data = {
      top: top2,
      bottom: bottom2,
      left: left2,
      right: right2,
      width,
      height,
      x,
      y
    };
    return {
      ...data,
      toJSON: () => data
    };
  }

  // node_modules/@tiptap/extension-blockquote/dist/tiptap-extension-blockquote.esm.js
  var inputRegex = /^\s*>\s$/;
  var Blockquote = Node4.create({
    name: "blockquote",
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    content: "block+",
    group: "block",
    defining: true,
    parseHTML() {
      return [
        { tag: "blockquote" }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["blockquote", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        setBlockquote: () => ({ commands }) => {
          return commands.wrapIn(this.name);
        },
        toggleBlockquote: () => ({ commands }) => {
          return commands.toggleWrap(this.name);
        },
        unsetBlockquote: () => ({ commands }) => {
          return commands.lift(this.name);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-Shift-b": () => this.editor.commands.toggleBlockquote()
      };
    },
    addInputRules() {
      return [
        wrappingInputRule({
          find: inputRegex,
          type: this.type
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-bold/dist/tiptap-extension-bold.esm.js
  var starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/;
  var starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g;
  var underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/;
  var underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g;
  var Bold = Mark3.create({
    name: "bold",
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    parseHTML() {
      return [
        {
          tag: "strong"
        },
        {
          tag: "b",
          getAttrs: (node4) => node4.style.fontWeight !== "normal" && null
        },
        {
          style: "font-weight",
          getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
        }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["strong", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        setBold: () => ({ commands }) => {
          return commands.setMark(this.name);
        },
        toggleBold: () => ({ commands }) => {
          return commands.toggleMark(this.name);
        },
        unsetBold: () => ({ commands }) => {
          return commands.unsetMark(this.name);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-b": () => this.editor.commands.toggleBold(),
        "Mod-B": () => this.editor.commands.toggleBold()
      };
    },
    addInputRules() {
      return [
        markInputRule({
          find: starInputRegex,
          type: this.type
        }),
        markInputRule({
          find: underscoreInputRegex,
          type: this.type
        })
      ];
    },
    addPasteRules() {
      return [
        markPasteRule({
          find: starPasteRegex,
          type: this.type
        }),
        markPasteRule({
          find: underscorePasteRegex,
          type: this.type
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-bullet-list/dist/tiptap-extension-bullet-list.esm.js
  var inputRegex2 = /^\s*([-+*])\s$/;
  var BulletList = Node4.create({
    name: "bulletList",
    addOptions() {
      return {
        itemTypeName: "listItem",
        HTMLAttributes: {}
      };
    },
    group: "block list",
    content() {
      return `${this.options.itemTypeName}+`;
    },
    parseHTML() {
      return [
        { tag: "ul" }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["ul", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        toggleBulletList: () => ({ commands }) => {
          return commands.toggleList(this.name, this.options.itemTypeName);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
      };
    },
    addInputRules() {
      return [
        wrappingInputRule({
          find: inputRegex2,
          type: this.type
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-code/dist/tiptap-extension-code.esm.js
  var inputRegex3 = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/;
  var pasteRegex = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g;
  var Code = Mark3.create({
    name: "code",
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    excludes: "_",
    code: true,
    parseHTML() {
      return [
        { tag: "code" }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["code", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        setCode: () => ({ commands }) => {
          return commands.setMark(this.name);
        },
        toggleCode: () => ({ commands }) => {
          return commands.toggleMark(this.name);
        },
        unsetCode: () => ({ commands }) => {
          return commands.unsetMark(this.name);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-e": () => this.editor.commands.toggleCode()
      };
    },
    addInputRules() {
      return [
        markInputRule({
          find: inputRegex3,
          type: this.type
        })
      ];
    },
    addPasteRules() {
      return [
        markPasteRule({
          find: pasteRegex,
          type: this.type
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-code-block/dist/tiptap-extension-code-block.esm.js
  var backtickInputRegex = /^```([a-z]+)?[\s\n]$/;
  var tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/;
  var CodeBlock = Node4.create({
    name: "codeBlock",
    addOptions() {
      return {
        languageClassPrefix: "language-",
        exitOnTripleEnter: true,
        exitOnArrowDown: true,
        HTMLAttributes: {}
      };
    },
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    addAttributes() {
      return {
        language: {
          default: null,
          parseHTML: (element) => {
            var _a;
            const { languageClassPrefix } = this.options;
            const classNames = [...((_a = element.firstElementChild) === null || _a === void 0 ? void 0 : _a.classList) || []];
            const languages = classNames.filter((className) => className.startsWith(languageClassPrefix)).map((className) => className.replace(languageClassPrefix, ""));
            const language = languages[0];
            if (!language) {
              return null;
            }
            return language;
          },
          rendered: false
        }
      };
    },
    parseHTML() {
      return [
        {
          tag: "pre",
          preserveWhitespace: "full"
        }
      ];
    },
    renderHTML({ node: node4, HTMLAttributes }) {
      return [
        "pre",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        [
          "code",
          {
            class: node4.attrs.language ? this.options.languageClassPrefix + node4.attrs.language : null
          },
          0
        ]
      ];
    },
    addCommands() {
      return {
        setCodeBlock: (attributes) => ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
        toggleCodeBlock: (attributes) => ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph", attributes);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
        Backspace: () => {
          const { empty: empty2, $anchor } = this.editor.state.selection;
          const isAtStart = $anchor.pos === 1;
          if (!empty2 || $anchor.parent.type.name !== this.name) {
            return false;
          }
          if (isAtStart || !$anchor.parent.textContent.length) {
            return this.editor.commands.clearNodes();
          }
          return false;
        },
        Enter: ({ editor }) => {
          if (!this.options.exitOnTripleEnter) {
            return false;
          }
          const { state } = editor;
          const { selection } = state;
          const { $from, empty: empty2 } = selection;
          if (!empty2 || $from.parent.type !== this.type) {
            return false;
          }
          const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
          const endsWithDoubleNewline = $from.parent.textContent.endsWith("\n\n");
          if (!isAtEnd || !endsWithDoubleNewline) {
            return false;
          }
          return editor.chain().command(({ tr }) => {
            tr.delete($from.pos - 2, $from.pos);
            return true;
          }).exitCode().run();
        },
        ArrowDown: ({ editor }) => {
          if (!this.options.exitOnArrowDown) {
            return false;
          }
          const { state } = editor;
          const { selection, doc: doc2 } = state;
          const { $from, empty: empty2 } = selection;
          if (!empty2 || $from.parent.type !== this.type) {
            return false;
          }
          const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
          if (!isAtEnd) {
            return false;
          }
          const after2 = $from.after();
          if (after2 === void 0) {
            return false;
          }
          const nodeAfter = doc2.nodeAt(after2);
          if (nodeAfter) {
            return false;
          }
          return editor.commands.exitCode();
        }
      };
    },
    addInputRules() {
      return [
        textblockTypeInputRule({
          find: backtickInputRegex,
          type: this.type,
          getAttributes: (match) => ({
            language: match[1]
          })
        }),
        textblockTypeInputRule({
          find: tildeInputRegex,
          type: this.type,
          getAttributes: (match) => ({
            language: match[1]
          })
        })
      ];
    },
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("codeBlockVSCodeHandler"),
          props: {
            handlePaste: (view, event) => {
              if (!event.clipboardData) {
                return false;
              }
              if (this.editor.isActive(this.type.name)) {
                return false;
              }
              const text2 = event.clipboardData.getData("text/plain");
              const vscode = event.clipboardData.getData("vscode-editor-data");
              const vscodeData = vscode ? JSON.parse(vscode) : void 0;
              const language = vscodeData === null || vscodeData === void 0 ? void 0 : vscodeData.mode;
              if (!text2 || !language) {
                return false;
              }
              const { tr } = view.state;
              tr.replaceSelectionWith(this.type.create({ language }));
              tr.setSelection(TextSelection.near(tr.doc.resolve(Math.max(0, tr.selection.from - 2))));
              tr.insertText(text2.replace(/\r\n?/g, "\n"));
              tr.setMeta("paste", true);
              view.dispatch(tr);
              return true;
            }
          }
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-document/dist/tiptap-extension-document.esm.js
  var Document = Node4.create({
    name: "doc",
    topNode: true,
    content: "block+"
  });

  // node_modules/prosemirror-dropcursor/dist/index.es.js
  function dropCursor(options) {
    if (options === void 0)
      options = {};
    return new Plugin({
      view: function view(editorView) {
        return new DropCursorView(editorView, options);
      }
    });
  }
  var DropCursorView = function DropCursorView2(editorView, options) {
    var this$1 = this;
    this.editorView = editorView;
    this.width = options.width || 1;
    this.color = options.color || "black";
    this.class = options.class;
    this.cursorPos = null;
    this.element = null;
    this.timeout = null;
    this.handlers = ["dragover", "dragend", "drop", "dragleave"].map(function(name) {
      var handler = function(e) {
        return this$1[name](e);
      };
      editorView.dom.addEventListener(name, handler);
      return { name, handler };
    });
  };
  DropCursorView.prototype.destroy = function destroy4() {
    var this$1 = this;
    this.handlers.forEach(function(ref) {
      var name = ref.name;
      var handler = ref.handler;
      return this$1.editorView.dom.removeEventListener(name, handler);
    });
  };
  DropCursorView.prototype.update = function update2(editorView, prevState) {
    if (this.cursorPos != null && prevState.doc != editorView.state.doc) {
      if (this.cursorPos > editorView.state.doc.content.size) {
        this.setCursor(null);
      } else {
        this.updateOverlay();
      }
    }
  };
  DropCursorView.prototype.setCursor = function setCursor(pos) {
    if (pos == this.cursorPos) {
      return;
    }
    this.cursorPos = pos;
    if (pos == null) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    } else {
      this.updateOverlay();
    }
  };
  DropCursorView.prototype.updateOverlay = function updateOverlay() {
    var $pos = this.editorView.state.doc.resolve(this.cursorPos), rect;
    if (!$pos.parent.inlineContent) {
      var before2 = $pos.nodeBefore, after2 = $pos.nodeAfter;
      if (before2 || after2) {
        var nodeRect = this.editorView.nodeDOM(this.cursorPos - (before2 ? before2.nodeSize : 0)).getBoundingClientRect();
        var top2 = before2 ? nodeRect.bottom : nodeRect.top;
        if (before2 && after2) {
          top2 = (top2 + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2;
        }
        rect = { left: nodeRect.left, right: nodeRect.right, top: top2 - this.width / 2, bottom: top2 + this.width / 2 };
      }
    }
    if (!rect) {
      var coords = this.editorView.coordsAtPos(this.cursorPos);
      rect = { left: coords.left - this.width / 2, right: coords.left + this.width / 2, top: coords.top, bottom: coords.bottom };
    }
    var parent = this.editorView.dom.offsetParent;
    if (!this.element) {
      this.element = parent.appendChild(document.createElement("div"));
      if (this.class) {
        this.element.className = this.class;
      }
      this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none; background-color: " + this.color;
    }
    var parentLeft, parentTop;
    if (!parent || parent == document.body && getComputedStyle(parent).position == "static") {
      parentLeft = -pageXOffset;
      parentTop = -pageYOffset;
    } else {
      var rect$1 = parent.getBoundingClientRect();
      parentLeft = rect$1.left - parent.scrollLeft;
      parentTop = rect$1.top - parent.scrollTop;
    }
    this.element.style.left = rect.left - parentLeft + "px";
    this.element.style.top = rect.top - parentTop + "px";
    this.element.style.width = rect.right - rect.left + "px";
    this.element.style.height = rect.bottom - rect.top + "px";
  };
  DropCursorView.prototype.scheduleRemoval = function scheduleRemoval(timeout) {
    var this$1 = this;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(function() {
      return this$1.setCursor(null);
    }, timeout);
  };
  DropCursorView.prototype.dragover = function dragover(event) {
    if (!this.editorView.editable) {
      return;
    }
    var pos = this.editorView.posAtCoords({ left: event.clientX, top: event.clientY });
    var node4 = pos && pos.inside >= 0 && this.editorView.state.doc.nodeAt(pos.inside);
    var disableDropCursor = node4 && node4.type.spec.disableDropCursor;
    var disabled = typeof disableDropCursor == "function" ? disableDropCursor(this.editorView, pos) : disableDropCursor;
    if (pos && !disabled) {
      var target = pos.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        target = dropPoint(this.editorView.state.doc, target, this.editorView.dragging.slice);
        if (target == null) {
          return this.setCursor(null);
        }
      }
      this.setCursor(target);
      this.scheduleRemoval(5e3);
    }
  };
  DropCursorView.prototype.dragend = function dragend() {
    this.scheduleRemoval(20);
  };
  DropCursorView.prototype.drop = function drop() {
    this.scheduleRemoval(20);
  };
  DropCursorView.prototype.dragleave = function dragleave(event) {
    if (event.target == this.editorView.dom || !this.editorView.dom.contains(event.relatedTarget)) {
      this.setCursor(null);
    }
  };

  // node_modules/@tiptap/extension-dropcursor/dist/tiptap-extension-dropcursor.esm.js
  var Dropcursor = Extension.create({
    name: "dropCursor",
    addOptions() {
      return {
        color: "currentColor",
        width: 1,
        class: null
      };
    },
    addProseMirrorPlugins() {
      return [
        dropCursor(this.options)
      ];
    }
  });

  // node_modules/prosemirror-gapcursor/dist/index.es.js
  var GapCursor = /* @__PURE__ */ function(Selection3) {
    function GapCursor2($pos) {
      Selection3.call(this, $pos, $pos);
    }
    if (Selection3)
      GapCursor2.__proto__ = Selection3;
    GapCursor2.prototype = Object.create(Selection3 && Selection3.prototype);
    GapCursor2.prototype.constructor = GapCursor2;
    GapCursor2.prototype.map = function map15(doc2, mapping) {
      var $pos = doc2.resolve(mapping.map(this.head));
      return GapCursor2.valid($pos) ? new GapCursor2($pos) : Selection3.near($pos);
    };
    GapCursor2.prototype.content = function content2() {
      return Slice.empty;
    };
    GapCursor2.prototype.eq = function eq12(other) {
      return other instanceof GapCursor2 && other.head == this.head;
    };
    GapCursor2.prototype.toJSON = function toJSON7() {
      return { type: "gapcursor", pos: this.head };
    };
    GapCursor2.fromJSON = function fromJSON8(doc2, json) {
      if (typeof json.pos != "number") {
        throw new RangeError("Invalid input for GapCursor.fromJSON");
      }
      return new GapCursor2(doc2.resolve(json.pos));
    };
    GapCursor2.prototype.getBookmark = function getBookmark2() {
      return new GapBookmark(this.anchor);
    };
    GapCursor2.valid = function valid4($pos) {
      var parent = $pos.parent;
      if (parent.isTextblock || !closedBefore($pos) || !closedAfter($pos)) {
        return false;
      }
      var override = parent.type.spec.allowGapCursor;
      if (override != null) {
        return override;
      }
      var deflt = parent.contentMatchAt($pos.index()).defaultType;
      return deflt && deflt.isTextblock;
    };
    GapCursor2.findFrom = function findFrom2($pos, dir, mustMove) {
      search:
        for (; ; ) {
          if (!mustMove && GapCursor2.valid($pos)) {
            return $pos;
          }
          var pos = $pos.pos, next = null;
          for (var d = $pos.depth; ; d--) {
            var parent = $pos.node(d);
            if (dir > 0 ? $pos.indexAfter(d) < parent.childCount : $pos.index(d) > 0) {
              next = parent.child(dir > 0 ? $pos.indexAfter(d) : $pos.index(d) - 1);
              break;
            } else if (d == 0) {
              return null;
            }
            pos += dir;
            var $cur = $pos.doc.resolve(pos);
            if (GapCursor2.valid($cur)) {
              return $cur;
            }
          }
          for (; ; ) {
            var inside = dir > 0 ? next.firstChild : next.lastChild;
            if (!inside) {
              if (next.isAtom && !next.isText && !NodeSelection.isSelectable(next)) {
                $pos = $pos.doc.resolve(pos + next.nodeSize * dir);
                mustMove = false;
                continue search;
              }
              break;
            }
            next = inside;
            pos += dir;
            var $cur$1 = $pos.doc.resolve(pos);
            if (GapCursor2.valid($cur$1)) {
              return $cur$1;
            }
          }
          return null;
        }
    };
    return GapCursor2;
  }(Selection);
  GapCursor.prototype.visible = false;
  Selection.jsonID("gapcursor", GapCursor);
  var GapBookmark = function GapBookmark2(pos) {
    this.pos = pos;
  };
  GapBookmark.prototype.map = function map13(mapping) {
    return new GapBookmark(mapping.map(this.pos));
  };
  GapBookmark.prototype.resolve = function resolve6(doc2) {
    var $pos = doc2.resolve(this.pos);
    return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos);
  };
  function closedBefore($pos) {
    for (var d = $pos.depth; d >= 0; d--) {
      var index2 = $pos.index(d), parent = $pos.node(d);
      if (index2 == 0) {
        if (parent.type.spec.isolating) {
          return true;
        }
        continue;
      }
      for (var before2 = parent.child(index2 - 1); ; before2 = before2.lastChild) {
        if (before2.childCount == 0 && !before2.inlineContent || before2.isAtom || before2.type.spec.isolating) {
          return true;
        }
        if (before2.inlineContent) {
          return false;
        }
      }
    }
    return true;
  }
  function closedAfter($pos) {
    for (var d = $pos.depth; d >= 0; d--) {
      var index2 = $pos.indexAfter(d), parent = $pos.node(d);
      if (index2 == parent.childCount) {
        if (parent.type.spec.isolating) {
          return true;
        }
        continue;
      }
      for (var after2 = parent.child(index2); ; after2 = after2.firstChild) {
        if (after2.childCount == 0 && !after2.inlineContent || after2.isAtom || after2.type.spec.isolating) {
          return true;
        }
        if (after2.inlineContent) {
          return false;
        }
      }
    }
    return true;
  }
  var gapCursor = function() {
    return new Plugin({
      props: {
        decorations: drawGapCursor,
        createSelectionBetween: function createSelectionBetween(_view, $anchor, $head) {
          if ($anchor.pos == $head.pos && GapCursor.valid($head)) {
            return new GapCursor($head);
          }
        },
        handleClick,
        handleKeyDown,
        handleDOMEvents: { beforeinput }
      }
    });
  };
  var handleKeyDown = keydownHandler({
    "ArrowLeft": arrow2("horiz", -1),
    "ArrowRight": arrow2("horiz", 1),
    "ArrowUp": arrow2("vert", -1),
    "ArrowDown": arrow2("vert", 1)
  });
  function arrow2(axis, dir) {
    var dirStr = axis == "vert" ? dir > 0 ? "down" : "up" : dir > 0 ? "right" : "left";
    return function(state, dispatch3, view) {
      var sel = state.selection;
      var $start = dir > 0 ? sel.$to : sel.$from, mustMove = sel.empty;
      if (sel instanceof TextSelection) {
        if (!view.endOfTextblock(dirStr) || $start.depth == 0) {
          return false;
        }
        mustMove = false;
        $start = state.doc.resolve(dir > 0 ? $start.after() : $start.before());
      }
      var $found = GapCursor.findFrom($start, dir, mustMove);
      if (!$found) {
        return false;
      }
      if (dispatch3) {
        dispatch3(state.tr.setSelection(new GapCursor($found)));
      }
      return true;
    };
  }
  function handleClick(view, pos, event) {
    if (!view.editable) {
      return false;
    }
    var $pos = view.state.doc.resolve(pos);
    if (!GapCursor.valid($pos)) {
      return false;
    }
    var ref = view.posAtCoords({ left: event.clientX, top: event.clientY });
    var inside = ref.inside;
    if (inside > -1 && NodeSelection.isSelectable(view.state.doc.nodeAt(inside))) {
      return false;
    }
    view.dispatch(view.state.tr.setSelection(new GapCursor($pos)));
    return true;
  }
  function beforeinput(view, event) {
    if (event.inputType != "insertCompositionText" || !(view.state.selection instanceof GapCursor)) {
      return false;
    }
    var ref = view.state.selection;
    var $from = ref.$from;
    var insert = $from.parent.contentMatchAt($from.index()).findWrapping(view.state.schema.nodes.text);
    if (!insert) {
      return false;
    }
    var frag = Fragment.empty;
    for (var i = insert.length - 1; i >= 0; i--) {
      frag = Fragment.from(insert[i].createAndFill(null, frag));
    }
    var tr = view.state.tr.replace($from.pos, $from.pos, new Slice(frag, 0, 0));
    tr.setSelection(TextSelection.near(tr.doc.resolve($from.pos + 1)));
    view.dispatch(tr);
    return false;
  }
  function drawGapCursor(state) {
    if (!(state.selection instanceof GapCursor)) {
      return null;
    }
    var node4 = document.createElement("div");
    node4.className = "ProseMirror-gapcursor";
    return DecorationSet.create(state.doc, [Decoration.widget(state.selection.head, node4, { key: "gapcursor" })]);
  }

  // node_modules/@tiptap/extension-gapcursor/dist/tiptap-extension-gapcursor.esm.js
  var Gapcursor = Extension.create({
    name: "gapCursor",
    addProseMirrorPlugins() {
      return [
        gapCursor()
      ];
    },
    extendNodeSchema(extension) {
      var _a;
      const context = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage
      };
      return {
        allowGapCursor: (_a = callOrReturn(getExtensionField(extension, "allowGapCursor", context))) !== null && _a !== void 0 ? _a : null
      };
    }
  });

  // node_modules/@tiptap/extension-hard-break/dist/tiptap-extension-hard-break.esm.js
  var HardBreak = Node4.create({
    name: "hardBreak",
    addOptions() {
      return {
        keepMarks: true,
        HTMLAttributes: {}
      };
    },
    inline: true,
    group: "inline",
    selectable: false,
    parseHTML() {
      return [
        { tag: "br" }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["br", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },
    renderText() {
      return "\n";
    },
    addCommands() {
      return {
        setHardBreak: () => ({ commands, chain, state, editor }) => {
          return commands.first([
            () => commands.exitCode(),
            () => commands.command(() => {
              const { selection, storedMarks } = state;
              if (selection.$from.parent.type.spec.isolating) {
                return false;
              }
              const { keepMarks } = this.options;
              const { splittableMarks } = editor.extensionManager;
              const marks2 = storedMarks || selection.$to.parentOffset && selection.$from.marks();
              return chain().insertContent({ type: this.name }).command(({ tr, dispatch: dispatch3 }) => {
                if (dispatch3 && marks2 && keepMarks) {
                  const filteredMarks = marks2.filter((mark3) => splittableMarks.includes(mark3.type.name));
                  tr.ensureMarks(filteredMarks);
                }
                return true;
              }).run();
            })
          ]);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-Enter": () => this.editor.commands.setHardBreak(),
        "Shift-Enter": () => this.editor.commands.setHardBreak()
      };
    }
  });

  // node_modules/@tiptap/extension-heading/dist/tiptap-extension-heading.esm.js
  var Heading = Node4.create({
    name: "heading",
    addOptions() {
      return {
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {}
      };
    },
    content: "inline*",
    group: "block",
    defining: true,
    addAttributes() {
      return {
        level: {
          default: 1,
          rendered: false
        }
      };
    },
    parseHTML() {
      return this.options.levels.map((level) => ({
        tag: `h${level}`,
        attrs: { level }
      }));
    },
    renderHTML({ node: node4, HTMLAttributes }) {
      const hasLevel = this.options.levels.includes(node4.attrs.level);
      const level = hasLevel ? node4.attrs.level : this.options.levels[0];
      return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        setHeading: (attributes) => ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }
          return commands.setNode(this.name, attributes);
        },
        toggleHeading: (attributes) => ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }
          return commands.toggleNode(this.name, "paragraph", attributes);
        }
      };
    },
    addKeyboardShortcuts() {
      return this.options.levels.reduce((items, level) => ({
        ...items,
        ...{
          [`Mod-Alt-${level}`]: () => this.editor.commands.toggleHeading({ level })
        }
      }), {});
    },
    addInputRules() {
      return this.options.levels.map((level) => {
        return textblockTypeInputRule({
          find: new RegExp(`^(#{1,${level}})\\s$`),
          type: this.type,
          getAttributes: {
            level
          }
        });
      });
    }
  });

  // node_modules/rope-sequence/dist/index.es.js
  var GOOD_LEAF_SIZE = 200;
  var RopeSequence = function RopeSequence2() {
  };
  RopeSequence.prototype.append = function append2(other) {
    if (!other.length) {
      return this;
    }
    other = RopeSequence.from(other);
    return !this.length && other || other.length < GOOD_LEAF_SIZE && this.leafAppend(other) || this.length < GOOD_LEAF_SIZE && other.leafPrepend(this) || this.appendInner(other);
  };
  RopeSequence.prototype.prepend = function prepend(other) {
    if (!other.length) {
      return this;
    }
    return RopeSequence.from(other).append(this);
  };
  RopeSequence.prototype.appendInner = function appendInner(other) {
    return new Append(this, other);
  };
  RopeSequence.prototype.slice = function slice3(from4, to) {
    if (from4 === void 0)
      from4 = 0;
    if (to === void 0)
      to = this.length;
    if (from4 >= to) {
      return RopeSequence.empty;
    }
    return this.sliceInner(Math.max(0, from4), Math.min(this.length, to));
  };
  RopeSequence.prototype.get = function get2(i) {
    if (i < 0 || i >= this.length) {
      return void 0;
    }
    return this.getInner(i);
  };
  RopeSequence.prototype.forEach = function forEach5(f, from4, to) {
    if (from4 === void 0)
      from4 = 0;
    if (to === void 0)
      to = this.length;
    if (from4 <= to) {
      this.forEachInner(f, from4, to, 0);
    } else {
      this.forEachInvertedInner(f, from4, to, 0);
    }
  };
  RopeSequence.prototype.map = function map14(f, from4, to) {
    if (from4 === void 0)
      from4 = 0;
    if (to === void 0)
      to = this.length;
    var result2 = [];
    this.forEach(function(elt, i) {
      return result2.push(f(elt, i));
    }, from4, to);
    return result2;
  };
  RopeSequence.from = function from3(values) {
    if (values instanceof RopeSequence) {
      return values;
    }
    return values && values.length ? new Leaf(values) : RopeSequence.empty;
  };
  var Leaf = /* @__PURE__ */ function(RopeSequence3) {
    function Leaf2(values) {
      RopeSequence3.call(this);
      this.values = values;
    }
    if (RopeSequence3)
      Leaf2.__proto__ = RopeSequence3;
    Leaf2.prototype = Object.create(RopeSequence3 && RopeSequence3.prototype);
    Leaf2.prototype.constructor = Leaf2;
    var prototypeAccessors5 = { length: { configurable: true }, depth: { configurable: true } };
    Leaf2.prototype.flatten = function flatten() {
      return this.values;
    };
    Leaf2.prototype.sliceInner = function sliceInner(from4, to) {
      if (from4 == 0 && to == this.length) {
        return this;
      }
      return new Leaf2(this.values.slice(from4, to));
    };
    Leaf2.prototype.getInner = function getInner(i) {
      return this.values[i];
    };
    Leaf2.prototype.forEachInner = function forEachInner(f, from4, to, start5) {
      for (var i = from4; i < to; i++) {
        if (f(this.values[i], start5 + i) === false) {
          return false;
        }
      }
    };
    Leaf2.prototype.forEachInvertedInner = function forEachInvertedInner(f, from4, to, start5) {
      for (var i = from4 - 1; i >= to; i--) {
        if (f(this.values[i], start5 + i) === false) {
          return false;
        }
      }
    };
    Leaf2.prototype.leafAppend = function leafAppend(other) {
      if (this.length + other.length <= GOOD_LEAF_SIZE) {
        return new Leaf2(this.values.concat(other.flatten()));
      }
    };
    Leaf2.prototype.leafPrepend = function leafPrepend(other) {
      if (this.length + other.length <= GOOD_LEAF_SIZE) {
        return new Leaf2(other.flatten().concat(this.values));
      }
    };
    prototypeAccessors5.length.get = function() {
      return this.values.length;
    };
    prototypeAccessors5.depth.get = function() {
      return 0;
    };
    Object.defineProperties(Leaf2.prototype, prototypeAccessors5);
    return Leaf2;
  }(RopeSequence);
  RopeSequence.empty = new Leaf([]);
  var Append = /* @__PURE__ */ function(RopeSequence3) {
    function Append2(left2, right2) {
      RopeSequence3.call(this);
      this.left = left2;
      this.right = right2;
      this.length = left2.length + right2.length;
      this.depth = Math.max(left2.depth, right2.depth) + 1;
    }
    if (RopeSequence3)
      Append2.__proto__ = RopeSequence3;
    Append2.prototype = Object.create(RopeSequence3 && RopeSequence3.prototype);
    Append2.prototype.constructor = Append2;
    Append2.prototype.flatten = function flatten() {
      return this.left.flatten().concat(this.right.flatten());
    };
    Append2.prototype.getInner = function getInner(i) {
      return i < this.left.length ? this.left.get(i) : this.right.get(i - this.left.length);
    };
    Append2.prototype.forEachInner = function forEachInner(f, from4, to, start5) {
      var leftLen = this.left.length;
      if (from4 < leftLen && this.left.forEachInner(f, from4, Math.min(to, leftLen), start5) === false) {
        return false;
      }
      if (to > leftLen && this.right.forEachInner(f, Math.max(from4 - leftLen, 0), Math.min(this.length, to) - leftLen, start5 + leftLen) === false) {
        return false;
      }
    };
    Append2.prototype.forEachInvertedInner = function forEachInvertedInner(f, from4, to, start5) {
      var leftLen = this.left.length;
      if (from4 > leftLen && this.right.forEachInvertedInner(f, from4 - leftLen, Math.max(to, leftLen) - leftLen, start5 + leftLen) === false) {
        return false;
      }
      if (to < leftLen && this.left.forEachInvertedInner(f, Math.min(from4, leftLen), to, start5) === false) {
        return false;
      }
    };
    Append2.prototype.sliceInner = function sliceInner(from4, to) {
      if (from4 == 0 && to == this.length) {
        return this;
      }
      var leftLen = this.left.length;
      if (to <= leftLen) {
        return this.left.slice(from4, to);
      }
      if (from4 >= leftLen) {
        return this.right.slice(from4 - leftLen, to - leftLen);
      }
      return this.left.slice(from4, leftLen).append(this.right.slice(0, to - leftLen));
    };
    Append2.prototype.leafAppend = function leafAppend(other) {
      var inner = this.right.leafAppend(other);
      if (inner) {
        return new Append2(this.left, inner);
      }
    };
    Append2.prototype.leafPrepend = function leafPrepend(other) {
      var inner = this.left.leafPrepend(other);
      if (inner) {
        return new Append2(inner, this.right);
      }
    };
    Append2.prototype.appendInner = function appendInner2(other) {
      if (this.left.depth >= Math.max(this.right.depth, other.depth) + 1) {
        return new Append2(this.left, new Append2(this.right, other));
      }
      return new Append2(this, other);
    };
    return Append2;
  }(RopeSequence);
  var ropeSequence = RopeSequence;
  var index_es_default2 = ropeSequence;

  // node_modules/prosemirror-history/dist/index.es.js
  var max_empty_items = 500;
  var Branch = function Branch2(items, eventCount) {
    this.items = items;
    this.eventCount = eventCount;
  };
  Branch.prototype.popEvent = function popEvent(state, preserveItems) {
    var this$1 = this;
    if (this.eventCount == 0) {
      return null;
    }
    var end3 = this.items.length;
    for (; ; end3--) {
      var next = this.items.get(end3 - 1);
      if (next.selection) {
        --end3;
        break;
      }
    }
    var remap, mapFrom;
    if (preserveItems) {
      remap = this.remapping(end3, this.items.length);
      mapFrom = remap.maps.length;
    }
    var transform = state.tr;
    var selection, remaining;
    var addAfter = [], addBefore = [];
    this.items.forEach(function(item, i) {
      if (!item.step) {
        if (!remap) {
          remap = this$1.remapping(end3, i + 1);
          mapFrom = remap.maps.length;
        }
        mapFrom--;
        addBefore.push(item);
        return;
      }
      if (remap) {
        addBefore.push(new Item(item.map));
        var step2 = item.step.map(remap.slice(mapFrom)), map15;
        if (step2 && transform.maybeStep(step2).doc) {
          map15 = transform.mapping.maps[transform.mapping.maps.length - 1];
          addAfter.push(new Item(map15, null, null, addAfter.length + addBefore.length));
        }
        mapFrom--;
        if (map15) {
          remap.appendMap(map15, mapFrom);
        }
      } else {
        transform.maybeStep(item.step);
      }
      if (item.selection) {
        selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection;
        remaining = new Branch(this$1.items.slice(0, end3).append(addBefore.reverse().concat(addAfter)), this$1.eventCount - 1);
        return false;
      }
    }, this.items.length, 0);
    return { remaining, transform, selection };
  };
  Branch.prototype.addTransform = function addTransform(transform, selection, histOptions, preserveItems) {
    var newItems = [], eventCount = this.eventCount;
    var oldItems = this.items, lastItem = !preserveItems && oldItems.length ? oldItems.get(oldItems.length - 1) : null;
    for (var i = 0; i < transform.steps.length; i++) {
      var step2 = transform.steps[i].invert(transform.docs[i]);
      var item = new Item(transform.mapping.maps[i], step2, selection), merged = void 0;
      if (merged = lastItem && lastItem.merge(item)) {
        item = merged;
        if (i) {
          newItems.pop();
        } else {
          oldItems = oldItems.slice(0, oldItems.length - 1);
        }
      }
      newItems.push(item);
      if (selection) {
        eventCount++;
        selection = null;
      }
      if (!preserveItems) {
        lastItem = item;
      }
    }
    var overflow = eventCount - histOptions.depth;
    if (overflow > DEPTH_OVERFLOW) {
      oldItems = cutOffEvents(oldItems, overflow);
      eventCount -= overflow;
    }
    return new Branch(oldItems.append(newItems), eventCount);
  };
  Branch.prototype.remapping = function remapping(from4, to) {
    var maps = new Mapping();
    this.items.forEach(function(item, i) {
      var mirrorPos = item.mirrorOffset != null && i - item.mirrorOffset >= from4 ? maps.maps.length - item.mirrorOffset : null;
      maps.appendMap(item.map, mirrorPos);
    }, from4, to);
    return maps;
  };
  Branch.prototype.addMaps = function addMaps(array) {
    if (this.eventCount == 0) {
      return this;
    }
    return new Branch(this.items.append(array.map(function(map15) {
      return new Item(map15);
    })), this.eventCount);
  };
  Branch.prototype.rebased = function rebased(rebasedTransform, rebasedCount) {
    if (!this.eventCount) {
      return this;
    }
    var rebasedItems = [], start5 = Math.max(0, this.items.length - rebasedCount);
    var mapping = rebasedTransform.mapping;
    var newUntil = rebasedTransform.steps.length;
    var eventCount = this.eventCount;
    this.items.forEach(function(item) {
      if (item.selection) {
        eventCount--;
      }
    }, start5);
    var iRebased = rebasedCount;
    this.items.forEach(function(item) {
      var pos = mapping.getMirror(--iRebased);
      if (pos == null) {
        return;
      }
      newUntil = Math.min(newUntil, pos);
      var map15 = mapping.maps[pos];
      if (item.step) {
        var step2 = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos]);
        var selection = item.selection && item.selection.map(mapping.slice(iRebased + 1, pos));
        if (selection) {
          eventCount++;
        }
        rebasedItems.push(new Item(map15, step2, selection));
      } else {
        rebasedItems.push(new Item(map15));
      }
    }, start5);
    var newMaps = [];
    for (var i = rebasedCount; i < newUntil; i++) {
      newMaps.push(new Item(mapping.maps[i]));
    }
    var items = this.items.slice(0, start5).append(newMaps).append(rebasedItems);
    var branch = new Branch(items, eventCount);
    if (branch.emptyItemCount() > max_empty_items) {
      branch = branch.compress(this.items.length - rebasedItems.length);
    }
    return branch;
  };
  Branch.prototype.emptyItemCount = function emptyItemCount() {
    var count = 0;
    this.items.forEach(function(item) {
      if (!item.step) {
        count++;
      }
    });
    return count;
  };
  Branch.prototype.compress = function compress(upto) {
    if (upto === void 0)
      upto = this.items.length;
    var remap = this.remapping(0, upto), mapFrom = remap.maps.length;
    var items = [], events = 0;
    this.items.forEach(function(item, i) {
      if (i >= upto) {
        items.push(item);
        if (item.selection) {
          events++;
        }
      } else if (item.step) {
        var step2 = item.step.map(remap.slice(mapFrom)), map15 = step2 && step2.getMap();
        mapFrom--;
        if (map15) {
          remap.appendMap(map15, mapFrom);
        }
        if (step2) {
          var selection = item.selection && item.selection.map(remap.slice(mapFrom));
          if (selection) {
            events++;
          }
          var newItem = new Item(map15.invert(), step2, selection), merged, last = items.length - 1;
          if (merged = items.length && items[last].merge(newItem)) {
            items[last] = merged;
          } else {
            items.push(newItem);
          }
        }
      } else if (item.map) {
        mapFrom--;
      }
    }, this.items.length, 0);
    return new Branch(index_es_default2.from(items.reverse()), events);
  };
  Branch.empty = new Branch(index_es_default2.empty, 0);
  function cutOffEvents(items, n) {
    var cutPoint;
    items.forEach(function(item, i) {
      if (item.selection && n-- == 0) {
        cutPoint = i;
        return false;
      }
    });
    return items.slice(cutPoint);
  }
  var Item = function Item2(map15, step2, selection, mirrorOffset) {
    this.map = map15;
    this.step = step2;
    this.selection = selection;
    this.mirrorOffset = mirrorOffset;
  };
  Item.prototype.merge = function merge2(other) {
    if (this.step && other.step && !other.selection) {
      var step2 = other.step.merge(this.step);
      if (step2) {
        return new Item(step2.getMap().invert(), step2, this.selection);
      }
    }
  };
  var HistoryState = function HistoryState2(done2, undone, prevRanges, prevTime) {
    this.done = done2;
    this.undone = undone;
    this.prevRanges = prevRanges;
    this.prevTime = prevTime;
  };
  var DEPTH_OVERFLOW = 20;
  function applyTransaction2(history3, state, tr, options) {
    var historyTr = tr.getMeta(historyKey), rebased2;
    if (historyTr) {
      return historyTr.historyState;
    }
    if (tr.getMeta(closeHistoryKey)) {
      history3 = new HistoryState(history3.done, history3.undone, null, 0);
    }
    var appended = tr.getMeta("appendedTransaction");
    if (tr.steps.length == 0) {
      return history3;
    } else if (appended && appended.getMeta(historyKey)) {
      if (appended.getMeta(historyKey).redo) {
        return new HistoryState(history3.done.addTransform(tr, null, options, mustPreserveItems(state)), history3.undone, rangesFor(tr.mapping.maps[tr.steps.length - 1]), history3.prevTime);
      } else {
        return new HistoryState(history3.done, history3.undone.addTransform(tr, null, options, mustPreserveItems(state)), null, history3.prevTime);
      }
    } else if (tr.getMeta("addToHistory") !== false && !(appended && appended.getMeta("addToHistory") === false)) {
      var newGroup = history3.prevTime == 0 || !appended && (history3.prevTime < (tr.time || 0) - options.newGroupDelay || !isAdjacentTo(tr, history3.prevRanges));
      var prevRanges = appended ? mapRanges(history3.prevRanges, tr.mapping) : rangesFor(tr.mapping.maps[tr.steps.length - 1]);
      return new HistoryState(history3.done.addTransform(tr, newGroup ? state.selection.getBookmark() : null, options, mustPreserveItems(state)), Branch.empty, prevRanges, tr.time);
    } else if (rebased2 = tr.getMeta("rebased")) {
      return new HistoryState(history3.done.rebased(tr, rebased2), history3.undone.rebased(tr, rebased2), mapRanges(history3.prevRanges, tr.mapping), history3.prevTime);
    } else {
      return new HistoryState(history3.done.addMaps(tr.mapping.maps), history3.undone.addMaps(tr.mapping.maps), mapRanges(history3.prevRanges, tr.mapping), history3.prevTime);
    }
  }
  function isAdjacentTo(transform, prevRanges) {
    if (!prevRanges) {
      return false;
    }
    if (!transform.docChanged) {
      return true;
    }
    var adjacent = false;
    transform.mapping.maps[0].forEach(function(start5, end3) {
      for (var i = 0; i < prevRanges.length; i += 2) {
        if (start5 <= prevRanges[i + 1] && end3 >= prevRanges[i]) {
          adjacent = true;
        }
      }
    });
    return adjacent;
  }
  function rangesFor(map15) {
    var result2 = [];
    map15.forEach(function(_from, _to, from4, to) {
      return result2.push(from4, to);
    });
    return result2;
  }
  function mapRanges(ranges, mapping) {
    if (!ranges) {
      return null;
    }
    var result2 = [];
    for (var i = 0; i < ranges.length; i += 2) {
      var from4 = mapping.map(ranges[i], 1), to = mapping.map(ranges[i + 1], -1);
      if (from4 <= to) {
        result2.push(from4, to);
      }
    }
    return result2;
  }
  function histTransaction(history3, state, dispatch3, redo2) {
    var preserveItems = mustPreserveItems(state), histOptions = historyKey.get(state).spec.config;
    var pop = (redo2 ? history3.undone : history3.done).popEvent(state, preserveItems);
    if (!pop) {
      return;
    }
    var selection = pop.selection.resolve(pop.transform.doc);
    var added = (redo2 ? history3.done : history3.undone).addTransform(pop.transform, state.selection.getBookmark(), histOptions, preserveItems);
    var newHist = new HistoryState(redo2 ? added : pop.remaining, redo2 ? pop.remaining : added, null, 0);
    dispatch3(pop.transform.setSelection(selection).setMeta(historyKey, { redo: redo2, historyState: newHist }).scrollIntoView());
  }
  var cachedPreserveItems = false;
  var cachedPreserveItemsPlugins = null;
  function mustPreserveItems(state) {
    var plugins = state.plugins;
    if (cachedPreserveItemsPlugins != plugins) {
      cachedPreserveItems = false;
      cachedPreserveItemsPlugins = plugins;
      for (var i = 0; i < plugins.length; i++) {
        if (plugins[i].spec.historyPreserveItems) {
          cachedPreserveItems = true;
          break;
        }
      }
    }
    return cachedPreserveItems;
  }
  var historyKey = new PluginKey("history");
  var closeHistoryKey = new PluginKey("closeHistory");
  function history2(config) {
    config = {
      depth: config && config.depth || 100,
      newGroupDelay: config && config.newGroupDelay || 500
    };
    return new Plugin({
      key: historyKey,
      state: {
        init: function init5() {
          return new HistoryState(Branch.empty, Branch.empty, null, 0);
        },
        apply: function apply8(tr, hist, state) {
          return applyTransaction2(hist, state, tr, config);
        }
      },
      config,
      props: {
        handleDOMEvents: {
          beforeinput: function beforeinput2(view, e) {
            var handled = e.inputType == "historyUndo" ? undo(view.state, view.dispatch) : e.inputType == "historyRedo" ? redo(view.state, view.dispatch) : false;
            if (handled) {
              e.preventDefault();
            }
            return handled;
          }
        }
      }
    });
  }
  function undo(state, dispatch3) {
    var hist = historyKey.getState(state);
    if (!hist || hist.done.eventCount == 0) {
      return false;
    }
    if (dispatch3) {
      histTransaction(hist, state, dispatch3, false);
    }
    return true;
  }
  function redo(state, dispatch3) {
    var hist = historyKey.getState(state);
    if (!hist || hist.undone.eventCount == 0) {
      return false;
    }
    if (dispatch3) {
      histTransaction(hist, state, dispatch3, true);
    }
    return true;
  }

  // node_modules/@tiptap/extension-history/dist/tiptap-extension-history.esm.js
  var History2 = Extension.create({
    name: "history",
    addOptions() {
      return {
        depth: 100,
        newGroupDelay: 500
      };
    },
    addCommands() {
      return {
        undo: () => ({ state, dispatch: dispatch3 }) => {
          return undo(state, dispatch3);
        },
        redo: () => ({ state, dispatch: dispatch3 }) => {
          return redo(state, dispatch3);
        }
      };
    },
    addProseMirrorPlugins() {
      return [
        history2(this.options)
      ];
    },
    addKeyboardShortcuts() {
      return {
        "Mod-z": () => this.editor.commands.undo(),
        "Mod-y": () => this.editor.commands.redo(),
        "Shift-Mod-z": () => this.editor.commands.redo(),
        "Mod-\u044F": () => this.editor.commands.undo(),
        "Shift-Mod-\u044F": () => this.editor.commands.redo()
      };
    }
  });

  // node_modules/@tiptap/extension-horizontal-rule/dist/tiptap-extension-horizontal-rule.esm.js
  var HorizontalRule = Node4.create({
    name: "horizontalRule",
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    group: "block",
    parseHTML() {
      return [
        { tag: "hr" }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["hr", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },
    addCommands() {
      return {
        setHorizontalRule: () => ({ chain }) => {
          return chain().insertContent({ type: this.name }).command(({ tr, dispatch: dispatch3 }) => {
            var _a;
            if (dispatch3) {
              const { $to } = tr.selection;
              const posAfter = $to.end();
              if ($to.nodeAfter) {
                tr.setSelection(TextSelection.create(tr.doc, $to.pos));
              } else {
                const node4 = (_a = $to.parent.type.contentMatch.defaultType) === null || _a === void 0 ? void 0 : _a.create();
                if (node4) {
                  tr.insert(posAfter, node4);
                  tr.setSelection(TextSelection.create(tr.doc, posAfter));
                }
              }
              tr.scrollIntoView();
            }
            return true;
          }).run();
        }
      };
    },
    addInputRules() {
      return [
        nodeInputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          type: this.type
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-italic/dist/tiptap-extension-italic.esm.js
  var starInputRegex2 = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/;
  var starPasteRegex2 = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g;
  var underscoreInputRegex2 = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/;
  var underscorePasteRegex2 = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g;
  var Italic = Mark3.create({
    name: "italic",
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    parseHTML() {
      return [
        {
          tag: "em"
        },
        {
          tag: "i",
          getAttrs: (node4) => node4.style.fontStyle !== "normal" && null
        },
        {
          style: "font-style=italic"
        }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["em", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        setItalic: () => ({ commands }) => {
          return commands.setMark(this.name);
        },
        toggleItalic: () => ({ commands }) => {
          return commands.toggleMark(this.name);
        },
        unsetItalic: () => ({ commands }) => {
          return commands.unsetMark(this.name);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-i": () => this.editor.commands.toggleItalic(),
        "Mod-I": () => this.editor.commands.toggleItalic()
      };
    },
    addInputRules() {
      return [
        markInputRule({
          find: starInputRegex2,
          type: this.type
        }),
        markInputRule({
          find: underscoreInputRegex2,
          type: this.type
        })
      ];
    },
    addPasteRules() {
      return [
        markPasteRule({
          find: starPasteRegex2,
          type: this.type
        }),
        markPasteRule({
          find: underscorePasteRegex2,
          type: this.type
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-list-item/dist/tiptap-extension-list-item.esm.js
  var ListItem = Node4.create({
    name: "listItem",
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    content: "paragraph block*",
    defining: true,
    parseHTML() {
      return [
        {
          tag: "li"
        }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["li", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addKeyboardShortcuts() {
      return {
        Enter: () => this.editor.commands.splitListItem(this.name),
        Tab: () => this.editor.commands.sinkListItem(this.name),
        "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
      };
    }
  });

  // node_modules/@tiptap/extension-ordered-list/dist/tiptap-extension-ordered-list.esm.js
  var inputRegex4 = /^(\d+)\.\s$/;
  var OrderedList = Node4.create({
    name: "orderedList",
    addOptions() {
      return {
        itemTypeName: "listItem",
        HTMLAttributes: {}
      };
    },
    group: "block list",
    content() {
      return `${this.options.itemTypeName}+`;
    },
    addAttributes() {
      return {
        start: {
          default: 1,
          parseHTML: (element) => {
            return element.hasAttribute("start") ? parseInt(element.getAttribute("start") || "", 10) : 1;
          }
        }
      };
    },
    parseHTML() {
      return [
        {
          tag: "ol"
        }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      const { start: start5, ...attributesWithoutStart } = HTMLAttributes;
      return start5 === 1 ? ["ol", mergeAttributes(this.options.HTMLAttributes, attributesWithoutStart), 0] : ["ol", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        toggleOrderedList: () => ({ commands }) => {
          return commands.toggleList(this.name, this.options.itemTypeName);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
      };
    },
    addInputRules() {
      return [
        wrappingInputRule({
          find: inputRegex4,
          type: this.type,
          getAttributes: (match) => ({ start: +match[1] }),
          joinPredicate: (match, node4) => node4.childCount + node4.attrs.start === +match[1]
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-paragraph/dist/tiptap-extension-paragraph.esm.js
  var Paragraph = Node4.create({
    name: "paragraph",
    priority: 1e3,
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    group: "block",
    content: "inline*",
    parseHTML() {
      return [
        { tag: "p" }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["p", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        setParagraph: () => ({ commands }) => {
          return commands.setNode(this.name);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-Alt-0": () => this.editor.commands.setParagraph()
      };
    }
  });

  // node_modules/@tiptap/extension-strike/dist/tiptap-extension-strike.esm.js
  var inputRegex5 = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/;
  var pasteRegex2 = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g;
  var Strike = Mark3.create({
    name: "strike",
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    parseHTML() {
      return [
        {
          tag: "s"
        },
        {
          tag: "del"
        },
        {
          tag: "strike"
        },
        {
          style: "text-decoration",
          consuming: false,
          getAttrs: (style2) => style2.includes("line-through") ? {} : false
        }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["s", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        setStrike: () => ({ commands }) => {
          return commands.setMark(this.name);
        },
        toggleStrike: () => ({ commands }) => {
          return commands.toggleMark(this.name);
        },
        unsetStrike: () => ({ commands }) => {
          return commands.unsetMark(this.name);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-Shift-x": () => this.editor.commands.toggleStrike()
      };
    },
    addInputRules() {
      return [
        markInputRule({
          find: inputRegex5,
          type: this.type
        })
      ];
    },
    addPasteRules() {
      return [
        markPasteRule({
          find: pasteRegex2,
          type: this.type
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-text/dist/tiptap-extension-text.esm.js
  var Text = Node4.create({
    name: "text",
    group: "inline"
  });

  // node_modules/@tiptap/starter-kit/dist/tiptap-starter-kit.esm.js
  var StarterKit = Extension.create({
    name: "starterKit",
    addExtensions() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
      const extensions2 = [];
      if (this.options.blockquote !== false) {
        extensions2.push(Blockquote.configure((_a = this.options) === null || _a === void 0 ? void 0 : _a.blockquote));
      }
      if (this.options.bold !== false) {
        extensions2.push(Bold.configure((_b = this.options) === null || _b === void 0 ? void 0 : _b.bold));
      }
      if (this.options.bulletList !== false) {
        extensions2.push(BulletList.configure((_c = this.options) === null || _c === void 0 ? void 0 : _c.bulletList));
      }
      if (this.options.code !== false) {
        extensions2.push(Code.configure((_d = this.options) === null || _d === void 0 ? void 0 : _d.code));
      }
      if (this.options.codeBlock !== false) {
        extensions2.push(CodeBlock.configure((_e = this.options) === null || _e === void 0 ? void 0 : _e.codeBlock));
      }
      if (this.options.document !== false) {
        extensions2.push(Document.configure((_f = this.options) === null || _f === void 0 ? void 0 : _f.document));
      }
      if (this.options.dropcursor !== false) {
        extensions2.push(Dropcursor.configure((_g = this.options) === null || _g === void 0 ? void 0 : _g.dropcursor));
      }
      if (this.options.gapcursor !== false) {
        extensions2.push(Gapcursor.configure((_h = this.options) === null || _h === void 0 ? void 0 : _h.gapcursor));
      }
      if (this.options.hardBreak !== false) {
        extensions2.push(HardBreak.configure((_j = this.options) === null || _j === void 0 ? void 0 : _j.hardBreak));
      }
      if (this.options.heading !== false) {
        extensions2.push(Heading.configure((_k = this.options) === null || _k === void 0 ? void 0 : _k.heading));
      }
      if (this.options.history !== false) {
        extensions2.push(History2.configure((_l = this.options) === null || _l === void 0 ? void 0 : _l.history));
      }
      if (this.options.horizontalRule !== false) {
        extensions2.push(HorizontalRule.configure((_m = this.options) === null || _m === void 0 ? void 0 : _m.horizontalRule));
      }
      if (this.options.italic !== false) {
        extensions2.push(Italic.configure((_o = this.options) === null || _o === void 0 ? void 0 : _o.italic));
      }
      if (this.options.listItem !== false) {
        extensions2.push(ListItem.configure((_p = this.options) === null || _p === void 0 ? void 0 : _p.listItem));
      }
      if (this.options.orderedList !== false) {
        extensions2.push(OrderedList.configure((_q = this.options) === null || _q === void 0 ? void 0 : _q.orderedList));
      }
      if (this.options.paragraph !== false) {
        extensions2.push(Paragraph.configure((_r = this.options) === null || _r === void 0 ? void 0 : _r.paragraph));
      }
      if (this.options.strike !== false) {
        extensions2.push(Strike.configure((_s = this.options) === null || _s === void 0 ? void 0 : _s.strike));
      }
      if (this.options.text !== false) {
        extensions2.push(Text.configure((_t = this.options) === null || _t === void 0 ? void 0 : _t.text));
      }
      return extensions2;
    }
  });

  // node_modules/tippy.js/dist/tippy.esm.js
  var BOX_CLASS = "tippy-box";
  var CONTENT_CLASS = "tippy-content";
  var BACKDROP_CLASS = "tippy-backdrop";
  var ARROW_CLASS = "tippy-arrow";
  var SVG_ARROW_CLASS = "tippy-svg-arrow";
  var TOUCH_OPTIONS = {
    passive: true,
    capture: true
  };
  var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO2() {
    return document.body;
  };
  function hasOwnProperty(obj, key) {
    return {}.hasOwnProperty.call(obj, key);
  }
  function getValueAtIndexOrReturn(value, index2, defaultValue) {
    if (Array.isArray(value)) {
      var v = value[index2];
      return v == null ? Array.isArray(defaultValue) ? defaultValue[index2] : defaultValue : v;
    }
    return value;
  }
  function isType(value, type) {
    var str = {}.toString.call(value);
    return str.indexOf("[object") === 0 && str.indexOf(type + "]") > -1;
  }
  function invokeWithArgsOrReturn(value, args) {
    return typeof value === "function" ? value.apply(void 0, args) : value;
  }
  function debounce2(fn2, ms) {
    if (ms === 0) {
      return fn2;
    }
    var timeout;
    return function(arg) {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        fn2(arg);
      }, ms);
    };
  }
  function removeProperties(obj, keys2) {
    var clone = Object.assign({}, obj);
    keys2.forEach(function(key) {
      delete clone[key];
    });
    return clone;
  }
  function splitBySpaces(value) {
    return value.split(/\s+/).filter(Boolean);
  }
  function normalizeToArray(value) {
    return [].concat(value);
  }
  function pushIfUnique(arr, value) {
    if (arr.indexOf(value) === -1) {
      arr.push(value);
    }
  }
  function unique(arr) {
    return arr.filter(function(item, index2) {
      return arr.indexOf(item) === index2;
    });
  }
  function getBasePlacement2(placement) {
    return placement.split("-")[0];
  }
  function arrayFrom(value) {
    return [].slice.call(value);
  }
  function removeUndefinedProps(obj) {
    return Object.keys(obj).reduce(function(acc, key) {
      if (obj[key] !== void 0) {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }
  function div() {
    return document.createElement("div");
  }
  function isElement2(value) {
    return ["Element", "Fragment"].some(function(type) {
      return isType(value, type);
    });
  }
  function isNodeList(value) {
    return isType(value, "NodeList");
  }
  function isMouseEvent(value) {
    return isType(value, "MouseEvent");
  }
  function isReferenceElement(value) {
    return !!(value && value._tippy && value._tippy.reference === value);
  }
  function getArrayOfElements(value) {
    if (isElement2(value)) {
      return [value];
    }
    if (isNodeList(value)) {
      return arrayFrom(value);
    }
    if (Array.isArray(value)) {
      return value;
    }
    return arrayFrom(document.querySelectorAll(value));
  }
  function setTransitionDuration(els, value) {
    els.forEach(function(el) {
      if (el) {
        el.style.transitionDuration = value + "ms";
      }
    });
  }
  function setVisibilityState(els, state) {
    els.forEach(function(el) {
      if (el) {
        el.setAttribute("data-state", state);
      }
    });
  }
  function getOwnerDocument(elementOrElements) {
    var _element$ownerDocumen;
    var _normalizeToArray = normalizeToArray(elementOrElements), element = _normalizeToArray[0];
    return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
  }
  function isCursorOutsideInteractiveBorder(popperTreeData, event) {
    var clientX = event.clientX, clientY = event.clientY;
    return popperTreeData.every(function(_ref) {
      var popperRect = _ref.popperRect, popperState = _ref.popperState, props = _ref.props;
      var interactiveBorder = props.interactiveBorder;
      var basePlacement = getBasePlacement2(popperState.placement);
      var offsetData = popperState.modifiersData.offset;
      if (!offsetData) {
        return true;
      }
      var topDistance = basePlacement === "bottom" ? offsetData.top.y : 0;
      var bottomDistance = basePlacement === "top" ? offsetData.bottom.y : 0;
      var leftDistance = basePlacement === "right" ? offsetData.left.x : 0;
      var rightDistance = basePlacement === "left" ? offsetData.right.x : 0;
      var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
      var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
      var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
      var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
      return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
    });
  }
  function updateTransitionEndListener(box, action, listener) {
    var method = action + "EventListener";
    ["transitionend", "webkitTransitionEnd"].forEach(function(event) {
      box[method](event, listener);
    });
  }
  function actualContains(parent, child3) {
    var target = child3;
    while (target) {
      var _target$getRootNode;
      if (parent.contains(target)) {
        return true;
      }
      target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
    }
    return false;
  }
  var currentInput = {
    isTouch: false
  };
  var lastMouseMoveTime = 0;
  function onDocumentTouchStart() {
    if (currentInput.isTouch) {
      return;
    }
    currentInput.isTouch = true;
    if (window.performance) {
      document.addEventListener("mousemove", onDocumentMouseMove);
    }
  }
  function onDocumentMouseMove() {
    var now2 = performance.now();
    if (now2 - lastMouseMoveTime < 20) {
      currentInput.isTouch = false;
      document.removeEventListener("mousemove", onDocumentMouseMove);
    }
    lastMouseMoveTime = now2;
  }
  function onWindowBlur() {
    var activeElement = document.activeElement;
    if (isReferenceElement(activeElement)) {
      var instance = activeElement._tippy;
      if (activeElement.blur && !instance.state.isVisible) {
        activeElement.blur();
      }
    }
  }
  function bindGlobalEventListeners() {
    document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
    window.addEventListener("blur", onWindowBlur);
  }
  var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  var isIE11 = isBrowser ? !!window.msCrypto : false;
  function createMemoryLeakWarning(method) {
    var txt = method === "destroy" ? "n already-" : " ";
    return [method + "() was called on a" + txt + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
  }
  function clean(value) {
    var spacesAndTabs = /[ \t]{2,}/g;
    var lineStartWithSpaces = /^[ \t]*/gm;
    return value.replace(spacesAndTabs, " ").replace(lineStartWithSpaces, "").trim();
  }
  function getDevMessage(message) {
    return clean("\n  %ctippy.js\n\n  %c" + clean(message) + "\n\n  %c\u{1F477}\u200D This is a development-only message. It will be removed in production.\n  ");
  }
  function getFormattedMessage(message) {
    return [
      getDevMessage(message),
      "color: #00C584; font-size: 1.3em; font-weight: bold;",
      "line-height: 1.5",
      "color: #a6a095;"
    ];
  }
  var visitedMessages;
  if (true) {
    resetVisitedMessages();
  }
  function resetVisitedMessages() {
    visitedMessages = /* @__PURE__ */ new Set();
  }
  function warnWhen(condition, message) {
    if (condition && !visitedMessages.has(message)) {
      var _console;
      visitedMessages.add(message);
      (_console = console).warn.apply(_console, getFormattedMessage(message));
    }
  }
  function errorWhen(condition, message) {
    if (condition && !visitedMessages.has(message)) {
      var _console2;
      visitedMessages.add(message);
      (_console2 = console).error.apply(_console2, getFormattedMessage(message));
    }
  }
  function validateTargets(targets) {
    var didPassFalsyValue = !targets;
    var didPassPlainObject = Object.prototype.toString.call(targets) === "[object Object]" && !targets.addEventListener;
    errorWhen(didPassFalsyValue, ["tippy() was passed", "`" + String(targets) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" "));
    errorWhen(didPassPlainObject, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
  }
  var pluginProps = {
    animateFill: false,
    followCursor: false,
    inlinePositioning: false,
    sticky: false
  };
  var renderProps = {
    allowHTML: false,
    animation: "fade",
    arrow: true,
    content: "",
    inertia: false,
    maxWidth: 350,
    role: "tooltip",
    theme: "",
    zIndex: 9999
  };
  var defaultProps = Object.assign({
    appendTo: TIPPY_DEFAULT_APPEND_TO,
    aria: {
      content: "auto",
      expanded: "auto"
    },
    delay: 0,
    duration: [300, 250],
    getReferenceClientRect: null,
    hideOnClick: true,
    ignoreAttributes: false,
    interactive: false,
    interactiveBorder: 2,
    interactiveDebounce: 0,
    moveTransition: "",
    offset: [0, 10],
    onAfterUpdate: function onAfterUpdate() {
    },
    onBeforeUpdate: function onBeforeUpdate() {
    },
    onCreate: function onCreate() {
    },
    onDestroy: function onDestroy() {
    },
    onHidden: function onHidden() {
    },
    onHide: function onHide() {
    },
    onMount: function onMount() {
    },
    onShow: function onShow() {
    },
    onShown: function onShown() {
    },
    onTrigger: function onTrigger() {
    },
    onUntrigger: function onUntrigger() {
    },
    onClickOutside: function onClickOutside() {
    },
    placement: "top",
    plugins: [],
    popperOptions: {},
    render: null,
    showOnCreate: false,
    touch: true,
    trigger: "mouseenter focus",
    triggerTarget: null
  }, pluginProps, renderProps);
  var defaultKeys = Object.keys(defaultProps);
  var setDefaultProps = function setDefaultProps2(partialProps) {
    if (true) {
      validateProps(partialProps, []);
    }
    var keys2 = Object.keys(partialProps);
    keys2.forEach(function(key) {
      defaultProps[key] = partialProps[key];
    });
  };
  function getExtendedPassedProps(passedProps) {
    var plugins = passedProps.plugins || [];
    var pluginProps2 = plugins.reduce(function(acc, plugin) {
      var name = plugin.name, defaultValue = plugin.defaultValue;
      if (name) {
        var _name;
        acc[name] = passedProps[name] !== void 0 ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
      }
      return acc;
    }, {});
    return Object.assign({}, passedProps, pluginProps2);
  }
  function getDataAttributeProps(reference2, plugins) {
    var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
      plugins
    }))) : defaultKeys;
    var props = propKeys.reduce(function(acc, key) {
      var valueAsString = (reference2.getAttribute("data-tippy-" + key) || "").trim();
      if (!valueAsString) {
        return acc;
      }
      if (key === "content") {
        acc[key] = valueAsString;
      } else {
        try {
          acc[key] = JSON.parse(valueAsString);
        } catch (e) {
          acc[key] = valueAsString;
        }
      }
      return acc;
    }, {});
    return props;
  }
  function evaluateProps(reference2, props) {
    var out = Object.assign({}, props, {
      content: invokeWithArgsOrReturn(props.content, [reference2])
    }, props.ignoreAttributes ? {} : getDataAttributeProps(reference2, props.plugins));
    out.aria = Object.assign({}, defaultProps.aria, out.aria);
    out.aria = {
      expanded: out.aria.expanded === "auto" ? props.interactive : out.aria.expanded,
      content: out.aria.content === "auto" ? props.interactive ? null : "describedby" : out.aria.content
    };
    return out;
  }
  function validateProps(partialProps, plugins) {
    if (partialProps === void 0) {
      partialProps = {};
    }
    if (plugins === void 0) {
      plugins = [];
    }
    var keys2 = Object.keys(partialProps);
    keys2.forEach(function(prop) {
      var nonPluginProps = removeProperties(defaultProps, Object.keys(pluginProps));
      var didPassUnknownProp = !hasOwnProperty(nonPluginProps, prop);
      if (didPassUnknownProp) {
        didPassUnknownProp = plugins.filter(function(plugin) {
          return plugin.name === prop;
        }).length === 0;
      }
      warnWhen(didPassUnknownProp, ["`" + prop + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", "\n\n", "All props: https://atomiks.github.io/tippyjs/v6/all-props/\n", "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
    });
  }
  var innerHTML = function innerHTML2() {
    return "innerHTML";
  };
  function dangerouslySetInnerHTML(element, html) {
    element[innerHTML()] = html;
  }
  function createArrowElement(value) {
    var arrow3 = div();
    if (value === true) {
      arrow3.className = ARROW_CLASS;
    } else {
      arrow3.className = SVG_ARROW_CLASS;
      if (isElement2(value)) {
        arrow3.appendChild(value);
      } else {
        dangerouslySetInnerHTML(arrow3, value);
      }
    }
    return arrow3;
  }
  function setContent2(content2, props) {
    if (isElement2(props.content)) {
      dangerouslySetInnerHTML(content2, "");
      content2.appendChild(props.content);
    } else if (typeof props.content !== "function") {
      if (props.allowHTML) {
        dangerouslySetInnerHTML(content2, props.content);
      } else {
        content2.textContent = props.content;
      }
    }
  }
  function getChildren(popper2) {
    var box = popper2.firstElementChild;
    var boxChildren = arrayFrom(box.children);
    return {
      box,
      content: boxChildren.find(function(node4) {
        return node4.classList.contains(CONTENT_CLASS);
      }),
      arrow: boxChildren.find(function(node4) {
        return node4.classList.contains(ARROW_CLASS) || node4.classList.contains(SVG_ARROW_CLASS);
      }),
      backdrop: boxChildren.find(function(node4) {
        return node4.classList.contains(BACKDROP_CLASS);
      })
    };
  }
  function render(instance) {
    var popper2 = div();
    var box = div();
    box.className = BOX_CLASS;
    box.setAttribute("data-state", "hidden");
    box.setAttribute("tabindex", "-1");
    var content2 = div();
    content2.className = CONTENT_CLASS;
    content2.setAttribute("data-state", "hidden");
    setContent2(content2, instance.props);
    popper2.appendChild(box);
    box.appendChild(content2);
    onUpdate(instance.props, instance.props);
    function onUpdate(prevProps, nextProps) {
      var _getChildren = getChildren(popper2), box2 = _getChildren.box, content3 = _getChildren.content, arrow3 = _getChildren.arrow;
      if (nextProps.theme) {
        box2.setAttribute("data-theme", nextProps.theme);
      } else {
        box2.removeAttribute("data-theme");
      }
      if (typeof nextProps.animation === "string") {
        box2.setAttribute("data-animation", nextProps.animation);
      } else {
        box2.removeAttribute("data-animation");
      }
      if (nextProps.inertia) {
        box2.setAttribute("data-inertia", "");
      } else {
        box2.removeAttribute("data-inertia");
      }
      box2.style.maxWidth = typeof nextProps.maxWidth === "number" ? nextProps.maxWidth + "px" : nextProps.maxWidth;
      if (nextProps.role) {
        box2.setAttribute("role", nextProps.role);
      } else {
        box2.removeAttribute("role");
      }
      if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
        setContent2(content3, instance.props);
      }
      if (nextProps.arrow) {
        if (!arrow3) {
          box2.appendChild(createArrowElement(nextProps.arrow));
        } else if (prevProps.arrow !== nextProps.arrow) {
          box2.removeChild(arrow3);
          box2.appendChild(createArrowElement(nextProps.arrow));
        }
      } else if (arrow3) {
        box2.removeChild(arrow3);
      }
    }
    return {
      popper: popper2,
      onUpdate
    };
  }
  render.$$tippy = true;
  var idCounter = 1;
  var mouseMoveListeners = [];
  var mountedInstances = [];
  function createTippy(reference2, passedProps) {
    var props = evaluateProps(reference2, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
    var showTimeout;
    var hideTimeout;
    var scheduleHideAnimationFrame;
    var isVisibleFromClick = false;
    var didHideDueToDocumentMouseDown = false;
    var didTouchMove = false;
    var ignoreOnFirstUpdate = false;
    var lastTriggerEvent;
    var currentTransitionEndListener;
    var onFirstUpdate;
    var listeners = [];
    var debouncedOnMouseMove = debounce2(onMouseMove, props.interactiveDebounce);
    var currentTarget;
    var id = idCounter++;
    var popperInstance = null;
    var plugins = unique(props.plugins);
    var state = {
      isEnabled: true,
      isVisible: false,
      isDestroyed: false,
      isMounted: false,
      isShown: false
    };
    var instance = {
      id,
      reference: reference2,
      popper: div(),
      popperInstance,
      props,
      state,
      plugins,
      clearDelayTimeouts,
      setProps: setProps2,
      setContent: setContent3,
      show,
      hide: hide2,
      hideWithInteractivity,
      enable,
      disable,
      unmount,
      destroy: destroy5
    };
    if (!props.render) {
      if (true) {
        errorWhen(true, "render() function has not been supplied.");
      }
      return instance;
    }
    var _props$render = props.render(instance), popper2 = _props$render.popper, onUpdate = _props$render.onUpdate;
    popper2.setAttribute("data-tippy-root", "");
    popper2.id = "tippy-" + instance.id;
    instance.popper = popper2;
    reference2._tippy = instance;
    popper2._tippy = instance;
    var pluginsHooks = plugins.map(function(plugin) {
      return plugin.fn(instance);
    });
    var hasAriaExpanded = reference2.hasAttribute("aria-expanded");
    addListeners();
    handleAriaExpandedAttribute();
    handleStyles();
    invokeHook("onCreate", [instance]);
    if (props.showOnCreate) {
      scheduleShow();
    }
    popper2.addEventListener("mouseenter", function() {
      if (instance.props.interactive && instance.state.isVisible) {
        instance.clearDelayTimeouts();
      }
    });
    popper2.addEventListener("mouseleave", function() {
      if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) {
        getDocument().addEventListener("mousemove", debouncedOnMouseMove);
      }
    });
    return instance;
    function getNormalizedTouchSettings() {
      var touch = instance.props.touch;
      return Array.isArray(touch) ? touch : [touch, 0];
    }
    function getIsCustomTouchBehavior() {
      return getNormalizedTouchSettings()[0] === "hold";
    }
    function getIsDefaultRenderFn() {
      var _instance$props$rende;
      return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
    }
    function getCurrentTarget() {
      return currentTarget || reference2;
    }
    function getDocument() {
      var parent = getCurrentTarget().parentNode;
      return parent ? getOwnerDocument(parent) : document;
    }
    function getDefaultTemplateChildren() {
      return getChildren(popper2);
    }
    function getDelay(isShow) {
      if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === "focus") {
        return 0;
      }
      return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
    }
    function handleStyles(fromHide) {
      if (fromHide === void 0) {
        fromHide = false;
      }
      popper2.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
      popper2.style.zIndex = "" + instance.props.zIndex;
    }
    function invokeHook(hook, args, shouldInvokePropsHook) {
      if (shouldInvokePropsHook === void 0) {
        shouldInvokePropsHook = true;
      }
      pluginsHooks.forEach(function(pluginHooks) {
        if (pluginHooks[hook]) {
          pluginHooks[hook].apply(pluginHooks, args);
        }
      });
      if (shouldInvokePropsHook) {
        var _instance$props;
        (_instance$props = instance.props)[hook].apply(_instance$props, args);
      }
    }
    function handleAriaContentAttribute() {
      var aria = instance.props.aria;
      if (!aria.content) {
        return;
      }
      var attr = "aria-" + aria.content;
      var id2 = popper2.id;
      var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
      nodes.forEach(function(node4) {
        var currentValue = node4.getAttribute(attr);
        if (instance.state.isVisible) {
          node4.setAttribute(attr, currentValue ? currentValue + " " + id2 : id2);
        } else {
          var nextValue = currentValue && currentValue.replace(id2, "").trim();
          if (nextValue) {
            node4.setAttribute(attr, nextValue);
          } else {
            node4.removeAttribute(attr);
          }
        }
      });
    }
    function handleAriaExpandedAttribute() {
      if (hasAriaExpanded || !instance.props.aria.expanded) {
        return;
      }
      var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
      nodes.forEach(function(node4) {
        if (instance.props.interactive) {
          node4.setAttribute("aria-expanded", instance.state.isVisible && node4 === getCurrentTarget() ? "true" : "false");
        } else {
          node4.removeAttribute("aria-expanded");
        }
      });
    }
    function cleanupInteractiveMouseListeners() {
      getDocument().removeEventListener("mousemove", debouncedOnMouseMove);
      mouseMoveListeners = mouseMoveListeners.filter(function(listener) {
        return listener !== debouncedOnMouseMove;
      });
    }
    function onDocumentPress(event) {
      if (currentInput.isTouch) {
        if (didTouchMove || event.type === "mousedown") {
          return;
        }
      }
      var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
      if (instance.props.interactive && actualContains(popper2, actualTarget)) {
        return;
      }
      if (normalizeToArray(instance.props.triggerTarget || reference2).some(function(el) {
        return actualContains(el, actualTarget);
      })) {
        if (currentInput.isTouch) {
          return;
        }
        if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) {
          return;
        }
      } else {
        invokeHook("onClickOutside", [instance, event]);
      }
      if (instance.props.hideOnClick === true) {
        instance.clearDelayTimeouts();
        instance.hide();
        didHideDueToDocumentMouseDown = true;
        setTimeout(function() {
          didHideDueToDocumentMouseDown = false;
        });
        if (!instance.state.isMounted) {
          removeDocumentPress();
        }
      }
    }
    function onTouchMove() {
      didTouchMove = true;
    }
    function onTouchStart() {
      didTouchMove = false;
    }
    function addDocumentPress() {
      var doc2 = getDocument();
      doc2.addEventListener("mousedown", onDocumentPress, true);
      doc2.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
      doc2.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
      doc2.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
    }
    function removeDocumentPress() {
      var doc2 = getDocument();
      doc2.removeEventListener("mousedown", onDocumentPress, true);
      doc2.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
      doc2.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
      doc2.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
    }
    function onTransitionedOut(duration, callback) {
      onTransitionEnd(duration, function() {
        if (!instance.state.isVisible && popper2.parentNode && popper2.parentNode.contains(popper2)) {
          callback();
        }
      });
    }
    function onTransitionedIn(duration, callback) {
      onTransitionEnd(duration, callback);
    }
    function onTransitionEnd(duration, callback) {
      var box = getDefaultTemplateChildren().box;
      function listener(event) {
        if (event.target === box) {
          updateTransitionEndListener(box, "remove", listener);
          callback();
        }
      }
      if (duration === 0) {
        return callback();
      }
      updateTransitionEndListener(box, "remove", currentTransitionEndListener);
      updateTransitionEndListener(box, "add", listener);
      currentTransitionEndListener = listener;
    }
    function on(eventType, handler, options) {
      if (options === void 0) {
        options = false;
      }
      var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
      nodes.forEach(function(node4) {
        node4.addEventListener(eventType, handler, options);
        listeners.push({
          node: node4,
          eventType,
          handler,
          options
        });
      });
    }
    function addListeners() {
      if (getIsCustomTouchBehavior()) {
        on("touchstart", onTrigger2, {
          passive: true
        });
        on("touchend", onMouseLeave, {
          passive: true
        });
      }
      splitBySpaces(instance.props.trigger).forEach(function(eventType) {
        if (eventType === "manual") {
          return;
        }
        on(eventType, onTrigger2);
        switch (eventType) {
          case "mouseenter":
            on("mouseleave", onMouseLeave);
            break;
          case "focus":
            on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
            break;
          case "focusin":
            on("focusout", onBlurOrFocusOut);
            break;
        }
      });
    }
    function removeListeners() {
      listeners.forEach(function(_ref) {
        var node4 = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
        node4.removeEventListener(eventType, handler, options);
      });
      listeners = [];
    }
    function onTrigger2(event) {
      var _lastTriggerEvent;
      var shouldScheduleClickHide = false;
      if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
        return;
      }
      var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === "focus";
      lastTriggerEvent = event;
      currentTarget = event.currentTarget;
      handleAriaExpandedAttribute();
      if (!instance.state.isVisible && isMouseEvent(event)) {
        mouseMoveListeners.forEach(function(listener) {
          return listener(event);
        });
      }
      if (event.type === "click" && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
        shouldScheduleClickHide = true;
      } else {
        scheduleShow(event);
      }
      if (event.type === "click") {
        isVisibleFromClick = !shouldScheduleClickHide;
      }
      if (shouldScheduleClickHide && !wasFocused) {
        scheduleHide(event);
      }
    }
    function onMouseMove(event) {
      var target = event.target;
      var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper2.contains(target);
      if (event.type === "mousemove" && isCursorOverReferenceOrPopper) {
        return;
      }
      var popperTreeData = getNestedPopperTree().concat(popper2).map(function(popper3) {
        var _instance$popperInsta;
        var instance2 = popper3._tippy;
        var state2 = (_instance$popperInsta = instance2.popperInstance) == null ? void 0 : _instance$popperInsta.state;
        if (state2) {
          return {
            popperRect: popper3.getBoundingClientRect(),
            popperState: state2,
            props
          };
        }
        return null;
      }).filter(Boolean);
      if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
        cleanupInteractiveMouseListeners();
        scheduleHide(event);
      }
    }
    function onMouseLeave(event) {
      var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick;
      if (shouldBail) {
        return;
      }
      if (instance.props.interactive) {
        instance.hideWithInteractivity(event);
        return;
      }
      scheduleHide(event);
    }
    function onBlurOrFocusOut(event) {
      if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) {
        return;
      }
      if (instance.props.interactive && event.relatedTarget && popper2.contains(event.relatedTarget)) {
        return;
      }
      scheduleHide(event);
    }
    function isEventListenerStopped(event) {
      return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
    }
    function createPopperInstance() {
      destroyPopperInstance();
      var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset3 = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
      var arrow3 = getIsDefaultRenderFn() ? getChildren(popper2).arrow : null;
      var computedReference = getReferenceClientRect ? {
        getBoundingClientRect: getReferenceClientRect,
        contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
      } : reference2;
      var tippyModifier = {
        name: "$$tippy",
        enabled: true,
        phase: "beforeWrite",
        requires: ["computeStyles"],
        fn: function fn2(_ref2) {
          var state2 = _ref2.state;
          if (getIsDefaultRenderFn()) {
            var _getDefaultTemplateCh = getDefaultTemplateChildren(), box = _getDefaultTemplateCh.box;
            ["placement", "reference-hidden", "escaped"].forEach(function(attr) {
              if (attr === "placement") {
                box.setAttribute("data-placement", state2.placement);
              } else {
                if (state2.attributes.popper["data-popper-" + attr]) {
                  box.setAttribute("data-" + attr, "");
                } else {
                  box.removeAttribute("data-" + attr);
                }
              }
            });
            state2.attributes.popper = {};
          }
        }
      };
      var modifiers2 = [{
        name: "offset",
        options: {
          offset: offset3
        }
      }, {
        name: "preventOverflow",
        options: {
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5
          }
        }
      }, {
        name: "flip",
        options: {
          padding: 5
        }
      }, {
        name: "computeStyles",
        options: {
          adaptive: !moveTransition
        }
      }, tippyModifier];
      if (getIsDefaultRenderFn() && arrow3) {
        modifiers2.push({
          name: "arrow",
          options: {
            element: arrow3,
            padding: 3
          }
        });
      }
      modifiers2.push.apply(modifiers2, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
      instance.popperInstance = createPopper(computedReference, popper2, Object.assign({}, popperOptions, {
        placement,
        onFirstUpdate,
        modifiers: modifiers2
      }));
    }
    function destroyPopperInstance() {
      if (instance.popperInstance) {
        instance.popperInstance.destroy();
        instance.popperInstance = null;
      }
    }
    function mount() {
      var appendTo = instance.props.appendTo;
      var parentNode2;
      var node4 = getCurrentTarget();
      if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === "parent") {
        parentNode2 = node4.parentNode;
      } else {
        parentNode2 = invokeWithArgsOrReturn(appendTo, [node4]);
      }
      if (!parentNode2.contains(popper2)) {
        parentNode2.appendChild(popper2);
      }
      instance.state.isMounted = true;
      createPopperInstance();
      if (true) {
        warnWhen(instance.props.interactive && appendTo === defaultProps.appendTo && node4.nextElementSibling !== popper2, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", "\n\n", "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", "\n\n", "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", "\n\n", "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
      }
    }
    function getNestedPopperTree() {
      return arrayFrom(popper2.querySelectorAll("[data-tippy-root]"));
    }
    function scheduleShow(event) {
      instance.clearDelayTimeouts();
      if (event) {
        invokeHook("onTrigger", [instance, event]);
      }
      addDocumentPress();
      var delay = getDelay(true);
      var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
      if (currentInput.isTouch && touchValue === "hold" && touchDelay) {
        delay = touchDelay;
      }
      if (delay) {
        showTimeout = setTimeout(function() {
          instance.show();
        }, delay);
      } else {
        instance.show();
      }
    }
    function scheduleHide(event) {
      instance.clearDelayTimeouts();
      invokeHook("onUntrigger", [instance, event]);
      if (!instance.state.isVisible) {
        removeDocumentPress();
        return;
      }
      if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(event.type) >= 0 && isVisibleFromClick) {
        return;
      }
      var delay = getDelay(false);
      if (delay) {
        hideTimeout = setTimeout(function() {
          if (instance.state.isVisible) {
            instance.hide();
          }
        }, delay);
      } else {
        scheduleHideAnimationFrame = requestAnimationFrame(function() {
          instance.hide();
        });
      }
    }
    function enable() {
      instance.state.isEnabled = true;
    }
    function disable() {
      instance.hide();
      instance.state.isEnabled = false;
    }
    function clearDelayTimeouts() {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      cancelAnimationFrame(scheduleHideAnimationFrame);
    }
    function setProps2(partialProps) {
      if (true) {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("setProps"));
      }
      if (instance.state.isDestroyed) {
        return;
      }
      invokeHook("onBeforeUpdate", [instance, partialProps]);
      removeListeners();
      var prevProps = instance.props;
      var nextProps = evaluateProps(reference2, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
        ignoreAttributes: true
      }));
      instance.props = nextProps;
      addListeners();
      if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
        cleanupInteractiveMouseListeners();
        debouncedOnMouseMove = debounce2(onMouseMove, nextProps.interactiveDebounce);
      }
      if (prevProps.triggerTarget && !nextProps.triggerTarget) {
        normalizeToArray(prevProps.triggerTarget).forEach(function(node4) {
          node4.removeAttribute("aria-expanded");
        });
      } else if (nextProps.triggerTarget) {
        reference2.removeAttribute("aria-expanded");
      }
      handleAriaExpandedAttribute();
      handleStyles();
      if (onUpdate) {
        onUpdate(prevProps, nextProps);
      }
      if (instance.popperInstance) {
        createPopperInstance();
        getNestedPopperTree().forEach(function(nestedPopper) {
          requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
        });
      }
      invokeHook("onAfterUpdate", [instance, partialProps]);
    }
    function setContent3(content2) {
      instance.setProps({
        content: content2
      });
    }
    function show() {
      if (true) {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("show"));
      }
      var isAlreadyVisible = instance.state.isVisible;
      var isDestroyed = instance.state.isDestroyed;
      var isDisabled = !instance.state.isEnabled;
      var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
      var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
      if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
        return;
      }
      if (getCurrentTarget().hasAttribute("disabled")) {
        return;
      }
      invokeHook("onShow", [instance], false);
      if (instance.props.onShow(instance) === false) {
        return;
      }
      instance.state.isVisible = true;
      if (getIsDefaultRenderFn()) {
        popper2.style.visibility = "visible";
      }
      handleStyles();
      addDocumentPress();
      if (!instance.state.isMounted) {
        popper2.style.transition = "none";
      }
      if (getIsDefaultRenderFn()) {
        var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content2 = _getDefaultTemplateCh2.content;
        setTransitionDuration([box, content2], 0);
      }
      onFirstUpdate = function onFirstUpdate2() {
        var _instance$popperInsta2;
        if (!instance.state.isVisible || ignoreOnFirstUpdate) {
          return;
        }
        ignoreOnFirstUpdate = true;
        void popper2.offsetHeight;
        popper2.style.transition = instance.props.moveTransition;
        if (getIsDefaultRenderFn() && instance.props.animation) {
          var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
          setTransitionDuration([_box, _content], duration);
          setVisibilityState([_box, _content], "visible");
        }
        handleAriaContentAttribute();
        handleAriaExpandedAttribute();
        pushIfUnique(mountedInstances, instance);
        (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
        invokeHook("onMount", [instance]);
        if (instance.props.animation && getIsDefaultRenderFn()) {
          onTransitionedIn(duration, function() {
            instance.state.isShown = true;
            invokeHook("onShown", [instance]);
          });
        }
      };
      mount();
    }
    function hide2() {
      if (true) {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("hide"));
      }
      var isAlreadyHidden = !instance.state.isVisible;
      var isDestroyed = instance.state.isDestroyed;
      var isDisabled = !instance.state.isEnabled;
      var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
      if (isAlreadyHidden || isDestroyed || isDisabled) {
        return;
      }
      invokeHook("onHide", [instance], false);
      if (instance.props.onHide(instance) === false) {
        return;
      }
      instance.state.isVisible = false;
      instance.state.isShown = false;
      ignoreOnFirstUpdate = false;
      isVisibleFromClick = false;
      if (getIsDefaultRenderFn()) {
        popper2.style.visibility = "hidden";
      }
      cleanupInteractiveMouseListeners();
      removeDocumentPress();
      handleStyles(true);
      if (getIsDefaultRenderFn()) {
        var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content2 = _getDefaultTemplateCh4.content;
        if (instance.props.animation) {
          setTransitionDuration([box, content2], duration);
          setVisibilityState([box, content2], "hidden");
        }
      }
      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      if (instance.props.animation) {
        if (getIsDefaultRenderFn()) {
          onTransitionedOut(duration, instance.unmount);
        }
      } else {
        instance.unmount();
      }
    }
    function hideWithInteractivity(event) {
      if (true) {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("hideWithInteractivity"));
      }
      getDocument().addEventListener("mousemove", debouncedOnMouseMove);
      pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
      debouncedOnMouseMove(event);
    }
    function unmount() {
      if (true) {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("unmount"));
      }
      if (instance.state.isVisible) {
        instance.hide();
      }
      if (!instance.state.isMounted) {
        return;
      }
      destroyPopperInstance();
      getNestedPopperTree().forEach(function(nestedPopper) {
        nestedPopper._tippy.unmount();
      });
      if (popper2.parentNode) {
        popper2.parentNode.removeChild(popper2);
      }
      mountedInstances = mountedInstances.filter(function(i) {
        return i !== instance;
      });
      instance.state.isMounted = false;
      invokeHook("onHidden", [instance]);
    }
    function destroy5() {
      if (true) {
        warnWhen(instance.state.isDestroyed, createMemoryLeakWarning("destroy"));
      }
      if (instance.state.isDestroyed) {
        return;
      }
      instance.clearDelayTimeouts();
      instance.unmount();
      removeListeners();
      delete reference2._tippy;
      instance.state.isDestroyed = true;
      invokeHook("onDestroy", [instance]);
    }
  }
  function tippy(targets, optionalProps) {
    if (optionalProps === void 0) {
      optionalProps = {};
    }
    var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
    if (true) {
      validateTargets(targets);
      validateProps(optionalProps, plugins);
    }
    bindGlobalEventListeners();
    var passedProps = Object.assign({}, optionalProps, {
      plugins
    });
    var elements = getArrayOfElements(targets);
    if (true) {
      var isSingleContentElement = isElement2(passedProps.content);
      var isMoreThanOneReferenceElement = elements.length > 1;
      warnWhen(isSingleContentElement && isMoreThanOneReferenceElement, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", "\n\n", "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", "\n\n", "1) content: element.innerHTML\n", "2) content: () => element.cloneNode(true)"].join(" "));
    }
    var instances = elements.reduce(function(acc, reference2) {
      var instance = reference2 && createTippy(reference2, passedProps);
      if (instance) {
        acc.push(instance);
      }
      return acc;
    }, []);
    return isElement2(targets) ? instances[0] : instances;
  }
  tippy.defaultProps = defaultProps;
  tippy.setDefaultProps = setDefaultProps;
  tippy.currentInput = currentInput;
  var applyStylesModifier = Object.assign({}, applyStyles_default, {
    effect: function effect4(_ref) {
      var state = _ref.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: "0",
          top: "0",
          margin: "0"
        },
        arrow: {
          position: "absolute"
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;
      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }
    }
  });
  tippy.setDefaultProps({
    render
  });
  var tippy_esm_default = tippy;

  // node_modules/@tiptap/extension-bubble-menu/dist/tiptap-extension-bubble-menu.esm.js
  var BubbleMenuView = class {
    constructor({ editor, element, view, tippyOptions = {}, shouldShow }) {
      this.preventHide = false;
      this.shouldShow = ({ view: view2, state, from: from4, to }) => {
        const { doc: doc2, selection } = state;
        const { empty: empty2 } = selection;
        const isEmptyTextBlock = !doc2.textBetween(from4, to).length && isTextSelection(state.selection);
        if (!view2.hasFocus() || empty2 || isEmptyTextBlock) {
          return false;
        }
        return true;
      };
      this.mousedownHandler = () => {
        this.preventHide = true;
      };
      this.dragstartHandler = () => {
        this.hide();
      };
      this.focusHandler = () => {
        setTimeout(() => this.update(this.editor.view));
      };
      this.blurHandler = ({ event }) => {
        var _a;
        if (this.preventHide) {
          this.preventHide = false;
          return;
        }
        if ((event === null || event === void 0 ? void 0 : event.relatedTarget) && ((_a = this.element.parentNode) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget))) {
          return;
        }
        this.hide();
      };
      this.editor = editor;
      this.element = element;
      this.view = view;
      if (shouldShow) {
        this.shouldShow = shouldShow;
      }
      this.element.addEventListener("mousedown", this.mousedownHandler, { capture: true });
      this.view.dom.addEventListener("dragstart", this.dragstartHandler);
      this.editor.on("focus", this.focusHandler);
      this.editor.on("blur", this.blurHandler);
      this.tippyOptions = tippyOptions;
      this.element.remove();
      this.element.style.visibility = "visible";
    }
    createTooltip() {
      const { element: editorElement } = this.editor.options;
      const editorIsAttached = !!editorElement.parentElement;
      if (this.tippy || !editorIsAttached) {
        return;
      }
      this.tippy = tippy_esm_default(editorElement, {
        duration: 0,
        getReferenceClientRect: null,
        content: this.element,
        interactive: true,
        trigger: "manual",
        placement: "top",
        hideOnClick: "toggle",
        ...this.tippyOptions
      });
      if (this.tippy.popper.firstChild) {
        this.tippy.popper.firstChild.addEventListener("blur", (event) => {
          this.blurHandler({ event });
        });
      }
    }
    update(view, oldState) {
      var _a, _b;
      const { state, composing } = view;
      const { doc: doc2, selection } = state;
      const isSame = oldState && oldState.doc.eq(doc2) && oldState.selection.eq(selection);
      if (composing || isSame) {
        return;
      }
      this.createTooltip();
      const { ranges } = selection;
      const from4 = Math.min(...ranges.map((range) => range.$from.pos));
      const to = Math.max(...ranges.map((range) => range.$to.pos));
      const shouldShow = (_a = this.shouldShow) === null || _a === void 0 ? void 0 : _a.call(this, {
        editor: this.editor,
        view,
        state,
        oldState,
        from: from4,
        to
      });
      if (!shouldShow) {
        this.hide();
        return;
      }
      (_b = this.tippy) === null || _b === void 0 ? void 0 : _b.setProps({
        getReferenceClientRect: () => {
          if (isNodeSelection(state.selection)) {
            const node4 = view.nodeDOM(from4);
            if (node4) {
              return node4.getBoundingClientRect();
            }
          }
          return posToDOMRect(view, from4, to);
        }
      });
      this.show();
    }
    show() {
      var _a;
      (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.show();
    }
    hide() {
      var _a;
      (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.hide();
    }
    destroy() {
      var _a;
      (_a = this.tippy) === null || _a === void 0 ? void 0 : _a.destroy();
      this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: true });
      this.view.dom.removeEventListener("dragstart", this.dragstartHandler);
      this.editor.off("focus", this.focusHandler);
      this.editor.off("blur", this.blurHandler);
    }
  };
  var BubbleMenuPlugin = (options) => {
    return new Plugin({
      key: typeof options.pluginKey === "string" ? new PluginKey(options.pluginKey) : options.pluginKey,
      view: (view) => new BubbleMenuView({ view, ...options })
    });
  };
  var BubbleMenu = Extension.create({
    name: "bubbleMenu",
    addOptions() {
      return {
        element: null,
        tippyOptions: {},
        pluginKey: "bubbleMenu",
        shouldShow: null
      };
    },
    addProseMirrorPlugins() {
      if (!this.options.element) {
        return [];
      }
      return [
        BubbleMenuPlugin({
          pluginKey: this.options.pluginKey,
          editor: this.editor,
          element: this.options.element,
          tippyOptions: this.options.tippyOptions,
          shouldShow: this.options.shouldShow
        })
      ];
    }
  });

  // node_modules/@tiptap/extension-underline/dist/tiptap-extension-underline.esm.js
  var Underline = Mark3.create({
    name: "underline",
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    parseHTML() {
      return [
        {
          tag: "u"
        },
        {
          style: "text-decoration",
          consuming: false,
          getAttrs: (style2) => style2.includes("underline") ? {} : false
        }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["u", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
    addCommands() {
      return {
        setUnderline: () => ({ commands }) => {
          return commands.setMark(this.name);
        },
        toggleUnderline: () => ({ commands }) => {
          return commands.toggleMark(this.name);
        },
        unsetUnderline: () => ({ commands }) => {
          return commands.unsetMark(this.name);
        }
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-u": () => this.editor.commands.toggleUnderline(),
        "Mod-U": () => this.editor.commands.toggleUnderline()
      };
    }
  });

  // node_modules/@tiptap/extension-placeholder/dist/tiptap-extension-placeholder.esm.js
  var Placeholder = Extension.create({
    name: "placeholder",
    addOptions() {
      return {
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-empty",
        placeholder: "Write something \u2026",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
        includeChildren: false
      };
    },
    addProseMirrorPlugins() {
      return [
        new Plugin({
          props: {
            decorations: ({ doc: doc2, selection }) => {
              const active = this.editor.isEditable || !this.options.showOnlyWhenEditable;
              const { anchor } = selection;
              const decorations = [];
              if (!active) {
                return;
              }
              doc2.descendants((node4, pos) => {
                const hasAnchor = anchor >= pos && anchor <= pos + node4.nodeSize;
                const isEmpty = !node4.isLeaf && !node4.childCount;
                if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                  const classes = [this.options.emptyNodeClass];
                  if (this.editor.isEmpty) {
                    classes.push(this.options.emptyEditorClass);
                  }
                  const decoration = Decoration.node(pos, pos + node4.nodeSize, {
                    class: classes.join(" "),
                    "data-placeholder": typeof this.options.placeholder === "function" ? this.options.placeholder({
                      editor: this.editor,
                      node: node4,
                      pos,
                      hasAnchor
                    }) : this.options.placeholder
                  });
                  decorations.push(decoration);
                }
                return this.options.includeChildren;
              });
              return DecorationSet.create(doc2, decorations);
            }
          }
        })
      ];
    }
  });

  // app/javascript/documentation/controllers/rich_text_editor_controller.js
  var import_lodash = __toESM(require_lodash());
  var RichTextEditorController = class extends Controller {
    toolbarMarks = [
      { target: "bold", name: "bold" },
      { target: "italic", name: "italic" },
      { target: "underline", name: "underline" }
    ];
    toolbarTypes = [
      {
        target: "h1",
        name: "heading",
        attributes: { level: 1 },
        text: "Heading 1"
      },
      {
        target: "h2",
        name: "heading",
        attributes: { level: 2 },
        text: "Heading 2"
      },
      {
        target: "h3",
        name: "heading",
        attributes: { level: 3 },
        text: "Heading 3"
      },
      {
        name: "bulletList",
        target: "ul",
        text: "Bulleted List"
      },
      {
        name: "orderedList",
        target: "ol",
        text: "Ordered List"
      },
      {
        name: "paragraph",
        target: "text",
        text: "Text"
      }
    ];
    allMenuButtons = this.toolbarMarks.concat(this.toolbarTypes);
    connect() {
      this.editor = new Editor({
        element: this.element,
        extensions: [
          StarterKit,
          Underline,
          BubbleMenu.configure({
            element: this.bubbleMenuTarget,
            tippyOptions: { appendTo: this.element, duration: 100 }
          }),
          Placeholder.configure({
            placeholder: this.placeholderValue
          })
        ],
        autofocus: true,
        content: this.contentValue,
        onUpdate: this.throttledUpdate
      });
      this.editor.on("transaction", () => {
        this.resetMenuButtons();
        this.enableSelectedMenuMarks();
      });
    }
    onUpdate = ({ editor }) => {
      this.outputTarget.value = editor.getHTML();
    };
    throttledUpdate = (0, import_lodash.default)(this.onUpdate, 1e3);
    toggleBold() {
      this.runCommand("toggleBold");
    }
    toggleItalic() {
      this.runCommand("toggleItalic");
    }
    toggleUnderline() {
      this.runCommand("toggleUnderline");
    }
    toggleH1() {
      this.runCommand("toggleHeading", { level: 1 });
    }
    toggleH2() {
      this.runCommand("toggleHeading", { level: 2 });
    }
    toggleH3() {
      this.runCommand("toggleHeading", { level: 3 });
    }
    setParagraph() {
      this.runCommand("setParagraph");
    }
    toggleBulletList() {
      this.runCommand("toggleBulletList");
    }
    toggleOrderedList() {
      this.runCommand("toggleOrderedList");
    }
    runCommand(name, attributes) {
      this.editor.chain().focus()[name](attributes).run();
    }
    resetMenuButtons() {
      if (this.hasDropdownTarget) {
        this.dropdownTarget.classList.remove("is-active");
      }
      this.allMenuButtons.forEach(({ target }) => {
        if (this.hasTarget(target)) {
          this[`${target}Target`].classList.remove("is-active");
        }
      });
    }
    enableSelectedMenuMarks() {
      this.allMenuButtons.some(({ target, name, attributes }) => {
        if (this.editor.isActive(name, attributes) && this.hasTarget(target)) {
          this[`${target}Target`].classList.add("is-active");
          return true;
        }
      });
      if (this.hasDropdownTriggerTarget) {
        const selectedType = this.selectedContentType();
        this.dropdownTriggerTarget.innerHTML = selectedType.text;
      }
    }
    selectedContentType() {
      return this.toolbarTypes.find(({ name, attributes }) => {
        return this.editor.isActive(name, attributes);
      });
    }
    hasTarget(name) {
      const capitalizedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
      return this[`has${capitalizedName}Target`];
    }
  };
  __publicField(RichTextEditorController, "targets", [
    "bubbleMenu",
    "dropdown",
    "dropdownTrigger",
    "text",
    "h1",
    "h2",
    "h3",
    "ul",
    "ol",
    "bold",
    "italic",
    "underline",
    "output"
  ]);
  __publicField(RichTextEditorController, "values", {
    content: { type: String, default: "" },
    placeholder: { type: String, default: "" }
  });

  // app/javascript/documentation/application.js
  var application = Application.start();
  application.register("dropdown", DropdownController);
  application.register("notification", NotificationController);
  application.register("rich-text-editor", RichTextEditorController);
  application.register("slim-select", SlimSelectController);
})();
//# sourceMappingURL=application.js.map
