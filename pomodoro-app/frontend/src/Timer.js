import React, { Component } from "react";
import { RadialGauge } from "@progress/kendo-react-gauges";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";

// Formats float representing minutes (e.g. 0.6666 of min) into human readable format (0:40 in this case)
const formatTime = (secs) => {
  const seconds = Math.floor(secs * 60);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const stringSeconds = String(displaySeconds).length === 1
      ? `0${displaySeconds}`
      : displaySeconds;

  return `${minutes}:${stringSeconds}`;
}

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      elapsed: 0,
      isRunning: false,
      isPause: false,
    };
  }

  tick() {
    // Increment state.elapsed by 1/60 (60th part of minute)
    this.setState(prevState => ({
      elapsed: prevState.elapsed + 1 / 60,
    }));

    // Stop running timer in pause mode
    if (this.state.isPause && this.state.elapsed >= 5) {
      this.onStop();
    // Stop running timer in Pomodoro mode
    } else if (!this.state.isPause && this.state.elapsed >= 25) {
      this.onStop();
    }
  }

  onStart = () => {
    this.setState({
      isRunning: true,
      elaspsed: 0,
    });

    // Invoke tick function every second
    this.ticker = setInterval(() => {
      this.tick();
    }, 1000);
  };

  onStop = () => {
    clearInterval(this.ticker);
    this.setState({
      elapsed: 0,
      isPause: !this.state.isPause,
      name: 'Done! Now 5 minutes of rest...'
    });

    if (!this.state.isPause) {
      this.props.onFinish(this.state.name, formatTime(this.state.elapsed));

      // Restart ticking, this time counting pause
      this.ticker = setInterval(() => {
        this.tick();
      }, 1000);  
    } else {
      this.setState({
        isRunning: false,
        name: '',
      })
    }
  };

  render() {
    const radialOptions = {
      pointer: {
        value: this.state.elapsed,
      },
      scale: {
        minorUnit: 1,
        majorUnit: 5,
        max: this.state.isPause ? 5 : 25,
      },
    };

    return this.state.isRunning ? (
      <div style={{ marginBottom: "20px" }}>
        <RadialGauge {...radialOptions} />
        <p>
          {this.state.name} - {formatTime(this.state.elapsed)}
        </p>
        <Button onClick={this.onStop}>Done!</Button>
      </div>
    ) : (
      <div style={{ marginBottom: "20px" }}>
        <div className="circle" onClick={this.onStart}>
          <div className="arrow-right" />
        </div>
        <Input
          label="Task Name"
          className="input"
          onChange={({ value }) => this.setState({ name: value })}
        />
      </div>
    );
  }
}
