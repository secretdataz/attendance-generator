import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import ReactGA from 'react-ga'

ReactGA.initialize('UA-145842310-1')
ReactGA.pageview('/')
ReactDOM.render(<App />, document.getElementById('root'))
