const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const html = fs.readFileSync('dist/index.html', 'utf8');

const dom = new JSDOM(html, {
    url: "http://localhost:5002/",
    runScripts: "dangerously",
    resources: "usable"
});

dom.window.addEventListener('error', (e) => {
    console.error("DOM ERROR CAUGHT!: ", e.message, e.error);
    process.exit(1);
});
dom.window.addEventListener('unhandledrejection', (e) => {
    console.error("PROMISE ERROR CAUGHT!: ", e.reason);
    process.exit(1);
});
dom.window.console.error = (msg, err) => {
    console.log("CONSOLE ERROR!: ", msg, err);
}

setTimeout(() => {
    console.log("Execution finished. Root HTML length:", dom.window.document.getElementById('root')?.innerHTML.length);
    process.exit(0);
}, 3000);
