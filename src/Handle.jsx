/** @jsx h */
import { h, Component } from 'preact'
import PropTypes from 'prop-types'

export default class Handle extends Component {
  render () {
    const {
      className, vertical, offset, style, disabled, min, max, value, ...restProps
    } = this.props

    const postionStyle = vertical ? { bottom: `${offset}%` } : { left: `${offset}%` }
    const elStyle = {
      ...style,
      ...postionStyle
    }
    let ariaProps = {}
    if (value !== undefined) {
      ariaProps = {
        ...ariaProps,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-disabled': !!disabled
      }
    }
    return (
      <div
        role='slider'
        aria-valuemax={0}
        aria-valuemin={0}
        aria-valuenow={0}
        tabIndex='0'
        {...ariaProps}
        {...restProps}
        className={className}
        style={elStyle}
      />
    )
  }
}

Handle.propTypes = {
  className: PropTypes.string,
  vertical: PropTypes.bool,
  offset: PropTypes.number,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number
}
