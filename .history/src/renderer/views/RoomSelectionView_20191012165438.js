import React, { Component } from 'react';
import PouchDB from 'pouchdb';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CreateNewRoomModal from '../components/CreateNewRoomModal.js';
import ChangeRoomNameModal from '../components/ChangeRoomNameModal.js';
import DeleteRoomModal from '../components/DeleteRoomModal.js';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
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
    contentPadding: {
        padding: theme.spacing(3),
    }
  });

class RoomSelectionView extends Component {  
  constructor(props) {
    super(props);
    this.db = new PouchDB('kittens');
    
    this.state = {newRoomModalOpen: false,
                changeNameModalOpen: false,
                deleteRoomModalOpen: false,
                anchorEl: null,
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

  closeModal = () => {
    this.setState({changeNameModalOpen: false, newRoomModalOpen: false, deleteRoomModalOpen: false});
  }

  refreshRoomList = async () => {
      try {
        const doc = await this.db.get("rooms");
      
    const forEachRoom = async (room) => {
        try {
            const blob = await this.db.getAttachment(room._id + "\\backgroundImg", "backgroundImgFile")
            console.log(blob)
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
} catch (err) {
    if (err.name == "not_found") {
        return;
    }
  }
};

  saveRoom = (name, id) => {
    if(id == null) {
        id=uuidv4();
    }
    this.db.get('rooms').then(function (doc) {
        let roomlist = doc.roomList;
        let roomIndex = roomlist.findIndex((obj => obj._id == id));
        if(roomIndex != -1) {
            roomlist[roomIndex].name = name;
        }
        else {
            roomlist.push({
                _id: id,
                name: name,
            });
        }
        doc.roomList = roomlist;
        this.db.put(doc).then(function() {
            this.refreshRoomList();
        }.bind(this)).catch(function (err) {
            console.log(err);
        });
    }.bind(this)).catch(function(err) {
        if(err.name=="not_found") {
            this.db.put({
                _id: 'rooms',
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

  openCardMenu = (e, id, name) => {
      e.stopPropagation();
      this.setState({roomIdToUpdate:id, roomNameToUpdate:name, anchorEl: e.currentTarget});
  }

  closeCardMenu = () => {
    //e.stopPropagation();
    this.setState({anchorEl: null});
}
  
  //TODO:[V1 Mandatory] add menu options to each card to delete room and rename room. possibly make it a right click menu
  /*<IconButton onClick={this.openCardMenu(room._id)}>
                                    <MoreVertIcon />
                                </IconButton>*/
  render() {
    const { classes } = this.props;
    return (
        <React.Fragment>
        <Grid container direction='column' className={classes.contentPadding}>
            <Grid>
            <Switch>
                <Route path='/control' render={(props) => <Typography variant='h6'>Choose a room to play:</Typography>} />
                <Route path='/roomconfig' render={(props) => <Typography variant='h6'>Choose a room to edit:</Typography>} />
            </Switch>  
            </Grid>
            <Grid container direction='row' spacing={2}>
            {!this.state.isLoading && this.state.rooms.map(room => (
                <Grid item>
                    <Card className={classes.card}>
                        <CardActionArea style={{width:'100%'}} onClick={() => this.props.changeRoom(room._id)} disableRipple>
                            <CardMedia className={classes.media} image={room.backgroundImage ? room.backgroundImage : null} />
                            <CardContent style={{paddingTop:0, paddingBottom:0, paddingRight: 0}}>
                                <Grid container dir='row' wrap='nowrap' justify='flexEnd' alignItems='center'>
                                    <Grid item style={{flexGrow:1, paddingTop:16,paddingBottom:16, overflow: "hidden"}}>
                                        <Typography variant='h6' align='center' style={{overflowWrap: 'break-word'}}>
                                            {room.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item >
                                        <IconButton onClick={e=>this.openCardMenu(e,room._id, room.name)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
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
                    <Grid container justify='center' alignItems='center'>
                        <Grid item>
                            <Typography variant='h6' align='center'>
                                Create New Room
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                </CardActionArea>
                </Card>
            </Grid>}
            </Grid>
        </Grid>
        <Popover 
            id='cardMenu'
            open={this.state.anchorEl != null}
            anchorEl={this.state.anchorEl}
            onClose={this.closeCardMenu}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            >
            <MenuList>
                <MenuItem onClick={this.changeNameModalOpen} align='start' size='small' >Change Room Name</MenuItem>
                <MenuItem onClick={this.deleteRoomModalOpen} align='start' size='small' >Delete Room</MenuItem>
            </MenuList>
        </Popover>
        <CreateNewRoomModal open={this.state.newRoomModalOpen} handleClose={this.closeModal} saveRoom={this.saveRoom}/>
        <ChangeRoomNameModal open={this.state.changeNameModalOpen} handleClose={this.closeModal} saveRoom={this.saveRoom} roomId={this.state.roomIdToUpdate} roomName={this.state.roomNameToUpdate}/>
        <DeleteRoomModal open={this.state.deleteRoomModalOpen} handleClose={this.closeModal} deleteRoom={this.deleteRoom} roomId={this.state.roomIdToUpdate} roomName={this.state.roomNameToUpdate}/>
        </React.Fragment>
    );
  }
}

export default withStyles(styles)(RoomSelectionView);