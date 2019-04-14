import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PouchDB from 'pouchdb';

class FullscreenVideo extends Component {

    constructor(props) {
        super(props);
        this.state={playVideo:true};
        this.db = new PouchDB('kittens');
    }

    componentDidMount() {
        this.playVideo;
    }

    playVideo = () => {
        return this.db.getAttachment('breifVideo', 'breifVideo.mp4').then(function(blob) {
            var url = URL.createObjectURL(blob);
            var vidElement = document.getElementById('vid');
            vidElement.src = url;
        })
    }

    render() {
        return(
            <React.Fragment>
                <Button onClick={this.playVideo}>play video</Button>
                <video id='vid' controls={false} autoPlay={true} style={this.state.playVideo ? {} : { display: 'none' }}/>
            </React.Fragment>
        );
    }
}

export default FullscreenVideo