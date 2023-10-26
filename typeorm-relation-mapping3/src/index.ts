import { EntityManager } from "typeorm";
import { AppDataSource } from "./data-source"
import { Article } from "./entity/Article"
import { Tag } from "./entity/Tag";

AppDataSource.initialize().then(async () => {

    // const a1 = new Article();
    // a1.title = 'aaaa';
    // a1.content = 'aaaaaaaaaa';

    // const a2 = new Article();
    // a2.title = 'bbbbbb';
    // a2.content = 'bbbbbbbbbb';

    // const t1 = new Tag();
    // t1.name = 'ttt1111';

    // const t2 = new Tag();
    // t2.name = 'ttt2222';

    // const t3 = new Tag();
    // t3.name = 'ttt33333';

    // a1.tags = [t1, t2];
    // a2.tags = [t1, t2, t3];

    // const entityManager = AppDataSource.manager;

    // await entityManager.save(t1);
    // await entityManager.save(t2);
    // await entityManager.save(t3);

    // await entityManager.save(a1);
    // await entityManager.save(a2);

    //查询
    // const entityManager = AppDataSource.manager;
    // const article = await entityManager.find(Article, {
    //     relations: {
    //         tags: true
    //     }
    // });

    // console.log(article);
    // console.log(article.map(item => item.tags))

    // 也可以手动用 query builder 来 join 查询
    // const entityManager = AppDataSource.manager;
    // const article = await entityManager
    //     .createQueryBuilder(Article, 'a')
    //     .leftJoinAndSelect('a.tags', 't')
    //     .getMany()
    // console.log(article);
    // console.log(article.map(item => item.tags))

    //或者先拿到 Article 的 Repository 再创建 query builder 来查询
    // const entityManager = AppDataSource.manager;
    // const article = await entityManager
    //     .getRepository(Article)
    //     .createQueryBuilder('a')
    //     .leftJoinAndSelect('a.tags', 't')
    //     .getMany()
    // console.log(article);
    // console.log(article.map(item => item.tags))

    //我把 id 为 2 的文章的标签只保留包含 111 的，并且还改了标题
    const entityManager = AppDataSource.manager;
    const article = await entityManager.findOne(Article, {
        where: {
            id: 2
        },
        relations: {
            tags: true
        }
    });
    article.title = 'ccccc';
    article.tags = article.tags.filter(item => item.name.includes('ttt111'));
    await entityManager.save(article)
    // 它会先查出 id 为 2 的 article 有哪些标签，查出了 1、2、3。
    // 然后会把他和 id 为 2 的 article 的关系，(2, 2) (2, 3) 从中间表中删除
    // 这样就这个 article 就只有 id 为 1 的 tag 了

}).catch(error => console.log(error))
