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
let countdown;

// LOGIN
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("login", "true");
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainApp").style.display = "block";
    } else {
        alert("Invalid Login ❌");
    }
}

function logout() {
    localStorage.removeItem("login");
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("mainApp").style.display = "none";
}

window.onload = function () {
    if (localStorage.getItem("login") === "true") {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainApp").style.display = "block";
    }
    displayMenu(menu);
};

// DISPLAY MENU
function displayMenu(items) {
    const container = document.getElementById("menu-container");
    container.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card");

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
    const item = menu.find(p => p.id === id);
    cart.push(item);
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById("cart");
    cartList.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - ₹${item.price}
            <button onclick="removeItem(${index})">❌</button>
        `;
        cartList.appendChild(li);
    });

    document.getElementById("total").textContent = total;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// PAYMENT
function payNow() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    document.getElementById("paymentModal").style.display = "block";
    startTimer(300);
}

// TIMER
function startTimer(seconds) {
    clearInterval(countdown);

    countdown = setInterval(() => {
        let min = Math.floor(seconds / 60);
        let sec = seconds % 60;

        document.getElementById("timer").textContent =
            `${min}:${sec < 10 ? "0" : ""}${sec}`;

        seconds--;

        if (seconds < 0) {
            clearInterval(countdown);
            alert("Time Expired ❌");
            closePayment();
        }
    }, 1000);
}

// CLOSE PAYMENT
function closePayment() {
    document.getElementById("paymentModal").style.display = "none";
    clearInterval(countdown);
}

// PDF BILL
function downloadBill() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Hotel Bill Receipt", 20, 20);

    let y = 40;
    let total = 0;

    cart.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name} - ₹${item.price}`, 20, y);
        total += item.price;
        y += 10;
    });

    doc.text(`Total: ₹${total}`, 20, y + 10);
    doc.save("Hotel_Bill.pdf");
}