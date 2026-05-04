const menu = [
    {id:1, name:"Paneer Butter Masala", price:220, image:"paneer-butter.jpg"},
    {id:2, name:"Veg Biryani", price:180, image:"veg biryani.webp"},
    {id:3, name:"Chicken Biryani", price:250, image:"Chicken Biryani.webp"},
    {id:4, name:"Masala Dosa", price:90, image:"Masala Dosa.webp"},
    {id:5, name:"Idli", price:60, image:"Idli.jpg"},
    {id:6, name:"Samosa", price:20, image:"Samosa.jpg"},
    {id:7, name:"Burger", price:120, image:"Burger.webp"},
    {id:8, name:"Pizza", price:200, image:"Pizza.webp"}
];

let cart = [];
let paymentDone = false;
let currentTotal = 0;

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

document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = menu.filter(item =>
        item.name.toLowerCase().includes(value)
    );

    displayMenu(filtered);
});

function addToCart(id) {
    const item = menu.find(x => x.id === id);
    cart.push(item);
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById("cart");
    const totalSpan = document.getElementById("total");

    cartList.innerHTML = "";
    currentTotal = 0;

    cart.forEach((item, i) => {
        currentTotal += item.price;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - ₹${item.price}
            <button onclick="removeItem(${i})">❌</button>
        `;

        cartList.appendChild(li);
    });

    totalSpan.textContent = currentTotal;
}

function removeItem(i) {
    cart.splice(i, 1);
    updateCart();
}

function payNow() {
    if (cart.length === 0) {
        alert("Cart empty");
        return;
    }

    const method = document.getElementById("paymentMethod").value;

    if (method === "") {
        alert("Select payment method");
        return;
    }

    if (method === "cash") {
        alert("Order placed ✅ Cash on Delivery");

        paymentDone = true;
        document.getElementById("billBtn").style.display = "inline-block";
        return;
    }

    if (method === "upi") {
        document.getElementById("upiAmount").textContent = currentTotal;
        document.getElementById("upiBox").style.display = "block";

        const upiId = "rkk04@ptyes";
        const name = "Hotel Menu App";

        const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${currentTotal}&cu=INR`;

        window.location.href = upiLink;
    }
}

function submitPaymentProof() {
    const utr = document.getElementById("utr").value;
    const screenshot = document.getElementById("screenshot").files[0];

    if (utr === "") {
        alert("Please enter UTR number");
        return;
    }

    if (!screenshot) {
        alert("Please upload payment screenshot");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        document.getElementById("showUtr").textContent = utr;
        document.getElementById("showScreenshot").src = e.target.result;

        document.getElementById("adminBox").style.display = "block";

        alert("Payment proof submitted ✅ Waiting for admin approval");
    };

    reader.readAsDataURL(screenshot);
}

function approvePayment() {
    paymentDone = true;

    alert("Payment approved by admin ✅");

    document.getElementById("billBtn").style.display = "inline-block";
}

function downloadBill() {
    if (!paymentDone) {
        alert("Payment not approved yet ❌");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;
    let total = 0;

    doc.text("Hotel Bill", 20, y);
    y += 10;

    cart.forEach((item, i) => {
        total += item.price;
        doc.text(`${i + 1}. ${item.name} - Rs.${item.price}`, 20, y);
        y += 10;
    });

    doc.text(`Total: Rs.${total}`, 20, y + 10);
    doc.text("Payment Status: Approved", 20, y + 20);

    doc.save("bill.pdf");
}

displayMenu(menu);