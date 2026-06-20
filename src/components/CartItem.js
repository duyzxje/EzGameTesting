export function createCartItem(item) {
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
