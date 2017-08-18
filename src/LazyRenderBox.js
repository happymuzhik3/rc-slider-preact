import { h } from 'preact';
import Preact, { Component } from 'preact-compat';
import PropTypes from 'prop-types';

class LazyRenderBox extends Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    visible: PropTypes.bool,
    hiddenClassName: PropTypes.string,
  };
  shouldComponentUpdate(nextProps) {
    return nextProps.hiddenClassName || nextProps.visible;
  }
  render() {
    const { hiddenClassName, visible, ...props } = this.props;

    if (hiddenClassName || Preact.Children.count(props.children) > 1) {
      if (!visible && hiddenClassName) {
        props.className += ` ${hiddenClassName}`;
      }
      return <div {...props}/>;
    }

    return Preact.Children.only(props.children);
  }
}

export default LazyRenderBox;
