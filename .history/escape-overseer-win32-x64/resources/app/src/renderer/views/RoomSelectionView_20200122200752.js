import React, { Component } from 'react';
import PouchDataManager from '../PouchDataManager';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CreateNewRoomModal from '../components/CreateNewRoomModal.js';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import ReportView from './ReportView';
import { Switch, Route, Redirect } from 'react-router-dom'
import { withStyles, withTheme } from '@material-ui/core/styles';
const uuidv4 = require('uuid/v4');

const styles = theme => ({
    card: {
      width: 245,
    },
    media: {
      height: 300,
      backgroundColor: '#4f5b62'
    },
  });

class RoomSelectionView extends Component {  
  constructor(props) {
    super(props);
    this.db = PouchDataManager.localDB;
    
    this.state = {modalOpen: false,
                rooms: [],
                isLoading: true}
  }

  async componentDidMount() {
    await this.refreshRoomList();
    this.setState({isLoading: false})
  }

  openNewRoomModal = () => {
    this.setState({modalOpen: true});
  }

  closeNewRoomModal = () => {
    this.setState({modalOpen: false});
  }

  refreshRoomList = async () => {
    const doc = await this.db.get(electron.remote.getGlobal('customerEmail') + '/rooms');
    if (!doc.roomList) {
        return;
    }

    const forEachRoom = async (room) => {
        try {
            const blob = await this.db.getAttachment(room._id + '/backgroundImg', "backgroundImgFile")
            room.backgroundImage = URL.createObjectURL(blob);
        } catch (err) {
            if (err.name == "not_found") {
                room.backgroundImage = null;
            } else {
                console.log(err);
            }
        }
        return room;
    };

    const rooms = await Promise.all(doc.roomList.map(room => forEachRoom(room)));
    this.setState({ rooms });
};

  saveNewRoom = (name) => {
    let id=uuidv4();
    this.db.get(electron.remote.getGlobal('customerEmail') + '/rooms').then(function (doc) {
        let roomlist = doc.roomList;
        roomlist.push({
            _id: id,
            name: name,
        });
        doc.roomList = roomlist;
        doc.customerId = electron.remote.getGlobal('customerId');
        this.db.put(doc).then(function() {
            this.refreshRoomList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    }.bind(this)).catch(function(err) {
        if(err.name=="not_found") {
            this.db.put({
                _id: electron.remote.getGlobal('customerEmail') + '/rooms',
                customerId: electron.remote.getGlobal('customerId'),
                roomList: [{
                    _id: id,
                    name: name,
                }]
            }).then(function() {
                this.refreshRoomList();
            }.bind(this)).catch(function (err) {
                console.log(err);
          });
        }
        else {
            console.log(err);
        }
        }.bind(this));
  }
  
  render() {
    const { classes } = this.props;
    return (
        <React.Fragment>
        <Grid container direction='column'>
            <Grid>
            <Switch>
                <Route path='/control' render={(props) => <Typography variant='h6'>Choose a room to play:</Typography>} />
                <Route path='/roomconfig' render={(props) => <Typography variant='h6'>Choose a room to edit:</Typography>} />
            </Switch>  
            </Grid>
            <Grid container direction='row' spacing={16}>
            {!this.state.isLoading && this.state.rooms.map(room => (
                <Grid item>
                    <Card className={classes.card}>
                        <CardActionArea style={{width:'100%'}} onClick={() => this.props.changeRoom(room._id)}>
                            <CardMedia className={classes.media} image={room.backgroundImage ? room.backgroundImage : null} />
                            <CardContent>
                                <Typography variant='h6' align='center'>
                                {room.name}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
            {!this.state.isLoading && <Grid item>
                <Card className={classes.card}>
                <CardActionArea style={{width:'100%'}} onClick={this.openNewRoomModal}>
                <CardMedia className={classes.media}>
                    <Grid container justify='center' alignItems='center' style={{height:'100%'}}>
                        <Grid item>
                            <AddIcon color='secondary' style={{width:60, height:'100%'}}></AddIcon>
                        </Grid>
                    </Grid>
                </CardMedia>
                <CardContent>
                    <Typography variant='h6' align='center'>
                    Create New Room
                    </Typography>
                </CardContent>
                </CardActionArea>
                </Card>
            </Grid>}
            </Grid>
        </Grid>
        <CreateNewRoomModal open={this.state.modalOpen} handleClose={this.closeNewRoomModal} saveNewRoom={this.saveNewRoom}/>
        </React.Fragment>
    );
  }
}

export default withStyles(styles)(RoomSelectionView);