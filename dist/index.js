"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const types_1 = require("./types");
const app = (0, express_1.default)();
const backendData = {
    input: "",
};
function indexPage() {
    const filePath = path_1.default.join(__dirname, "index.html");
    return fs_1.default.readFileSync(filePath, "utf-8");
}
app.get("/", (req, res) => {
    res.send(indexPage()).end();
});
app.put("/put", utils_1.createSessionMiddleware, (req, res) => {
    const { input } = req.body;
    backendData.input = input;
    const output = `Your input: ${input}, is ${input.length} long.`;
    let frag = `<div id="output">${output}</div>`;
    const dataStarMessage = (0, utils_1.createDataStarEvent)({
        frag,
        mergeType: types_1.DataStarMergeType.MORPH_ELEMENT,
    });
    res.sse.push(dataStarMessage);
});
app.get("/get", utils_1.createSessionMiddleware, (req, res) => {
    const output = `Backend State: ${JSON.stringify(backendData)}.`;
    let frag = `<div id="output2">${output}</div>`;
    const dataStarMessage = (0, utils_1.createDataStarEvent)({
        frag,
        mergeType: types_1.DataStarMergeType.MORPH_ELEMENT,
    });
    frag = `<div id="output3">Check this out!</div>;`;
    const dataStarMessage2 = (0, utils_1.createDataStarEvent)({
        frag,
        mergeType: types_1.DataStarMergeType.PREPEND_ELEMENT,
        selector: "#main",
    });
    res.sse.push(dataStarMessage);
    res.sse.push(dataStarMessage2);
});
app.get("/feed", utils_1.createSessionMiddleware, (req, res) => {
    const intervalId = setInterval(() => {
        if (!res.writable) {
            clearInterval(intervalId);
            return;
        }
        const rand = (0, crypto_1.randomBytes)(8).toString("hex");
        const frag = `<span id="feed">${rand}</span>`;
        const dataStarMessage = (0, utils_1.createDataStarEvent)({
            frag,
            selector: "#feed",
        });
        res.sse.push(dataStarMessage);
    }, 1000);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
