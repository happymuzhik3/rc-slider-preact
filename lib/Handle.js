'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _preact = require('preact');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx h */


var Handle = function (_Component) {
  _inherits(Handle, _Component);

  function Handle() {
    _classCallCheck(this, Handle);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Handle.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        vertical = _props.vertical,
        offset = _props.offset,
        style = _props.style,
        disabled = _props.disabled,
        min = _props.min,
        max = _props.max,
        value = _props.value,
        restProps = _objectWithoutProperties(_props, ['className', 'vertical', 'offset', 'style', 'disabled', 'min', 'max', 'value']);

    var postionStyle = vertical ? { bottom: offset + '%' } : { left: offset + '%' };
    var elStyle = _extends({}, style, postionStyle);
    var ariaProps = {};
    if (value !== undefined) {
      ariaProps = _extends({}, ariaProps, {
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-disabled': !!disabled
      });
    }
    return (0, _preact.h)('div', _extends({
      role: 'slider',
      'aria-valuemax': 0,
      'aria-valuemin': 0,
      'aria-valuenow': 0,
      tabIndex: '0'
    }, ariaProps, restProps, {
      className: className,
      style: elStyle
    }));
  };

  return Handle;
}(_preact.Component);

exports.default = Handle;


Handle.propTypes = {
  className: _propTypes2.default.string,
  vertical: _propTypes2.default.bool,
  offset: _propTypes2.default.number,
  style: _propTypes2.default.object,
  disabled: _propTypes2.default.bool,
  min: _propTypes2.default.number,
  max: _propTypes2.default.number,
  value: _propTypes2.default.number
};