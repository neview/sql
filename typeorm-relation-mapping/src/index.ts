import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { IdCard } from "./entity/IdCard"

AppDataSource.initialize().then(async () => {

    // console.log("Inserting a new user into the database...")
    // const user = new User()
    // user.firstName = "Timber"
    // user.lastName = "Saw"
    // user.age = 25
    // await AppDataSource.manager.save(user)
    // console.log("Saved a new user with id: " + user.id)

    // console.log("Loading users from the database...")
    // const users = await AppDataSource.manager.find(User)
    // console.log("Loaded users: ", users)

    // console.log("Here you can setup and run express / fastify / any other framework.")

    // const user = new User()
    // user.firstName = 'guang'
    // user.lastName = 'guang'
    // user.age = 18

    // const idCard = new IdCard()
    // idCard.cardName = '111111'
    // idCard.user = user

    // // await AppDataSource.manager.save(user)
    // await AppDataSource.manager.save(idCard)

    // const ics = await AppDataSource.manager.find(IdCard, {
    //     relations: {
    //         user: true
    //     }
    // })
    // console.log('ics', ics)

    // const ics = await AppDataSource.manager.getRepository(IdCard) //先 getRepository 拿到操作 IdCard 的 Repository 对象
    //     .createQueryBuilder('ic')//再创建 queryBuilder 来连接查询，给 idCard 起个别名 ic
    //     .leftJoinAndSelect('ic.user', 'u')// 然后连接的是 ic.user，起个别名为 u
    //     .getMany()
    // console.log('ics', ics)

    /**
     *也可以直接用 EntityManager 创建 queryBuilder 来连接查询
     */
    // const ics = await AppDataSource.manager.createQueryBuilder(IdCard, "ic")
    // leftJoinAndSelect("ic.user", "u")
    // .getMany();
    // console.log(ics);

    // 删除user表中id为2，3，4，5的数据
    // await AppDataSource.manager.delete(User, [2, 3, 4, 5])

    // const user = new User();
    // user.id = 1;
    // user.firstName = 'guang1111';
    // user.lastName = 'guang1111';
    // user.age = 20;

    // const idCard = new IdCard();
    // idCard.id = 1;
    // idCard.cardName = '22222';
    // idCard.user = user;

    // await AppDataSource.manager.save(idCard);

    // 因为设置了外键的 onDelete 是 cascade，所以只要删除了 user，那关联的 idCard 就会跟着被删除
    // await AppDataSource.manager.delete(User, 1)

    // 如果不是没有这种级联删除，就需要手动删了
    // const idCard = await AppDataSource.manager.findOne(IdCard, {
    //     where: {
    //         id: 1
    //     },
    //     relations: {
    //         user: true
    //     }
    // })
    // await AppDataSource.manager.delete(User, idCard.user.id)
    // await AppDataSource.manager.delete(IdCard, idCard.id)

    const user = await AppDataSource.manager.find(User, {
        relations: {
            idCard: true
        }
    });
    console.log(user);

}).catch(error => console.log(error))

// 总结
// TypeORM 里一对一关系的映射通过 @OneToOne 装饰器来声明，维持外键列的 Entity 添加 @JoinColumn 装饰器。

// 如果是非外键列的 Entity，想要关联查询另一个 Entity，则需要通过第二个参数指定外键列是另一个 Entity 的哪个属性。

// 可以通过 @OneToOne 装饰器的 onDelete、onUpdate 参数设置级联删除和更新的方式，比如 CASCADE、SET NULL 等。

// 还可以设置 cascade，也就是 save 的时候会自动级联相关 Entity 的 save。

// 增删改分别通过 save 和 delete 方法，查询可以通过 find 也可以通过 queryBuilder，不过要 find 的时候要指定 relations 才会关联查询。

// 这就是 TypeORM 里一对一的映射和增删改查，下节我们继续学习一对多的映射。