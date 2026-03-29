// main.js – Restaurant App (Assignment 7 refactor)
// Adds: named filter predicates with .filter(), .map()-based rendering,
//       company-specific filtering (Sodexo / Compass), and robust error handling.
//
// ⚠  The API is only accessible from the Metropolia network or via VPN.

'use strict';

/* ═══════════════════════════════════════════════════════
   Imports
   ═══════════════════════════════════════════════════════ */
import { API_BASE, LANG }                from './variables.js';
import { fetchData, escapeHtml }         from './utils.js';
import { restaurantRow, restaurantModal } from './components.js';

/* ═══════════════════════════════════════════════════════
   State
   ═══════════════════════════════════════════════════════ */
let allRestaurants = [];   // full list fetched from API

/* ═══════════════════════════════════════════════════════
   DOM refs
   ═══════════════════════════════════════════════════════ */
const statusEl   = document.getElementById('status');
const gridEl     = document.getElementById('restaurant-grid');
const searchEl   = document.getElementById('search');
const filterEl   = document.getElementById('company-filter');
const overlay    = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalBadge = document.getElementById('modal-company-badge');
const modalAddr  = document.getElementById('modal-address');
const modalCity  = document.getElementById('modal-city');
const modalPhone = document.getElementById('modal-phone');
const modalMenu  = document.getElementById('modal-menu');

/* ═══════════════════════════════════════════════════════
   Status banner helpers
   ═══════════════════════════════════════════════════════ */
const showStatus = (message, type /* 'loading' | 'error' | 'info' */) => {
  statusEl.textContent = message;
  statusEl.className   = `status ${type}`;
};

const hideStatus = () => { statusEl.className = 'status hidden'; };

/* ═══════════════════════════════════════════════════════
   Badge helper
   ═══════════════════════════════════════════════════════ */
const badgeClass = (company = '') =>
  company.toLowerCase().includes('sodexo') ? 'badge-sodexo' : 'badge-compass';

/* ═══════════════════════════════════════════════════════
   Filter predicates
   Three small, named arrow functions – each tests ONE condition.
   getFiltered() composes them with .filter() so the logic stays readable.
   ═══════════════════════════════════════════════════════ */

/**
 * Returns true when the restaurant name, city, or address contains `query`.
 * An empty query always passes.
 */
const matchesSearch = (query) => (r) =>
  !query ||
  r.name.toLowerCase().includes(query)    ||
  r.city.toLowerCase().includes(query)    ||
  r.address.toLowerCase().includes(query);

/**
 * Returns true when the restaurant belongs to the selected company.
 * An empty selection ("All") always passes.
 */
const matchesCompany = (company) => (r) =>
  !company || r.company === company;

/**
 * Returns true for Sodexo restaurants only.
 * Used when the company filter is explicitly set to "Sodexo".
 */
const isSodexo = (r) => r.company.toLowerCase().includes('sodexo');

/**
 * Returns true for Compass Group restaurants only.
 * Used when the company filter is explicitly set to "Compass Group".
 */
const isCompass = (r) => r.company.toLowerCase().includes('compass');

/**
 * Applies all active filters to `allRestaurants` and returns the
 * matching subset.  Uses .filter() with the predicates above.
 */
const getFiltered = () => {
  const query   = searchEl.value.toLowerCase().trim();
  const company = filterEl.value;  // '', 'Sodexo', or 'Compass Group'

  // Start from the full list, then chain .filter() calls
  return allRestaurants
    .filter(matchesSearch(query))
    .filter(matchesCompany(company));
};

/* ═══════════════════════════════════════════════════════
   Render helpers
   ═══════════════════════════════════════════════════════ */

/**
 * Attaches click and keyboard handlers to a card so it opens the modal.
 * Returns the card so it can be used in .map() pipelines.
 */
const withModalHandler = (restaurant) => (card) => {
  const openModal = () => showModal(restaurant);
  card.addEventListener('click', openModal);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });
  return card;
};

/**
 * Renders the restaurant grid.
 *
 * Uses .map() to turn each restaurant object into a card element,
 * then a second .map() to attach event handlers, then .forEach() to
 * append each card to the DocumentFragment.
 *
 * @param {Object[]} restaurants
 */
