import BoolClass from './BoolClass';
import DoubleClass from './DoubleClass';
import IntClass from './IntClass';
import NullClass from './NullClass';
import ObjectClass from './ObjectClass';
import PredefClass from './PredefClass';
import StringClass from './StringClass';
import VoidClass from './VoidClass';

import { Class } from '../../ast';

export default function getRuntime(): Class[] {
  return [
    new BoolClass(),
    new DoubleClass(),
    new IntClass(),
    new NullClass(),
    new ObjectClass(),
    new PredefClass(),
    new StringClass(),
    new VoidClass(),
  ];
}

export {
  BoolClass,
  DoubleClass,
  IntClass,
  NullClass,
  ObjectClass,
  PredefClass,
  StringClass,
  VoidClass };
