import * as process from 'process';
// @ts-ignore
import * as readline from 'readline-sync';
import Evaluator from '../Evaluator';

import {
  Class,
  Formal,
  Function,
  FunctionCall,
  NativeExpression,
  Reference,
} from '../../ast';

import Obj from '../Obj';
import { Types } from '../../types/Types';

export default class IOClass extends Class {
  constructor() {
    super(Types.IO);

    this.superClass = Types.Object;

    this.functions.push(new Function('println', Types.Void, new NativeExpression((context) => {
      const call = new FunctionCall('toString', [], new Reference('s'));
      const s = Evaluator.evaluate(context, call);

      console.log(s.get('value'));
      return Obj.create(context, Types.Void);
    }), [new Formal('s', Types.Object)]));

    this.functions.push(new Function('println', Types.Void, new NativeExpression((context) => {
      console.log();
      return Obj.create(context, Types.Void);
    }), []));

    this.functions.push(new Function('readString', Types.String, new NativeExpression((context) => {
      process.stdin.pause();

      const prompt = context.store.get(context.environment.find('prompt')!);
      const input = readline.question(prompt.get('value'));

      console.log();

      const value = Obj.create(context, Types.String);

      value.set('value', input);
      process.stdin.resume();
      return value;
    }), [new Formal('prompt', Types.String)]));

    this.functions.push(new Function('readInt', Types.Int, new NativeExpression((context) => {
      process.stdin.pause();

      const prompt = context.store.get(context.environment.find('prompt')!);
      const input = readline.questionInt(prompt.get('value'));

      console.log();

      const value = Obj.create(context, Types.Int);

      value.set('value', input);
      process.stdin.resume();
      return value;
    }), [new Formal('prompt', Types.String)]));

    this.functions.push(new Function('readDouble', Types.Double, new NativeExpression((context) => {
      process.stdin.pause();

      const prompt = context.store.get(context.environment.find('prompt')!);
      const input = readline.questionFloat(prompt.get('value'));

      console.log();

      const value = Obj.create(context, Types.Double);

      value.set('value', input);
      process.stdin.resume();
      return value;
    }), [new Formal('prompt', Types.String)]));

    this.functions.push(new Function('readString', Types.String, new NativeExpression((context) => {
      process.stdin.pause();
      const input = readline.question('');

      console.log();

      const value = Obj.create(context, Types.String);

      value.set('value', input);
      process.stdin.resume();
      return value;
    }), []));

    this.functions.push(new Function('readInt', Types.Int, new NativeExpression((context) => {
      process.stdin.pause();
      const input = readline.questionInt('');

      console.log();

      const value = Obj.create(context, Types.Int);

      value.set('value', input);
      process.stdin.resume();
      return value;
    }), []));

    this.functions.push(new Function('readDouble', Types.Double, new NativeExpression((context) => {
      process.stdin.pause();
      const input = readline.questionFloat('');

      console.log();

      const value = Obj.create(context, Types.Double);

      value.set('value', input);
      process.stdin.resume();
      return value;
    }), []));
  }
}
