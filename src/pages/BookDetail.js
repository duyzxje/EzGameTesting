import { createBreadcrumb } from '../components/Breadcrumb.js';
import { createBookCard } from '../components/BookCard.js';
import { booksData } from '../data/books.js';

export function createBookDetailView(book) {
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

export function renderBookDetail(container, id) {
  const book = booksData.find(b => b.id === id);
  if (!book) {
    navigateTo('#home');
    return;
  }

  container.innerHTML = createBookDetailView(book);

  const relatedBooksGrid = document.getElementById('related-books-grid');
  if (relatedBooksGrid) {
    const relatedBooks = booksData
      .filter(b => b.genre === book.genre && b.id !== book.id)
      .slice(0, 3);

    if (relatedBooks.length > 0) {
      relatedBooksGrid.innerHTML = relatedBooks.map(b => createBookCard(b)).join('');
    } else {
      const defaultRelated = booksData.filter(b => b.id !== book.id).slice(0, 3);
      relatedBooksGrid.innerHTML = defaultRelated.map(b => createBookCard(b)).join('');
    }
  }
}
