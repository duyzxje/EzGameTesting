// COMPONENTS ENGINE FOR PAGES & CO.

// Card sách
function createBookCard(book) {
  const hasOldPrice = book.originalPrice !== null;
  const tagHTML = book.tag ? `<div class="cover-tag-absolute">${book.tag}</div>` : '';
  const oldPriceHTML = hasOldPrice ? `<span class="book-card-old-price">$${book.originalPrice.toFixed(2)}</span>` : '';
  
  return `
    <div class="book-card" data-id="${book.id}">
      <div class="book-cover-container" onclick="navigateTo('#book-${book.id}')">
        <div class="book-cover-inner" style="background-color: ${book.coverColor}; color: ${book.textColor || '#ffffff'};">
          ${tagHTML}
          <h3 class="cover-title">${book.title}</h3>
          <p class="cover-author">${book.author}</p>
        </div>
      </div>
      <div class="book-info">
        <h4 class="book-card-title"><a href="#book-${book.id}">${book.title}</a></h4>
        <p class="book-card-author">${book.author}</p>
        <div class="book-card-footer">
          <div class="book-card-price-wrapper">
            <span class="book-card-price">$${book.price.toFixed(2)}</span>
            ${oldPriceHTML}
          </div>
          <div class="book-card-rating">
            <i class="fas fa-star"></i>
            <span>${book.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Card thể loại
function createGenreCard(genre) {
  const actualCount = window.booksData ? window.booksData.filter(b => b.genre.toLowerCase() === genre.name.toLowerCase()).length : genre.count;
  const titleText = actualCount === 1 ? '1 title' : `${actualCount} titles`;
  
  return `
    <div class="genre-card" style="background-color: ${genre.color};" onclick="navigateTo('#shop?genre=${genre.name}')">
      <h3 class="genre-name">${genre.name}</h3>
      <span class="genre-count">${titleText}</span>
    </div>
  `;
}

// Breadcrumb
function createBreadcrumb(paths) {
  return paths.map((path, index) => {
    const isLast = index === paths.length - 1;
    if (isLast) {
      return `<span class="current">${path.name}</span>`;
    } else {
      return `
        <a href="${path.link}">${path.name}</a>
        <span class="separator">/</span>
      `;
    }
  }).join('');
}

// Giỏ hàng drawer item
function createCartItem(item) {
  const book = item.book;
  return `
    <div class="cart-item" data-id="${book.id}">
      <div class="cart-item-cover" style="background-color: ${book.coverColor};" onclick="closeCart(); navigateTo('#book-${book.id}')"></div>
      <div class="cart-item-detail">
        <div>
          <h4 class="cart-item-title" onclick="closeCart(); navigateTo('#book-${book.id}')">${book.title}</h4>
          <p class="cart-item-author">${book.author}</p>
        </div>
        <div class="cart-item-row">
          <div class="qty-control">
            <button class="qty-btn btn-dec" onclick="updateCartQty(${book.id}, -1)">−</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn btn-inc" onclick="updateCartQty(${book.id}, 1)">+</button>
          </div>
          <div class="cart-item-price">$${(book.price * item.quantity).toFixed(2)}</div>
          <button class="btn-remove-item" onclick="removeFromCart(${book.id})" title="Xóa sản phẩm">
            <i class="far fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Trang chi tiết sách
function createBookDetailView(book) {
  const hasOldPrice = book.originalPrice !== null;
  const oldPriceHTML = hasOldPrice ? `<span class="detail-old-price">$${book.originalPrice.toFixed(2)}</span>` : '';
  const isWishlisted = window.appState && window.appState.wishlist.includes(book.id);
  const wishlistClass = isWishlisted ? 'btn-wishlist active' : 'btn-wishlist';
  const wishlistIcon = isWishlisted ? 'fas fa-heart' : 'far fa-heart';
  
  return `
    <div class="container">
      <div class="breadcrumb">
        ${createBreadcrumb([
          { name: "Home", link: "#home" },
          { name: "Books", link: "#shop" },
          { name: book.title, link: "" }
        ])}
      </div>

      <div class="book-detail-grid">
        <div class="book-detail-cover-wrapper">
          <div class="book-detail-cover" style="background-color: ${book.coverColor}; color: ${book.textColor || '#ffffff'};">
            <div class="book-cover-inner" style="padding: 3rem 2.5rem; border-left-width: 8px;">
              <h2 class="cover-title" style="font-size: 2.2rem; line-height: 1.2; text-shadow: 0 2px 5px rgba(0,0,0,0.3);">${book.title}</h2>
              <p class="cover-author" style="font-size: 1.1rem; margin-top: 1rem; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">${book.author}</p>
            </div>
          </div>
        </div>

        <div class="detail-info-pane">
          <span class="detail-genre-tag">${book.genre}</span>
          <h1 class="detail-title">${book.title}</h1>
          <p class="detail-author">by ${book.author}</p>

          <div class="detail-meta-quick">
            <div class="detail-rating-quick">
              <i class="fas fa-star"></i>
              <span>${book.rating.toFixed(1)}</span>
            </div>
            <div class="detail-meta-divider"></div>
            <span>${book.pages} pages</span>
            <div class="detail-meta-divider"></div>
            <span>Published: ${book.publishedYear}</span>
          </div>

          <div class="detail-price-box">
            <span class="detail-price">$${book.price.toFixed(2)}</span>
            ${oldPriceHTML}
          </div>

          <p class="detail-description">${book.description}</p>

          <div class="detail-actions">
            <button class="btn-add-to-bag" onclick="addToCart(${book.id})">Add to bag — $${book.price.toFixed(2)}</button>
            <button class="${wishlistClass}" onclick="toggleWishlist(${book.id}, this)" title="Thêm vào danh sách yêu thích">
              <i class="${wishlistIcon}"></i>
            </button>
          </div>

          <div class="detail-spec-grid">
            <div class="spec-item">
              <span class="spec-label">Format</span>
              <span class="spec-val">Paperback</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Pages</span>
              <span class="spec-val">${book.pages}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Published</span>
              <span class="spec-val">${book.publishedYear}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Publisher</span>
              <span class="spec-val">${book.publisher}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Language</span>
              <span class="spec-val">${book.language}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">ISBN</span>
              <span class="spec-val">${book.isbn}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="books-section">
        <div class="section-title-wrapper" style="margin-bottom: 2.5rem;">
          <h2 class="section-title">You may also like</h2>
        </div>
        <div class="books-grid" id="related-books-grid"></div>
      </div>
    </div>
  `;
}

// Dòng sách trang giỏ hàng
function createBagItem(item) {
  const book = item.book;
  return `
    <div class="bag-page-item" data-id="${book.id}">
      <div class="bag-item-left">
        <div class="bag-item-cover" style="background-color: ${book.coverColor};" onclick="navigateTo('#book-${book.id}')"></div>
        <div class="bag-item-info">
          <h3 class="bag-item-title" onclick="navigateTo('#book-${book.id}')">${book.title}</h3>
          <p class="bag-item-author">${book.author}</p>
          <button class="btn-bag-remove" onclick="removeFromCart(${book.id})">Remove</button>
        </div>
      </div>
      <div class="bag-item-right">
        <div class="qty-control bag-qty-control">
          <button class="qty-btn" onclick="updateCartQty(${book.id}, -1)">−</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty(${book.id}, 1)">+</button>
        </div>
        <div class="bag-item-total-price">$${(book.price * item.quantity).toFixed(2)}</div>
      </div>
    </div>
  `;
}

// Giao diện trang giỏ hàng đầy đủ
function createBagPageView(cartItems) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  
  const itemsHTML = cartItems.length === 0 
    ? `
      <div class="bag-empty-state">
        <i class="fas fa-shopping-bag bag-empty-icon"></i>
        <h3 class="bag-empty-title">Your bag is empty</h3>
        <p>Looks like you haven't added any books to your bag yet.</p>
        <button class="btn-shop-now" onclick="navigateTo('#shop')">Browse books</button>
      </div>
    `
    : cartItems.map(item => createBagItem(item)).join('');
    
  const isBagEmpty = cartItems.length === 0;
  const checkoutDisabled = isBagEmpty ? 'disabled style="opacity: 0.5; pointer-events: none;"' : '';
  
  return `
    <div class="container">
      <div class="breadcrumb">
        ${createBreadcrumb([
          { name: "Home", link: "#home" },
          { name: "Bag", link: "" }
        ])}
      </div>
      
      <h1 class="bag-page-title">Your bag</h1>
      
      <div class="bag-page-layout">
        <div class="bag-page-main">
          ${itemsHTML}
        </div>
        
        <div class="bag-page-summary">
          <div class="summary-box">
            <h2 class="summary-title">Order summary</h2>
            
            <div class="summary-row">
              <span>Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'items'})</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            
            <div class="summary-row">
              <span>Shipping</span>
              <span class="free-shipping">Free</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total-row">
              <span>Total</span>
              <span class="total-price">$${subtotal.toFixed(2)}</span>
            </div>
            
            <button class="btn-bag-checkout" ${checkoutDisabled} onclick="processCheckout(${subtotal})">Checkout</button>
            
            <p class="checkout-note">You'll be asked to sign in to complete your order</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Giao diện trang checkout
function createCheckoutPageView(cartItems, user) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  
  const userName = user ? user.name : '';
  const userEmail = user ? user.email : '';
  
  const itemsMiniHTML = cartItems.map(item => `
    <div class="checkout-item-mini">
      <div class="checkout-item-mini-info">
        <span class="checkout-item-mini-title">${item.book.title}</span>
        <span class="checkout-item-mini-qty">Qty: ${item.quantity}</span>
      </div>
      <span class="checkout-item-mini-price">$${(item.book.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  return `
    <div class="container">
      <div class="breadcrumb">
        ${createBreadcrumb([
          { name: "Home", link: "#home" },
          { name: "Bag", link: "#bag" },
          { name: "Checkout", link: "" }
        ])}
      </div>
      
      <h1 class="bag-page-title" style="margin-bottom: 2rem;">Checkout</h1>
      
      <form class="checkout-page-layout" id="checkout-form" onsubmit="submitOrder(event)">
        <!-- Cột trái: Thông tin nhận hàng & Thanh toán -->
        <div class="checkout-main">
          <div class="checkout-section">
            <h2 class="checkout-section-title">Shipping Information</h2>
            <div class="checkout-form">
              <div class="form-row">
                <div class="checkout-form-group">
                  <label for="shipping-name">Full Name</label>
                  <input type="text" id="shipping-name" class="checkout-input" placeholder="Your full name" value="${userName}" required>
                </div>
                <div class="checkout-form-group">
                  <label for="shipping-email">Email Address</label>
                  <input type="email" id="shipping-email" class="checkout-input" placeholder="you@example.com" value="${userEmail}" required>
                </div>
              </div>
              
              <div class="form-row">
                <div class="checkout-form-group">
                  <label for="shipping-phone">Phone Number</label>
                  <input type="tel" id="shipping-phone" class="checkout-input" placeholder="(+84) 123 456 789" required>
                </div>
                <div class="checkout-form-group">
                  <label for="shipping-address">Delivery Address</label>
                  <input type="text" id="shipping-address" class="checkout-input" placeholder="Street address, city" required>
                </div>
              </div>
            </div>
          </div>
          
          <div class="checkout-section" style="margin-top: 2.5rem;">
            <h2 class="checkout-section-title">Payment Method</h2>
            <div class="payment-methods">
              <!-- COD Option -->
              <div class="payment-method-option active" id="payment-opt-cod" onclick="selectPaymentMethod('cod')">
                <div class="payment-radio-wrapper">
                  <input type="radio" name="payment-method" id="payment-cod" class="payment-radio" value="cod" checked>
                </div>
                <div class="payment-option-details">
                  <span class="payment-option-title"><i class="fas fa-truck"></i> Cash on Delivery (COD)</span>
                  <span class="payment-option-desc">Pay with cash when your package is delivered to your door.</span>
                </div>
              </div>
              
              <!-- Credit Card Option -->
              <div class="payment-method-option" id="payment-opt-card" onclick="selectPaymentMethod('card')">
                <div class="payment-radio-wrapper">
                  <input type="radio" name="payment-method" id="payment-card" class="payment-radio" value="card">
                </div>
                <div class="payment-option-details">
                  <span class="payment-option-title"><i class="far fa-credit-card"></i> Credit / Debit Card</span>
                  <span class="payment-option-desc">We support Visa, Mastercard, and American Express.</span>
                </div>
              </div>
              
              <!-- Card Fields (Hidden initially) -->
              <div class="card-details-fields" id="card-fields" style="display: none;">
                <div class="checkout-form-group">
                  <label for="card-number">Card Number</label>
                  <input type="text" id="card-number" class="checkout-input" placeholder="0000 0000 0000 0000" maxlength="19">
                </div>
                <div class="form-row">
                  <div class="checkout-form-group">
                    <label for="card-expiry">Expiry Date</label>
                    <input type="text" id="card-expiry" class="checkout-input" placeholder="MM/YY" maxlength="5">
                  </div>
                  <div class="checkout-form-group">
                    <label for="card-cvv">CVV</label>
                    <input type="text" id="card-cvv" class="checkout-input" placeholder="123" maxlength="4">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cột phải: Tóm tắt đơn hàng -->
        <div class="checkout-sidebar">
          <div class="checkout-summary-box">
            <h2 class="summary-title" style="margin-bottom: 1.5rem;">Order Summary</h2>
            
            <div class="checkout-items-list">
              ${itemsMiniHTML}
            </div>
            
            <div class="summary-divider" style="margin: 1.5rem 0;"></div>
            
            <div class="summary-row" style="margin-bottom: 0.75rem;">
              <span>Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'items'})</span>
              <span id="checkout-subtotal">$${subtotal.toFixed(2)}</span>
            </div>
            
            <div class="summary-row" style="margin-bottom: 0.75rem;">
              <span>Shipping</span>
              <span class="free-shipping">Free</span>
            </div>
            
            <div class="summary-divider" style="margin: 1.5rem 0;"></div>
            
            <div class="summary-row total-row" style="margin-bottom: 1.5rem;">
              <span>Total</span>
              <span class="total-price" id="checkout-total">$${subtotal.toFixed(2)}</span>
            </div>
            
            <button type="submit" class="btn-confirm-order">Confirm Order</button>
            <a href="#bag" class="view-all-link" style="justify-content: center; margin-top: 1.25rem;">
              <i class="fas fa-arrow-left"></i> Back to bag
            </a>
          </div>
        </div>
      </form>
    </div>
  `;
}

// Màn hình cảm ơn khi đặt hàng thành công
function createOrderSuccessView(orderDetails) {
  return `
    <div class="container">
      <div class="success-container">
        <div class="success-icon-wrapper">
          <i class="fas fa-check"></i>
        </div>
        <h1 class="success-title">Order Confirmed!</h1>
        <p class="success-message">Thank you for shopping at Pages & Co. Your order has been successfully placed and is now being processed.</p>
        
        <div class="success-order-card">
          <div class="success-card-row">
            <span class="success-card-label">Order Number</span>
            <span class="success-card-value success-order-id">${orderDetails.orderId}</span>
          </div>
          <div class="success-card-row">
            <span class="success-card-label">Recipient</span>
            <span class="success-card-value">${orderDetails.name}</span>
          </div>
          <div class="success-card-row">
            <span class="success-card-label">Phone</span>
            <span class="success-card-value">${orderDetails.phone}</span>
          </div>
          <div class="success-card-row">
            <span class="success-card-label">Delivery Address</span>
            <span class="success-card-value">${orderDetails.address}</span>
          </div>
          <div class="success-card-row">
            <span class="success-card-label">Total Payment</span>
            <span class="success-card-value" style="color: var(--brand-cta); font-weight: 700;">$${orderDetails.total.toFixed(2)}</span>
          </div>
          <div class="success-card-row">
            <span class="success-card-label">Payment Method</span>
            <span class="success-card-value">${orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit Card'}</span>
          </div>
        </div>
        
        <div class="success-actions">
          <button class="btn-success-primary" onclick="navigateTo('#shop')">Continue Shopping</button>
          <button class="btn-success-secondary" onclick="navigateTo('#home')">Back to Home</button>
        </div>
      </div>
    </div>
  `;
}

window.components = {
  createBookCard,
  createGenreCard,
  createBreadcrumb,
  createCartItem,
  createBookDetailView,
  createBagItem,
  createBagPageView,
  createCheckoutPageView,
  createOrderSuccessView
};
