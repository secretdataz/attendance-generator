import React, { Component } from 'react'
import dayjs from 'dayjs'
import { ToastContainer, toast } from 'react-toastify'
import { Container, Row, Col } from 'react-grid-system'
import './App.css'
import 'react-toastify/dist/ReactToastify.min.css'

import { generate_lua, generate_yaml } from './Generator'
import VERSION from './version'

const DATE_FORMAT = 'YYYY-MM-DD'

const AttendanceDay = (props) => (
  <span className="day">
    <label>Day {props.index+1} ID</label>
    <input type="number" value={props.entry.item_id} onChange={(e) => props.changeItem(e.target.value, props.index)} />
    <label>Amount</label>
    <input type="number" value={props.entry.amount} onChange={(e) => props.changeAmount(e.target.value, props.index)} />
  </span>
)

class App extends Component {
  constructor(props) {
    let now = dayjs()
    super(props)
    this.state = {
      start_date: now.format(DATE_FORMAT),
      end_date: now.add(20, 'day').format(DATE_FORMAT),
      items: Array(20).fill({ item_id: 501, amount: 1 })
    }

    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.changeItem = this.changeItem.bind(this)
    this.changeAmount = this.changeAmount.bind(this)
  }

  handleStartChange(e) {
    this.setState({
      start_date: e.target.value
    })
  }

  handleEndChange(e) {
    let date = e.target.value
    if(dayjs(date).isBefore(dayjs(this.state.start_date))) {
      toast.error('Invalid option. End date is before start date.')
      return
    }

    this.setState({
      end_date: e.target.value
    })
  }

  changeItem(item_id, index) {
    this.setState((prevState) => ({
      ...prevState,
      items: [
        ...prevState.items.slice(0, index),
        { item_id, amount: prevState.items[index].amount },
        ...prevState.items.slice(index+1)
      ]
    }))
  }

  changeAmount(amount, index) {
    this.setState((prevState) => ({
      ...prevState,
      items: [
        ...prevState.items.slice(0, index),
        { item_id: prevState.items[index].item_id, amount },
        ...prevState.items.slice(index+1)
      ]
    }))
  }

  render() {
    return (
      <div className="App">
        <ToastContainer/>
        <header className="App-header">
          <h1 className="App-title">Attendance Generator</h1>
          <h5>for rAthena and RO Client</h5>
        </header>
        <Container className="container App-content">
          <Row>
            <Col md={6}>
              <div className="form-group">
                <label htmlFor="start">Start date:</label>
                <input type="date" id="start" onChange={this.handleStartChange} value={this.state.start_date} />
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group">
                <label htmlFor="end">End date:</label>
                <input type="date" id="end" onChange={this.handleEndChange} min={this.state.start_date} value={this.state.end_date} />
              </div>
            </Col>
          </Row>
          <Row>
              {
                this.state.items.map((entry, index) =>
                  <Col md={6}>
                    <AttendanceDay changeItem={this.changeItem} changeAmount={this.changeAmount} index={index} entry={entry} />
                  </Col>
                )
              }
          </Row>
          <Row>
            <Col sm={12}>
              <textarea style={{ minWidth: "40%", height: "200px" }} value={generate_lua(this.state)} />
            </Col>
            <Col sm={12}>
              <textarea style={{ minWidth: "40%", height: "200px" }} value={generate_yaml(this.state)} />
            </Col>
          </Row>
        </Container>
        <p>Attendance Generator v.{VERSION} &copy; 2018 Jittapan P. All rights reserved.</p>
      </div>
    );
  }
}

export default App;
