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
  user: JSON.parse(localStorage.getItem('pages_co_user')) || null
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
    renderHome(mainContent);
  } else if (hash.startsWith('#shop')) {
    renderShop(mainContent, hash);
  } else if (hash.startsWith('#bag')) {
    renderBagPage(mainContent);
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

// Home Page
function renderHome(container) {
  const carouselBooks = window.booksData.filter(b => b.isStaffPick).slice(0, 3);
  const featuredBooks = window.booksData.slice(2, 7);
  const bestsellers = window.booksData.filter(b => b.tag === 'BESTSELLER').slice(0, 5);
  const newArrivals = window.booksData.filter(b => b.tag === 'NEW').slice(0, 5);

  let homeHTML = `
    <section class="hero-section container">
      <div class="carousel-container" id="hero-carousel">
        <div class="carousel-track" id="carousel-track">
          ${carouselBooks.map((book, idx) => `
            <div class="carousel-slide" style="background-color: ${book.coverColor};">
              <div class="carousel-slide-content">
                <span class="slide-subtitle">STAFF FAVOURITES</span>
                <h2 class="slide-title">${book.title}</h2>
                <p class="slide-desc">${book.description}</p>
                <button class="btn-carousel-cta" onclick="navigateTo('#book-${book.id}')">Browse booksellers' pick</button>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="carousel-btn prev" onclick="moveCarousel(-1)"><i class="fas fa-chevron-left"></i></button>
        <button class="carousel-btn next" onclick="moveCarousel(1)"><i class="fas fa-chevron-right"></i></button>
        <div class="carousel-indicators">
          ${carouselBooks.map((_, idx) => `
            <span class="indicator ${idx === 0 ? 'active' : ''}" onclick="setCarouselIndex(${idx})"></span>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="genre-section container">
      <span class="section-subtitle">FIND YOUR SHELF</span>
      <div class="section-title-wrapper">
        <h2 class="section-title">Browse by genre</h2>
      </div>
      <div class="genre-grid">
        ${window.genresData.map(g => window.components.createGenreCard(g)).join('')}
      </div>
    </section>

    <section class="books-section container">
      <span class="section-subtitle">EDITOR'S PICKS</span>
      <div class="section-title-wrapper">
        <h2 class="section-title">Featured this month</h2>
        <a href="#shop" class="view-all-link">View all <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="books-grid">
        ${featuredBooks.map(b => window.components.createBookCard(b)).join('')}
      </div>
    </section>

    <section class="container" style="margin-bottom: 4.5rem;">
      <div class="shipping-banner">
        <div class="banner-content">
          <span class="banner-subtitle">THE READING ROOM</span>
          <h2 class="banner-title">Free shipping on every order over $35</h2>
          <p class="banner-desc">Plus 15% off your first month and a weekly recommendation picked just for you.</p>
        </div>
        <button class="btn-banner-cta" onclick="openModal()">Join free</button>
      </div>
    </section>

    <section class="books-section container">
      <span class="section-subtitle">MOST LOVED</span>
      <div class="section-title-wrapper">
        <h2 class="section-title">Bestsellers</h2>
        <a href="#shop" class="view-all-link">View all <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="books-grid">
        ${bestsellers.map(b => window.components.createBookCard(b)).join('')}
      </div>
    </section>

    <section class="books-section container">
      <span class="section-subtitle">HOT OFF THE PRESS</span>
      <div class="section-title-wrapper">
        <h2 class="section-title">New arrivals</h2>
        <a href="#shop" class="view-all-link">View all <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="books-grid">
        ${newArrivals.map(b => window.components.createBookCard(b)).join('')}
      </div>
    </section>
  `;

  container.innerHTML = homeHTML;
  startCarouselAutoPlay();
}

// Carousel
function startCarouselAutoPlay() {
  appState.currentCarouselIndex = 0;
  updateCarouselUI();
  appState.carouselTimer = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function moveCarousel(direction) {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  const slideCount = track.children.length;
  appState.currentCarouselIndex = (appState.currentCarouselIndex + direction + slideCount) % slideCount;
  updateCarouselUI();
}
window.moveCarousel = moveCarousel;

function setCarouselIndex(index) {
  appState.currentCarouselIndex = index;
  updateCarouselUI();
  if (appState.carouselTimer) {
    clearInterval(appState.carouselTimer);
    appState.carouselTimer = setInterval(() => {
      moveCarousel(1);
    }, 5000);
  }
}
window.setCarouselIndex = setCarouselIndex;

function updateCarouselUI() {
  const track = document.getElementById('carousel-track');
  const indicators = document.querySelectorAll('.indicator');
  if (!track) return;

  track.style.transform = `translateX(-${appState.currentCarouselIndex * 100}%)`;

  indicators.forEach((indicator, idx) => {
    if (idx === appState.currentCarouselIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

// Shop Page
function renderShop(container, hash) {
  let genreParam = 'All';
  if (hash.includes('?')) {
    const query = hash.split('?')[1];
    const params = new URLSearchParams(query);
    genreParam = params.get('genre') || 'All';
  }

  appState.currentGenreFilter = genreParam;

  let shopHTML = `
    <div class="container">
      <div class="breadcrumb">
        ${window.components.createBreadcrumb([
          { name: "Home", link: "#home" },
          { name: "All Books", link: "" }
        ])}
      </div>

      <div class="shop-header">
        <h1 class="shop-title">All books</h1>
        <p class="shop-count" id="shop-result-count">Loading...</p>
      </div>

      <div class="shop-toolbar">
        <div class="filter-tags">
          <button class="filter-tag ${appState.currentGenreFilter === 'All' ? 'active' : ''}" onclick="setGenreFilter('All')">All</button>
          ${window.genresData.map(g => `
            <button class="filter-tag ${appState.currentGenreFilter.toLowerCase() === g.name.toLowerCase() ? 'active' : ''}" onclick="setGenreFilter('${g.name}')">${g.name}</button>
          `).join('')}
        </div>

        <div class="sort-wrapper">
          <span class="sort-label">Sort by</span>
          <select class="sort-select" id="sort-select" onchange="setSortOption(this.value)">
            <option value="featured" ${appState.currentSortOption === 'featured' ? 'selected' : ''}>Featured</option>
            <option value="price-low" ${appState.currentSortOption === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-high" ${appState.currentSortOption === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
            <option value="rating" ${appState.currentSortOption === 'rating' ? 'selected' : ''}>Rating</option>
          </select>
        </div>
      </div>

      <div class="books-grid" id="shop-books-grid"></div>
    </div>
  `;

  container.innerHTML = shopHTML;
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = appState.currentSearchQuery;
  }

  filterAndRenderShop();
}

function setGenreFilter(genre) {
  appState.currentGenreFilter = genre;
  const searchPart = appState.currentSearchQuery ? `&search=${encodeURIComponent(appState.currentSearchQuery)}` : '';
  navigateTo(`#shop?genre=${encodeURIComponent(genre)}${searchPart}`);
}
window.setGenreFilter = setGenreFilter;

function setSortOption(option) {
  appState.currentSortOption = option;
  filterAndRenderShop();
}
window.setSortOption = setSortOption;

function filterAndRenderShop() {
  const booksGrid = document.getElementById('shop-books-grid');
  const countLabel = document.getElementById('shop-result-count');
  if (!booksGrid) return;

  let filteredBooks = [...window.booksData];

  if (appState.currentGenreFilter !== 'All') {
    filteredBooks = filteredBooks.filter(book => book.genre.toLowerCase() === appState.currentGenreFilter.toLowerCase());
  }

  if (appState.currentSearchQuery) {
    const query = appState.currentSearchQuery.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query)
    );
  }

  if (appState.currentSortOption === 'price-low') {
    filteredBooks.sort((a, b) => a.price - b.price);
  } else if (appState.currentSortOption === 'price-high') {
    filteredBooks.sort((a, b) => b.price - a.price);
  } else if (appState.currentSortOption === 'rating') {
    filteredBooks.sort((a, b) => b.rating - a.rating);
  } else {
    filteredBooks.sort((a, b) => {
      const aVal = (a.isStaffPick ? 2 : 0) + (a.tag === 'BESTSELLER' ? 1 : 0);
      const bVal = (b.isStaffPick ? 2 : 0) + (b.tag === 'BESTSELLER' ? 1 : 0);
      return bVal - aVal;
    });
  }

  const countText = filteredBooks.length === 1 ? '1 title in the collection' : `${filteredBooks.length} titles in the collection`;
  if (countLabel) countLabel.textContent = countText;

  if (filteredBooks.length > 0) {
    booksGrid.innerHTML = filteredBooks.map(book => window.components.createBookCard(book)).join('');
  } else {
    booksGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
        <i class="fas fa-search" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
        <h3 style="font-family: var(--font-serif); margin-bottom: 0.5rem; color: var(--text-primary);">No books found</h3>
        <p>Try checking your spelling or search for another term.</p>
      </div>
    `;
  }

  const tags = document.querySelectorAll('.filter-tag');
  tags.forEach(tag => {
    const text = tag.textContent.trim();
    if (text.toLowerCase() === appState.currentGenreFilter.toLowerCase()) {
      tag.classList.add('active');
    } else {
      tag.classList.remove('active');
    }
  });
}
window.filterAndRenderShop = filterAndRenderShop;

// Book Detail Page
function renderBookDetail(container, id) {
  const book = window.booksData.find(b => b.id === id);
  if (!book) {
    navigateTo('#home');
    return;
  }

  container.innerHTML = window.components.createBookDetailView(book);

  const relatedBooksGrid = document.getElementById('related-books-grid');
  if (relatedBooksGrid) {
    const relatedBooks = window.booksData
      .filter(b => b.genre === book.genre && b.id !== book.id)
      .slice(0, 3);

    if (relatedBooks.length > 0) {
      relatedBooksGrid.innerHTML = relatedBooks.map(b => window.components.createBookCard(b)).join('');
    } else {
      const defaultRelated = window.booksData.filter(b => b.id !== book.id).slice(0, 3);
      relatedBooksGrid.innerHTML = defaultRelated.map(b => window.components.createBookCard(b)).join('');
    }
  }
}

// Bag Page
function renderBagPage(container) {
  const cartItems = appState.cart.map(item => {
    const book = window.booksData.find(b => b.id === item.bookId);
    return { book, quantity: item.quantity };
  }).filter(item => item.book !== undefined);

  container.innerHTML = window.components.createBagPageView(cartItems);
}
window.renderBagPage = renderBagPage;

function processCheckout(subtotal) {
  openModal();
}
window.processCheckout = processCheckout;

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
  const book = window.booksData.find(b => b.id === id);
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
        const book = window.booksData.find(b => b.id === item.bookId);
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
      const book = window.booksData.find(b => b.id === item.bookId);
      if (!book) return '';
      totalCost += book.price * item.quantity;
      return window.components.createCartItem({ book, quantity: item.quantity });
    }).join('');

    itemsContainer.innerHTML = itemsHTML;
    if (subtotalVal) subtotalVal.textContent = `$${totalCost.toFixed(2)}`;
    
    if (checkoutBtn) {
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.pointerEvents = 'auto';
      checkoutBtn.onclick = () => {
        alert(`Cảm ơn bạn đã mua hàng! Đơn hàng trị giá $${totalCost.toFixed(2)} đang được xử lý.`);
        appState.cart = [];
        saveCart();
        updateCartUI();
        closeCart();
      };
    }
  }
}

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
