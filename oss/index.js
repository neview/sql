var Minio = require("minio");
const fs = require("fs");

var minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "PWbhBwJKTDNbeYZ2MzSk",
  secretKey: "rsleBLUAP0szNRBFSK7H7wwGOfM84RgLVdKGquYz",
});

// function put() {
//   minioClient.fPutObject("aaa", "hello.png", "./1.jpg", function (err, etag) {
//     if (err) return console.log(err);
//     console.log("上传成功");
//   });
// }
// put();

function get() {
  minioClient.getObject("aaa", "hello.png", function (err, dataStream) {
    if (err) return console.log(err);
    dataStream.pipe(fs.createWriteStream("./xxx.jpg"));
  });
}
get();
