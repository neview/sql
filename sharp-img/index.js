const sharp = require("sharp");

sharp("1.jpg", {
  animated: true,
  limitInputPixels: false, // 不限制大小
})
  .gif({
    colours: 10,
  })
  .toFile("2.image.jpg");
