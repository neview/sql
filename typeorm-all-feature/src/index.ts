import { error } from "console"
import { In } from "typeorm";
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))

AppDataSource.initialize().then(async () => {
    // 修改数据（指定ID）
    // const user = new User()
    // user.id = 1
    // user.firstName = 'aaa111'
    // user.lastName = 'bbb'
    // user.age = 25
    // await AppDataSource.manager.save(user)

    // 批量插入数据
    // await AppDataSource.manager.save(User, [
    //     { firstName: 'ccc', lastName: 'ccc', age: 21 },
    //     { firstName: 'ddd', lastName: 'ddd', age: 22 },
    //     { firstName: 'eee', lastName: 'eee', age: 23 },
    // ])

    // 批量修改
    // await AppDataSource.manager.save(User, [
    //     { id: 1, firstName: 'ccc111', lastName: 'ccc', age: 21 },
    //     { id: 2, firstName: 'ddd111', lastName: 'ccc', age: 22 },
    //     { id: 3, firstName: 'eee111', lastName: 'ccc', age: 23 },
    // ])

    // 删除
    // await AppDataSource.manager.delete(User, 1);
    //批量删除
    // await AppDataSource.manager.delete(User, [2, 3]);

    // 删除 remove delete 和 remove 的区别是，delete 直接传 id、而 remove 则是传入 entity 对象
    // const user = new User();
    // user.id = 1;
    // await AppDataSource.manager.remove(User, user);

    // 查询
    // const userList = await AppDataSource.manager.find(User);
    // console.log('用户列表：', userList);

    // 条件查询
    // const users = await AppDataSource.manager.findBy(User, {
    //     age: 23
    // })
    // console.log('数据', users)

    // 查询多少天记录
    // const [users, count] = await AppDataSource.manager.findAndCount(User)
    // console.log('users', users)
    // console.log('count', count)

    //条件查询记录
    // const [users, count] = await AppDataSource.manager.findAndCountBy(User, {
    //     age: 23
    // })
    // console.log('users', users)
    // console.log('count', count)

    // 查询一条数据
    // const user = await AppDataSource.manager.findOne(User, {
    //     select: {
    //         firstName: true,
    //         age: true
    //     },
    //     where: {
    //         id: 4
    //     },
    //     order: {
    //         age: 'ASC'
    //     }
    // })
    // console.log('user', user)

    // const users = await AppDataSource.manager.find(User, {
    //     select: {
    //         firstName: true,
    //         age: true
    //     },
    //     where: {
    //         id: In([4, 8])
    //     },
    //     order: {
    //         age: 'ASC'
    //     }
    // });
    // console.log(users);


    // const user = await AppDataSource.manager.findOneBy(User, {
    //     age: 23
    // });
    // console.log(user);

    // findOne 两个特殊用法
    // try {
    //     const user = await AppDataSource.manager.findOneOrFail(User, {
    //         where: {
    //             id: 666
    //         }
    //     });
    //     console.log(user);
    // } catch (e) {
    //     // findOneOrFail 或者 findOneByOrFail，如果没找到，会抛一个 EntityNotFoundError 的异常
    //     console.log(e);
    //     console.log('没找到该用户');
    // }

    // query直接执行sql语句
    // const users = await AppDataSource.manager.query('select * from user where age in(?, ?)', [21, 23]);
    // console.log(users);

    // 复杂 sql 语句用 query builder
    // const queryBuilder = await AppDataSource.manager.createQueryBuilder();
    // const user = await queryBuilder.select("user")
    //     .from(User, "user")
    //     .where("user.age = :age", { age: 21 })
    //     .getOne();
    // console.log(user);

    // transaction 开始事务
    await AppDataSource.manager.transaction(async manager => {
        await manager.save(User, {
            id: 4,
            firstName: 'eee',
            lastName: 'eee',
            age: 20
        });
    });

    // save：新增或者修改 Entity，如果传入了 id 会先 select 再决定修改还新增
    // update：直接修改 Entity，不会先 select
    // insert：直接插入 Entity
    // delete：删除 Entity，通过 id
    // remove：删除 Entity，通过对象
    // find：查找多条记录，可以指定 where、order by 等条件
    // findBy：查找多条记录，第二个参数直接指定 where 条件，更简便一点
    // findAndCount：查找多条记录，并返回总数量
    // findByAndCount：根据条件查找多条记录，并返回总数量
    // findOne：查找单条记录，可以指定 where、order by 等条件
    // findOneBy：查找单条记录，第二个参数直接指定 where 条件，更简便一点
    // findOneOrFail：查找失败会抛 EntityNotFoundError 的异常
    // query：直接执行 sql 语句
    // createQueryBuilder：创建复杂 sql 语句，比如 join 多个 Entity 的查询
    // transaction：包裹一层事务的 sql
    // getRepository：拿到对单个 Entity 操作的类，方法同 EntityManager

}).catch(error => console.log(error))