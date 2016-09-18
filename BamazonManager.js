var inquire = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({

	host: "localhost",
	user: "root",
	password: "",
	database: "Bamazon"

});

connection.connect();

function viewProducts(){
	var qStr = "SELECT * FROM `Products`";
	connection.query(qStr,function(err, rows){

			rows.forEach(function(val){
			console.log("Item ID: "+val.ItemID+" | Product Name: "+val.ProductName+" | Price: $"+val.Price+" | Qty: "+val.StockQuantity);
			console.log("---------------------------------------------------------------------------------------------------------------");
		})
	})
}

function viewLowInventory(){}

function addInventory(){}

function addProduct(){}

inquire.prompt(
	[
		{
			type: "list",
			message: "What would you like to do?",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
			name: "choice"
		}
	]).then(function(user){
		

		switch(user.choice){
			case ("View Products for Sale"):
				viewProducts();
			break;
			case ("View Low Inventory"):
			break;
			case ("Add to Inventory"):
			break;
			case ("Add New Product"):
			break;
		}

		connection.end();

	})