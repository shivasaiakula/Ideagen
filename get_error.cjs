const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
        
        console.log("Navigating to localhost:5173/Ideagen/...");
        await page.goto('http://localhost:5173/Ideagen/', { waitUntil: 'networkidle0', timeout: 10000 });
        
        const content = await page.content();
        if (content.includes('Something went wrong')) {
             console.log("ErrorBoundary triggered.");
             const text = await page.evaluate(() => document.body.innerText);
             console.log("BODY TEXT:", text);
        } else {
             console.log("Rendered successfully?");
        }
        
        await browser.close();
    } catch (err) {
        console.log("SCRIPT ERROR:", err);
        process.exit(1);
    }
})();
