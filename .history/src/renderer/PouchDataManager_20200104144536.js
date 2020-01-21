import PouchDB from 'pouchdb';

class PouchDataManager {
    constructor(){
        const dbapikey = {
            "host": "https://d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix.cloudantnosqldb.appdomain.cloud",
            "username": "astoostratentreeregglats",
            "password": "a36ccca9742c97ae7eaafafd30cd5c8249f64872"
        }; 
        this.localDB = new PouchDB('localdb');
        this.remoteDB = new PouchDB(dbapikey.host + '/es-cloudant-db-1',  {
            auth: dbapikey
        });
     
        //if(navigator.onLine) {
        this.localDB.sync(this.remoteDB, {
            live: true,
            retry: true
          }).on('change', function (change) {
            // yo, something changed!
          }).on('paused', function (info) {
            // replication was paused, usually because of a lost connection
          }).on('active', function (info) {
            // replication was resumed
          }).on('error', function (err) {
            // totally unhandled error (shouldn't happen)
          });
    }
}

export default PouchDataManager;