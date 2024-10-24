const slides = document.querySelector('.slides');
const slideElements = document.querySelectorAll('.slide');
let slideAnimationDuration = 40000; // Initial duration in milliseconds

// Function to slow down the animation on hover
slideElements.forEach(slide => {
    slide.addEventListener('mouseenter', () => {
        slides.style.animationDuration = `${slideAnimationDuration * 1}ms`; // Double the duration
    });

    slide.addEventListener('mouseleave', () => {
        slides.style.animationDuration = `${slideAnimationDuration }ms`; // Reset to original duration
    });
});


//cart

let cart = []; // Array to hold cart items

function addToCart(productName, productPrice, colorId, quantityId) {
    const productColor = document.getElementById(colorId).value;
    const productQuantity = parseInt(document.getElementById(quantityId).value);

    if (productColor === "Select Color") {
        alert("Please select a color.");
        return;
    }

    if (isNaN(productQuantity) || productQuantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.name === productName && item.color === productColor);
    if (existingProductIndex > -1) {
        // If product exists, increase the quantity
        cart[existingProductIndex].quantity += productQuantity;
    } else {
        // If new product, add to cart
        cart.push({
            name: productName,
            price: productPrice,
            color: productColor,
            quantity: productQuantity
        });
    }
    // Update cart count in the nav
    updateCartCount();
    saveCartToLocalStorage();
    alert(`${productName} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.innerText = totalItems;
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        cart = savedCart;
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            displayCart(); // Call to display the cart items if available
        }
    }
});

// Call this function to display cart items on the cart page
function displayCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceDiv = document.getElementById('total-price');
    cartItemsDiv.innerHTML = ''; // Clear previous cart content

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceDiv.innerText = 'Total: $0.00';
        return;
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.name} (${item.color}) - $${item.price.toFixed(2)} x ${item.quantity}</span>
            <button onclick="removeFromCart(${index})">Remove</button>
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
        `;
        cartItemsDiv.appendChild(itemDiv);
        totalPrice += item.price * item.quantity;
    });

    totalPriceDiv.innerText = `Total: $${totalPrice.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
    saveCartToLocalStorage();
}

function updateQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity);
    displayCart();
    saveCartToLocalStorage();
}

// Call displayCart() on the cart page to show items
if (window.location.pathname.includes('cart.html')) {
    displayCart();
}