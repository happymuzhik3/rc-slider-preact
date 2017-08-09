import { h, Component } from 'preact';
import './App.css';

import Range from './Range';
import './assets/index.css';

const st = {
  width: '30px',
  height: '30px',
  'margin-top': '-13px',
  'margin-left': '-16px',
}

class App extends Component {
  render() {
    return (
      <div class='App' style={{margin: '30px', width: '300px'}}>
        <Range 
          handleStyle={[st, st]}
          trackStyle={[{height: '8px', 'margin-top': '-2px'}]}
          railStyle={{height: '8px', 'margin-top': '-2px'}}
          allowCross={false}
          pushable={true}
        />
      </div>
    );
  }
}

export default App;

// Slider.Range = Range;
// Slider.Handle = Handle;
// Slider.createSliderWithTooltip = createSliderWithTooltip;

// export default Slider;
// export { Range, Handle, createSliderWithTooltip };