import { Children, findDOMNode } from 'preact-compat';
import keyCode from './KeyCode';

export function toArrayChildren(children) {
  const ret = [];
  Children.forEach(children, (child) => {
    ret.push(child);
  });
  return ret;
}

export function findChildInChildrenByKey(children, key) {
  let ret = null;
  if (children) {
    children.forEach((child) => {
      if (ret) {
        return;
      }
      if (child && child.key === key) {
        ret = child;
      }
    });
  }
  return ret;
}

export function findShownChildInChildrenByKey(children, key, showProp) {
  let ret = null;
  if (children) {
    children.forEach((child) => {
      if (child && child.key === key && child.props[showProp]) {
        if (ret) {
          throw new Error('two child with same key for <rc-animate> children');
        }
        ret = child;
      }
    });
  }
  return ret;
}

export function findHiddenChildInChildrenByKey(children, key, showProp) {
  let found = 0;
  if (children) {
    children.forEach((child) => {
      if (found) {
        return;
      }
      found = child && child.key === key && !child.props[showProp];
    });
  }
  return found;
}

export function isSameChildren(c1, c2, showProp) {
  let same = c1.length === c2.length;
  if (same) {
    c1.forEach((child, index) => {
      const child2 = c2[index];
      if (child && child2) {
        if ((child && !child2) || (!child && child2)) {
          same = false;
        } else if (child.key !== child2.key) {
          same = false;
        } else if (showProp && child.props[showProp] !== child2.props[showProp]) {
          same = false;
        }
      }
    });
  }
  return same;
}

export function mergeChildren(prev, next) {
  let ret = [];

  // For each key of `next`, the list of keys to insert before that key in
  // the combined list
  const nextChildrenPending = {};
  let pendingChildren = [];
  prev.forEach((child) => {
    if (child && findChildInChildrenByKey(next, child.key)) {
      if (pendingChildren.length) {
        nextChildrenPending[child.key] = pendingChildren;
        pendingChildren = [];
      }
    } else {
      pendingChildren.push(child);
    }
  });

  next.forEach((child) => {
    if (child && nextChildrenPending.hasOwnProperty(child.key)) {
      ret = ret.concat(nextChildrenPending[child.key]);
    }
    ret.push(child);
  });

  ret = ret.concat(pendingChildren);

  return ret;
}

export function isEventFromHandle(e, handles) {
  return Object.keys(handles)
    .some(key => e.target === findDOMNode(handles[key]));
}

export function isValueOutOfRange(value, { min, max }) {
  return value < min || value > max;
}

export function isNotTouchEvent(e) {
  return e.touches.length > 1 ||
    (e.type.toLowerCase() === 'touchend' && e.touches.length > 0);
}

export function getClosestPoint(val, { marks, step, min }) {
  const points = Object.keys(marks).map(parseFloat);
  if (step !== null) {
    const closestStep =
            Math.round((val - min) / step) * step + min;
    points.push(closestStep);
  }
  const diffs = points.map(point => Math.abs(val - point));
  return points[diffs.indexOf(Math.min(...diffs))];
}

export function getPrecision(step) {
  const stepString = step.toString();
  let precision = 0;
  if (stepString.indexOf('.') >= 0) {
    precision = stepString.length - stepString.indexOf('.') - 1;
  }
  return precision;
}

export function getMousePosition(vertical, e) {
  return vertical ? e.clientY : e.pageX;
}

export function getTouchPosition(vertical, e) {
  return vertical ? e.touches[0].clientY : e.touches[0].pageX;
}

export function getHandleCenterPosition(vertical, handle) {
  const coords = handle.getBoundingClientRect();
  return vertical ?
    coords.top + (coords.height * 0.5) :
    coords.left + (coords.width * 0.5);
}

export function ensureValueInRange(val, { max, min }) {
  if (val <= min) {
    return min;
  }
  if (val >= max) {
    return max;
  }
  return val;
}

export function ensureValuePrecision(val, props) {
  const { step } = props;
  const closestPoint = getClosestPoint(val, props);
  return step === null ? closestPoint :
    parseFloat(closestPoint.toFixed(getPrecision(step)));
}

export function pauseEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}

export function getKeyboardValueMutator(e) {
  switch (e.keyCode) {
    case keyCode.UP:
    case keyCode.RIGHT:
      return (value, props) => value + props.step;

    case keyCode.DOWN:
    case keyCode.LEFT:
      return (value, props) => value - props.step;

    case keyCode.END: return (value, props) => props.max;
    case keyCode.HOME: return (value, props) => props.min;
    case keyCode.PAGE_UP: return (value, props) => value + props.step * 2;
    case keyCode.PAGE_DOWN: return (value, props) => value - props.step * 2;

    default: return undefined;
  }
}

function isPointsEq(a1, a2) {
  return a1[0] === a2[0] && a1[1] === a2[1];
}

export function getAlignFromPlacement(builtinPlacements, placementStr, align) {
  const baseAlign = builtinPlacements[placementStr] || {};
  return {
    ...baseAlign,
    ...align,
  };
}

export function getPopupClassNameFromAlign(builtinPlacements, prefixCls, align) {
  const points = align.points;
  for (const placement in builtinPlacements) {
    if (builtinPlacements.hasOwnProperty(placement)) {
      if (isPointsEq(builtinPlacements[placement].points, points)) {
        return `${prefixCls}-placement-${placement}`;
      }
    }
  }
  return '';
}

export function saveRef(name, component) {
  this[name] = component;
}

export function isAppearSupported(props) {
  return (props.transitionName && props.transitionAppear) || props.animation.appear;
}

export function isEnterSupported(props) {
  return (props.transitionName && props.transitionEnter) || props.animation.enter;
}

export function isLeaveSupported(props) {
  return (props.transitionName && props.transitionLeave) || props.animation.leave;
}

export function allowAppearCallback(props) {
  return props.transitionAppear || props.animation.appear;
}

export function allowEnterCallback(props) {
  return props.transitionEnter || props.animation.enter;
}

export function allowLeaveCallback(props) {
  return props.transitionLeave || props.animation.leave;
}
