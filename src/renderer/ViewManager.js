import React, { Component } from 'react';
import {
 BrowserRouter as Router,
 Route
} from 'react-router-dom'
import LiveView from './LiveView';
import 'grommet/grommet.min.css';
import ControlView from './ControlView';
import MainOverlay from './MainOverlay';

class ViewManager extends Component {
    static Views() {
        return {
            control: <ControlView />,
            live: <LiveView />
        }
    }
    static View(props) {
        let name = props.location.search.substr(1);
        let view = ViewManager.Views()[name];
        if(view == null) 
            throw new Error("View '" + name + "' is undefined");
        if(name == 'live')
            return view;
        return <MainOverlay>{view}</MainOverlay>;
    }
    
    render() {
        return (
            <Router>
                <div>
                    <Route path='/' component={ViewManager.View}/>
                </div>
            </Router>
        );
    }
}

export default ViewManager