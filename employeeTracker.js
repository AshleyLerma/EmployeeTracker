var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employee_DB",
});

const mainMenu = [
  {
    type: "list",
    name: "selection",
    message: "What would you like to do?",
    choices: [
      "Add Employee",
      "Add Role",
      "Add Department",
      "View All Employees",
      "View All Employees By Role",
      "View All Employees By Department",
      "Update An Employee",
    ],
  },
];

const updateQuestions = [
  {
    type: "list",
    name: "updateEmployee",
    message: "Which employee would you like to update?",
    // TODO: Pull full employee list from SQL
    choices: [],
  },
];

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  init();
});

// Offer main menu then prompt next function based on response
function init() {
  inquirer.prompt(mainMenu).then((response) => {
    switch (response.selection) {
      case "Add Employee":
        employee();
        break;
      case "Add Role":
        role();
        break;
      case "Add Department":
        department();
        break;
      case "View All Employees":
        viewEmployees();
        break;
      case "View All Employees By Role":
        viewRole();
        break;
      case "View All Employees By Department":
        viewDepartment();
        break;
      case "Update An Employee":
        console.log("TBD");
        break;
    }
  });
}

// Add Employee
function employee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role_id",
        type: "input",
        message: "What is your role id?",
      },
      {
        name: "manager_id",
        type: "input",
        message: "What is your manager id?",
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },
        function (err) {
          if (err) throw err;
        }
      );
      init();
    });
}
// Add Role
function role() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is your role title?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for this role?",
        default: "0.00",
      },
      {
        name: "department_id",
        type: "input",
        message: "What is your department ID?",
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        function (err) {
          if (err) throw err;
        }
      );
      init();
    });
}
// Add Department
function department() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is your department name?",
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        function (err) {
          if (err) throw err;
        }
      );
      init();
    });
}
// View all employees by department
function viewDepartment() {
  connection.query("select * from department", function (err, data) {
    if (err) throw err;
    console.table(data);
    // init();
  });
}
// View all employees by role
function viewRole() {
  connection.query("select * from role", function (err, data) {
    if (err) throw err;
    console.table(data);
    // init();
  });
}
// View all employees
function viewEmployees() {
  connection.query("select * from employee", function (err, data) {
    if (err) throw err;
    console.table(data);
    // init();
  });
}
