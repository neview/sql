import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Aaa } from './entity/aaa'

export const AppDataSource = new DataSource({
    // type 是数据库的类型，因为 TypeORM 不只支持 MySQL 还支持 postgres、oracle、sqllite 等数据库。
    // host、port 是指定数据库服务器的主机和端口号。
    // user、password 是登录数据库的用户名和密码。
    // database 是要指定操作的 database，因为 mysql 是可以有多个 database 或者叫 schema 的。
    // synchronize 是根据同步建表，也就是当 database 里没有和 Entity 对应的表的时候，会自动生成建表 sql 语句并执行
    // logging 是打印生成的 sql 语句
    // entities 是指定有哪些和数据库的表对应的 Entity
    // migrations 是修改表结构之类的 sql
    // subscribers 是一些 Entity 生命周期的订阅者，比如 insert、update、remove 前后，可以加入一些逻辑
    // poolSize 是指定数据库连接池中连接的最大数量。
    // connectorPackage 是指定用什么驱动包。
    // extra 是额外发送给驱动包的一些选项
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "guang",
    database: "practice",
    synchronize: true,
    logging: true,
    entities: [User, Aaa],
    migrations: [],
    subscribers: [],
    poolSize: 10,
    connectorPackage: 'mysql2',
    extra: {
        authPlugin: 'sha256_password',
    }
})

