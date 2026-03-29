// components.js – Modular UI components

import { escapeHtml } from './utils.js';

/* ── Badge / card class helpers ─────────────────────────── */
const badgeClass = (company = '') =>
  company.toLowerCase().includes('sodexo') ? 'badge-sodexo' : 'badge-compass';

const cardClass = (company = '') =>
  company.toLowerCase().includes('sodexo') ? 'sodexo' : 'compass';

/* ── restaurantRow ──────────────────────────────────────── */
/**
 * Builds a card <article> element for one restaurant.
 * Pure function – no event listeners attached here.
 *
 * @param {Object} restaurant
 * @returns {HTMLElement}
 */
export const restaurantRow = (restaurant) => {
  const { name, address, postalCode, city, phone, company } = restaurant;

  const card = document.createElement('article');
  card.className = `card ${cardClass(company)}`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `View menu for ${name}`);

  card.innerHTML = `
    <div class="card-top">
      <h2>${escapeHtml(name)}</h2>
      <span class="company-badge ${badgeClass(company)}">${escapeHtml(company)}</span>
    </div>
    <p class="card-address">${escapeHtml(address)}, ${escapeHtml(postalCode)}</p>
    <div class="card-meta">
      <span class="meta-chip">📍 ${escapeHtml(city)}</span>
      ${phone ? `<span class="meta-chip">📞 ${escapeHtml(phone)}</span>` : ''}
    </div>
    <p class="card-cta">View today's menu →</p>
  `;

  return card;
};

/* ── restaurantModal ────────────────────────────────────── */
/**
 * Returns the HTML string for the modal's menu body.
 * Uses .map() to transform each course object into an HTML string,
 * then .join('') collapses the array into one string – no manual
 * concatenation or mutation needed.
 *
 * @param {Object} restaurant
 * @param {Object} menu  – API response with a `courses` array
 * @returns {string} HTML
 */
export const restaurantModal = (restaurant, menu) => {
  const { courses } = menu;

  const courseCards = courses
    .map(({ name, price, diets }) => `
      <div class="course-card">
        <p class="course-name">${escapeHtml(name || '—')}</p>
        ${price ? `<p class="course-price">${escapeHtml(price)}</p>` : ''}
        ${diets ? `<p class="course-diets">🥗 ${escapeHtml(diets)}</p>` : ''}
      </div>
    `)
    .join('');

  return courseCards || '<p class="menu-empty">No menu available for today.</p>';
};
