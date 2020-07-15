var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
let deptArr = [];
let roleArr = [];
let emplArr = [];
let managerArr = [];

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
    name: "firstChoice",
    message: "What would you like to do?",
    choices: [
      "Add Employee",
      "Add Role",
      "Add Department",
      "View All Employees",
      "View All Employees By Role",
      "View All Employees By Department",
      "View All Roles",
      "View All Departments",
      "Update An Employee",
      "Exit",
    ],
  },
];

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
  // run the start function after the connection is made to prompt the user
  init();
});

// Offer main menu then prompt next function based on response
function init() {
  inquirer.prompt(mainMenu).then((response) => {
    switch (response.firstChoice) {
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
        viewByRole();
        break;
      case "View All Employees By Department":
        viewByDepartment();
        break;
      case "View All Roles":
        viewRoles();
        break;
      case "View All Departments":
        viewDepartments();
        break;
      case "Update An Employee":
        updateEmployee();
        break;
      case "Exit":
        connection.end();
        break;
      default:
        connection.end();
    }
  });
  // update arrays each time the init function is called
  getDepts();
  getRoles();
  getEmployees();
  getManagers();
}

// Functions to update Employee, Department and Role arrays

// Get All Departments
function getDepts() {
  connection.query(`SELECT department_name FROM department`, function (
    err,
    departments
  ) {
    if (err) throw err;
    deptArr = [];
    for (i = 0; i < departments.length; i++) {
      deptArr.push(departments[i].department_name);
    }
    // console.log(deptArr);
  });
}
// get All Roles
function getRoles() {
  connection.query(`SELECT title FROM role`, function (err, roles) {
    if (err) throw err;
    roleArr = [];
    for (i = 0; i < roles.length; i++) {
      roleArr.push(roles[i].title);
    }
    // console.log(roleArr);
  });
}
// Get All Employees
function getEmployees() {
  connection.query(
    `SELECT concat(employee.first_name, ' ' ,  employee.last_name) AS Name FROM employee`,
    function (err, employees) {
      if (err) throw err;
      emplArr = [];
      for (i = 0; i < employees.length; i++) {
        emplArr.push(employees[i].Name);
      }
      // console.log(emplArr);
    }
  );
}

function getManagers() {
  connection.query(`SELECT employee.last_name FROM employee`, function (
    err,
    managers
  ) {
    if (err) throw err;
    emplArr = [];
    for (i = 0; i < managers.length; i++) {
      managerArr.push(managers[i].last_name);
    }
    // console.log(managerArr);
  });
}

// Functions to execute main menu selections

// Add Employee
function employee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
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
            name: "roleName",
            type: "list",
            message: "What is the employee's role?",
            choices: roleArr,
          },
          {
            name: "managerName",
            type: "list",
            message: "Who is this employee's Manager?",
            choices: managerArr,
          },
        ])
        .then(function (answer) {
          let roleID;
          for (let r = 0; r < res.length; r++) {
            if (res[r].title == answer.roleName) {
              roleID = res[r].role_id;
            }
          }
          let managerID;
          for (let m = 0; m < res.length; m++) {
            if (res[m].last_name == answer.managerName) {
              managerID = res[m].employee_id;
            }
          }
          // when finished prompting, insert a new item into the db with that info
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: roleID,
              // TODO: Get manager_id by name
              manager_id: managerID,
            },
            function (err) {
              if (err) throw err;
            }
          );
          init();
        });
    });
  });
}
// Add Role
function role() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
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
          name: "departmentName",
          type: "list",
          message: "What is your department is this role in?",
          choices: deptArr,
        },
      ])
      .then(function (answer) {
        // set corresponding department ID to variable
        let deptID;
        for (let d = 0; d < res.length; d++) {
          if (res[d].department_name == answer.departmentName) {
            deptID = res[d].department_id;
          }
        }
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: deptID,
          },
          function (err) {
            if (err) throw err;
          }
        );
        init();
      });
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
function viewByDepartment() {
  connection.query(
    `SELECT employee.employee_id, employee.first_name, employee.last_name, department.department_name FROM employee 
  LEFT JOIN role ON employee.role_id = role.role_id
  LEFT JOIN department ON role.department_id = department.department_id 
  ORDER BY department.department_name`,
    function (err, data) {
      if (err) throw err;
      console.table(data);
      init();
    }
  );
}
// View all employees by role
function viewByRole() {
  connection.query(
    `SELECT employee.employee_id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name FROM employee 
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON role.department_id = department.department_id 
    ORDER BY role.title`,
    function (err, data) {
      if (err) throw err;
      console.table(data);
      init();
    }
  );
}
// View all roles
function viewRoles() {
  connection.query(`SELECT * FROM role`, function (err, data) {
    if (err) throw err;
    console.table(data);
    init();
  });
}
// View all departments
function viewDepartments() {
  connection.query(`SELECT * FROM department`, function (err, data) {
    if (err) throw err;
    console.table(data);
    init();
  });
}
// View all employees
function viewEmployees() {
  connection.query(
    `SELECT employee.employee_id, employee.first_name, employee.last_name, role.title,
  department.department_name AS department,role.salary,CONCAT(a.first_name, " ", a.last_name) AS manager
  FROM employee
  LEFT JOIN role ON employee.role_id = role.role_id
  LEFT JOIN department ON role.department_id = department.department_id
  LEFT JOIN employee a ON a.employee_id = employee.manager_id`,
    function (err, data) {
      if (err) throw err;
      console.table(data);
      init();
    }
  );
}
// function updateEmployee() {
//   inquirer
//     .prompt([
//       {
//         name: "employeeChoice",
//         type: "list",
//         message: "Which employee would you like to update?",
//         choices: emplArr,
//       },
//     ])
//     .then(function (answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO employee SET ?",
//         {
//           first_name: answer.first_name,
//           last_name: answer.last_name,
//           role_id: answer.role_id,
//           manager_id: answer.manager_id,
//         },
//         function (err) {
//           if (err) throw err;
//         }
//       );
//       init();
//     });
// }
