import { booksData } from '../data/books.js';

export function createGenreCard(genre) {
  const actualCount = booksData ? booksData.filter(b => b.genre.toLowerCase() === genre.name.toLowerCase()).length : genre.count;
  const titleText = actualCount === 1 ? '1 title' : `${actualCount} titles`;
  
  return `
    <div class="genre-card" style="background-color: ${genre.color};" onclick="navigateTo('#shop?genre=${genre.name}')">
      <h3 class="genre-name">${genre.name}</h3>
      <span class="genre-count">${titleText}</span>
    </div>
  `;
}
