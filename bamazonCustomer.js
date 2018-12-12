var inquirer = require("inquirer");
var mysql = require("mysql");
var Joi = require("joi");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  //readColleges();
  splash();
});

function end(){
    process.end
}

function validateAge(quantityinput) {
    var valid;
    Joi.validate(quantityinput, Joi.number().required().min(10).max(99), function(err,val){
        if (err){
            console.log(err.message);
            valid = err.message;           
        }
        else{
            valid = true;
            console.log("elsed");
        }
        
    });
    return valid;
    console.log("returened");
}

function splash(){
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        inquirer
        .prompt([
            {   name: "Item",
                type: "list",
                message: "What would you like to buy?  (price/per unit)",
                choices:  function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].id+"_"+results[i].product_name+" - $"+results[i].price);
                    }
                    return choiceArray;

                } 
            }
        ]).then(function(res) {
 
            //seperating ID off selection
                var splitID = [];
                var string = res.Item;
                splitID = string.split("_");
                
            //connects/searchs db via id, to pull quantity
                //     connection.query("SELECT * FROM products where id="+ splitID[0],function(err,res){
                //         var itemsprice = res[0].price
                //     }
                // )

            //connection (A) start
                    connection.query("SELECT * FROM products where id="+ splitID[0], function(err, res) {
                            if (err) throw err;
                        
                            var currentstock = res[0].stock_quantity;

                            console.log("\n     There's only "+currentstock+" left! How many would you like?");

        
                        ///inquirer for quantity input (nested function)
                        inquirer 
                            .prompt([
                                {
                                    name: "quantityinput",
                                    type: "input",
                                    message: "          (type quantity, then hit enter)"
                                }
                            ]).then(function(response){
                               //connection (b) start
                                    connection.query("SELECT price FROM products where id="+ splitID[0], function(err, res) {
                                        if (err) throw err;
                                    })
                               //connection (b) end
                                var quantityvar = response.quantityinput
                                var currentcart = quantityvar*res[0].price
                                console.log("\n\n       Current Cart Total: $"+currentcart);
                                 /////////////nested inquirer
                                 inquirer 
                                 .prompt([
                                    {
                                         name: "shipping",
                                         type: "list",
                                         choices: ["    • Overnight: $47.72","    • Expedited (3-5 days): $18.42","    • Free (5-10 days): $0.00"],
                                         message: "\n          (shipping?)",
                                
                                    }
                                 ]).then(function(response){
                            
                                    switch (response.shipping) {
                                        case "    • Overnight: $47.72":
                                          currentcart = currentcart + 47.72
                                          console.log("\n\n       Current Cart Total: $"+currentcart+"\n");
                                          break;

                                        case "    • Expedited (3-5 days): $18.42":
                                          currentcart = currentcart + 18.42
                                          console.log("\n\n       Current Cart Total: $"+currentcart+"\n");
                                          break;

                                        case "    • Free (5-10 days): $0.00":
                                          currentcart = currentcart
                                          console.log("\n\n       Current Cart Total: $"+currentcart+"\n");
                                          break;
                                    }
                                    /////nested inquirer 911
                                        inquirer
                                            .prompt([
                                                {
                                                    name: "checkout",
                                                    type: "confirm",
                                                    message: "\n    Would you like to check out? ",
                                                    default: false

                                                }
                                            ]).then(function(lastresp){

                                                if (lastresp.checkout) {

                                                    function updateProduct() {
                                                        console.log("Order Confirmed, Have a Great Day!\n");
                                                        var query = connection.query(
                                                          "UPDATE products SET ? WHERE ?",
                                                          [
                                                            {
                                                              stock_quantity: (currentstock - quantityvar)
                                                            },
                                                            {
                                                              id: splitID[0]
                                                            }
                                                          ],
                                                          function(err, res) {
                                                           
                                                          }
                                                        );
                                                      }


                                                      updateProduct();
                                                     end();
                                                    
                                                }
                                                else {
                                                    console.log("\n     That's okay it looks like you've spent enough ;)\n          come again when you are more sure.\n");

                                                    end();



                                                }
                                            });
                                    /////nested inquirer 911
                             });
                                 /////////////nested inq end
                        });
                    });
                    ////connection (A) end 
        });
    });
}
/////end of splash();



// function readColleges() {
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;

//     // Log all results of the SELECT statement
//     console.log(res);
//     connection.end();
//   });
// }


