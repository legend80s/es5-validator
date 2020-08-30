#!/usr/bin/env node

const { extname } = require('path');
const { readFileSync } = require('fs')
const acorn = require('acorn');
const chalk = require('chalk');
const { codeFrameColumns } = require('@babel/code-frame');
const beautify = require('js-beautify').js;
const { fetch } = require('./fetch');

const debug = require('debug')('es5-validator');
// const debug = console.log;

sourceFiles = process.argv.slice(2);

async function main() {
  printResult(await validate(sourceFiles));
}

main();

/**
 * @param {string[]} filePaths
 */
async function validate(filePaths) {
  let errors = [];

  debug(`got files:`, filePaths);

  const jsFilePaths = filePaths.filter(path => {
    if (extname(path) === '.js') {
      return true;
    }

    debug(path, 'not a js file, ignored');
  });

  if (!jsFilePaths || !jsFilePaths.length) {
    console.log('[es5-validator] No file to validate: $ es5-validator FILE_1_TO_VALIDATE.js FILE_2_TO_VALIDATE.js');

    process.exit(0);
  }

  await Promise.all(jsFilePaths.map(async fileName => {
    debug(`validate es5 for ${fileName}`);

    const rawSource = await fetchFileContent(fileName).catch(error => {
      console.error('fetchFileContent', error);

      process.exit(1);
    });

    debug(`rawSource:`, rawSource);

    const source = beautify(rawSource, { indent_size: 2, space_in_empty_paren: true })

    debug(`source after beautified:`, source);

    try {
      acorn.parse(source, {
        ecmaVersion: 5,
      });

      debug(`parse success ${fileName}`);
    } catch (e) {
      debug(`parse failed ${fileName}, error:`, e);

      errors = [
        chalk.black.bgRed('Error') +
        chalk.red(`: ECMAScript 5 validate failed when parsing ${chalk.green.bold(fileName + ' (formatted)')} (${e.loc.line}, ${e.loc.column})`),
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
  }));

  return errors;
}

function printResult(errors = []) {
  console.log('');

  const compatible = errors.length === 0;

  if (compatible) {
    console.log(chalk.greenBright('[es5-validator] Congratulations! Your code is ES5 Compatible. It\'s ready to ship to production.'));
  } else {
    console.log(chalk.italic(`[es5-validator] NOTICE: It's hard to locate the problem when code is compressed, so it will be formatted before validation.`));
    console.log('');

    console.log(chalk.redBright('[es5-validator] Your code is not ES5 Compatible. It\'s not ready to ship to production, otherwise it will break you App on iOS 9 or iOS 10.'));
    console.log('');
    console.error(errors.join('\n'));
  }

  console.log('');
  console.log(chalk.cyan(`Give a star ❤️  if it helped you https://github.com/legend80s/es5-validator.`));
  console.log('');

  process.exit(compatible ? 0 : 1)
}


/**
 * @param {string} path
 */
function isRemoteFile(path) {
  return /^https?:\/\//.test(path);
}

async function fetchFileContent(filePath) {
  if (!isRemoteFile(filePath)) {
    return readFileSync(filePath).toString();
  }

  return fetch(filePath);
}

/**
 * @param {T[]} array
 * @param {(element: T, index: number) => Promise<any>} cb
 */
// async function asyncForEach(array, cb) {
//   for (let index = 0; index < array.length; index++) {
//     const element = array[index];

//     await cb(element, index, array);
//   }
// }


// let data;

// console.log('in getRequest');

// res
//   .on('data', d => {
//     console.log('data:', d);
//     data += d;
//   })
//   .on('end', () => {
//     console.log('end');
//     resolve(data);
//   })
//   .on('error', error => {
//     console.log('error:', error);
//     reject(error);
//   })
