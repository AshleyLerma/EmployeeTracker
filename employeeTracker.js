var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

const questions = [
  {
    type: "confirm",
    message: "Add department,role, or employee?",
    name: "add",
  },
  {
    type: "confirm",
    message: "View departments, roles, or employees?",
    name: "view",
  },
  {
    type: "confirm",
    message: "Would you like to modify an employee?",
    name: "update",
  }],
// function which prompts the user for what action they should take
function department() {
	inquirer
		.prompt({
			name: "name",
			type: "input",
			message: "What is your department name?",
		})
		.then(function (answer) {
			// when finished prompting, insert a new item into the db with that info
			connection.query(
				"INSERT INTO department SET ?",
				{
					name: answer.department,
				},
				function (err) {
					if (err) throw err;
					// console.table();
				}
			);
		});
}

function role() {
	inquirer
		.prompt(
			{
				name: "title",
				type: "input",
				message: "What is your role title?",
			},
			{
				name: "salary",
				type: "input",
				message: "What is your current salary",
			},
			{
				name: "department_id",
				type: "input",
				message: "What is your department ID?",
			}
		)
		.then(function (answer) {
			// when finished prompting, insert a new item into the db with that info
			connection.query(
				"INSERT INTO role SET ?",
				{
					name: answer.role,
				},
				function (err) {
					if (err) throw err;
					// console.table();
				}
			);
		});
}
function employee() {
	inquirer
		.prompt(
			{
				name: "first_name",
				type: "input",
				message: "What is your first name?",
			},
			{
				name: "last_name",
				type: "input",
				message: "What is your last name?",
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
			}
		)
		.then(function (answer) {
			// when finished prompting, insert a new item into the db with that info
			connection.query(
				"INSERT INTO employee SET ?",
				{
					name: answer.employee,
				},
				function (err) {
					if (err) throw err;
					// console.table();
				}
			);
		});
}
// // function to handle posting new items up for auction
// function postAuction() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?",
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?",
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function (value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         },
//       },
//     ])
// .then(function (answer) {
//   // when finished prompting, insert a new item into the db with that info
//   connection.query(
//     "INSERT INTO auctions SET ?",
//     {
//       item_name: answer.item,
//       category: answer.category,
//       starting_bid: answer.startingBid || 0,
//       highest_bid: answer.startingBid || 0,
//     },
//     function (err) {
//       if (err) throw err;
//       console.log("Your auction was created successfully!");
//       // re-prompt the user for if they want to bid or post
//       start();
//     }
//   );
// });
// }

// function bidAuction() {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", function (err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function () {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?",
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?",
//         },
//       ])
//       .then(function (answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid,
//               },
//               {
//                 id: chosenItem.id,
//               },
//             ],
//             function (error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         } else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }
