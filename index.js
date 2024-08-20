const express = require('express');
const { randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const backendData = {};

function setHeaders(res) {
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
    });
    res.flushHeaders();
}

function sendSSE({ res, frag, selector, merge, mergeType, end }) {
    res.write('event: datastar-fragment\n');
    if (selector) res.write(`data: selector ${selector}\n`);
    if (merge) res.write(`data: merge ${mergeType}\n`);
    res.write(`data: fragment ${frag}\n\n`);
    if (end) res.end();
}

function indexPage() {
    // return the html file in string format
    const filePath = path.join(__dirname, 'index.html');
    return fs.readFileSync(filePath, 'utf-8');
}

app.get('/', (req, res) => {
    res.send(indexPage()).end();
});

app.put('/put', (req, res) => {
    setHeaders(res);
    const { input } = req.body;
    backendData.input = input;
    const output = `Your input: ${input}, is ${input.length} long.`;
    let frag = `<div id="output">${output}</div>`;
    sendSSE({
        res,
        frag,
        selector: null,
        merge: true,
        mergeType: 'morph_element',
        end: true,
    });
});

app.get('/get', (req, res) => {
    setHeaders(res);

    const output = `Backend State: ${JSON.stringify(backendData)}.`;
    let frag = `<div id="output2">${output}</div>`;

    sendSSE({
        res,
        frag,
        selector: null,
        merge: true,
        mergeType: 'morph_element',
        end: false,
    });
    frag = `<div id="output3">Check this out!</div>;`;
    sendSSE({
        res,
        frag,
        selector: '#main',
        merge: true,
        mergeType: 'prepend_element',
        end: true,
    });
});

app.get('/feed', async (req, res) => {
    setHeaders(res);

    // Flag to control the loop
    let clientDisconnected = false;

    // Listen for the 'close' event to detect when the client disconnects
    req.on('close', () => {
        clientDisconnected = true;
    });

    while (!clientDisconnected && res.writable) {
        const rand = randomBytes(8).toString('hex');
        const frag = `<span id="feed">${rand}</span>`;
        sendSSE({
            res,
            frag,
            selector: null,
            merge: false,
            mergeType: null,
            end: false,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Ensure the response is properly ended
    if (res.writable) {
        res.end();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
