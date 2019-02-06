import React, { Component } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import Timer from "./Timer";
import "./App.css";

import { ServiceEndpoint } from "./stack.json";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
    };
  }

  // On application start, fetch list of completed pomodoros from the backend
  async componentDidMount() {
    const {
      pomodoros: { Items },
    } = await fetch(ServiceEndpoint).then(r => r.json());

    this.setState({ data: Items, isLoading: false });
  }

  // After finishing pomodoro send it to the backend using POST request
  onFinish = async (name, time) => {
    const pomodoro = {
      name,
      PomodoroName: name,
      Date: new Date(),
      Elapsed: time,
    };

    await fetch(`${ServiceEndpoint}/add`, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(pomodoro),
    });

    // Append completed pomodoro to the list
    this.setState({
      data: [...this.state.data, pomodoro],
    });
  };

  render() {
    return (
      <div className="App">
        <h1 className="App-title">Serverless KendoReact Pomodoros</h1>
        <Timer onFinish={this.onFinish} />
        {this.state.isLoading ? (
          <div>Loading...</div>
        ) : (
          <Grid data={this.state.data} classNames="grid">
            <GridColumn field="PomodoroName" title="Pomodoros Done" />
            <GridColumn field="Date" />
            <GridColumn field="Elapsed" />
          </Grid>
        )}
      </div>
    );
  }
}

export default App;
