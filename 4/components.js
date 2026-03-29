// components.js – Modular UI components

import { escapeHtml } from './utils.js';

/* ── Badge helpers ──────────────────────────────────────── */
const badgeClass = (company = '') =>
  company.toLowerCase().includes('sodexo') ? 'badge-sodexo' : 'badge-compass';

const cardClass = (company = '') =>
  company.toLowerCase().includes('sodexo') ? 'sodexo' : 'compass';

/* ── restaurantRow ──────────────────────────────────────── */
/**
 * Builds a styled card element for a restaurant.
 * (Named "restaurantRow" per the assignment spec, but renders as a card
 * to match the existing card-based UI layout.)
 *
 * @param {Object} restaurant
 * @returns {HTMLElement} article.card
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
 * Generates the inner HTML string for the modal menu body.
 *
 * @param {Object} restaurant
 * @param {Object} menu  – API response containing a `courses` array
 * @returns {string} HTML string
 */
export const restaurantModal = (restaurant, menu) => {
  const { name, address, postalCode, city, phone, company } = restaurant;
  const { courses } = menu;

  let menuHtml = '';

  courses.forEach(({ name: courseName, price, diets }) => {
    menuHtml += `
      <div class="course-card">
        <p class="course-name">${escapeHtml(courseName || '—')}</p>
        ${price ? `<p class="course-price">${escapeHtml(price)}</p>` : ''}
        ${diets ? `<p class="course-diets">🥗 ${escapeHtml(diets)}</p>`  : ''}
      </div>
    `;
  });

  return menuHtml || '<p class="menu-empty">No menu available for today.</p>';
};
