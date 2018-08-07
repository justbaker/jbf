const fs = require('fs');
const interpreter = require("./src/interpreter");
const debug = process.argv.includes("-debug");

const readStdin = (file) => {
  let stdinput = '';
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    let chunk;
    while (chunk = process.stdin.read()) {
      stdinput += chunk;
    }
  });

  process.stdin.on('end', () => {
    // There will be a trailing \n from the user hitting enter. Get rid of it.
    const input = stdinput.replace(/\n$/, '')
      .split("");
    interpreter(file, input, debug)
  });

}

const main = () => {
  const file = fs.readFileSync(process.argv[2], 'utf8');
  process.stdin.isTTY ? interpreter(file, "", debug) : readStdin(file);
}

module.exports = main;
