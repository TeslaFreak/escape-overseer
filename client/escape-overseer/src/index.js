import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(<App />,document.getElementById('root'));
console.log("Qery params passed", global.location.search);