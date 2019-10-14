import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
const electron = window.require('electron')


const styles = theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

class DeleteRoomModal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    let roomName = document.getElementById('name-input').value;
    this.props.deleteRoom(roomName, this.props.roomId);
    this.props.handleClose();
  }

  render() {
    const { classes } = this.props;
    return (
      <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Enter the name of the new room:</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              id="name-input"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose}>
              Cancel
            </Button>
            <Button onClick={this.handleSubmit}>
              Create Room
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default withStyles(styles)(DeleteRoomModal);
