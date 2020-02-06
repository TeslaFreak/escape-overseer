import PouchDataManager from '../PouchDataManager';
const electron = window.require('electron')

class Report {
  constructor(props) {
    super(props)
    this.db = PouchDataManager.localDB;
    this.db.get(props.id);
  }

  getReport = (id) => {

  }


}