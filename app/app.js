const express = require('express')
require('dotenv').config();
const port = process.env.PORT || 3000
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))


const app = express()

app.get('/:domain', (req, res) => {

  puppeteer.launch({
    bindAddress: "0.0.0.0",
    args: [
      "--headless", 
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--remote-debugging-port=9222",
      "--remote-debugging-address=0.0.0.0"
    ]
  }).then(async browser => {
  
    const page = await browser.newPage()
    await page.setViewport({ width: 800, height: 600 })
  
    console.log(`Testing adblocker plugin..`)
    await page.goto('https://' + req.params.domain)
    await page.waitForTimeout(1000)
    const content = await page.content()
    res.send(content)
  
    await browser.close()
  })

  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
