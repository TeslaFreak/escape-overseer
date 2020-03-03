const PouchDB = require('pouchdb');
const electron = window.require('electron');

class PouchDataManager {
    localDB = null;
    remoteDB = null;
    constructor(){
        this.customerId = electron.remote.getGlobal('customerId');
        
        const dbapikey = {
            "host": "https://d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix.cloudantnosqldb.appdomain.cloud",
            "username": "iningleaturoubjoympledar",
            "password": "974307266de0f874c65b6d54f7bf89697ba2b043"
        }; 
        if (PouchDataManager.instance == null) {
            PouchDataManager.instance = this;
        }
        if (this.localDB == null) {
            this.localDB = new PouchDB('localdb', {auto_compaction: true});
        }
        if (this.remoteDB == null) {
            this.remoteDB = new PouchDB(dbapikey.host + '/eo-cloudant-db-1',  {
                auth: dbapikey
            });
        }
     
        this.localDB.get('_design/mydesign').then(function (doc) {
            console.log('design doc exists');
        }.bind(this)).catch(function(err) {
            if(err.name=="not_found") {
                this.localDB.put(
                    {
                        _id: '_design/mydesign',
                        filters: {
                            customerFilter: function (doc, req) {
                            return doc.userId === req.query.userId;
                          }.toString()
                        }
                      }
                )
            }
            else {
                console.log(err);
            }
        }.bind(this));
            
        this.localDB.sync(this.remoteDB, {
            live: true,
            retry: true,
            filter: 'mydesign/customerFilter',
            query_params: {customerId: this.customerId}
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

const getDatabase = () => {
    if(navigator.onLine) {
        return this.remoteDB;
    } else {
        return this.localDB;
    }
};

Object.freeze(instance);

export default instance;