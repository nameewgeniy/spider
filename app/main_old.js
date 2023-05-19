// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality.
// Any number of plugins can be added through `puppeteer.use()`
const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ contentblockTrackers: true }))

// That's it, the rest is puppeteer usage as normal 😊
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
  await page.goto('https://mk.ru')
  await page.waitForTimeout(1000)
  const content = await page.content()
  console.log(content)

  console.log(`All done, check the screenshots. ✨`)
  await browser.close()
})