# jbf

A [brainfuck](https://en.wikipedia.org/wiki/Brainfuck) interpreter in JS/Es6

## Usage

Running interpreter and hello world program:

```
$ ./bin/jbf test/hello-world.bf
Hello World!
```

## Installing

```
$ npm install -g jbf

$ jbf filename.bf

```

## Debugging

`./bin/jbf test/file.bf -debug`


## Commands

| Character | Meaning                                                              |
|---|------------------------------------------------------------------------------|
| > | increment the data pointer (to point to the next cell to the right).         |
| < | decrement the data pointer (to point to the next cell to the left).          |
| + | increment (increase by one) the byte at the data pointer.                    |
| \- | decrement (decrease by one) the byte at the data pointer.                    |
| . | output the byte at the data pointer.                                         |
| , | accept one byte of input, storing its value in the byte at the data pointer. |
| [ | if the byte at the data pointer is zero, then instead of moving the instruction pointer forward to the next command, jump it forward to the command after the matching ] command. |
| ] | if the byte at the data pointer is nonzero, then instead of moving the instruction pointer forward to the next command, jump it back to the command after the matching [ command. |


## Tests
* cat.bf        
* fibonacci.bf
* hello-world.bf
* quine.bf
* read-input.bf
* squares.bf
* subtract.bf
* wc.bf
