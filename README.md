# es5-validator

Validate JS source code against ES5.

## Use

```sh
npm i es5-validator --save-dev
```

package.json

```json
{
  "scripts": {
    "lint:es5": "es5-validator dist/index.js"
  }
}
```

```sh
npm run lint:es5
```

If ES5 incompatible

![es5-validator-demo](https://raw.githubusercontent.com/legend80s/es5-validator/master/es5-validator-demo.png)

[Demo repo](https://github.com/legend80s/es5-validator-demo).

## Why it exits

To avoid breaking you App by shipping ES6+ code to production silently.
