const http = require("http");
const https = require("https");

const { debug } = require('./debug');

/**
 * @param {string} url
 */
const getRequest = url => /https:\/\//.test(url) ? https : http;

const fetch = (url, { timeout = 10 * 1000 } = {}) => {
  return new Promise((resolve, reject) => {
    debug('url:', url);
    const req = getRequest(url).get(url, { timeout }, resp => {
      let body = '';

      resp.on('data', function(chunk) {
        body += chunk;
      });

      resp.on('end', function() {
        debug('body:', body);

        resolve(body);
      });
    }).on('timeout', () => {
      reject(new RangeError(`timeout for ${timeout}ms`))

      req.abort();
    }).on('error', (error) => {
      reject(error);
    });
  })
}

exports.fetch = fetch;

// async function main() {
//   console.time('costs')
//   // const url = 'https://www.w3.org/TR/PNG/iso_8859-1.txt'
//   // const url = 'https://raw.githubusercontent.com/waterchestnut/pinyin/master/index.js'
//   const url = 'https://g.alicdn.com/alilog/mlog/aplus_v2.js';
//   const content = await fetch(url, { timeout: 100 }).catch(error => {
//     console.error('error', error)
//   });
//   console.timeEnd('costs')

//   // console.log('content', content);
// }

// main();

