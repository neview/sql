INSERT INTO `department` (`id`,`name`) VALUES (1, '人事部'),
        (2, '财务部'),
        (3, '市场部'),
        (4, '技术部'),
        (5, '销售部'),
        (6, '客服部'),
        (7, '采购部'),
        (8, '行政部'),
        (9, '品控部'),
        (10, '研发部');

select * from department;

INSERT INTO `employee` (`id`,`name`,`department_id`) VALUES (1, '张三', 1),
        (2, '李四', 2), 
        (3, '王五', 3),
        (4, '赵六', 4),
        (5, '钱七', 5),
        (6, '孙八', 5),
        (7, '周九', 5),
        (8, '吴十', 8),
        (9, '郑十一', 9),
        (10, '王十二', 10);
        
select * from employee;

select * from department join employee on department.id = employee.department_id where department.id = 5;

select * from department left join employee on department.id = employee.department_id;

select * from department right join employee on department.id = employee.department_id;

CREATE TABLE `article` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `title` VARCHAR(50) NOT NULL,
 `content` TEXT NOT NULL,
 PRIMARY KEY (`id`)
) CHARSET=utf8mb4;

select* from article;

INSERT INTO `article` (`title`, `content`)
    VALUES
            ('文章1', '这是文章1的内容。'),
            ('文章2', '这是文章2的内容。'),
            ('文章3', '这是文章3的内容。'),
            ('文章4', '这是文章4的内容。'),
            ('文章5', '这是文章5的内容。');
  
-- 创建标签表
CREATE TABLE `tag` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `name` VARCHAR(50) NOT NULL,
 PRIMARY KEY (`id`)
);

select* from tag;

INSERT INTO `tag` (`name`)
    VALUES
            ('标签1'),
            ('标签2'),
            ('标签3'),
            ('标签4'),
            ('标签5');
            
INSERT INTO `article_tag` (`article_id`, `tag_id`)
    VALUES
    (1,1), (1,2), (1,3),
    (2,2), (2,3), (2,4),
    (3,3), (3,4), (3,5),
    (4,4), (4,5), (4,1),
    (5,5), (5,1), (5,2);
    
select* from article_tag;

select * from article a join article_tag at on a.id = at.article_id join tag t on t.id = at.tag_id where a.id = 1;

SELECT t.name AS 标签名, a.title AS 文章标题
    FROM article a 
    JOIN article_tag at ON a.id = at.article_id
    JOIN tag t ON t.id = at.tag_id
    WHERE a.id = 1;
    
delete from article where id = 1;

select * from tag where id= 1;








































