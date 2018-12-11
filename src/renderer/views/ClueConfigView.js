import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PouchDB from 'pouchdb';
import { withStyles, withTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CommentIcon from '@material-ui/icons/Comment';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
const electron = window.require('electron')

//google fonts API Key: AIzaSyDipkbeiVIwQoDKHnvmFCFQ1EoFW1_jw9E

const styles = theme => ({
    videoPlayer: {
        objectFit: 'contain',
        objectPosition: '50% 50%',
        height: '100vh'
    }
});
class ClueConfigView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clues: [],
            checked: [0],
          };

        this.db = new PouchDB('kittens');
    }

    componentDidMount() {
        this.getClues();
    }

    editClue = () => {

    }

    deleteClue = (clueId) => {
        this.setState({clues: this.state.clues.filter(clue => clue.id != clueId)});
        this.updateClueDoc();
    }

    addClue = (e) => {
        if(e.nativeEvent.keyCode == 13 && document.getElementById('newClueTextField').value != '') {
            e.preventDefault();
            var stateClues = this.state.clues;
            this.setState({ clues: [...stateClues, {id: stateClues.length > 0 ? stateClues[stateClues.length-1].id+1 : 1, text:document.getElementById('newClueTextField').value}] });
            document.getElementById('newClueTextField').value = '';
            this.updateClueDoc();
        }
    }

    getClues = () => {
        return this.db.get('roomClues').then(function(doc) {
            this.setState({clues: doc.clues});
        }.bind(this)).catch(function(err) {
            console.log(err);
        }.bind(this))
    }

    updateClueDoc = () => {
        this.db.get('roomClues').then(function(doc) {
            doc.clues = this.state.clues;
            this.db.put(doc);
        }.bind(this)).catch(function(err) {
            this.db.put({
                _id: 'roomClues',
                clues: this.state.clues
                }
            );
            console.log(err);
        }.bind(this))
    }

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        this.setState({
          checked: newChecked,
        });
      };

    render() {
        const { classes } = this.props;
        return(
            <React.Fragment> 
                <TextField
                    id="newClueTextField"
                    placeholder="Add Clue"
                    multiline
                    fullWidth
                    variant='filled'
                    onKeyPress={this.addClue}
                />
                <List className={classes.root}>
                    {this.state.clues.map(clue => (
                    <ListItem key={clue.id} divider button onClick={this.handleToggle(clue.id)}>
                        {/* <Checkbox
                        color='secondary'
                        checked={this.state.checked.indexOf(clue.id) !== -1}
                        disableRipple
                        /> */}
                        <ListItemText primary={clue.text} />
                        <IconButton disableRipple aria-label="Comments">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => this.deleteClue(clue.id)} disableRipple aria-label="Comments">
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                    ))}
                </List>
            </React.Fragment>
        );
    }
}

export default  withStyles(styles)(ClueConfigView)