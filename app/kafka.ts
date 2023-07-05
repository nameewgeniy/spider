import { Kafka as Kafkajs, Message } from 'kafkajs'

export class Kafka {
    private kafka: Kafkajs;
    constructor(brokers: string[]) {
        this.kafka = new Kafkajs({
            clientId: 'spider',
            brokers: brokers,
        })
    }
    
    async consume(args, func) {
        const consumer = this.kafka.consumer({ groupId: args.groupId })
        await consumer.connect()
        await consumer.subscribe({ topic: args.topic, fromBeginning: true })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => func(message),
        })
    }

    async producer(messages: Message[]) {
        const producer = this.kafka.producer({
            allowAutoTopicCreation: true,
            transactionTimeout: 30000
        })
        await producer.connect()
        await producer.send({
            topic: 'parser',
            messages: messages,
        })
    }
}