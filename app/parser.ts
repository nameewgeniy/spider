import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import {Browser, PuppeteerLaunchOptions} from "puppeteer";


export class Parser {
    private browser: Browser;

    async parse(url) {
        puppeteer.use(StealthPlugin())
        puppeteer.use(AdblockerPlugin({blockTrackers: true}))

        const opt: PuppeteerLaunchOptions = {
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--remote-debugging-port=9222",
                "--remote-debugging-address=0.0.0.0"
            ]
        }

        const browser = await puppeteer.launch(opt)

        const page = await browser.newPage()
        await page.setViewport({width: 800, height: 600})

        console.log('Run parsing ' + url)
        await page.goto(url)
        await page.waitForTimeout(1000)
        const content = await page.content()
        await browser.close()

        return content
    }
}