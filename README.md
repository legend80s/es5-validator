# es5-validator

> Validate JS source code against ES5 and report possible syntax errors before shipping to production to make your code safe on iOS 9, iOS 10 or other ES6+ incompatible platforms.

The earlier you find ES5 incompatibility errors, the earlier you can fix them.

## Use

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

![es5-validator-demo](https://raw.githubusercontent.com/legend80s/es5-validator/master/es5-validator-demo.jpg)

[Demo repo](https://github.com/legend80s/es5-validator-demo).

## Why it exits

To avoid breaking you App by shipping ES6+ code to production silently.
