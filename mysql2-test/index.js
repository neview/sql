// const mysql = require("mysql2");

// 连接 mysql server，指定用户名、密码、要操作的数据库（这里要改成你自己的 mysql 连接密码）。

// 然后通过 query 方法跑一个查询 sql。

// results 是结果，fields 是一些元信息
// const connection = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "guang",
//   database: "practice",
// });

// 查询数据
// connection.query(
//   "SELECT * FROM customers where name like ?",
//   ["李%"],
//   function (err, results, fields) {
//     console.log(results);
//     console.log(fields.map((item) => item.name));
//   }
// );

// 插入数据
// connection.execute(
//   "insert into customers (name) values (?)",
//   ["光"],
//   (err, results, files) => {
//     console.log(err);
//   }
// );

// 修改数据
// connection.execute(
//   'update customers set name="guang" where name="光"',
//   (err) => {
//     console.log(err);
//   }
// );

// 删除数据
// connection.execute("delete from customers where name=?", ["guang"], (err) => {
//   console.log(err);
// });

// api promise 版本
// const mysql = require("mysql2/promise");

// (async function () {
//   const connection = await mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "guang",
//     database: "practice",
//   });

//   const [results, fields] = await connection.query("SELECT * FROM customers");

//   console.log(results);
//   console.log(fields.map((item) => item.name));
// })();

//连接池
const mysql = require("mysql2/promise");

(async function () {
  // connectionLimit 是指定最多有多少个连接，比如 10 个，那就是只能同时用 10个，再多需要排队等。

  // maxIdle 是指定最多有多少个空闲的，超过这个数量的空闲连接会被释放。

  // waitForConnections 是指如果现在没有可用连接了，那就等待，设置为 false 就是直接返回报错。

  // idleTimeout 是指空闲的连接多久会断开。

  // queueLimit 是可以排队的请求数量，超过这个数量就直接返回报错说没有连接了。设置为 0 就是排队没有上限。

  // enableKeepAlive、keepAliveInitialDelay 是保持心跳用的，用默认的就好。

  // 这就是 mysql2 的用法，是不是还会挺简单的？

  // 只要建立个连接或者连接池，就可以在 node 里执行 sql 了。

  // 但是我们一般不会直接这样执行 sql，而是会用 ORM 框架。

  // ORM 是 Object Relational Mapping，对象关系映射。也就是说把关系型数据库的表映射成面向对象的 class，表的字段映射成对象的属性映射，表与表的关联映射成属性的关联。
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "guang",
    database: "practice",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  //   const [results] = await pool.query("select * from customers");
  //   console.log(results);

  //手动取
  const connection = await pool.getConnection();

  const [results] = await connection.query("select * from orders");
  console.log(results);
})();
