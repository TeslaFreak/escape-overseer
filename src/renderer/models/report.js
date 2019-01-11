import PouchDB from 'pouchdb';
const electron = window.require('electron')

class Report {
  constructor(props) {
    super(props)
    this.db = new PouchDB('kittens');
    this.db.get(props.id);
  }

  getReport = (id) => {

  }


}