const renderGrid = (restaurants) => {
  gridEl.innerHTML = '';

  if (restaurants.length === 0) {
    const company = filterEl.value;
    // Tailor the empty-state message to the active company filter
    const who = company ? `${company} restaurants` : 'restaurants';
    showStatus(`No ${who} match your search. Try a different term or filter.`, 'info');
    return;
  }

  hideStatus();

  const fragment = document.createDocumentFragment();

  // .map() → card elements; second .map() → add handlers; .forEach() → append
  restaurants
    .map((restaurant) => withModalHandler(restaurant)(restaurantRow(restaurant)))
    .forEach((card) => fragment.appendChild(card));

  gridEl.appendChild(fragment);
};

/* ═══════════════════════════════════════════════════════
   Modal – show restaurant info & fetch today's menu
   ═══════════════════════════════════════════════════════ */
const showModal = async (restaurant) => {
  const { _id, name, address, postalCode, city, phone, company } = restaurant;

  // Populate static fields
  modalTitle.textContent = name;
  modalBadge.className   = `company-badge ${badgeClass(company)}`;
  modalBadge.textContent = company;
  modalAddr.textContent  = `${address}, ${postalCode}`;
  modalCity.textContent  = `📍 ${city}`;
  modalPhone.textContent = phone ? `📞 ${phone}` : '📞 N/A';

  // Show spinner while the menu loads
  modalMenu.innerHTML = `
    <div class="menu-loading">
      <div class="spinner"></div>
      Loading today's menu…
    </div>
  `;

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  modalClose.focus();

  // ── Fetch daily menu with detailed error handling ──────
  try {
    const menuUrl = `${API_BASE}/restaurants/daily/${_id}/${LANG}`;
    const menu    = await fetchData(menuUrl);

    if (!menu.courses || menu.courses.length === 0) {
      modalMenu.innerHTML = '<p class="menu-empty">No menu available for today.</p>';
      return;
    }

    modalMenu.innerHTML = restaurantModal(restaurant, menu);

  } catch (error) {
    console.error('Menu fetch failed:', error);

    // Determine a user-friendly reason based on the error type
    const isNetworkError  = error instanceof TypeError;
    const isNotFound      = error.message.includes('404');
    const isServerError   = error.message.includes('50');

    const reason = isNetworkError
      ? 'Could not reach the server. Check your connection to the Metropolia network or VPN.'
      : isNotFound
        ? 'No menu data was found for this restaurant today.'
        : isServerError
          ? 'The menu server encountered an error. Please try again later.'
          : 'An unexpected error occurred while loading the menu.';

    modalMenu.innerHTML = `
      <div class="menu-error">
        <strong>⚠ Menu unavailable</strong>
        <p>${escapeHtml(reason)}</p>
        <small>Technical detail: ${escapeHtml(error.message)}</small>
      </div>
    `;
  }
};

const closeModal = () => {
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
};

/* ═══════════════════════════════════════════════════════
   Load restaurants
   ═══════════════════════════════════════════════════════ */
const loadRestaurants = async () => {
  showStatus('Loading restaurants…', 'loading');
  gridEl.innerHTML = '';

  try {
    allRestaurants = await fetchData(`${API_BASE}/restaurants`);
    renderGrid(allRestaurants);

  } catch (error) {
    console.error('Restaurant fetch failed:', error);

    const isNetworkError = error instanceof TypeError;

    const reason = isNetworkError
      ? 'Could not reach the server. Are you connected to the Metropolia network or VPN?'
      : `The server returned an error (${escapeHtml(error.message)}).`;

    showStatus(`⚠ Failed to load restaurants. ${reason}`, 'error');
  }
};

/* ═══════════════════════════════════════════════════════
   Event listeners
   ═══════════════════════════════════════════════════════ */
searchEl.addEventListener('input',  () => renderGrid(getFiltered()));
filterEl.addEventListener('change', () => renderGrid(getFiltered()));

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click',   (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
});

/* ═══════════════════════════════════════════════════════
   Bootstrap
   ═══════════════════════════════════════════════════════ */
loadRestaurants();
