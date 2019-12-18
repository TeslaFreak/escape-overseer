const PouchDB = require('pouchdb');

class pouchDataManager {
    constructor(){
        const dbapikey = {
            "username": "astoostratentreeregglats",
            "password": "a36ccca9742c97ae7eaafafd30cd5c8249f64872"
        }; 
        if (PouchDataManager.instance == null) {
            PouchDataManager.instance = this;
        }
        if (PouchDataManager.localDB == null) {
            PouchDataManager.localDB = new PouchDB('localdb');
        }
        if (PouchDataManager.remoteDB == null) {
            PouchDataManager.remoteDB = new PouchDB(userCredentials.host + '/es-cloudant-db-1',  {
                auth: dbapikey
            });
        }
     
        PouchDataManager.localDB.sync(remoteDB, {
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

        return PouchDataManager.instance;
    }
}

const instance = new PouchDataManager();
Object.freeze(instance);

export default instance;