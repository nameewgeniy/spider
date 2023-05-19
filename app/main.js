import {App} from './app.js';
import {Kafka} from "./kafka.js";
import dotenv from 'dotenv';
import {Parser} from "./parser.js";

dotenv.config()

// const port = process.env.PORT || 3000
const parser = new Parser()
const kafka = new Kafka()
const app = new App(kafka, parser);

await app.run();