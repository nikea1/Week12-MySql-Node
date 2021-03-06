var inquire = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({

	host: "localhost",
	user: "root",
	password: "",
	database: "Bamazon"

});


function orderPrompt(){
	
	inquire.prompt([
	{

		type: "text",
		message: "Input the ID of the product you want to buy.",
		name: "id",
		validate: function(val){
			return (!isNaN(val) && parseInt(val) > 0)
		}

	},
	{

		type: "text",
		message: "Input how many of that product would you like to order.",
		name: "quantity",
		validate: function(val){
			return (!isNaN(val) && parseInt(val) > 0)
		}
	}
	]).then(function(user){
		console.log(user.id, user.quantity)

		var oldVal;
		//queries for id and quantity and responds if number in stock is equal or greater than customer order.
		var qStr = "SELECT `ItemID`,`StockQuantity` FROM `Products` WHERE `ItemID` = ? AND `StockQuantity` >= ?";
		connection.query(qStr,[user.id, user.quantity], function(err, rows){

			//checks if data exists
			if(rows.length > 0){
				//store the quantity of item
				oldVal = parseInt(rows[0].StockQuantity);
				
				//updates quantity of item
				var qStr2 = "UPDATE `Products` SET `StockQuantity` = ? WHERE `ItemID` = ?";
				connection.query(qStr2,[oldVal - parseInt(user.quantity), user.id], function(err, result){
					if (err) throw err;
			 	
			  		console.log('changed ' + result.changedRows + ' rows');
				})
				
			}
			else{
				//if previous query yeild no data...
				console.log("Insufficient quantity!");	
			}

			connection.end();

		});
	});
}

connection.connect();

//display store info
connection.query("SELECT * FROM `Products` WHERE stockQuantity > 0",function(err, rows){
	if (err) return err;

	//displays what product is available to buy
	rows.forEach(function(val){
		console.log("Item ID: "+val.ItemID+" | Product Name: "+val.ProductName+" | Price: $"+val.Price);
		console.log("--------------------------------------------------------------------------------");
	})
	//run customer prompt
	orderPrompt();
	
});



