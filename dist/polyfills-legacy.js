(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math === Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var globalThis_1 =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$l = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$k = fails$l;

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails$k(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
	});

	var fails$j = fails$l;

	var functionBindNative = !fails$j(function () {
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var test = (function () { /* empty */ }).bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var NATIVE_BIND$3 = functionBindNative;

	var call$i = Function.prototype.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	var functionCall = NATIVE_BIND$3 ? call$i.bind(call$i) : function () {
	  return call$i.apply(call$i, arguments);
	};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$3 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$3(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var createPropertyDescriptor$5 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var NATIVE_BIND$2 = functionBindNative;

	var FunctionPrototype$2 = Function.prototype;
	var call$h = FunctionPrototype$2.call;
	// eslint-disable-next-line es/no-function-prototype-bind -- safe
	var uncurryThisWithBind = NATIVE_BIND$2 && FunctionPrototype$2.bind.bind(call$h, call$h);

	var functionUncurryThis = NATIVE_BIND$2 ? uncurryThisWithBind : function (fn) {
	  return function () {
	    return call$h.apply(fn, arguments);
	  };
	};

	var uncurryThis$q = functionUncurryThis;

	var toString$6 = uncurryThis$q({}.toString);
	var stringSlice$2 = uncurryThis$q(''.slice);

	var classofRaw$2 = function (it) {
	  return stringSlice$2(toString$6(it), 8, -1);
	};

	var uncurryThis$p = functionUncurryThis;
	var fails$i = fails$l;
	var classof$9 = classofRaw$2;

	var $Object$4 = Object;
	var split = uncurryThis$p(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails$i(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !$Object$4('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$9(it) === 'String' ? split(it, '') : $Object$4(it);
	} : $Object$4;

	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	var isNullOrUndefined$3 = function (it) {
	  return it === null || it === undefined;
	};

	var isNullOrUndefined$2 = isNullOrUndefined$3;

	var $TypeError$l = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$3 = function (it) {
	  if (isNullOrUndefined$2(it)) throw new $TypeError$l("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject = indexedObject;
	var requireObjectCoercible$2 = requireObjectCoercible$3;

	var toIndexedObject$4 = function (it) {
	  return IndexedObject(requireObjectCoercible$2(it));
	};

	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	var documentAll = typeof document == 'object' && document.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
	var isCallable$i = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
	  return typeof argument == 'function' || argument === documentAll;
	} : function (argument) {
	  return typeof argument == 'function';
	};

	var isCallable$h = isCallable$i;

	var isObject$b = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$h(it);
	};

	var globalThis$z = globalThis_1;
	var isCallable$g = isCallable$i;

	var aFunction = function (argument) {
	  return isCallable$g(argument) ? argument : undefined;
	};

	var getBuiltIn$5 = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(globalThis$z[namespace]) : globalThis$z[namespace] && globalThis$z[namespace][method];
	};

	var uncurryThis$o = functionUncurryThis;

	var objectIsPrototypeOf = uncurryThis$o({}.isPrototypeOf);

	var globalThis$y = globalThis_1;

	var navigator = globalThis$y.navigator;
	var userAgent$3 = navigator && navigator.userAgent;

	var environmentUserAgent = userAgent$3 ? String(userAgent$3) : '';

	var globalThis$x = globalThis_1;
	var userAgent$2 = environmentUserAgent;

	var process$1 = globalThis$x.process;
	var Deno$1 = globalThis$x.Deno;
	var versions = process$1 && process$1.versions || Deno$1 && Deno$1.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && userAgent$2) {
	  match = userAgent$2.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent$2.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var environmentV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */
	var V8_VERSION = environmentV8Version;
	var fails$h = fails$l;
	var globalThis$w = globalThis_1;

	var $String$6 = globalThis$w.String;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$h(function () {
	  var symbol = Symbol('symbol detection');
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
	  // of course, fail.
	  return !$String$6(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */
	var NATIVE_SYMBOL$2 = symbolConstructorDetection;

	var useSymbolAsUid = NATIVE_SYMBOL$2 &&
	  !Symbol.sham &&
	  typeof Symbol.iterator == 'symbol';

	var getBuiltIn$4 = getBuiltIn$5;
	var isCallable$f = isCallable$i;
	var isPrototypeOf$3 = objectIsPrototypeOf;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

	var $Object$3 = Object;

	var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$4('Symbol');
	  return isCallable$f($Symbol) && isPrototypeOf$3($Symbol.prototype, $Object$3(it));
	};

	var $String$5 = String;

	var tryToString$3 = function (argument) {
	  try {
	    return $String$5(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var isCallable$e = isCallable$i;
	var tryToString$2 = tryToString$3;

	var $TypeError$k = TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable$d = function (argument) {
	  if (isCallable$e(argument)) return argument;
	  throw new $TypeError$k(tryToString$2(argument) + ' is not a function');
	};

	var aCallable$c = aCallable$d;
	var isNullOrUndefined$1 = isNullOrUndefined$3;

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod$4 = function (V, P) {
	  var func = V[P];
	  return isNullOrUndefined$1(func) ? undefined : aCallable$c(func);
	};

	var call$g = functionCall;
	var isCallable$d = isCallable$i;
	var isObject$a = isObject$b;

	var $TypeError$j = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive$1 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$d(fn = input.toString) && !isObject$a(val = call$g(fn, input))) return val;
	  if (isCallable$d(fn = input.valueOf) && !isObject$a(val = call$g(fn, input))) return val;
	  if (pref !== 'string' && isCallable$d(fn = input.toString) && !isObject$a(val = call$g(fn, input))) return val;
	  throw new $TypeError$j("Can't convert object to primitive value");
	};

	var sharedStore = {exports: {}};

	var globalThis$v = globalThis_1;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$3 = Object.defineProperty;

	var defineGlobalProperty$3 = function (key, value) {
	  try {
	    defineProperty$3(globalThis$v, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    globalThis$v[key] = value;
	  } return value;
	};

	var globalThis$u = globalThis_1;
	var defineGlobalProperty$2 = defineGlobalProperty$3;

	var SHARED = '__core-js_shared__';
	var store$3 = sharedStore.exports = globalThis$u[SHARED] || defineGlobalProperty$2(SHARED, {});

	(store$3.versions || (store$3.versions = [])).push({
	  version: '3.43.0',
	  mode: 'global',
	  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.43.0/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});

	var sharedStoreExports = sharedStore.exports;

	var store$2 = sharedStoreExports;

	var shared$3 = function (key, value) {
	  return store$2[key] || (store$2[key] = value || {});
	};

	var requireObjectCoercible$1 = requireObjectCoercible$3;

	var $Object$2 = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject$3 = function (argument) {
	  return $Object$2(requireObjectCoercible$1(argument));
	};

	var uncurryThis$n = functionUncurryThis;
	var toObject$2 = toObject$3;

	var hasOwnProperty = uncurryThis$n({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject$2(it), key);
	};

	var uncurryThis$m = functionUncurryThis;

	var id = 0;
	var postfix = Math.random();
	var toString$5 = uncurryThis$m(1.1.toString);

	var uid$3 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$5(++id + postfix, 36);
	};

	var globalThis$t = globalThis_1;
	var shared$2 = shared$3;
	var hasOwn$e = hasOwnProperty_1;
	var uid$2 = uid$3;
	var NATIVE_SYMBOL$1 = symbolConstructorDetection;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;

	var Symbol$1 = globalThis$t.Symbol;
	var WellKnownSymbolsStore = shared$2('wks');
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1['for'] || Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$2;

	var wellKnownSymbol$b = function (name) {
	  if (!hasOwn$e(WellKnownSymbolsStore, name)) {
	    WellKnownSymbolsStore[name] = NATIVE_SYMBOL$1 && hasOwn$e(Symbol$1, name)
	      ? Symbol$1[name]
	      : createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var call$f = functionCall;
	var isObject$9 = isObject$b;
	var isSymbol$1 = isSymbol$2;
	var getMethod$3 = getMethod$4;
	var ordinaryToPrimitive = ordinaryToPrimitive$1;
	var wellKnownSymbol$a = wellKnownSymbol$b;

	var $TypeError$i = TypeError;
	var TO_PRIMITIVE = wellKnownSymbol$a('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive$2 = function (input, pref) {
	  if (!isObject$9(input) || isSymbol$1(input)) return input;
	  var exoticToPrim = getMethod$3(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call$f(exoticToPrim, input, pref);
	    if (!isObject$9(result) || isSymbol$1(result)) return result;
	    throw new $TypeError$i("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	var toPrimitive$1 = toPrimitive$2;
	var isSymbol = isSymbol$2;

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey$2 = function (argument) {
	  var key = toPrimitive$1(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var globalThis$s = globalThis_1;
	var isObject$8 = isObject$b;

	var document$1 = globalThis$s.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject$8(document$1) && isObject$8(document$1.createElement);

	var documentCreateElement$1 = function (it) {
	  return EXISTS$1 ? document$1.createElement(it) : {};
	};

	var DESCRIPTORS$f = descriptors;
	var fails$g = fails$l;
	var createElement$1 = documentCreateElement$1;

	// Thanks to IE8 for its funny defineProperty
	var ie8DomDefine = !DESCRIPTORS$f && !fails$g(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement$1('div'), 'a', {
	    get: function () { return 7; }
	  }).a !== 7;
	});

	var DESCRIPTORS$e = descriptors;
	var call$e = functionCall;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var createPropertyDescriptor$4 = createPropertyDescriptor$5;
	var toIndexedObject$3 = toIndexedObject$4;
	var toPropertyKey$1 = toPropertyKey$2;
	var hasOwn$d = hasOwnProperty_1;
	var IE8_DOM_DEFINE$1 = ie8DomDefine;

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$e ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$3(O);
	  P = toPropertyKey$1(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor$1(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwn$d(O, P)) return createPropertyDescriptor$4(!call$e(propertyIsEnumerableModule.f, O, P), O[P]);
	};

	var objectDefineProperty = {};

	var DESCRIPTORS$d = descriptors;
	var fails$f = fails$l;

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	var v8PrototypeDefineBug = DESCRIPTORS$d && fails$f(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype !== 42;
	});

	var isObject$7 = isObject$b;

	var $String$4 = String;
	var $TypeError$h = TypeError;

	// `Assert: Type(argument) is Object`
	var anObject$j = function (argument) {
	  if (isObject$7(argument)) return argument;
	  throw new $TypeError$h($String$4(argument) + ' is not an object');
	};

	var DESCRIPTORS$c = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
	var anObject$i = anObject$j;
	var toPropertyKey = toPropertyKey$2;

	var $TypeError$g = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE$1 = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$c ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
	  anObject$i(O);
	  P = toPropertyKey(P);
	  anObject$i(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  } return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$i(O);
	  P = toPropertyKey(P);
	  anObject$i(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError$g('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$b = descriptors;
	var definePropertyModule$4 = objectDefineProperty;
	var createPropertyDescriptor$3 = createPropertyDescriptor$5;

	var createNonEnumerableProperty$6 = DESCRIPTORS$b ? function (object, key, value) {
	  return definePropertyModule$4.f(object, key, createPropertyDescriptor$3(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var makeBuiltIn$3 = {exports: {}};

	var DESCRIPTORS$a = descriptors;
	var hasOwn$c = hasOwnProperty_1;

	var FunctionPrototype$1 = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS$a && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwn$c(FunctionPrototype$1, 'name');
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$a || (DESCRIPTORS$a && getDescriptor(FunctionPrototype$1, 'name').configurable));

	var functionName = {
	  CONFIGURABLE: CONFIGURABLE
	};

	var uncurryThis$l = functionUncurryThis;
	var isCallable$c = isCallable$i;
	var store$1 = sharedStoreExports;

	var functionToString = uncurryThis$l(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable$c(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	var inspectSource$1 = store$1.inspectSource;

	var globalThis$r = globalThis_1;
	var isCallable$b = isCallable$i;

	var WeakMap$1 = globalThis$r.WeakMap;

	var weakMapBasicDetection = isCallable$b(WeakMap$1) && /native code/.test(String(WeakMap$1));

	var shared$1 = shared$3;
	var uid$1 = uid$3;

	var keys$1 = shared$1('keys');

	var sharedKey$3 = function (key) {
	  return keys$1[key] || (keys$1[key] = uid$1(key));
	};

	var hiddenKeys$4 = {};

	var NATIVE_WEAK_MAP = weakMapBasicDetection;
	var globalThis$q = globalThis_1;
	var isObject$6 = isObject$b;
	var createNonEnumerableProperty$5 = createNonEnumerableProperty$6;
	var hasOwn$b = hasOwnProperty_1;
	var shared = sharedStoreExports;
	var sharedKey$2 = sharedKey$3;
	var hiddenKeys$3 = hiddenKeys$4;

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$4 = globalThis$q.TypeError;
	var WeakMap = globalThis$q.WeakMap;
	var set$1, get, has$6;

	var enforce = function (it) {
	  return has$6(it) ? get(it) : set$1(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject$6(it) || (state = get(it)).type !== TYPE) {
	      throw new TypeError$4('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (NATIVE_WEAK_MAP || shared.state) {
	  var store = shared.state || (shared.state = new WeakMap());
	  /* eslint-disable no-self-assign -- prototype methods protection */
	  store.get = store.get;
	  store.has = store.has;
	  store.set = store.set;
	  /* eslint-enable no-self-assign -- prototype methods protection */
	  set$1 = function (it, metadata) {
	    if (store.has(it)) throw new TypeError$4(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    store.set(it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return store.get(it) || {};
	  };
	  has$6 = function (it) {
	    return store.has(it);
	  };
	} else {
	  var STATE = sharedKey$2('state');
	  hiddenKeys$3[STATE] = true;
	  set$1 = function (it, metadata) {
	    if (hasOwn$b(it, STATE)) throw new TypeError$4(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$5(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwn$b(it, STATE) ? it[STATE] : {};
	  };
	  has$6 = function (it) {
	    return hasOwn$b(it, STATE);
	  };
	}

	var internalState = {
	  set: set$1,
	  get: get,
	  has: has$6,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var uncurryThis$k = functionUncurryThis;
	var fails$e = fails$l;
	var isCallable$a = isCallable$i;
	var hasOwn$a = hasOwnProperty_1;
	var DESCRIPTORS$9 = descriptors;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var inspectSource = inspectSource$1;
	var InternalStateModule$2 = internalState;

	var enforceInternalState$1 = InternalStateModule$2.enforce;
	var getInternalState$1 = InternalStateModule$2.get;
	var $String$3 = String;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$2 = Object.defineProperty;
	var stringSlice$1 = uncurryThis$k(''.slice);
	var replace$1 = uncurryThis$k(''.replace);
	var join = uncurryThis$k([].join);

	var CONFIGURABLE_LENGTH = DESCRIPTORS$9 && !fails$e(function () {
	  return defineProperty$2(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
	});

	var TEMPLATE = String(String).split('String');

	var makeBuiltIn$2 = makeBuiltIn$3.exports = function (value, name, options) {
	  if (stringSlice$1($String$3(name), 0, 7) === 'Symbol(') {
	    name = '[' + replace$1($String$3(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
	  }
	  if (options && options.getter) name = 'get ' + name;
	  if (options && options.setter) name = 'set ' + name;
	  if (!hasOwn$a(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
	    if (DESCRIPTORS$9) defineProperty$2(value, 'name', { value: name, configurable: true });
	    else value.name = name;
	  }
	  if (CONFIGURABLE_LENGTH && options && hasOwn$a(options, 'arity') && value.length !== options.arity) {
	    defineProperty$2(value, 'length', { value: options.arity });
	  }
	  try {
	    if (options && hasOwn$a(options, 'constructor') && options.constructor) {
	      if (DESCRIPTORS$9) defineProperty$2(value, 'prototype', { writable: false });
	    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
	    } else if (value.prototype) value.prototype = undefined;
	  } catch (error) { /* empty */ }
	  var state = enforceInternalState$1(value);
	  if (!hasOwn$a(state, 'source')) {
	    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
	  } return value;
	};

	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	// eslint-disable-next-line no-extend-native -- required
	Function.prototype.toString = makeBuiltIn$2(function toString() {
	  return isCallable$a(this) && getInternalState$1(this).source || inspectSource(this);
	}, 'toString');

	var makeBuiltInExports = makeBuiltIn$3.exports;

	var isCallable$9 = isCallable$i;
	var definePropertyModule$3 = objectDefineProperty;
	var makeBuiltIn$1 = makeBuiltInExports;
	var defineGlobalProperty$1 = defineGlobalProperty$3;

	var defineBuiltIn$6 = function (O, key, value, options) {
	  if (!options) options = {};
	  var simple = options.enumerable;
	  var name = options.name !== undefined ? options.name : key;
	  if (isCallable$9(value)) makeBuiltIn$1(value, name, options);
	  if (options.global) {
	    if (simple) O[key] = value;
	    else defineGlobalProperty$1(key, value);
	  } else {
	    try {
	      if (!options.unsafe) delete O[key];
	      else if (O[key]) simple = true;
	    } catch (error) { /* empty */ }
	    if (simple) O[key] = value;
	    else definePropertyModule$3.f(O, key, {
	      value: value,
	      enumerable: false,
	      configurable: !options.nonConfigurable,
	      writable: !options.nonWritable
	    });
	  } return O;
	};

	var objectGetOwnPropertyNames = {};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es/no-math-trunc -- safe
	var mathTrunc = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor : ceil)(n);
	};

	var trunc = mathTrunc;

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity$6 = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : trunc(number);
	};

	var toIntegerOrInfinity$5 = toIntegerOrInfinity$6;

	var max$1 = Math.max;
	var min$3 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex$1 = function (index, length) {
	  var integer = toIntegerOrInfinity$5(index);
	  return integer < 0 ? max$1(integer + length, 0) : min$3(integer, length);
	};

	var toIntegerOrInfinity$4 = toIntegerOrInfinity$6;

	var min$2 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength$2 = function (argument) {
	  var len = toIntegerOrInfinity$4(argument);
	  return len > 0 ? min$2(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength$1 = toLength$2;

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike$7 = function (obj) {
	  return toLength$1(obj.length);
	};

	var toIndexedObject$2 = toIndexedObject$4;
	var toAbsoluteIndex = toAbsoluteIndex$1;
	var lengthOfArrayLike$6 = lengthOfArrayLike$7;

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$2($this);
	    var length = lengthOfArrayLike$6(O);
	    if (length === 0) return !IS_INCLUDES && -1;
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el !== el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value !== value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var uncurryThis$j = functionUncurryThis;
	var hasOwn$9 = hasOwnProperty_1;
	var toIndexedObject$1 = toIndexedObject$4;
	var indexOf = arrayIncludes.indexOf;
	var hiddenKeys$2 = hiddenKeys$4;

	var push$3 = uncurryThis$j([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$1(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwn$9(hiddenKeys$2, key) && hasOwn$9(O, key) && push$3(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwn$9(O, key = names[i++])) {
	    ~indexOf(result, key) || push$3(result, key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys$3 = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var internalObjectKeys$1 = objectKeysInternal;
	var enumBugKeys$2 = enumBugKeys$3;

	var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$1);
	};

	var objectGetOwnPropertySymbols = {};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$3 = getBuiltIn$5;
	var uncurryThis$i = functionUncurryThis;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var anObject$h = anObject$j;

	var concat = uncurryThis$i([].concat);

	// all object keys, includes non-enumerable and symbols
	var ownKeys$1 = getBuiltIn$3('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule.f(anObject$h(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$8 = hasOwnProperty_1;
	var ownKeys = ownKeys$1;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var definePropertyModule$2 = objectDefineProperty;

	var copyConstructorProperties$2 = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = definePropertyModule$2.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn$8(target, key) && !(exceptions && hasOwn$8(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};

	var fails$d = fails$l;
	var isCallable$8 = isCallable$i;

	var replacement = /#|\.prototype\./;

	var isForced$1 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value === POLYFILL ? true
	    : value === NATIVE ? false
	    : isCallable$8(detection) ? fails$d(detection)
	    : !!detection;
	};

	var normalize = isForced$1.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$1.data = {};
	var NATIVE = isForced$1.NATIVE = 'N';
	var POLYFILL = isForced$1.POLYFILL = 'P';

	var isForced_1 = isForced$1;

	var globalThis$p = globalThis_1;
	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$4 = createNonEnumerableProperty$6;
	var defineBuiltIn$5 = defineBuiltIn$6;
	var defineGlobalProperty = defineGlobalProperty$3;
	var copyConstructorProperties$1 = copyConstructorProperties$2;
	var isForced = isForced_1;

	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = globalThis$p;
	  } else if (STATIC) {
	    target = globalThis$p[TARGET] || defineGlobalProperty(TARGET, {});
	  } else {
	    target = globalThis$p[TARGET] && globalThis$p[TARGET].prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor$2(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties$1(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty$4(sourceProperty, 'sham', true);
	    }
	    defineBuiltIn$5(target, key, sourceProperty, options);
	  }
	};

	var classof$8 = classofRaw$2;

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray$2 = Array.isArray || function isArray(argument) {
	  return classof$8(argument) === 'Array';
	};

	var DESCRIPTORS$8 = descriptors;
	var isArray$1 = isArray$2;

	var $TypeError$f = TypeError;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// Safari < 13 does not throw an error in this case
	var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS$8 && !function () {
	  // makes no sense without proper strict mode support
	  if (this !== undefined) return true;
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', { writable: false }).length = 1;
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	}();

	var arraySetLength = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
	  if (isArray$1(O) && !getOwnPropertyDescriptor$1(O, 'length').writable) {
	    throw new $TypeError$f('Cannot set read only .length');
	  } return O.length = length;
	} : function (O, length) {
	  return O.length = length;
	};

	var $TypeError$e = TypeError;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

	var doesNotExceedSafeInteger$1 = function (it) {
	  if (it > MAX_SAFE_INTEGER) throw $TypeError$e('Maximum allowed index exceeded');
	  return it;
	};

	var $$q = _export;
	var toObject$1 = toObject$3;
	var lengthOfArrayLike$5 = lengthOfArrayLike$7;
	var setArrayLength = arraySetLength;
	var doesNotExceedSafeInteger = doesNotExceedSafeInteger$1;
	var fails$c = fails$l;

	var INCORRECT_TO_LENGTH = fails$c(function () {
	  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
	});

	// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
	// https://bugs.chromium.org/p/v8/issues/detail?id=12681
	var properErrorOnNonWritableLength = function () {
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', { writable: false }).push();
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	};

	var FORCED$6 = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

	// `Array.prototype.push` method
	// https://tc39.es/ecma262/#sec-array.prototype.push
	$$q({ target: 'Array', proto: true, arity: 1, forced: FORCED$6 }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  push: function push(item) {
	    var O = toObject$1(this);
	    var len = lengthOfArrayLike$5(O);
	    var argCount = arguments.length;
	    doesNotExceedSafeInteger(len + argCount);
	    for (var i = 0; i < argCount; i++) {
	      O[len] = arguments[i];
	      len++;
	    }
	    setArrayLength(O, len);
	    return len;
	  }
	});

	var isPrototypeOf$2 = objectIsPrototypeOf;

	var $TypeError$d = TypeError;

	var anInstance$1 = function (it, Prototype) {
	  if (isPrototypeOf$2(Prototype, it)) return it;
	  throw new $TypeError$d('Incorrect invocation');
	};

	var fails$b = fails$l;

	var correctPrototypeGetter = !fails$b(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var hasOwn$7 = hasOwnProperty_1;
	var isCallable$7 = isCallable$i;
	var toObject = toObject$3;
	var sharedKey$1 = sharedKey$3;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

	var IE_PROTO$1 = sharedKey$1('IE_PROTO');
	var $Object$1 = Object;
	var ObjectPrototype$1 = $Object$1.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object$1.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwn$7(object, IE_PROTO$1)) return object[IE_PROTO$1];
	  var constructor = object.constructor;
	  if (isCallable$7(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof $Object$1 ? ObjectPrototype$1 : null;
	};

	var makeBuiltIn = makeBuiltInExports;
	var defineProperty$1 = objectDefineProperty;

	var defineBuiltInAccessor$5 = function (target, name, descriptor) {
	  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
	  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
	  return defineProperty$1.f(target, name, descriptor);
	};

	var DESCRIPTORS$7 = descriptors;
	var definePropertyModule$1 = objectDefineProperty;
	var createPropertyDescriptor$2 = createPropertyDescriptor$5;

	var createProperty$2 = function (object, key, value) {
	  if (DESCRIPTORS$7) definePropertyModule$1.f(object, key, createPropertyDescriptor$2(0, value));
	  else object[key] = value;
	};

	var objectDefineProperties = {};

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3;

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	var objectKeys$1 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS$6 = descriptors;
	var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
	var definePropertyModule = objectDefineProperty;
	var anObject$g = anObject$j;
	var toIndexedObject = toIndexedObject$4;
	var objectKeys = objectKeys$1;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	objectDefineProperties.f = DESCRIPTORS$6 && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$g(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
	  return O;
	};

	var getBuiltIn$2 = getBuiltIn$5;

	var html$2 = getBuiltIn$2('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */
	var anObject$f = anObject$j;
	var definePropertiesModule = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys = hiddenKeys$4;
	var html$1 = html$2;
	var documentCreateElement = documentCreateElement$1;
	var sharedKey = sharedKey$3;

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
	  activeXDocument = null;
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html$1.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es/no-object-create -- safe
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject$f(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
	};

	var fails$a = fails$l;
	var isCallable$6 = isCallable$i;
	var isObject$5 = isObject$b;
	var getPrototypeOf$3 = objectGetPrototypeOf;
	var defineBuiltIn$4 = defineBuiltIn$6;
	var wellKnownSymbol$9 = wellKnownSymbol$b;

	var ITERATOR$3 = wellKnownSymbol$9('iterator');

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) ;
	  else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf$3(getPrototypeOf$3(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = !isObject$5(IteratorPrototype$2) || fails$a(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$2[ITERATOR$3].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable$6(IteratorPrototype$2[ITERATOR$3])) {
	  defineBuiltIn$4(IteratorPrototype$2, ITERATOR$3, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2};

	var $$p = _export;
	var globalThis$o = globalThis_1;
	var anInstance = anInstance$1;
	var anObject$e = anObject$j;
	var isCallable$5 = isCallable$i;
	var getPrototypeOf$2 = objectGetPrototypeOf;
	var defineBuiltInAccessor$4 = defineBuiltInAccessor$5;
	var createProperty$1 = createProperty$2;
	var fails$9 = fails$l;
	var hasOwn$6 = hasOwnProperty_1;
	var wellKnownSymbol$8 = wellKnownSymbol$b;
	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
	var DESCRIPTORS$5 = descriptors;

	var CONSTRUCTOR = 'constructor';
	var ITERATOR$2 = 'Iterator';
	var TO_STRING_TAG$5 = wellKnownSymbol$8('toStringTag');

	var $TypeError$c = TypeError;
	var NativeIterator = globalThis$o[ITERATOR$2];

	// FF56- have non-standard global helper `Iterator`
	var FORCED$5 = !isCallable$5(NativeIterator)
	  || NativeIterator.prototype !== IteratorPrototype$1
	  // FF44- non-standard `Iterator` passes previous tests
	  || !fails$9(function () { NativeIterator({}); });

	var IteratorConstructor = function Iterator() {
	  anInstance(this, IteratorPrototype$1);
	  if (getPrototypeOf$2(this) === IteratorPrototype$1) throw new $TypeError$c('Abstract class Iterator not directly constructable');
	};

	var defineIteratorPrototypeAccessor = function (key, value) {
	  if (DESCRIPTORS$5) {
	    defineBuiltInAccessor$4(IteratorPrototype$1, key, {
	      configurable: true,
	      get: function () {
	        return value;
	      },
	      set: function (replacement) {
	        anObject$e(this);
	        if (this === IteratorPrototype$1) throw new $TypeError$c("You can't redefine this property");
	        if (hasOwn$6(this, key)) this[key] = replacement;
	        else createProperty$1(this, key, replacement);
	      }
	    });
	  } else IteratorPrototype$1[key] = value;
	};

	if (!hasOwn$6(IteratorPrototype$1, TO_STRING_TAG$5)) defineIteratorPrototypeAccessor(TO_STRING_TAG$5, ITERATOR$2);

	if (FORCED$5 || !hasOwn$6(IteratorPrototype$1, CONSTRUCTOR) || IteratorPrototype$1[CONSTRUCTOR] === Object) {
	  defineIteratorPrototypeAccessor(CONSTRUCTOR, IteratorConstructor);
	}

	IteratorConstructor.prototype = IteratorPrototype$1;

	// `Iterator` constructor
	// https://tc39.es/ecma262/#sec-iterator
	$$p({ global: true, constructor: true, forced: FORCED$5 }, {
	  Iterator: IteratorConstructor
	});

	// `GetIteratorDirect(obj)` abstract operation
	// https://tc39.es/proposal-iterator-helpers/#sec-getiteratordirect
	var getIteratorDirect$9 = function (obj) {
	  return {
	    iterator: obj,
	    next: obj.next,
	    done: false
	  };
	};

	var defineBuiltIn$3 = defineBuiltIn$6;

	var defineBuiltIns$1 = function (target, src, options) {
	  for (var key in src) defineBuiltIn$3(target, key, src[key], options);
	  return target;
	};

	// `CreateIterResultObject` abstract operation
	// https://tc39.es/ecma262/#sec-createiterresultobject
	var createIterResultObject$1 = function (value, done) {
	  return { value: value, done: done };
	};

	var call$d = functionCall;
	var anObject$d = anObject$j;
	var getMethod$2 = getMethod$4;

	var iteratorClose$d = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$d(iterator);
	  try {
	    innerResult = getMethod$2(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = call$d(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject$d(innerResult);
	  return value;
	};

	var iteratorClose$c = iteratorClose$d;

	var iteratorCloseAll$1 = function (iters, kind, value) {
	  for (var i = iters.length - 1; i >= 0; i--) {
	    if (iters[i] === undefined) continue;
	    try {
	      value = iteratorClose$c(iters[i].iterator, kind, value);
	    } catch (error) {
	      kind = 'throw';
	      value = error;
	    }
	  }
	  if (kind === 'throw') throw value;
	  return value;
	};

	var call$c = functionCall;
	var create$1 = objectCreate;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$6;
	var defineBuiltIns = defineBuiltIns$1;
	var wellKnownSymbol$7 = wellKnownSymbol$b;
	var InternalStateModule$1 = internalState;
	var getMethod$1 = getMethod$4;
	var IteratorPrototype = iteratorsCore.IteratorPrototype;
	var createIterResultObject = createIterResultObject$1;
	var iteratorClose$b = iteratorClose$d;
	var iteratorCloseAll = iteratorCloseAll$1;

	var TO_STRING_TAG$4 = wellKnownSymbol$7('toStringTag');
	var ITERATOR_HELPER = 'IteratorHelper';
	var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
	var NORMAL = 'normal';
	var THROW = 'throw';
	var setInternalState = InternalStateModule$1.set;

	var createIteratorProxyPrototype = function (IS_ITERATOR) {
	  var getInternalState = InternalStateModule$1.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER);

	  return defineBuiltIns(create$1(IteratorPrototype), {
	    next: function next() {
	      var state = getInternalState(this);
	      // for simplification:
	      //   for `%WrapForValidIteratorPrototype%.next` or with `state.returnHandlerResult` our `nextHandler` returns `IterResultObject`
	      //   for `%IteratorHelperPrototype%.next` - just a value
	      if (IS_ITERATOR) return state.nextHandler();
	      if (state.done) return createIterResultObject(undefined, true);
	      try {
	        var result = state.nextHandler();
	        return state.returnHandlerResult ? result : createIterResultObject(result, state.done);
	      } catch (error) {
	        state.done = true;
	        throw error;
	      }
	    },
	    'return': function () {
	      var state = getInternalState(this);
	      var iterator = state.iterator;
	      state.done = true;
	      if (IS_ITERATOR) {
	        var returnMethod = getMethod$1(iterator, 'return');
	        return returnMethod ? call$c(returnMethod, iterator) : createIterResultObject(undefined, true);
	      }
	      if (state.inner) try {
	        iteratorClose$b(state.inner.iterator, NORMAL);
	      } catch (error) {
	        return iteratorClose$b(iterator, THROW, error);
	      }
	      if (state.openIters) try {
	        iteratorCloseAll(state.openIters, NORMAL);
	      } catch (error) {
	        return iteratorClose$b(iterator, THROW, error);
	      }
	      if (iterator) iteratorClose$b(iterator, NORMAL);
	      return createIterResultObject(undefined, true);
	    }
	  });
	};

	var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);
	var IteratorHelperPrototype = createIteratorProxyPrototype(false);

	createNonEnumerableProperty$3(IteratorHelperPrototype, TO_STRING_TAG$4, 'Iterator Helper');

	var iteratorCreateProxy = function (nextHandler, IS_ITERATOR, RETURN_HANDLER_RESULT) {
	  var IteratorProxy = function Iterator(record, state) {
	    if (state) {
	      state.iterator = record.iterator;
	      state.next = record.next;
	    } else state = record;
	    state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;
	    state.returnHandlerResult = !!RETURN_HANDLER_RESULT;
	    state.nextHandler = nextHandler;
	    state.counter = 0;
	    state.done = false;
	    setInternalState(this, state);
	  };

	  IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;

	  return IteratorProxy;
	};

	var anObject$c = anObject$j;
	var iteratorClose$a = iteratorClose$d;

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing$2 = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject$c(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose$a(iterator, 'throw', error);
	  }
	};

	// Should throw an error on invalid iterator
	// https://issues.chromium.org/issues/336839115
	var iteratorHelperThrowsOnInvalidIterator$2 = function (methodName, argument) {
	  // eslint-disable-next-line es/no-iterator -- required for testing
	  var method = typeof Iterator == 'function' && Iterator.prototype[methodName];
	  if (method) try {
	    method.call({ next: null }, argument).next();
	  } catch (error) {
	    return true;
	  }
	};

	var globalThis$n = globalThis_1;

	// https://github.com/tc39/ecma262/pull/3467
	var iteratorHelperWithoutClosingOnEarlyError$7 = function (METHOD_NAME, ExpectedError) {
	  var Iterator = globalThis$n.Iterator;
	  var IteratorPrototype = Iterator && Iterator.prototype;
	  var method = IteratorPrototype && IteratorPrototype[METHOD_NAME];

	  var CLOSED = false;

	  if (method) try {
	    method.call({
	      next: function () { return { done: true }; },
	      'return': function () { CLOSED = true; }
	    }, -1);
	  } catch (error) {
	    // https://bugs.webkit.org/show_bug.cgi?id=291195
	    if (!(error instanceof ExpectedError)) CLOSED = false;
	  }

	  if (!CLOSED) return method;
	};

	var $$o = _export;
	var call$b = functionCall;
	var aCallable$b = aCallable$d;
	var anObject$b = anObject$j;
	var getIteratorDirect$8 = getIteratorDirect$9;
	var createIteratorProxy$1 = iteratorCreateProxy;
	var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$2;
	var iteratorClose$9 = iteratorClose$d;
	var iteratorHelperThrowsOnInvalidIterator$1 = iteratorHelperThrowsOnInvalidIterator$2;
	var iteratorHelperWithoutClosingOnEarlyError$6 = iteratorHelperWithoutClosingOnEarlyError$7;

	var FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR = !iteratorHelperThrowsOnInvalidIterator$1('filter', function () { /* empty */ });
	var filterWithoutClosingOnEarlyError = !FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR
	  && iteratorHelperWithoutClosingOnEarlyError$6('filter', TypeError);

	var FORCED$4 = FILTER_WITHOUT_THROWING_ON_INVALID_ITERATOR || filterWithoutClosingOnEarlyError;

	var IteratorProxy$1 = createIteratorProxy$1(function () {
	  var iterator = this.iterator;
	  var predicate = this.predicate;
	  var next = this.next;
	  var result, done, value;
	  while (true) {
	    result = anObject$b(call$b(next, iterator));
	    done = this.done = !!result.done;
	    if (done) return;
	    value = result.value;
	    if (callWithSafeIterationClosing$1(iterator, predicate, [value, this.counter++], true)) return value;
	  }
	});

	// `Iterator.prototype.filter` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.filter
	$$o({ target: 'Iterator', proto: true, real: true, forced: FORCED$4 }, {
	  filter: function filter(predicate) {
	    anObject$b(this);
	    try {
	      aCallable$b(predicate);
	    } catch (error) {
	      iteratorClose$9(this, 'throw', error);
	    }

	    if (filterWithoutClosingOnEarlyError) return call$b(filterWithoutClosingOnEarlyError, this, predicate);

	    return new IteratorProxy$1(getIteratorDirect$8(this), {
	      predicate: predicate
	    });
	  }
	});

	var classofRaw$1 = classofRaw$2;
	var uncurryThis$h = functionUncurryThis;

	var functionUncurryThisClause = function (fn) {
	  // Nashorn bug:
	  //   https://github.com/zloirock/core-js/issues/1128
	  //   https://github.com/zloirock/core-js/issues/1130
	  if (classofRaw$1(fn) === 'Function') return uncurryThis$h(fn);
	};

	var uncurryThis$g = functionUncurryThisClause;
	var aCallable$a = aCallable$d;
	var NATIVE_BIND$1 = functionBindNative;

	var bind$2 = uncurryThis$g(uncurryThis$g.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
	  aCallable$a(fn);
	  return that === undefined ? fn : NATIVE_BIND$1 ? bind$2(fn, that) : function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var iterators = {};

	var wellKnownSymbol$6 = wellKnownSymbol$b;
	var Iterators$1 = iterators;

	var ITERATOR$1 = wellKnownSymbol$6('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod$1 = function (it) {
	  return it !== undefined && (Iterators$1.Array === it || ArrayPrototype[ITERATOR$1] === it);
	};

	var wellKnownSymbol$5 = wellKnownSymbol$b;

	var TO_STRING_TAG$3 = wellKnownSymbol$5('toStringTag');
	var test = {};

	test[TO_STRING_TAG$3] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var isCallable$4 = isCallable$i;
	var classofRaw = classofRaw$2;
	var wellKnownSymbol$4 = wellKnownSymbol$b;

	var TO_STRING_TAG$2 = wellKnownSymbol$4('toStringTag');
	var $Object = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof$7 = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) === 'Object' && isCallable$4(O.callee) ? 'Arguments' : result;
	};

	var classof$6 = classof$7;
	var getMethod = getMethod$4;
	var isNullOrUndefined = isNullOrUndefined$3;
	var Iterators = iterators;
	var wellKnownSymbol$3 = wellKnownSymbol$b;

	var ITERATOR = wellKnownSymbol$3('iterator');

	var getIteratorMethod$2 = function (it) {
	  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
	    || getMethod(it, '@@iterator')
	    || Iterators[classof$6(it)];
	};

	var call$a = functionCall;
	var aCallable$9 = aCallable$d;
	var anObject$a = anObject$j;
	var tryToString$1 = tryToString$3;
	var getIteratorMethod$1 = getIteratorMethod$2;

	var $TypeError$b = TypeError;

	var getIterator$1 = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$1(argument) : usingIterator;
	  if (aCallable$9(iteratorMethod)) return anObject$a(call$a(iteratorMethod, argument));
	  throw new $TypeError$b(tryToString$1(argument) + ' is not iterable');
	};

	var bind$1 = functionBindContext;
	var call$9 = functionCall;
	var anObject$9 = anObject$j;
	var tryToString = tryToString$3;
	var isArrayIteratorMethod = isArrayIteratorMethod$1;
	var lengthOfArrayLike$4 = lengthOfArrayLike$7;
	var isPrototypeOf$1 = objectIsPrototypeOf;
	var getIterator = getIterator$1;
	var getIteratorMethod = getIteratorMethod$2;
	var iteratorClose$8 = iteratorClose$d;

	var $TypeError$a = TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate$8 = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_RECORD = !!(options && options.IS_RECORD);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = bind$1(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose$8(iterator, 'normal');
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject$9(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_RECORD) {
	    iterator = iterable.iterator;
	  } else if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw new $TypeError$a(tryToString(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike$4(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && isPrototypeOf$1(ResultPrototype, result)) return result;
	      } return new Result(false);
	    }
	    iterator = getIterator(iterable, iterFn);
	  }

	  next = IS_RECORD ? iterable.next : iterator.next;
	  while (!(step = call$9(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose$8(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && isPrototypeOf$1(ResultPrototype, result)) return result;
	  } return new Result(false);
	};

	var $$n = _export;
	var call$8 = functionCall;
	var iterate$7 = iterate$8;
	var aCallable$8 = aCallable$d;
	var anObject$8 = anObject$j;
	var getIteratorDirect$7 = getIteratorDirect$9;
	var iteratorClose$7 = iteratorClose$d;
	var iteratorHelperWithoutClosingOnEarlyError$5 = iteratorHelperWithoutClosingOnEarlyError$7;

	var forEachWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError$5('forEach', TypeError);

	// `Iterator.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.foreach
	$$n({ target: 'Iterator', proto: true, real: true, forced: forEachWithoutClosingOnEarlyError }, {
	  forEach: function forEach(fn) {
	    anObject$8(this);
	    try {
	      aCallable$8(fn);
	    } catch (error) {
	      iteratorClose$7(this, 'throw', error);
	    }

	    if (forEachWithoutClosingOnEarlyError) return call$8(forEachWithoutClosingOnEarlyError, this, fn);

	    var record = getIteratorDirect$7(this);
	    var counter = 0;
	    iterate$7(record, function (value) {
	      fn(value, counter++);
	    }, { IS_RECORD: true });
	  }
	});

	var $$m = _export;
	var call$7 = functionCall;
	var aCallable$7 = aCallable$d;
	var anObject$7 = anObject$j;
	var getIteratorDirect$6 = getIteratorDirect$9;
	var createIteratorProxy = iteratorCreateProxy;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$2;
	var iteratorClose$6 = iteratorClose$d;
	var iteratorHelperThrowsOnInvalidIterator = iteratorHelperThrowsOnInvalidIterator$2;
	var iteratorHelperWithoutClosingOnEarlyError$4 = iteratorHelperWithoutClosingOnEarlyError$7;

	var MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR = !iteratorHelperThrowsOnInvalidIterator('map', function () { /* empty */ });
	var mapWithoutClosingOnEarlyError = !MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR
	  && iteratorHelperWithoutClosingOnEarlyError$4('map', TypeError);

	var FORCED$3 = MAP_WITHOUT_THROWING_ON_INVALID_ITERATOR || mapWithoutClosingOnEarlyError;

	var IteratorProxy = createIteratorProxy(function () {
	  var iterator = this.iterator;
	  var result = anObject$7(call$7(this.next, iterator));
	  var done = this.done = !!result.done;
	  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true);
	});

	// `Iterator.prototype.map` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.map
	$$m({ target: 'Iterator', proto: true, real: true, forced: FORCED$3 }, {
	  map: function map(mapper) {
	    anObject$7(this);
	    try {
	      aCallable$7(mapper);
	    } catch (error) {
	      iteratorClose$6(this, 'throw', error);
	    }

	    if (mapWithoutClosingOnEarlyError) return call$7(mapWithoutClosingOnEarlyError, this, mapper);

	    return new IteratorProxy(getIteratorDirect$6(this), {
	      mapper: mapper
	    });
	  }
	});

	var uncurryThis$f = functionUncurryThis;

	// eslint-disable-next-line es/no-set -- safe
	var SetPrototype$1 = Set.prototype;

	var setHelpers = {
	  // eslint-disable-next-line es/no-set -- safe
	  Set: Set,
	  add: uncurryThis$f(SetPrototype$1.add),
	  has: uncurryThis$f(SetPrototype$1.has),
	  remove: uncurryThis$f(SetPrototype$1['delete']),
	  proto: SetPrototype$1
	};

	var has$5 = setHelpers.has;

	// Perform ? RequireInternalSlot(M, [[SetData]])
	var aSet$7 = function (it) {
	  has$5(it);
	  return it;
	};

	var call$6 = functionCall;

	var iterateSimple$7 = function (record, fn, ITERATOR_INSTEAD_OF_RECORD) {
	  var iterator = ITERATOR_INSTEAD_OF_RECORD ? record : record.iterator;
	  var next = record.next;
	  var step, result;
	  while (!(step = call$6(next, iterator)).done) {
	    result = fn(step.value);
	    if (result !== undefined) return result;
	  }
	};

	var uncurryThis$e = functionUncurryThis;
	var iterateSimple$6 = iterateSimple$7;
	var SetHelpers$5 = setHelpers;

	var Set$3 = SetHelpers$5.Set;
	var SetPrototype = SetHelpers$5.proto;
	var forEach$2 = uncurryThis$e(SetPrototype.forEach);
	var keys = uncurryThis$e(SetPrototype.keys);
	var next = keys(new Set$3()).next;

	var setIterate = function (set, fn, interruptible) {
	  return interruptible ? iterateSimple$6({ iterator: keys(set), next: next }, fn) : forEach$2(set, fn);
	};

	var SetHelpers$4 = setHelpers;
	var iterate$6 = setIterate;

	var Set$2 = SetHelpers$4.Set;
	var add$3 = SetHelpers$4.add;

	var setClone = function (set) {
	  var result = new Set$2();
	  iterate$6(set, function (it) {
	    add$3(result, it);
	  });
	  return result;
	};

	var uncurryThis$d = functionUncurryThis;
	var aCallable$6 = aCallable$d;

	var functionUncurryThisAccessor = function (object, key, method) {
	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    return uncurryThis$d(aCallable$6(Object.getOwnPropertyDescriptor(object, key)[method]));
	  } catch (error) { /* empty */ }
	};

	var uncurryThisAccessor$3 = functionUncurryThisAccessor;
	var SetHelpers$3 = setHelpers;

	var setSize = uncurryThisAccessor$3(SetHelpers$3.proto, 'size', 'get') || function (set) {
	  return set.size;
	};

	var aCallable$5 = aCallable$d;
	var anObject$6 = anObject$j;
	var call$5 = functionCall;
	var toIntegerOrInfinity$3 = toIntegerOrInfinity$6;
	var getIteratorDirect$5 = getIteratorDirect$9;

	var INVALID_SIZE = 'Invalid size';
	var $RangeError$2 = RangeError;
	var $TypeError$9 = TypeError;
	var max = Math.max;

	var SetRecord = function (set, intSize) {
	  this.set = set;
	  this.size = max(intSize, 0);
	  this.has = aCallable$5(set.has);
	  this.keys = aCallable$5(set.keys);
	};

	SetRecord.prototype = {
	  getIterator: function () {
	    return getIteratorDirect$5(anObject$6(call$5(this.keys, this.set)));
	  },
	  includes: function (it) {
	    return call$5(this.has, this.set, it);
	  }
	};

	// `GetSetRecord` abstract operation
	// https://tc39.es/proposal-set-methods/#sec-getsetrecord
	var getSetRecord$7 = function (obj) {
	  anObject$6(obj);
	  var numSize = +obj.size;
	  // NOTE: If size is undefined, then numSize will be NaN
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (numSize !== numSize) throw new $TypeError$9(INVALID_SIZE);
	  var intSize = toIntegerOrInfinity$3(numSize);
	  if (intSize < 0) throw new $RangeError$2(INVALID_SIZE);
	  return new SetRecord(obj, intSize);
	};

	var aSet$6 = aSet$7;
	var SetHelpers$2 = setHelpers;
	var clone$2 = setClone;
	var size$4 = setSize;
	var getSetRecord$6 = getSetRecord$7;
	var iterateSet$2 = setIterate;
	var iterateSimple$5 = iterateSimple$7;

	var has$4 = SetHelpers$2.has;
	var remove$1 = SetHelpers$2.remove;

	// `Set.prototype.difference` method
	// https://github.com/tc39/proposal-set-methods
	var setDifference = function difference(other) {
	  var O = aSet$6(this);
	  var otherRec = getSetRecord$6(other);
	  var result = clone$2(O);
	  if (size$4(O) <= otherRec.size) iterateSet$2(O, function (e) {
	    if (otherRec.includes(e)) remove$1(result, e);
	  });
	  else iterateSimple$5(otherRec.getIterator(), function (e) {
	    if (has$4(result, e)) remove$1(result, e);
	  });
	  return result;
	};

	var getBuiltIn$1 = getBuiltIn$5;

	var createSetLike = function (size) {
	  return {
	    size: size,
	    has: function () {
	      return false;
	    },
	    keys: function () {
	      return {
	        next: function () {
	          return { done: true };
	        }
	      };
	    }
	  };
	};

	var createSetLikeWithInfinitySize = function (size) {
	  return {
	    size: size,
	    has: function () {
	      return true;
	    },
	    keys: function () {
	      throw new Error('e');
	    }
	  };
	};

	var setMethodAcceptSetLike$7 = function (name, callback) {
	  var Set = getBuiltIn$1('Set');
	  try {
	    new Set()[name](createSetLike(0));
	    try {
	      // late spec change, early WebKit ~ Safari 17 implementation does not pass it
	      // https://github.com/tc39/proposal-set-methods/pull/88
	      // also covered engines with
	      // https://bugs.webkit.org/show_bug.cgi?id=272679
	      new Set()[name](createSetLike(-1));
	      return false;
	    } catch (error2) {
	      if (!callback) return true;
	      // early V8 implementation bug
	      // https://issues.chromium.org/issues/351332634
	      try {
	        new Set()[name](createSetLikeWithInfinitySize(-Infinity));
	        return false;
	      } catch (error) {
	        var set = new Set();
	        set.add(1);
	        set.add(2);
	        return callback(set[name](createSetLikeWithInfinitySize(Infinity)));
	      }
	    }
	  } catch (error) {
	    return false;
	  }
	};

	var $$l = _export;
	var difference = setDifference;
	var fails$8 = fails$l;
	var setMethodAcceptSetLike$6 = setMethodAcceptSetLike$7;

	var SET_LIKE_INCORRECT_BEHAVIOR = !setMethodAcceptSetLike$6('difference', function (result) {
	  return result.size === 0;
	});

	var FORCED$2 = SET_LIKE_INCORRECT_BEHAVIOR || fails$8(function () {
	  // https://bugs.webkit.org/show_bug.cgi?id=288595
	  var setLike = {
	    size: 1,
	    has: function () { return true; },
	    keys: function () {
	      var index = 0;
	      return {
	        next: function () {
	          var done = index++ > 1;
	          if (baseSet.has(1)) baseSet.clear();
	          return { done: done, value: 2 };
	        }
	      };
	    }
	  };
	  // eslint-disable-next-line es/no-set -- testing
	  var baseSet = new Set([1, 2, 3, 4]);
	  // eslint-disable-next-line es/no-set-prototype-difference -- testing
	  return baseSet.difference(setLike).size !== 3;
	});

	// `Set.prototype.difference` method
	// https://tc39.es/ecma262/#sec-set.prototype.difference
	$$l({ target: 'Set', proto: true, real: true, forced: FORCED$2 }, {
	  difference: difference
	});

	var aSet$5 = aSet$7;
	var SetHelpers$1 = setHelpers;
	var size$3 = setSize;
	var getSetRecord$5 = getSetRecord$7;
	var iterateSet$1 = setIterate;
	var iterateSimple$4 = iterateSimple$7;

	var Set$1 = SetHelpers$1.Set;
	var add$2 = SetHelpers$1.add;
	var has$3 = SetHelpers$1.has;

	// `Set.prototype.intersection` method
	// https://github.com/tc39/proposal-set-methods
	var setIntersection = function intersection(other) {
	  var O = aSet$5(this);
	  var otherRec = getSetRecord$5(other);
	  var result = new Set$1();

	  if (size$3(O) > otherRec.size) {
	    iterateSimple$4(otherRec.getIterator(), function (e) {
	      if (has$3(O, e)) add$2(result, e);
	    });
	  } else {
	    iterateSet$1(O, function (e) {
	      if (otherRec.includes(e)) add$2(result, e);
	    });
	  }

	  return result;
	};

	var $$k = _export;
	var fails$7 = fails$l;
	var intersection = setIntersection;
	var setMethodAcceptSetLike$5 = setMethodAcceptSetLike$7;

	var INCORRECT$3 = !setMethodAcceptSetLike$5('intersection', function (result) {
	  return result.size === 2 && result.has(1) && result.has(2);
	}) || fails$7(function () {
	  // eslint-disable-next-line es/no-array-from, es/no-set, es/no-set-prototype-intersection -- testing
	  return String(Array.from(new Set([1, 2, 3]).intersection(new Set([3, 2])))) !== '3,2';
	});

	// `Set.prototype.intersection` method
	// https://tc39.es/ecma262/#sec-set.prototype.intersection
	$$k({ target: 'Set', proto: true, real: true, forced: INCORRECT$3 }, {
	  intersection: intersection
	});

	var aSet$4 = aSet$7;
	var has$2 = setHelpers.has;
	var size$2 = setSize;
	var getSetRecord$4 = getSetRecord$7;
	var iterateSet = setIterate;
	var iterateSimple$3 = iterateSimple$7;
	var iteratorClose$5 = iteratorClose$d;

	// `Set.prototype.isDisjointFrom` method
	// https://tc39.github.io/proposal-set-methods/#Set.prototype.isDisjointFrom
	var setIsDisjointFrom = function isDisjointFrom(other) {
	  var O = aSet$4(this);
	  var otherRec = getSetRecord$4(other);
	  if (size$2(O) <= otherRec.size) return iterateSet(O, function (e) {
	    if (otherRec.includes(e)) return false;
	  }, true) !== false;
	  var iterator = otherRec.getIterator();
	  return iterateSimple$3(iterator, function (e) {
	    if (has$2(O, e)) return iteratorClose$5(iterator, 'normal', false);
	  }) !== false;
	};

	var $$j = _export;
	var isDisjointFrom = setIsDisjointFrom;
	var setMethodAcceptSetLike$4 = setMethodAcceptSetLike$7;

	var INCORRECT$2 = !setMethodAcceptSetLike$4('isDisjointFrom', function (result) {
	  return !result;
	});

	// `Set.prototype.isDisjointFrom` method
	// https://tc39.es/ecma262/#sec-set.prototype.isdisjointfrom
	$$j({ target: 'Set', proto: true, real: true, forced: INCORRECT$2 }, {
	  isDisjointFrom: isDisjointFrom
	});

	var aSet$3 = aSet$7;
	var size$1 = setSize;
	var iterate$5 = setIterate;
	var getSetRecord$3 = getSetRecord$7;

	// `Set.prototype.isSubsetOf` method
	// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSubsetOf
	var setIsSubsetOf = function isSubsetOf(other) {
	  var O = aSet$3(this);
	  var otherRec = getSetRecord$3(other);
	  if (size$1(O) > otherRec.size) return false;
	  return iterate$5(O, function (e) {
	    if (!otherRec.includes(e)) return false;
	  }, true) !== false;
	};

	var $$i = _export;
	var isSubsetOf = setIsSubsetOf;
	var setMethodAcceptSetLike$3 = setMethodAcceptSetLike$7;

	var INCORRECT$1 = !setMethodAcceptSetLike$3('isSubsetOf', function (result) {
	  return result;
	});

	// `Set.prototype.isSubsetOf` method
	// https://tc39.es/ecma262/#sec-set.prototype.issubsetof
	$$i({ target: 'Set', proto: true, real: true, forced: INCORRECT$1 }, {
	  isSubsetOf: isSubsetOf
	});

	var aSet$2 = aSet$7;
	var has$1 = setHelpers.has;
	var size = setSize;
	var getSetRecord$2 = getSetRecord$7;
	var iterateSimple$2 = iterateSimple$7;
	var iteratorClose$4 = iteratorClose$d;

	// `Set.prototype.isSupersetOf` method
	// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSupersetOf
	var setIsSupersetOf = function isSupersetOf(other) {
	  var O = aSet$2(this);
	  var otherRec = getSetRecord$2(other);
	  if (size(O) < otherRec.size) return false;
	  var iterator = otherRec.getIterator();
	  return iterateSimple$2(iterator, function (e) {
	    if (!has$1(O, e)) return iteratorClose$4(iterator, 'normal', false);
	  }) !== false;
	};

	var $$h = _export;
	var isSupersetOf = setIsSupersetOf;
	var setMethodAcceptSetLike$2 = setMethodAcceptSetLike$7;

	var INCORRECT = !setMethodAcceptSetLike$2('isSupersetOf', function (result) {
	  return !result;
	});

	// `Set.prototype.isSupersetOf` method
	// https://tc39.es/ecma262/#sec-set.prototype.issupersetof
	$$h({ target: 'Set', proto: true, real: true, forced: INCORRECT }, {
	  isSupersetOf: isSupersetOf
	});

	var aSet$1 = aSet$7;
	var SetHelpers = setHelpers;
	var clone$1 = setClone;
	var getSetRecord$1 = getSetRecord$7;
	var iterateSimple$1 = iterateSimple$7;

	var add$1 = SetHelpers.add;
	var has = SetHelpers.has;
	var remove = SetHelpers.remove;

	// `Set.prototype.symmetricDifference` method
	// https://github.com/tc39/proposal-set-methods
	var setSymmetricDifference = function symmetricDifference(other) {
	  var O = aSet$1(this);
	  var keysIter = getSetRecord$1(other).getIterator();
	  var result = clone$1(O);
	  iterateSimple$1(keysIter, function (e) {
	    if (has(O, e)) remove(result, e);
	    else add$1(result, e);
	  });
	  return result;
	};

	// Should get iterator record of a set-like object before cloning this
	// https://bugs.webkit.org/show_bug.cgi?id=289430
	var setMethodGetKeysBeforeCloningDetection = function (METHOD_NAME) {
	  try {
	    // eslint-disable-next-line es/no-set -- needed for test
	    var baseSet = new Set();
	    var setLike = {
	      size: 0,
	      has: function () { return true; },
	      keys: function () {
	        // eslint-disable-next-line es/no-object-defineproperty -- needed for test
	        return Object.defineProperty({}, 'next', {
	          get: function () {
	            baseSet.clear();
	            baseSet.add(4);
	            return function () {
	              return { done: true };
	            };
	          }
	        });
	      }
	    };
	    var result = baseSet[METHOD_NAME](setLike);

	    return result.size !== 1 || result.values().next().value !== 4;
	  } catch (error) {
	    return false;
	  }
	};

	var $$g = _export;
	var symmetricDifference = setSymmetricDifference;
	var setMethodGetKeysBeforeCloning$1 = setMethodGetKeysBeforeCloningDetection;
	var setMethodAcceptSetLike$1 = setMethodAcceptSetLike$7;

	var FORCED$1 = !setMethodAcceptSetLike$1('symmetricDifference') || !setMethodGetKeysBeforeCloning$1('symmetricDifference');

	// `Set.prototype.symmetricDifference` method
	// https://tc39.es/ecma262/#sec-set.prototype.symmetricdifference
	$$g({ target: 'Set', proto: true, real: true, forced: FORCED$1 }, {
	  symmetricDifference: symmetricDifference
	});

	var aSet = aSet$7;
	var add = setHelpers.add;
	var clone = setClone;
	var getSetRecord = getSetRecord$7;
	var iterateSimple = iterateSimple$7;

	// `Set.prototype.union` method
	// https://github.com/tc39/proposal-set-methods
	var setUnion = function union(other) {
	  var O = aSet(this);
	  var keysIter = getSetRecord(other).getIterator();
	  var result = clone(O);
	  iterateSimple(keysIter, function (it) {
	    add(result, it);
	  });
	  return result;
	};

	var $$f = _export;
	var union = setUnion;
	var setMethodGetKeysBeforeCloning = setMethodGetKeysBeforeCloningDetection;
	var setMethodAcceptSetLike = setMethodAcceptSetLike$7;

	var FORCED = !setMethodAcceptSetLike('union') || !setMethodGetKeysBeforeCloning('union');

	// `Set.prototype.union` method
	// https://tc39.es/ecma262/#sec-set.prototype.union
	$$f({ target: 'Set', proto: true, real: true, forced: FORCED }, {
	  union: union
	});

	var classof$5 = classof$7;

	var $String$2 = String;

	var toString$4 = function (argument) {
	  if (classof$5(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
	  return $String$2(argument);
	};

	var uncurryThis$c = functionUncurryThis;
	var hasOwn$5 = hasOwnProperty_1;

	var $SyntaxError = SyntaxError;
	var $parseInt = parseInt;
	var fromCharCode = String.fromCharCode;
	var at$2 = uncurryThis$c(''.charAt);
	var slice$2 = uncurryThis$c(''.slice);
	var exec$2 = uncurryThis$c(/./.exec);

	var codePoints = {
	  '\\"': '"',
	  '\\\\': '\\',
	  '\\/': '/',
	  '\\b': '\b',
	  '\\f': '\f',
	  '\\n': '\n',
	  '\\r': '\r',
	  '\\t': '\t'
	};

	var IS_4_HEX_DIGITS = /^[\da-f]{4}$/i;
	// eslint-disable-next-line regexp/no-control-character -- safe
	var IS_C0_CONTROL_CODE = /^[\u0000-\u001F]$/;

	var parseJsonString = function (source, i) {
	  var unterminated = true;
	  var value = '';
	  while (i < source.length) {
	    var chr = at$2(source, i);
	    if (chr === '\\') {
	      var twoChars = slice$2(source, i, i + 2);
	      if (hasOwn$5(codePoints, twoChars)) {
	        value += codePoints[twoChars];
	        i += 2;
	      } else if (twoChars === '\\u') {
	        i += 2;
	        var fourHexDigits = slice$2(source, i, i + 4);
	        if (!exec$2(IS_4_HEX_DIGITS, fourHexDigits)) throw new $SyntaxError('Bad Unicode escape at: ' + i);
	        value += fromCharCode($parseInt(fourHexDigits, 16));
	        i += 4;
	      } else throw new $SyntaxError('Unknown escape sequence: "' + twoChars + '"');
	    } else if (chr === '"') {
	      unterminated = false;
	      i++;
	      break;
	    } else {
	      if (exec$2(IS_C0_CONTROL_CODE, chr)) throw new $SyntaxError('Bad control character in string literal at: ' + i);
	      value += chr;
	      i++;
	    }
	  }
	  if (unterminated) throw new $SyntaxError('Unterminated string at: ' + i);
	  return { value: value, end: i };
	};

	var $$e = _export;
	var DESCRIPTORS$4 = descriptors;
	var globalThis$m = globalThis_1;
	var getBuiltIn = getBuiltIn$5;
	var uncurryThis$b = functionUncurryThis;
	var call$4 = functionCall;
	var isCallable$3 = isCallable$i;
	var isObject$4 = isObject$b;
	var isArray = isArray$2;
	var hasOwn$4 = hasOwnProperty_1;
	var toString$3 = toString$4;
	var lengthOfArrayLike$3 = lengthOfArrayLike$7;
	var createProperty = createProperty$2;
	var fails$6 = fails$l;
	var parseJSONString = parseJsonString;
	var NATIVE_SYMBOL = symbolConstructorDetection;

	var JSON$1 = globalThis$m.JSON;
	var Number = globalThis$m.Number;
	var SyntaxError$3 = globalThis$m.SyntaxError;
	var nativeParse = JSON$1 && JSON$1.parse;
	var enumerableOwnProperties = getBuiltIn('Object', 'keys');
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var at$1 = uncurryThis$b(''.charAt);
	var slice$1 = uncurryThis$b(''.slice);
	var exec$1 = uncurryThis$b(/./.exec);
	var push$2 = uncurryThis$b([].push);

	var IS_DIGIT = /^\d$/;
	var IS_NON_ZERO_DIGIT = /^[1-9]$/;
	var IS_NUMBER_START = /^[\d-]$/;
	var IS_WHITESPACE = /^[\t\n\r ]$/;

	var PRIMITIVE = 0;
	var OBJECT = 1;

	var $parse = function (source, reviver) {
	  source = toString$3(source);
	  var context = new Context(source, 0);
	  var root = context.parse();
	  var value = root.value;
	  var endIndex = context.skip(IS_WHITESPACE, root.end);
	  if (endIndex < source.length) {
	    throw new SyntaxError$3('Unexpected extra character: "' + at$1(source, endIndex) + '" after the parsed data at: ' + endIndex);
	  }
	  return isCallable$3(reviver) ? internalize({ '': value }, '', reviver, root) : value;
	};

	var internalize = function (holder, name, reviver, node) {
	  var val = holder[name];
	  var unmodified = node && val === node.value;
	  var context = unmodified && typeof node.source == 'string' ? { source: node.source } : {};
	  var elementRecordsLen, keys, len, i, P;
	  if (isObject$4(val)) {
	    var nodeIsArray = isArray(val);
	    var nodes = unmodified ? node.nodes : nodeIsArray ? [] : {};
	    if (nodeIsArray) {
	      elementRecordsLen = nodes.length;
	      len = lengthOfArrayLike$3(val);
	      for (i = 0; i < len; i++) {
	        internalizeProperty(val, i, internalize(val, '' + i, reviver, i < elementRecordsLen ? nodes[i] : undefined));
	      }
	    } else {
	      keys = enumerableOwnProperties(val);
	      len = lengthOfArrayLike$3(keys);
	      for (i = 0; i < len; i++) {
	        P = keys[i];
	        internalizeProperty(val, P, internalize(val, P, reviver, hasOwn$4(nodes, P) ? nodes[P] : undefined));
	      }
	    }
	  }
	  return call$4(reviver, holder, name, val, context);
	};

	var internalizeProperty = function (object, key, value) {
	  if (DESCRIPTORS$4) {
	    var descriptor = getOwnPropertyDescriptor(object, key);
	    if (descriptor && !descriptor.configurable) return;
	  }
	  if (value === undefined) delete object[key];
	  else createProperty(object, key, value);
	};

	var Node = function (value, end, source, nodes) {
	  this.value = value;
	  this.end = end;
	  this.source = source;
	  this.nodes = nodes;
	};

	var Context = function (source, index) {
	  this.source = source;
	  this.index = index;
	};

	// https://www.json.org/json-en.html
	Context.prototype = {
	  fork: function (nextIndex) {
	    return new Context(this.source, nextIndex);
	  },
	  parse: function () {
	    var source = this.source;
	    var i = this.skip(IS_WHITESPACE, this.index);
	    var fork = this.fork(i);
	    var chr = at$1(source, i);
	    if (exec$1(IS_NUMBER_START, chr)) return fork.number();
	    switch (chr) {
	      case '{':
	        return fork.object();
	      case '[':
	        return fork.array();
	      case '"':
	        return fork.string();
	      case 't':
	        return fork.keyword(true);
	      case 'f':
	        return fork.keyword(false);
	      case 'n':
	        return fork.keyword(null);
	    } throw new SyntaxError$3('Unexpected character: "' + chr + '" at: ' + i);
	  },
	  node: function (type, value, start, end, nodes) {
	    return new Node(value, end, type ? null : slice$1(this.source, start, end), nodes);
	  },
	  object: function () {
	    var source = this.source;
	    var i = this.index + 1;
	    var expectKeypair = false;
	    var object = {};
	    var nodes = {};
	    while (i < source.length) {
	      i = this.until(['"', '}'], i);
	      if (at$1(source, i) === '}' && !expectKeypair) {
	        i++;
	        break;
	      }
	      // Parsing the key
	      var result = this.fork(i).string();
	      var key = result.value;
	      i = result.end;
	      i = this.until([':'], i) + 1;
	      // Parsing value
	      i = this.skip(IS_WHITESPACE, i);
	      result = this.fork(i).parse();
	      createProperty(nodes, key, result);
	      createProperty(object, key, result.value);
	      i = this.until([',', '}'], result.end);
	      var chr = at$1(source, i);
	      if (chr === ',') {
	        expectKeypair = true;
	        i++;
	      } else if (chr === '}') {
	        i++;
	        break;
	      }
	    }
	    return this.node(OBJECT, object, this.index, i, nodes);
	  },
	  array: function () {
	    var source = this.source;
	    var i = this.index + 1;
	    var expectElement = false;
	    var array = [];
	    var nodes = [];
	    while (i < source.length) {
	      i = this.skip(IS_WHITESPACE, i);
	      if (at$1(source, i) === ']' && !expectElement) {
	        i++;
	        break;
	      }
	      var result = this.fork(i).parse();
	      push$2(nodes, result);
	      push$2(array, result.value);
	      i = this.until([',', ']'], result.end);
	      if (at$1(source, i) === ',') {
	        expectElement = true;
	        i++;
	      } else if (at$1(source, i) === ']') {
	        i++;
	        break;
	      }
	    }
	    return this.node(OBJECT, array, this.index, i, nodes);
	  },
	  string: function () {
	    var index = this.index;
	    var parsed = parseJSONString(this.source, this.index + 1);
	    return this.node(PRIMITIVE, parsed.value, index, parsed.end);
	  },
	  number: function () {
	    var source = this.source;
	    var startIndex = this.index;
	    var i = startIndex;
	    if (at$1(source, i) === '-') i++;
	    if (at$1(source, i) === '0') i++;
	    else if (exec$1(IS_NON_ZERO_DIGIT, at$1(source, i))) i = this.skip(IS_DIGIT, i + 1);
	    else throw new SyntaxError$3('Failed to parse number at: ' + i);
	    if (at$1(source, i) === '.') i = this.skip(IS_DIGIT, i + 1);
	    if (at$1(source, i) === 'e' || at$1(source, i) === 'E') {
	      i++;
	      if (at$1(source, i) === '+' || at$1(source, i) === '-') i++;
	      var exponentStartIndex = i;
	      i = this.skip(IS_DIGIT, i);
	      if (exponentStartIndex === i) throw new SyntaxError$3("Failed to parse number's exponent value at: " + i);
	    }
	    return this.node(PRIMITIVE, Number(slice$1(source, startIndex, i)), startIndex, i);
	  },
	  keyword: function (value) {
	    var keyword = '' + value;
	    var index = this.index;
	    var endIndex = index + keyword.length;
	    if (slice$1(this.source, index, endIndex) !== keyword) throw new SyntaxError$3('Failed to parse value at: ' + index);
	    return this.node(PRIMITIVE, value, index, endIndex);
	  },
	  skip: function (regex, i) {
	    var source = this.source;
	    for (; i < source.length; i++) if (!exec$1(regex, at$1(source, i))) break;
	    return i;
	  },
	  until: function (array, i) {
	    i = this.skip(IS_WHITESPACE, i);
	    var chr = at$1(this.source, i);
	    for (var j = 0; j < array.length; j++) if (array[j] === chr) return i;
	    throw new SyntaxError$3('Unexpected character: "' + chr + '" at: ' + i);
	  }
	};

	var NO_SOURCE_SUPPORT = fails$6(function () {
	  var unsafeInt = '9007199254740993';
	  var source;
	  nativeParse(unsafeInt, function (key, value, context) {
	    source = context.source;
	  });
	  return source !== unsafeInt;
	});

	var PROPER_BASE_PARSE = NATIVE_SYMBOL && !fails$6(function () {
	  // Safari 9 bug
	  return 1 / nativeParse('-0 \t') !== -Infinity;
	});

	// `JSON.parse` method
	// https://tc39.es/ecma262/#sec-json.parse
	// https://github.com/tc39/proposal-json-parse-with-source
	$$e({ target: 'JSON', stat: true, forced: NO_SOURCE_SUPPORT }, {
	  parse: function parse(text, reviver) {
	    return PROPER_BASE_PARSE && !isCallable$3(reviver) ? nativeParse(text) : $parse(text, reviver);
	  }
	});

	var globalThis$l = globalThis_1;

	var path$1 = globalThis$l;

	var wellKnownSymbolWrapped = {};

	var wellKnownSymbol$2 = wellKnownSymbol$b;

	wellKnownSymbolWrapped.f = wellKnownSymbol$2;

	var path = path$1;
	var hasOwn$3 = hasOwnProperty_1;
	var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
	var defineProperty = objectDefineProperty.f;

	var wellKnownSymbolDefine = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!hasOwn$3(Symbol, NAME)) defineProperty(Symbol, NAME, {
	    value: wrappedWellKnownSymbolModule.f(NAME)
	  });
	};

	var defineWellKnownSymbol = wellKnownSymbolDefine;

	// `Symbol.metadata` well-known symbol
	// https://github.com/tc39/proposal-decorators
	defineWellKnownSymbol('metadata');

	var $TypeError$8 = TypeError;

	var validateArgumentsLength$4 = function (passed, required) {
	  if (passed < required) throw new $TypeError$8('Not enough arguments');
	  return passed;
	};

	var defineBuiltIn$2 = defineBuiltIn$6;
	var uncurryThis$a = functionUncurryThis;
	var toString$2 = toString$4;
	var validateArgumentsLength$3 = validateArgumentsLength$4;

	var $URLSearchParams$1 = URLSearchParams;
	var URLSearchParamsPrototype$2 = $URLSearchParams$1.prototype;
	var append = uncurryThis$a(URLSearchParamsPrototype$2.append);
	var $delete = uncurryThis$a(URLSearchParamsPrototype$2['delete']);
	var forEach$1 = uncurryThis$a(URLSearchParamsPrototype$2.forEach);
	var push$1 = uncurryThis$a([].push);
	var params$1 = new $URLSearchParams$1('a=1&a=2&b=3');

	params$1['delete']('a', 1);
	// `undefined` case is a Chromium 117 bug
	// https://bugs.chromium.org/p/v8/issues/detail?id=14222
	params$1['delete']('b', undefined);

	if (params$1 + '' !== 'a=2') {
	  defineBuiltIn$2(URLSearchParamsPrototype$2, 'delete', function (name /* , value */) {
	    var length = arguments.length;
	    var $value = length < 2 ? undefined : arguments[1];
	    if (length && $value === undefined) return $delete(this, name);
	    var entries = [];
	    forEach$1(this, function (v, k) { // also validates `this`
	      push$1(entries, { key: k, value: v });
	    });
	    validateArgumentsLength$3(length, 1);
	    var key = toString$2(name);
	    var value = toString$2($value);
	    var index = 0;
	    var dindex = 0;
	    var found = false;
	    var entriesLength = entries.length;
	    var entry;
	    while (index < entriesLength) {
	      entry = entries[index++];
	      if (found || entry.key === key) {
	        found = true;
	        $delete(this, entry.key);
	      } else dindex++;
	    }
	    while (dindex < entriesLength) {
	      entry = entries[dindex++];
	      if (!(entry.key === key && entry.value === value)) append(this, entry.key, entry.value);
	    }
	  }, { enumerable: true, unsafe: true });
	}

	var defineBuiltIn$1 = defineBuiltIn$6;
	var uncurryThis$9 = functionUncurryThis;
	var toString$1 = toString$4;
	var validateArgumentsLength$2 = validateArgumentsLength$4;

	var $URLSearchParams = URLSearchParams;
	var URLSearchParamsPrototype$1 = $URLSearchParams.prototype;
	var getAll = uncurryThis$9(URLSearchParamsPrototype$1.getAll);
	var $has = uncurryThis$9(URLSearchParamsPrototype$1.has);
	var params = new $URLSearchParams('a=1');

	// `undefined` case is a Chromium 117 bug
	// https://bugs.chromium.org/p/v8/issues/detail?id=14222
	if (params.has('a', 2) || !params.has('a', undefined)) {
	  defineBuiltIn$1(URLSearchParamsPrototype$1, 'has', function has(name /* , value */) {
	    var length = arguments.length;
	    var $value = length < 2 ? undefined : arguments[1];
	    if (length && $value === undefined) return $has(this, name);
	    var values = getAll(this, name); // also validates `this`
	    validateArgumentsLength$2(length, 1);
	    var value = toString$1($value);
	    var index = 0;
	    while (index < values.length) {
	      if (values[index++] === value) return true;
	    } return false;
	  }, { enumerable: true, unsafe: true });
	}

	var DESCRIPTORS$3 = descriptors;
	var uncurryThis$8 = functionUncurryThis;
	var defineBuiltInAccessor$3 = defineBuiltInAccessor$5;

	var URLSearchParamsPrototype = URLSearchParams.prototype;
	var forEach = uncurryThis$8(URLSearchParamsPrototype.forEach);

	// `URLSearchParams.prototype.size` getter
	// https://github.com/whatwg/url/pull/734
	if (DESCRIPTORS$3 && !('size' in URLSearchParamsPrototype)) {
	  defineBuiltInAccessor$3(URLSearchParamsPrototype, 'size', {
	    get: function size() {
	      var count = 0;
	      forEach(this, function () { count++; });
	      return count;
	    },
	    configurable: true,
	    enumerable: true
	  });
	}

	// eslint-disable-next-line es/no-typed-arrays -- safe
	var arrayBufferBasicDetection = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

	var globalThis$k = globalThis_1;
	var uncurryThisAccessor$2 = functionUncurryThisAccessor;
	var classof$4 = classofRaw$2;

	var ArrayBuffer$2 = globalThis$k.ArrayBuffer;
	var TypeError$3 = globalThis$k.TypeError;

	// Includes
	// - Perform ? RequireInternalSlot(O, [[ArrayBufferData]]).
	// - If IsSharedArrayBuffer(O) is true, throw a TypeError exception.
	var arrayBufferByteLength$2 = ArrayBuffer$2 && uncurryThisAccessor$2(ArrayBuffer$2.prototype, 'byteLength', 'get') || function (O) {
	  if (classof$4(O) !== 'ArrayBuffer') throw new TypeError$3('ArrayBuffer expected');
	  return O.byteLength;
	};

	var globalThis$j = globalThis_1;
	var NATIVE_ARRAY_BUFFER$1 = arrayBufferBasicDetection;
	var arrayBufferByteLength$1 = arrayBufferByteLength$2;

	var DataView$2 = globalThis$j.DataView;

	var arrayBufferIsDetached = function (O) {
	  if (!NATIVE_ARRAY_BUFFER$1 || arrayBufferByteLength$1(O) !== 0) return false;
	  try {
	    // eslint-disable-next-line no-new -- thrower
	    new DataView$2(O);
	    return false;
	  } catch (error) {
	    return true;
	  }
	};

	var DESCRIPTORS$2 = descriptors;
	var defineBuiltInAccessor$2 = defineBuiltInAccessor$5;
	var isDetached$1 = arrayBufferIsDetached;

	var ArrayBufferPrototype$1 = ArrayBuffer.prototype;

	// `ArrayBuffer.prototype.detached` getter
	// https://tc39.es/ecma262/#sec-get-arraybuffer.prototype.detached
	if (DESCRIPTORS$2 && !('detached' in ArrayBufferPrototype$1)) {
	  defineBuiltInAccessor$2(ArrayBufferPrototype$1, 'detached', {
	    configurable: true,
	    get: function detached() {
	      return isDetached$1(this);
	    }
	  });
	}

	var toIntegerOrInfinity$2 = toIntegerOrInfinity$6;
	var toLength = toLength$2;

	var $RangeError$1 = RangeError;

	// `ToIndex` abstract operation
	// https://tc39.es/ecma262/#sec-toindex
	var toIndex$1 = function (it) {
	  if (it === undefined) return 0;
	  var number = toIntegerOrInfinity$2(it);
	  var length = toLength(number);
	  if (number !== length) throw new $RangeError$1('Wrong length or index');
	  return length;
	};

	var isDetached = arrayBufferIsDetached;

	var $TypeError$7 = TypeError;

	var arrayBufferNotDetached = function (it) {
	  if (isDetached(it)) throw new $TypeError$7('ArrayBuffer is detached');
	  return it;
	};

	/* global Bun, Deno -- detection */
	var globalThis$i = globalThis_1;
	var userAgent$1 = environmentUserAgent;
	var classof$3 = classofRaw$2;

	var userAgentStartsWith = function (string) {
	  return userAgent$1.slice(0, string.length) === string;
	};

	var environment = (function () {
	  if (userAgentStartsWith('Bun/')) return 'BUN';
	  if (userAgentStartsWith('Cloudflare-Workers')) return 'CLOUDFLARE';
	  if (userAgentStartsWith('Deno/')) return 'DENO';
	  if (userAgentStartsWith('Node.js/')) return 'NODE';
	  if (globalThis$i.Bun && typeof Bun.version == 'string') return 'BUN';
	  if (globalThis$i.Deno && typeof Deno.version == 'object') return 'DENO';
	  if (classof$3(globalThis$i.process) === 'process') return 'NODE';
	  if (globalThis$i.window && globalThis$i.document) return 'BROWSER';
	  return 'REST';
	})();

	var ENVIRONMENT$2 = environment;

	var environmentIsNode = ENVIRONMENT$2 === 'NODE';

	var globalThis$h = globalThis_1;
	var IS_NODE$1 = environmentIsNode;

	var getBuiltInNodeModule$1 = function (name) {
	  if (IS_NODE$1) {
	    try {
	      return globalThis$h.process.getBuiltinModule(name);
	    } catch (error) { /* empty */ }
	    try {
	      // eslint-disable-next-line no-new-func -- safe
	      return Function('return require("' + name + '")')();
	    } catch (error) { /* empty */ }
	  }
	};

	var globalThis$g = globalThis_1;
	var fails$5 = fails$l;
	var V8 = environmentV8Version;
	var ENVIRONMENT$1 = environment;

	var structuredClone$2 = globalThis$g.structuredClone;

	var structuredCloneProperTransfer = !!structuredClone$2 && !fails$5(function () {
	  // prevent V8 ArrayBufferDetaching protector cell invalidation and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if ((ENVIRONMENT$1 === 'DENO' && V8 > 92) || (ENVIRONMENT$1 === 'NODE' && V8 > 94) || (ENVIRONMENT$1 === 'BROWSER' && V8 > 97)) return false;
	  var buffer = new ArrayBuffer(8);
	  var clone = structuredClone$2(buffer, { transfer: [buffer] });
	  return buffer.byteLength !== 0 || clone.byteLength !== 8;
	});

	var globalThis$f = globalThis_1;
	var getBuiltInNodeModule = getBuiltInNodeModule$1;
	var PROPER_STRUCTURED_CLONE_TRANSFER$1 = structuredCloneProperTransfer;

	var structuredClone$1 = globalThis$f.structuredClone;
	var $ArrayBuffer = globalThis$f.ArrayBuffer;
	var $MessageChannel = globalThis$f.MessageChannel;
	var detach = false;
	var WorkerThreads, channel$1, buffer, $detach;

	if (PROPER_STRUCTURED_CLONE_TRANSFER$1) {
	  detach = function (transferable) {
	    structuredClone$1(transferable, { transfer: [transferable] });
	  };
	} else if ($ArrayBuffer) try {
	  if (!$MessageChannel) {
	    WorkerThreads = getBuiltInNodeModule('worker_threads');
	    if (WorkerThreads) $MessageChannel = WorkerThreads.MessageChannel;
	  }

	  if ($MessageChannel) {
	    channel$1 = new $MessageChannel();
	    buffer = new $ArrayBuffer(2);

	    $detach = function (transferable) {
	      channel$1.port1.postMessage(null, [transferable]);
	    };

	    if (buffer.byteLength === 2) {
	      $detach(buffer);
	      if (buffer.byteLength === 0) detach = $detach;
	    }
	  }
	} catch (error) { /* empty */ }

	var detachTransferable$1 = detach;

	var globalThis$e = globalThis_1;
	var uncurryThis$7 = functionUncurryThis;
	var uncurryThisAccessor$1 = functionUncurryThisAccessor;
	var toIndex = toIndex$1;
	var notDetached$4 = arrayBufferNotDetached;
	var arrayBufferByteLength = arrayBufferByteLength$2;
	var detachTransferable = detachTransferable$1;
	var PROPER_STRUCTURED_CLONE_TRANSFER = structuredCloneProperTransfer;

	var structuredClone = globalThis$e.structuredClone;
	var ArrayBuffer$1 = globalThis$e.ArrayBuffer;
	var DataView$1 = globalThis$e.DataView;
	var min$1 = Math.min;
	var ArrayBufferPrototype = ArrayBuffer$1.prototype;
	var DataViewPrototype = DataView$1.prototype;
	var slice = uncurryThis$7(ArrayBufferPrototype.slice);
	var isResizable = uncurryThisAccessor$1(ArrayBufferPrototype, 'resizable', 'get');
	var maxByteLength = uncurryThisAccessor$1(ArrayBufferPrototype, 'maxByteLength', 'get');
	var getInt8 = uncurryThis$7(DataViewPrototype.getInt8);
	var setInt8 = uncurryThis$7(DataViewPrototype.setInt8);

	var arrayBufferTransfer = (PROPER_STRUCTURED_CLONE_TRANSFER || detachTransferable) && function (arrayBuffer, newLength, preserveResizability) {
	  var byteLength = arrayBufferByteLength(arrayBuffer);
	  var newByteLength = newLength === undefined ? byteLength : toIndex(newLength);
	  var fixedLength = !isResizable || !isResizable(arrayBuffer);
	  var newBuffer;
	  notDetached$4(arrayBuffer);
	  if (PROPER_STRUCTURED_CLONE_TRANSFER) {
	    arrayBuffer = structuredClone(arrayBuffer, { transfer: [arrayBuffer] });
	    if (byteLength === newByteLength && (preserveResizability || fixedLength)) return arrayBuffer;
	  }
	  if (byteLength >= newByteLength && (!preserveResizability || fixedLength)) {
	    newBuffer = slice(arrayBuffer, 0, newByteLength);
	  } else {
	    var options = preserveResizability && !fixedLength && maxByteLength ? { maxByteLength: maxByteLength(arrayBuffer) } : undefined;
	    newBuffer = new ArrayBuffer$1(newByteLength, options);
	    var a = new DataView$1(arrayBuffer);
	    var b = new DataView$1(newBuffer);
	    var copyLength = min$1(newByteLength, byteLength);
	    for (var i = 0; i < copyLength; i++) setInt8(b, i, getInt8(a, i));
	  }
	  if (!PROPER_STRUCTURED_CLONE_TRANSFER) detachTransferable(arrayBuffer);
	  return newBuffer;
	};

	var $$d = _export;
	var $transfer$1 = arrayBufferTransfer;

	// `ArrayBuffer.prototype.transfer` method
	// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfer
	if ($transfer$1) $$d({ target: 'ArrayBuffer', proto: true }, {
	  transfer: function transfer() {
	    return $transfer$1(this, arguments.length ? arguments[0] : undefined, true);
	  }
	});

	var $$c = _export;
	var $transfer = arrayBufferTransfer;

	// `ArrayBuffer.prototype.transferToFixedLength` method
	// https://tc39.es/proposal-arraybuffer-transfer/#sec-arraybuffer.prototype.transfertofixedlength
	if ($transfer) $$c({ target: 'ArrayBuffer', proto: true }, {
	  transferToFixedLength: function transferToFixedLength() {
	    return $transfer(this, arguments.length ? arguments[0] : undefined, false);
	  }
	});

	var $$b = _export;
	var call$3 = functionCall;
	var iterate$4 = iterate$8;
	var aCallable$4 = aCallable$d;
	var anObject$5 = anObject$j;
	var getIteratorDirect$4 = getIteratorDirect$9;
	var iteratorClose$3 = iteratorClose$d;
	var iteratorHelperWithoutClosingOnEarlyError$3 = iteratorHelperWithoutClosingOnEarlyError$7;

	var everyWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError$3('every', TypeError);

	// `Iterator.prototype.every` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.every
	$$b({ target: 'Iterator', proto: true, real: true, forced: everyWithoutClosingOnEarlyError }, {
	  every: function every(predicate) {
	    anObject$5(this);
	    try {
	      aCallable$4(predicate);
	    } catch (error) {
	      iteratorClose$3(this, 'throw', error);
	    }

	    if (everyWithoutClosingOnEarlyError) return call$3(everyWithoutClosingOnEarlyError, this, predicate);

	    var record = getIteratorDirect$4(this);
	    var counter = 0;
	    return !iterate$4(record, function (value, stop) {
	      if (!predicate(value, counter++)) return stop();
	    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
	  }
	});

	var $$a = _export;
	var call$2 = functionCall;
	var iterate$3 = iterate$8;
	var aCallable$3 = aCallable$d;
	var anObject$4 = anObject$j;
	var getIteratorDirect$3 = getIteratorDirect$9;
	var iteratorClose$2 = iteratorClose$d;
	var iteratorHelperWithoutClosingOnEarlyError$2 = iteratorHelperWithoutClosingOnEarlyError$7;

	var findWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError$2('find', TypeError);

	// `Iterator.prototype.find` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.find
	$$a({ target: 'Iterator', proto: true, real: true, forced: findWithoutClosingOnEarlyError }, {
	  find: function find(predicate) {
	    anObject$4(this);
	    try {
	      aCallable$3(predicate);
	    } catch (error) {
	      iteratorClose$2(this, 'throw', error);
	    }

	    if (findWithoutClosingOnEarlyError) return call$2(findWithoutClosingOnEarlyError, this, predicate);

	    var record = getIteratorDirect$3(this);
	    var counter = 0;
	    return iterate$3(record, function (value, stop) {
	      if (predicate(value, counter++)) return stop(value);
	    }, { IS_RECORD: true, INTERRUPTED: true }).result;
	  }
	});

	var NATIVE_BIND = functionBindNative;

	var FunctionPrototype = Function.prototype;
	var apply$3 = FunctionPrototype.apply;
	var call$1 = FunctionPrototype.call;

	// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
	var functionApply = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call$1.bind(apply$3) : function () {
	  return call$1.apply(apply$3, arguments);
	});

	var $$9 = _export;
	var iterate$2 = iterate$8;
	var aCallable$2 = aCallable$d;
	var anObject$3 = anObject$j;
	var getIteratorDirect$2 = getIteratorDirect$9;
	var iteratorClose$1 = iteratorClose$d;
	var iteratorHelperWithoutClosingOnEarlyError$1 = iteratorHelperWithoutClosingOnEarlyError$7;
	var apply$2 = functionApply;
	var fails$4 = fails$l;

	var $TypeError$6 = TypeError;

	// https://bugs.webkit.org/show_bug.cgi?id=291651
	var FAILS_ON_INITIAL_UNDEFINED = fails$4(function () {
	  // eslint-disable-next-line es/no-iterator-prototype-reduce, es/no-array-prototype-keys, array-callback-return -- required for testing
	  [].keys().reduce(function () { /* empty */ }, undefined);
	});

	var reduceWithoutClosingOnEarlyError = !FAILS_ON_INITIAL_UNDEFINED && iteratorHelperWithoutClosingOnEarlyError$1('reduce', $TypeError$6);

	// `Iterator.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.reduce
	$$9({ target: 'Iterator', proto: true, real: true, forced: FAILS_ON_INITIAL_UNDEFINED || reduceWithoutClosingOnEarlyError }, {
	  reduce: function reduce(reducer /* , initialValue */) {
	    anObject$3(this);
	    try {
	      aCallable$2(reducer);
	    } catch (error) {
	      iteratorClose$1(this, 'throw', error);
	    }

	    var noInitial = arguments.length < 2;
	    var accumulator = noInitial ? undefined : arguments[1];
	    if (reduceWithoutClosingOnEarlyError) {
	      return apply$2(reduceWithoutClosingOnEarlyError, this, noInitial ? [reducer] : [reducer, accumulator]);
	    }
	    var record = getIteratorDirect$2(this);
	    var counter = 0;
	    iterate$2(record, function (value) {
	      if (noInitial) {
	        noInitial = false;
	        accumulator = value;
	      } else {
	        accumulator = reducer(accumulator, value, counter);
	      }
	      counter++;
	    }, { IS_RECORD: true });
	    if (noInitial) throw new $TypeError$6('Reduce of empty iterator with no initial value');
	    return accumulator;
	  }
	});

	var $$8 = _export;
	var call = functionCall;
	var iterate$1 = iterate$8;
	var aCallable$1 = aCallable$d;
	var anObject$2 = anObject$j;
	var getIteratorDirect$1 = getIteratorDirect$9;
	var iteratorClose = iteratorClose$d;
	var iteratorHelperWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError$7;

	var someWithoutClosingOnEarlyError = iteratorHelperWithoutClosingOnEarlyError('some', TypeError);

	// `Iterator.prototype.some` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.some
	$$8({ target: 'Iterator', proto: true, real: true, forced: someWithoutClosingOnEarlyError }, {
	  some: function some(predicate) {
	    anObject$2(this);
	    try {
	      aCallable$1(predicate);
	    } catch (error) {
	      iteratorClose(this, 'throw', error);
	    }

	    if (someWithoutClosingOnEarlyError) return call(someWithoutClosingOnEarlyError, this, predicate);

	    var record = getIteratorDirect$1(this);
	    var counter = 0;
	    return iterate$1(record, function (value, stop) {
	      if (predicate(value, counter++)) return stop();
	    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
	  }
	});

	var $$7 = _export;
	var anObject$1 = anObject$j;
	var iterate = iterate$8;
	var getIteratorDirect = getIteratorDirect$9;

	var push = [].push;

	// `Iterator.prototype.toArray` method
	// https://tc39.es/ecma262/#sec-iterator.prototype.toarray
	$$7({ target: 'Iterator', proto: true, real: true }, {
	  toArray: function toArray() {
	    var result = [];
	    iterate(getIteratorDirect(anObject$1(this)), push, { that: result, IS_RECORD: true });
	    return result;
	  }
	});

	var globalThis$d = globalThis_1;
	var fails$3 = fails$l;

	// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
	var RegExp$1 = globalThis$d.RegExp;

	var FLAGS_GETTER_IS_CORRECT = !fails$3(function () {
	  var INDICES_SUPPORT = true;
	  try {
	    RegExp$1('.', 'd');
	  } catch (error) {
	    INDICES_SUPPORT = false;
	  }

	  var O = {};
	  // modern V8 bug
	  var calls = '';
	  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';

	  var addGetter = function (key, chr) {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty(O, key, { get: function () {
	      calls += chr;
	      return true;
	    } });
	  };

	  var pairs = {
	    dotAll: 's',
	    global: 'g',
	    ignoreCase: 'i',
	    multiline: 'm',
	    sticky: 'y'
	  };

	  if (INDICES_SUPPORT) pairs.hasIndices = 'd';

	  for (var key in pairs) addGetter(key, pairs[key]);

	  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	  var result = Object.getOwnPropertyDescriptor(RegExp$1.prototype, 'flags').get.call(O);

	  return result !== expected || calls !== expected;
	});

	var regexpFlagsDetection = { correct: FLAGS_GETTER_IS_CORRECT };

	var anObject = anObject$j;

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.hasIndices) result += 'd';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.unicodeSets) result += 'v';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var DESCRIPTORS$1 = descriptors;
	var defineBuiltInAccessor$1 = defineBuiltInAccessor$5;
	var regExpFlagsDetection = regexpFlagsDetection;
	var regExpFlagsGetterImplementation = regexpFlags;

	// `RegExp.prototype.flags` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	if (DESCRIPTORS$1 && !regExpFlagsDetection.correct) {
	  defineBuiltInAccessor$1(RegExp.prototype, 'flags', {
	    configurable: true,
	    get: regExpFlagsGetterImplementation
	  });

	  regExpFlagsDetection.correct = true;
	}

	var lengthOfArrayLike$2 = lengthOfArrayLike$7;

	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
	var arrayToReversed$1 = function (O, C) {
	  var len = lengthOfArrayLike$2(O);
	  var A = new C(len);
	  var k = 0;
	  for (; k < len; k++) A[k] = O[len - k - 1];
	  return A;
	};

	var isObject$3 = isObject$b;

	var isPossiblePrototype$1 = function (argument) {
	  return isObject$3(argument) || argument === null;
	};

	var isPossiblePrototype = isPossiblePrototype$1;

	var $String$1 = String;
	var $TypeError$5 = TypeError;

	var aPossiblePrototype$1 = function (argument) {
	  if (isPossiblePrototype(argument)) return argument;
	  throw new $TypeError$5("Can't set " + $String$1(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */
	var uncurryThisAccessor = functionUncurryThisAccessor;
	var isObject$2 = isObject$b;
	var requireObjectCoercible = requireObjectCoercible$3;
	var aPossiblePrototype = aPossiblePrototype$1;

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    requireObjectCoercible(O);
	    aPossiblePrototype(proto);
	    if (!isObject$2(O)) return O;
	    if (CORRECT_SETTER) setter(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var NATIVE_ARRAY_BUFFER = arrayBufferBasicDetection;
	var DESCRIPTORS = descriptors;
	var globalThis$c = globalThis_1;
	var isCallable$2 = isCallable$i;
	var isObject$1 = isObject$b;
	var hasOwn$2 = hasOwnProperty_1;
	var classof$2 = classof$7;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$6;
	var defineBuiltIn = defineBuiltIn$6;
	var defineBuiltInAccessor = defineBuiltInAccessor$5;
	var getPrototypeOf$1 = objectGetPrototypeOf;
	var setPrototypeOf$1 = objectSetPrototypeOf;
	var wellKnownSymbol$1 = wellKnownSymbol$b;
	var uid = uid$3;
	var InternalStateModule = internalState;

	var enforceInternalState = InternalStateModule.enforce;
	var getInternalState = InternalStateModule.get;
	var Int8Array$1 = globalThis$c.Int8Array;
	var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
	var Uint8ClampedArray = globalThis$c.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
	var TypedArray = Int8Array$1 && getPrototypeOf$1(Int8Array$1);
	var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf$1(Int8ArrayPrototype);
	var ObjectPrototype = Object.prototype;
	var TypeError$2 = globalThis$c.TypeError;

	var TO_STRING_TAG$1 = wellKnownSymbol$1('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf$1 && classof$2(globalThis$c.opera) !== 'Opera';
	var NAME, Constructor, Prototype;

	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var BigIntArrayConstructorsList = {
	  BigInt64Array: 8,
	  BigUint64Array: 8
	};

	var getTypedArrayConstructor$3 = function (it) {
	  var proto = getPrototypeOf$1(it);
	  if (!isObject$1(proto)) return;
	  var state = getInternalState(proto);
	  return (state && hasOwn$2(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor$3(proto);
	};

	var isTypedArray = function (it) {
	  if (!isObject$1(it)) return false;
	  var klass = classof$2(it);
	  return hasOwn$2(TypedArrayConstructorsList, klass)
	    || hasOwn$2(BigIntArrayConstructorsList, klass);
	};

	var aTypedArray$3 = function (it) {
	  if (isTypedArray(it)) return it;
	  throw new TypeError$2('Target is not a typed array');
	};

	var exportTypedArrayMethod$3 = function (KEY, property, forced, options) {
	  if (!DESCRIPTORS) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = globalThis$c[ARRAY];
	    if (TypedArrayConstructor && hasOwn$2(TypedArrayConstructor.prototype, KEY)) try {
	      delete TypedArrayConstructor.prototype[KEY];
	    } catch (error) {
	      // old WebKit bug - some methods are non-configurable
	      try {
	        TypedArrayConstructor.prototype[KEY] = property;
	      } catch (error2) { /* empty */ }
	    }
	  }
	  if (!TypedArrayPrototype[KEY] || forced) {
	    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
	  }
	};

	for (NAME in TypedArrayConstructorsList) {
	  Constructor = globalThis$c[NAME];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
	  else NATIVE_ARRAY_BUFFER_VIEWS = false;
	}

	for (NAME in BigIntArrayConstructorsList) {
	  Constructor = globalThis$c[NAME];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable$2(TypedArray) || TypedArray === Function.prototype) {
	  // eslint-disable-next-line no-shadow -- safe
	  TypedArray = function TypedArray() {
	    throw new TypeError$2('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
	    if (globalThis$c[NAME]) setPrototypeOf$1(globalThis$c[NAME], TypedArray);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
	  TypedArrayPrototype = TypedArray.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
	    if (globalThis$c[NAME]) setPrototypeOf$1(globalThis$c[NAME].prototype, TypedArrayPrototype);
	  }
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf$1(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
	  setPrototypeOf$1(Uint8ClampedArrayPrototype, TypedArrayPrototype);
	}

	if (DESCRIPTORS && !hasOwn$2(TypedArrayPrototype, TO_STRING_TAG$1)) {
	  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG$1, {
	    configurable: true,
	    get: function () {
	      return isObject$1(this) ? this[TYPED_ARRAY_TAG] : undefined;
	    }
	  });
	  for (NAME in TypedArrayConstructorsList) if (globalThis$c[NAME]) {
	    createNonEnumerableProperty$2(globalThis$c[NAME], TYPED_ARRAY_TAG, NAME);
	  }
	}

	var arrayBufferViewCore = {
	  aTypedArray: aTypedArray$3,
	  exportTypedArrayMethod: exportTypedArrayMethod$3,
	  getTypedArrayConstructor: getTypedArrayConstructor$3,
	  TypedArrayPrototype: TypedArrayPrototype
	};

	var arrayToReversed = arrayToReversed$1;
	var ArrayBufferViewCore$2 = arrayBufferViewCore;

	var aTypedArray$2 = ArrayBufferViewCore$2.aTypedArray;
	var exportTypedArrayMethod$2 = ArrayBufferViewCore$2.exportTypedArrayMethod;
	var getTypedArrayConstructor$2 = ArrayBufferViewCore$2.getTypedArrayConstructor;

	// `%TypedArray%.prototype.toReversed` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.toreversed
	exportTypedArrayMethod$2('toReversed', function toReversed() {
	  return arrayToReversed(aTypedArray$2(this), getTypedArrayConstructor$2(this));
	});

	var lengthOfArrayLike$1 = lengthOfArrayLike$7;

	var arrayFromConstructorAndList$1 = function (Constructor, list, $length) {
	  var index = 0;
	  var length = arguments.length > 2 ? $length : lengthOfArrayLike$1(list);
	  var result = new Constructor(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var ArrayBufferViewCore$1 = arrayBufferViewCore;
	var uncurryThis$6 = functionUncurryThis;
	var aCallable = aCallable$d;
	var arrayFromConstructorAndList = arrayFromConstructorAndList$1;

	var aTypedArray$1 = ArrayBufferViewCore$1.aTypedArray;
	var getTypedArrayConstructor$1 = ArrayBufferViewCore$1.getTypedArrayConstructor;
	var exportTypedArrayMethod$1 = ArrayBufferViewCore$1.exportTypedArrayMethod;
	var sort = uncurryThis$6(ArrayBufferViewCore$1.TypedArrayPrototype.sort);

	// `%TypedArray%.prototype.toSorted` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tosorted
	exportTypedArrayMethod$1('toSorted', function toSorted(compareFn) {
	  if (compareFn !== undefined) aCallable(compareFn);
	  var O = aTypedArray$1(this);
	  var A = arrayFromConstructorAndList(getTypedArrayConstructor$1(O), O);
	  return sort(A, compareFn);
	});

	var lengthOfArrayLike = lengthOfArrayLike$7;
	var toIntegerOrInfinity$1 = toIntegerOrInfinity$6;

	var $RangeError = RangeError;

	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
	var arrayWith$1 = function (O, C, index, value) {
	  var len = lengthOfArrayLike(O);
	  var relativeIndex = toIntegerOrInfinity$1(index);
	  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
	  if (actualIndex >= len || actualIndex < 0) throw new $RangeError('Incorrect index');
	  var A = new C(len);
	  var k = 0;
	  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
	  return A;
	};

	var classof$1 = classof$7;

	var isBigIntArray$1 = function (it) {
	  var klass = classof$1(it);
	  return klass === 'BigInt64Array' || klass === 'BigUint64Array';
	};

	var toPrimitive = toPrimitive$2;

	var $TypeError$4 = TypeError;

	// `ToBigInt` abstract operation
	// https://tc39.es/ecma262/#sec-tobigint
	var toBigInt$1 = function (argument) {
	  var prim = toPrimitive(argument, 'number');
	  if (typeof prim == 'number') throw new $TypeError$4("Can't convert number to bigint");
	  // eslint-disable-next-line es/no-bigint -- safe
	  return BigInt(prim);
	};

	var arrayWith = arrayWith$1;
	var ArrayBufferViewCore = arrayBufferViewCore;
	var isBigIntArray = isBigIntArray$1;
	var toIntegerOrInfinity = toIntegerOrInfinity$6;
	var toBigInt = toBigInt$1;

	var aTypedArray = ArrayBufferViewCore.aTypedArray;
	var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
	var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

	var PROPER_ORDER = function () {
	  try {
	    // eslint-disable-next-line no-throw-literal, es/no-typed-arrays, es/no-array-prototype-with -- required for testing
	    new Int8Array(1)['with'](2, { valueOf: function () { throw 8; } });
	  } catch (error) {
	    // some early implementations, like WebKit, does not follow the final semantic
	    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
	    return error === 8;
	  }
	}();

	// Bug in WebKit. It should truncate a negative fractional index to zero, but instead throws an error
	var THROW_ON_NEGATIVE_FRACTIONAL_INDEX = PROPER_ORDER && function () {
	  try {
	    // eslint-disable-next-line es/no-typed-arrays, es/no-array-prototype-with -- required for testing
	    new Int8Array(1)['with'](-0.5, 1);
	  } catch (error) {
	    return true;
	  }
	}();

	// `%TypedArray%.prototype.with` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.with
	exportTypedArrayMethod('with', { 'with': function (index, value) {
	  var O = aTypedArray(this);
	  var relativeIndex = toIntegerOrInfinity(index);
	  var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
	  return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
	} }['with'], !PROPER_ORDER || THROW_ON_NEGATIVE_FRACTIONAL_INDEX);

	var uncurryThis$5 = functionUncurryThis;

	var $Error$1 = Error;
	var replace = uncurryThis$5(''.replace);

	var TEST = (function (arg) { return String(new $Error$1(arg).stack); })('zxcasd');
	// eslint-disable-next-line redos/no-vulnerable, sonarjs/slow-regex -- safe
	var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
	var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

	var errorStackClear = function (stack, dropEntries) {
	  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error$1.prepareStackTrace) {
	    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
	  } return stack;
	};

	var fails$2 = fails$l;
	var createPropertyDescriptor$1 = createPropertyDescriptor$5;

	var errorStackInstallable = !fails$2(function () {
	  var error = new Error('a');
	  if (!('stack' in error)) return true;
	  // eslint-disable-next-line es/no-object-defineproperty -- safe
	  Object.defineProperty(error, 'stack', createPropertyDescriptor$1(1, 7));
	  return error.stack !== 7;
	});

	var createNonEnumerableProperty$1 = createNonEnumerableProperty$6;
	var clearErrorStack = errorStackClear;
	var ERROR_STACK_INSTALLABLE = errorStackInstallable;

	// non-standard V8
	// eslint-disable-next-line es/no-nonstandard-error-properties -- safe
	var captureStackTrace = Error.captureStackTrace;

	var errorStackInstall = function (error, C, stack, dropEntries) {
	  if (ERROR_STACK_INSTALLABLE) {
	    if (captureStackTrace) captureStackTrace(error, C);
	    else createNonEnumerableProperty$1(error, 'stack', clearErrorStack(stack, dropEntries));
	  }
	};

	var toString = toString$4;

	var normalizeStringArgument$1 = function (argument, $default) {
	  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
	};

	var $$6 = _export;
	var globalThis$b = globalThis_1;
	var isPrototypeOf = objectIsPrototypeOf;
	var getPrototypeOf = objectGetPrototypeOf;
	var setPrototypeOf = objectSetPrototypeOf;
	var copyConstructorProperties = copyConstructorProperties$2;
	var create = objectCreate;
	var createNonEnumerableProperty = createNonEnumerableProperty$6;
	var createPropertyDescriptor = createPropertyDescriptor$5;
	var installErrorStack = errorStackInstall;
	var normalizeStringArgument = normalizeStringArgument$1;
	var wellKnownSymbol = wellKnownSymbol$b;
	var fails$1 = fails$l;

	var NativeSuppressedError = globalThis$b.SuppressedError;
	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var $Error = Error;

	// https://github.com/oven-sh/bun/issues/9282
	var WRONG_ARITY = !!NativeSuppressedError && NativeSuppressedError.length !== 3;

	// https://github.com/oven-sh/bun/issues/9283
	var EXTRA_ARGS_SUPPORT = !!NativeSuppressedError && fails$1(function () {
	  return new NativeSuppressedError(1, 2, 3, { cause: 4 }).cause === 4;
	});

	var PATCH = WRONG_ARITY || EXTRA_ARGS_SUPPORT;

	var $SuppressedError = function SuppressedError(error, suppressed, message) {
	  var isInstance = isPrototypeOf(SuppressedErrorPrototype, this);
	  var that;
	  if (setPrototypeOf) {
	    that = PATCH && (!isInstance || getPrototypeOf(this) === SuppressedErrorPrototype)
	      ? new NativeSuppressedError()
	      : setPrototypeOf(new $Error(), isInstance ? getPrototypeOf(this) : SuppressedErrorPrototype);
	  } else {
	    that = isInstance ? this : create(SuppressedErrorPrototype);
	    createNonEnumerableProperty(that, TO_STRING_TAG, 'Error');
	  }
	  if (message !== undefined) createNonEnumerableProperty(that, 'message', normalizeStringArgument(message));
	  installErrorStack(that, $SuppressedError, that.stack, 1);
	  createNonEnumerableProperty(that, 'error', error);
	  createNonEnumerableProperty(that, 'suppressed', suppressed);
	  return that;
	};

	if (setPrototypeOf) setPrototypeOf($SuppressedError, $Error);
	else copyConstructorProperties($SuppressedError, $Error, { name: true });

	var SuppressedErrorPrototype = $SuppressedError.prototype = PATCH ? NativeSuppressedError.prototype : create($Error.prototype, {
	  constructor: createPropertyDescriptor(1, $SuppressedError),
	  message: createPropertyDescriptor(1, ''),
	  name: createPropertyDescriptor(1, 'SuppressedError')
	});

	if (PATCH && true) SuppressedErrorPrototype.constructor = $SuppressedError;

	// `SuppressedError` constructor
	// https://github.com/tc39/proposal-explicit-resource-management
	$$6({ global: true, constructor: true, arity: 3, forced: PATCH }, {
	  SuppressedError: $SuppressedError
	});

	var isObject = isObject$b;

	var $String = String;
	var $TypeError$3 = TypeError;

	var anObjectOrUndefined$2 = function (argument) {
	  if (argument === undefined || isObject(argument)) return argument;
	  throw new $TypeError$3($String(argument) + ' is not an object or undefined');
	};

	var $TypeError$2 = TypeError;

	var aString$2 = function (argument) {
	  if (typeof argument == 'string') return argument;
	  throw new $TypeError$2('Argument is not a string');
	};

	var commonAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var base64Alphabet$2 = commonAlphabet + '+/';
	var base64UrlAlphabet$2 = commonAlphabet + '-_';

	var inverse = function (characters) {
	  // TODO: use `Object.create(null)` in `core-js@4`
	  var result = {};
	  var index = 0;
	  for (; index < 64; index++) result[characters.charAt(index)] = index;
	  return result;
	};

	var base64Map$2 = {
	  i2c: base64Alphabet$2,
	  c2i: inverse(base64Alphabet$2),
	  i2cUrl: base64UrlAlphabet$2,
	  c2iUrl: inverse(base64UrlAlphabet$2)
	};

	var $TypeError$1 = TypeError;

	var getAlphabetOption$2 = function (options) {
	  var alphabet = options && options.alphabet;
	  if (alphabet === undefined || alphabet === 'base64' || alphabet === 'base64url') return alphabet || 'base64';
	  throw new $TypeError$1('Incorrect `alphabet` option');
	};

	var globalThis$a = globalThis_1;
	var uncurryThis$4 = functionUncurryThis;
	var anObjectOrUndefined$1 = anObjectOrUndefined$2;
	var aString$1 = aString$2;
	var hasOwn$1 = hasOwnProperty_1;
	var base64Map$1 = base64Map$2;
	var getAlphabetOption$1 = getAlphabetOption$2;
	var notDetached$3 = arrayBufferNotDetached;

	var base64Alphabet$1 = base64Map$1.c2i;
	var base64UrlAlphabet$1 = base64Map$1.c2iUrl;

	var SyntaxError$2 = globalThis$a.SyntaxError;
	var TypeError$1 = globalThis$a.TypeError;
	var at = uncurryThis$4(''.charAt);

	var skipAsciiWhitespace = function (string, index) {
	  var length = string.length;
	  for (;index < length; index++) {
	    var chr = at(string, index);
	    if (chr !== ' ' && chr !== '\t' && chr !== '\n' && chr !== '\f' && chr !== '\r') break;
	  } return index;
	};

	var decodeBase64Chunk = function (chunk, alphabet, throwOnExtraBits) {
	  var chunkLength = chunk.length;

	  if (chunkLength < 4) {
	    chunk += chunkLength === 2 ? 'AA' : 'A';
	  }

	  var triplet = (alphabet[at(chunk, 0)] << 18)
	    + (alphabet[at(chunk, 1)] << 12)
	    + (alphabet[at(chunk, 2)] << 6)
	    + alphabet[at(chunk, 3)];

	  var chunkBytes = [
	    (triplet >> 16) & 255,
	    (triplet >> 8) & 255,
	    triplet & 255
	  ];

	  if (chunkLength === 2) {
	    if (throwOnExtraBits && chunkBytes[1] !== 0) {
	      throw new SyntaxError$2('Extra bits');
	    }
	    return [chunkBytes[0]];
	  }

	  if (chunkLength === 3) {
	    if (throwOnExtraBits && chunkBytes[2] !== 0) {
	      throw new SyntaxError$2('Extra bits');
	    }
	    return [chunkBytes[0], chunkBytes[1]];
	  }

	  return chunkBytes;
	};

	var writeBytes = function (bytes, elements, written) {
	  var elementsLength = elements.length;
	  for (var index = 0; index < elementsLength; index++) {
	    bytes[written + index] = elements[index];
	  }
	  return written + elementsLength;
	};

	/* eslint-disable max-statements, max-depth -- TODO */
	var uint8FromBase64 = function (string, options, into, maxLength) {
	  aString$1(string);
	  anObjectOrUndefined$1(options);
	  var alphabet = getAlphabetOption$1(options) === 'base64' ? base64Alphabet$1 : base64UrlAlphabet$1;
	  var lastChunkHandling = options ? options.lastChunkHandling : undefined;

	  if (lastChunkHandling === undefined) lastChunkHandling = 'loose';

	  if (lastChunkHandling !== 'loose' && lastChunkHandling !== 'strict' && lastChunkHandling !== 'stop-before-partial') {
	    throw new TypeError$1('Incorrect `lastChunkHandling` option');
	  }

	  if (into) notDetached$3(into.buffer);

	  var bytes = into || [];
	  var written = 0;
	  var read = 0;
	  var chunk = '';
	  var index = 0;

	  if (maxLength) while (true) {
	    index = skipAsciiWhitespace(string, index);
	    if (index === string.length) {
	      if (chunk.length > 0) {
	        if (lastChunkHandling === 'stop-before-partial') {
	          break;
	        }
	        if (lastChunkHandling === 'loose') {
	          if (chunk.length === 1) {
	            throw new SyntaxError$2('Malformed padding: exactly one additional character');
	          }
	          written = writeBytes(bytes, decodeBase64Chunk(chunk, alphabet, false), written);
	        } else {
	          throw new SyntaxError$2('Missing padding');
	        }
	      }
	      read = string.length;
	      break;
	    }
	    var chr = at(string, index);
	    ++index;
	    if (chr === '=') {
	      if (chunk.length < 2) {
	        throw new SyntaxError$2('Padding is too early');
	      }
	      index = skipAsciiWhitespace(string, index);
	      if (chunk.length === 2) {
	        if (index === string.length) {
	          if (lastChunkHandling === 'stop-before-partial') {
	            break;
	          }
	          throw new SyntaxError$2('Malformed padding: only one =');
	        }
	        if (at(string, index) === '=') {
	          ++index;
	          index = skipAsciiWhitespace(string, index);
	        }
	      }
	      if (index < string.length) {
	        throw new SyntaxError$2('Unexpected character after padding');
	      }
	      written = writeBytes(bytes, decodeBase64Chunk(chunk, alphabet, lastChunkHandling === 'strict'), written);
	      read = string.length;
	      break;
	    }
	    if (!hasOwn$1(alphabet, chr)) {
	      throw new SyntaxError$2('Unexpected character');
	    }
	    var remainingBytes = maxLength - written;
	    if (remainingBytes === 1 && chunk.length === 2 || remainingBytes === 2 && chunk.length === 3) {
	      // special case: we can fit exactly the number of bytes currently represented by chunk, so we were just checking for `=`
	      break;
	    }

	    chunk += chr;
	    if (chunk.length === 4) {
	      written = writeBytes(bytes, decodeBase64Chunk(chunk, alphabet, false), written);
	      chunk = '';
	      read = index;
	      if (written === maxLength) {
	        break;
	      }
	    }
	  }

	  return { bytes: bytes, read: read, written: written };
	};

	var classof = classof$7;

	var $TypeError = TypeError;

	// Perform ? RequireInternalSlot(argument, [[TypedArrayName]])
	// If argument.[[TypedArrayName]] is not "Uint8Array", throw a TypeError exception
	var anUint8Array$4 = function (argument) {
	  if (classof(argument) === 'Uint8Array') return argument;
	  throw new $TypeError('Argument is not an Uint8Array');
	};

	var $$5 = _export;
	var globalThis$9 = globalThis_1;
	var $fromBase64 = uint8FromBase64;
	var anUint8Array$3 = anUint8Array$4;

	var Uint8Array$1 = globalThis$9.Uint8Array;

	var INCORRECT_BEHAVIOR_OR_DOESNT_EXISTS = !Uint8Array$1 || !Uint8Array$1.prototype.setFromBase64 || !(function () {
	  var target = new Uint8Array$1([255, 255, 255, 255, 255]);
	  try {
	    target.setFromBase64('MjYyZg===');
	  } catch (error) {
	    return target[0] === 50 && target[1] === 54 && target[2] === 50 && target[3] === 255 && target[4] === 255;
	  }
	})();

	// `Uint8Array.prototype.setFromBase64` method
	// https://github.com/tc39/proposal-arraybuffer-base64
	if (Uint8Array$1) $$5({ target: 'Uint8Array', proto: true, forced: INCORRECT_BEHAVIOR_OR_DOESNT_EXISTS }, {
	  setFromBase64: function setFromBase64(string /* , options */) {
	    anUint8Array$3(this);

	    var result = $fromBase64(string, arguments.length > 1 ? arguments[1] : undefined, this, this.length);

	    return { read: result.read, written: result.written };
	  }
	});

	var globalThis$8 = globalThis_1;
	var uncurryThis$3 = functionUncurryThis;

	var Uint8Array = globalThis$8.Uint8Array;
	var SyntaxError$1 = globalThis$8.SyntaxError;
	var parseInt$1 = globalThis$8.parseInt;
	var min = Math.min;
	var NOT_HEX = /[^\da-f]/i;
	var exec = uncurryThis$3(NOT_HEX.exec);
	var stringSlice = uncurryThis$3(''.slice);

	var uint8FromHex = function (string, into) {
	  var stringLength = string.length;
	  if (stringLength % 2 !== 0) throw new SyntaxError$1('String should be an even number of characters');
	  var maxLength = into ? min(into.length, stringLength / 2) : stringLength / 2;
	  var bytes = into || new Uint8Array(maxLength);
	  var read = 0;
	  var written = 0;
	  while (written < maxLength) {
	    var hexits = stringSlice(string, read, read += 2);
	    if (exec(NOT_HEX, hexits)) throw new SyntaxError$1('String should only contain hex characters');
	    bytes[written++] = parseInt$1(hexits, 16);
	  }
	  return { bytes: bytes, read: read };
	};

	var $$4 = _export;
	var globalThis$7 = globalThis_1;
	var aString = aString$2;
	var anUint8Array$2 = anUint8Array$4;
	var notDetached$2 = arrayBufferNotDetached;
	var $fromHex = uint8FromHex;

	// `Uint8Array.prototype.setFromHex` method
	// https://github.com/tc39/proposal-arraybuffer-base64
	if (globalThis$7.Uint8Array) $$4({ target: 'Uint8Array', proto: true }, {
	  setFromHex: function setFromHex(string) {
	    anUint8Array$2(this);
	    aString(string);
	    notDetached$2(this.buffer);
	    var read = $fromHex(string, this).read;
	    return { read: read, written: read / 2 };
	  }
	});

	var $$3 = _export;
	var globalThis$6 = globalThis_1;
	var uncurryThis$2 = functionUncurryThis;
	var anObjectOrUndefined = anObjectOrUndefined$2;
	var anUint8Array$1 = anUint8Array$4;
	var notDetached$1 = arrayBufferNotDetached;
	var base64Map = base64Map$2;
	var getAlphabetOption = getAlphabetOption$2;

	var base64Alphabet = base64Map.i2c;
	var base64UrlAlphabet = base64Map.i2cUrl;

	var charAt = uncurryThis$2(''.charAt);

	// `Uint8Array.prototype.toBase64` method
	// https://github.com/tc39/proposal-arraybuffer-base64
	if (globalThis$6.Uint8Array) $$3({ target: 'Uint8Array', proto: true }, {
	  toBase64: function toBase64(/* options */) {
	    var array = anUint8Array$1(this);
	    var options = arguments.length ? anObjectOrUndefined(arguments[0]) : undefined;
	    var alphabet = getAlphabetOption(options) === 'base64' ? base64Alphabet : base64UrlAlphabet;
	    var omitPadding = !!options && !!options.omitPadding;
	    notDetached$1(this.buffer);

	    var result = '';
	    var i = 0;
	    var length = array.length;
	    var triplet;

	    var at = function (shift) {
	      return charAt(alphabet, (triplet >> (6 * shift)) & 63);
	    };

	    for (; i + 2 < length; i += 3) {
	      triplet = (array[i] << 16) + (array[i + 1] << 8) + array[i + 2];
	      result += at(3) + at(2) + at(1) + at(0);
	    }
	    if (i + 2 === length) {
	      triplet = (array[i] << 16) + (array[i + 1] << 8);
	      result += at(3) + at(2) + at(1) + (omitPadding ? '' : '=');
	    } else if (i + 1 === length) {
	      triplet = array[i] << 16;
	      result += at(3) + at(2) + (omitPadding ? '' : '==');
	    }

	    return result;
	  }
	});

	var $$2 = _export;
	var globalThis$5 = globalThis_1;
	var uncurryThis$1 = functionUncurryThis;
	var anUint8Array = anUint8Array$4;
	var notDetached = arrayBufferNotDetached;

	var numberToString = uncurryThis$1(1.1.toString);

	// `Uint8Array.prototype.toHex` method
	// https://github.com/tc39/proposal-arraybuffer-base64
	if (globalThis$5.Uint8Array) $$2({ target: 'Uint8Array', proto: true }, {
	  toHex: function toHex() {
	    anUint8Array(this);
	    notDetached(this.buffer);
	    var result = '';
	    for (var i = 0, length = this.length; i < length; i++) {
	      var hex = numberToString(this[i], 16);
	      result += hex.length === 1 ? '0' + hex : hex;
	    }
	    return result;
	  }
	});

	var uncurryThis = functionUncurryThis;

	var arraySlice$2 = uncurryThis([].slice);

	var userAgent = environmentUserAgent;

	// eslint-disable-next-line redos/no-vulnerable -- safe
	var environmentIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);

	var globalThis$4 = globalThis_1;
	var apply$1 = functionApply;
	var bind = functionBindContext;
	var isCallable$1 = isCallable$i;
	var hasOwn = hasOwnProperty_1;
	var fails = fails$l;
	var html = html$2;
	var arraySlice$1 = arraySlice$2;
	var createElement = documentCreateElement$1;
	var validateArgumentsLength$1 = validateArgumentsLength$4;
	var IS_IOS = environmentIsIos;
	var IS_NODE = environmentIsNode;

	var set = globalThis$4.setImmediate;
	var clear = globalThis$4.clearImmediate;
	var process = globalThis$4.process;
	var Dispatch = globalThis$4.Dispatch;
	var Function$2 = globalThis$4.Function;
	var MessageChannel = globalThis$4.MessageChannel;
	var String$1 = globalThis$4.String;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var $location, defer, channel, port;

	fails(function () {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  $location = globalThis$4.location;
	});

	var run = function (id) {
	  if (hasOwn(queue, id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var eventListener = function (event) {
	  run(event.data);
	};

	var globalPostMessageDefer = function (id) {
	  // old engines have not location.origin
	  globalThis$4.postMessage(String$1(id), $location.protocol + '//' + $location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set || !clear) {
	  set = function setImmediate(handler) {
	    validateArgumentsLength$1(arguments.length, 1);
	    var fn = isCallable$1(handler) ? handler : Function$2(handler);
	    var args = arraySlice$1(arguments, 1);
	    queue[++counter] = function () {
	      apply$1(fn, undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (IS_NODE) {
	    defer = function (id) {
	      process.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !IS_IOS) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = eventListener;
	    defer = bind(port.postMessage, port);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    globalThis$4.addEventListener &&
	    isCallable$1(globalThis$4.postMessage) &&
	    !globalThis$4.importScripts &&
	    $location && $location.protocol !== 'file:' &&
	    !fails(globalPostMessageDefer)
	  ) {
	    defer = globalPostMessageDefer;
	    globalThis$4.addEventListener('message', eventListener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in createElement('script')) {
	    defer = function (id) {
	      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task = {
	  set: set,
	  clear: clear
	};

	var $$1 = _export;
	var globalThis$3 = globalThis_1;
	var clearImmediate = task.clear;

	// `clearImmediate` method
	// http://w3c.github.io/setImmediate/#si-clearImmediate
	$$1({ global: true, bind: true, enumerable: true, forced: globalThis$3.clearImmediate !== clearImmediate }, {
	  clearImmediate: clearImmediate
	});

	var globalThis$2 = globalThis_1;
	var apply = functionApply;
	var isCallable = isCallable$i;
	var ENVIRONMENT = environment;
	var USER_AGENT = environmentUserAgent;
	var arraySlice = arraySlice$2;
	var validateArgumentsLength = validateArgumentsLength$4;

	var Function$1 = globalThis$2.Function;
	// dirty IE9- and Bun 0.3.0- checks
	var WRAP = /MSIE .\./.test(USER_AGENT) || ENVIRONMENT === 'BUN' && (function () {
	  var version = globalThis$2.Bun.version.split('.');
	  return version.length < 3 || version[0] === '0' && (version[1] < 3 || version[1] === '3' && version[2] === '0');
	})();

	// IE9- / Bun 0.3.0- setTimeout / setInterval / setImmediate additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	// https://github.com/oven-sh/bun/issues/1633
	var schedulersFix$1 = function (scheduler, hasTimeArg) {
	  var firstParamIndex = hasTimeArg ? 2 : 1;
	  return WRAP ? function (handler, timeout /* , ...arguments */) {
	    var boundArgs = validateArgumentsLength(arguments.length, 1) > firstParamIndex;
	    var fn = isCallable(handler) ? handler : Function$1(handler);
	    var params = boundArgs ? arraySlice(arguments, firstParamIndex) : [];
	    var callback = boundArgs ? function () {
	      apply(fn, this, params);
	    } : fn;
	    return hasTimeArg ? scheduler(callback, timeout) : scheduler(callback);
	  } : scheduler;
	};

	var $ = _export;
	var globalThis$1 = globalThis_1;
	var setTask = task.set;
	var schedulersFix = schedulersFix$1;

	// https://github.com/oven-sh/bun/issues/1633
	var setImmediate = globalThis$1.setImmediate ? schedulersFix(setTask, false) : setTask;

	// `setImmediate` method
	// http://w3c.github.io/setImmediate/#si-setImmediate
	$({ global: true, bind: true, enumerable: true, forced: globalThis$1.setImmediate !== setImmediate }, {
	  setImmediate: setImmediate
	});

	/*!
	 * SJS 6.15.1
	 */

	!function(){function e(e,t){return (t||"")+" (SystemJS https://github.com/systemjs/systemjs/blob/main/docs/errors.md#"+e+")"}function t(e,t){if(-1!==e.indexOf("\\")&&(e=e.replace(S,"/")),"/"===e[0]&&"/"===e[1])return t.slice(0,t.indexOf(":")+1)+e;if("."===e[0]&&("/"===e[1]||"."===e[1]&&("/"===e[2]||2===e.length&&(e+="/"))||1===e.length&&(e+="/"))||"/"===e[0]){var r,n=t.slice(0,t.indexOf(":")+1);if(r="/"===t[n.length+1]?"file:"!==n?(r=t.slice(n.length+2)).slice(r.indexOf("/")+1):t.slice(8):t.slice(n.length+("/"===t[n.length])),"/"===e[0])return t.slice(0,t.length-r.length-1)+e;for(var i=r.slice(0,r.lastIndexOf("/")+1)+e,o=[],s=-1,c=0;c<i.length;c++) -1!==s?"/"===i[c]&&(o.push(i.slice(s,c+1)),s=-1):"."===i[c]?"."!==i[c+1]||"/"!==i[c+2]&&c+2!==i.length?"/"===i[c+1]||c+1===i.length?c+=1:s=c:(o.pop(),c+=2):s=c;return  -1!==s&&o.push(i.slice(s)),t.slice(0,t.length-r.length)+o.join("")}}function r(e,r){return t(e,r)||(-1!==e.indexOf(":")?e:t("./"+e,r))}function n(e,r,n,i,o){for(var s in e){var f=t(s,n)||s,a=e[s];if("string"==typeof a){var l=u(i,t(a,n)||a,o);l?r[f]=l:c("W1",s,a);}}}function i(e,t,i){var o;for(o in e.imports&&n(e.imports,i.imports,t,i,null),e.scopes||{}){var s=r(o,t);n(e.scopes[o],i.scopes[s]||(i.scopes[s]={}),t,i,s);}for(o in e.depcache||{})i.depcache[r(o,t)]=e.depcache[o];for(o in e.integrity||{})i.integrity[r(o,t)]=e.integrity[o];}function o(e,t){if(t[e])return e;var r=e.length;do{var n=e.slice(0,r+1);if(n in t)return n}while(-1!==(r=e.lastIndexOf("/",r-1)))}function s(e,t){var r=o(e,t);if(r){var n=t[r];if(null===n)return;if(!(e.length>r.length&&"/"!==n[n.length-1]))return n+e.slice(r.length);c("W2",r,n);}}function c(t,r,n){console.warn(e(t,[n,r].join(", ")));}function u(e,t,r){for(var n=e.scopes,i=r&&o(r,n);i;){var c=s(t,n[i]);if(c)return c;i=o(i.slice(0,i.lastIndexOf("/")),n);}return s(t,e.imports)||-1!==t.indexOf(":")&&t}function f(){this[b]={};}function a(t,r,n,i){var o=t[b][r];if(o)return o;var s=[],c=Object.create(null);j&&Object.defineProperty(c,j,{value:"Module"});var u=Promise.resolve().then((function(){return t.instantiate(r,n,i)})).then((function(n){if(!n)throw Error(e(2,r));var i=n[1]((function(e,t){o.h=true;var r=false;if("string"==typeof e)e in c&&c[e]===t||(c[e]=t,r=true);else {for(var n in e)t=e[n],n in c&&c[n]===t||(c[n]=t,r=true);e&&e.__esModule&&(c.__esModule=e.__esModule);}if(r)for(var i=0;i<s.length;i++){var u=s[i];u&&u(c);}return t}),2===n[1].length?{import:function(e,n){return t.import(e,r,n)},meta:t.createContext(r)}:void 0);return o.e=i.execute||function(){},[n[0],i.setters||[],n[2]||[]]}),(function(e){throw o.e=null,o.er=e,e})),f=u.then((function(e){return Promise.all(e[0].map((function(n,i){var o=e[1][i],s=e[2][i];return Promise.resolve(t.resolve(n,r)).then((function(e){var n=a(t,e,r,s);return Promise.resolve(n.I).then((function(){return o&&(n.i.push(o),!n.h&&n.I||o(n.n)),n}))}))}))).then((function(e){o.d=e;}))}));return o=t[b][r]={id:r,i:s,n:c,m:i,I:u,L:f,h:false,d:void 0,e:void 0,er:void 0,E:void 0,C:void 0,p:void 0}}function l(e,t,r,n){if(!n[t.id])return n[t.id]=true,Promise.resolve(t.L).then((function(){return t.p&&null!==t.p.e||(t.p=r),Promise.all(t.d.map((function(t){return l(e,t,r,n)})))})).catch((function(e){if(t.er)throw e;throw t.e=null,e}))}function h(e,t){return t.C=l(e,t,t,{}).then((function(){return d(e,t,{})})).then((function(){return t.n}))}function d(e,t,r){function n(){try{var e=o.call(I);if(e)return e=e.then((function(){t.C=t.n,t.E=null;}),(function(e){throw t.er=e,t.E=null,e})),t.E=e;t.C=t.n,t.L=t.I=void 0;}catch(r){throw t.er=r,r}}if(!r[t.id]){if(r[t.id]=true,!t.e){if(t.er)throw t.er;return t.E?t.E:void 0}var i,o=t.e;return t.e=null,t.d.forEach((function(n){try{var o=d(e,n,r);o&&(i=i||[]).push(o);}catch(s){throw t.er=s,s}})),i?Promise.all(i).then(n):n()}}function v(){[].forEach.call(document.querySelectorAll("script"),(function(t){if(!t.sp)if("systemjs-module"===t.type){if(t.sp=true,!t.src)return;System.import("import:"===t.src.slice(0,7)?t.src.slice(7):r(t.src,p)).catch((function(e){if(e.message.indexOf("https://github.com/systemjs/systemjs/blob/main/docs/errors.md#3")>-1){var r=document.createEvent("Event");r.initEvent("error",false,false),t.dispatchEvent(r);}return Promise.reject(e)}));}else if("systemjs-importmap"===t.type){t.sp=true;var n=t.src?(System.fetch||fetch)(t.src,{integrity:t.integrity,priority:t.fetchPriority,passThrough:true}).then((function(e){if(!e.ok)throw Error(e.status);return e.text()})).catch((function(r){return r.message=e("W4",t.src)+"\n"+r.message,console.warn(r),"function"==typeof t.onerror&&t.onerror(),"{}"})):t.innerHTML;M=M.then((function(){return n})).then((function(r){!function(t,r,n){var o={};try{o=JSON.parse(r);}catch(s){console.warn(Error(e("W5")));}i(o,n,t);}(R,r,t.src||p);}));}}));}var p,m="undefined"!=typeof Symbol,g="undefined"!=typeof self,y="undefined"!=typeof document,E=g?self:commonjsGlobal;if(y){var w=document.querySelector("base[href]");w&&(p=w.href);}if(!p&&"undefined"!=typeof location){var O=(p=location.href.split("#")[0].split("?")[0]).lastIndexOf("/");-1!==O&&(p=p.slice(0,O+1));}var x,S=/\\/g,j=m&&Symbol.toStringTag,b=m?Symbol():"@",P=f.prototype;P.import=function(e,t,r){var n=this;return t&&"object"==typeof t&&(r=t,t=void 0),Promise.resolve(n.prepareImport()).then((function(){return n.resolve(e,t,r)})).then((function(e){var t=a(n,e,void 0,r);return t.C||h(n,t)}))},P.createContext=function(e){var t=this;return {url:e,resolve:function(r,n){return Promise.resolve(t.resolve(r,n||e))}}},P.register=function(e,t,r){x=[e,t,r];},P.getRegister=function(){var e=x;return x=void 0,e};var I=Object.freeze(Object.create(null));E.System=new f;var L,C,M=Promise.resolve(),R={imports:{},scopes:{},depcache:{},integrity:{}},T=y;if(P.prepareImport=function(e){return (T||e)&&(v(),T=false),M},P.getImportMap=function(){return JSON.parse(JSON.stringify(R))},y&&(v(),window.addEventListener("DOMContentLoaded",v)),P.addImportMap=function(e,t){i(e,t||p,R);},y){window.addEventListener("error",(function(e){J=e.filename,W=e.error;}));var _=location.origin;}P.createScript=function(e){var t=document.createElement("script");t.async=true,e.indexOf(_+"/")&&(t.crossOrigin="anonymous");var r=R.integrity[e];return r&&(t.integrity=r),t.src=e,t};var J,W,q={},N=P.register;P.register=function(e,t){if(y&&"loading"===document.readyState&&"string"!=typeof e){var r=document.querySelectorAll("script[src]"),n=r[r.length-1];if(n){L=e;var i=this;C=setTimeout((function(){q[n.src]=[e,t],i.import(n.src);}));}}else L=void 0;return N.call(this,e,t)},P.instantiate=function(t,r){var n=q[t];if(n)return delete q[t],n;var i=this;return Promise.resolve(P.createScript(t)).then((function(n){return new Promise((function(o,s){n.addEventListener("error",(function(){s(Error(e(3,[t,r].join(", "))));})),n.addEventListener("load",(function(){if(document.head.removeChild(n),J===t)s(W);else {var e=i.getRegister(t);e&&e[0]===L&&clearTimeout(C),o(e);}})),document.head.appendChild(n);}))}))},P.shouldFetch=function(){return  false},"undefined"!=typeof fetch&&(P.fetch=fetch);var k=P.instantiate,A=/^(text|application)\/(x-)?javascript(;|$)/;P.instantiate=function(t,r,n){var i=this;return this.shouldFetch(t,r,n)?this.fetch(t,{credentials:"same-origin",integrity:R.integrity[t],meta:n}).then((function(n){if(!n.ok)throw Error(e(7,[n.status,n.statusText,t,r].join(", ")));var o=n.headers.get("content-type");if(!o||!A.test(o))throw Error(e(4,o));return n.text().then((function(e){return e.indexOf("//# sourceURL=")<0&&(e+="\n//# sourceURL="+t),(0, eval)(e),i.getRegister(t)}))})):k.apply(this,arguments)},P.resolve=function(r,n){return u(R,t(r,n=n||p)||r,n)||function(t,r){throw Error(e(8,[t,r].join(", ")))}(r,n)};var F=P.instantiate;P.instantiate=function(e,t,r){var n=R.depcache[e];if(n)for(var i=0;i<n.length;i++)a(this,this.resolve(n[i],e),e);return F.call(this,e,t,r)},g&&"function"==typeof importScripts&&(P.instantiate=function(e){var t=this;return Promise.resolve().then((function(){return importScripts(e),t.getRegister(e)}))});}();

})();
