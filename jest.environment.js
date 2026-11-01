import JSDOMEnvironment from "jest-environment-jsdom";

/**
 * jsdom + Node's native fetch.
 *
 * jest-environment-jsdom drops Node's fetch globals, and XHR-based polyfills
 * (whatwg-fetch) would apply browser CORS rules to every mocked response.
 * Exposing Node's own fetch keeps behaviour identical to the
 * `@jest-environment node` tests, and nock intercepts it the same way.
 */
class JSDOMWithFetchEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);

    const nodeFetch = globalThis.fetch;

    Object.assign(this.global, {
      Request: globalThis.Request,
      Response: globalThis.Response,
      Headers: globalThis.Headers,
      FormData: globalThis.FormData,
      // Web Streams: response bodies, and nock's fetch interceptor, use these
      ReadableStream: globalThis.ReadableStream,
      WritableStream: globalThis.WritableStream,
      TransformStream: globalThis.TransformStream,
      TextEncoderStream: globalThis.TextEncoderStream,
      TextDecoderStream: globalThis.TextDecoderStream,
      // Callers (e.g. react-query) pass jsdom's AbortSignal, which Node's fetch
      // rejects as a foreign object. Mirror it onto a Node-native signal.
      fetch: (input, init = {}) => {
        const { signal, ...rest } = init;
        if (!signal) return nodeFetch(input, rest);

        const controller = new AbortController();
        if (signal.aborted) {
          controller.abort(signal.reason);
        } else {
          signal.addEventListener("abort", () => controller.abort(signal.reason), {
            once: true,
          });
        }
        return nodeFetch(input, { ...rest, signal: controller.signal });
      },
    });
  }
}

export default JSDOMWithFetchEnvironment;
