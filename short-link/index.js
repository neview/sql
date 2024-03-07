// const data = "123456";
// const buff = Buffer.from(data);
// const base64data = buff.toString("base64");

// console.log(base64data);

// const base62 = require("base62/lib/ascii");
// const res = base62.encode(123456);
// console.log(res);

// const crypto = require("crypto");
// function md5(str) {
//   const hash = crypto.createHash("md5");
//   hash.update(str);
//   return hash.digest("hex");
// }
// console.log(md5("111222"));

const base62 = require("base62/lib/ascii");

function generateRandomStr(len) {
  let str = "";
  for (let i = 0; i < len; i++) {
    const num = Math.floor(Math.random() * 62);
    str += base62.encode(num);
  }
  return str;
}

console.log(generateRandomStr(6));
