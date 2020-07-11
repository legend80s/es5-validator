#!/usr/bin/env node

const { extname } = require('path');
const { readFileSync } = require('fs')
const acorn = require('acorn');
const chalk = require('chalk');
const { codeFrameColumns } = require('@babel/code-frame');
const beautify = require('js-beautify').js;

const debug = require('debug')('es5-validator');

sourceFiles = process.argv.slice(2);

printResult(validate(sourceFiles));

function validate(fileNames) {
  let errors = [];

  debug(`got files: ${fileNames.join(', ')}`);

  fileNames.forEach(fileName => {
    if (extname(fileName) === '.js') {
      debug(`validate es5 for ${fileName}`);

      const rawSource = readFileSync(fileName).toString();
      const source = beautify(rawSource, { indent_size: 2, space_in_empty_paren: true })

      debug(`source:`, source);

      try {
        acorn.parse(source, {
          ecmaVersion: 5,
        });

        debug(`parse success ${fileName}`);
      } catch (e) {
        debug(`parse failed ${fileName}, error:`, e);

        errors = [
          chalk.black.bgRed('Error') +
          chalk.red(`: ECMAScript 5 validate failed when parsing ${chalk.green.bold(fileName + '.formatted')} (${e.loc.line}, ${e.loc.column})`),
        ];

        errors.push('');
        errors.push('');

        errors.push(codeFrameColumns(source, {
          start: e.loc,
        }, {
          highlightCode: true,
          forceColor: true,
          message: 'Invalid ECMAScript 5 syntax',
          linesAbove: 10,
          linesBelow: 2,
        }));
      }
    }
  });

  return errors;
}

function printResult(errors = []) {
  console.log('');
  console.log(chalk.italic(`NOTICE: It's hard to locate the problem when code is compressed, so the source code will be formatted before validate.`));
  console.log('');

  if (errors.length === 0) {
    console.log(chalk.greenBright('[es5-validator] Congratulations! Your code is ES5 Compatible. It\'s ready to ship to production.'));
  } else {
    console.log(chalk.redBright('[es5-validator] Your code is not ES5 Compatible. It\'s not ready to ship to production, otherwise it will break you App.'));
    console.log('');
    console.error(errors.join('\n'));
  }

  console.log('');
  console.log(chalk.cyan(`Give a star ❤️  if it helped you https://github.com/legend80s/es5-validator.`));
  console.log('');
}
