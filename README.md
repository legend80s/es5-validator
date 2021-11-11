# es5-validator

> Validate JS source code against ES5 and report possible syntax errors before shipping to production to make your code safe on iOS 9, iOS 10 or other ES6+ incompatible platforms.

The earlier you find ES5 incompatibility errors, the earlier you can fix them.

## Use

```sh
npx es5-validator FILE_TO_VALIDATE1.js [FILE_TO_VALIDATE2.js] [https://some-cdn/es.min.js]
```

### Or Use as Script

```sh
npm i es5-validator --save-dev
```

package.json

```json
{
  "scripts": {
    "lint:es5": "es5-validator es6.js"
  }
}
```

es6.js

```js
function func(foo = '') {}
const bar = 1;
```

```sh
npm run lint:es5
```

Result:

```javascript
[es5-validator] Your code is not ES5 Compatible. It's not ready to ship to production, otherwise it will break you App on iOS 9 or iOS 10.

Error: ECMAScript 5 validate failed when parsing es6.js.formatted (1, 18)


> 1 | function func(foo = '') {}
    |                  ^ Invalid ECMAScript 5 syntax
  2 | const bar = 1;
```

![es5-validator-demo](https://raw.githubusercontent.com/legend80s/es5-validator/master/es5-validator-demo.jpg)

[Demo repo](https://github.com/legend80s/es5-validator-demo).

## Why it exits

To avoid breaking you App by shipping ES6+ code to production silently.

## How it works

Detect syntax error by parsing source code aganest ES5 using acorn. For more details, you can read the [code](https://github.com/legend80s/es5-validator/blob/master/index.js#L66).

> When encountering a syntax error, the parser will raise a `SyntaxError` object with a meaningful message. The error object will have a `pos` property that indicates the string offset at which the error occurred, and a `loc` object that contains a `{line, column}` object referring to that same position.
> - https://www.npmjs.com/package/acorn

```js
acorn.parse(source, {
  ecmaVersion: 5,
});
```

💡 Notice: Only the syntax can be detected. Methods introduced by ES6+ wont be reported. For example `Object.assign` will not be reported but `spread operator` will.

## Features

- [x] Validate local JS file.
- [x] Validate remote JS file. For example: `npx es5-validator https://cdn.jsdelivr.net/npm/js-pinyin/index.js`.
- [x] Validate multiple JS files concurrently. For example: `npx es5-validator es6-1.js es6-2.js`.
- [ ] Validate inline source code directly.

## Todo

- [x] Validate remote js. `npx es5-validator https://cdn.jsdelivr.net/npm/js-pinyin/index.js`.

*Give a star ❤️  if it helped you https://github.com/legend80s/es5-validator.*
