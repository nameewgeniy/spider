import {App} from './app.js';
import {Kafka} from "./kafka.js";
import dotenv from 'dotenv';
import {Parser} from "./parser.js";
import { MongoClient } from 'mongodb'
import {MongoRepository} from "./repository/mongo.js";

dotenv.config()

// const port = process.env.PORT || 3000
const parser = new Parser()
const kafka = new Kafka()

const mongo = new MongoClient('mongodb://localhost:28017')
await mongo.connect();

const repo = new MongoRepository(mongo)

const app = new App(kafka, parser, repo);

await app.run();