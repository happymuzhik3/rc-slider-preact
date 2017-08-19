/** @jsx h */
import { h, render, Component } from 'preact'
import Slider from '../src/Slider'
import Range from '../src/Range'
import '../src/index.css'

const parentStyle = {width: '400px', padding: '30px'}

class App extends Component {
  render () {
    return <div>
      <div style={parentStyle}>
        <Slider
          min={10}
          max={40}
        />
      </div>
      <div style={parentStyle}>
        <Range
          min={10}
          max={40}
          step={1}
          defaultValue={[15, 35]}
        />
      </div>
    </div>
  }
}

render(<App />, document.getElementById('root'))
