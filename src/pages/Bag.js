import { createBreadcrumb } from '../components/Breadcrumb.js';
import { createBagItem } from '../components/BagItem.js';
import { booksData } from '../data/books.js';

export function createBagPageView(cartItems) {
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

export function renderBagPage(container) {
  const cartItems = window.appState.cart.map(item => {
    const book = booksData.find(b => b.id === item.bookId);
    return { book, quantity: item.quantity };
  }).filter(item => item.book !== undefined);

  container.innerHTML = createBagPageView(cartItems);
}
