// https://en.wikipedia.org/wiki/Brainfuck
//
const data = [];
let ptr = 0,
  openBrackets = 0,
  output = "";

const print = (str) => process.stdout.write(str.toString());
const prompt = () => print("brainfuck $ ")
const log = (mode) => console.dir({
  BRAINFUCK_LOG: {
    mode,
    ptr,
    data,
    output
  }
});

console.log("Justin's Brainfuck interpreter ~-~ POC");
[1, 2, 3].forEach(_ => print("=~==~=*=*=~==~=~="));
console.log("")
log("boot");
[1, 2, 3].forEach(_ => print("=~==~=*=*=~==~=~="));
console.log("")
prompt();

const evalToken = (token) => {
  switch (token.toString()) {
    case '>':
      ptr++;
    case '<':
      ptr--;
      if (ptr < 0) ptr = 0;
    case '+':
      data[ptr] = data[ptr] || 0;
      data[ptr]++;
    case '-':
      data[ptr] = data[ptr] || 0;
      data[ptr]--;
    case '.': // output
      //log("debug")
      const val = String.fromCharCode(data[ptr]);
      output += val;
    case ',':
      // TODO GET input
    default: // ignore all else
      return;
  }
}

const bracket = function (tokens) {
  const funs = [];
  let nextChar = tokens.shift();
  while (tokens[0] != "]") {
    if (nextChar == undefined) {
      return;
    } else if (nextChar == '[') {
      funs.push(bracket.bind(this, tokens));
    } else {
      funs.push(evalToken.bind(this, nextChar));
    }

  }
  while (data[ptr] > 0) funs.forEach(f => f())
};

const EVAL = function (tokens) {
  const funs = [];
  while (tokens.length > 0) {
    let nextChar = tokens.shift();
    if (nextChar == '[') {
      openBrackets++;
      funs.push(bracket.bind(this, tokens));
    } else if (nextChar == ']') {
      openBrackets--;
      nextChar = tokens.shift();
    } else {
      funs.push(evalToken.bind(this, nextChar));
    }
  }

  funs.forEach(f => f())

  print(output)
};

const repl = (data) => {
  EVAL(data.toString()
    .trim()
    .split(""));
  prompt();
}

const stdin = process.openStdin();
stdin.setRawMode(false)
stdin.resume();
stdin.setEncoding('utf8'); // i don't want binary, do you?
stdin.addListener("data", repl);
