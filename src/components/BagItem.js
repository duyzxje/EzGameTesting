export function createBagItem(item) {
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
