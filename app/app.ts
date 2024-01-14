import {Kafka} from "./kafka";
import {Parser} from "./parser";
import {MongoRepository} from "./repository/mongo";
import {Site} from "./repository/site.type";
import { Server } from './server'

export class App {
    private kafka: Kafka;
    private parser: Parser
    private repository: MongoRepository
    private server: Server;

    constructor(server: Server, kafka: Kafka, parser: Parser, repository: MongoRepository) {
        this.kafka = kafka
        this.parser = parser
        this.repository = repository
        this.server = server
    }

    async run() {
        console.log('Service is running');

        // await this.consume();
        this.server.listen();

    }

    async consume() {
        await this.kafka.consume({topic: 'urls', groupId: 'spider'}, async (message) => {

            const url = new URL(message.value.toString())
            const content = await this.parser.parse(url)

            const site: Site = {
                content: content,
                domain: url.hostname,
                page: message.value.toString()
            }

            // TODO: обработать результат и в случае ошибки, писать в топик
            const res = await this.repository.create(site)

            await this.kafka.producer([
              { key: res.upsertedId.toHexString(), value: JSON.stringify({ id: res.upsertedId.toHexString() }) }
            ])
        })
    }
}