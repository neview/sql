use practice;

-- 创建 customers 表，用于存储客户信息
CREATE TABLE IF NOT EXISTS `customers` (
 `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '客户ID，自增长',
 `name` varchar(255) NOT NULL COMMENT '客户姓名，非空',
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户信息表';

-- 创建 orders 表，用于存储订单信息
CREATE TABLE IF NOT EXISTS `orders` (
 `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单ID，自增长',
 `customer_id` int(11) NOT NULL COMMENT '客户ID，非空',
 `order_date` date NOT NULL COMMENT '订单日期，非空',
 `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额，非空',
 PRIMARY KEY (`id`),
 FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单信息表';

-- 创建 order_items 表，用于存储订单商品信息
CREATE TABLE IF NOT EXISTS `order_items` (
 `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品ID，自增长',
 `order_id` int(11) NOT NULL COMMENT '订单ID，非空',
 `product_name` varchar(255) NOT NULL COMMENT '商品名称，非空',
 `quantity` int(11) NOT NULL COMMENT '商品数量，非空',
 `price` decimal(10,2) NOT NULL COMMENT '商品单价，非空',
 PRIMARY KEY (`id`),
 FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品信息表';

-- 向 customers 表插入数据
INSERT INTO `customers` (`name`) 
    VALUES 
        ('张丽娜'),('李明'),('王磊'),('赵静'),('钱伟'),
        ('孙芳'),('周涛'),('吴洋'),('郑红'),('刘华'),
        ('陈明'),('杨丽'),('王磊'),('张伟'),('李娜'),
        ('刘洋'),('陈静'),('杨阳'),('王丽'),('张强');

-- 向 orders 表插入数据
INSERT INTO `orders` (`customer_id`, `order_date`, `total_amount`)
    VALUES
        (1, '2022-01-01',100.00),(1, '2022-01-02',200.00),
        (2, '2022-01-03',300.00),(2, '2022-01-04',400.00),
        (3, '2022-01-05',500.00),(3, '2022-01-06',600.00),
        (4, '2022-01-07',700.00),(4, '2022-01-08',800.00),
        (5, '2022-01-09',900.00),(5, '2022-01-10',1000.00);

-- 向 order_items 表插入数据
INSERT INTO `order_items` (`order_id`, `product_name`, `quantity`, `price`)
    VALUES
        (1, '耐克篮球鞋',1,100.00),
        (1, '阿迪达斯跑步鞋',2,50.00),
        (2, '匡威帆布鞋',3,100.00),
        (2, '万斯板鞋',4,50.00),
        (3, '新百伦运动鞋',5,100.00),
        (3, '彪马休闲鞋',6,50.00),
        (4, '锐步经典鞋',7,100.00),
        (5, '亚瑟士运动鞋',10,50.00),
        (5, '帆布鞋',1,100.00),
        (1, '苹果手写笔',2,50.00),
        (2, '电脑包',3,100.00),
        (3, '苹果手机',4,50.00),
        (4, '苹果耳机',5,100.00),
        (5, '苹果平板',7,100.00);
        
select * from customers;

select * from orders;

select * from order_items;

SELECT customers.name, SUM(orders.total_amount) AS total_amount 
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id 
    GROUP BY customers.id;
    
SELECT customers.name, SUM(orders.total_amount) AS total_amount 
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id 
    GROUP BY customers.id
    ORDER BY total_amount DESC
    limit 0,3;
    
-- 查询每个客户的订单总金额
select customers.name,sum(orders.total_amount) as total_amount
	from customers
    inner join orders on customers.id = orders.customer_id
    group by customers.id
    order by total_amount desc;
    
-- 查询每个客户的订单总金额，并计算其占比
select customers.name,sum(orders.total_amount) as total_amount,
	sum(orders.total_amount) / (select sum(total_amount) from orders) as aaa
    from customers
    inner join orders on customers.id = orders.customer_id
    group by customers.id;
    
-- 查询每个客户的订单总金额，并列出每个订单的商品清单
SELECT customers.name, orders.order_date, orders.total_amount, 
	order_items.product_name, order_items.quantity, order_items.price
    FROM customers
    JOIN orders ON customers.id = orders.customer_id
    JOIN order_items ON orders.id = order_items.order_id
    ORDER BY customers.name, orders.order_date;

-- 查询每个客户的订单总金额，并列出每个订单的商品清单，同时只显示客户名字姓“张”的客户的记录
SELECT customers.name, orders.order_date, orders.total_amount, 
	order_items.product_name, order_items.quantity, order_items.price
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id
    INNER JOIN order_items ON orders.id = order_items.order_id
    WHERE customers.name LIKE '张%'
    ORDER BY customers.name, orders.order_date;

-- 查询每个客户的订单总金额，并列出每个订单的商品清单，同时只显示订单日期在2022年1月1日到2022年1月3日之间的记录
SELECT customers.name, orders.order_date,
	orders.total_amount, order_items.product_name,
    order_items.quantity, order_items.price
    FROM customers
    INNER JOIN orders ON customers.id = orders.customer_id
    INNER JOIN order_items ON orders.id = order_items.order_id
    WHERE orders.order_date BETWEEN '2022-01-01' AND '2022-01-03'
    ORDER BY customers.name, orders.order_date;

-- 查询每个客户的订单总金额，并计算商品数量，只包含商品名称包含“鞋”的商品，商品名用-连接，显示前 3 条记录
SELECT c.name AS customer_name,
        SUM(o.total_amount) AS total_amount,
        COUNT(oi.id) AS total_quantity,
        GROUP_CONCAT(oi.product_name SEPARATOR '-') AS product_names
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.product_name LIKE '%鞋%'
    GROUP BY c.name
    ORDER BY total_amount DESC
    LIMIT 3;

-- 查询存在订单的客户
SELECT * FROM customers c
    WHERE EXISTS (
            SELECT 1 FROM orders o WHERE o.customer_id = c.id
    );
        
-- 将王磊的订单总金额打九折
SELECT * FROM orders 
 JOIN customers ON orders.customer_id = customers.id
 WHERE customers.name = '王磊';
-- select customers.name,
--     sum(orders.total_amount)*0.9
--     from customers
--     join orders on customers.id = orders.customer_id
--     WHERE customers.name = '王磊';

select * from order_items;

select * from orders;

-- 开启事务
START TRANSACTION;

UPDATE order_items SET quantity=1 WHERE order_id=3;
UPDATE orders SET total_amount=200 WHERE id=3;

-- 回滚（变回原来的数据）
rollback;

-- 提交（数据修改了）    
commit;    
    
-- 只回滚一部分  开始
START TRANSACTION;

SAVEPOINT aaa;

UPDATE order_items SET quantity=1 WHERE order_id=3;

SAVEPOINT bbb;

UPDATE orders SET total_amount=200 WHERE id=3;

SAVEPOINT ccc;
-- 只回滚一部分  结束

-- 回滚到bbb处
ROLLBACK TO SAVEPOINT bbb;

-- 回滚到ccc处
ROLLBACK TO SAVEPOINT ccc;

-- 查询当前的事务隔离级别
select @@transaction_isolation;
    
    
    
    