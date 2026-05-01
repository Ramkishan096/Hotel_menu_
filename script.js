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

// AUTH
function login() {
    const email = username.value;
    const pass = password.value;

    auth.signInWithEmailAndPassword(email, pass)
        .catch(err => alert(err.message));
}

function signup() {
    const email = username.value;
    const pass = password.value;

    auth.createUserWithEmailAndPassword(email, pass)
        .then(() => alert("Signup Success"))
        .catch(err => alert(err.message));
}

function logout() {
    auth.signOut();
}

// AUTO LOGIN
auth.onAuthStateChanged(user => {
    if (user) {
        loginPage.style.display = "none";
        mainApp.style.display = "block";
    } else {
        loginPage.style.display = "block";
        mainApp.style.display = "none";
    }
});

// DISPLAY
function displayMenu(items) {
    menu-container.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <img src="${item.image}">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <button onclick="addToCart(${item.id})">Add</button>
        `;
        menu-container.appendChild(div);
    });
}

displayMenu(menu);

// CART
function addToCart(id) {
    const item = menu.find(x => x.id === id);
    cart.push(item);
    updateCart();
}

function updateCart() {
    cart.innerHTML = "";
    let total = 0;

    cart.forEach((item, i) => {
        total += item.price;

        const li = document.createElement("li");
        li.innerHTML = `${item.name} - ₹${item.price}
        <button onclick="removeItem(${i})">❌</button>`;
        cart.appendChild(li);
    });

    total.textContent = total;
}

function removeItem(i) {
    cart.splice(i, 1);
    updateCart();
}

// PAYMENT
function payNow() {
    if (cart.length === 0) return alert("Cart empty");

    paymentModal.style.display = "block";
    startTimer(300);

    saveOrder();
}

// FIRESTORE SAVE
function saveOrder() {
    db.collection("orders").add({
        items: cart,
        total: total.textContent,
        time: new Date()
    });
}

// TIMER
function startTimer(sec) {
    clearInterval(countdown);

    countdown = setInterval(() => {
        let m = Math.floor(sec / 60);
        let s = sec % 60;

        timer.textContent = `${m}:${s<10?"0":""}${s}`;
        sec--;

        if (sec < 0) {
            clearInterval(countdown);
            alert("Expired");
            closePayment();
        }
    }, 1000);
}

function closePayment() {
    paymentModal.style.display = "none";
    clearInterval(countdown);
}

// PDF
function downloadBill() {
    if (cart.length === 0) return alert("Cart empty");

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