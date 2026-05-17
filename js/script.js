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

    $("#contact-form").submit(function (e) {
        e.preventDefault();
        alert("Вашето съобщение беше изпратено. Ще се свържем с вас скоро!");
        this.reset();
    });

    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;

    window.openPersonalize = function(name) {
        const personalization = JSON.parse(localStorage.getItem('personalizations') || '[]');
        const existing = personalization.find(item => item.name === name) || {};

        const modalHtml = `
            <div class="delivery-overlay" id="personalize-overlay"></div>
            <div class="delivery-modal" id="personalize-modal">
                <h3>Персонализирай: ${name}</h3>
                <div class="form-group">
                    <label for="personalize-color">Цвят на картите</label>
                    <select id="personalize-color">
                        <option value="Класически" ${existing.color === 'Класически' ? 'selected' : ''}>Класически</option>
                        <option value="Неонов" ${existing.color === 'Неонов' ? 'selected' : ''}>Неонов</option>
                        <option value="Тъмни" ${existing.color === 'Тъмни' ? 'selected' : ''}>Тъмни</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="personalize-characters">Добави герои</label>
                    <select id="personalize-characters">
                        <option value="Без герои" ${existing.characters === 'Без герои' ? 'selected' : ''}>Без герои</option>
                        <option value="Фентъзи" ${existing.characters === 'Фентъзи' ? 'selected' : ''}>Фентъзи</option>
                        <option value="Космически" ${existing.characters === 'Космически' ? 'selected' : ''}>Космически</option>
                        <option value="Исторически" ${existing.characters === 'Исторически' ? 'selected' : ''}>Исторически</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="personalize-special">Специални карти</label>
                    <select id="personalize-special">
                        <option value="Без" ${existing.special === 'Без' ? 'selected' : ''}>Без</option>
                        <option value="Магически бонуси" ${existing.special === 'Магически бонуси' ? 'selected' : ''}>Магически бонуси</option>
                        <option value="Събития" ${existing.special === 'Събития' ? 'selected' : ''}>Събития</option>
                        <option value="Предизвикателства" ${existing.special === 'Предизвикателства' ? 'selected' : ''}>Предизвикателства</option>
                    </select>
                </div>
                <div class="delivery-actions">
                    <button class="btn-primary" onclick="savePersonalization('${name}')">Запази</button>
                    <button class="btn-secondary" onclick="closePersonalizeModal()">Откажи</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    window.savePersonalization = function(name) {
        const color = document.getElementById('personalize-color').value;
        const characters = document.getElementById('personalize-characters').value;
        const special = document.getElementById('personalize-special').value;

        const personalizations = JSON.parse(localStorage.getItem('personalizations') || '[]');
        const index = personalizations.findIndex(item => item.name === name);
        const record = { name, color, characters, special, savedAt: new Date().toLocaleString() };

        if (index !== -1) {
            personalizations[index] = record;
        } else {
            personalizations.push(record);
        }

        localStorage.setItem('personalizations', JSON.stringify(personalizations));
        alert('Персонализацията е запазена!');
        closePersonalizeModal();
    };

    window.closePersonalizeModal = function() {
        const modal = document.getElementById('personalize-modal');
        const overlay = document.getElementById('personalize-overlay');
        if (modal) modal.remove();
        if (overlay) overlay.remove();
    };

    window.playAiVoice = function() {
        if ('speechSynthesis' in window) {
            const text = 'Това е бърз демонстрационен клип за началната страница. Натиснете Создайте игра, за да започнете. Можете да персонализирате картите и да изберете готов шаблон.';
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'bg-BG';
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Вашият браузър не поддържа AI глас.');
        }
    };

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
            <div class="delivery-overlay" id="delivery-overlay"></div>
            <div class="delivery-modal" id="delivery-modal">
                <h3>Избери метод на доставка</h3>
                <label class="delivery-option">
                    <span>🚚 Обикновена доставка (5-7 работни дни) - 5 лв.</span>
                    <input type="radio" name="delivery" value="standard" checked>
                </label>
                <label class="delivery-option">
                    <span>⚡ Експресна доставка (2-3 работни дни) - 15 лв.</span>
                    <input type="radio" name="delivery" value="express">
                </label>
                <label class="delivery-option">
                    <span>🏪 Самовземане (приемни пункт) - 0 лв.</span>
                    <input type="radio" name="delivery" value="pickup">
                </label>
                <div class="delivery-summary">
                    Моля, изберете вашия начин на доставка и натиснете Продължи.
                </div>
                <div class="delivery-actions">
                    <button class="btn-primary" onclick="processDelivery(document.querySelector('input[name=delivery]:checked').value)">Продължи</button>
                    <button class="btn-secondary" onclick="closeDeliveryModal()">Откажи</button>
                </div>
            </div>
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
        
        const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        orders.push({
            items: cart,
            deliveryType,
            shippingCost,
            total,
            date: new Date().toLocaleString()
        });
        localStorage.setItem('userOrders', JSON.stringify(orders));
        
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