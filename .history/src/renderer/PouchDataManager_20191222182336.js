const PouchDB = require('pouchdb');

class PouchDataManager {
    localDB = null;
    remoteDB = null;
    constructor(){
        var userCredentials = {
            "apikey": "PlBAe8WJdCegOw_-IK8uW4z7EIyjQFbz9lMTVL47RZ-0",
            "host": "https://d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix.cloudantnosqldb.appdomain.cloud",
            "iam_apikey_description": "Auto-generated for key e640a234-c2b2-44a5-8976-848c28553796",
            "iam_apikey_name": "EO-credentials-1",
            "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
            "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/be4505c39b6546968854990483294a9d::serviceid:ServiceId-4925cb6e-81e6-484b-baa8-7c7e7baa8623",
            "password": "f5d938cf6fd7518c297d084e9bf9898a4f36bd857fab032ab0ce25dcfc518e4d",
            "port": 443,
            "url": "https://d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix:f5d938cf6fd7518c297d084e9bf9898a4f36bd857fab032ab0ce25dcfc518e4d@d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix.cloudantnosqldb.appdomain.cloud",
            "username": "d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix"
          };
        const dbapikey = {
            "host": "https://d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix.cloudantnosqldb.appdomain.cloud",
            "username": "astoostratentreeregglats",
            "password": "a36ccca9742c97ae7eaafafd30cd5c8249f64872"
        }; 
        if (PouchDataManager.instance == null) {
            PouchDataManager.instance = this;
        }
        if (this.localDB == null) {
            this.localDB = new PouchDB('localdb');
        }
        if (this.remoteDB == null) {
            this.remoteDB = new PouchDB(dbapikey.host + '/es-cloudant-db-1',  {
                auth: dbapikey
            });
        }
     
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