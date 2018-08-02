const data = [];
const fs = require('fs');

let ptr = 0,
  output = "",
  tokens,
  input = [];

const debug = process.argv.includes("-debug");

const source = fs.readFileSync(process.argv[2], 'utf8');
const callAll = (funs = []) => funs.forEach(Function.prototype.call, Function.prototype.call);
const print = (str) => process.stdout.write(str.toString());

const debugLog = () => console.info({
  log: {
    ptr,
    data,
    output
  }
});

// evaluate char
const parseToken = (token) => {
  return function evalToken() {
    switch (token.toString()) {
      case '>':
        ptr++;
        return ptr;
      case '<':
        ptr = ptr < 0 ? 0 : ptr - 1;
        return ptr;
      case '+':
        data[ptr] = data[ptr] || 0;
        return data[ptr]++;
      case '-':
        data[ptr] = data[ptr] || 0;
        return data[ptr]--;
      case '.':
        const val = String.fromCharCode(data[ptr]);
        return output += val;
      case ',':
        var c = input.shift();
        if (typeof c == "string") {
          data[ptr] = c.charCodeAt(0);
        }
      default: // ignore all else
        return;
    }
  }
}

// evaluate loop
const parseLoop = () => {
  const funs = [];

  while (tokens[0] != "]") {
    const nextChar = tokens.shift();
    funs.push(nextChar == '[' ? parseLoop(tokens) : parseToken(nextChar));
  }

  tokens.shift(); // ignore ]

  return () => {
    while (data[ptr] > 0) callAll(funs);
  }
};

// evaluate parsed input
const evaluate = function (funs) {
  callAll(funs)
  print(output);
  if (debug) debugLog()
};

// parse input
const parse = function () {
  const funs = [];
  while (tokens.length > 0) {
    const nextChar = tokens.shift();
    if (nextChar == '[') {
      funs.push(parseLoop(tokens));
    } else if (nextChar == ']') {
      tokens.shift(); // ignore ]
    } else {
      funs.push(parseToken(nextChar));
    }
  }

  return evaluate(funs)
};

// handle input
const evaluateFile = () => {
  tokens = source.toString()
    .trim()
    .split("");
  parse();
}

const readStdin = () => {
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
    input = stdinput.replace(/\n$/, '')
      .split("");
    evaluateFile();
  });

}

const main = () => {
  process.stdin.isTTY ? evaluateFile() : readStdin();
}

module.exports = main;
