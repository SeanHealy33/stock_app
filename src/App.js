import React, { Component } from 'react';
import './App.css';
import Chart from 'react-google-charts';

class App extends Component {
  constructor() {
    let code = new URL(window.location.href).searchParams.get('code');
    super();
    this.state = {
      loading: true,
      code: code,
      name: '',
      description: '',
      data: [],
    };
  }

  async  componentDidMount(){
    if (!this.state.code) {
      return;
    }
    try {
      let response = await fetch(`https://www.quandl.com/api/v1/datasets/WIKI/${this.state.code}.json?column=4&sort_order=asc&collapse=daily&trim_start=2015-01-01&trim_end=2019-12-31`);
      response = await response.json();
      let closeData = response.data;
      closeData.unshift(response.column_names);
      this.setState({
        code: response.code,
        name: response.name,
        data: closeData,
        description: response.description,
        loading: false
      });
    } catch (e) {
      this.setState({name: 'This Company Doesnt Exist', loading: false})
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="App">
          <header className="App-header">
            <h1>Loading Your stock :)</h1>
          </header>
        </div>
      );

    } else {
      return (
        <div className="App">
          <header className="App-header">
            <h1>Stock Info For {this.state.code}</h1>
          </header>
          <div>
          <br />
          {this.state.name}
          <Chart
            width={'100%'}
            height={'600px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={this.state.data}
            options={{
              hAxis: {
                title: 'Time',
              },
              vAxis: {
                title: 'Popularity',
              },
            }}
            rootProps={{ 'data-testid': '1' }}
            />
          </div>
        </div>
      );
    }
  }
}

export default App;
