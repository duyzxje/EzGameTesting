import { createBreadcrumb } from '../components/Breadcrumb.js';
import { booksData } from '../data/books.js';

export function createCheckoutPageView(cartItems, user) {
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

export function createOrderSuccessView(orderDetails) {
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

export function renderCheckoutPage(container) {
  if (window.appState.cart.length === 0) {
    navigateTo('#home');
    return;
  }
  
  if (!window.appState.user) {
    window.appState.redirectAfterAuth = '#checkout';
    navigateTo('#bag');
    openModal();
    return;
  }
  
  const cartItems = window.appState.cart.map(item => {
    const book = booksData.find(b => b.id === item.bookId);
    return { book, quantity: item.quantity };
  }).filter(item => item.book !== undefined);
  
  container.innerHTML = createCheckoutPageView(cartItems, window.appState.user);
}
