// Database Name
import {Collection, Db, MongoClient} from "mongodb";
import {Site} from "./site.type";

export class MongoRepository {
    private client: MongoClient;
    private db: Db;
    private dbName: string = 'sites';
    private siteCollection: Collection<Site>;


    constructor(client){
        this.client = client
        this.db = this.client.db(this.dbName)
        this.siteCollection = this.db.collection('sites');

        this.siteCollection.createIndex({page: 1}, {unique: true}).then(r => console.log('Index created'));
    }

    async create(site: Site) {
        const filter = { page: site.page };
        const option = { upsert: true };
        return await this.siteCollection.updateOne(filter, { $set: site }, option);
    }

    async find(site: Site): Promise<Site> {
        const collection: Collection<Site> = this.db.collection('sites');

        return await collection.findOne(site)
    }

    async drop() {
        return this.siteCollection.drop();
    }
}