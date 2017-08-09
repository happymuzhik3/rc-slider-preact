import { h, Component } from 'preact';
import './App.css';

import Range from './Range';
import './assets/index.css';

class App extends Component {
  render() {
    return (
      <div class='App'>
        <Range/>
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