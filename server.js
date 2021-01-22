var mysql = require("mysql2");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "tracker_db"
});

connection.connect(function (err) {
    if (err) throw err;
    runTracker();
});

function runTracker() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Employees",
                "View all Employees by department",
                "View all Roles",
                "View all Departments",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(function ({ action }) {
            switch (action) {
                case "View all Employees":
                    viewEmployees();
                    break;

                case "View all Employees by department":
                    viewByDepartment();
                    break;

                case "View all Roles":
                    viewRoles();
                    break;

                case "View all Departments":
                    viewDepartments();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Role":
                    addRole()
                    break;

                case "Add Department":
                    addDepartment()
                    break;

                case "Update Employee Role":
                    updateEmployee()
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}


function viewEmployees() {
    connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id"
        , function (err, res) {
            if (err) throw err;
            else {
                console.table(res);
                runTracker();
            }
        }
    )
}

function viewByDepartment() {

    connection.query(
        "SELECT name FROM department",
        function (err, res) {
            if (err) throw err
            else {
                const depArr = []
                for (let i = 0; i < res.length; i++) {
                    depArr.push(res[i].name)
                }

                inquirer.prompt({
                    type: "list",
                    name: "department",
                    message: "Which department would you like to search by?",
                    choices: depArr
                }).then(function ({ department }) {

                    connection.query(
                        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ?",
                        [department],
                        function (err, data) {
                            if (err) throw err
                            else {
                                console.table(data)
                                runTracker();
                            }
                        }
                    )
                })

            }
        }
    )

}

function viewRoles() {
    connection.query(
        "SELECT role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id"
        , function (err, res) {
            if (err) throw err;
            else {
                console.table(res);
                runTracker();
            }
        }
    )
}

function viewDepartments() {
    connection.query(
        "SELECT name FROM department"
        , function (err, res) {
            if (err) throw err;
            else {
                console.table(res);
                runTracker();
            }
        }
    )
}

function addEmployee() {

    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        else {

            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    name: "role",
                    choices: res.map((role) => ({ name: role.title, value: role.department_id })),

                }
            ]).then(function (answers) {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answers.firstName,
                        last_name: answers.lastName,
                        role_id: answers.role
                    }
                ), function (err, res) {
                    if (err) throw err
                    else {
                        console.log(res)
                        runTracker()
                    }
                }
            })
        }
    }
    )

}

function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        else {

            inquirer.prompt([
                {
                    type: "input",
                    mesage: "What role would you like to add?",
                    name: "role"
                },
                {
                    type: "input",
                    mesage: "What is the salary of this role?",
                    name: "salary"
                },
                {
                    type: "list",
                    message: "Please choose a department:",
                    choices: res.map((department) => ({ name: department.name, value: department.id })),
                    name: "departmentName"
                }

            ]).then((res) => {
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: res.role,
                        salary: res.salary,
                        department_id: res.departmentName
                    },
                    function (err, data) {
                        if (err) throw err
                        else {
                            runTracker();
                        }
                    }
                )
            })
        }
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            mesage: "What department would you like to add?",
            name: "department"
        }
    ]).then((res) => {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: res.department
            },
            function (err, data) {
                if (err) throw err
                else {
                    runTracker();
                }
            }
        )
    })
}

function updateEmployee() {
    connection.query(
        "SELECT * FROM employee",
        function (err, res) {
            if (err) throw err
            else {
                connection.query(
                    "SELECT * FROM role",
                    function (error, data) {
                        if (error) throw error
                        else {
                            inquirer.prompt([
                                {
                                    type: "list",
                                    message: "Which employee would you like to change the role of?",
                                    choices: res.map((employee) => ({ name: employee.first_name + " " + employee.last_name, value: employee.id })),
                                    name: "employee"
                                },
                                {
                                    type: "list",
                                    message: "Which role would you like to give this employee?",
                                    choices: data.map((role) => ({ name: role.title, value: role.id })),
                                    name: "role"
                                },
                            ]).then(response => {
                                connection.query(
                                    "UPDATE employee SET ? WHERE ?",
                                    [
                                        {
                                            role_id: response.role
                                        },
                                        {
                                            id: response.employee
                                        }
                                    ], function (er, response){
                                        if (er) throw er
                                        else {
                                            runTracker();
                                        }
                                    }
                                )
                            })

                        }
                    }
                )


            }
        }
    )
}