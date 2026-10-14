"use client";
const require_runtime = require("./_virtual/_rolldown/runtime.cjs");
const require_matchContext = require("./matchContext.cjs");
const require_useRouter = require("./useRouter.cjs");
let _tanstack_router_core = require("@tanstack/router-core");
let react = require("react");
react = require_runtime.__toESM(react, 1);
let _tanstack_router_core_isServer = require("@tanstack/router-core/isServer");
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/link.tsx
function useStableValues(...values) {
	const ref = react.useRef(values);
	const stable = ref.current;
	values.forEach((value, index) => {
		if (!(0, _tanstack_router_core.deepEqual)(stable[index], value, false, true)) stable[index] = value;
	});
	return ref.current;
}
function preloadLink(router, options) {
	router.preloadRoute(options).catch((err) => {
		console.warn(err);
		console.warn(_tanstack_router_core.preloadWarning);
	});
}
function resolveExternalLink(to, protocolAllowlist) {
	const scheme = typeof to === "string" && (0, _tanstack_router_core.getUrlScheme)(to);
	if (!scheme) return;
	if (!protocolAllowlist.has(scheme)) {
		if (process.env.NODE_ENV !== "production") console.warn(`Blocked Link with dangerous protocol: ${to}`);
		return null;
	}
	return to;
}
function resolveIsActive(location, next, activeOptions, basepath) {
	const currentPath = (0, _tanstack_router_core.removeTrailingSlash)(location.pathname, basepath);
	const nextPath = (0, _tanstack_router_core.removeTrailingSlash)(next.pathname, basepath);
	if (activeOptions?.exact ? currentPath !== nextPath : !(currentPath.startsWith(nextPath) && (currentPath.length === nextPath.length || currentPath[nextPath.length] === "/"))) return false;
	if (activeOptions?.includeSearch ?? true) {
		if (!(0, _tanstack_router_core.deepEqual)(location.search, next.search, !activeOptions?.exact, activeOptions?.explicitUndefined)) return false;
	}
	return !activeOptions?.includeHash || location.hash === next.hash;
}
function useLinkProps(options, forwardedRef, host) {
	const router = require_useRouter.useRouter();
	if (_tanstack_router_core_isServer.isServer ?? router.isServer) return getServerLinkProps(router, options, forwardedRef, host);
	const innerRef = react.useRef(null);
	const mergedRef = react.useCallback((element) => {
		innerRef.current = element;
		if (typeof forwardedRef === "function") return forwardedRef(element);
		if (forwardedRef) forwardedRef.current = element;
	}, [forwardedRef]);
	const { activeOptions, to, preload: userPreload, preloadDelay: userPreloadDelay, disabled, target, onClick, onBlur, onFocus, onMouseEnter, onMouseLeave, onTouchStart } = options;
	const [stableSearch, stableParams, stableActiveOptions] = useStableValues(options.search, options.params, activeOptions);
	const routeId = react.useContext(require_matchContext.matchContext);
	const scope = (router.stores._linkScopes ??= {})[routeId] ??= require_matchContext.createLinkScope(router, routeId);
	const [dest, getLinkState, getHydrationState] = react.useMemo(() => {
		const directExternalLink = resolveExternalLink(to, router.protocolAllowlist);
		if (directExternalLink !== void 0) {
			const state = [directExternalLink ?? void 0];
			return [options, () => state];
		}
		const dest = { ...options };
		let source;
		let state;
		let hydrationState;
		const getLinkState = () => {
			const location = scope[0]();
			if (location !== source) {
				dest._fromLocation = location;
				const next = router.buildLocation(dest);
				const href = getHrefOption(next, router, disabled);
				const isActive = disabled || href && !(0, _tanstack_router_core.getUrlScheme)(href) ? resolveIsActive(location, next, stableActiveOptions, router.basepath) : void 0;
				if (!state || state[0] !== href || state[1] !== isActive) state = [href, isActive];
				source = location;
			}
			return state;
		};
		return [
			dest,
			getLinkState,
			stableActiveOptions?.includeHash && (() => {
				const state = getLinkState();
				return state[1] ? hydrationState ??= [state[0], false] : state;
			})
		];
	}, [
		router,
		scope,
		options.from,
		options.hash,
		options.href,
		to,
		stableSearch,
		stableParams,
		options.state,
		options.mask,
		options.unsafeRelative,
		stableActiveOptions,
		disabled
	]);
	const [href, isActive] = react.useSyncExternalStore(scope[1], getLinkState, getHydrationState || getLinkState);
	const externalLink = isActive === void 0 && href;
	const linkDisabled = disabled || href === void 0;
	const hasRenderFetched = react.useRef(false);
	const preload = options.reloadDocument || externalLink || linkDisabled ? false : userPreload ?? router.options.defaultPreload;
	const preloadDelay = userPreloadDelay ?? router.options.defaultPreloadDelay ?? 0;
	const enqueuePreload = react.useCallback((e) => {
		const isIntersecting = e?.isIntersecting;
		if (!(isIntersecting ?? preload === "intent")) {
			if (isIntersecting === false) cancelPreload(innerRef);
			return;
		}
		if (!preloadDelay) {
			preloadLink(router, dest);
			return;
		}
		innerRef.t ??= setTimeout(() => {
			innerRef.t = void 0;
			preloadLink(router, dest);
		}, preloadDelay);
	}, [
		router,
		dest,
		innerRef,
		preload,
		preloadDelay
	]);
	react.useEffect(() => {
		if (!preload) return;
		if (preload === "render" && !hasRenderFetched.current) {
			hasRenderFetched.current = true;
			preloadLink(router, dest);
		}
		let active = true;
		let observer;
		if (preload === "viewport" && innerRef.current && typeof IntersectionObserver === "function") {
			observer = new IntersectionObserver((entries) => {
				if (active) enqueuePreload(entries.pop());
			}, { rootMargin: "100px" });
			observer.observe(innerRef.current);
		}
		return () => {
			active = false;
			observer?.disconnect();
			cancelPreload(innerRef);
		};
	}, [
		router,
		dest,
		preload,
		enqueuePreload,
		innerRef
	]);
	const props = collectElementProps(options, host);
	props.ref = forwardedRef ? mergedRef : innerRef;
	if (externalLink) {
		props.href = externalLink;
		return props;
	}
	const handleClick = (e) => {
		const effectiveTarget = target ?? e.currentTarget.getAttribute("target");
		if (!linkDisabled && !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && (!effectiveTarget || effectiveTarget === "_self") && e.button === 0) {
			e.preventDefault();
			cancelPreload(innerRef);
			router.navigate({
				...options,
				_fromLocation: dest._fromLocation
			});
		}
	};
	const handleTouchStart = () => {
		if (preload === "intent") preloadLink(router, dest);
	};
	const handleLeave = () => {
		if (preload === "intent") cancelPreload(innerRef);
	};
	props.onClick = composeHandlers(onClick, handleClick);
	props.onBlur = composeHandlers(onBlur, handleLeave);
	props.onFocus = composeHandlers(onFocus, enqueuePreload);
	props.onMouseEnter = composeHandlers(onMouseEnter, enqueuePreload);
	props.onMouseLeave = composeHandlers(onMouseLeave, handleLeave);
	props.onTouchStart = composeHandlers(onTouchStart, handleTouchStart);
	return applyLinkState(props, options, isActive, href, linkDisabled, host);
}
var STATIC_EMPTY_OBJECT = {};
var STATIC_ACTIVE_OBJECT = { className: "active" };
var ROUTER_OPTION_KEYS = /* @__PURE__ */ new Set([
	"to",
	"params",
	"search",
	"hash",
	"state",
	"mask",
	"from",
	"unsafeRelative",
	"reloadDocument",
	"preload",
	"preloadDelay",
	"preloadIntentProximity",
	"hashScrollIntoView",
	"replace",
	"startTransition",
	"resetScroll",
	"viewTransition",
	"ignoreBlocker",
	"activeProps",
	"inactiveProps",
	"activeOptions",
	"_asChild"
]);
function collectElementProps(options, host) {
	const props = {};
	for (const key in options) {
		if (ROUTER_OPTION_KEYS.has(key) || key === "type" && host !== void 0 || key === "disabled" && host === "a") continue;
		props[key] = options[key];
	}
	return props;
}
function applyLinkState(props, options, isActive, href, linkDisabled, host) {
	const { activeProps, inactiveProps, className, style, target } = options;
	const stateProps = (0, _tanstack_router_core.functionalUpdate)(isActive ? activeProps : inactiveProps, {}) ?? (isActive ? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT);
	Object.assign(props, stateProps);
	props.href = href;
	if (host !== "a") props.disabled = linkDisabled;
	props.target = target;
	const stateStyle = stateProps.style;
	if (style || stateStyle) props.style = style && stateStyle ? {
		...style,
		...stateStyle
	} : style || stateStyle;
	const stateClassName = stateProps.className;
	if (className || stateClassName) props.className = className ? stateClassName ? `${className} ${stateClassName}` : className : stateClassName;
	if (linkDisabled) {
		props.role = "link";
		props["aria-disabled"] = true;
	}
	if (isActive) {
		props["data-status"] = "active";
		props["aria-current"] = "page";
	}
	return props;
}
function getServerLinkProps(router, options, forwardedRef, host) {
	const { to, disabled, activeOptions } = options;
	const directExternalLink = resolveExternalLink(to, router.protocolAllowlist);
	const next = directExternalLink === void 0 ? router.buildLocation(options) : void 0;
	const hrefOption = next ? getHrefOption(next, router, disabled) : directExternalLink ?? void 0;
	const linkDisabled = disabled || !hrefOption;
	const externalLink = directExternalLink ?? (hrefOption && (0, _tanstack_router_core.getUrlScheme)(hrefOption) ? hrefOption : void 0);
	const props = collectElementProps(options, host);
	props.ref = forwardedRef;
	if (externalLink) {
		props.href = externalLink;
		return props;
	}
	return applyLinkState(props, options, !!next && !(!disabled && !hrefOption) && !activeOptions?.includeHash && resolveIsActive(router.stores.location.get(), next, activeOptions, router.basepath), hrefOption, linkDisabled, host);
}
var cancelPreload = (ref) => {
	clearTimeout(ref.t);
	ref.t = void 0;
};
var composeHandlers = (first, second) => {
	if (!first) return second;
	return (event) => event.defaultPrevented || (first(event), event.defaultPrevented || second(event));
};
function getHrefOption(next, router, disabled) {
	if (disabled) return;
	const location = next.maskedLocation ?? next;
	const href = location.external ? location.publicHref : router.history.createHref(location.publicHref) || "/";
	if ((location.external || href !== location.publicHref) && (0, _tanstack_router_core.isDangerousProtocol)(href, router.protocolAllowlist)) {
		if (process.env.NODE_ENV !== "production") console.warn(`Blocked Link with dangerous protocol: ${href}`);
		return;
	}
	return href;
}
/**
* Creates a typed Link-like component that preserves TanStack Router's
* navigation semantics and type-safety while delegating rendering to the
* provided host component.
*
* Useful for integrating design system anchors/buttons while keeping
* router-aware props (eg. `to`, `params`, `search`, `preload`).
*
* @param Comp The host component to render (eg. a design-system Link/Button)
* @returns A router-aware component with the same API as `Link`.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/custom-link
*/
function createLink(Comp) {
	return react.forwardRef(function CreatedLink(props, ref) {
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Link, {
			...props,
			_asChild: Comp,
			ref
		});
	});
}
/**
* A strongly-typed anchor component for declarative navigation.
* Handles path, search, hash and state updates with optional route preloading
* and active-state styling.
*
* Props:
* - `preload`: Controls route preloading (eg. 'intent', 'render', 'viewport', true/false)
* - `preloadDelay`: Delay in ms before preloading on focus, hover, or viewport entry
* - `activeProps`/`inactiveProps`: Additional props merged when link is active/inactive
* - `resetScroll`/`hashScrollIntoView`: Control scroll behavior on navigation
* - `viewTransition`/`startTransition`: Use View Transitions/React transitions for navigation
* - `ignoreBlocker`: Bypass registered blockers
*
* @returns An anchor-like element that navigates without full page reloads.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/linkComponent
*/
var Link = react.memo(react.forwardRef((props, ref) => {
	const host = props._asChild || "a";
	const linkProps = useLinkProps(props, ref, host);
	const children = typeof props.children === "function" ? props.children({ isActive: linkProps["data-status"] === "active" }) : props.children;
	return react.createElement(host, linkProps, children);
}), areLinkPropsEqual);
function areLinkPropsEqual(prev, next) {
	let extraKeys = 0;
	for (const key in next) {
		extraKeys++;
		if (prev[key] === next[key]) continue;
		if (!ROUTER_OPTION_KEYS.has(key) || !(0, _tanstack_router_core.deepEqual)(prev[key], next[key], false, true)) return false;
	}
	for (const _key in prev) extraKeys--;
	return extraKeys === 0;
}
/**
* Validate and reuse navigation options for `Link`, `navigate` or `redirect`.
* Accepts a literal options object and returns it typed for later spreading.
* @example
* const opts = linkOptions({ to: '/dashboard', search: { tab: 'home' } })
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/linkOptions
*/
var linkOptions = (options) => {
	return options;
};
/**
* Type-check a literal object for use with `Link`, `navigate` or `redirect`.
* Use to validate and reuse navigation options across your app.
* @example
* const opts = linkOptions({ to: '/dashboard', search: { tab: 'home' } })
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/linkOptions
*/
//#endregion
exports.Link = Link;
exports.composeHandlers = composeHandlers;
exports.createLink = createLink;
exports.linkOptions = linkOptions;
exports.useLinkProps = useLinkProps;

//# sourceMappingURL=link.cjs.map