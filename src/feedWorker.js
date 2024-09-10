// feedWorker.js
const { parentPort } = require("worker_threads");
const { randomBytes } = require("crypto");

function sendRandomData() {
  const rand = randomBytes(8).toString("hex");
  const frag = `<span id="feed">${rand}</span>`;
  parentPort.postMessage(frag);
}

parentPort.on("message", () => {
  const intervalId = setInterval(() => {
    sendRandomData();
  }, 1000);

  parentPort.on("message", (msg) => {
    if (msg === "stop") {
      clearInterval(intervalId);
    }
  });
});
