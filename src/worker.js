import xDecoder from "./xDecoder";

self.onmessage = function (e) {
    const { data } = e;
    const { type, targetName, code } = data;

    try {
        const result = xDecoder().decode(type, targetName, code);

        self.postMessage({ status: "success", result });
    } catch (e) {
        self.postMessage({ status: "error", result: e.message });
    }
};