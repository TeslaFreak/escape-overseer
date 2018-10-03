import React, { Component } from 'react';
import {
 BrowserRouter as Router,
 Route
} from 'react-router-dom'
import 'grommet/grommet.min.css';
import LiveView from './views/LiveView';
import ControlView from './views/ControlView';
import EventConfigView from './views/EventConfigView';
import MetricsView from './views/MetricsView';
import SettingsView from './views/SettingsView';
import MainOverlay from './MainOverlay';

class ViewManager extends Component {
    static Views() {
        return {
            control: <ControlView />,
            live: <LiveView />,
            eventconfig: <EventConfigView />,
            metrics: <MetricsView />,
            settings: <SettingsView />
        }
    }
    static View(props) {
        let name = props.location.search.substr(1);
        let view = ViewManager.Views()[name];
        if(view == null) 
            throw new Error("View '" + name + "' is undefined");
        if(name == 'live')
            return view;
        return <MainOverlay viewName={name}>{view}</MainOverlay>;
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