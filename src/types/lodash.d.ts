/**
 * Lodash-ES 类型声明文件
 * 提供常用 lodash 函数的类型定义和使用示例
 */

// 重新导出常用的 lodash-es 类型
export {
  // 数组相关
  chunk,
  compact,
  concat,
  difference,
  drop,
  dropRight,
  fill,
  findIndex,
  findLastIndex,
  flatten,
  flattenDeep,
  fromPairs,
  head,
  indexOf,
  initial,
  intersection,
  join,
  last,
  lastIndexOf,
  nth,
  pull,
  pullAll,
  pullAllBy,
  pullAllWith,
  pullAt,
  remove,
  reverse,
  slice,
  sortedIndex,
  sortedIndexBy,
  sortedIndexOf,
  sortedLastIndex,
  sortedLastIndexBy,
  sortedLastIndexOf,
  sortedUniq,
  sortedUniqBy,
  tail,
  take,
  takeRight,
  takeRightWhile,
  takeWhile,
  union,
  unionBy,
  unionWith,
  uniq,
  uniqBy,
  uniqWith,
  unzip,
  unzipWith,
  without,
  xor,
  xorBy,
  xorWith,
  zip,
  zipObject,
  zipObjectDeep,
  zipWith,

  // 集合相关
  countBy,
  every,
  filter,
  find,
  findLast,
  flatMap,
  flatMapDeep,
  flatMapDepth,
  forEach,
  forEachRight,
  groupBy,
  includes,
  invokeMap,
  keyBy,
  map,
  orderBy,
  partition,
  reduce,
  reduceRight,
  reject,
  sample,
  sampleSize,
  shuffle,
  size,
  some,
  sortBy,

  // 函数相关
  after,
  ary,
  before,
  bind,
  bindKey,
  curry,
  curryRight,
  debounce,
  defer,
  delay,
  flip,
  memoize,
  negate,
  once,
  overArgs,
  partial,
  partialRight,
  rearg,
  rest,
  spread,
  throttle,
  unary,
  wrap,

  // 语言相关
  castArray,
  clone,
  cloneDeep,
  cloneDeepWith,
  cloneWith,
  conformsTo,
  eq,
  gt,
  gte,
  isArguments,
  isArray,
  isArrayBuffer,
  isArrayLike,
  isArrayLikeObject,
  isBoolean,
  isBuffer,
  isDate,
  isElement,
  isEmpty,
  isEqual,
  isEqualWith,
  isError,
  isFinite,
  isFunction,
  isInteger,
  isLength,
  isMap,
  isMatch,
  isMatchWith,
  isNaN,
  isNative,
  isNil,
  isNull,
  isNumber,
  isObject,
  isObjectLike,
  isPlainObject,
  isRegExp,
  isSafeInteger,
  isSet,
  isString,
  isSymbol,
  isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
  lt,
  lte,
  toArray,
  toFinite,
  toInteger,
  toLength,
  toNumber,
  toPlainObject,
  toSafeInteger,
  toString,

  // 数学相关
  add,
  ceil,
  divide,
  floor,
  max,
  maxBy,
  mean,
  meanBy,
  min,
  minBy,
  multiply,
  round,
  subtract,
  sum,
  sumBy,

  // 数字相关
  clamp,
  inRange,
  random,

  // 对象相关
  assign,
  assignIn,
  assignInWith,
  assignWith,
  at,
  create,
  defaults,
  defaultsDeep,
  findKey,
  findLastKey,
  forIn,
  forInRight,
  forOwn,
  forOwnRight,
  functions,
  functionsIn,
  get,
  has,
  hasIn,
  invert,
  invertBy,
  invoke,
  keys,
  keysIn,
  mapKeys,
  mapValues,
  merge,
  mergeWith,
  omit,
  omitBy,
  pick,
  pickBy,
  result,
  set,
  setWith,
  toPairs,
  toPairsIn,
  transform,
  unset,
  update,
  updateWith,
  values,
  valuesIn,

  // 字符串相关
  camelCase,
  capitalize,
  deburr,
  endsWith,
  escape,
  escapeRegExp,
  kebabCase,
  lowerCase,
  lowerFirst,
  pad,
  padEnd,
  padStart,
  parseInt,
  repeat,
  replace,
  snakeCase,
  split,
  startCase,
  startsWith,
  template,
  toLower,
  toUpper,
  trim,
  trimEnd,
  trimStart,
  truncate,
  unescape,
  upperCase,
  upperFirst,
  words,

  // 实用工具
  attempt,
  bindAll,
  cond,
  conforms,
  constant,
  defaultTo,
  flow,
  flowRight,
  identity,
  iteratee,
  matches,
  matchesProperty,
  method,
  methodOf,
  mixin,
  noop,
  nthArg,
  over,
  overEvery,
  overSome,
  property,
  propertyOf,
  range,
  rangeRight,
  stubArray,
  stubFalse,
  stubObject,
  stubString,
  stubTrue,
  times,
  toPath,
  uniqueId
} from 'lodash-es'

/**
 * 常用 Lodash 函数使用示例
 * 
 * @example
 * // 数组操作
 * import { chunk, uniq, flatten } from 'lodash-es'
 * 
 * const numbers = [1, 2, 3, 4, 5, 6]
 * const chunked = chunk(numbers, 2) // [[1, 2], [3, 4], [5, 6]]
 * const unique = uniq([1, 2, 2, 3, 3, 4]) // [1, 2, 3, 4]
 * const flattened = flatten([[1, 2], [3, 4]]) // [1, 2, 3, 4]
 * 
 * @example
 * // 对象操作
 * import { get, set, omit, pick } from 'lodash-es'
 * 
 * const obj = { a: { b: { c: 1 } }, d: 2, e: 3 }
 * const value = get(obj, 'a.b.c') // 1
 * const newObj = set({}, 'a.b.c', 1) // { a: { b: { c: 1 } } }
 * const omitted = omit(obj, ['d']) // { a: { b: { c: 1 } }, e: 3 }
 * const picked = pick(obj, ['d', 'e']) // { d: 2, e: 3 }
 * 
 * @example
 * // 函数操作
 * import { debounce, throttle, memoize } from 'lodash-es'
 * 
 * const debouncedFn = debounce(() => console.log('debounced'), 300)
 * const throttledFn = throttle(() => console.log('throttled'), 1000)
 * const memoizedFn = memoize((x: number) => x * 2)
 * 
 * @example
 * // 类型检查
 * import { isArray, isObject, isEmpty, isNil } from 'lodash-es'
 * 
 * isArray([1, 2, 3]) // true
 * isObject({}) // true
 * isEmpty('') // true
 * isNil(null) // true
 * 
 * @example
 * // 字符串操作
 * import { camelCase, kebabCase, capitalize, truncate } from 'lodash-es'
 * 
 * camelCase('hello world') // 'helloWorld'
 * kebabCase('Hello World') // 'hello-world'
 * capitalize('hello') // 'Hello'
 * truncate('Hello World', { length: 8 }) // 'Hello...'
 */