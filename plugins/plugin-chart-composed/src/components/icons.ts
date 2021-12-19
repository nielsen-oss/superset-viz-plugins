// @ts-ignore
import arrowUp, { ReactComponent as ArrowUp } from '../images/arrow-up.svg';
// @ts-ignore
import arrowDown, { ReactComponent as ArrowDown } from '../images/arrow-down.svg';
// @ts-ignore
import arrowLeft, { ReactComponent as ArrowLeft } from '../images/arrow-left.svg';
// @ts-ignore
import arrowRight, { ReactComponent as ArrowRight } from '../images/arrow-right.svg';
// @ts-ignore
import dot, { ReactComponent as Dot } from '../images/dot.svg';

export default {
  arrowUp: ArrowUp ?? arrowUp,
  arrowRight: ArrowRight ?? arrowRight,
  arrowLeft: ArrowLeft ?? arrowLeft,
  arrowDown: ArrowDown ?? arrowDown,
  circle: Dot ?? dot,
};
