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
			connection.end();
	})
}

function viewLowInventory(){
	var qStr = "SELECT * FROM `Products` WHERE `StockQuantity` < 5";
	connection.query(qStr,function(err, rows){

			rows.forEach(function(val){
			console.log("Item ID: "+val.ItemID+" | Product Name: "+val.ProductName+" | Price: $"+val.Price+" | Qty: "+val.StockQuantity);
			console.log("---------------------------------------------------------------------------------------------------------------");
		})
			connection.end();
	})
}

function addInventory(){

	inquire.prompt([{
		type: "text",
		message: "What's the ID of the product you want to update?",
		name: "id",
		validate: function(val){
			return (!isNaN(val) && parseInt(val) > 0)
		}
	},
	{
		type:"text",
		message: "How much of that item do you want to add?",
		name: "quantity",
		validate: function(val){
			return (!isNaN(val) && parseInt(val) > 0)
		}

	}]).then(function(user){

		console.log(user.id, user.quantity)

		var oldVal;
		var qStr = "SELECT `ItemID`,`StockQuantity` FROM `Products` WHERE `ItemID` = ?";
		connection.query(qStr,[user.id], function(err, rows){
			if(err){ 
				console.log(err);
				return err;
			}
			console.log(rows);
			
			if(rows.length > 0){

				oldVal = parseInt(rows[0].StockQuantity);
				
				var qStr2 = "UPDATE `Products` SET `StockQuantity` = ? WHERE `ItemID` = ?";
				connection.query(qStr2,[oldVal + parseInt(user.quantity), user.id], function(err, result){
					if (err) throw err;
			 
			  		console.log('changed ' + result.changedRows + ' rows');
				})
				
			}
		

			connection.end();

		});

	})


}


function addProduct(){

	inquire.prompt([
	{
		type: "text",
		message: "What's the name of the new product?",
		name: "product",
		
	},
	{
		type:"text",
		message: "What department does it belong too?",
		name: "department",
		

	},
	{
		type:"text",
		message: "How much does this product cost?",
		name: "price",
		validate: function(val){
			return (!isNaN(val) && parseFloat(val) > 0)
		}

	},
	{
		type:"text",
		message: "How much is in stock?",
		name: "stock",
		validate: function(val){
			return (!isNaN(val) && parseInt(val) > 0)
		}

	}
	]).then(function(user){


		var oldVal;
		var qStr = "INSERT INTO `Products` SET ?";
		var values = {
						ProductName : user.product, 
						DepartmentName : user.department, 
						Price: parseFloat(user.price), 
						StockQuantity: parseInt(user.stock)
					}

		connection.query(qStr,values, function(err, result){
			if(err){ 
				console.log(err);
				return err;
			}
			console.log(result.insertId);
			

			connection.end();

		});

	})

}

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
				viewLowInventory();
			break;
			case ("Add to Inventory"):
				addInventory();
			break;
			case ("Add New Product"):
				addProduct();
			break;
		}

		
	})