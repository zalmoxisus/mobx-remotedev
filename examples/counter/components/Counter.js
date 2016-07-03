import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer class Counter extends Component {
  handleInc = () => {
    this.props.store.increment();
  };

  handleDec = () => {
    this.props.store.decrement()
  };

  render() {
    return (
      <div>
        Counter: {this.props.store.count} {'  '}
        <button onClick={this.handleInc}> + </button>
        <button onClick={this.handleDec}> - </button>
      </div>
    );
  }
}

export default Counter;
