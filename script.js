// Product data
const products = [
  // Shoes
  {
    id: 1,
    name: "Air Max 270",
    category: "shoes",
    price: 150,
    image: "/images/airmax.png"
  },
  {
    id: 2,
    name: "React Infinity Run",
    category: "shoes",
    price: 160,
    image: "/images/nikerun.png"
  },
  {
    id: 3,
    name: "Air Force 1",
    category: "shoes",
    price: 90,
    image: "/images/airforce.png"
  },
  {
    id: 4,
    name: "Air Jordan 1 Low",
    category: "shoes",
    price: 120,
    image: "/images/fragments.avif"
  },
  
  // Clothing
  {
    id: 5,
    name: "PSG 2025/26 Stadium Home",
    category: "clothing",
    price: 25,
    image: "/images/jersey.png"
  },
  {
    id: 6,
    name: "Nike Club Fleece",
    category: "clothing",
    price: 90,
    image: "/images/hoodie.png"
  },
  {
    id: 7,
    name: "Pro Training Shorts",
    category: "clothing",
    price: 35,
    image: "/images/nikeshorts.png"
  },
  {
    id: 8,
    name: "Sportswear Joggers",
    category: "clothing",
    price: 60,
    image: "/images/joggers.png"
  },
  
  // Accessories
  {
    id: 9,
    name: "Nike Cap",
    category: "accessories",
    price: 25.00,
    image: "/images/collegecap.avif"
  },
  {
    id: 10,
    name: "Training Gloves",
    category: "accessories",
    price: 20.00,
    image: "/images/gymgloves.avif"
  },
  {
    id: 11,
    name: "Sports Backpack",
    category: "accessories",
    price: 75.00,
    image: "/images/backpack.avif"
  },
  {
    id: 12,
    name: "Jumbo Cap",
    category: "accessories",
    price: 15.00,
    image: "/images/redcap.avif"
  }
];

// Cart functionality
let cart = [];

// DOM elements
const productsGrid = document.getElementById('products-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const overlay = document.getElementById('overlay');
const loginModal = document.getElementById('login-modal');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  setupEventListeners();
});

// Render products
function renderProducts(filter = 'all') {
  const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  productsGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-overlay">
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${product.category}</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
      </div>
    </div>
  `).join('');
}

// Setup event listeners
function setupEventListeners() {
  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderProducts(this.dataset.filter);
    });
  });

  // Category cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
      const category = this.dataset.category;
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`[data-filter="${category}"]`).classList.add('active');
      renderProducts(category);
      document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Navigation category links
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.dataset.category;
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`[data-filter="${category}"]`).classList.add('active');
      renderProducts(category);
      document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Add to cart (event delegation)
  productsGrid.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      const productId = parseInt(e.target.dataset.id);
      addToCart(productId);
      
      // Visual feedback
      e.target.textContent = 'Added!';
      e.target.classList.add('added');
      setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.classList.remove('added');
      }, 1000);
    }
  });

  // Cart button
  document.querySelector('.cart-btn').addEventListener('click', toggleCart);

  // Cart close
  document.querySelector('.cart-close').addEventListener('click', closeCart);

  // Login button
  document.querySelector('.login-btn').addEventListener('click', openLogin);

  // Login modal close
  document.querySelector('.modal-close').addEventListener('click', closeLogin);

  // Overlay
  overlay.addEventListener('click', closeAll);

  // Login form
  document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    handleLogin();
  });

  // Checkout button
  document.querySelector('.checkout-btn').addEventListener('click', handleCheckout);

  // Hero CTA
  document.querySelector('.hero-cta').addEventListener('click', function() {
    document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
  });

  // Cart item interactions (event delegation)
  cartItems.addEventListener('click', function(e) {
    if (e.target.classList.contains('cart-item-remove')) {
      const productId = parseInt(e.target.dataset.productId);
      removeFromCart(productId);
    }
    
    if (e.target.classList.contains('quantity-btn')) {
      const productId = parseInt(e.target.dataset.productId);
      const action = e.target.dataset.action;
      updateQuantity(productId, action);
    }
  });
}

// Cart functions
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateQuantity(productId, action) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (action === 'increase') {
      item.quantity += 1;
    } else if (action === 'decrease') {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
      }
    }
    updateCartUI();
  }
}

function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          <div class="quantity-controls">
            <button class="quantity-btn" data-product-id="${item.id}" data-action="decrease">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn" data-product-id="${item.id}" data-action="increase">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-product-id="${item.id}">&times;</button>
      </div>
    `).join('');
  }
  
  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
}

// UI functions
function toggleCart() {
  cartSidebar.classList.toggle('open');
  overlay.classList.toggle('active');
  document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function openLogin() {
  loginModal.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLogin() {
  loginModal.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function closeAll() {
  closeCart();
  closeLogin();
}

function handleLogin() {
  const submitBtn = document.querySelector('.login-submit');
  const originalText = submitBtn.textContent;
  
  submitBtn.textContent = 'Signing in...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    alert('Login functionality is not implemented in this demo');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    closeLogin();
  }, 1000);
}

function handleCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  alert(`Checkout functionality is not implemented in this demo.\nTotal: $${total.toFixed(2)}`);
}