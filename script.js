// // ===== DOM =====
// const loginPage = document.getElementById("loginPage");
// const mainApp = document.getElementById("mainApp");
// const username = document.getElementById("username");
// const password = document.getElementById("password");
// const menuContainer = document.getElementById("menu-container");
// const cartList = document.getElementById("cart");
// const totalSpan = document.getElementById("total");
// const paymentModal = document.getElementById("paymentModal");
// const timer = document.getElementById("timer");

// MENU DATA WITH IMAGES
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

// CART
function addToCart(id) {
    const item = menu.find(x => x.id === id);
    cart.push(item);
    updateCart();
}

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

function removeItem(i) {
    cart.splice(i, 1);
    updateCart();
}

// 🔥 RAZORPAY PAYMENT
function payNow() {
    if (cart.length === 0) {
        alert("Cart empty");
        return;
    }

    let total = 0;
    cart.forEach(item => total += item.price);

    var options = {
        "key": "rzp_test_1234567890", // 👉 Replace with your Razorpay test key
        "amount": total * 100,
        "currency": "INR",
        "name": "Hotel Menu App",
        "description": "Food Payment",

        "handler": function (response) {
            alert("Payment Successful ✅");

            paymentDone = true;
            document.getElementById("billBtn").style.display = "inline-block";
        }
    };

    var rzp = new Razorpay(options);
    rzp.open();
}

// PDF BILL
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