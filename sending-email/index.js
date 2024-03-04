const nodeemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodeemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: "1282261308@qq.com",
    pass: "ifsznnwowjfuhdjc",
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: "1282261308@qq.com",
    to: "2127763459@qq.com",
    subject: "Hello 111",
    // text: "xxx",
    html: fs.readFileSync("./index.html"),
  });

  console.log("邮件发送成功", info.messageId);
}

main().catch(console.error);
