
import React from 'react';
import ReactDOM from 'react-dom';
import App from './renderer/App';
import { BrowserRouter } from 'react-router-dom'
import ViewManager from './renderer/ViewManager';
import './renderer/css/index.css';

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
    ),document.getElementById('root'));