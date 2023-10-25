CREATE VIEW customer_orders AS 
    SELECT 
        c.name AS customer_name, 
        o.id AS order_id, 
        o.order_date, 
        o.total_amount
    FROM customers c
    JOIN orders o ON c.id = o.customer_id;

DELIMITER $$
CREATE PROCEDURE get_customer_orders(IN customer_id INT)
BEGIN
        SELECT o.id AS order_id, o.order_date, o.total_amount
        FROM orders o
		WHERE o.customer_id = customer_id;
END $$
DELIMITER ;

CALL get_customer_orders(5);




-- 还是先通过 DELIMITER 指定分隔符为 $$。

-- CREATE FUNCTION 声明函数的名字和参数 x，并且通过 RETURNS 声明返回值类型。

-- BEGIN、END 中间的是函数体。

-- 先 DECLARE 一个 INT 类型的变量，然后 SET 它的值为 x * x，之后通过 RETURN 返回这个结果。

-- 但默认 mysql 是不允许创建函数的。
-- 需要先设置下这个变量：
SET GLOBAL log_bin_trust_function_creators = 1;

DELIMITER $$
CREATE FUNCTION square(x INT)
RETURNS INT
BEGIN
    DECLARE result INT;
    SET result = x * x;
    RETURN result;
END $$
DELIMITER ;

select * from order_items_view;

DELIMITER $$
CREATE FUNCTION get_order_total(order_id INT)
RETURNS DECIMAL(10,2)
BEGIN
	DECLARE total DECIMAL(10,2);
	SELECT SUM(quantity * price) INTO total
		FROM order_items
		WHERE order_id = order_items.order_id;
	RETURN total;
END $$
DELIMITER ;

select * from customers;

create database typeorm_test;