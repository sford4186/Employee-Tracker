DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department(
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL, -- to hold department name
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL, -- to hold role title
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO department(name)
VALUES ("Information Technology");

INSERT INTO role(title, salary, department_id)
VALUES ("Software Engineer", 75000, 101);

INSERT into employee(first_name, last_name, role_id, manager_id, department_id)
VALUES("John","Doe",20,1, 101);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;


