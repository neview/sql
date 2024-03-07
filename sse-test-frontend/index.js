// const { spawn } = require("child_process");
// const childProcess = spawn("tail", ["-f", "./log"]);

// childProcess.stdout.on("data", (msg) => {
//   console.log(msg);
// });

// childProcess.stderr.on("data", (err) => {
//   console.error(err);
// });

const { readFileSync } = require("fs");
const buffer = readFileSync("./package.json");

console.log(buffer.toJSON());
