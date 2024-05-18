import {App} from './app.js';
import {Kafka} from "./kafka.js";
import dotenv from 'dotenv';
import {Parser} from "./parser.js";
import { MongoClient } from 'mongodb'
import {MongoRepository} from "./repository/mongo.js";
import { Server } from './server.js'
import {OpenAi} from "./ai/OpenAi.js";

dotenv.config()

type Conf = {
    mongoUrl: string;
    kafkaHost: string
}

const cf: Conf = {
    mongoUrl: process.env.MONGO_URL,
    kafkaHost: process.env.KAFKA_SERVERS
}

console.log(cf)
// const port = process.env.PORT || 3000
const parser = new Parser()
const kafka = new Kafka([cf.kafkaHost])

const mongo = new MongoClient(cf.mongoUrl)
// @ts-ignore
// const client = await mongo.connect();
const repo = new MongoRepository("")
const ai = new OpenAi("sk-4GPJbIRk60vuJ2o8E5Q5h7nFh4P8iCCB", repo)
const server = new Server(parser, repo, ai)

const app = new App(server, kafka, parser, repo);

// @ts-ignore
await app.run();