let cart = [];

function addToCart(name, price, quantity) {
    quantity = parseInt(quantity);
    // Проверка дали продукта вече е в кошницата
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}
// Показване на кошницата
document.getElementById('cart-button').addEventListener('click', () => {
    let cartWindow = document.getElementById('cart-window');
    cartWindow.classList.toggle('hidden');
    renderCartItems();
});

function renderCartItems() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    cart.forEach((item, index) => {
        container.innerHTML += `
            <div class="flex justify-between items-center mb-2 border-b pb-2">
                <span>${item.name} x${item.quantity}</span>
                <span>${item.price * item.quantity} лв.</span>
                <button onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-800">❌</button>
            </div>
        `;
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    renderCartItems();
}