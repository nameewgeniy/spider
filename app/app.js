import { Parser } from './parser.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config()

const port = process.env.PORT || 3000
const app = express()

app.get('/:domain', (req, res) => {

  const pr = new Parser()

  async fn => {
    content = await pr.Parse('http://mk.ru')
    res.send(content)
  }

  fn()
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
