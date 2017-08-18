'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _preact = require('preact');

var _preactCompat = require('preact-compat');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _util = require('./util');

var animUtil = _interopRequireWildcard(_util);

var _AnimateChild = require('./AnimateChild');

var _AnimateChild2 = _interopRequireDefault(_AnimateChild);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultKey = 'rc_animate_' + Date.now();

function getChildrenFromProps(props) {
  var children = props.children;
  if ((0, _preactCompat.isValidElement)(children)) {
    if (!children.key) {
      return (0, _preactCompat.cloneElement)(children, {
        key: defaultKey
      });
    }
  }
  return children;
}

function noop() {}

var Animate = function (_Component) {
  _inherits(Animate, _Component);

  function Animate(props) {
    _classCallCheck(this, Animate);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _initialiseProps.call(_this);

    _this.currentlyAnimatingKeys = {};
    _this.keysToEnter = [];
    _this.keysToLeave = [];

    _this.state = {
      children: (0, _util.toArrayChildren)(getChildrenFromProps(_this.props))
    };

    _this.childrenRefs = {};
    return _this;
  }

  Animate.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var showProp = this.props.showProp;
    var children = this.state.children;
    if (showProp) {
      children = children.filter(function (child) {
        return !!child.props[showProp];
      });
    }
    children.forEach(function (child) {
      if (child) {
        _this2.performAppear(child.key);
      }
    });
  };

  Animate.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this3 = this;

    this.nextProps = nextProps;
    var nextChildren = (0, _util.toArrayChildren)(getChildrenFromProps(nextProps));
    var props = this.props;
    // exclusive needs immediate response
    if (props.exclusive) {
      Object.keys(this.currentlyAnimatingKeys).forEach(function (key) {
        _this3.stop(key);
      });
    }
    var showProp = props.showProp;
    var currentlyAnimatingKeys = this.currentlyAnimatingKeys;
    // last props children if exclusive
    var currentChildren = props.exclusive ? (0, _util.toArrayChildren)(getChildrenFromProps(props)) : this.state.children;
    // in case destroy in showProp mode
    var newChildren = [];
    if (showProp) {
      currentChildren.forEach(function (currentChild) {
        var nextChild = currentChild && (0, _util.findChildInChildrenByKey)(nextChildren, currentChild.key);
        var newChild = void 0;
        if ((!nextChild || !nextChild.props[showProp]) && currentChild.props[showProp]) {
          var _cloneElement;

          newChild = (0, _preactCompat.cloneElement)(nextChild || currentChild, (_cloneElement = {}, _cloneElement[showProp] = true, _cloneElement));
        } else {
          newChild = nextChild;
        }
        if (newChild) {
          newChildren.push(newChild);
        }
      });
      nextChildren.forEach(function (nextChild) {
        if (!nextChild || !(0, _util.findChildInChildrenByKey)(currentChildren, nextChild.key)) {
          newChildren.push(nextChild);
        }
      });
    } else {
      newChildren = (0, _util.mergeChildren)(currentChildren, nextChildren);
    }

    // need render to avoid update
    this.setState({
      children: newChildren
    });

    nextChildren.forEach(function (child) {
      var key = child && child.key;
      if (child && currentlyAnimatingKeys[key]) {
        return;
      }
      var hasPrev = child && (0, _util.findChildInChildrenByKey)(currentChildren, key);
      if (showProp) {
        var showInNext = child.props[showProp];
        if (hasPrev) {
          var showInNow = (0, _util.findShownChildInChildrenByKey)(currentChildren, key, showProp);
          if (!showInNow && showInNext) {
            _this3.keysToEnter.push(key);
          }
        } else if (showInNext) {
          _this3.keysToEnter.push(key);
        }
      } else if (!hasPrev) {
        _this3.keysToEnter.push(key);
      }
    });

    currentChildren.forEach(function (child) {
      var key = child && child.key;
      if (child && currentlyAnimatingKeys[key]) {
        return;
      }
      var hasNext = child && (0, _util.findChildInChildrenByKey)(nextChildren, key);
      if (showProp) {
        var showInNow = child.props[showProp];
        if (hasNext) {
          var showInNext = (0, _util.findShownChildInChildrenByKey)(nextChildren, key, showProp);
          if (!showInNext && showInNow) {
            _this3.keysToLeave.push(key);
          }
        } else if (showInNow) {
          _this3.keysToLeave.push(key);
        }
      } else if (!hasNext) {
        _this3.keysToLeave.push(key);
      }
    });
  };

  Animate.prototype.componentDidUpdate = function componentDidUpdate() {
    var keysToEnter = this.keysToEnter;
    this.keysToEnter = [];
    keysToEnter.forEach(this.performEnter);
    var keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  };

  Animate.prototype.isValidChildByKey = function isValidChildByKey(currentChildren, key) {
    var showProp = this.props.showProp;
    if (showProp) {
      return (0, _util.findShownChildInChildrenByKey)(currentChildren, key, showProp);
    }
    return (0, _util.findChildInChildrenByKey)(currentChildren, key);
  };

  Animate.prototype.stop = function stop(key) {
    delete this.currentlyAnimatingKeys[key];
    var component = this.childrenRefs[key];
    if (component) {
      component.stop();
    }
  };

  Animate.prototype.render = function render() {
    var _this4 = this;

    var props = this.props;
    this.nextProps = props;
    var stateChildren = this.state.children;
    var children = null;
    if (stateChildren) {
      children = stateChildren.map(function (child) {
        if (child === null || child === undefined) {
          return child;
        }
        if (!child.key) {
          throw new Error('must set key for <rc-animate> children');
        }
        return (0, _preact.h)(
          _AnimateChild2.default,
          {
            key: child.key,
            ref: function ref(node) {
              return _this4.childrenRefs[child.key] = node;
            },
            animation: props.animation,
            transitionName: props.transitionName,
            transitionEnter: props.transitionEnter,
            transitionAppear: props.transitionAppear,
            transitionLeave: props.transitionLeave
          },
          child
        );
      });
    }
    var Component = props.component;
    if (Component) {
      var passedProps = props;
      if (typeof Component === 'string') {
        passedProps = _extends({
          className: props.className,
          style: props.style
        }, props.componentProps);
      }
      return (0, _preact.h)(
        Component,
        passedProps,
        children
      );
    }
    return children[0] || null;
  };

  return Animate;
}(_preactCompat.Component);

