import './App.css';
import React from 'react';
import AutoComplete from './components/autoComplete';
import Details from './components/details';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      previews: [],
      current: 0
    }
  }

  onSelect = (data) => {
    let { previews } = this.state
    let curr = previews.length ?? 0;
    this.setState({ previews: [...previews, data], current: curr })
  }


  onNext = () => {
    let { current, previews } = this.state;
    if (current > 0 && current < previews.length) {
      this.setState(prevState => {
        return { current: prevState.current - 1 }
      })
    }
  }

  onPrev = () => {
    let { current, previews } = this.state;

    if (current < previews.length - 1) {
      this.setState(prevState => {
        return { current: prevState.current + 1 }
      })
    }
  }

  render() {
    const { previews, current } = this.state;
    return (
      <div className="App">
        <h3>Stock Widget Application</h3>
        <AutoComplete onSelectItem={this.onSelect} />
        {previews && previews.length > 0 && <div className='preview'>
          <Details stockList={previews} current={current} onPrev={this.onPrev} onNext={this.onNext} />
        </div>}
      </div>
    );
  }
}

export default App;
