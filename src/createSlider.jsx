/** @jsx h */
import { h } from 'preact'
import addDOMEventListener from 'add-dom-event-listener'
import classNames from 'classnames'
import Steps from './Steps'
import Marks from './Marks'
import Handle from './Handle'
import * as util from './util'

function noop () {}

export default function createSlider (Component) {
  return class ComponentEnhancer extends Component {
    static displayName = `ComponentEnhancer(${Component.displayName})`;

    static defaultProps = {
      ...Component.defaultProps,
      prefixCls: 'rc-slider',
      className: '',
      min: 0,
      max: 100,
      step: 1,
      marks: {},
      handle ({ index, ...restProps }) {
        delete restProps.dragging
        return <Handle {...restProps} />
      },
      onBeforeChange: noop,
      onChange: noop,
      onAfterChange: noop,
      included: true,
      disabled: false,
      dots: false,
      vertical: false,
      trackStyle: [{}],
      handleStyle: [{}],
      railStyle: {},
      dotStyle: {},
      activeDotStyle: {}
    };

    constructor (props) {
      super(props)
      this.handlesRefs = {}
    }

    componentWillUnmount () {
      if (super.componentWillUnmount) super.componentWillUnmount()
      this.removeDocumentEvents()
    }

    onMouseDown = (e) => {
      if (e.button !== 0) { return }

      const isVertical = this.props.vertical
      let position = util.getMousePosition(isVertical, e)
      if (!util.isEventFromHandle(e, this.handlesRefs)) {
        this.dragOffset = 0
      } else {
        const handlePosition = util.getHandleCenterPosition(isVertical, e.target)
        this.dragOffset = position - handlePosition
        position = handlePosition
      }
      this.onStart(position)
      this.addDocumentMouseEvents()
      util.pauseEvent(e)
    }

    onTouchStart = (e) => {
      if (util.isNotTouchEvent(e)) return

      const isVertical = this.props.vertical
      let position = util.getTouchPosition(isVertical, e)
      if (!util.isEventFromHandle(e, this.handlesRefs)) {
        this.dragOffset = 0
      } else {
        const handlePosition = util.getHandleCenterPosition(isVertical, e.target)
        this.dragOffset = position - handlePosition
        position = handlePosition
      }
      this.onStart(position)
      this.addDocumentTouchEvents()
      util.pauseEvent(e)
    }

    onFocus = (e) => {
      const isVertical = this.props.vertical

      if (util.isEventFromHandle(e, this.handlesRefs)) {
        const handlePosition = util.getHandleCenterPosition(isVertical, e.target)

        this.dragOffset = 0
        this.onStart(handlePosition)
        util.pauseEvent(e)
      }
    }

    onBlur = (e) => {
      this.onEnd(e)
    }

    addDocumentTouchEvents () {
      // just work for Chrome iOS Safari and Android Browser
      this.onTouchMoveListener = addDOMEventListener(document, 'touchmove', this.onTouchMove)
      this.onTouchUpListener = addDOMEventListener(document, 'touchend', this.onEnd)
    }

    addDocumentMouseEvents () {
      this.onMouseMoveListener = addDOMEventListener(document, 'mousemove', this.onMouseMove)
      this.onMouseUpListener = addDOMEventListener(document, 'mouseup', this.onEnd)
    }

    removeDocumentEvents () {
      /* eslint-disable no-unused-expressions */
      this.onTouchMoveListener && this.onTouchMoveListener.remove()
      this.onTouchUpListener && this.onTouchUpListener.remove()

      this.onMouseMoveListener && this.onMouseMoveListener.remove()
      this.onMouseUpListener && this.onMouseUpListener.remove()
      /* eslint-enable no-unused-expressions */
    }

    onMouseMove = (e) => {
      if (!this.sliderRef) {
        this.onEnd()
        return
      }
      const position = util.getMousePosition(this.props.vertical, e)
      this.onMove(e, position - this.dragOffset)
    }

    onTouchMove = (e) => {
      if (util.isNotTouchEvent(e) || !this.sliderRef) {
        this.onEnd()
        return
      }

      const position = util.getTouchPosition(this.props.vertical, e)
      this.onMove(e, position - this.dragOffset)
    }

    onKeyDown = (e) => {
      if (this.sliderRef && util.isEventFromHandle(e, this.handlesRefs)) {
        this.onKeyboard(e)
      }
    }

    getSliderStart () {
      const slider = this.sliderRef
      const rect = slider.getBoundingClientRect()

      return this.props.vertical ? rect.top : rect.left
    }

    getSliderLength () {
      const slider = this.sliderRef
      if (!slider) {
        return 0
      }

      const coords = slider.getBoundingClientRect()
      return this.props.vertical ? coords.height : coords.width
    }

    calcValue (offset) {
      const { vertical, min, max } = this.props
      const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength())
      const value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min
      return value
    }

    calcValueByPos (position) {
      const pixelOffset = position - this.getSliderStart()
      const nextValue = this.trimAlignValue(this.calcValue(pixelOffset))
      return nextValue
    }

    calcOffset (value) {
      const { min, max } = this.props
      const ratio = (value - min) / (max - min)
      return ratio * 100
    }

    saveSlider = (slider) => {
      this.sliderRef = slider
    }

    saveHandle (index, handle) {
      this.handlesRefs[index] = handle
    }

    render () {
      const {
        prefixCls,
        className,
        marks,
        dots,
        step,
        included,
        disabled,
        vertical,
        min,
        max,
        children,
        maximumTrackStyle,
        style,
        railStyle,
        dotStyle,
        activeDotStyle
      } = this.props
      const { tracks, handles } = super.render()

      const sliderClassName = classNames(prefixCls, {
        [`${prefixCls}-with-marks`]: Object.keys(marks).length,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-vertical`]: vertical,
        [className]: className
      })
      return (
        <div
          ref={this.saveSlider}
          className={sliderClassName}
          onTouchStart={disabled ? noop : this.onTouchStart}
          onMouseDown={disabled ? noop : this.onMouseDown}
          onKeyDown={disabled ? noop : this.onKeyDown}
          onFocus={disabled ? noop : this.onFocus}
          onBlur={disabled ? noop : this.onBlur}
          style={style}
        >
          <div
            className={`${prefixCls}-rail`}
            style={{
              ...maximumTrackStyle,
              ...railStyle
            }}
          />
          {tracks}
          <Steps
            prefixCls={prefixCls}
            vertical={vertical}
            marks={marks}
            dots={dots}
            step={step}
            included={included}
            lowerBound={this.getLowerBound()}
            upperBound={this.getUpperBound()}
            max={max}
            min={min}
            dotStyle={dotStyle}
            activeDotStyle={activeDotStyle}
          />
          {handles}
          <Marks
            className={`${prefixCls}-mark`}
            vertical={vertical}
            marks={marks}
            included={included}
            lowerBound={this.getLowerBound()}
            upperBound={this.getUpperBound()}
            max={max}
            min={min}
          />
          {children}
        </div>
      )
    }
  }
}
