import { createGenreCard } from '../components/GenreCard.js';
import { createBookCard } from '../components/BookCard.js';

export function renderHome(container, booksData, genresData) {
  const carouselBooks = booksData.filter(b => b.isStaffPick).slice(0, 3);
  const featuredBooks = booksData.slice(2, 7);
  const bestsellers = booksData.filter(b => b.tag === 'BESTSELLER').slice(0, 5);
  const newArrivals = booksData.filter(b => b.tag === 'NEW').slice(0, 5);

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
        ${genresData.map(g => createGenreCard(g)).join('')}
      </div>
    </section>

    <section class="books-section container">
      <span class="section-subtitle">EDITOR'S PICKS</span>
      <div class="section-title-wrapper">
        <h2 class="section-title">Featured this month</h2>
        <a href="#shop" class="view-all-link">View all <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="books-grid">
        ${featuredBooks.map(b => createBookCard(b)).join('')}
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
        ${bestsellers.map(b => createBookCard(b)).join('')}
      </div>
    </section>

    <section class="books-section container">
      <span class="section-subtitle">HOT OFF THE PRESS</span>
      <div class="section-title-wrapper">
        <h2 class="section-title">New arrivals</h2>
        <a href="#shop" class="view-all-link">View all <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="books-grid">
        ${newArrivals.map(b => createBookCard(b)).join('')}
      </div>
    </section>
  `;

  container.innerHTML = homeHTML;
  startCarouselAutoPlay();
}

// Carousel Autoplay & Control logic
function startCarouselAutoPlay() {
  window.appState.currentCarouselIndex = 0;
  updateCarouselUI();
  window.appState.carouselTimer = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function moveCarousel(direction) {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  const slideCount = track.children.length;
  window.appState.currentCarouselIndex = (window.appState.currentCarouselIndex + direction + slideCount) % slideCount;
  updateCarouselUI();
}
window.moveCarousel = moveCarousel;

function setCarouselIndex(index) {
  window.appState.currentCarouselIndex = index;
  updateCarouselUI();
  if (window.appState.carouselTimer) {
    clearInterval(window.appState.carouselTimer);
    window.appState.carouselTimer = setInterval(() => {
      moveCarousel(1);
    }, 5000);
  }
}
window.setCarouselIndex = setCarouselIndex;

function updateCarouselUI() {
  const track = document.getElementById('carousel-track');
  const indicators = document.querySelectorAll('.indicator');
  if (!track) return;

  track.style.transform = `translateX(-${window.appState.currentCarouselIndex * 100}%)`;

  indicators.forEach((indicator, idx) => {
    if (idx === window.appState.currentCarouselIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}