Animate.propTypes = {
  component: _propTypes2.default.any,
  componentProps: _propTypes2.default.object,
  animation: _propTypes2.default.object,
  transitionName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
  transitionEnter: _propTypes2.default.bool,
  transitionAppear: _propTypes2.default.bool,
  exclusive: _propTypes2.default.bool,
  transitionLeave: _propTypes2.default.bool,
  onEnd: _propTypes2.default.func,
  onEnter: _propTypes2.default.func,
  onLeave: _propTypes2.default.func,
  onAppear: _propTypes2.default.func,
  showProp: _propTypes2.default.string
};
Animate.defaultProps = {
  animation: {},
  component: 'span',
  componentProps: {},
  transitionEnter: true,
  transitionLeave: true,
  transitionAppear: false,
  onEnd: noop,
  onEnter: noop,
  onLeave: noop,
  onAppear: noop
};

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.performEnter = function (key) {
    // may already remove by exclusive
    if (_this5.childrenRefs[key]) {
      _this5.currentlyAnimatingKeys[key] = true;
      _this5.childrenRefs[key].componentWillEnter(_this5.handleDoneAdding.bind(_this5, key, 'enter'));
    }
  };

  this.performAppear = function (key) {
    if (_this5.childrenRefs[key]) {
      _this5.currentlyAnimatingKeys[key] = true;
      _this5.childrenRefs[key].componentWillAppear(_this5.handleDoneAdding.bind(_this5, key, 'appear'));
    }
  };

  this.handleDoneAdding = function (key, type) {
    var props = _this5.props;
    delete _this5.currentlyAnimatingKeys[key];
    // if update on exclusive mode, skip check
    if (props.exclusive && props !== _this5.nextProps) {
      return;
    }
    var currentChildren = (0, _util.toArrayChildren)(getChildrenFromProps(props));
    if (!_this5.isValidChildByKey(currentChildren, key)) {
      // exclusive will not need this
      _this5.performLeave(key);
    } else {
      if (type === 'appear') {
        if (animUtil.allowAppearCallback(props)) {
          props.onAppear(key);
          props.onEnd(key, true);
        }
      } else {
        if (animUtil.allowEnterCallback(props)) {
          props.onEnter(key);
          props.onEnd(key, true);
        }
      }
    }
  };

  this.performLeave = function (key) {
    // may already remove by exclusive
    if (_this5.childrenRefs[key]) {
      _this5.currentlyAnimatingKeys[key] = true;
      _this5.childrenRefs[key].componentWillLeave(_this5.handleDoneLeaving.bind(_this5, key));
    }
  };

  this.handleDoneLeaving = function (key) {
    var props = _this5.props;
    delete _this5.currentlyAnimatingKeys[key];
    // if update on exclusive mode, skip check
    if (props.exclusive && props !== _this5.nextProps) {
      return;
    }
    var currentChildren = (0, _util.toArrayChildren)(getChildrenFromProps(props));
    // in case state change is too fast
    if (_this5.isValidChildByKey(currentChildren, key)) {
      _this5.performEnter(key);
    } else {
      var end = function end() {
        if (animUtil.allowLeaveCallback(props)) {
          props.onLeave(key);
          props.onEnd(key, false);
        }
      };
      if (!(0, _util.isSameChildren)(_this5.state.children, currentChildren, props.showProp)) {
        _this5.setState({
          children: currentChildren
        }, end);
      } else {
        end();
      }
    }
  };
};

exports.default = Animate;