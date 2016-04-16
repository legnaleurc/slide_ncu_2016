# JavaScript Best Practices (3)

## Introduction to ECMAScript 6

Wei-Cheng Pan

2016/04/18

# Who am I

worked in SkyWatch (video streaming, IoT)

working in Mozilla's platform team

open source contributor (FFmpeg, Tornado, HIME ... etc.)

[more ...](https://about.me/legnaleurc)

# Constants

```javascript
const PI = Math.acos(-1)
PI = 'balah ba ba ba ~' // TypeError
```

```javascript
const gInstance = {}
gInstance.name = 'John' // ok
gInstance = null // TypeError
```

# Block Scope

In ES5, only function scope is available.

```javascript
(function () {
  var i = 42
})()
console.info(i) // ReferenceError
```

# Block Scope

ES6 introduced block scope.

```javascript
for (let i = 0; i < 3; ++i) {
  console.info(i)
}
console.info(i) // ReferenceError
```

# Arrow Functions

```javascript
let one = [1, 2, 3], two = null

// ES5
two = one.map(function (n) {
  return n * 2
})

// ES6
two = one.map(n => n * 2)
two = one.map((n) => {
  return n * 2
})
```

# Arrow Functions

Arrow function is not just a syntax sugar.

The semantic is different too.

# Arrow Functions

```javascript
let o = {
  test () {
    this.member.aMethod(function (v) {
      console.info(this)
      return v * v
    })

    this.member.aMethod(v => {
      console.info(this)
      return v * v
    })
  },

  name: 'parent',
  member: {
    name: 'child',
    aMethod (fn) {
      return fn.call(this, 3)
    },
  },
}
o.test()
```

# Default Parameters

```javascript
function es5 (a, b, c) {
  if (b === undefined) { b = 7 }
  if (c === undefined) { c = 21 }
  console.info(a, b, c)
}

function es6 (a, b=7, c=21) {
  console.info(a, b, c)
}

es5()
es6()
```

# Rest Parameter

```javascript
function es5 (d) {
  var w = Array.prototype.slice.call(arguments, 1)
  return w.join(d)
}

function es6 (d, ...w) {
  return w.join(d)
}

es5()
es6()
```

# Spread Operator

```javascript
function j (d, ...w) {
  return w.join(d)
}
let w = ['0800', '092', '000'], param = null

// ES5
param = ['-'].concat(w) // ['-', '0800', '092', '000']
j.apply(null, param)

// ES6
j('-', ...w)
param = ['-', ...w] // ['-', '0800', '092', '000']
```

# Template Literals

```javascript
let data = {
  host: 'example.org',
  id: 123,
  offset: 456,
}
let url = `https://${data.host}/books/${data.id}/pages/${data.id + data.offset}`;
let msg = `
  123
  456`
```

# Template Literals

You can customize the interpolation.

```javascript
function fn (strings, ...values) {
  debugger;
  strings[0] === 'part1 '
  strings[1] === ' part2 '
  strings[2] === ' part3\n'
  strings.raw[2] === ' part3\\n'

  values[0] === 123
  values[1] === 456
  return 'I AM ERROR'
}

console.info(fn`part1 ${123} part2 ${456} part3\n`)
```

# Binary/Octal Literal

```javascript
// ES5
console.info(parseInt('1111', 2))
console.info(parseInt('100', 8))

// ES6
console.info(0b1111 === 15)
console.info(0o100 === 64)
```

# Property Shorthand

```javascript
let a = 1, b = 2
let es5 = {
  a: a,
  b: b,
}
let es6 = {
  a,
  b,
}
```

# Computed Property Names

```javascript
let es5 = {
  name: 'John',
}
es5['group' + 3] = 'A'

let es6 = {
  name: 'John',
  ['group' + 3]: 'A',
}
```

# Method Properties

```javascript
let es5 = {
  run: function () {
    return 42
  },
}

let es6 = {
  run () {
    return 42
  },
  *range () {
    // this is a generator, we will talk this later
    for (let i = 0; i < 3; ++i) {
      yield i
    }
  },
}
```

# Destructuring Assignment

```javascript
let list = [1, 2, 3]

// ES5
var a = list[0], b = list[2]
var tmp = a
a = b
b = tmp

// ES6
let [c, , d] = list;
[d, c] = [c, d]
```

# Destructuring Assignment

```javascript
let data = {
  id: 123,
  name: 'unknown',
  alive: false,
}
// ES5
var id_ = data.id
var name_ = data.name
var alive_ = data.alive
// ES6
let {id, name, alive} = data
```

# Modules

```javascript
// lib/math.js
export function sum (x, y) {
  return x + y
}
export const PI = Math.acos(-1)

// client1.js
import * as math from 'lib/math'
var area = r * r * math.PI

// client2.js
import { sum, PI } from 'lib/math'
var round = 2 * r * PI
```

# Modules

However, so far no browser supports this.

Currently we use [CommonJS](http://wiki.commonjs.org/wiki/Modules) style or [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)
style to make modules.

# Classes (ES5)

```javascript
function Animal (name) {
  this._name = name
}
Animal.prototype.walk = function () {
  console.info(this._name, 'is walking')
}
Animal.create = function () {
  return new Animal('unknown')
}

function Cat (name) {
  Animal.call(this, name)
}
Cat.prototype = Object.create(Animal.prototype)
Cat.prototype.constructor = Cat
Cat.prototype.walk = function () {
  Animal.prototype.walk.call(this)
  console.info('shhhh ...')
}

var base = new Animal('base')
var cat = new Cat('cat')
```

# Classes (ES6)

```javascript
// ES6
class Animal {
  constructor (name) {
    this._name = name
  }
  walk () {
    console.info(this._name, 'is walking')
  }
  static create () {
    return new Animal('unknown')
  }
  get name () {
    return this._name
  }
  set name (name) {
    if (!name) return
    this._name = name
  }
}

class Cat extends Animal {
  constructor (name) {
    super(name)
  }
  walk () {
    super.walk()
    console.info('shhhh ...')
  }
}

let base = new Animal('base')
let cat = new Cat('cat')
```

# Generators

```javascript
function* range (start, stop, step) {
  while (start < stop) {
    yield start
    start += step
  }
}

let g = range(0, 10, 2)
for (let i = g.next(); !i.done; i = g.next()) {
  console.info(i.value);
}

for (let i of range(0, 5, 1)) {
  console.info(i)
}

let list = [2, 3, 5, 7, 11, 13]
for (let prime of list) {
  console.info('prime: ', prime)
}
```

# Generators

```javascript
function* range (start, stop, step) {
  while (start < stop) {
    yield start
    start += step
  }
}
function* triangle (start, stop) {
  while (start < stop) {
    yield* range(start, stop, 1)
    start += 1
  }
}

for (let i of triangle(0, 5)) {
  console.info(i)
}
```

# Generators

```javascript
function* bidirect (end) {
  for (let i = 0; i < end; ++i) {
    let j = yield i
    console.info('fab', j)
  }
}

let g = bidirect(10)
for (let i = g.next(); !i.done; i = g.next(i.value * 2)) {
  console.info('loop', i.value);
}
```

# New Containers

```javascript
let s = new Set()
s.add('black').add('black').add('white')
s.has('white') === true
s.size === 2
for (let color of s) {
  console.info(color)
}

let m = new Map()
m.set('Alice', 18)
m.set('Bob', 19)
m.get('Alice') === 18
m.has('Bob') === true
for (let [name, age] of m) {
  console.info(name, age)
}
```

# Proxy

```javascript
let target = function () {}
let proxy = new Proxy(target, {
  get (target, property, receiver) {
    console.info('get', target, property)
    return target[property]
  },
  set (target, property, value, receiver) {
    console.info('set', target, property, value)
    return true
  },
  apply (target, thisArg, argumentsList) {
    console.info('apply', target, thisArg, argumentsList)
    return target.apply(thisArg, argumentsList)
  },
  construct (target, argumentsList, newTarget) {
    console.info('construct', target, argumentsList)
    // we can not use Function.apply with the "new" operator
    let dummyThis = null;
    let bound = Function.prototype.bind.apply(target, [dummyThis, ...argumentsList])
    return new bound
  },
})
```

# Asynchronized Control Flow

```javascript
// ES6
function webCrawler (url) {
  return fetch(url).then(response => response.text()).then(html => {
    let link = parseLink(html)
    return sleep(5000).then(() => fetch(link))
  }).then(response => response.json())
}

// ES7
async function webCrawler (url) {
  let response = await fetch(url)
  let html = await response.text()
  let link = parseLink(html)
  await sleep(5000)
  response = await fetch(link)
  return await response.json()
}
```

# Simulate async/await

```javascript
function* webCrawler () {
  let response = yield fetch(url)
  let html = yield response.text()
  let link = parseLink(html)
  yield sleep(5000)
  response = yield fetch(link)
  return yield response.json()
}
```

# Q&A
