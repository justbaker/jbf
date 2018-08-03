const data = [];
let ptr = 0,
  output = "",
  input = [],
  tokens = [],
  debug = false;

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
const evalToken = (token) => {
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
        return output += String.fromCharCode(data[ptr]);
      case ',':
        let c = input.shift();
        if (typeof c == "string") data[ptr] = c.charCodeAt(0);
        return data[ptr];
      default: // ignore all else
        return;
    }
  }
}

// evaluate loop
const evalLoop = () => {
  const funs = [];

  while (tokens[0] != "]") {
    const nextChar = tokens.shift();
    funs.push(nextChar == '[' ? evalLoop(tokens) : evalToken(nextChar));
  }

  tokens.shift(); // ignore ]

  return () => {
    while (data[ptr] > 0) callAll(funs);
  }
};

// evaluate parsed input
const evalProgram = function (funs) {
  callAll(funs)
  print(output);
  if (debug) debugLog()
};

// parse input
const parse = function (tokens, debug) {
  const funs = [];
  while (tokens.length > 0) {
    const nextChar = tokens.shift();
    if (nextChar == '[') {
      funs.push(evalLoop(tokens));
    } else if (nextChar == ']') {
      tokens.shift(); // ignore ]
    } else {
      funs.push(evalToken(nextChar));
    }
  }

  return evalProgram(funs, debug)
};

// handle input
module.exports = (code, stdin, isDebug) => {
  debug = isDebug;
  input = stdin;
  tokens = [...String(code)
    .trim()
  ];
  parse(tokens);
};
