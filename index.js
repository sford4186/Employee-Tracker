//Create Node Server
require('dotenv').config()
var mysql = require("mysql");
var inquirer = require("inquirer");
// const Employee = require("./lib/Employee");
// const Department = require("./lib/Department");
// const Role = require("./lib/Role");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.PASSWORD,
  database: "employeeDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "userSelection",
      type: "list",
      message: "Would you like to do? (Use arrow keys)",
      choices: ["View All Employees", "View All Departments", "View All Roles", "Add an Employee", "Add a Department", "Add a Role", "Update Employee Role"]

    })
    .then(function (answer) {
      // based on their answer, call functions
      if (answer.userSelection === "View All Employees") {
        viewAllEmployees();
      }
      else if (answer.userSelection === "View All Departments") {
        viewAllDepartments();
      } else if (answer.userSelection === "View All Roles") {
        viewAllRoles();
      } else if (answer.userSelection === "Add an Employee") {
        addEmployee();
      } else if (answer.userSelection === "Add a Department") {
        addDepartment();
      } else if (answer.userSelection === "Add a Role") {
        addRole();
      } else if (answer.userSelection === "Update an Employee's Role") {
        updateRole();
      }
      else {
        connection.end();
      }
    });
}

//View Employee, Department, Roles

function viewAllEmployees() {
  var query="SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary from employee LEFT JOIN role ON employee.role_id=role.id INNER JOIN department ON department.id=role.department_id;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start()
  });
}

function viewAllDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    start()
  });
}

function viewAllRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    start()
  });
}


//Adding new Employees, roles, departments
function addEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    const managerList = res.map(employee => {
      return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }})
    
    inquirer
      .prompt([
        {
          name: "firstname",
          type: "input",
          message: "What is the employee's first name?"
        },
        {
          name: "lastname",
          type: "input",
          message: "What is the employee's last name?"
        },
        {
          name: "manager",
          type: "list",
          message: "Who is your employee's manager?",
          choices: managerList
        },
        // {
        //   name: "role",
        //   type: "list",
        //   message: "What is the employee's role?",
        //   choices: roleList
        // }
      ])
      .then(function (answer) {
        // when finished prompting, insert a new item into the db with that info
        console.log(answer)
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.firstname,
              last_name: answer.lastname,
              id:answer.roles

            },
            function(err) {
              if (err) throw err;
              console.log("The employee record was created successfully!");
              start();
            }
          );
        });
      })
    
}

