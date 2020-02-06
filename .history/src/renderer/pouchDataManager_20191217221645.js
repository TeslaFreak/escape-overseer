const PouchDB = require('pouchdb');

export default class pouchDataManager {

    let dbapikey = {
        "username": "astoostratentreeregglats",
        "password": "a36ccca9742c97ae7eaafafd30cd5c8249f64872"
    }; 
    
    static localDB = new PouchDB('localdb');
    static remoteDB = new PouchDB(userCredentials.host + '/es-cloudant-db-1',  {
        auth: dbapikey
    });

    localDB.sync(remoteDB, {
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

    static getInstance() {
        if (pouchDataManager.localDB == null) {
            pouchDataManager.localDB = new pouchDataManager();
        }

        return this.localDB;
    }
}