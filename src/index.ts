import express, { Request, Response } from "express";
import { Worker } from "worker_threads";
import fs from "fs";
import path from "path";
import { createDataStarEvent, setupDataStarRequest } from "./utils";
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

app.get("/feed", setupDataStarRequest, async (req: Request, res: Response) => {
  const worker = new Worker(path.join(__dirname, "feedWorker.js"));

  // When the worker sends data, write it to the response
  worker.on("message", (message) => {
    const frag = message;
    const event = createDataStarEvent({
      frag,
      mergeType: DataStarMergeType.APPEND_ELEMENT,
      selector: "#feed",
    });
    if (res.writable) {
      res.write(event);
    } else {
      worker.postMessage("stop");
    }
  });

  // Handle worker errors
  worker.on("error", (error) => {
    console.error("Worker error:", error);
    res.end();
  });

  // When the client closes the connection, stop the worker
  req.on("close", () => {
    worker.postMessage("stop");
    worker.terminate();
    res.end();
  });

  // Start the worker
  worker.postMessage("start");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
