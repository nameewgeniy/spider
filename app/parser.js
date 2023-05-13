import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';


export class Parser {
    constructor(){
        
    }

    Parse(url) {

        puppeteer.use(StealthPlugin())
        puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

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
          
            await page.goto(url)
            await page.waitForTimeout(1000)

            const content = await page.content()
          
            await browser.close()

            return content
          })
    }
}