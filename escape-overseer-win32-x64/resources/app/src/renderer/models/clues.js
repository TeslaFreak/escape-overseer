import PouchDataManager from '../PouchDataManager';
const electron = window.require('electron')

class Clue {
  constructor(props) {
    super(props)
    this.db = PouchDataManager.localDB;
    this.db.get(props.id);
  }

  getClue = (id) => {

  }


}