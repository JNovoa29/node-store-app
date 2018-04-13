var mysql = require("mysql");
var inq = require("inquirer");
var pmpt = inq.createPromptModule()

// create the connection information for the sql database
var config = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
config.connect(function (e) {
    if (e) throw e
});

//populating console with available items
var inventory = [{
    id: 'item_id',
    product: 'product_name',
    department: 'department_name',
    price: 'price',
    stock: 'stock_quantity'
}]

//questions for consumer
var q1 = [
    {
        type: "input",
        name: "itemNum",
        message: "Input the item number of the product you'd like to purchase."
    }
]

var q2 = [
    {
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase?"
    }
]


var shopCart = `
SELECT * FROM products
WHERE item_id=?
`

var updateStock = `
UPDATE products
SET stock_quantity=?
WHERE item_id=?
`

function displayItems() {
    config.query('SELECT * FROM products', function (e, r) {
        if (e) throw e
        for (i = 0; i < r.length; i++) {
            console.log("ID: " + r[i].item_id + " | " + "Product: " + r[i].product_name + " | " + "Department: " + r[i].department_name + " | " + "Price: " + r[i].price + " | " + "QTY: " + r[i].stock_quantity);
        }
        inq.prompt(q1).then(function (ans) {
            if (e) throw e
            config.query(shopCart, [ans.itemNum], function (e, r) {
                var numChoice = parseInt(r[0].item_id)
                var aItem = r[0].product_name
                var aItemPrice = parseInt(r[0].price)
                var aStock = r[0].stock_quantity
                console.log('Your Cart : ' + aItem + ', $' + aItemPrice)

                inq.prompt(q2).then(function (amt) {
                    if (e) throw e 
    
                    if (amt.quantity <= aStock) {
                        var newStock = aStock - amt.amount
                        var total = amt.amount*aItemPrice
                        console.log(total)
                        console.log(numChoice)
                        config.query('UPDATE products SET stock_quantity=? WHERE item_id=?',[total, numChoice], function(e, r) {
                            if (e) throw e
                            console.log('Thank you for your purchase of ' + amt.amount + '' + aItem + ', total amount paid is $' + total + '. Thank you! Come again.')
                            config.end(function (e) {
                                if (e) throw e
                            })
                        })
                    } else {
                        console.log('Sorry, insufficient stock!')
                        config.end(function (e) {
                            if (e) throw e
                        })
                    }
                })
            })
        })
    })
}


displayItems()
