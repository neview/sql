const { Workbook } = require("exceljs");

// 解析 excel
// async function main() {
//   const workbook = new Workbook();

//   const workbook2 = await workbook.xlsx.readFile("./aa.xlsx");

//   workbook2.eachSheet((sheet, index1) => {
//     console.log("工作表" + index1);

//     const value = sheet.getSheetValues();
//     console.log(value);

//     // sheet.eachRow((row, index2) => {
//     //   const rowData = [];

//     //   row.eachCell((cell, index3) => {
//     //     rowData.push(cell.value);
//     //   });
//     //   console.log("行" + index2, rowData);
//     // });
//   });
// }

// 生成 excel
async function main() {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("guang111");
  worksheet.columns = [
    { header: "姓名", key: "name", width: 10 },
    { header: "年龄", key: "age", width: 10 },
    { header: "性别", key: "sex", width: 50 },
  ];

  const data = [
    {
      name: "张三",
      age: 18,
      sex: "男",
    },
    {
      name: "李四",
      age: 20,
      sex: "女",
    },
  ];

  worksheet.addRows(data);
  worksheet.eachRow((row, rowIndex) => {
    row.eachCell((cell) => {
      if (rowIndex === 1) {
        cell.style = {
          font: {
            bold: true,
            color: "#000000",
            fontSize: 16,
            fontName: "宋体",
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "000000" },
          },
          border: {
            top: { style: "dashed", color: { argb: "0000ff" } },
            left: { style: "dashed", color: { argb: "0000ff" } },
            bottom: { style: "dashed", color: { argb: "0000ff" } },
            right: { style: "dashed", color: { argb: "0000ff" } },
          },
        };
      } else {
        cell.style = {
          font: {
            size: 10,
            bold: true,
          },
          alignment: { vertical: "middle", horizontal: "left" },
          border: {
            top: { style: "dashed", color: { argb: "0000ff" } },
            left: { style: "dashed", color: { argb: "0000ff" } },
            bottom: { style: "dashed", color: { argb: "0000ff" } },
            right: { style: "dashed", color: { argb: "0000ff" } },
          },
        };
      }
    });
  });
  //   await workbook.xlsx.write("./aa2.xlsx");
  const fs = require("fs");
  await workbook.xlsx.write(fs.createWriteStream("./aa2.xlsx"));
}

main();
