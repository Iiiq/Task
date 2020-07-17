import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ProgressApp from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <ProgressApp max={100} value={0} text={([value])=> String(value)+'%'}/>
  </React.StrictMode>,
  document.getElementById('root')
);
//text= {([value])=> '50'}
serviceWorker.unregister();
