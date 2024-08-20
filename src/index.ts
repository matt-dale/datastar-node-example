import express, { Request, Response } from "express";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import {
  createDataStarEvent,
  createSessionMiddleware,
  setupDataStarRequest,
} from "./utils";
import { DataStarMergeType } from "./types";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const backendData = {
  input: "",
};

function getIndexHtml() {
  const filePath = path.join(__dirname, "index.html");
  return fs.readFileSync(filePath, "utf-8");
}

app.get("/", (req: Request, res: Response) => {
  res.send(getIndexHtml()).end();
});

app.put("/put", setupDataStarRequest, (req: Request, res: Response) => {
  const { input } = req.body;
  backendData.input = input;
  const output = `Your input: ${input}, is ${input.length} long.`;
  let frag = `<div id="output">${output}</div>`;
  const dataStarMessage = createDataStarEvent({
    frag,
    mergeType: DataStarMergeType.MORPH_ELEMENT,
  });
  res.write(dataStarMessage);
  res.end();
});

app.get("/get", setupDataStarRequest, (req: Request, res: Response) => {
  const output = `Backend State: ${JSON.stringify(backendData)}.`;
  let frag = `<div id="output2">${output}</div>`;
  const dataStarMessage = createDataStarEvent({
    frag,
    mergeType: DataStarMergeType.MORPH_ELEMENT,
  });
  frag = `<div id="output3">Check this out!</div>;`;
  const dataStarMessage2 = createDataStarEvent({
    frag,
    mergeType: DataStarMergeType.PREPEND_ELEMENT,
    selector: "#main",
  });
  res.write(dataStarMessage);
  res.write(dataStarMessage2);
  res.end();
});

app.get("/feed", setupDataStarRequest, (req: Request, res: Response) => {
  const intervalId = setInterval(() => {
    if (!res.writable) {
      clearInterval(intervalId);
      return;
    }

    const rand = randomBytes(8).toString("hex");
    const frag = `<span id="feed">${rand}</span>`;
    const dataStarMessage = createDataStarEvent({
      frag,
      selector: "#feed",
    });
    res.write(dataStarMessage);
  }, 1000);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
