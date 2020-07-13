var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
const questions = [
  {
    type: "list",
    name: "firstChoice",
    message: "What would you like to do?",
    choices: ["ADD", "VIEW", "UPDATE"],
  },
];
const addQuestions = [
  {
    type: "list",
    name: "addChoice",
    message: "What would you like to do?",
    choices: ["employee", "role", "department"],
  },
];
const viewQuestions = [
  {
    type: "list",
    name: "viewChoice",
    message: "What would you like to view?",
    choices: ["employee", "role", "department"],
  },
];
const updateQuestions = [
  {
    type: "list",
    name: "updateChoice",
    message: "What role would you like to update?",
    choices: ["employee", "role", "department"],
  },
];
// connect to mySQL and begin init function upon connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employee_DB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("mysql connection successful");
  init();
});

// if response is addChoice run through function to add based on what they choose
function init() {
  inquirer.prompt(questions).then((response) => {
    // console.log(response);
    inquirer.prompt(addQuestions).then((response2) => {
      // console.log(response2);
      switch (response2.addChoice) {
        case "employee":
          employee();
          break;
        case "role":
          role();
          break;
        case "department":
          department();
          break;
        default:
          init();
      }
    });
  });
}
// addChoice functions questions based on what they want to add

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

// function viewDepartment() {
//   connection.query("select * from department", function (error, data) {
//     console.table(data);
//     init();
//   });
// }
