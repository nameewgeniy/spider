import { Kafka as Kafkajs } from 'kafkajs' 

export class Kafka {
    constructor(){
        this.kafka = new Kafkajs({
            clientId: 'spider',
            brokers: ['localhost:9094'],
        })
    }
    
    async consume(){
        this.consumer = this.kafka.consumer({ groupId: 'spider' })
        
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: 'urls', fromBeginning: true })
        
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    value: message.value.toString(),
                })
            },
        })
    } 
}