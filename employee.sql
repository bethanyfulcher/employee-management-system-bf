DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(45) NOT NULL,
    salary INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(45) NOT NULL
);


INSERT INTO department (name)
VALUE ("Sales"),
("Engineering"),
("Legal"),
("Finance"),
("Service"),
("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES
("Accountant", 125000, 6),
("Legal Team Lead", 250000, 3),
("Lawyer", 190000, 3),
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Software Engineer", 120000, 2),
("Lead Engineer", 150000, 2),


INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Bethany", "Fulcher", 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Avi", "Paxton", 2, 1),
("Robert", "Smith", 4, 1),
("Sarah", "Evans", 3, 1);