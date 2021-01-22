USE tracker_db;

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