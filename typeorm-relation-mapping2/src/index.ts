import { AppDataSource } from "./data-source"
import { Department } from "./entity/Department"
import { Employee } from "./entity/Employee";
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    // const e1 = new Employee();
    // e1.name = '张三';

    // const e2 = new Employee();
    // e2.name = '李四';

    // const e3 = new Employee();
    // e3.name = '王五';

    // const d1 = new Department();
    // d1.name = '技术部';
    // d1.employees = [e1, e2, e3]

    // // await AppDataSource.manager.save(Department, d1);
    // // await AppDataSource.manager.save(Employee, [e1, e2, e3]);
    // await AppDataSource.manager.save(Department, d1)

    // const deps = await AppDataSource.manager.find(Department, {
    //     // 这个 relations 其实就是 left join on
    //     relations: {
    //         employees: true
    //     }
    // });
    // console.log(deps);
    // console.log(deps.map(item => item.employees))

    // const es = await AppDataSource.manager.getRepository(Department)
    //     .createQueryBuilder('d')
    //     .leftJoinAndSelect('d.employees', 'e')
    //     .getMany();
    // console.log(es);
    // console.log(es.map(item => item.employees));

    //也可以直接用 EntityManager 来创建 query builder

    // const es = await AppDataSource.manager
    //     .createQueryBuilder(Department, 'd')
    //     .leftJoinAndSelect('d.employees', 'e')
    //     .getMany();
    // console.log(es);
    // console.log(es.map(item => item.employees))

    const deps = await AppDataSource.manager.find(Department, {
        relations: {
            employees: true
        }
    });
    // await AppDataSource.manager.delete(Employee, deps[0].employees);
    await AppDataSource.manager.delete(Department, deps[0].id);
}).catch(error => console.log(error))
