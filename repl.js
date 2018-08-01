// https://en.wikipedia.org/wiki/Brainfuck
//
const data = [];
let ptr = 0,
  openBrackets = 0,
  output = "",
  parsedTokens,
  tokens;

const debug = process.argv[2] == "-debug";
const callAll = (funs = []) => funs.forEach(Function.prototype.call, Function.prototype.call);
const print = (str) => process.stdout.write(str.toString());
const prompt = () => print("brainfuck >")
const debugLog = (funs) => console.dir({
  log: {
    ptr,
    data,
    output,
    openBrackets,
    parsedTokens
  }
});
prompt();

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
      case '.': // output
        //log("debug")
        const val = String.fromCharCode(data[ptr]);
        return output += val;
      case ',':
        // TODO GET input
      default: // ignore all else
        return;
    }
  }
}

// evaluate loop
const parseLoop = () => {
  openBrackets++;
  const funs = [];

  while (tokens[0] != "]") {
    const nextChar = tokens.shift();
    const nextFin = nextChar == '[' ? parseLoop(tokens) : parseToken(nextChar);
    funs.push(nextFin);
  }

  openBrackets--;
  tokens.shift(); // ignore ]

  return () => {
    while (data[ptr] > 0) callAll(funs);
  }
};

// evaluate parsed input
const evaluate = function (funs) {
  if (openBrackets == 0) {
    callAll(funs)
    print(output);
    if (debug) debugLog()
  } else {
    console.log("...inside loop");
  }
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

// handle imput
const repl = (data) => {
  tokens = data.toString()
    .trim()
    .split("");
  parsedTokens = tokens;
  parse();
  prompt();
}

const stdin = process.openStdin();
stdin.setRawMode(false)
stdin.resume();
stdin.setEncoding('utf8'); // i don't want binary, do you?
stdin.addListener("data", repl);
