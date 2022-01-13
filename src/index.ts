import Interpreter from './interpreter';

const interpreter = new Interpreter();
const [, , ...args] = process.argv;

if (args.length === 0) {
  interpreter.repl();
} else if (args.length === 1) {
  interpreter.run(args[0]);
} else {
  console.log('usage: waddle <file>');
}
