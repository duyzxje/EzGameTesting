import { createBreadcrumb } from '../components/Breadcrumb.js';
import { createBookCard } from '../components/BookCard.js';
import { booksData, genresData } from '../data/books.js';

export function renderShop(container, hash) {
  let genreParam = 'All';
  if (hash.includes('?')) {
    const query = hash.split('?')[1];
    const params = new URLSearchParams(query);
    genreParam = params.get('genre') || 'All';
  }

  window.appState.currentGenreFilter = genreParam;

  let shopHTML = `
    <div class="container">
      <div class="breadcrumb">
        ${createBreadcrumb([
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
          <button class="filter-tag ${window.appState.currentGenreFilter === 'All' ? 'active' : ''}" onclick="setGenreFilter('All')">All</button>
          ${genresData.map(g => `
            <button class="filter-tag ${window.appState.currentGenreFilter.toLowerCase() === g.name.toLowerCase() ? 'active' : ''}" onclick="setGenreFilter('${g.name}')">${g.name}</button>
          `).join('')}
        </div>

        <div class="sort-wrapper">
          <span class="sort-label">Sort by</span>
          <select class="sort-select" id="sort-select" onchange="setSortOption(this.value)">
            <option value="featured" ${window.appState.currentSortOption === 'featured' ? 'selected' : ''}>Featured</option>
            <option value="price-low" ${window.appState.currentSortOption === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-high" ${window.appState.currentSortOption === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
            <option value="rating" ${window.appState.currentSortOption === 'rating' ? 'selected' : ''}>Rating</option>
          </select>
        </div>
      </div>

      <div class="books-grid" id="shop-books-grid"></div>
    </div>
  `;

  container.innerHTML = shopHTML;
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = window.appState.currentSearchQuery;
  }

  filterAndRenderShop();
}

export function setGenreFilter(genre) {
  window.appState.currentGenreFilter = genre;
  const searchPart = window.appState.currentSearchQuery ? `&search=${encodeURIComponent(window.appState.currentSearchQuery)}` : '';
  navigateTo(`#shop?genre=${encodeURIComponent(genre)}${searchPart}`);
}
window.setGenreFilter = setGenreFilter;

export function setSortOption(option) {
  window.appState.currentSortOption = option;
  filterAndRenderShop();
}
window.setSortOption = setSortOption;

export function filterAndRenderShop() {
  const booksGrid = document.getElementById('shop-books-grid');
  const countLabel = document.getElementById('shop-result-count');
  if (!booksGrid) return;

  let filteredBooks = [...booksData];

  if (window.appState.currentGenreFilter !== 'All') {
    filteredBooks = filteredBooks.filter(book => book.genre.toLowerCase() === window.appState.currentGenreFilter.toLowerCase());
  }

  if (window.appState.currentSearchQuery) {
    const query = window.appState.currentSearchQuery.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query)
    );
  }

  if (window.appState.currentSortOption === 'price-low') {
    filteredBooks.sort((a, b) => a.price - b.price);
  } else if (window.appState.currentSortOption === 'price-high') {
    filteredBooks.sort((a, b) => b.price - a.price);
  } else if (window.appState.currentSortOption === 'rating') {
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
    booksGrid.innerHTML = filteredBooks.map(book => createBookCard(book)).join('');
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
    if (text.toLowerCase() === window.appState.currentGenreFilter.toLowerCase()) {
      tag.classList.add('active');
    } else {
      tag.classList.remove('active');
    }
  });
}
window.filterAndRenderShop = filterAndRenderShop;
