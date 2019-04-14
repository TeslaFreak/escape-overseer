import PouchDB from 'pouchdb';
const electron = window.require('electron')

class Clue {
  constructor(props) {
    super(props)
    this.db = new PouchDB('kittens');
    this.db.get(props.id);
  }

  getClue = (id) => {

  }


}