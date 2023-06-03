
// Database Name
const dbName = 'sites';

export class MongoRepository {


    constructor(client){
        this.client = client
        this.db = this.client.db(dbName)
    }

    create(data) {
        console.log('create in mongo')
    }
}