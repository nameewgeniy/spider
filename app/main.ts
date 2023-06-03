import {App} from './app.js';
import {Kafka} from "./kafka.js";
import dotenv from 'dotenv';
import {Parser} from "./parser.js";
import { MongoClient } from 'mongodb'
import {MongoRepository} from "./repository/mongo.js";

dotenv.config()

type Conf = {
    mongoUrl: string;
    kafkaHost: string
}

const cf: Conf = {
    mongoUrl: process.env.MONGO_URL,
    kafkaHost: process.env.KAFKA_HOST
}
// const port = process.env.PORT || 3000
const parser = new Parser()
const kafka = new Kafka([cf.kafkaHost])

const mongo = new MongoClient(cf.mongoUrl)
// @ts-ignore
const client = await mongo.connect();
const repo = new MongoRepository(client)

const app = new App(kafka, parser, repo);

// @ts-ignore
await app.run();