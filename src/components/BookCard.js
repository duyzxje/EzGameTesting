export function createBookCard(book) {
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
