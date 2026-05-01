const http = require('http');
const server = http.createServer((req, res) => {
    // Add CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            console.log("=== BROWSER CRASH ERROR CATCHED ===");
            console.log(body);
            console.log("====================================");
            res.end('ok');
        });
    }
});
server.listen(3002, () => console.log('Log server on 3002'));
