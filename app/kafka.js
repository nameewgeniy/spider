import { Kafka as Kafkajs } from 'kafkajs' 

export class Kafka {
    constructor(){
        this.kafka = new Kafkajs({
            clientId: 'spider',
            brokers: ['localhost:9093'],
        })
    }
    
    async consume(args, func){

        this.consumer = this.kafka.consumer({ groupId: args.groupId })
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: args.topic, fromBeginning: true })
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    value: message.value.toString(),
                })
            },
        })
    } 
}