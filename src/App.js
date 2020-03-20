import React, { useState, useEffect, useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import { css, cx } from 'emotion'
import { generate_lua, generate_yaml } from './Generator'
import VERSION from './version'
import ReactGA from 'react-ga'

const DATE_FORMAT = 'YYYY-MM-DD'
const SAVE_VERSION = '1'

const FormGroup = css`
padding-top: 2px;
padding-bottom: 2px;
margin: 5px;
`;

const Input = css`
padding: 5px;
border: 1px solid rgba(0,0,0,0.2);
margin: 0 5px 0 5px;
width: 65px;
`

const DateInput = css`
width: 127px;
`

const PreviewContainer = css`
width: 45%;
height: 250px;
`

const PreviewText = css`
width: 100%;
height: 100%;
`

const DownloadButton = css`
width: 100%;
height: 30px;
background: #00d1b2;
border-radius: 4px;
box-shadow: none;
border: 1px solid transparent;
:hover {
  background: #00c4a7;
}
:active {
  background: #00b89c;
}
`

const AttendanceDay = (props) => (
  <div className={css`
    margin: 5px;
    box-sizing: border-box;
    flex: 1 0 45%;
  `}>
    <label>Day {props.index+1} ID</label>
    <input className={Input} type="number" value={props.entry.itemId} onChange={(e) => props.changeItem(e.target.value, props.index)} />
    <label>Amount</label>
    <input className={Input} type="number" value={props.entry.amount} onChange={(e) => props.changeAmount(e.target.value, props.index)} />
  </div>
)

const App = () => {
    const now = dayjs()
    const [startDate, setStartDate] = useState(now.format(DATE_FORMAT))
    const [endDate, setEndDate] = useState(now.format(DATE_FORMAT))
    const [items, setItems] = useState([]);
    const changeItemProperty = useCallback((key, value, index) => {
      setItems([
        ...items.slice(0, index),
        { ...items[index], [key]: value },
        ...items.slice(index+1)
      ])
    }, [items])

    useEffect(() => {
      if(typeof(Storage) === 'undefined') {
        return
      }
    
      let items = localStorage.getItem('savedItems')
      const saveVersion = localStorage.getItem('saveVersion')
      try {
        if (saveVersion !== null && saveVersion === SAVE_VERSION) {
          items = JSON.parse(items)
        }
      } catch {
        items = Array(20).fill({ itemId: 501, amount: 1})
      }
      if (items !== null) {
        setItems(items)
      } else {
        setItems(Array(20).fill({ itemId: 501, amount: 1 }))
      }
    }, [])

    useEffect(() => {
      localStorage.setItem('saveVersion', SAVE_VERSION)
      localStorage.setItem('savedItems', JSON.stringify(items))
    }, [items])

    const luaFile = useMemo(
      () => generate_lua(items, startDate, endDate),
      [items, startDate, endDate]
    )

    const yamlFile = useMemo(
      () => generate_yaml(items, startDate, endDate),
      [items, startDate, endDate]
    )

    const downloadLua = useCallback(() => { 
      ReactGA.event({
        category: 'User',
        action: 'Downloaded Lua file'
      })
      download('CheckAttendance.lub', luaFile)
    }, [luaFile])
  
    const downloadYaml = useCallback(() => {
      ReactGA.event({
        category: 'User',
        action: 'Downloaded YAML file'
      })
      download('attendance.yml', yamlFile)
    }, [yamlFile])

    return (
      <div className={css`text-align: center;`}>
        <header className={css`
          background-color: #222;
          height: 100px;
          padding: 20px;
          color: white;
        `}>
          <h1 className={css`font-size: 1.5em; margin-bottom: 5px;`}>Attendance Generator v.{VERSION}</h1>
          <h5 className={css`margin-top: 0; margin-bottom: 5px;`}>for rAthena and RO Client</h5>
          <h6 className={css`margin-top: 10px;`}>&copy; 2018-2020 Jittapan P. All rights reserved.</h6>
        </header>
        <div className={css`margin-top: 10px;`}>
          <div className={css`
            display: flex;
            justify-content: center;
          `}>
            <div className={FormGroup}>
              <label htmlFor="start">Start date:</label>
              <input className={cx(Input, DateInput)} type="date" id="start" onChange={e => setStartDate(e.target.value)} value={startDate} />
            </div>
            <div className={FormGroup}>
              <label htmlFor="end">End date:</label>
              <input className={cx(Input, DateInput)} type="date" id="end" onChange={e => setEndDate(e.target.value)} min={startDate} value={endDate} />
            </div>
          </div>
          <div className={css`
            margin: 0 auto;
            display: flex;
            width: 100%;
            flex-direction: column;
            flex-wrap: wrap;
            justify-content: space-around;
            align-content: center;
            @media screen and (min-width: 640px) {
              width: 640px;
              flex-direction: row;
            }
          `}>
            {
              items.map((entry, index) =>
                <AttendanceDay
                  changeItem={(itemId, index) => changeItemProperty('itemId', itemId, index)}
                  changeAmount={(amount, index) => changeItemProperty('amount', amount, index)}
                  index={index}
                  entry={entry}
                />
              )
            }
          </div>
        </div>
        <div className={css`
          margin: 10px auto 0 auto;
          display: flex;
          justify-content: space-around;
        `}>
          <div className={PreviewContainer}>
            <h2>CheckAttendance.lub</h2>
            <textarea className={PreviewText} value={luaFile} />
            <button className={DownloadButton} onClick={downloadLua}>Download</button>
          </div>
          <div className={PreviewContainer}>
            <h2>attendance.yml</h2>
            <textarea className={PreviewText} value={yamlFile} />
            <button className={DownloadButton} onClick={downloadYaml}>Download</button>
          </div>
        </div>
      </div>
    )
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default App;
