// Main Entry Point for Pages & Co.
import { booksData, genresData } from './data/books.js';
import { createCartItem } from './components/CartItem.js';
import { renderHome } from './pages/Home.js';
import { renderShop, filterAndRenderShop } from './pages/Shop.js';
import { renderBookDetail } from './pages/BookDetail.js';
import { renderBagPage } from './pages/Bag.js';
import { renderCheckoutPage, createOrderSuccessView } from './pages/Checkout.js';

// Gán dữ liệu tĩnh lên global để tương thích ngược nếu cần
window.booksData = booksData;
window.genresData = genresData;

// Application State
const appState = {
  cart: JSON.parse(localStorage.getItem('pages_co_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('pages_co_wishlist')) || [],
  currentGenreFilter: 'All',
  currentSearchQuery: '',
  currentSortOption: 'featured',
  currentCarouselIndex: 0,
  carouselTimer: null,
  authMode: 'login',
  user: JSON.parse(localStorage.getItem('pages_co_user')) || null,
  redirectAfterAuth: null
};
window.appState = appState;

// Init App
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  updateCartUI();
  updateAuthHeaderUI();
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
  setupGlobalListeners();
}

// SPA Router
function navigateTo(hash) {
  window.location.hash = hash;
}
window.navigateTo = navigateTo;

function handleRoute() {
  if (appState.carouselTimer) {
    clearInterval(appState.carouselTimer);
    appState.carouselTimer = null;
  }

  const hash = window.location.hash || '#home';
  const mainContent = document.getElementById('main-content');
  
  updateActiveNavLink(hash);
  window.scrollTo(0, 0);

  if (hash === '#home') {
    renderHome(mainContent, booksData, genresData);
  } else if (hash.startsWith('#shop')) {
    renderShop(mainContent, hash);
  } else if (hash.startsWith('#bag')) {
    renderBagPage(mainContent);
  } else if (hash.startsWith('#checkout')) {
    renderCheckoutPage(mainContent);
  } else if (hash.startsWith('#book-')) {
    const id = parseInt(hash.replace('#book-', ''));
    renderBookDetail(mainContent, id);
  } else {
    navigateTo('#home');
  }
}

function updateActiveNavLink(hash) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkHash = link.getAttribute('href');
    if (hash.startsWith(linkHash)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Global Listeners
function setupGlobalListeners() {
  const bagBtn = document.getElementById('bag-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.getElementById('close-cart-btn');

  if (bagBtn) bagBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) closeCart();
    });
  }

  const signinBtn = document.getElementById('signin-btn');
  const signinModal = document.getElementById('signin-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (signinBtn) {
    signinBtn.addEventListener('click', () => {
      if (appState.user) {
        logoutUser();
      } else {
        appState.authMode = 'login';
        updateAuthModalUI();
        openModal();
      }
    });
  }
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (signinModal) {
    signinModal.addEventListener('click', (e) => {
      if (e.target === signinModal) closeModal();
    });
  }

  // Chuyển đổi giữa Đăng nhập và Đăng ký trong modal
  const toggleTextContainer = document.getElementById('modal-toggle-text');
  if (toggleTextContainer) {
    toggleTextContainer.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'modal-toggle-link') {
        e.preventDefault();
        appState.authMode = appState.authMode === 'login' ? 'register' : 'login';
        updateAuthModalUI();
      }
    });
  }

  const signinForm = document.getElementById('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const nameInput = document.getElementById('login-name');
      
      if (appState.authMode === 'register') {
        const name = nameInput.value.trim() || 'Reader';
        appState.user = { name, email };
        localStorage.setItem('pages_co_user', JSON.stringify(appState.user));
        alert('Đăng ký tài khoản thành công!');
      } else {
        const name = email.split('@')[0];
        // Chữ cái đầu viết hoa
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);
        appState.user = { name: displayName, email };
        localStorage.setItem('pages_co_user', JSON.stringify(appState.user));
        alert('Đăng nhập thành công!');
      }
      
      updateAuthHeaderUI();
      closeModal();
      signinForm.reset();
      
      if (appState.redirectAfterAuth) {
        const redirectTarget = appState.redirectAfterAuth;
        appState.redirectAfterAuth = null;
        navigateTo(redirectTarget);
      }
    });
  }

  // Live Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.currentSearchQuery = e.target.value.trim();
      const currentHash = window.location.hash;
      if (!currentHash.startsWith('#shop')) {
        navigateTo('#shop');
      } else {
        filterAndRenderShop();
      }
    });
  }

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input').value;
      if (email) {
        alert(`Cảm ơn bạn đã đăng ký nhận bản tin với email: ${email}!`);
        newsletterForm.reset();
      }
    });
  }
}

