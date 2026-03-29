// Assignment 5 – Restaurant App
// Fetches restaurant data from the Metropolia Student Restaurant API,
// renders a filterable grid of cards, and shows the current day's menu
// in a modal when a card is clicked.
//
// ⚠  The API is only accessible from the Metropolia network or via VPN.

'use strict';

/* ═══════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════ */
const API_BASE = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
const LANG     = 'en';  // menu language: 'en' or 'fi'

/* ═══════════════════════════════════════════════════════
   State
   ═══════════════════════════════════════════════════════ */
let allRestaurants = [];   // full list from API

/* ═══════════════════════════════════════════════════════
   DOM refs
   ═══════════════════════════════════════════════════════ */
const statusEl    = document.getElementById('status');
const gridEl      = document.getElementById('restaurant-grid');
const searchEl    = document.getElementById('search');
const filterEl    = document.getElementById('company-filter');
const overlay     = document.getElementById('modal-overlay');
const modalClose  = document.getElementById('modal-close');
const modalTitle  = document.getElementById('modal-title');
const modalBadge  = document.getElementById('modal-company-badge');
const modalAddr   = document.getElementById('modal-address');
const modalCity   = document.getElementById('modal-city');
const modalPhone  = document.getElementById('modal-phone');
const modalMenu   = document.getElementById('modal-menu');

/* ═══════════════════════════════════════════════════════
   Generic Fetch helper  (re-used from Assignment 4)
   ═══════════════════════════════════════════════════════ */
/**
 * Fetches `url`, throws on non-2xx, returns parsed JSON.
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} – ${url}`
    );
  }
  return response.json();
}

/* ═══════════════════════════════════════════════════════
   Status banner helpers
   ═══════════════════════════════════════════════════════ */
function showStatus(message, type /* 'loading' | 'error' | 'info' */) {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function hideStatus() {
  statusEl.className = 'status hidden';
}

/* ═══════════════════════════════════════════════════════
   Company badge helper
   ═══════════════════════════════════════════════════════ */
function badgeClass(company = '') {
  return company.toLowerCase().includes('sodexo') ? 'badge-sodexo' : 'badge-compass';
}

function cardClass(company = '') {
  return company.toLowerCase().includes('sodexo') ? 'sodexo' : 'compass';
}

/* ═══════════════════════════════════════════════════════
   Render helpers
   ═══════════════════════════════════════════════════════ */
/**
 * Builds and returns a restaurant card element.
 * @param {Object} restaurant
 */
function createCard(restaurant) {
  const { _id, name, address, postalCode, city, phone, company } = restaurant;

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

  // Click & keyboard activation
  const openModal = () => showModal(restaurant);
  card.addEventListener('click', openModal);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });

  return card;
}

/**
 * Re-renders the grid based on the current search/filter values.
 */
function renderGrid(restaurants) {
  gridEl.innerHTML = '';

  if (restaurants.length === 0) {
    showStatus('No restaurants match your search.', 'info');
    return;
  }

  hideStatus();
  const fragment = document.createDocumentFragment();
  restaurants.forEach(r => fragment.appendChild(createCard(r)));
  gridEl.appendChild(fragment);
}

/* ═══════════════════════════════════════════════════════
   Filtering
   ═══════════════════════════════════════════════════════ */
function getFiltered() {
  const query   = searchEl.value.toLowerCase().trim();
  const company = filterEl.value;

  return allRestaurants.filter(r => {
    const matchSearch =
      !query ||
      r.name.toLowerCase().includes(query) ||
      r.city.toLowerCase().includes(query) ||
      r.address.toLowerCase().includes(query);

    const matchCompany = !company || r.company === company;

    return matchSearch && matchCompany;
  });
}

/* ═══════════════════════════════════════════════════════
   Modal – show restaurant details & fetch daily menu
   ═══════════════════════════════════════════════════════ */
async function showModal(restaurant) {
  const { _id, name, address, postalCode, city, phone, company } = restaurant;

  // Populate static info
  modalTitle.textContent = name;
  modalBadge.className   = `company-badge ${badgeClass(company)}`;
  modalBadge.textContent  = company;
  modalAddr.textContent   = `${address}, ${postalCode}`;
  modalCity.textContent   = `📍 ${city}`;
  modalPhone.textContent  = phone ? `📞 ${phone}` : '📞 N/A';

  // Show loading state in menu area
  modalMenu.innerHTML = `
    <div class="menu-loading">
      <div class="spinner"></div>
      Loading today's menu…
    </div>
  `;

  // Open overlay
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  modalClose.focus();

  // Fetch daily menu
  try {
    const menuUrl = `${API_BASE}/restaurants/daily/${_id}/${LANG}`;
    const data    = await fetchData(menuUrl);

    if (!data.courses || data.courses.length === 0) {
      modalMenu.innerHTML = `<p class="menu-empty">No menu available for today.</p>`;
      return;
    }

    modalMenu.innerHTML = '';
    const fragment = document.createDocumentFragment();

    data.courses.forEach(course => {
      const item = document.createElement('div');
      item.className = 'course-card';
      item.innerHTML = `
        <p class="course-name">${escapeHtml(course.name || '—')}</p>
        ${course.price  ? `<p class="course-price">${escapeHtml(course.price)}</p>` : ''}
        ${course.diets  ? `<p class="course-diets">🥗 ${escapeHtml(course.diets)}</p>` : ''}
      `;
      fragment.appendChild(item);
    });

    modalMenu.appendChild(fragment);

  } catch (error) {
    console.error('Failed to load daily menu:', error);
    modalMenu.innerHTML = `
      <div class="menu-error">
        ⚠ Could not load today's menu. Make sure you are connected to the
        Metropolia network or VPN.<br><small>${escapeHtml(error.message)}</small>
      </div>
    `;
  }
}

function closeModal() {
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════════
   Load restaurants (single AJAX call)
   ═══════════════════════════════════════════════════════ */
async function loadRestaurants() {
  showStatus('Loading restaurants…', 'loading');
  gridEl.innerHTML = '';

  try {
    // Single AJAX call to fetch all restaurants
    const restaurants = await fetchData(`${API_BASE}/restaurants`);
    allRestaurants = restaurants;
    renderGrid(allRestaurants);
  } catch (error) {
    console.error('Failed to load restaurants:', error);
    showStatus(
      `⚠ Could not load restaurants. Make sure you are connected to the ` +
      `Metropolia network or via VPN.\n\nTechnical detail: ${error.message}`,
      'error'
    );
  }
}

/* ═══════════════════════════════════════════════════════
   Utility – basic XSS guard
   ═══════════════════════════════════════════════════════ */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════════════════════
   Event listeners
   ═══════════════════════════════════════════════════════ */
// Live search
searchEl.addEventListener('input', () => renderGrid(getFiltered()));

// Company filter
filterEl.addEventListener('change', () => renderGrid(getFiltered()));

// Close modal – button
modalClose.addEventListener('click', closeModal);

// Close modal – overlay backdrop click
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

// Close modal – Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
});

/* ═══════════════════════════════════════════════════════
   Bootstrap
   ═══════════════════════════════════════════════════════ */
loadRestaurants();
