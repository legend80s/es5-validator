const debugging = process.env.DEBUG === 'true';

exports.debug = debugging ? console.log.bind(console, '[es5-validator]') : () => {};
