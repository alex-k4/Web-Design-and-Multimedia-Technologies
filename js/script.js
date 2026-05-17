$(document).ready(function () {

    console.log("jQuery работи!");

    /* ================= CART ================= */

    let cart = [];

    // Зареждане на кошница от localStorage
    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('gameCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        updateCartDisplay();
        renderCartPageItems();
    }

    // Запазване на кошница в localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('gameCart', JSON.stringify(cart));
    }

    // Зареждане на кошница от памет
    loadCartFromLocalStorage();

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
        saveCartToLocalStorage();
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

    // Функция за рендериране на кошница на cart.html страница
    function renderCartPageItems() {
        const container = $("#cart-items");
        
        if (!container.length) return; // Ако няма контейнер за кошница, не е cart.html
        
        container.html("");

        if (cart.length === 0) {
            container.html(`
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Кошницата ти е празна</p>
                </div>
            `);
            $("#cart-summary").html(`
                <div class="cart-total">
                    <strong>Общо:</strong>
                    <span>0 лв.</span>
                </div>
            `);
            return;
        }

        cart.forEach((item, index) => {
            container.append(`
                <div class="cart-item-page">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-quantity">Количество: ${item.quantity}</div>
                    </div>
                    <div class="cart-item-price">${item.price * item.quantity} лв.</div>
                    <button class="remove-item-btn" onclick="removeFromCart(${index})">Премахни</button>
                </div>
            `);
        });

        // Обновяване на общата цена
        $("#cart-summary").html(`
            <div class="cart-total">
                <strong>Общо:</strong>
                <span id="total-price">${getTotal()} лв.</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">Поръчай сега</button>
            <a href="index.html" class="continue-shopping">Продължи пазаруване</a>
        `);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();
        renderCartItems();
        renderCartPageItems(); // Обновяване на cart.html
        saveCartToLocalStorage();
    }

    $("#cart-button").click(function () {
        // Ако е на cart.html, прави го да отиде на index.html
        if (window.location.href.includes("cart.html")) {
            window.location.href = "index.html";
        } else {
            // В противен случай отиди на cart.html
            window.location.href = "cart.html";
        }
    });

    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;

    window.checkout = function () {
        if (cart.length === 0) {
            alert("Кошницата е празна!");
            return;
        }

        // Показвам меню за доставка
        showDeliveryOptions();
    };

    // Функция за избор на доставка
    window.showDeliveryOptions = function() {
        const deliveryOptions = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(20,20,30,0.95);
                padding: 30px;
                border-radius: 12px;
                border: 2px solid #8c52ff;
                z-index: 10000;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 0 40px rgba(140,82,255,0.5);
            " id="delivery-modal">
                <h3 style="color: #fff; margin-top: 0; margin-bottom: 20px; text-align: center;">
                    Избери метод на доставка
                </h3>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button onclick="processDelivery('standard')" style="
                        padding: 12px;
                        background: rgba(100,200,150,0.8);
                        color: white;
                        border: 1px solid #64c896;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: 0.3s;
                        font-size: 14px;
                    " onmouseover="this.style.background='#64c896'" onmouseout="this.style.background='rgba(100,200,150,0.8)'">
                        🚚 Обикновена доставка (5-7 работни дни) - 5 лв.
                    </button>
                    
                    <button onclick="processDelivery('express')" style="
                        padding: 12px;
                        background: rgba(140,82,255,0.8);
                        color: white;
                        border: 1px solid #8c52ff;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: 0.3s;
                        font-size: 14px;
                    " onmouseover="this.style.background='#8c52ff'" onmouseout="this.style.background='rgba(140,82,255,0.8)'">
                        ⚡ Експресна доставка (2-3 работни дни) - 15 лв.
                    </button>
                    
                    <button onclick="processDelivery('pickup')" style="
                        padding: 12px;
                        background: rgba(255,193,7,0.8);
                        color: black;
                        border: 1px solid #ffc107;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: 0.3s;
                        font-size: 14px;
                    " onmouseover="this.style.background='#ffc107'" onmouseout="this.style.background='rgba(255,193,7,0.8)'">
                        🏪 Самовземане (приемни пункт) - 0 лв.
                    </button>
                    
                    <button onclick="closeDeliveryModal()" style="
                        padding: 10px;
                        background: rgba(255,85,85,0.8);
                        color: white;
                        border: 1px solid #ff5555;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: 0.3s;
                        font-size: 13px;
                        margin-top: 10px;
                    " onmouseover="this.style.background='#ff5555'" onmouseout="this.style.background='rgba(255,85,85,0.8)'">
                        ❌ Отмени
                    </button>
                </div>
            </div>
            
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9999;
            " id="delivery-overlay" onclick="closeDeliveryModal()"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', deliveryOptions);
    };

    window.processDelivery = function(type) {
        let shippingCost = 0;
        let deliveryType = '';
        
        if (type === 'standard') {
            shippingCost = 5;
            deliveryType = 'Обикновена доставка (5-7 работни дни)';
        } else if (type === 'express') {
            shippingCost = 15;
            deliveryType = 'Експресна доставка (2-3 работни дни)';
        } else if (type === 'pickup') {
            shippingCost = 0;
            deliveryType = 'Самовземане (приемни пункт)';
        }
        
        const total = getTotal() + shippingCost;
        
        closeDeliveryModal();
        
        alert(
            `✅ Поръчката е потвърдена!\n\n` +
            `Артикули: ${cart.length}\n` +
            `Сума: ${getTotal()} лв.\n` +
            `Доставка: ${deliveryType}\n` +
            `Стойност доставка: ${shippingCost} лв.\n` +
            `\nОбщо за плащане: ${total} лв.\n\n` +
            `Благодарим за вашата поръчка! 🎉`
        );
        
        cart = [];
        updateCartDisplay();
        renderCartItems();
        renderCartPageItems();
        saveCartToLocalStorage();
    };

    window.closeDeliveryModal = function() {
        const modal = document.getElementById('delivery-modal');
        const overlay = document.getElementById('delivery-overlay');
        if (modal) modal.remove();
        if (overlay) overlay.remove();
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