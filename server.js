const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

const questionsFilePath = path.join(__dirname, 'questions.json');

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET') {
        if (url === '/') {
            serveStaticFile(res, 'public/index.html', 'text/html');
        } else if (url === '/style.css') {
            serveStaticFile(res, 'public/style.css', 'text/css');
        } else if (url === '/script.js') {
            serveStaticFile(res, 'public/script.js', 'text/javascript');
        } else if (url === '/questions') {
            fs.readFile(questionsFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading questions.json:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to load questions' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

function serveStaticFile(res, filePath, contentType) {
    const fullPath = path.join(__dirname, filePath);
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            console.error(`Error reading ${filePath}:`, err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});