$(document).ready(function () {

    console.log("jQuery работи!");

    /* ================= CART ================= */

    let cart = [];

    function addToCart(name, price, quantity) {
        quantity = parseInt(quantity);
        if (!quantity || quantity < 1) quantity = 1;

        let existing = cart.find(item => item.name === name);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }

        updateCartDisplay();
    }

    function updateCartDisplay() {
        $("#cart-count").text(
            cart.reduce((sum, item) => sum + item.quantity, 0)
        );
    }

    function getTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function renderCartItems() {
        const container = $("#cart-items");
        container.html("");

        cart.forEach((item, index) => {
            container.append(`
                <div class="cart-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>${item.price * item.quantity} лв.</span>
                    <button onclick="removeFromCart(${index})">❌</button>
                </div>
            `);
        });

        container.append(`
            <div class="cart-total">
                Общо: ${getTotal()} лв.
            </div>
        `);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();
        renderCartItems();
    }

    $("#cart-button").click(function () {
        $("#cart-window").toggleClass("hidden");
        renderCartItems();
    });

    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;

    window.checkout = function () {
        if (cart.length === 0) {
            alert("Кошницата е празна!");
            return;
        }

        alert("Поръчката е направена успешно!");
        cart = [];
        updateCartDisplay();
        renderCartItems();
    };

    /* ================= AJAX (FIXED) ================= */

    $("#load-data").click(function () {

        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts/1",
            method: "GET",
            success: function (data) {
                $("#api-result").html(`
                    <div class="api-card">
                        <h3>${data.title}</h3>
                        <p>${data.body}</p>
                    </div>
                `);
            },
            error: function () {
                $("#api-result").html("<p>Грешка при зареждане</p>");
            }
        });

    });

});