// Cart Actions
function openCart() {
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
window.openCart = openCart;

function closeCart() {
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}
window.closeCart = closeCart;

function addToCart(id) {
  const book = booksData.find(b => b.id === id);
  if (!book) return;

  const existingItem = appState.cart.find(item => item.bookId === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    appState.cart.push({ bookId: id, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  openCart();
}
window.addToCart = addToCart;

function removeFromCart(id) {
  appState.cart = appState.cart.filter(item => item.bookId !== id);
  saveCart();
  updateCartUI();
}
window.removeFromCart = removeFromCart;

function updateCartQty(id, change) {
  const item = appState.cart.find(item => item.bookId === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    updateCartUI();
  }
}
window.updateCartQty = updateCartQty;

function saveCart() {
  localStorage.setItem('pages_co_cart', JSON.stringify(appState.cart));
}

function updateCartUI() {
  const bagCount = document.getElementById('bag-count');
  const itemsContainer = document.getElementById('cart-items-container');
  const subtotalVal = document.getElementById('cart-subtotal');
  const checkoutBtn = document.getElementById('checkout-btn');

  const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (bagCount) bagCount.textContent = totalItems;

  if (window.location.hash.startsWith('#bag')) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const cartItems = appState.cart.map(item => {
        const book = booksData.find(b => b.id === item.bookId);
        return { book, quantity: item.quantity };
      }).filter(item => item.book !== undefined);
      
      const subtotalNew = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
      const totalRow = document.querySelector('.total-price');
      if (!totalRow || totalRow.textContent !== `$${subtotalNew.toFixed(2)}`) {
        renderBagPage(mainContent);
      }
    }
  }

  if (!itemsContainer) return;

  if (appState.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <i class="fas fa-shopping-bag cart-empty-icon"></i>
        <h3 class="cart-empty-title">Your bag is empty</h3>
        <p>Add some beautiful stories to your shelves today.</p>
        <button class="btn-shop-now" onclick="closeCart(); navigateTo('#shop')">Shop All Books</button>
      </div>
    `;
    if (subtotalVal) subtotalVal.textContent = '$0.00';
    if (checkoutBtn) {
      checkoutBtn.style.opacity = '0.5';
      checkoutBtn.style.pointerEvents = 'none';
      checkoutBtn.onclick = null;
    }
  } else {
    let totalCost = 0;
    const itemsHTML = appState.cart.map(item => {
      const book = booksData.find(b => b.id === item.bookId);
      if (!book) return '';
      totalCost += book.price * item.quantity;
      return createCartItem({ book, quantity: item.quantity });
    }).join('');

    itemsContainer.innerHTML = itemsHTML;
    if (subtotalVal) subtotalVal.textContent = `$${totalCost.toFixed(2)}`;
    
    if (checkoutBtn) {
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.pointerEvents = 'auto';
      checkoutBtn.onclick = () => {
        processCheckout(totalCost);
      };
    }
  }
}

function processCheckout(subtotal) {
  if (appState.user) {
    navigateTo('#checkout');
  } else {
    appState.redirectAfterAuth = '#checkout';
    openModal();
  }
}
window.processCheckout = processCheckout;

// Wishlist
function toggleWishlist(id, btnElement) {
  const index = appState.wishlist.indexOf(id);
  const icon = btnElement.querySelector('i');
  
  if (index === -1) {
    appState.wishlist.push(id);
    btnElement.classList.add('active');
    if (icon) {
      icon.className = 'fas fa-heart';
    }
    btnElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
      btnElement.style.transform = '';
    }, 200);
  } else {
    appState.wishlist.splice(index, 1);
    btnElement.classList.remove('active');
    if (icon) {
      icon.className = 'far fa-heart';
    }
  }
  
  localStorage.setItem('pages_co_wishlist', JSON.stringify(appState.wishlist));
}
window.toggleWishlist = toggleWishlist;

// Modal Actions
function openModal() {
  const modal = document.getElementById('signin-modal');
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
window.openModal = openModal;

function closeModal() {
  const modal = document.getElementById('signin-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}
window.closeModal = closeModal;

// Authentication functions
function updateAuthModalUI() {
  const modal = document.getElementById('signin-modal');
  if (!modal) return;

  const title = modal.querySelector('.modal-title');
  const subtitle = modal.querySelector('.modal-subtitle');
  const nameGroup = document.getElementById('name-group');
  const nameInput = document.getElementById('login-name');
  const submitBtn = modal.querySelector('.btn-form-submit');
  const toggleText = document.getElementById('modal-toggle-text');

  if (appState.authMode === 'register') {
    if (title) title.textContent = 'Create an account';
    if (subtitle) subtitle.textContent = 'Join us to save your bag, orders and wishlist.';
    if (nameGroup) nameGroup.style.display = 'flex';
    if (nameInput) nameInput.setAttribute('required', 'true');
    if (submitBtn) submitBtn.textContent = 'Create account';
    if (toggleText) toggleText.innerHTML = 'Already have an account? <a href="#" id="modal-toggle-link">Sign in</a>';
  } else {
    if (title) title.textContent = 'Welcome back';
    if (subtitle) subtitle.textContent = 'Sign in to access your bag, orders and wishlist.';
    if (nameGroup) nameGroup.style.display = 'none';
    if (nameInput) nameInput.removeAttribute('required');
    if (submitBtn) submitBtn.textContent = 'Sign in';
    if (toggleText) toggleText.innerHTML = 'New here? <a href="#" id="modal-toggle-link">Create an account</a>';
  }
}
window.updateAuthModalUI = updateAuthModalUI;

function updateAuthHeaderUI() {
  const signinBtn = document.getElementById('signin-btn');
  if (!signinBtn) return;

  if (appState.user) {
    signinBtn.innerHTML = `Hi, ${appState.user.name} <i class="fas fa-sign-out-alt" style="margin-left: 5px;" title="Sign out"></i>`;
  } else {
    signinBtn.innerHTML = 'Sign in';
  }
}
window.updateAuthHeaderUI = updateAuthHeaderUI;

function logoutUser() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
    appState.user = null;
    localStorage.removeItem('pages_co_user');
    updateAuthHeaderUI();
    alert('Đã đăng xuất thành công!');
  }
}
window.logoutUser = logoutUser;

// Checkout actions
function selectPaymentMethod(method) {
  document.querySelectorAll('.payment-method-option').forEach(opt => opt.classList.remove('active'));
  const activeOpt = document.getElementById(`payment-opt-${method}`);
  if (activeOpt) activeOpt.classList.add('active');
  
  const radio = document.getElementById(`payment-${method}`);
  if (radio) radio.checked = true;
  
  const cardFields = document.getElementById('card-fields');
  if (cardFields) {
    if (method === 'card') {
      cardFields.style.display = 'flex';
      cardFields.querySelectorAll('input').forEach(inp => inp.setAttribute('required', 'true'));
    } else {
      cardFields.style.display = 'none';
      cardFields.querySelectorAll('input').forEach(inp => inp.removeAttribute('required'));
    }
  }
}
window.selectPaymentMethod = selectPaymentMethod;

function submitOrder(event) {
  event.preventDefault();
  
  const orderDetails = {
    orderId: 'PC-' + Math.floor(100000 + Math.random() * 900000),
    name: document.getElementById('shipping-name').value,
    email: document.getElementById('shipping-email').value,
    phone: document.getElementById('shipping-phone').value,
    address: document.getElementById('shipping-address').value,
    paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
    total: appState.cart.reduce((sum, item) => {
      const book = booksData.find(b => b.id === item.bookId);
      return sum + (book ? book.price * item.quantity : 0);
    }, 0)
  };
  
  // Xóa giỏ hàng
  appState.cart = [];
  saveCart();
  updateCartUI();
  
  // Render màn hình thành công
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = createOrderSuccessView(orderDetails);
}
window.submitOrder = submitOrder;
