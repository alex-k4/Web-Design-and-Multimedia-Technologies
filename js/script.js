document.addEventListener('DOMContentLoaded', () => {

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
        document.getElementById('cart-count').textContent =
            cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function renderCartItems() {
        const container = document.getElementById('cart-items');
        container.innerHTML = '';

        cart.forEach((item, index) => {
            container.innerHTML += `
                <div class="flex justify-between items-center mb-2 border-b pb-2">
                    <span>${item.name} x${item.quantity}</span>
                    <span>${item.price * item.quantity} лв.</span>
                    <button onclick="removeFromCart(${index})">❌</button>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="mt-3 font-bold">
                Общо: ${getTotal()} лв.
            </div>
        `;
    }

    function getTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();
        renderCartItems();
    }

    document.getElementById('cart-button').addEventListener('click', () => {
        let cartWindow = document.getElementById('cart-window');
        cartWindow.classList.toggle('hidden');
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

});