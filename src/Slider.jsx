/** @jsx h */
import { h, Component } from 'preact'
import Track from './Track'
import createSlider from './createSlider'
import * as util from './util'

class Slider extends Component {
  constructor (props) {
    super(props)

    const defaultValue = props.defaultValue !== undefined
      ? props.defaultValue : props.min
    const value = props.value !== undefined
      ? props.value : defaultValue

    this.state = {
      value: this.trimAlignValue(value),
      dragging: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!('value' in nextProps || 'min' in nextProps || 'max' in nextProps)) return

    const prevValue = this.state.value
    const value = nextProps.value !== undefined
      ? nextProps.value : prevValue
    const nextValue = this.trimAlignValue(value, nextProps)
    if (nextValue === prevValue) return

    this.setState({ value: nextValue })
    if (util.isValueOutOfRange(value, nextProps)) {
      this.props.onChange(nextValue)
    }
  }

  onChange (state) {
    const props = this.props
    const isNotControlled = !('value' in props)
    if (isNotControlled) {
      this.setState(state)
    }

    const changedValue = state.value
    props.onChange(changedValue)
  }

  onStart (position) {
    this.setState({ dragging: true })
    const props = this.props
    const prevValue = this.getValue()
    props.onBeforeChange(prevValue)

    const value = this.calcValueByPos(position)
    this.startValue = value
    this.startPosition = position

    if (value === prevValue) return

    this.onChange({ value })
  }

  onEnd = () => {
    this.setState({ dragging: false })
    this.removeDocumentEvents()
    this.props.onAfterChange(this.getValue())
  }

  onMove (e, position) {
    util.pauseEvent(e)
    const { value: oldValue } = this.state
    const value = this.calcValueByPos(position)
    if (value === oldValue) return

    this.onChange({ value })
  }

  onKeyboard (e) {
    const valueMutator = util.getKeyboardValueMutator(e)

    if (valueMutator) {
      util.pauseEvent(e)
      const state = this.state
      const oldValue = state.value
      const mutatedValue = valueMutator(oldValue, this.props)
      const value = this.trimAlignValue(mutatedValue)
      if (value === oldValue) return

      this.onChange({ value })
    }
  }

  getValue () {
    return this.state.value
  }

  getLowerBound () {
    return this.props.min
  }

  getUpperBound () {
    return this.state.value
  }

  trimAlignValue (v, nextProps = {}) {
    const mergedProps = { ...this.props, ...nextProps }
    const val = util.ensureValueInRange(v, mergedProps)
    return util.ensureValuePrecision(val, mergedProps)
  }

  render () {
    const {
      prefixCls,
      vertical,
      included,
      disabled,
      minimumTrackStyle,
      trackStyle,
      handleStyle,
      min,
      max,
      handle: handleGenerator
    } = this.props
    const { value, dragging } = this.state
    const offset = this.calcOffset(value)
    const handle = handleGenerator({
      className: `${prefixCls}-handle`,
      vertical,
      offset,
      value,
      dragging,
      disabled,
      min,
      max,
      style: handleStyle[0] || handleStyle,
      ref: h => this.saveHandle(0, h)
    })

    const _trackStyle = trackStyle[0] || trackStyle
    const track = (
      <Track
        className={`${prefixCls}-track`}
        vertical={vertical}
        included={included}
        offset={0}
        length={offset}
        style={{
          ...minimumTrackStyle,
          ..._trackStyle
        }}
      />
    )

    return { tracks: track, handles: handle }
  }
}

export default createSlider(Slider)
