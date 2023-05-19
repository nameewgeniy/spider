import {parse} from "dotenv";

export class App {
  constructor(kafka, parser){
    this.kafka = kafka
    this.parser = parser
  }

  async run() {
    console.log('service run')

    await this.consume()
  }

  async consume() {
    await this.kafka.consume({topic: 'urls', groupId: 'spider'}, async (message) => {
      const content = await this.parser.parse(message.value.toString())
      console.log(content)
    })
  }

  parse(url) {
    this.parser.parse(url)
  }
}