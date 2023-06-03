
// Database Name
const dbName = 'sites';

export class MongoRepository {


    constructor(client){
        this.client = client
        this.db = this.client.db(dbName)
    }

    create(data) {
        const collection = this.db.collection('sites');

        const query = { name: "Deli Llama" };
        const update = { $set: { name: "Deli Llama", address: "3 Nassau St" }};
        const options = { upsert: true };
        myColl.updateOne(query, update, options);
        console.log('create in mongo')
    }
}