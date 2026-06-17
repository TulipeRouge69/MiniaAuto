// Animations au scroll pour les éléments
const faders = document.querySelectorAll('.fade-in, .fade-up, .slide-left');

const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        appearOnScroll.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// Gestion du Panier UI Simple
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountBadge = document.querySelector('.cart-count');

let cart = [];

function toggleCart() {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

cartBtn.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
overlay.addEventListener('click', toggleCart);

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const item = {
            name: e.target.dataset.name,
            price: parseFloat(e.target.dataset.price)
        };
        addToCart(item);
        
        // Notification visuelle d'ajout
        const initialText = button.textContent;
        button.textContent = "Ajouté ✔";
        button.style.backgroundColor = "var(--accent)";
        button.style.transform = "scale(1.05)";
        setTimeout(() => {
            button.innerHTML = initialText;
            button.style.backgroundColor = "";
            button.style.transform = "";
        }, 1200);
    });
});

function addToCart(item) {
    const existing = cart.find(i => i.name === item.name);
    if(existing) {
        existing.quantity += 1;
    } else {
        item.quantity = 1;
        cart.push(item);
    }
    updateCartUI();
    toggleCart(); // Optionnel : ouvrir le panier quand on ajoute
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    updateCartUI();
}

// Fonction globale pour être appelée depuis le HTML généré (onclick)
window.removeFromCart = removeFromCart;

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Votre panier est vide.</p>';
        cartTotalEl.textContent = "0";
        cartCountBadge.textContent = "0";
        return;
    }
    
    let total = 0;
    let count = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} € x ${item.quantity}</p>
            </div>
            <div class="cart-item-remove" onclick="removeFromCart('${item.name}')">Retirer</div>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    cartTotalEl.textContent = total.toFixed(2);
    cartCountBadge.textContent = count;
}
