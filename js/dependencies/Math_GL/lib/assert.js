export default function assert(condition, message) {
    if (!condition) {
        throw new Error(`math.gl assertion ${message}`);
    }
}
//# sourceMappingURL=assert.js.map