Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region src/core/compat.ts
/**
* Public feature bits for `disabledFeatures`. Stays a runtime `enum` so the
* published declaration is unchanged for consumers. Its values must match
* the internal bits (checked by test/feature.test.ts).
*/
let Feature = /* @__PURE__ */ function(Feature) {
	Feature[Feature["AggregateError"] = 1] = "AggregateError";
	/**
	* @deprecated Has no effect. Output always uses arrow functions.
	*/
	Feature[Feature["ArrowFunction"] = 2] = "ArrowFunction";
	Feature[Feature["ErrorPrototypeStack"] = 4] = "ErrorPrototypeStack";
	Feature[Feature["ObjectAssign"] = 8] = "ObjectAssign";
	Feature[Feature["BigIntTypedArray"] = 16] = "BigIntTypedArray";
	Feature[Feature["RegExp"] = 32] = "RegExp";
	Feature[Feature["Temporal"] = 64] = "Temporal";
	return Feature;
}({});
//#endregion
//#region src/core/symbols.ts
const SYM_ASYNC_ITERATOR = Symbol.asyncIterator;
const SYM_HAS_INSTANCE = Symbol.hasInstance;
const SYM_IS_CONCAT_SPREADABLE = Symbol.isConcatSpreadable;
const SYM_ITERATOR = Symbol.iterator;
const SYM_MATCH = Symbol.match;
const SYM_MATCH_ALL = Symbol.matchAll;
const SYM_REPLACE = Symbol.replace;
const SYM_SEARCH = Symbol.search;
const SYM_SPECIES = Symbol.species;
const SYM_SPLIT = Symbol.split;
const SYM_TO_PRIMITIVE = Symbol.toPrimitive;
const SYM_TO_STRING_TAG = Symbol.toStringTag;
const SYM_UNSCOPABLES = Symbol.unscopables;
//#endregion
//#region src/core/constants.ts
const TEMPORAL_TYPE_NAME = {
	[0]: "Instant",
	[1]: "Duration",
	[2]: "PlainDate",
	[3]: "PlainDateTime",
	[4]: "PlainMonthDay",
	[5]: "PlainTime",
	[6]: "PlainYearMonth",
	[7]: "ZonedDateTime"
};
const SYMBOL_REF = {
	[0]: SYM_ASYNC_ITERATOR,
	[1]: SYM_HAS_INSTANCE,
	[2]: SYM_IS_CONCAT_SPREADABLE,
	[3]: SYM_ITERATOR,
	[4]: SYM_MATCH,
	[5]: SYM_MATCH_ALL,
	[6]: SYM_REPLACE,
	[7]: SYM_SEARCH,
	[8]: SYM_SPECIES,
	[9]: SYM_SPLIT,
	[10]: SYM_TO_PRIMITIVE,
	[11]: SYM_TO_STRING_TAG,
	[12]: SYM_UNSCOPABLES
};
function createSymbolStringTable() {
	const result = {};
	for (let i = 0; i <= 12; i++) result[i] = SYMBOL_REF[i].description;
	return result;
}
const SYMBOL_STRING = /* @__PURE__ */ createSymbolStringTable();
function createInverseSymbolTable() {
	const result = {};
	for (let i = 0; i <= 12; i++) result[SYMBOL_REF[i]] = i;
	return result;
}
const INV_SYMBOL_REF = /* @__PURE__ */ createInverseSymbolTable();
const CONSTANT_STRING = {
	[2]: "!0",
	[3]: "!1",
	[1]: "void 0",
	[0]: "null",
	[4]: "-0",
	[5]: "1/0",
	[6]: "-1/0",
	[7]: "0/0"
};
const CONSTANT_VAL = {
	[2]: true,
	[3]: false,
	[1]: void 0,
	[0]: null,
	[4]: -0,
	[5]: Infinity,
	[6]: -Infinity,
	[7]: NaN
};
const ERROR_CONSTRUCTOR = {
	[0]: Error,
	[1]: EvalError,
	[2]: RangeError,
	[3]: ReferenceError,
	[4]: SyntaxError,
	[5]: TypeError,
	[6]: URIError
};
function createErrorConstructorStringTable() {
	const result = {};
	for (let i = 0; i <= 6; i++) result[i] = ERROR_CONSTRUCTOR[i].name;
	return result;
}
const ERROR_CONSTRUCTOR_STRING = /* @__PURE__ */ createErrorConstructorStringTable();
//#endregion
//#region src/core/node.ts
function createSerovalNode(t, i, s, c, m, p, e, a, f, b, o, l) {
	if (c === void 0 && m === void 0 && p === void 0 && e === void 0 && a === void 0 && f === void 0 && b === void 0 && o === void 0 && l === void 0) return {
		t,
		i,
		s
	};
	return {
		t,
		i,
		s,
		c,
		m,
		p,
		e,
		a,
		f,
		b,
		o,
		l
	};
}
//#endregion
//#region src/core/literals.ts
function createConstantNode(value) {
	return createSerovalNode(2, void 0, value);
}
const TRUE_NODE = /* @__PURE__ */ createConstantNode(2);
const FALSE_NODE = /* @__PURE__ */ createConstantNode(3);
const UNDEFINED_NODE = /* @__PURE__ */ createConstantNode(1);
const NULL_NODE = /* @__PURE__ */ createConstantNode(0);
const NEG_ZERO_NODE = /* @__PURE__ */ createConstantNode(4);
const INFINITY_NODE = /* @__PURE__ */ createConstantNode(5);
const NEG_INFINITY_NODE = /* @__PURE__ */ createConstantNode(6);
const NAN_NODE = /* @__PURE__ */ createConstantNode(7);
//#endregion
//#region src/core/string.ts
const MIN_JSON_STRINGIFY_LENGTH = 64;
const NEEDS_ESCAPE = /["\\\n\r\b\t\f<\u2028\u2029]/;
const JSON_ESCAPE_DIFFERENCES = /[\x00-\x07\x0b\x0e-\x1f\ud800-\udfff]/;
const LESS_THAN = /</g;
const LINE_SEPARATOR = /\u2028/g;
const PARAGRAPH_SEPARATOR = /\u2029/g;
function escapeCharCode(code) {
	switch (code) {
		case 34: return "\\\"";
		case 92: return "\\\\";
		case 10: return "\\n";
		case 13: return "\\r";
		case 8: return "\\b";
		case 9: return "\\t";
		case 12: return "\\f";
		case 60: return "\\x3C";
		case 8232: return "\\u2028";
		case 8233: return "\\u2029";
		default: return;
	}
}
function serializeString(str) {
	if (!NEEDS_ESCAPE.test(str)) return str;
	if (str.length >= MIN_JSON_STRINGIFY_LENGTH && !JSON_ESCAPE_DIFFERENCES.test(str)) {
		let result = JSON.stringify(str).slice(1, -1);
		if (result.includes("<")) result = result.replace(LESS_THAN, "\\x3C");
		if (result.includes("\u2028")) result = result.replace(LINE_SEPARATOR, "\\u2028");
		if (result.includes("\u2029")) result = result.replace(PARAGRAPH_SEPARATOR, "\\u2029");
		return result;
	}
	let result = "";
	let lastPos = 0;
	let replacement;
	for (let i = 0, len = str.length; i < len; i++) {
		replacement = escapeCharCode(str.charCodeAt(i));
		if (replacement) {
			result += str.slice(lastPos, i) + replacement;
			lastPos = i + 1;
		}
	}
	return result + str.slice(lastPos);
}
const JSON_COMPATIBLE = /^(?:[^"\\\x00-\x1f]|\\["\\nrbtf])*$/;
const ESCAPE_SEQUENCE = /(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g;
function deserializeString(str) {
	if (typeof str !== "string") return str.replace(ESCAPE_SEQUENCE, deserializeString);
	let index = str.indexOf("\\");
	if (index === -1) return str;
	if (JSON_COMPATIBLE.test(str)) return JSON.parse("\"" + str + "\"");
	let result = "";
	let lastPos = 0;
	const last = str.length - 1;
	while (index !== -1 && index < last) {
		let replacement;
		let length = 2;
		switch (str.charCodeAt(index + 1)) {
			case 92:
				replacement = "\\";
				break;
			case 34:
				replacement = "\"";
				break;
			case 110:
				replacement = "\n";
				break;
			case 114:
				replacement = "\r";
				break;
			case 98:
				replacement = "\b";
				break;
			case 116:
				replacement = "	";
				break;
			case 102:
				replacement = "\f";
				break;
			case 120:
				if (str.startsWith("3C", index + 2)) {
					replacement = "<";
					length = 4;
				}
				break;
			case 117: if (str.startsWith("2028", index + 2)) {
				replacement = "\u2028";
				length = 6;
			} else if (str.startsWith("2029", index + 2)) {
				replacement = "\u2029";
				length = 6;
			}
		}
		if (replacement) {
			result += str.slice(lastPos, index) + replacement;
			lastPos = index + length;
			index = str.indexOf("\\", lastPos);
		} else index = str.indexOf("\\", index + 1);
	}
	return result + str.slice(lastPos);
}
//#endregion
//#region src/core/errors.ts
const STEP_ERROR_CODES = {
	parsing: 1,
	serialization: 2,
	deserialization: 3
};
function getErrorMessageProd(type) {
	return `Seroval Error (step: ${STEP_ERROR_CODES[type]})`;
}
var SerovalError = class extends Error {
	constructor(type, cause) {
		super(getErrorMessageProd(type));
		this.cause = cause;
	}
};
var SerovalParserError = class extends SerovalError {
	constructor(cause) {
		super("parsing", cause);
	}
};
var SerovalSerializationError = class extends SerovalError {
	constructor(cause) {
		super("serialization", cause);
	}
};
var SerovalDeserializationError = class extends SerovalError {
	constructor(cause) {
		super("deserialization", cause);
	}
};
function getSpecificErrorMessage(code) {
	return `Seroval Error (specific: ${code})`;
}
var SerovalUnsupportedTypeError = class extends Error {
	constructor(value) {
		super(getSpecificErrorMessage(1));
		this.value = value;
	}
};
var SerovalUnsupportedNodeError = class extends Error {
	constructor(node) {
		super(getSpecificErrorMessage(2));
	}
};
var SerovalMissingPluginError = class extends Error {
	constructor(tag) {
		super(getSpecificErrorMessage(3));
	}
};
var SerovalMissingInstanceError = class extends Error {
	constructor(tag) {
		super(getSpecificErrorMessage(4));
	}
};
/**
* @deprecated Not thrown by seroval. A missing `createReference` key throws
* {@link SerovalMissingReferenceForIdError} instead.
*/
var SerovalMissingReferenceError = class extends Error {
	constructor(value) {
		super(getSpecificErrorMessage(5));
		this.value = value;
	}
};
var SerovalMissingReferenceForIdError = class extends Error {
	constructor(id) {
		super(getSpecificErrorMessage(6));
	}
};
var SerovalUnknownTypedArrayError = class extends Error {
	constructor(name) {
		super(getSpecificErrorMessage(7));
	}
};
var SerovalMalformedNodeError = class extends Error {
	constructor(node) {
		super(getSpecificErrorMessage(8));
	}
};
var SerovalConflictedNodeIdError = class extends Error {
	constructor(node) {
		super(getSpecificErrorMessage(9));
	}
};
var SerovalDepthLimitError = class extends Error {
	constructor(limit) {
		super(getSpecificErrorMessage(10));
	}
};
var SerovalAbortedError = class extends Error {
	constructor() {
		super(getSpecificErrorMessage(11));
	}
};
var SerovalLiveStreamError = class extends Error {
	constructor(reason) {
		super(getSpecificErrorMessage(12));
		this.reason = reason;
	}
};
//#endregion
//#region src/core/utils/error.ts
function getErrorConstructor(error) {
	for (let i = 1; i <= 6; i++) if (error instanceof ERROR_CONSTRUCTOR[i]) return i;
	return 0;
}
function getErrorOptions(error, features) {
	const options = Object.create(null);
	const construct = ERROR_CONSTRUCTOR_STRING[getErrorConstructor(error)];
	if (error.name !== construct) options.name = error.name;
	else if (error.constructor.name !== construct) options.name = error.constructor.name;
	for (const name of Object.getOwnPropertyNames(error)) if (name !== "name" && name !== "message" && (name !== "stack" || features & 4)) options[name] = error[name];
	return options;
}
//#endregion
//#region src/core/utils/get-object-flag.ts
function getObjectFlag(obj) {
	if (Object.isExtensible(obj)) return 0;
	if (Object.isFrozen(obj)) return 3;
	if (Object.isSealed(obj)) return 2;
	return 1;
}
//#endregion
//#region src/core/utils/typed-array.ts
function getTypedArrayConstructor(name) {
	switch (name) {
		case "Int8Array": return Int8Array;
		case "Int16Array": return Int16Array;
		case "Int32Array": return Int32Array;
		case "Uint8Array": return Uint8Array;
		case "Uint16Array": return Uint16Array;
		case "Uint32Array": return Uint32Array;
		case "Uint8ClampedArray": return Uint8ClampedArray;
		case "Float32Array": return Float32Array;
		case "Float64Array": return Float64Array;
		case "BigInt64Array": return BigInt64Array;
		case "BigUint64Array": return BigUint64Array;
		default: throw new SerovalUnknownTypedArrayError(name);
	}
}
let typedArrayNameGetter;
function getTypedArrayName(value) {
	if (!typedArrayNameGetter) typedArrayNameGetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Int8Array.prototype), Symbol.toStringTag).get;
	return typedArrayNameGetter.call(value);
}
//#endregion
//#region src/core/base-primitives.ts
function createNumberNode(value) {
	switch (value) {
		case Number.POSITIVE_INFINITY: return INFINITY_NODE;
		case Number.NEGATIVE_INFINITY: return NEG_INFINITY_NODE;
	}
	if (value !== value) return NAN_NODE;
	if (Object.is(value, -0)) return NEG_ZERO_NODE;
	return createSerovalNode(0, void 0, value);
}
function createStringNode(value) {
	return createSerovalNode(1, void 0, serializeString(value));
}
function createBigIntNode(current) {
	return createSerovalNode(3, void 0, "" + current);
}
function createIndexedValueNode(id) {
	return createSerovalNode(4, id);
}
function createDateNode(id, current) {
	const timestamp = current.valueOf();
	return createSerovalNode(5, id, timestamp === timestamp ? current.toISOString() : "");
}
function createTemporalNode(id, type, current) {
	return createSerovalNode(36, id, current.toString(), type);
}
const getRegExpSource = Object.getOwnPropertyDescriptor(RegExp.prototype, "source").get;
const getRegExpFlags = Object.getOwnPropertyDescriptor(RegExp.prototype, "flags").get;
function createRegExpNode(id, current) {
	return createSerovalNode(6, id, void 0, serializeString(getRegExpSource.call(current)), getRegExpFlags.call(current));
}
function createWKSymbolNode(id, current) {
	return createSerovalNode(17, id, INV_SYMBOL_REF[current]);
}
function createReferenceNode(id, referenceId) {
	return createSerovalNode(18, id, serializeString(referenceId));
}
function createPluginNode(id, tag, value) {
	return createSerovalNode(25, id, value, serializeString(tag));
}
function createArrayNode(id, current, parsedItems) {
	return createSerovalNode(9, id, void 0, void 0, void 0, void 0, void 0, parsedItems, void 0, void 0, getObjectFlag(current));
}
function createBoxedNode(id, boxed) {
	return createSerovalNode(21, id, void 0, void 0, void 0, void 0, void 0, void 0, boxed);
}
const MAX_TYPED_ARRAY_LENGTH = 1e6;
function createViewNode(type, id, current, buffer) {
	const isDataView = type === 20;
	const size = isDataView ? current.byteLength : current.length;
	if (size > MAX_TYPED_ARRAY_LENGTH) throw new SerovalUnsupportedTypeError(current);
	return createSerovalNode(type, id, void 0, isDataView ? void 0 : getTypedArrayName(current), void 0, void 0, void 0, void 0, buffer, current.byteOffset, void 0, size);
}
function createErrorNode(type, id, current, options) {
	return createSerovalNode(type, id, getErrorConstructor(current), void 0, serializeString(current.message), options);
}
function createSetNode(id, items) {
	return createSerovalNode(7, id, void 0, void 0, void 0, void 0, void 0, items);
}
function createIteratorFactoryInstanceNode(type, factory, items) {
	return createSerovalNode(type, void 0, void 0, void 0, void 0, void 0, void 0, [factory, items]);
}
function createStreamConstructorNode(id, factory, sequence, live) {
	return createSerovalNode(31, id, void 0, void 0, void 0, void 0, void 0, sequence, factory, void 0, void 0, live);
}
function createStreamEventNode(type, id, parsed) {
	return createSerovalNode(type, id, void 0, void 0, void 0, void 0, void 0, void 0, parsed);
}
function createSequenceNode(id, sequence, throwAt, doneAt) {
	return createSerovalNode(35, id, throwAt, void 0, void 0, void 0, void 0, sequence, void 0, void 0, void 0, doneAt);
}
//#endregion
//#region src/core/live-stream.ts
function isLiveStream(value) {
	return value instanceof LiveStream;
}
/**
* A single-consumer stream for incremental serialization. Unlike
* `createStream`, it keeps no history: at most one event is held, and the
* producer operation that sent it settles only when the consumer accepts it.
*
* An internal class rather than a tagged POJO: identity is checked with
* `instanceof`, which untrusted input cannot forge. The class is exported
* because bundlers cannot drop an unexported top-level class.
*/
var LiveStream = class {
	constructor(options) {
		this.consumed = false;
		this.closed = false;
		this.cancelled = false;
		this.options = options;
	}
	deliver(reader, record) {
		record.delivered = true;
		reader.resolve({
			event: record.event,
			accept: () => {
				if (this.pending === record && record.delivered) {
					const terminal = record.event.type !== "next";
					record.event = void 0;
					this.pending = void 0;
					const resolve = record.resolve;
					record.resolve = void 0;
					record.reject = void 0;
					if (terminal) {
						this.closed = true;
						this.options = void 0;
						const waiter = this.waiting;
						this.waiting = void 0;
						waiter?.reject(new SerovalLiveStreamError("closed"));
					}
					resolve?.();
				}
			}
		});
	}
	/** @internal */
	push(event) {
		if (this.cancelled) return Promise.reject(this.cancelReason);
		if (this.closed) return Promise.reject(new SerovalLiveStreamError("closed"));
		if (this.pending) return Promise.reject(new SerovalLiveStreamError("pending"));
		return new Promise((resolve, reject) => {
			const record = {
				event,
				delivered: false,
				resolve,
				reject
			};
			this.pending = record;
			if (this.waiting) {
				const waiter = this.waiting;
				this.waiting = void 0;
				this.deliver(waiter, record);
			}
		});
	}
	cancel(reason) {
		if (this.cancelled || this.closed) return;
		this.cancelled = true;
		this.cancelReason = reason;
		const record = this.pending;
		const waiter = this.waiting;
		this.pending = void 0;
		this.waiting = void 0;
		const callbackOwner = this.options;
		this.options = void 0;
		if (record) {
			record.event = void 0;
			const reject = record.reject;
			record.resolve = void 0;
			record.reject = void 0;
			reject?.(reason);
		}
		if (waiter) waiter.reject(reason);
		callbackOwner?.onCancel?.(reason);
	}
	read() {
		if (this.cancelled) return Promise.reject(this.cancelReason);
		if (this.closed) return Promise.reject(new SerovalLiveStreamError("closed"));
		if (this.waiting) return Promise.reject(new SerovalLiveStreamError("reading"));
		return new Promise((resolve, reject) => {
			const next = {
				resolve,
				reject
			};
			if (this.pending && !this.pending.delivered) this.deliver(next, this.pending);
			else this.waiting = next;
		});
	}
	consume() {
		if (this.consumed) throw new SerovalLiveStreamError("consumed");
		this.consumed = true;
		return {
			read: () => this.read(),
			cancel: (reason) => this.cancel(reason)
		};
	}
	/**
	* Consumes the stream through a replay-style listener, accepting each
	* event as soon as it has been delivered. Use `consume` or `pump` when
	* acceptance must wait for processing.
	*/
	on(listener) {
		const wrap = (key) => (value, accept) => {
			listener[key](value);
			accept();
		};
		return this.pump({
			next: wrap("next"),
			throw: wrap("throw"),
			return: wrap("return")
		});
	}
	/**
	* Consumes the stream into a sink that controls acceptance. Returns the
	* cancel function.
	* @internal
	*/
	pump(sink) {
		const consumer = this.consume();
		let current = sink;
		function next() {
			consumer.read().then((delivery) => {
				const target = current;
				if (!target) return;
				const event = delivery.event;
				let failure;
				let failed = false;
				try {
					failure = target[event.type](event.type === "throw" ? event.error : event.value, delivery.accept);
				} catch (error) {
					failed = true;
					failure = error;
				}
				if (failed || failure !== void 0) {
					current = void 0;
					try {
						consumer.cancel(failure);
					} finally {
						target.done?.();
					}
					return;
				}
				if (event.type === "next") {
					next();
					return;
				}
				current = void 0;
				target.done?.();
			}, (reason) => {
				const target = current;
				current = void 0;
				target?.error?.(reason);
			});
		}
		next();
		return consumer.cancel;
	}
};
/**
* Creates a live stream and the producer that writes to it.
*/
function createLiveStream(options) {
	const stream = new LiveStream(options);
	return {
		stream,
		producer: {
			write(value) {
				return stream.push({
					type: "next",
					value
				});
			},
			close(value) {
				return stream.push({
					type: "return",
					value
				});
			},
			fail(error) {
				return stream.push({
					type: "throw",
					error
				});
			}
		}
	};
}
//#endregion
//#region src/core/opaque-reference.ts
/**
* An opaque reference allows hiding values from the serializer.
*/
var OpaqueReference = class {
	constructor(value, replacement) {
		this.value = value;
		this.replacement = replacement;
	}
};
//#endregion
//#region src/core/constructors.ts
const PROMISE_CONSTRUCTOR = () => {
	const resolver = {
		p: 0,
		s: 0,
		f: 0
	};
	resolver.p = new Promise((resolve, reject) => {
		resolver.s = resolve;
		resolver.f = reject;
	});
	return resolver;
};
const PROMISE_SUCCESS = (resolver, data) => {
	resolver.s(data);
	resolver.p.s = 1;
	resolver.p.v = data;
};
const PROMISE_FAILURE = (resolver, data) => {
	resolver.f(data);
	resolver.p.s = 2;
	resolver.p.v = data;
};
const SERIALIZED_PROMISE_CONSTRUCTOR = /* @__PURE__ */ PROMISE_CONSTRUCTOR.toString();
const SERIALIZED_PROMISE_SUCCESS = /* @__PURE__ */ PROMISE_SUCCESS.toString();
const SERIALIZED_PROMISE_FAILURE = /* @__PURE__ */ PROMISE_FAILURE.toString();
const STREAM_CONSTRUCTOR = (live) => {
	const buffer = [];
	const listeners = [];
	let alive = true;
	let success = false;
	let count = 0;
	const internal = {
		flush(value, mode, x) {
			live > 1 || buffer.push(value);
			for (x = 0; x < count; x++) {
				const listener = listeners[x];
				if (listener) listener[mode](value);
			}
		},
		up(listener, x, z, current) {
			for (x = 0, z = buffer.length; x < z; x++) {
				current = buffer[x];
				if (!alive && x === z - 1) listener[success ? "return" : "throw"](current);
				else listener.next(current);
			}
		},
		on(listener, temp = 0) {
			if (live > 1) throw new Error("Stream consumed");
			let subscribed = alive;
			if (alive) {
				for (temp = 0; temp < count; temp++) if (!listeners[temp]) break;
				if (temp === count) count++;
				listeners[temp] = listener;
			}
			internal.up(listener);
			if (live) {
				live = 2;
				buffer.length = 0;
			}
			return () => {
				if (alive && subscribed) {
					subscribed = false;
					listeners[temp] = void 0;
					while (count > 0 && !listeners[count - 1]) count--;
					listeners.length = count;
				}
			};
		}
	};
	return {
		__SEROVAL_STREAM__: true,
		on(listener) {
			return internal.on(listener);
		},
		next(value) {
			if (alive) internal.flush(value, "next");
		},
		throw(value) {
			if (alive) {
				internal.flush(value, "throw");
				alive = false;
				success = false;
				listeners.length = 0;
			}
		},
		return(value) {
			if (alive) {
				internal.flush(value, "return");
				alive = false;
				success = true;
				listeners.length = 0;
			}
		}
	};
};
const SERIALIZED_STREAM_CONSTRUCTOR = /* @__PURE__ */ STREAM_CONSTRUCTOR.toString();
const ITERATOR_CONSTRUCTOR = (symbol) => (sequence) => () => {
	let index = 0;
	const instance = {
		[symbol]() {
			return instance;
		},
		next() {
			if (index > sequence.d) return {
				done: true,
				value: void 0
			};
			const currentIndex = index++;
			const data = sequence.v[currentIndex];
			if (currentIndex === sequence.t) throw data;
			return {
				done: currentIndex === sequence.d,
				value: data
			};
		}
	};
	return instance;
};
const SERIALIZED_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ITERATOR_CONSTRUCTOR.toString();
const ASYNC_ITERATOR_CONSTRUCTOR = (symbol, createPromise) => (stream) => () => {
	let count = 0;
	let doneAt = -1;
	let isThrow = false;
	const buffer = [];
	const pending = [];
	const internal = { finalize(i = 0, len = pending.length) {
		for (; i < len; i++) pending[i].s({
			done: true,
			value: void 0
		});
	} };
	stream.on({
		next(value) {
			const temp = pending.shift();
			if (temp) temp.s({
				done: false,
				value
			});
			buffer.push(value);
		},
		throw(value) {
			const temp = pending.shift();
			if (temp) temp.f(value);
			internal.finalize();
			doneAt = buffer.length;
			isThrow = true;
			buffer.push(value);
		},
		return(value) {
			const temp = pending.shift();
			if (temp) temp.s({
				done: true,
				value
			});
			internal.finalize();
			doneAt = buffer.length;
			buffer.push(value);
		}
	});
	const instance = {
		[symbol]() {
			return instance;
		},
		next() {
			if (doneAt === -1) {
				const index = count++;
				if (index >= buffer.length) {
					const temp = createPromise();
					pending.push(temp);
					return temp.p;
				}
				return {
					done: false,
					value: buffer[index]
				};
			}
			if (count > doneAt) return {
				done: true,
				value: void 0
			};
			const index = count++;
			const value = buffer[index];
			if (index !== doneAt) return {
				done: false,
				value
			};
			if (isThrow) throw value;
			return {
				done: true,
				value
			};
		}
	};
	return instance;
};
const SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ASYNC_ITERATOR_CONSTRUCTOR.toString();
const ARRAY_BUFFER_CONSTRUCTOR = (b64) => {
	const decoded = atob(b64);
	const length = decoded.length;
	const arr = new Uint8Array(length);
	for (let i = 0; i < length; i++) arr[i] = decoded.charCodeAt(i);
	return arr.buffer;
};
const SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR = /* @__PURE__ */ ARRAY_BUFFER_CONSTRUCTOR.toString();
//#endregion
//#region src/core/sequence.ts
/**
* An internal class rather than a tagged POJO: identity is checked with
* `instanceof`, which untrusted input cannot forge. The class is exported
* because bundlers cannot drop an unexported top-level class.
* The eval-based `deserialize` path still rebuilds a `{__SEROVAL_SEQUENCE__…}`
* POJO from embedded source - it has no access to this class - so a value read
* back through `deserialize` is not an instance and, by design, is not treated
* as a genuine Sequence on re-serialization.
*/
var Sequence = class {
	constructor(values, throwAt, doneAt) {
		this.v = values;
		this.t = throwAt;
		this.d = doneAt;
	}
};
function isSequence(value) {
	return value instanceof Sequence;
}
function createSequence(values, throwAt, doneAt) {
	return new Sequence(values, throwAt, doneAt);
}
function createSequenceFromIterable(source) {
	const values = [];
	let throwsAt = -1;
	let doneAt = -1;
	const iterator = source[SYM_ITERATOR]();
	for (;;) try {
		const value = iterator.next();
		values.push(value.value);
		if (value.done) {
			doneAt = values.length - 1;
			break;
		}
	} catch (error) {
		throwsAt = values.length;
		doneAt = throwsAt;
		values.push(error);
		break;
	}
	return createSequence(values, throwsAt, doneAt);
}
const createIterator = /* @__PURE__ */ ITERATOR_CONSTRUCTOR(SYM_ITERATOR);
function sequenceToIterator(sequence) {
	return createIterator(sequence);
}
//#endregion
//#region src/core/special-reference.ts
const ITERATOR = {};
const ASYNC_ITERATOR = {};
/**
* Placeholder references
*/
const SPECIAL_REFS = {
	[0]: {},
	[1]: {},
	[2]: {},
	[3]: {},
	[4]: {},
	[5]: {}
};
const SPECIAL_REF_STRING = {
	[0]: "[]",
	[1]: SERIALIZED_PROMISE_CONSTRUCTOR,
	[2]: SERIALIZED_PROMISE_SUCCESS,
	[3]: SERIALIZED_PROMISE_FAILURE,
	[4]: SERIALIZED_STREAM_CONSTRUCTOR,
	[5]: SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR
};
//#endregion
//#region src/core/stream.ts
/**
* An internal class rather than a tagged POJO: identity is checked with
* `instanceof`, which untrusted input cannot forge. The class is exported
* because bundlers cannot drop an unexported top-level class.
*
* The behavior is intentionally duplicated from `STREAM_CONSTRUCTOR`. That
* constructor's source is embedded verbatim into the eval-based `deserialize`
* output, which has no access to this class, so the two cannot be shared. A
* stream read back through `deserialize` is therefore a plain POJO and, by
* design, is not treated as a genuine Stream on re-serialization. Keep the two
* implementations in sync.
*/
var Stream = class {
	constructor(live) {
		this.buffer = [];
		this.listeners = [];
		this.alive = true;
		this.success = false;
		this.count = 0;
		this.live = live;
	}
	flush(value, mode) {
		this.live > 1 || this.buffer.push(value);
		for (let x = 0; x < this.count; x++) this.listeners[x]?.[mode](value);
	}
	replay(listener) {
		for (let x = 0, z = this.buffer.length; x < z; x++) {
			const current = this.buffer[x];
			if (!this.alive && x === z - 1) listener[this.success ? "return" : "throw"](current);
			else listener.next(current);
		}
	}
	on(listener) {
		if (this.live > 1) throw new Error("Stream consumed");
		let subscribed = this.alive;
		let temp = 0;
		if (subscribed) {
			for (; temp < this.count; temp++) if (!this.listeners[temp]) break;
			if (temp === this.count) this.count++;
			this.listeners[temp] = listener;
		}
		this.replay(listener);
		if (this.live) {
			this.live = 2;
			this.buffer.length = 0;
		}
		return () => {
			if (this.alive && subscribed) {
				subscribed = false;
				this.listeners[temp] = void 0;
				while (this.count > 0 && !this.listeners[this.count - 1]) this.count--;
				this.listeners.length = this.count;
			}
		};
	}
	/**
	* Returns the events of a stream that has ended, without subscribing, so a
	* live receiver is not consumed. The last value is the `return` or `throw`
	* value. Returns `undefined` while the stream is open, or when a live
	* receiver was already consumed and has no events left.
	* @internal
	*/
	endedEvents() {
		if (this.alive || this.live > 1) return void 0;
		return {
			values: this.buffer.slice(),
			success: this.success
		};
	}
	next(value) {
		if (this.alive) this.flush(value, "next");
	}
	throw(value) {
		if (this.alive) {
			this.flush(value, "throw");
			this.alive = false;
			this.success = false;
			this.listeners.length = 0;
		}
	}
	return(value) {
		if (this.alive) {
			this.flush(value, "return");
			this.alive = false;
			this.success = true;
			this.listeners.length = 0;
		}
	}
};
function isStream(value) {
	return value instanceof Stream || isLiveStream(value);
}
function createStream() {
	return new Stream();
}
const createAsyncIterable = /* @__PURE__ */ ASYNC_ITERATOR_CONSTRUCTOR(SYM_ASYNC_ITERATOR, PROMISE_CONSTRUCTOR);
function streamToAsyncIterable(stream) {
	return createAsyncIterable(stream);
}
//#endregion
//#region src/core/utils/promise-to-result.ts
async function promiseToResult(current) {
	try {
		return [1, await current];
	} catch (e) {
		return [0, e];
	}
}
//#endregion
//#region src/core/binary-browser.ts
function encodeArrayBuffer$1(current) {
	const bytes = new Uint8Array(current);
	if (typeof bytes.toBase64 === "function") return bytes.toBase64();
	let result = "";
	for (let i = 0, len = bytes.length; i < len; i++) result += String.fromCharCode(bytes[i]);
	return btoa(result);
}
//#endregion
//#region src/core/binary-neutral.ts
const MIN_NATIVE_BASE64_LENGTH = 512;
function encodeArrayBuffer(current) {
	if (typeof Buffer !== "undefined") return Buffer.from(current).toString("base64");
	return encodeArrayBuffer$1(current);
}
function decodeArrayBuffer(source) {
	if (source.length < MIN_NATIVE_BASE64_LENGTH || typeof Buffer === "undefined") return ARRAY_BUFFER_CONSTRUCTOR(source);
	const decoded = atob(source);
	const buffer = new ArrayBuffer(decoded.length);
	Buffer.from(buffer).write(decoded, "latin1");
	return buffer;
}
//#endregion
//#region src/core/plugin.ts
let SerovalMode = /* @__PURE__ */ function(SerovalMode) {
	SerovalMode[SerovalMode["Vanilla"] = 1] = "Vanilla";
	SerovalMode[SerovalMode["Cross"] = 2] = "Cross";
	return SerovalMode;
}({});
function createPlugin(plugin) {
	return plugin;
}
function dedupePlugins(deduped, plugins) {
	for (let i = 0, len = plugins.length; i < len; i++) {
		const current = plugins[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupePlugins(deduped, current.extends);
		}
	}
}
const RESOLVED_PLUGINS = /* @__PURE__ */ new WeakMap();
function matchResolved(resolved, plugins, added) {
	for (let i = 0, len = plugins.length; i < len; i++) {
		const current = plugins[i];
		if (current === resolved[added]) {
			added++;
			if (current.extends) {
				added = matchResolved(resolved, current.extends, added);
				if (added === -1) return -1;
			}
		} else {
			const index = resolved.indexOf(current);
			if (index === -1 || index >= added) return -1;
		}
	}
	return added;
}
function resolvePlugins(plugins) {
	if (plugins) {
		const cached = RESOLVED_PLUGINS.get(plugins);
		if (cached && matchResolved(cached, plugins, 0) === cached.length) return cached;
		const deduped = /* @__PURE__ */ new Set();
		dedupePlugins(deduped, plugins);
		const resolved = [...deduped];
		RESOLVED_PLUGINS.set(plugins, resolved);
		return resolved;
	}
}
/**
* Returns the plugins that are tested for plain objects. It is the same array
* when no plugin sets `skipPlainObjects`.
*/
function getPlainObjectPlugins(plugins) {
	if (plugins) {
		for (let i = 0, len = plugins.length; i < len; i++) if (plugins[i].skipPlainObjects) {
			const result = plugins.filter((plugin) => !plugin.skipPlainObjects);
			return result.length ? result : void 0;
		}
	}
	return plugins;
}
//#endregion
//#region src/core/keys.ts
const REFERENCES_KEY = "__SEROVAL_REFS__";
const GLOBAL_CONTEXT_R = `self.\$R`;
function getCrossReferenceHeader(id) {
	if (id == null) return `${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||[]`;
	return `(${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||{})["${serializeString(id)}"]=[]`;
}
//#endregion
//#region src/core/reference.ts
const REFERENCE = /* @__PURE__ */ new Map();
const INV_REFERENCE = /* @__PURE__ */ new Map();
let installed = false;
function getGlobalObject() {
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof window !== "undefined") return window;
	if (typeof self !== "undefined") return self;
	if (typeof global !== "undefined") return global;
}
function installReferenceStore() {
	if (!installed) {
		installed = true;
		const globalObject = getGlobalObject();
		if (globalObject) Object.defineProperty(globalObject, REFERENCES_KEY, {
			value: INV_REFERENCE,
			configurable: true,
			writable: false,
			enumerable: false
		});
	}
}
function createReference(id, value) {
	installReferenceStore();
	REFERENCE.set(value, id);
	INV_REFERENCE.set(id, value);
	return value;
}
function hasReference(id) {
	return INV_REFERENCE.has(id);
}
function getReferenceID(value) {
	return REFERENCE.get(value);
}
function getReference(id) {
	if (hasReference(id)) return INV_REFERENCE.get(id);
	throw new SerovalMissingReferenceForIdError(id);
}
//#endregion
//#region src/core/context/parser.ts
function createBaseParserContext(options) {
	return {
		plugins: options.plugins,
		plainObjectPlugins: getPlainObjectPlugins(options.plugins),
		marked: /* @__PURE__ */ new Set(),
		features: 127 ^ (options.disabledFeatures ?? 0),
		refs: options.refs ?? /* @__PURE__ */ new Map(),
		depthLimit: options.depthLimit || 1e3,
		compactArrayBufferViews: options.compactArrayBufferViews ?? false
	};
}
/**
* Returns the plugins to test for an object. Plain objects, whose prototype is
* `Object.prototype`, skip the plugins that set `skipPlainObjects`. Checking
* the prototype as well as `constructor` keeps instances whose prototype has
* no own `constructor` property from skipping those plugins.
*/
function getObjectPlugins(ctx, current, currentClass) {
	return currentClass === Object && Object.getPrototypeOf(current) === Object.prototype ? ctx.plainObjectPlugins : ctx.plugins;
}
/**
* Ensures that the value (based on an identifier) has been visited by the parser.
* @param ctx
* @param id
*/
function markParserRef(ctx, id) {
	ctx.marked.add(id);
}
/**
* Creates an identifier for a value
* @param ctx
* @param current
*/
function createIndexForValue(ctx, current) {
	const id = ctx.refs.size;
	ctx.refs.set(current, id);
	return id;
}
function getNodeForIndexedValue(ctx, current) {
	const registeredId = ctx.refs.get(current);
	if (registeredId != null) {
		markParserRef(ctx, registeredId);
		return createIndexedValueNode(registeredId);
	}
	return createIndexForValue(ctx, current);
}
function getReferenceNode(ctx, current) {
	const indexed = getNodeForIndexedValue(ctx, current);
	if (typeof indexed !== "number") return indexed;
	const referenceId = getReferenceID(current);
	return referenceId === void 0 ? indexed : createReferenceNode(indexed, referenceId);
}
/**
* Parsing methods
*/
function parseWellKnownSymbol(ctx, current) {
	const ref = getReferenceNode(ctx, current);
	if (typeof ref !== "number") return ref;
	if (current in INV_SYMBOL_REF) return createWKSymbolNode(ref, current);
	throw new SerovalUnsupportedTypeError(current);
}
function parseSpecialReference(ctx, ref) {
	const result = getNodeForIndexedValue(ctx, SPECIAL_REFS[ref]);
	if (typeof result !== "number") return result;
	return createSerovalNode(26, result, ref);
}
function parseIteratorFactory(ctx) {
	const result = getNodeForIndexedValue(ctx, ITERATOR);
	if (typeof result !== "number") return result;
	return createSerovalNode(27, result, void 0, void 0, void 0, void 0, void 0, void 0, parseWellKnownSymbol(ctx, SYM_ITERATOR));
}
function parseAsyncIteratorFactory(ctx) {
	const result = getNodeForIndexedValue(ctx, ASYNC_ITERATOR);
	if (typeof result !== "number") return result;
	return createSerovalNode(29, result, void 0, void 0, void 0, void 0, void 0, [parseSpecialReference(ctx, 1), parseWellKnownSymbol(ctx, SYM_ASYNC_ITERATOR)]);
}
function getTemporalType(currentClass) {
	switch (currentClass) {
		case Temporal.Instant: return 0;
		case Temporal.Duration: return 1;
		case Temporal.PlainDate: return 2;
		case Temporal.PlainDateTime: return 3;
		case Temporal.PlainMonthDay: return 4;
		case Temporal.PlainTime: return 5;
		case Temporal.PlainYearMonth: return 6;
		case Temporal.ZonedDateTime: return 7;
		default: return;
	}
}
function getObjectClass(current) {
	const currentClass = current.constructor;
	if (typeof currentClass !== "function") {
		const proto = Object.getPrototypeOf(current);
		return proto === null ? void 0 : proto.constructor;
	}
	return currentClass;
}
/**
* Decides how an object is parsed. Shared by the sync, stream and async
* parsers so the class checks and feature gates live in one place.
*/
function getObjectKind(current, currentClass, features) {
	switch (currentClass) {
		case Object: return 1;
		case void 0: return 2;
		case Date: return 3;
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError: return 4;
		case Number:
		case Boolean:
		case String:
		case BigInt: return 6;
		case ArrayBuffer: return 7;
		case Int8Array:
		case Int16Array:
		case Int32Array:
		case Uint8Array:
		case Uint16Array:
		case Uint32Array:
		case Uint8ClampedArray:
		case Float32Array:
		case Float64Array: return 8;
		case DataView: return 10;
		case Map: return 11;
		case Set: return 12;
	}
	if (currentClass === Promise || current instanceof Promise) return 13;
	if (features & 32 && currentClass === RegExp) return 14;
	if (features & 16 && (currentClass === BigInt64Array || currentClass === BigUint64Array)) return 9;
	if (features & 1 && typeof AggregateError !== "undefined" && (currentClass === AggregateError || current instanceof AggregateError)) return 5;
	if (features & 64 && typeof Temporal !== "undefined" && getTemporalType(currentClass) != null) return 15;
	if (current instanceof Error) return 4;
	if (SYM_ITERATOR in current || SYM_ASYNC_ITERATOR in current) return 16;
	return 0;
}
function createObjectNode(id, current, empty, record) {
	return createSerovalNode(empty ? 11 : 10, id, void 0, void 0, void 0, record, void 0, void 0, void 0, void 0, getObjectFlag(current));
}
/**
* Gets the sentinel node for a Map. Call it before parsing the entries, so
* that an outer Map declares the sentinel before any Map inside it uses it.
*/
function parseMapSentinel(ctx) {
	return parseSpecialReference(ctx, 0);
}
function createMapNode(id, sentinel, k, v) {
	return createSerovalNode(8, id, void 0, void 0, void 0, void 0, {
		k,
		v
	}, void 0, sentinel);
}
function createPromiseConstructorNode(ctx, id, resolver) {
	return createSerovalNode(22, id, resolver, void 0, void 0, void 0, void 0, void 0, parseSpecialReference(ctx, 1));
}
function getArrayBufferView(ctx, current) {
	if (!ctx.compactArrayBufferViews) return current;
	const buffer = new Uint8Array(current.buffer, current.byteOffset, current.byteLength).slice().buffer;
	return new (current instanceof DataView ? DataView : getTypedArrayConstructor(getTypedArrayName(current)))(buffer);
}
function createArrayBufferNode(ctx, id, current) {
	return createSerovalNode(19, id, encodeArrayBuffer(current), void 0, void 0, void 0, void 0, void 0, parseSpecialReference(ctx, 5));
}
//#endregion
//#region src/core/context/async-parser.ts
function createAsyncParserContext(options) {
	return { base: createBaseParserContext(options) };
}
async function parseItems$1(ctx, depth, current) {
	const len = current.length;
	const nodes = new Array(len);
	for (let i = 0, node; i < len; i++) if (i in current) {
		node = parseValueAsync(ctx, depth, current[i]);
		nodes[i] = node instanceof Promise ? await node : node;
	} else nodes[i] = 0;
	return nodes;
}
async function parseArray$1(ctx, depth, id, current) {
	return createArrayNode(id, current, await parseItems$1(ctx, depth, current));
}
async function parseProperties$1(ctx, depth, properties) {
	const keys = Object.keys(properties);
	const len = keys.length;
	const keyNodes = new Array(len);
	const valueNodes = new Array(len);
	for (let i = 0, key, node; i < len; i++) {
		key = keys[i];
		keyNodes[i] = serializeString(key);
		node = parseValueAsync(ctx, depth, properties[key]);
		valueNodes[i] = node instanceof Promise ? await node : node;
	}
	if (SYM_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(28, parseIteratorFactory(ctx.base), await parseAsync(ctx, depth, createSequenceFromIterable(properties))));
	}
	if (SYM_ASYNC_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ASYNC_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(30, parseAsyncIteratorFactory(ctx.base), await parseAsyncIterable$1(ctx, depth, properties)));
	}
	if (SYM_TO_STRING_TAG in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_TO_STRING_TAG));
		valueNodes.push(createStringNode(properties[SYM_TO_STRING_TAG]));
	}
	if (SYM_IS_CONCAT_SPREADABLE in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_IS_CONCAT_SPREADABLE));
		valueNodes.push(properties[SYM_IS_CONCAT_SPREADABLE] ? TRUE_NODE : FALSE_NODE);
	}
	return {
		k: keyNodes,
		v: valueNodes
	};
}
async function parsePlainObject$1(ctx, depth, id, current, empty) {
	return createObjectNode(id, current, empty, await parseProperties$1(ctx, depth, current));
}
async function parseBoxed$1(ctx, depth, id, current) {
	return createBoxedNode(id, await parseAsync(ctx, depth, current.valueOf()));
}
async function parseView$1(ctx, depth, type, id, current) {
	current = getArrayBufferView(ctx.base, current);
	return createViewNode(type, id, current, await parseAsync(ctx, depth, current.buffer));
}
async function parseError$1(ctx, depth, type, id, current) {
	const options = getErrorOptions(current, ctx.base.features);
	return createErrorNode(type, id, current, options ? await parseProperties$1(ctx, depth, options) : void 0);
}
async function parseMap$1(ctx, depth, id, current) {
	const sentinel = parseMapSentinel(ctx.base);
	const keyNodes = new Array(current.size);
	const valueNodes = new Array(current.size);
	let node;
	let i = 0;
	for (const [key, value] of current.entries()) {
		node = parseValueAsync(ctx, depth, key);
		keyNodes[i] = node instanceof Promise ? await node : node;
		node = parseValueAsync(ctx, depth, value);
		valueNodes[i] = node instanceof Promise ? await node : node;
		i++;
	}
	return createMapNode(id, sentinel, keyNodes, valueNodes);
}
async function parseSet$1(ctx, depth, id, current) {
	const items = new Array(current.size);
	let node;
	let i = 0;
	for (const item of current.keys()) {
		node = parseValueAsync(ctx, depth, item);
		items[i++] = node instanceof Promise ? await node : node;
	}
	return createSetNode(id, items);
}
async function parsePlugin$1(ctx, depth, id, current, currentPlugins) {
	if (currentPlugins) for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.parse.async && plugin.test(current)) return createPluginNode(id, plugin.tag, await plugin.parse.async(current, {
			parse: (value) => parseAsync(ctx, depth, value),
			parseStreamSource(source) {
				if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
				return parseAsyncIterable$1(ctx, depth + 1, source);
			}
		}, { id }));
	}
}
async function parsePromise$1(ctx, depth, id, current) {
	const [status, result] = await promiseToResult(current);
	return createSerovalNode(12, id, status, void 0, void 0, void 0, void 0, void 0, await parseAsync(ctx, depth, result));
}
function parseStreamHandle(depth, id, current, resolve, reject) {
	const sequence = [];
	let unparsed = 0;
	let ended = false;
	let settled = false;
	const fail = (error) => {
		if (!settled) {
			settled = true;
			try {
				cleanup(error);
			} catch {}
			reject(error);
		}
	};
	const handle = (type) => (value, accept) => {
		if (settled) return;
		markParserRef(this.base, id);
		const slot = sequence.push(void 0) - 1;
		unparsed++;
		if (type !== 32) ended = true;
		parseAsync(this, depth, value).then((data) => {
			if (!settled) {
				sequence[slot] = createStreamEventNode(type, id, data);
				unparsed--;
				accept?.();
				if (ended && unparsed === 0) {
					settled = true;
					try {
						cleanup();
					} catch (error) {
						reject(error);
						return;
					}
					resolve(sequence);
				}
			}
		}, fail);
	};
	const listener = {
		next: handle(32),
		throw: handle(33),
		return: handle(34)
	};
	const cleanup = isLiveStream(current) ? current.pump(listener) : current.on(listener);
}
async function parseStream$1(ctx, depth, id, current) {
	return createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), await new Promise(parseStreamHandle.bind(ctx, depth, id, current)));
}
/**
* Collects an async iterable into a replay node, one value at a time.
*/
async function parseAsyncIterable$1(ctx, depth, current) {
	const id = createIndexForValue(ctx.base, {});
	const reference = parseSpecialReference(ctx.base, 4);
	const iterator = current[SYM_ASYNC_ITERATOR]();
	const sequence = [];
	for (;;) {
		let result;
		try {
			result = await iterator.next();
		} catch (error) {
			markParserRef(ctx.base, id);
			sequence.push(createStreamEventNode(33, id, await parseAsync(ctx, depth, error)));
			break;
		}
		markParserRef(ctx.base, id);
		let parsed;
		try {
			parsed = await parseAsync(ctx, depth, result.value);
		} catch (error) {
			Promise.resolve().then(() => iterator.return?.()).catch(() => {});
			throw error;
		}
		sequence.push(createStreamEventNode(result.done ? 34 : 32, id, parsed));
		if (result.done) break;
	}
	return createStreamConstructorNode(id, reference, sequence);
}
async function parseSequence$1(ctx, depth, id, current) {
	const len = current.v.length;
	const nodes = new Array(len);
	for (let i = 0, node; i < len; i++) {
		node = parseValueAsync(ctx, depth, current.v[i]);
		nodes[i] = node instanceof Promise ? await node : node;
	}
	return createSequenceNode(id, nodes, current.t, current.d);
}
async function parseObjectAsync(ctx, depth, id, current) {
	if (Array.isArray(current)) return parseArray$1(ctx, depth, id, current);
	if (isStream(current)) return parseStream$1(ctx, depth, id, current);
	if (isSequence(current)) return parseSequence$1(ctx, depth, id, current);
	const currentClass = getObjectClass(current);
	if (currentClass === OpaqueReference) return parseAsync(ctx, depth, current.replacement);
	const parsed = await parsePlugin$1(ctx, depth, id, current, getObjectPlugins(ctx.base, current, currentClass));
	if (parsed) return parsed;
	if (currentClass === Object) return parsePlainObject$1(ctx, depth, id, current, false);
	switch (getObjectKind(current, currentClass, ctx.base.features)) {
		case 2: return parsePlainObject$1(ctx, depth, id, current, true);
		case 3: return createDateNode(id, current);
		case 4: return parseError$1(ctx, depth, 13, id, current);
		case 5: return parseError$1(ctx, depth, 14, id, current);
		case 6: return parseBoxed$1(ctx, depth, id, current);
		case 7: return createArrayBufferNode(ctx.base, id, current);
		case 8: return parseView$1(ctx, depth, 15, id, current);
		case 9: return parseView$1(ctx, depth, 16, id, current);
		case 10: return parseView$1(ctx, depth, 20, id, current);
		case 11: return parseMap$1(ctx, depth, id, current);
		case 12: return parseSet$1(ctx, depth, id, current);
		case 13: return parsePromise$1(ctx, depth, id, current);
		case 14: return createRegExpNode(id, current);
		case 15: return createTemporalNode(id, getTemporalType(currentClass), current);
		case 16: return parsePlainObject$1(ctx, depth, id, current, !!currentClass);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
async function parseFunctionAsync(ctx, depth, current) {
	const ref = getReferenceNode(ctx.base, current);
	if (typeof ref !== "number") return ref;
	const plugin = await parsePlugin$1(ctx, depth, ref, current, ctx.base.plugins);
	if (plugin) return plugin;
	throw new SerovalUnsupportedTypeError(current);
}
/**
* Parses primitives and already-seen values synchronously; only objects and
* functions come back as a Promise. Errors are thrown synchronously, which
* an async caller turns into a rejection as before.
*/
function parseValueAsync(ctx, depth, current) {
	if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
	switch (typeof current) {
		case "boolean": return current ? TRUE_NODE : FALSE_NODE;
		case "undefined": return UNDEFINED_NODE;
		case "string": return createStringNode(current);
		case "number": return createNumberNode(current);
		case "bigint": return createBigIntNode(current);
		case "object":
			if (current) {
				const ref = getReferenceNode(ctx.base, current);
				return typeof ref === "number" ? parseObjectAsync(ctx, depth + 1, ref, current) : ref;
			}
			return NULL_NODE;
		case "symbol": return parseWellKnownSymbol(ctx.base, current);
		case "function": return parseFunctionAsync(ctx, depth, current);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
async function parseAsync(ctx, depth, current) {
	return await parseValueAsync(ctx, depth, current);
}
async function parseTopAsync(ctx, current) {
	try {
		return await parseAsync(ctx, 0, current);
	} catch (error) {
		throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
	}
}
//#endregion
//#region src/core/utils/valid-properties.ts
function isValidKey(key) {
	switch (key) {
		case "constructor":
		case "__proto__":
		case "prototype":
		case "__defineGetter__":
		case "__defineSetter__":
		case "__lookupGetter__":
		case "__lookupSetter__": return false;
		default: return true;
	}
}
function isValidSymbol(symbol) {
	switch (symbol) {
		case SYM_ASYNC_ITERATOR:
		case SYM_IS_CONCAT_SPREADABLE:
		case SYM_TO_STRING_TAG:
		case SYM_ITERATOR: return true;
		default: return false;
	}
}
//#endregion
//#region src/core/context/deserializer.ts
const DEFAULT_MAX_BASE64_LENGTH = 1e6;
const MAX_BIGINT_LENGTH = 1e4;
const MAX_REGEXP_SOURCE_LENGTH = 2e4;
function applyObjectFlag(obj, flag) {
	switch (flag) {
		case 3: return Object.freeze(obj);
		case 1: return Object.preventExtensions(obj);
		case 2: return Object.seal(obj);
		default: return obj;
	}
}
const DEFAULT_DEPTH_LIMIT = 1e3;
function createBaseDeserializerContext(options) {
	const maxBase64Length = options.maxBase64Length ?? DEFAULT_MAX_BASE64_LENGTH;
	if (!Number.isSafeInteger(maxBase64Length) || maxBase64Length < 0) throw new RangeError("maxBase64Length must be a non-negative safe integer");
	const refs = options.refs ?? /* @__PURE__ */ new Map();
	if (!("types" in refs)) Object.assign(refs, { types: /* @__PURE__ */ new Map() });
	return {
		plugins: options.plugins,
		refs,
		features: options.features ?? 127 ^ (options.disabledFeatures ?? 0),
		depthLimit: options.depthLimit || DEFAULT_DEPTH_LIMIT,
		maxBase64Length
	};
}
function createVanillaDeserializerContext(options) {
	return {
		base: createBaseDeserializerContext(options),
		marked: new Set(options.markedRefs)
	};
}
function createCrossDeserializerContext(options) {
	return {
		base: createBaseDeserializerContext(options),
		marked: void 0
	};
}
function guardIndexedValue(ctx, id) {
	const node = {
		t: 4,
		i: id
	};
	if (id < 0 || !Number.isInteger(id)) throw new SerovalMalformedNodeError(node);
	if (ctx.refs.has(id)) throw new SerovalConflictedNodeIdError(node);
}
function isThennable(value) {
	return !!value && (typeof value === "object" || typeof value === "function") && "then" in value && typeof value.then === "function";
}
const ignoreRejection = () => {};
function assignIndexedValue$1(ctx, id, value) {
	guardIndexedValue(ctx.base, id);
	if (value instanceof Promise) value.catch(ignoreRejection);
	const marked = ctx.marked;
	if (!marked || marked.has(id)) ctx.base.refs.set(id, value);
	return value;
}
function deserializeKnownValue(node, record, key) {
	if (Object.hasOwn(record, key)) return record[key];
	throw new SerovalMalformedNodeError(node);
}
function deserializeReference(ctx, node) {
	return assignIndexedValue$1(ctx, node.i, getReference(deserializeString(node.s)));
}
function validateNodeList(node, list) {
	if (!Array.isArray(list)) throw new SerovalMalformedNodeError(node);
}
function deserializeArray(ctx, depth, node) {
	const items = node.a;
	validateNodeList(node, items);
	const len = items.length;
	const result = assignIndexedValue$1(ctx, node.i, new Array(len));
	for (let i = 0, item; i < len; i++) {
		item = items[i];
		if (item) result[i] = deserialize$1(ctx, depth, item);
	}
	applyObjectFlag(result, node.o);
	return result;
}
function assignStringProperty(object, key, value) {
	if (isValidKey(key)) object[key] = value;
	else Object.defineProperty(object, key, {
		value,
		configurable: true,
		enumerable: true,
		writable: true
	});
}
function assignProperty(ctx, depth, object, key, value) {
	if (typeof key === "string") assignStringProperty(object, deserializeString(key), deserialize$1(ctx, depth, value));
	else {
		const actual = deserialize$1(ctx, depth, key);
		switch (typeof actual) {
			case "string":
				assignStringProperty(object, actual, deserialize$1(ctx, depth, value));
				break;
			case "symbol":
				if (isValidSymbol(actual)) object[actual] = deserialize$1(ctx, depth, value);
				break;
			default: throw new SerovalMalformedNodeError(key);
		}
	}
}
function assignNodeType(ctx, id, type) {
	ctx.base.refs.types.set(id, type);
}
function validateNodeType(ctx, node, id, type) {
	if (ctx.base.refs.types.get(id) !== type) throw new SerovalMalformedNodeError(node);
}
function deserializeProperties(ctx, depth, node, result) {
	const keys = node.k;
	validateNodeList(node, keys);
	validateNodeList(node, node.v);
	const len = keys.length;
	if (len > 0) for (let i = 0, vals = node.v; i < len; i++) assignProperty(ctx, depth, result, keys[i], vals[i]);
	return result;
}
function deserializeObject(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, node.t === 10 ? {} : Object.create(null));
	deserializeProperties(ctx, depth, node.p, result);
	applyObjectFlag(result, node.o);
	return result;
}
function deserializeDate(ctx, node) {
	return assignIndexedValue$1(ctx, node.i, new Date(node.s));
}
function deserializeTemporal(ctx, node) {
	if (!(ctx.base.features & 64)) throw new SerovalUnsupportedNodeError(node);
	const construct = Temporal[deserializeKnownValue(node, TEMPORAL_TYPE_NAME, node.c)];
	return assignIndexedValue$1(ctx, node.i, construct.from(node.s));
}
function deserializeRegExp(ctx, node) {
	if (ctx.base.features & 32) {
		const source = deserializeString(node.c);
		if (source.length > MAX_REGEXP_SOURCE_LENGTH) throw new SerovalMalformedNodeError(node);
		return assignIndexedValue$1(ctx, node.i, new RegExp(source, node.m));
	}
	throw new SerovalUnsupportedNodeError(node);
}
function deserializeSet(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, /* @__PURE__ */ new Set());
	validateNodeList(node, node.a);
	for (let i = 0, items = node.a, len = items.length; i < len; i++) result.add(deserialize$1(ctx, depth, items[i]));
	return result;
}
function deserializeMap(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, /* @__PURE__ */ new Map());
	validateNodeList(node, node.e.k);
	validateNodeList(node, node.e.v);
	for (let i = 0, keys = node.e.k, vals = node.e.v, len = keys.length; i < len; i++) result.set(deserialize$1(ctx, depth, keys[i]), deserialize$1(ctx, depth, vals[i]));
	return result;
}
function deserializeArrayBuffer(ctx, node) {
	if (typeof node.s !== "string") throw new SerovalMalformedNodeError(node);
	if (node.s.length > ctx.base.maxBase64Length) throw new RangeError("ArrayBuffer exceeds maxBase64Length (" + ctx.base.maxBase64Length + ")");
	const buffer = decodeArrayBuffer(deserializeString(node.s));
	return assignIndexedValue$1(ctx, node.i, buffer);
}
function deserializeView(ctx, depth, node, construct) {
	const source = deserialize$1(ctx, depth, node.f);
	if (!(source instanceof ArrayBuffer)) throw new SerovalMalformedNodeError(node);
	const offset = node.b ?? 0;
	if (offset < 0 || offset > source.byteLength) throw new SerovalMalformedNodeError(node);
	return assignIndexedValue$1(ctx, node.i, construct ? new construct(source, offset, node.l) : new DataView(source, offset, node.l));
}
function deserializeDictionary(ctx, depth, node, result) {
	if (node.p) {
		const fields = deserializeProperties(ctx, depth, node.p, {});
		Object.defineProperties(result, Object.getOwnPropertyDescriptors(fields));
	}
	return result;
}
function deserializeAggregateError(ctx, depth, node) {
	return deserializeDictionary(ctx, depth, node, assignIndexedValue$1(ctx, node.i, new AggregateError([], deserializeString(node.m))));
}
function deserializeError(ctx, depth, node) {
	const construct = deserializeKnownValue(node, ERROR_CONSTRUCTOR, node.s);
	return deserializeDictionary(ctx, depth, node, assignIndexedValue$1(ctx, node.i, new construct(deserializeString(node.m))));
}
function deserializePromise(ctx, depth, node) {
	const deferred = PROMISE_CONSTRUCTOR();
	const result = assignIndexedValue$1(ctx, node.i, deferred.p);
	const deserialized = deserialize$1(ctx, depth, node.f);
	if (isThennable(deserialized)) throw new SerovalMalformedNodeError(node.f);
	if (node.s) deferred.s(deserialized);
	else deferred.f(deserialized);
	return result;
}
function deserializeBoxed(ctx, depth, node) {
	return assignIndexedValue$1(ctx, node.i, Object(deserialize$1(ctx, depth, node.f)));
}
function deserializePlugin(ctx, depth, node) {
	const currentPlugins = ctx.base.plugins;
	if (currentPlugins) {
		const tag = deserializeString(node.c);
		for (let i = 0, len = currentPlugins.length; i < len; i++) {
			const plugin = currentPlugins[i];
			if (plugin.tag === tag) return assignIndexedValue$1(ctx, node.i, plugin.deserialize(node.s, { deserialize: (current) => deserialize$1(ctx, depth, current) }, { id: node.i }));
		}
	}
	throw new SerovalMissingPluginError(node.c);
}
function deserializePromiseConstructor(ctx, node) {
	const value = assignIndexedValue$1(ctx, node.i, assignIndexedValue$1(ctx, node.s, PROMISE_CONSTRUCTOR()).p);
	assignNodeType(ctx, node.s, 22);
	ctx.base.pending?.add(node.s);
	return value;
}
function deserializePromiseFulfill(ctx, depth, node) {
	const deferred = ctx.base.refs.get(node.i);
	if (deferred) {
		validateNodeType(ctx, node, node.i, 22);
		const deserialized = deserialize$1(ctx, depth, node.a[1]);
		if (isThennable(deserialized)) throw new SerovalMalformedNodeError(node.a[1]);
		if (node.t === 23) deferred.s(deserialized);
		else deferred.f(deserialized);
		ctx.base.pending?.delete(node.i);
		return;
	}
	throw new SerovalMissingInstanceError("Promise");
}
function deserializeIteratorFactoryInstance(ctx, depth, node) {
	deserialize$1(ctx, depth, node.a[0]);
	const source = deserialize$1(ctx, depth, node.a[1]);
	if (!isSequence(source)) throw new SerovalMalformedNodeError(node.a[1]);
	return sequenceToIterator(source);
}
function deserializeAsyncIteratorFactoryInstance(ctx, depth, node) {
	deserialize$1(ctx, depth, node.a[0]);
	const source = deserialize$1(ctx, depth, node.a[1]);
	if (!isStream(source)) throw new SerovalMalformedNodeError(node.a[1]);
	return streamToAsyncIterable(source);
}
function deserializeStreamConstructor(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, new Stream(node.l === 1 ? 1 : void 0));
	assignNodeType(ctx, node.i, 31);
	ctx.base.pending?.add(node.i);
	const items = node.a;
	validateNodeList(node, items);
	const len = items.length;
	if (len) for (let i = 0; i < len; i++) deserialize$1(ctx, depth, items[i]);
	return result;
}
function deserializeStreamCall(ctx, depth, node, method) {
	const deferred = ctx.base.refs.get(node.i);
	if (deferred) {
		validateNodeType(ctx, node, node.i, 31);
		deferred[method](deserialize$1(ctx, depth, node.f));
		if (method !== "next") ctx.base.pending?.delete(node.i);
		return;
	}
	throw new SerovalMissingInstanceError("Stream");
}
function deserializeIteratorFactory(ctx, depth, node) {
	deserialize$1(ctx, depth, node.f);
}
function deserializeAsyncIteratorFactory(ctx, depth, node) {
	deserialize$1(ctx, depth, node.a[1]);
}
function isSequenceIndex(value, size) {
	return Number.isInteger(value) && value >= -1 && value < size;
}
function deserializeSequence(ctx, depth, node) {
	validateNodeList(node, node.a);
	const size = node.a.length;
	if (!(isSequenceIndex(node.s, size) && isSequenceIndex(node.l, size))) throw new SerovalMalformedNodeError(node);
	const result = assignIndexedValue$1(ctx, node.i, createSequence([], node.s, node.l));
	assignNodeType(ctx, node.i, 35);
	for (let i = 0; i < size; i++) result.v[i] = deserialize$1(ctx, depth, node.a[i]);
	return result;
}
function deserialize$1(ctx, depth, node) {
	if (depth > ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
	depth += 1;
	switch (node.t) {
		case 2: return deserializeKnownValue(node, CONSTANT_VAL, node.s);
		case 0: return Number(node.s);
		case 1: return deserializeString(String(node.s));
		case 3:
			if (String(node.s).length > MAX_BIGINT_LENGTH) throw new SerovalMalformedNodeError(node);
			return BigInt(node.s);
		case 4: return ctx.base.refs.get(node.i);
		case 18: return deserializeReference(ctx, node);
		case 9: return deserializeArray(ctx, depth, node);
		case 10:
		case 11: return deserializeObject(ctx, depth, node);
		case 5: return deserializeDate(ctx, node);
		case 6: return deserializeRegExp(ctx, node);
		case 7: return deserializeSet(ctx, depth, node);
		case 8: return deserializeMap(ctx, depth, node);
		case 19: return deserializeArrayBuffer(ctx, node);
		case 16:
		case 15: return deserializeView(ctx, depth, node, getTypedArrayConstructor(node.c));
		case 20: return deserializeView(ctx, depth, node);
		case 14: return deserializeAggregateError(ctx, depth, node);
		case 13: return deserializeError(ctx, depth, node);
		case 12: return deserializePromise(ctx, depth, node);
		case 17: return deserializeKnownValue(node, SYMBOL_REF, node.s);
		case 21: return deserializeBoxed(ctx, depth, node);
		case 25: return deserializePlugin(ctx, depth, node);
		case 22: return deserializePromiseConstructor(ctx, node);
		case 23:
		case 24: return deserializePromiseFulfill(ctx, depth, node);
		case 28: return deserializeIteratorFactoryInstance(ctx, depth, node);
		case 30: return deserializeAsyncIteratorFactoryInstance(ctx, depth, node);
		case 31: return deserializeStreamConstructor(ctx, depth, node);
		case 32: return deserializeStreamCall(ctx, depth, node, "next");
		case 33: return deserializeStreamCall(ctx, depth, node, "throw");
		case 34: return deserializeStreamCall(ctx, depth, node, "return");
		case 27: return deserializeIteratorFactory(ctx, depth, node);
		case 29: return deserializeAsyncIteratorFactory(ctx, depth, node);
		case 35: return deserializeSequence(ctx, depth, node);
		case 36: return deserializeTemporal(ctx, node);
		default: throw new SerovalUnsupportedNodeError(node);
	}
}
function deserializeTop(ctx, node) {
	try {
		return deserialize$1(ctx, 0, node);
	} catch (error) {
		throw new SerovalDeserializationError(error);
	}
}
/**
* Rejects every pending promise and throws into every open stream tracked
* by `ctx.base.pending`, then drops the bookkeeping so the context no longer
* accepts deferred values. Does nothing once the bookkeeping is gone.
*/
function abortDeferred(ctx, reason) {
	const pending = ctx.base.pending;
	if (pending) {
		ctx.base.pending = void 0;
		const refs = ctx.base.refs;
		const errors = [];
		for (const id of pending) try {
			const value = refs.get(id);
			if (refs.types.get(id) === 22) value.f(reason);
			else value.throw(reason);
		} catch (error) {
			errors.push(error);
		}
		if (errors.length) throw errors[0];
	}
}
//#endregion
//#region src/core/function-string.ts
const RETURN = () => T;
const IS_MODERN = /* @__PURE__ */ (/* @__PURE__ */ RETURN.toString()).includes("=>");
function createFunction(parameters, body) {
	if (IS_MODERN) return (parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")") + "=>" + (body.startsWith("{") ? "(" + body + ")" : body);
	return "function(" + parameters.join(",") + "){return " + body + "}";
}
function createEffectfulFunction(parameters, body) {
	if (IS_MODERN) return (parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")") + "=>{" + body + "}";
	return "function(" + parameters.join(",") + "){" + body + "}";
}
//#endregion
//#region src/core/utils/get-identifier.ts
const REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
const REF_START_CHARS_LEN = 34;
const REF_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
const REF_CHARS_LEN = 64;
function getIdentifier(index) {
	let mod = index % REF_START_CHARS_LEN;
	let ref = REF_START_CHARS[mod];
	index = (index - mod) / REF_START_CHARS_LEN;
	while (index > 0) {
		mod = index % REF_CHARS_LEN;
		ref += REF_CHARS[mod];
		index = (index - mod) / REF_CHARS_LEN;
	}
	return ref;
}
//#endregion
//#region src/core/utils/is-valid-identifier.ts
function isValidIdentifier(name) {
	const len = name.length;
	for (let i = 0; i < len; i++) {
		const code = name.charCodeAt(i);
		if (!(code >= 97 && code <= 122 || code >= 65 && code <= 90 || code >= 48 && code <= 57 && i > 0 || code === 95 || code === 36)) return false;
	}
	return len > 0;
}
//#endregion
//#region src/core/context/serializer.ts
function getAssignmentExpression(assignment) {
	switch (assignment.t) {
		case 0: return assignment.s + "=" + assignment.v;
		case 2: return assignment.s + ".set(" + assignment.k + "," + assignment.v + ")";
		case 1: return assignment.s + ".add(" + assignment.v + ")";
		case 3: return assignment.s + ".delete(" + assignment.k + ")";
		case 4: return "Object.defineProperty(" + assignment.s + ",\"__proto__\",{value:" + assignment.k + ",configurable:!0,enumerable:!0,writable:!0})";
	}
}
const MAX_ASSIGNMENT_CHAIN_LENGTH = 100;
function resolveAssignments(assignments, chainValues = true) {
	if (!assignments.length) return void 0;
	let previous = assignments[0];
	let expression = getAssignmentExpression(previous);
	let result = "";
	let chainLength = 1;
	for (let index = 1, length = assignments.length; index < length; index++) {
		const assignment = assignments[index];
		if (chainLength === MAX_ASSIGNMENT_CHAIN_LENGTH) {
			result += expression + ",";
			expression = getAssignmentExpression(assignment);
			chainLength = 0;
		} else if (chainValues && assignment.t === 0 && previous.t === 0 && assignment.v === previous.v) expression = assignment.s + "=" + expression;
		else if (assignment.t === 2 && previous.t === 2 && assignment.s === previous.s) expression += ".set(" + assignment.k + "," + assignment.v + ")";
		else if (assignment.t === 1 && previous.t === 1 && assignment.s === previous.s) expression += ".add(" + assignment.v + ")";
		else if (assignment.t === 3 && previous.t === 2 && assignment.s === previous.s) expression += ".delete(" + assignment.k + ")";
		else {
			result += expression + ",";
			expression = getAssignmentExpression(assignment);
			chainLength = 0;
		}
		chainLength++;
		previous = assignment;
	}
	return result + expression + ",";
}
const NULL_CONSTRUCTOR = "Object.create(null)";
const SET_CONSTRUCTOR = "new Set";
const MAP_CONSTRUCTOR = "new Map";
const PROMISE_RESOLVE = "Promise.resolve";
const PROMISE_REJECT = "Promise.reject";
const OBJECT_FLAG_CONSTRUCTOR = {
	[3]: "Object.freeze",
	[2]: "Object.seal",
	[1]: "Object.preventExtensions",
	[0]: void 0
};
function createBaseSerializerContext(mode, options) {
	return {
		mode,
		plugins: options.plugins,
		features: options.features,
		marked: Array.isArray(options.markedRefs) ? new Set(options.markedRefs) : options.markedRefs,
		stack: [],
		flags: [],
		assignments: [],
		assignAll: mode === 2 && !options.assignSharedRefsOnly
	};
}
function createVanillaSerializerState() {
	return {
		valid: /* @__PURE__ */ new Map(),
		vars: [],
		sentinels: /* @__PURE__ */ new Set()
	};
}
function createVanillaSerializerContext(options) {
	return {
		mode: 1,
		base: createBaseSerializerContext(1, options),
		state: createVanillaSerializerState()
	};
}
function createCrossSerializerContext(options) {
	return {
		mode: 2,
		base: createBaseSerializerContext(2, options),
		state: options
	};
}
/**
* Creates the reference param (identifier) from the given reference ID
* Calling this function means the value has been referenced somewhere
*/
function getVanillaRefParam(state, index) {
	/**
	* Creates a new reference ID from a given reference ID
	* This new reference ID means that the reference itself
	* has been referenced at least once, and is used to generate
	* the variables
	*/
	let actualIndex = state.valid.get(index);
	if (actualIndex == null) {
		actualIndex = state.valid.size;
		state.valid.set(index, actualIndex);
	}
	let identifier = state.vars[actualIndex];
	if (identifier == null) {
		identifier = getIdentifier(actualIndex);
		state.vars[actualIndex] = identifier;
	}
	return identifier;
}
function getCrossRefParam(id) {
	return "$R[" + id + "]";
}
/**
* Converts the ID of a reference into a identifier string
* that is used to refer to the object instance in the
* generated script.
*/
function getRefParam(ctx, id) {
	return ctx.mode === 1 ? getVanillaRefParam(ctx.state, id) : getCrossRefParam(id);
}
function markSerializerRef(ctx, id) {
	ctx.marked.add(id);
}
function isSerializerRefMarked(ctx, id) {
	return ctx.marked.has(id);
}
function pushObjectFlag(ctx, flag, id) {
	if (flag !== 0) {
		markSerializerRef(ctx.base, id);
		ctx.base.flags.push({
			type: flag,
			value: getRefParam(ctx, id)
		});
	}
}
function resolveFlags(ctx) {
	let result = "";
	for (let i = 0, current = ctx.flags, len = current.length; i < len; i++) {
		const flag = current[i];
		result += OBJECT_FLAG_CONSTRUCTOR[flag.type] + "(" + flag.value + "),";
	}
	return result;
}
function resolvePatches(ctx) {
	const assignments = resolveAssignments(ctx.assignments);
	const flags = resolveFlags(ctx);
	if (assignments) {
		if (flags) return assignments + flags;
		return assignments;
	}
	return flags;
}
/**
* Generates the inlined assignment for the reference
* This is different from the assignments array as this one
* signifies creation rather than mutation
*/
function createAssignment(ctx, source, value) {
	ctx.assignments.push({
		t: 0,
		s: source,
		k: void 0,
		v: value
	});
}
function createAddAssignment(ctx, ref, value) {
	ctx.base.assignments.push({
		t: 1,
		s: getRefParam(ctx, ref),
		k: void 0,
		v: value
	});
}
function createSetAssignment(ctx, ref, key, value) {
	ctx.base.assignments.push({
		t: 2,
		s: getRefParam(ctx, ref),
		k: key,
		v: value
	});
}
function createDeleteAssignment(ctx, ref, key) {
	ctx.base.assignments.push({
		t: 3,
		s: getRefParam(ctx, ref),
		k: key,
		v: void 0
	});
}
function createArrayAssign(ctx, ref, index, value) {
	createAssignment(ctx.base, getRefParam(ctx, ref) + "[" + index + "]", value);
}
function createObjectAssign(ctx, ref, key, value) {
	if (key === "__proto__") {
		ctx.base.assignments.push({
			t: 4,
			s: getRefParam(ctx, ref),
			k: value,
			v: void 0
		});
		return;
	}
	createAssignment(ctx.base, getRefParam(ctx, ref) + "." + key, value);
}
function createSequenceAssign(ctx, ref, index, value) {
	createAssignment(ctx.base, getRefParam(ctx, ref) + ".v[" + index + "]", value);
}
/**
* Checks if the value is in the stack. Stack here is a reference
* structure to know if a object is to be accessed in a TDZ.
*/
function getKeyKind(key) {
	const first = key.charCodeAt(0);
	if (first >= 48 && first <= 57) {
		const check = Number(key);
		return check >= 0 && check.toString() === key ? 2 : 0;
	}
	if (key === "Infinity") return 2;
	return isValidIdentifier(key) ? 1 : 0;
}
function isIndexedValueInStack(ctx, node) {
	return node.t === 4 && ctx.stack.includes(node.i);
}
/**
* Checks if the node, or any node inside it, is read from more than one
* place. Such a node must not be created inside a deferred assignment,
* because the places that read it may run before the assignment does.
*/
function hasMarkedNode(ctx, node) {
	if (Array.isArray(node)) {
		for (let i = 0, len = node.length; i < len; i++) if (hasMarkedNode(ctx, node[i])) return true;
		return false;
	}
	if (node == null || typeof node !== "object") return false;
	const current = node;
	if (current.t !== 4 && typeof current.i === "number" && isSerializerRefMarked(ctx, current.i)) return true;
	for (const key in current) if (hasMarkedNode(ctx, current[key])) return true;
	return false;
}
/**
* Produces an assignment expression. `id` generates a reference
* parameter (through `getRefParam`) and has the option to
* return the reference parameter directly or assign a value to
* it.
*/
function assignIndexedValue(ctx, index, value) {
	if (!ctx.base.assignAll && !isSerializerRefMarked(ctx.base, index)) return value;
	/**
	* In cross-reference, we have to assume that
	* every reference are going to be referenced
	* in the future, and so we need to store
	* all of it into the reference array.
	*
	* otherwise in vanilla, we only do this if it
	* is actually referenced. `assignSharedRefsOnly` gives cross-reference
	* output the vanilla behavior.
	*/
	return getRefParam(ctx, index) + "=" + value;
}
function serializeReference(node) {
	return REFERENCES_KEY + ".get(\"" + node.s + "\")";
}
function serializeArrayItem(ctx, id, item, index) {
	if (item) {
		if (isIndexedValueInStack(ctx.base, item)) {
			markSerializerRef(ctx.base, id);
			createArrayAssign(ctx, id, index, getRefParam(ctx, item.i));
			return "";
		}
		return serialize$1(ctx, item);
	}
	return "";
}
function serializeArray(ctx, node) {
	const id = node.i;
	const list = node.a;
	const len = list.length;
	if (len > 0) {
		ctx.base.stack.push(id);
		let values = serializeArrayItem(ctx, id, list[0], 0);
		let isHoley = values === "";
		for (let i = 1, item; i < len; i++) {
			item = serializeArrayItem(ctx, id, list[i], i);
			values += "," + item;
			isHoley = item === "";
		}
		ctx.base.stack.pop();
		pushObjectFlag(ctx, node.o, node.i);
		return "[" + values + (isHoley ? ",]" : "]");
	}
	return "[]";
}
function serializeProperty(ctx, source, key, val) {
	if (typeof key === "string") {
		const kind = getKeyKind(key);
		if (isIndexedValueInStack(ctx.base, val)) {
			const refParam = getRefParam(ctx, val.i);
			markSerializerRef(ctx.base, source.i);
			if (kind === 1) createObjectAssign(ctx, source.i, key, refParam);
			else createArrayAssign(ctx, source.i, kind === 2 ? key : "\"" + key + "\"", refParam);
			return "";
		}
		if (key !== "__proto__") return (kind === 0 ? "\"" + key + "\"" : key) + ":" + serialize$1(ctx, val);
		return "[\"" + key + "\"]:" + serialize$1(ctx, val);
	}
	return "[" + serialize$1(ctx, key) + "]:" + serialize$1(ctx, val);
}
function serializeProperties(ctx, source, record) {
	const keys = record.k;
	const len = keys.length;
	if (len > 0) {
		const values = record.v;
		ctx.base.stack.push(source.i);
		let result = serializeProperty(ctx, source, keys[0], values[0]);
		for (let i = 1, item; i < len; i++) {
			item = serializeProperty(ctx, source, keys[i], values[i]);
			result += (item && result && ",") + item;
		}
		ctx.base.stack.pop();
		return "{" + result + "}";
	}
	return "{}";
}
function serializeObject(ctx, node) {
	pushObjectFlag(ctx, node.o, node.i);
	return serializeProperties(ctx, node, node.p);
}
function serializeWithObjectAssign(ctx, source, value, serialized) {
	const fields = serializeProperties(ctx, source, value);
	if (fields !== "{}") return "Object.assign(" + serialized + "," + fields + ")";
	return serialized;
}
function serializeStringKeyAssignment(ctx, source, mainAssignments, key, value) {
	const base = ctx.base;
	const serialized = serialize$1(ctx, value);
	const parentAssignment = base.assignments;
	if (!isIndexedValueInStack(base, value)) base.assignments = mainAssignments;
	createKeyAssign(ctx, source.i, getKeyKind(key), key, serialized);
	base.assignments = parentAssignment;
}
function createKeyAssign(ctx, ref, kind, key, value) {
	if (kind === 1) createObjectAssign(ctx, ref, key, value);
	else createArrayAssign(ctx, ref, kind === 2 ? key : "\"" + key + "\"", value);
}
function serializeAssignment(ctx, source, mainAssignments, key, value) {
	if (typeof key === "string") serializeStringKeyAssignment(ctx, source, mainAssignments, key, value);
	else {
		const base = ctx.base;
		const parent = base.stack;
		base.stack = [];
		const serialized = serialize$1(ctx, value);
		base.stack = parent;
		const parentAssignment = base.assignments;
		base.assignments = mainAssignments;
		createArrayAssign(ctx, source.i, serialize$1(ctx, key), serialized);
		base.assignments = parentAssignment;
	}
}
function serializeAssignments(ctx, source, node) {
	const keys = node.k;
	const len = keys.length;
	if (len > 0) {
		const mainAssignments = [];
		const values = node.v;
		ctx.base.stack.push(source.i);
		for (let i = 0; i < len; i++) serializeAssignment(ctx, source, mainAssignments, keys[i], values[i]);
		ctx.base.stack.pop();
		return resolveAssignments(mainAssignments, false);
	}
}
function serializeDictionary(ctx, node, init) {
	if (node.p) {
		const base = ctx.base;
		if (base.features & 8 && !node.p.k.includes("__proto__")) init = serializeWithObjectAssign(ctx, node, node.p, init);
		else {
			markSerializerRef(base, node.i);
			const assignments = serializeAssignments(ctx, node, node.p);
			if (assignments) return "(" + assignIndexedValue(ctx, node.i, init) + "," + assignments + getRefParam(ctx, node.i) + ")";
		}
	}
	return init;
}
function serializeNullConstructor(ctx, node) {
	pushObjectFlag(ctx, node.o, node.i);
	return serializeDictionary(ctx, node, NULL_CONSTRUCTOR);
}
function serializeDate(node) {
	return "new Date(\"" + node.s + "\")";
}
function serializeTemporal(ctx, node) {
	if (ctx.base.features & 64) return "Temporal." + TEMPORAL_TYPE_NAME[node.c] + ".from(\"" + node.s + "\")";
	throw new SerovalUnsupportedNodeError(node);
}
function serializeRegExp(ctx, node) {
	if (ctx.base.features & 32) {
		if (node.c.includes("\\x3C")) return "new RegExp(\"" + node.c + "\",\"" + node.m + "\")";
		return "/" + deserializeString(node.c) + "/" + node.m;
	}
	throw new SerovalUnsupportedNodeError(node);
}
function serializeSetItem(ctx, id, item) {
	const base = ctx.base;
	if (isIndexedValueInStack(base, item)) {
		markSerializerRef(base, id);
		createAddAssignment(ctx, id, getRefParam(ctx, item.i));
		return "";
	}
	return serialize$1(ctx, item);
}
function serializeSet(ctx, node) {
	let serialized = SET_CONSTRUCTOR;
	const items = node.a;
	const size = items.length;
	const id = node.i;
	if (size > 0) {
		ctx.base.stack.push(id);
		let result = serializeSetItem(ctx, id, items[0]);
		for (let i = 1, item; i < size; i++) {
			item = serializeSetItem(ctx, id, items[i]);
			result += (item && result && ",") + item;
		}
		ctx.base.stack.pop();
		if (result) serialized += "([" + result + "])";
	}
	return serialized;
}
function serializeMapEntry(ctx, id, key, val, getSentinel) {
	const base = ctx.base;
	if (isIndexedValueInStack(base, key)) {
		const keyRef = getRefParam(ctx, key.i);
		markSerializerRef(base, id);
		if (isIndexedValueInStack(base, val)) {
			createSetAssignment(ctx, id, keyRef, getRefParam(ctx, val.i));
			return "";
		}
		if (val.t !== 4 && val.i != null && hasMarkedNode(base, val)) {
			markSerializerRef(base, val.i);
			const sentinel = getSentinel();
			const serialized = "(" + serialize$1(ctx, val) + ",[" + sentinel + "," + sentinel + "])";
			createSetAssignment(ctx, id, keyRef, getRefParam(ctx, val.i));
			createDeleteAssignment(ctx, id, sentinel);
			return serialized;
		}
		const parent = base.stack;
		base.stack = [];
		createSetAssignment(ctx, id, keyRef, serialize$1(ctx, val));
		base.stack = parent;
		return "";
	}
	if (isIndexedValueInStack(base, val)) {
		const valueRef = getRefParam(ctx, val.i);
		markSerializerRef(base, id);
		if (key.t !== 4 && key.i != null && hasMarkedNode(base, key)) {
			markSerializerRef(base, key.i);
			const sentinel = getSentinel();
			const serialized = "(" + serialize$1(ctx, key) + ",[" + sentinel + "," + sentinel + "])";
			createSetAssignment(ctx, id, getRefParam(ctx, key.i), valueRef);
			createDeleteAssignment(ctx, id, sentinel);
			return serialized;
		}
		const parent = base.stack;
		base.stack = [];
		createSetAssignment(ctx, id, serialize$1(ctx, key), valueRef);
		base.stack = parent;
		return "";
	}
	return "[" + serialize$1(ctx, key) + "," + serialize$1(ctx, val) + "]";
}
function serializeMap(ctx, node) {
	let serialized = MAP_CONSTRUCTOR;
	const keys = node.e.k;
	const size = keys.length;
	const id = node.i;
	const sentinel = node.f;
	let sentinelRef;
	const getSentinel = () => {
		if (sentinelRef == null) {
			sentinelRef = getRefParam(ctx, sentinel.i);
			if (ctx.mode === 1) ctx.state.sentinels.add(ctx.state.valid.get(sentinel.i));
		}
		return sentinelRef;
	};
	const base = ctx.base;
	if (size > 0) {
		const vals = node.e.v;
		base.stack.push(id);
		let result = serializeMapEntry(ctx, id, keys[0], vals[0], getSentinel);
		for (let i = 1, item; i < size; i++) {
			item = serializeMapEntry(ctx, id, keys[i], vals[i], getSentinel);
			result += (item && result && ",") + item;
		}
		base.stack.pop();
		if (result) serialized += "([" + result + "])";
	}
	if (ctx.mode === 2 && sentinel.t === 26) {
		markSerializerRef(base, sentinel.i);
		serialized = "(" + serialize$1(ctx, sentinel) + "," + serialized + ")";
	}
	return serialized;
}
function serializeArrayBuffer(ctx, node) {
	return getConstructor(ctx, node.f) + "(\"" + node.s + "\")";
}
function serializeView(ctx, node) {
	return "new " + (node.t === 20 ? "DataView" : node.c) + "(" + serialize$1(ctx, node.f) + "," + node.b + "," + node.l + ")";
}
function serializeAggregateError(ctx, node) {
	const id = node.i;
	ctx.base.stack.push(id);
	const serialized = serializeDictionary(ctx, node, "new AggregateError([],\"" + node.m + "\")");
	ctx.base.stack.pop();
	return serialized;
}
function serializeError(ctx, node) {
	return serializeDictionary(ctx, node, "new " + ERROR_CONSTRUCTOR_STRING[node.s] + "(\"" + node.m + "\")");
}
function serializePromise(ctx, node) {
	let serialized;
	const fulfilled = node.f;
	const id = node.i;
	const promiseConstructor = node.s ? PROMISE_RESOLVE : PROMISE_REJECT;
	const base = ctx.base;
	if (isIndexedValueInStack(base, fulfilled)) {
		const ref = getRefParam(ctx, fulfilled.i);
		serialized = promiseConstructor + (node.s ? "().then(" + createFunction([], ref) + ")" : "().catch(" + createEffectfulFunction([], "throw " + ref) + ")");
	} else {
		base.stack.push(id);
		const result = serialize$1(ctx, fulfilled);
		base.stack.pop();
		serialized = promiseConstructor + "(" + result + ")";
	}
	return serialized;
}
function serializeBoxed(ctx, node) {
	return "Object(" + serialize$1(ctx, node.f) + ")";
}
function getConstructor(ctx, node) {
	const current = serialize$1(ctx, node);
	return node.t === 4 ? current : "(" + current + ")";
}
function serializePromiseConstructor(ctx, node) {
	if (ctx.mode === 1) throw new SerovalUnsupportedNodeError(node);
	return "(" + assignIndexedValue(ctx, node.s, getConstructor(ctx, node.f) + "()") + ").p";
}
function serializePromiseResult(ctx, node) {
	if (ctx.mode === 1) throw new SerovalUnsupportedNodeError(node);
	return getConstructor(ctx, node.a[0]) + "(" + getRefParam(ctx, node.i) + "," + serialize$1(ctx, node.a[1]) + ")";
}
function serializePlugin(ctx, node) {
	const currentPlugins = ctx.base.plugins;
	if (currentPlugins) for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.tag === node.c) return plugin.serialize(node.s, { serialize: (current) => serialize$1(ctx, current) }, { id: node.i });
	}
	throw new SerovalMissingPluginError(node.c);
}
function serializeIteratorFactory(ctx, node) {
	let result = "";
	let initialized = false;
	if (node.f.t !== 4) {
		markSerializerRef(ctx.base, node.f.i);
		result = "(" + serialize$1(ctx, node.f) + ",";
		initialized = true;
	}
	result += assignIndexedValue(ctx, node.i, "(" + SERIALIZED_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, node.f.i) + ")");
	if (initialized) result += ")";
	return result;
}
function serializeIteratorFactoryInstance(ctx, node) {
	return getConstructor(ctx, node.a[0]) + "(" + serialize$1(ctx, node.a[1]) + ")";
}
function serializeAsyncIteratorFactory(ctx, node) {
	const promise = node.a[0];
	const symbol = node.a[1];
	const base = ctx.base;
	let result = "";
	if (promise.t !== 4) {
		markSerializerRef(base, promise.i);
		result += "(" + serialize$1(ctx, promise);
	}
	if (symbol.t !== 4) {
		markSerializerRef(base, symbol.i);
		result += (result ? "," : "(") + serialize$1(ctx, symbol);
	}
	if (result) result += ",";
	const iterator = assignIndexedValue(ctx, node.i, "(" + SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, symbol.i) + "," + getRefParam(ctx, promise.i) + ")");
	if (result) return result + iterator + ")";
	return iterator;
}
function serializeStreamConstructor(ctx, node) {
	const result = assignIndexedValue(ctx, node.i, getConstructor(ctx, node.f) + (node.l === 1 ? "(1)" : "()"));
	const len = node.a.length;
	if (len) {
		let values = serialize$1(ctx, node.a[0]);
		for (let i = 1; i < len; i++) values += "," + serialize$1(ctx, node.a[i]);
		return "(" + result + "," + values + "," + getRefParam(ctx, node.i) + ")";
	}
	return result;
}
function serializeStreamCall(ctx, node, method) {
	return getRefParam(ctx, node.i) + "." + method + "(" + serialize$1(ctx, node.f) + ")";
}
function serializeSequenceItem(ctx, id, index, item) {
	const base = ctx.base;
	if (isIndexedValueInStack(base, item)) {
		markSerializerRef(base, id);
		createSequenceAssign(ctx, id, index, getRefParam(ctx, item.i));
		return "";
	}
	return serialize$1(ctx, item);
}
function serializeSequence(ctx, node) {
	const items = node.a;
	const size = items.length;
	const id = node.i;
	if (size > 0) {
		ctx.base.stack.push(id);
		let result = serializeSequenceItem(ctx, id, 0, items[0]);
		for (let i = 1, item; i < size; i++) {
			item = serializeSequenceItem(ctx, id, i, items[i]);
			result += (item && result && ",") + item;
		}
		ctx.base.stack.pop();
		if (result) return "{__SEROVAL_SEQUENCE__:!0,v:[" + result + "],t:" + node.s + ",d:" + node.l + "}";
	}
	return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function serializeAssignable(ctx, node) {
	switch (node.t) {
		case 17: return SYMBOL_STRING[node.s];
		case 18: return serializeReference(node);
		case 9: return serializeArray(ctx, node);
		case 10: return serializeObject(ctx, node);
		case 11: return serializeNullConstructor(ctx, node);
		case 5: return serializeDate(node);
		case 6: return serializeRegExp(ctx, node);
		case 7: return serializeSet(ctx, node);
		case 8: return serializeMap(ctx, node);
		case 19: return serializeArrayBuffer(ctx, node);
		case 16:
		case 15:
		case 20: return serializeView(ctx, node);
		case 14: return serializeAggregateError(ctx, node);
		case 13: return serializeError(ctx, node);
		case 12: return serializePromise(ctx, node);
		case 21: return serializeBoxed(ctx, node);
		case 22: return serializePromiseConstructor(ctx, node);
		case 25: return serializePlugin(ctx, node);
		case 26: return SPECIAL_REF_STRING[node.s];
		case 35: return serializeSequence(ctx, node);
		case 36: return serializeTemporal(ctx, node);
		default: throw new SerovalUnsupportedNodeError(node);
	}
}
function serialize$1(ctx, node) {
	switch (node.t) {
		case 2: return CONSTANT_STRING[node.s];
		case 0: return "" + node.s;
		case 1: return "\"" + node.s + "\"";
		case 3: return node.s + "n";
		case 4: return getRefParam(ctx, node.i);
		case 23:
		case 24: return serializePromiseResult(ctx, node);
		case 27: return serializeIteratorFactory(ctx, node);
		case 28:
		case 30: return serializeIteratorFactoryInstance(ctx, node);
		case 29: return serializeAsyncIteratorFactory(ctx, node);
		case 31: return serializeStreamConstructor(ctx, node);
		case 32: return serializeStreamCall(ctx, node, "next");
		case 33: return serializeStreamCall(ctx, node, "throw");
		case 34: return serializeStreamCall(ctx, node, "return");
		default: return assignIndexedValue(ctx, node.i, serializeAssignable(ctx, node));
	}
}
function serializeVanilla(ctx, tree) {
	const result = serialize$1(ctx, tree);
	if (tree.i != null && ctx.state.vars.length) {
		const patches = resolvePatches(ctx.base);
		let body = result;
		if (patches) {
			const index = getRefParam(ctx, tree.i);
			body = result + "," + patches + index;
			if (!result.startsWith(index + "=")) body = index + "=" + body;
			body = "(" + body + ")";
		}
		const sentinels = ctx.state.sentinels;
		if (sentinels.size) {
			let declarations = "";
			for (const index of sentinels) declarations += ctx.state.vars[index] + "=[],";
			body = "(" + declarations + body + ")";
		}
		return "(" + createFunction(ctx.state.vars, body) + ")()";
	}
	if (tree.t === 10) return "(" + result + ")";
	return result;
}
function serializeCross(ctx, tree) {
	const result = serialize$1(ctx, tree);
	const id = tree.i;
	if (id == null) return result;
	const patches = resolvePatches(ctx.base);
	const ref = getRefParam(ctx, id);
	const scopeId = ctx.state.scopeId;
	const params = scopeId == null ? "" : "$R";
	let body = result;
	if (patches) {
		if (!ctx.base.assignAll && !result.startsWith(ref + "=")) body = ref + "=" + result;
		body = "(" + body + "," + patches + ref + ")";
	}
	if (params === "") {
		if (tree.t === 10 && !patches) return "(" + body + ")";
		return body;
	}
	const args = scopeId == null ? "()" : "($R[\"" + serializeString(scopeId) + "\"])";
	return "(" + createFunction([params], body) + ")" + args;
}
function wrapSerializationError(error) {
	return error instanceof SerovalSerializationError ? error : new SerovalSerializationError(error);
}
function serializeTopVanilla(ctx, tree) {
	try {
		return serializeVanilla(ctx, tree);
	} catch (error) {
		throw wrapSerializationError(error);
	}
}
function serializeTopCross(ctx, tree) {
	try {
		return serializeCross(ctx, tree);
	} catch (error) {
		throw wrapSerializationError(error);
	}
}
//#endregion
//#region src/core/context/sync-parser.ts
function createSyncParserContext(options) {
	return {
		type: 1,
		base: createBaseParserContext(options)
	};
}
function parseItems(ctx, depth, current) {
	const len = current.length;
	const nodes = new Array(len);
	for (let i = 0; i < len; i++) if (i in current) nodes[i] = parseSOS(ctx, depth, current[i]);
	else nodes[i] = 0;
	return nodes;
}
function parseArray(ctx, depth, id, current) {
	return createArrayNode(id, current, parseItems(ctx, depth, current));
}
function parseProperties(ctx, depth, properties) {
	const keys = Object.keys(properties);
	const len = keys.length;
	const keyNodes = new Array(len);
	const valueNodes = new Array(len);
	for (let i = 0, key; i < len; i++) {
		key = keys[i];
		keyNodes[i] = serializeString(key);
		valueNodes[i] = parseSOS(ctx, depth, properties[key]);
	}
	if (SYM_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(28, parseIteratorFactory(ctx.base), parseSOS(ctx, depth, createSequenceFromIterable(properties))));
	}
	if (SYM_ASYNC_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ASYNC_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(30, parseAsyncIteratorFactory(ctx.base), parseAsyncIterable(ctx, depth, properties)));
	}
	if (SYM_TO_STRING_TAG in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_TO_STRING_TAG));
		valueNodes.push(createStringNode(properties[SYM_TO_STRING_TAG]));
	}
	if (SYM_IS_CONCAT_SPREADABLE in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_IS_CONCAT_SPREADABLE));
		valueNodes.push(properties[SYM_IS_CONCAT_SPREADABLE] ? TRUE_NODE : FALSE_NODE);
	}
	return {
		k: keyNodes,
		v: valueNodes
	};
}
function parseAsyncIterable(ctx, depth, current) {
	if (ctx.type !== 2) throw new SerovalUnsupportedTypeError(current);
	const id = createIndexForValue(ctx.base, {});
	const result = createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), []);
	ctx.state.iterable(ctx, depth, id, current);
	return result;
}
function parsePlainObject(ctx, depth, id, current, empty) {
	return createObjectNode(id, current, empty, parseProperties(ctx, depth, current));
}
function parseBoxed(ctx, depth, id, current) {
	return createBoxedNode(id, parseSOS(ctx, depth, current.valueOf()));
}
function parseView(ctx, depth, type, id, current) {
	current = getArrayBufferView(ctx.base, current);
	return createViewNode(type, id, current, parseSOS(ctx, depth, current.buffer));
}
function parseError(ctx, depth, type, id, current) {
	const options = getErrorOptions(current, ctx.base.features);
	return createErrorNode(type, id, current, options ? parseProperties(ctx, depth, options) : void 0);
}
function parseMap(ctx, depth, id, current) {
	const sentinel = parseMapSentinel(ctx.base);
	const keyNodes = new Array(current.size);
	const valueNodes = new Array(current.size);
	let i = 0;
	for (const [key, value] of current.entries()) {
		keyNodes[i] = parseSOS(ctx, depth, key);
		valueNodes[i] = parseSOS(ctx, depth, value);
		i++;
	}
	return createMapNode(id, sentinel, keyNodes, valueNodes);
}
function parseSet(ctx, depth, id, current) {
	const items = new Array(current.size);
	let i = 0;
	for (const item of current.keys()) items[i++] = parseSOS(ctx, depth, item);
	return createSetNode(id, items);
}
/**
* Sends the events of a stream that has ended, so the copy gets all of them.
* A stream that is still open throws, because the other sync modes cannot
* send its later events.
*/
function parseEndedStream(ctx, depth, id, current) {
	const events = current.endedEvents();
	if (!events) throw new SerovalUnsupportedTypeError(current);
	const values = events.values;
	const last = values.length - 1;
	const sequence = new Array(values.length);
	if (last >= 0) markParserRef(ctx.base, id);
	for (let i = 0; i <= last; i++) sequence[i] = createStreamEventNode(i < last ? 32 : events.success ? 34 : 33, id, parseSOS(ctx, depth, values[i]));
	return sequence;
}
function parseStream(ctx, depth, id, current) {
	const reference = parseSpecialReference(ctx.base, 4);
	if (ctx.type === 2) {
		const result = createStreamConstructorNode(id, reference, []);
		ctx.state.stream(ctx, depth, id, current);
		return result;
	}
	return createStreamConstructorNode(id, reference, parseEndedStream(ctx, depth, id, current));
}
function parseLiveStream(ctx, depth, id, current) {
	if (ctx.type !== 2) throw new SerovalUnsupportedTypeError(current);
	const result = createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), [], 1);
	ctx.state.live(ctx, depth, id, current);
	return result;
}
function parsePromise(ctx, depth, id, current) {
	if (ctx.type !== 2) throw new SerovalUnsupportedTypeError(current);
	const resolver = createIndexForValue(ctx.base, {});
	ctx.state.promise(ctx, resolver, depth, current);
	return createPromiseConstructorNode(ctx.base, id, resolver);
}
function parsePluginSync(ctx, depth, id, current, currentPlugins) {
	for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.parse.sync && plugin.test(current)) return createPluginNode(id, plugin.tag, plugin.parse.sync(current, { parse: (value) => parseSOS(ctx, depth, value) }, { id }));
	}
}
function parsePlugin(ctx, depth, id, current, currentPlugins) {
	if (currentPlugins) return ctx.type === 1 ? parsePluginSync(ctx, depth, id, current, currentPlugins) : ctx.state.plugin(ctx, depth, id, current, currentPlugins);
}
function parseSequence(ctx, depth, id, current) {
	const len = current.v.length;
	const nodes = new Array(len);
	for (let i = 0; i < len; i++) nodes[i] = parseSOS(ctx, depth, current.v[i]);
	return createSequenceNode(id, nodes, current.t, current.d);
}
function parseObjectPhase2(ctx, depth, id, current, currentClass) {
	if (currentClass === Object) return parsePlainObject(ctx, depth, id, current, false);
	switch (getObjectKind(current, currentClass, ctx.base.features)) {
		case 2: return parsePlainObject(ctx, depth, id, current, true);
		case 3: return createDateNode(id, current);
		case 4: return parseError(ctx, depth, 13, id, current);
		case 5: return parseError(ctx, depth, 14, id, current);
		case 6: return parseBoxed(ctx, depth, id, current);
		case 7: return createArrayBufferNode(ctx.base, id, current);
		case 8: return parseView(ctx, depth, 15, id, current);
		case 9: return parseView(ctx, depth, 16, id, current);
		case 10: return parseView(ctx, depth, 20, id, current);
		case 11: return parseMap(ctx, depth, id, current);
		case 12: return parseSet(ctx, depth, id, current);
		case 13: return parsePromise(ctx, depth, id, current);
		case 14: return createRegExpNode(id, current);
		case 15: return createTemporalNode(id, getTemporalType(currentClass), current);
		case 16: return parsePlainObject(ctx, depth, id, current, !!currentClass);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
function parseObject(ctx, depth, id, current) {
	if (Array.isArray(current)) return parseArray(ctx, depth, id, current);
	if (isStream(current)) return isLiveStream(current) ? parseLiveStream(ctx, depth, id, current) : parseStream(ctx, depth, id, current);
	if (isSequence(current)) return parseSequence(ctx, depth, id, current);
	const currentClass = getObjectClass(current);
	if (currentClass === OpaqueReference) return parseSOS(ctx, depth, current.replacement);
	const parsed = parsePlugin(ctx, depth, id, current, getObjectPlugins(ctx.base, current, currentClass));
	if (parsed) return parsed;
	return parseObjectPhase2(ctx, depth, id, current, currentClass);
}
function parseFunction(ctx, depth, current) {
	const ref = getReferenceNode(ctx.base, current);
	if (typeof ref !== "number") return ref;
	const plugin = parsePlugin(ctx, depth, ref, current, ctx.base.plugins);
	if (plugin) return plugin;
	throw new SerovalUnsupportedTypeError(current);
}
function parseSOS(ctx, depth, current) {
	if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
	switch (typeof current) {
		case "boolean": return current ? TRUE_NODE : FALSE_NODE;
		case "undefined": return UNDEFINED_NODE;
		case "string": return createStringNode(current);
		case "number": return createNumberNode(current);
		case "bigint": return createBigIntNode(current);
		case "object":
			if (current) {
				const ref = getReferenceNode(ctx.base, current);
				return typeof ref === "number" ? parseObject(ctx, depth + 1, ref, current) : ref;
			}
			return NULL_NODE;
		case "symbol": return parseWellKnownSymbol(ctx.base, current);
		case "function": return parseFunction(ctx, depth, current);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
function parseTop(ctx, current) {
	try {
		return parseSOS(ctx, 0, current);
	} catch (error) {
		throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
	}
}
//#endregion
//#region src/core/context/stream-parser.ts
/**
* Streaming parse mode. Everything here is reached through the function
* fields of the stream parser state, which only `createStreamParserContext`
* sets, so synchronous consumers (`serialize`, `toJSON`) never bundle it.
*/
function createStreamParsePluginContext(ctx, depth) {
	const state = ctx.state;
	function parse(current) {
		state.parsing++;
		try {
			return parseSOS(ctx, depth, current);
		} finally {
			state.parsing--;
			if (!state.alive) releaseParserValues(ctx);
		}
	}
	return {
		parse,
		parseStreamSource(current) {
			state.parsing++;
			try {
				if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
				const id = createIndexForValue(ctx.base, {});
				const node = createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), [], 1);
				iterateAsync(ctx, depth + 1, id, current, true);
				return node;
			} finally {
				state.parsing--;
				if (!state.alive) releaseParserValues(ctx);
			}
		},
		parseWithError(current) {
			try {
				return parse(current);
			} catch (error) {
				stopStreamParse(ctx, 1, error);
				return;
			}
		},
		isAlive: () => state.alive,
		pushPendingState: () => {
			pushPendingState(ctx);
		},
		popPendingState: () => {
			popPendingState(ctx);
		},
		onParse(node) {
			if (state.alive) {
				state.queue.push({
					node,
					initial: false,
					accept: void 0
				});
				drainOutput(ctx);
			}
		},
		onError(error) {
			stopStreamParse(ctx, 1, error);
		},
		addCleanup(callback) {
			addCleanup(ctx, callback);
		}
	};
}
function getStreamParsePluginContext(ctx, depth) {
	const contexts = ctx.state.pluginContexts;
	return contexts[depth] ?? (contexts[depth] = createStreamParsePluginContext(ctx, depth));
}
function addCleanup(ctx, callback) {
	if (ctx.state.alive) ctx.state.cleanups.push(callback);
	else callback();
}
function parsePluginStream(ctx, depth, id, current, currentPlugins) {
	for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.parse.stream && plugin.test(current)) return createPluginNode(id, plugin.tag, plugin.parse.stream(current, getStreamParsePluginContext(ctx, depth), { id }));
	}
}
/**
* One listener shape serves both `Stream.on` (no accept) and
* `LiveStream.pump` (accept tied to record acceptance). Handlers return the
* parse error so the pump can stop the source.
*/
function streamListener(ctx, depth, id, subscription) {
	const handle = (type, terminal) => (value, accept) => {
		let failure = void 0;
		if (ctx.state.alive) try {
			failure = parseEvent(ctx, depth, value, createStreamEventNode.bind(null, type, id), accept);
		} catch (error) {
			if (!subscription?.active) throw error;
			subscription.failure ?? (subscription.failure = { value: error });
			failure = error;
		}
		if (terminal && !accept) popPendingState(ctx);
		return failure;
	};
	return {
		next: handle(32, false),
		throw: handle(33, true),
		return: handle(34, true),
		done() {
			popPendingState(ctx);
		},
		error(reason) {
			if (ctx.state.alive) stopStreamParse(ctx, 1, reason);
		}
	};
}
function subscribeStream(ctx, depth, id, current) {
	pushPendingState(ctx);
	const subscription = {
		active: true,
		failure: void 0
	};
	let cleanup;
	try {
		cleanup = current.on(streamListener(ctx, depth, id, subscription));
	} finally {
		subscription.active = false;
	}
	try {
		addCleanup(ctx, cleanup);
	} catch (error) {
		subscription.failure ?? (subscription.failure = { value: error });
	}
	const failure = subscription.failure;
	subscription.failure = void 0;
	if (failure) throw failure.value;
}
function consumeLiveStream(ctx, depth, id, current) {
	const cancel = current.pump(streamListener(ctx, depth, id));
	pushPendingState(ctx);
	addCleanup(ctx, () => {
		cancel(ctx.state.reason);
	});
}
function wrapPromiseResult(ctx, type, id, node) {
	return createSerovalNode(type, id, void 0, void 0, void 0, void 0, void 0, [parseSpecialReference(ctx.base, type === 23 ? 2 : 3), node], void 0, void 0, void 0, void 0);
}
function handlePromise(type, id, depth, data) {
	if (this.state.alive) parseEvent(this, depth, data, wrapPromiseResult.bind(null, this, type, id), void 0);
	popPendingState(this);
}
function watchPromise(ctx, resolver, depth, current) {
	pushPendingState(ctx);
	current.then(handlePromise.bind(ctx, 23, resolver, depth), handlePromise.bind(ctx, 24, resolver, depth));
}
function returnIterator(iterator) {
	Promise.resolve().then(() => iterator.return?.()).catch(() => {});
}
/**
* Drives an async iterator directly. The next value is pulled only after the
* record for the previous one has been accepted, and cancellation returns
* the iterator once.
*/
function iterateAsync(ctx, depth, id, current, forwardReason) {
	const iterator = current[SYM_ASYNC_ITERATOR]();
	const listener = streamListener(ctx, depth, id);
	let active = true;
	function stop() {
		if (active) {
			active = false;
			if (forwardReason) try {
				Promise.resolve(iterator.return?.(ctx.state.reason)).catch(() => {});
			} catch {}
			else returnIterator(iterator);
		}
	}
	function pull() {
		if (active) iterator.next().then((result) => {
			if (active) {
				if (result.done) {
					active = false;
					listener.return(result.value, void 0);
				} else if (listener.next(result.value, pull) !== void 0) {
					stop();
					listener.done();
				}
			}
		}, (error) => {
			if (active) {
				active = false;
				listener.throw(error, void 0);
			}
		});
	}
	pushPendingState(ctx);
	addCleanup(ctx, stop);
	pull();
}
function createStreamParserState(options) {
	return {
		alive: true,
		pending: 0,
		parsing: 0,
		queue: [],
		writing: false,
		inFlight: void 0,
		reason: void 0,
		onParse: options.onParse,
		onError: options.onError,
		onDone: options.onDone,
		cleanups: [],
		pluginContexts: [],
		stream: subscribeStream,
		live: consumeLiveStream,
		promise: watchPromise,
		iterable: iterateAsync,
		plugin: parsePluginStream
	};
}
function createStreamParserContext(options) {
	return {
		type: 2,
		base: createBaseParserContext(options),
		state: createStreamParserState(options)
	};
}
function pushPendingState(ctx) {
	if (ctx.state.alive) ctx.state.pending++;
}
function popPendingState(ctx) {
	if (ctx.state.alive) {
		ctx.state.pending--;
		checkStreamParse(ctx);
	}
}
/**
* Parses a value that arrived after the root. Its record is queued before
* parsing starts so that records discovered inside it follow it, and it is
* dropped again if parsing fails. Returns the parse error after reporting
* it, or `undefined`.
*/
function parseEvent(ctx, depth, value, wrap, accept) {
	const state = ctx.state;
	const record = {
		node: void 0,
		initial: false,
		accept
	};
	let failure;
	state.queue.push(record);
	state.parsing++;
	try {
		record.node = wrap(parseSOS(ctx, depth, value));
	} catch (error) {
		failure = { value: error };
	} finally {
		state.parsing--;
		if (!state.alive) releaseParserValues(ctx);
	}
	if (failure) stopStreamParse(ctx, 1, failure.value);
	else drainOutput(ctx);
	return failure?.value;
}
/**
* Emits queued records one at a time. A callback that returns a promise
* pauses emission until it settles; the source event behind the record is
* accepted only after that.
*/
function drainOutput(ctx) {
	const state = ctx.state;
	if (state.writing || state.parsing > 0) return;
	while (state.alive && state.queue.length > 0) {
		const record = state.queue.shift();
		if (!record.node) continue;
		let pending;
		state.writing = true;
		state.inFlight = record;
		state.parsing++;
		try {
			if (!state.onParse) throw new Error("Stream output callback is unavailable");
			const result = state.onParse(record.node, record.initial);
			if (result !== null && (typeof result === "object" || typeof result === "function")) {
				const then = Reflect.get(result, "then");
				if (typeof then === "function") pending = new Promise((resolve, reject) => {
					Reflect.apply(then, result, [resolve, reject]);
				});
			}
		} catch (error) {
			releaseRecord(record);
			stopStreamParse(ctx, 1, error);
			return;
		} finally {
			state.parsing--;
			if (!state.alive) releaseParserValues(ctx);
		}
		record.node = void 0;
		if (pending) {
			if (!state.alive) releaseRecord(record);
			pending.then(() => {
				state.writing = false;
				state.inFlight = void 0;
				if (state.alive) {
					const accept = record.accept;
					releaseRecord(record);
					accept?.();
					drainOutput(ctx);
				}
			}, (error) => {
				state.writing = false;
				state.inFlight = void 0;
				releaseRecord(record);
				stopStreamParse(ctx, 1, error);
			});
			return;
		}
		if (!state.alive) {
			releaseRecord(record);
			return;
		}
		state.writing = false;
		state.inFlight = void 0;
		const accept = record.accept;
		releaseRecord(record);
		accept?.();
	}
	checkStreamParse(ctx);
}
function checkStreamParse(ctx) {
	const state = ctx.state;
	if (state.alive && state.parsing === 0 && state.pending <= 0 && state.queue.length === 0 && !state.writing) stopStreamParse(ctx, 0);
}
function startStreamParse(ctx, current) {
	const state = ctx.state;
	let parsed;
	let failure;
	state.parsing++;
	try {
		parsed = parseSOS(ctx, 0, current);
	} catch (error) {
		failure = { value: error };
	} finally {
		state.parsing--;
		if (!state.alive) releaseParserValues(ctx);
	}
	if (failure) {
		if (state.alive) stopStreamParse(ctx, 1, failure.value);
		else throw failure.value;
	} else if (parsed && state.alive) {
		state.queue.unshift({
			node: parsed,
			initial: true,
			accept: void 0
		});
		drainOutput(ctx);
	}
}
function runCleanups(state) {
	const cleanups = state.cleanups;
	let failure;
	state.cleanups = [];
	for (const record of state.queue) releaseRecord(record);
	state.queue.length = 0;
	if (state.inFlight) releaseRecord(state.inFlight);
	state.inFlight = void 0;
	for (let i = 0, len = cleanups.length; i < len; i++) try {
		cleanups[i]();
	} catch (error) {
		failure ?? (failure = { value: error });
	}
	if (failure) throw failure.value;
}
function releaseRecord(record) {
	record.node = void 0;
	record.accept = void 0;
}
function releaseParserValues(ctx) {
	ctx.base.refs = /* @__PURE__ */ new Map();
	ctx.base.marked.clear();
	ctx.base.plugins = void 0;
	ctx.base.plainObjectPlugins = void 0;
	ctx.state.pluginContexts = [];
	if (ctx.state.parsing === 0) ctx.state.reason = void 0;
}
/**
* Ends the parse once: `onDone` on success, `onError` on failure, and every
* cleanup either way.
*/
function stopStreamParse(ctx, mode, reason) {
	const state = ctx.state;
	if (state.alive) {
		state.alive = false;
		const onError = state.onError;
		const onDone = state.onDone;
		if (mode === 1 && !onError && !(reason instanceof SerovalParserError)) reason = new SerovalParserError(reason);
		state.reason = reason;
		state.onParse = void 0;
		state.onError = void 0;
		state.onDone = void 0;
		state.writing = false;
		state.parsing++;
		let failure;
		try {
			if (mode === 1) {
				if (onError) onError(reason);
				else throw reason;
			} else if (mode === 0) onDone?.();
		} catch (error) {
			failure = { value: error };
		}
		try {
			runCleanups(state);
		} catch (error) {
			failure ?? (failure = { value: error });
		} finally {
			state.parsing--;
			releaseParserValues(ctx);
			state.pending = 0;
		}
		if (failure) throw failure.value;
	}
}
function destroyStreamParse(ctx, reason) {
	stopStreamParse(ctx, 2, reason);
}
//#endregion
//#region src/core/cross/index.ts
function crossSerialize(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	const ctx = createSyncParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		disabledFeatures: options.disabledFeatures,
		refs: options.refs
	});
	const tree = parseTop(ctx, source);
	return serializeTopCross(createCrossSerializerContext({
		plugins,
		features: ctx.base.features,
		scopeId: options.scopeId,
		markedRefs: ctx.base.marked,
		assignSharedRefsOnly: options.assignSharedRefsOnly
	}), tree);
}
async function crossSerializeAsync(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	const ctx = createAsyncParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		disabledFeatures: options.disabledFeatures,
		refs: options.refs
	});
	const tree = await parseTopAsync(ctx, source);
	return serializeTopCross(createCrossSerializerContext({
		plugins,
		features: ctx.base.features,
		scopeId: options.scopeId,
		markedRefs: ctx.base.marked,
		assignSharedRefsOnly: options.assignSharedRefsOnly
	}), tree);
}
function toCrossJSON(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	return parseTop(createSyncParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		disabledFeatures: options.disabledFeatures,
		refs: options.refs
	}), source);
}
async function toCrossJSONAsync(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	return await parseTopAsync(createAsyncParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		disabledFeatures: options.disabledFeatures,
		refs: options.refs
	}), source);
}
function crossSerializeStream(source, options) {
	const plugins = resolvePlugins(options.plugins);
	const onSerialize = options.onSerialize;
	const scopeId = options.scopeId;
	const ctx = createStreamParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		refs: options.refs,
		disabledFeatures: options.disabledFeatures,
		onParse(node, initial) {
			const serial = createCrossSerializerContext({
				plugins,
				features: ctx.base.features,
				scopeId,
				markedRefs: ctx.base.marked
			});
			return onSerialize(serializeTopCross(serial, node), initial);
		},
		onError: options.onError,
		onDone: options.onDone
	});
	startStreamParse(ctx, source);
	return destroyStreamParse.bind(null, ctx);
}
function toCrossJSONStream(source, options) {
	const plugins = resolvePlugins(options.plugins);
	const ctx = createStreamParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		plugins,
		refs: options.refs,
		disabledFeatures: options.disabledFeatures,
		depthLimit: options.depthLimit,
		onParse: options.onParse,
		onError: options.onError,
		onDone: options.onDone
	});
	startStreamParse(ctx, source);
	return destroyStreamParse.bind(null, ctx);
}
function createFromCrossJSONContext(options) {
	return createCrossDeserializerContext({
		maxBase64Length: options.maxBase64Length,
		plugins: resolvePlugins(options.plugins),
		refs: options.refs,
		features: options.features,
		disabledFeatures: options.disabledFeatures,
		depthLimit: options.depthLimit
	});
}
function fromCrossJSON(source, options) {
	return deserializeTop(createFromCrossJSONContext(options), source);
}
function createCrossDeserializer(options) {
	const ctx = createFromCrossJSONContext(options);
	ctx.base.pending = /* @__PURE__ */ new Set();
	return {
		deserialize(node) {
			if (!ctx.base.pending) throw new SerovalAbortedError();
			return deserializeTop(ctx, node);
		},
		get pending() {
			return ctx.base.pending?.size ?? 0;
		},
		abort(reason) {
			abortDeferred(ctx, reason);
		}
	};
}
//#endregion
//#region src/core/Serializer.ts
var Serializer = class {
	constructor(options) {
		this.alive = true;
		this.flushed = false;
		this.done = false;
		this.pending = 0;
		this.cleanups = [];
		this.refs = /* @__PURE__ */ new Map();
		this.keys = /* @__PURE__ */ new Set();
		this.ids = 0;
		this.options = options;
		this.plugins = resolvePlugins(options.plugins);
	}
	write(key, value) {
		const options = this.options;
		if (this.alive && !this.flushed && options) {
			this.pending++;
			this.keys.add(key);
			const cleanup = crossSerializeStream(value, {
				plugins: this.plugins,
				scopeId: options.scopeId,
				refs: this.refs,
				disabledFeatures: options.disabledFeatures,
				compactArrayBufferViews: options.compactArrayBufferViews,
				depthLimit: options.depthLimit,
				onError: (error) => {
					let failure;
					try {
						if (options.onError) options.onError(error);
						else throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
					} catch (handlerError) {
						failure = { value: handlerError };
					}
					try {
						this.finishWrite();
					} catch (finishError) {
						failure ?? (failure = { value: finishError });
					}
					if (failure) throw failure.value;
				},
				onSerialize: (data, initial) => {
					const current = this.options;
					if (this.alive && current) current.onData(initial ? current.globalIdentifier + "[\"" + serializeString(key) + "\"]=" + data : data);
				},
				onDone: () => {
					this.finishWrite();
				}
			});
			if (this.alive) this.cleanups.push(cleanup);
			else cleanup();
		}
	}
	finishWrite() {
		if (this.alive) {
			this.pending--;
			if (this.pending <= 0 && this.flushed && !this.done) this.close();
		}
	}
	getNextID() {
		while (this.keys.has("" + this.ids)) this.ids++;
		return "" + this.ids;
	}
	push(value) {
		const newID = this.getNextID();
		this.write(newID, value);
		return newID;
	}
	flush() {
		if (this.alive) {
			this.flushed = true;
			if (this.pending <= 0 && !this.done) this.close();
		}
	}
	close() {
		this.finish();
	}
	finish() {
		if (this.alive) {
			this.alive = false;
			const options = this.options;
			this.options = void 0;
			this.plugins = void 0;
			const cleanups = this.cleanups;
			this.cleanups = [];
			let failure;
			for (let index = 0, length = cleanups.length; index < length; index++) try {
				cleanups[index]();
			} catch (error) {
				failure ?? (failure = { value: error });
			}
			this.refs.clear();
			if (!this.done) {
				this.done = true;
				try {
					options?.onDone?.();
				} catch (error) {
					failure ?? (failure = { value: error });
				}
			}
			if (failure) throw failure.value;
		}
	}
};
//#endregion
//#region src/core/tree/index.ts
function serialize(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	const ctx = createSyncParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		disabledFeatures: options.disabledFeatures
	});
	const tree = parseTop(ctx, source);
	return serializeTopVanilla(createVanillaSerializerContext({
		plugins,
		features: ctx.base.features,
		markedRefs: ctx.base.marked
	}), tree);
}
async function serializeAsync(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	const ctx = createAsyncParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		disabledFeatures: options.disabledFeatures
	});
	const tree = await parseTopAsync(ctx, source);
	return serializeTopVanilla(createVanillaSerializerContext({
		plugins,
		features: ctx.base.features,
		markedRefs: ctx.base.marked
	}), tree);
}
function deserialize(source) {
	return (0, eval)(source);
}
function toJSON(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	const ctx = createSyncParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		disabledFeatures: options.disabledFeatures
	});
	return {
		t: parseTop(ctx, source),
		f: ctx.base.features,
		m: Array.from(ctx.base.marked)
	};
}
async function toJSONAsync(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	const ctx = createAsyncParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		disabledFeatures: options.disabledFeatures
	});
	return {
		t: await parseTopAsync(ctx, source),
		f: ctx.base.features,
		m: Array.from(ctx.base.marked)
	};
}
function compileJSON(source, options = {}) {
	return serializeTopVanilla(createVanillaSerializerContext({
		plugins: resolvePlugins(options.plugins),
		features: source.f,
		markedRefs: source.m
	}), source.t);
}
function fromJSON(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	const disabledFeatures = options.disabledFeatures ?? 0;
	const sourceFeatures = source.f ?? 127;
	return deserializeTop(createVanillaDeserializerContext({
		depthLimit: options.depthLimit,
		maxBase64Length: options.maxBase64Length,
		plugins,
		markedRefs: source.m,
		features: sourceFeatures & ~disabledFeatures,
		disabledFeatures
	}), source.t);
}
//#endregion
exports.Feature = Feature;
exports.LiveStream = LiveStream;
exports.OpaqueReference = OpaqueReference;
exports.Sequence = Sequence;
exports.Serializer = Serializer;
exports.SerovalAbortedError = SerovalAbortedError;
exports.SerovalConflictedNodeIdError = SerovalConflictedNodeIdError;
exports.SerovalDepthLimitError = SerovalDepthLimitError;
exports.SerovalDeserializationError = SerovalDeserializationError;
exports.SerovalError = SerovalError;
exports.SerovalLiveStreamError = SerovalLiveStreamError;
exports.SerovalMalformedNodeError = SerovalMalformedNodeError;
exports.SerovalMissingInstanceError = SerovalMissingInstanceError;
exports.SerovalMissingPluginError = SerovalMissingPluginError;
exports.SerovalMissingReferenceError = SerovalMissingReferenceError;
exports.SerovalMissingReferenceForIdError = SerovalMissingReferenceForIdError;
exports.SerovalMode = SerovalMode;
exports.SerovalParserError = SerovalParserError;
exports.SerovalSerializationError = SerovalSerializationError;
exports.SerovalUnknownTypedArrayError = SerovalUnknownTypedArrayError;
exports.SerovalUnsupportedNodeError = SerovalUnsupportedNodeError;
exports.SerovalUnsupportedTypeError = SerovalUnsupportedTypeError;
exports.Stream = Stream;
exports.compileJSON = compileJSON;
exports.createCrossDeserializer = createCrossDeserializer;
exports.createLiveStream = createLiveStream;
exports.createPlugin = createPlugin;
exports.createReference = createReference;
exports.createStream = createStream;
exports.crossSerialize = crossSerialize;
exports.crossSerializeAsync = crossSerializeAsync;
exports.crossSerializeStream = crossSerializeStream;
exports.deserialize = deserialize;
exports.fromCrossJSON = fromCrossJSON;
exports.fromJSON = fromJSON;
exports.getCrossReferenceHeader = getCrossReferenceHeader;
exports.getPlainObjectPlugins = getPlainObjectPlugins;
exports.isLiveStream = isLiveStream;
exports.isStream = isStream;
exports.resolvePlugins = resolvePlugins;
exports.serialize = serialize;
exports.serializeAsync = serializeAsync;
exports.toCrossJSON = toCrossJSON;
exports.toCrossJSONAsync = toCrossJSONAsync;
exports.toCrossJSONStream = toCrossJSONStream;
exports.toJSON = toJSON;
exports.toJSONAsync = toJSONAsync;
