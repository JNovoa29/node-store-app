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
    // run the start function after the connection is made to prompt the user
});


var inventory = [{
    id: 'item_id',
    product: 'product_name',
    department: 'department_name',
    price: 'price',
    stock: 'stock_quantity'
}]

var questions = [{
        type: "input",
        name: "itemNum",
        message: "Input the item number of the product you'd like to purchase."
    },
    {
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase?"
    }
]


function displayItems() {
    config.query('SELECT * FROM products', function (e, r) {
            if (e) throw e
            for (i = 0; i < r.length; i++) {
                console.log("ID: " + r[i].item_id + " | " + "Product: " + r[i].product_name + " | " + "Department: " + r[i].department_name + " | " + "Price: " + r[i].price + " | " + "QTY: " + r[i].stock_quantity);
        }
        inq.prompt(questions).then(function (ans) {
            console.log(ans)
        })
    })
}

function browseShop(r) {
    switch (r) {
        case 'Enter the Item ID of the product you want.':
            break
        case 'How many would you like?':
            break
    }
}

// function which prompts the user for what action they should take
function goShopping() {

}


displayItems()
browseShop()
goShopping()