import { Parser } from './parser.js';
import { Kafka } from "./kafka.js";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config()

const port = process.env.PORT || 3000
const app = express()
const parser = new Parser()
const kf = new Kafka()

await kf.consume()

app.get('/:domain', async (req, res) => {

  (await parser.openBrowser())

  await parser.parse('http://mk.ru')
  console.log(parser.getContent())

  await parser.parse('http://ya.ru')
  console.log(parser.getContent())

  res.send(parser.getContent())

  await parser.closeBrowser()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
