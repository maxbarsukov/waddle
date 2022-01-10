import BoolClass from './BoolClass';
import NullClass from './NullClass';
import ObjectClass from './ObjectClass';
import PredefClass from './PredefClass';
import StringClass from './StringClass';
import VoidClass from './VoidClass';

import { Class } from '../../ast';

export default function getRuntime(): Class[] {
  return [
    new BoolClass(),
    new NullClass(),
    new ObjectClass(),
    new PredefClass(),
    new StringClass(),
    new VoidClass(),
  ];
}

export { BoolClass, NullClass, ObjectClass, PredefClass, StringClass, VoidClass };
