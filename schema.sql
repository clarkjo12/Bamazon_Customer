DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db; 

-- Create the table
CREATE TABLE products (
  id int AUTO_INCREMENT,
  product_name varchar(30) NOT NULL,
  department_name varchar(30) NOT NULL,
  price double NOT NULL,
  stock_quantity int NOT NULL,
  PRIMARY KEY(id)
);
