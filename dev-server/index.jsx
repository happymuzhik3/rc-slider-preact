import { h, render } from 'preact'
import Slider from '../src/Slider'
import Range from '../src/Range'
import '../src/index.css'

const parentStyle = {width: '400px', padding: '30px'}

render((
  <div>
    <div style={parentStyle}>
      <Slider />
    </div>
    <div style={parentStyle}>
      <Range />
    </div>
  </div>
),
  document.getElementById('root')
)
