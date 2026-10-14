"use client";
const require_runtime = require("./_virtual/_rolldown/runtime.cjs");
let _tanstack_router_core = require("@tanstack/router-core");
let react = require("react");
react = require_runtime.__toESM(react, 1);
//#region src/matchContext.tsx
function createLinkScope(router, routeId) {
	const store = router.stores.location;
	const listeners = /* @__PURE__ */ new Set();
	let source;
	let unsubscribe;
	const update = (location) => {
		if (!(0, _tanstack_router_core._isRouteDeparting)(router, routeId, location)) {
			source = location;
			listeners.forEach((listener) => listener());
		}
	};
	return [() => source ?? store.get(), (listener) => {
		if (!listeners.size) {
			source = store.get();
			unsubscribe = store.subscribe(update).unsubscribe;
		}
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
			if (!listeners.size) {
				unsubscribe();
				source = void 0;
			}
		};
	}];
}
var matchContext = react.createContext(void 0);
var dummyMatchContext = react.createContext(void 0);
//#endregion
exports.createLinkScope = createLinkScope;
exports.dummyMatchContext = dummyMatchContext;
exports.matchContext = matchContext;

//# sourceMappingURL=matchContext.cjs.map