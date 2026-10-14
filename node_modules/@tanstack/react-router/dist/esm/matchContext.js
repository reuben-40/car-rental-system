"use client";
import { _isRouteDeparting } from "@tanstack/router-core";
import * as React$1 from "react";
//#region src/matchContext.tsx
function createLinkScope(router, routeId) {
	const store = router.stores.location;
	const listeners = /* @__PURE__ */ new Set();
	let source;
	let unsubscribe;
	const update = (location) => {
		if (!_isRouteDeparting(router, routeId, location)) {
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
var matchContext = React$1.createContext(void 0);
var dummyMatchContext = React$1.createContext(void 0);
//#endregion
export { createLinkScope, dummyMatchContext, matchContext };

//# sourceMappingURL=matchContext.js.map