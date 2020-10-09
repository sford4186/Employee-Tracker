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
  console.log("WELCOME TO THE EMPLOYEE TRACKER")
  console.log("***************************************************************************")
  console.log("")
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
      choices: ["View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "View All Departments",
        "View All Roles",
        "Add an Employee",
        "Add a Department",
        "Add a Role",
        "Update Employee Role",
        "Exit",
      ]

    })
    .then(function (answer) {
      // based on their answer, call functions
      if (answer.userSelection === "View All Employees") {
        viewAllEmployees();
      } else if (answer.userSelection === "View All Employees by Department") {
        viewEmpByDepartment();
      } else if (answer.userSelection === "View All Employees by Manager") {
        viewEmpByManager();
      } else if (answer.userSelection === "View All Departments") {
        viewAllDepartments();
      } else if (answer.userSelection === "View All Roles") {
        viewAllRoles();
      } else if (answer.userSelection === "Add an Employee") {
        addEmployee();
      } else if (answer.userSelection === "Add a Department") {
        addDepartment();
      } else if (answer.userSelection === "Add a Role") {
        addRole();
      } else if (answer.userSelection === "Update Employee Role") {
        updateEmployee();
      }
      else if (answer.userSelection === "Exit") {
        connection.end();
      }
    });
}

/*Employee Views and functions*/
//**************************************************************************************** */
//View All Employees
function viewAllEmployees() {
  let query = "SELECT e.id, e.first_name, e.last_name, department.name AS department, role.title, role.salary, m.first_name AS manager_first_name,  m.last_name AS manager_last_name from employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id=role.id INNER JOIN department ON department.id=role.department_id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start()
  });
}

//View All Employees by Manager
function viewEmpByManager() {
  inquirer
    .prompt([
      {
        name: "managerFirst",
        type: "input",
        message: "What is the manager's first name?"
      },
      {
        name: "managerLast",
        type: "input",
        message: "What is the manager's last name?"

      }
    ])
    .then(function (answer) {
      console.log(answer.managerFirst + " " & answer.managerLast);
      let query = "SELECT e.id, e.first_name, e.last_name, department.name AS department, role.title, role.salary, m.first_name AS manager_first_name,  m.last_name AS manager_last_name from employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id=role.id INNER JOIN department ON department.id=role.department_id WHERE m.first_name=? AND m.last_name=?";
      connection.query(query, [answer.managerFirst, answer.managerLast], function (err, res) {
        if (err) throw err;
        console.table(res);
        start()

      });
    });
}

//View All Employees By a specified Department
function viewEmpByDepartment() {
  connection.query("SELECT * FROM department", (err, res) => {
    const departments = res.map(depart => { return { name: depart.name, value: depart.id } })

    inquirer
      .prompt(
        {
          name: "department",
          type: "list",
          message: "Enter a Department: ",
          choices: departments
        }
      )
      .then(function (answer) {
        console.log(answer.department);
        let query = "SELECT e.id, e.first_name, e.last_name, department.name AS department, role.title, role.salary, m.first_name AS manager_first_name,  m.last_name AS manager_last_name from employee e LEFT JOIN employee m ON e.manager_id = m.id LEFT JOIN role ON e.role_id=role.id INNER JOIN department ON department.id=role.department_id WHERE department.id=?";
        connection.query(query, answer.department, function (err, res) {
          if (err) throw err;
          console.table(res);
          start()
        });

      });

  })
}


// //Find all managers
function getManagers() {
  var query = "SELECT B.first_name AS manager_first, B.last_name AS manager_last from employee A, employee B where NOT A.manager_id<>B.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    //start()

  });


}

//Add a New Employee**********************************************************************
function addEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    const managerList = res.map(employee => {
      return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
    })
    connection.query("SELECT * FROM role", (err, res) => {

      const roleList = res.map(role => { return { name: role.title, value: role.id } })

      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
          },
          {
            name: "role_id",
            type: "list",
            message: "What is the employee's role?",
            choices: roleList
          },
          {
            name: "manager_id",
            type: "list",
            message: "Who is your employee's manager?",
            choices: managerList
          },          
        ])
        .then(function (answer) {
          // when finished prompting, insert a new item into the db with that info
          //console.log(answer)
          connection.query(
            "INSERT INTO employee SET ?;",
            answer,
            function (err) {
              if (err) throw err;
              console.log("The employee record was created successfully!");
              start();
            }
          );
        });
    })
  })

}



/*Department Views and Functions*/
//**************************************************************************************** */

function viewAllDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    start()
  });
}

/*Role Views and Functions*/
//******************************************************************************************* */

function viewAllRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    start()
  });
}

//Add a new role

function addRole() {
  let query = "SELECT * FROM department;"
  connection.query(query, function (err, res) {
    if (err) throw err;
    const departmentList = res.map(department => {

      return { name: department.name, value: department.id }
    })

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the new job title: "
        },
        {
          name: "salary",
          type: "input",
          message: "Enter your salary: "
        },
        {
          name: "department_id",
          type: "list",
          message: "Select a department:",
          choices: departmentList

        }
      ])
      .then(function (answer) {

        connection.query(`INSERT INTO role SET ?`, answer, function (error, results) {
          if (error) throw error;
          console.log("Insert into role... successful");
          start()
        });
      });
  });
}

function addDepartment() {
 
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "What department would you like to add? "
        },
                
      ])
      .then(function (answer) {
        //console.log(answer)
        connection.query(`INSERT INTO department SET ?`, answer, function (error, results) {
          if (error) throw error;
          console.log("Insert into department... successful");
          start()
        });
      });

}

function updateEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    const employeeList = res.map(employee => {
      return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
    })
    connection.query("SELECT * FROM role", (err, res) => {

      const roleList = res.map(role => { return { name: role.title, value: role.id } })

      inquirer
        .prompt([
          {
            name: "id",
            type: "list",
            message: "Which employee would you like to update?",
            choices: employeeList
          },
          {
            name: "role_id",
            type: "list",
            message: "What is the employee's role?",
            choices: roleList
          },          
        ])
        .then(function (answer) {
          // when finished prompting, insert a new item into the db with that info
          console.log(answer)
          connection.query(
            "UPDATE employee SET role_id=? WHERE id=?;",
          [answer.role_id, answer.id],
            function (err) {
              if (err) throw err;
              console.log("The employee record was created successfully!");
              start();
            }
          );
        });
    })
  })

}


