
import React from 'react';
import ReactDOM from 'react-dom';
import App from './renderer/App';
import { BrowserRouter } from 'react-router-dom'
import '../node_modules/grommet-css'

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
    ),document.getElementById('root'));