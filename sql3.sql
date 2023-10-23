select * from student;

SELECT MAX(score) FROM student;

select name,class from student where score = 95;

select name,class from student where score = (select max(score) from student);

select * from student where score > (select avg(score) from student);

select * from department;

select * from employee;

select name from department where exists (
	select * from employee where department.id = employee.department_id
);

select name from department where not exists (
	select * from employee where department.id = employee.department_id
);

CREATE TABLE product (
     id INT PRIMARY KEY,
     name VARCHAR(50),
     price DECIMAL(10,2),
     category VARCHAR(50),
     stock INT
);

INSERT INTO product (id, name, price, category, stock)
	VALUES 
		(1, 'iPhone12',6999.00, '手机',100),
		(2, 'iPad Pro',7999.00, '平板电脑',50),
		(3, 'MacBook Pro',12999.00, '笔记本电脑',30),
		(4, 'AirPods Pro',1999.00, '耳机',200),
		(5, 'Apple Watch',3299.00, '智能手表',80);
        
select * from product;

select name,price from product where price = (select max(price) from product);

CREATE TABLE avg_price_by_category (
 id INT AUTO_INCREMENT,
 category VARCHAR(50) NOT NULL,
 avg_price DECIMAL(10,2) NOT NULL,
 PRIMARY KEY (id)
);


insert into avg_price_by_category (category,avg_price)
		select category, avg(price) from product group by category;
        
select * from avg_price_by_category;

select category, avg(price) from product group by category;

update employee set name = concat('技术-',name)
	where department_id = (
		select id from department where name = '技术部'
    );

delete from employee where department_id = (
	select id from department where name = '技术部'
);

select * from employee;

create database practice;












