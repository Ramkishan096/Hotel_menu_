// MENU DATA
const menu = [
 {id:1,name:"Paneer Butter Masala",price:220,image:"paneer-butter.jpg"},
 {id:2,name:"Veg Biryani",price:180,image:"veg biryani.webp"},
 {id:3,name:"Chicken Biryani",price:250,image:"Chicken Biryani.webp"},
 {id:4,name:"Masala Dosa",price:90,image:"Masala Dosa.webp"},
 {id:5,name:"Idli",price:60,image:"Idli.jpg"},
 {id:6,name:"Samosa",price:20,image:"Samosa.jpg"},
 {id:7,name:"Burger",price:120,image:"Burger.webp"},
 {id:8,name:"Pizza",price:200,image:"Pizza.webp"}
];

let cart = [];
let paymentDone = false;

// DISPLAY MENU
function displayMenu(items) {
    const container = document.getElementById("menu-container");
    container.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <img src="${item.image}">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <button onclick="addToCart(${item.id})">Add</button>
        `;

        container.appendChild(div);
    });
}

// SEARCH
document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const filtered = menu.filter(item =>
        item.name.toLowerCase().includes(value)
    );
    displayMenu(filtered);
});

// ADD TO CART
function addToCart(id) {
    const item = menu.find(x => x.id === id);
    cart.push(item);
    updateCart();
}

// UPDATE CART
function updateCart() {
    const cartList = document.getElementById("cart");
    const totalSpan = document.getElementById("total");

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
        total += item.price;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - ₹${item.price}
            <button onclick="removeItem(${i})">❌</button>
        `;
        cartList.appendChild(li);
    });

    totalSpan.textContent = total;
}

// REMOVE ITEM
function removeItem(i) {
    cart.splice(i, 1);
    updateCart();
}

// PAYMENT
function payNow() {
    if (cart.length === 0) {
        alert("Cart empty");
        return;
    }

    const method = document.getElementById("paymentMethod").value;

    if (method === "") {
        alert("Please select payment method");
        return;
    }

    let total = 0;
    cart.forEach(item => total += item.price);

    // CASH
    if (method === "cash") {
        alert("Order placed ✅ (Cash on Delivery)");

        paymentDone = true;
        document.getElementById("billBtn").style.display = "inline-block";
        return;
    }

    // ONLINE (RAZORPAY)
    if (method === "razorpay") {
        var options = {
            "key": "rzp_test_1234567890",
            "amount": total * 100,
            "currency": "INR",
            "name": "Hotel Menu App",
            "description": "Food Payment",

            "handler": function () {
                alert("Payment Successful ✅");

                paymentDone = true;
                document.getElementById("billBtn").style.display = "inline-block";
            }
        };

        var rzp = new Razorpay(options);
        rzp.open();
    }
}

// DOWNLOAD BILL
function downloadBill() {
    if (!paymentDone) {
        alert("Complete payment first ❌");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;
    let total = 0;

    doc.text("Hotel Bill", 20, y);

    cart.forEach((item, i) => {
        y += 10;
        doc.text(`${i+1}. ${item.name} - ₹${item.price}`, 20, y);
        total += item.price;
    });

    doc.text(`Total: ₹${total}`, 20, y + 10);
    doc.save("bill.pdf");
}

// INIT
displayMenu(menu);