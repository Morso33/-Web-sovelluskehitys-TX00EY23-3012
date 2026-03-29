// main.js – Restaurant App (Assignment 6 refactor)
// Modular version: imports constants, utilities, and UI components
// from separate modules.
//
// ⚠  The API is only accessible from the Metropolia network or via VPN.

'use strict';

/* ═══════════════════════════════════════════════════════
   Imports
   ═══════════════════════════════════════════════════════ */
import { API_BASE, LANG }              from './variables.js';
import { fetchData, escapeHtml }       from './utils.js';
import { restaurantRow, restaurantModal } from './components.js';

/* ═══════════════════════════════════════════════════════
   State
   ═══════════════════════════════════════════════════════ */
let allRestaurants = [];   // full list from API

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

const hideStatus = () => {
  statusEl.className = 'status hidden';
};

/* ═══════════════════════════════════════════════════════
   Company badge helper
   ═══════════════════════════════════════════════════════ */
const badgeClass = (company = '') =>
  company.toLowerCase().includes('sodexo') ? 'badge-sodexo' : 'badge-compass';

/* ═══════════════════════════════════════════════════════
   Render helpers
   ═══════════════════════════════════════════════════════ */
/**
 * Re-renders the grid with the provided restaurant list.
 * @param {Object[]} restaurants
 */
const renderGrid = (restaurants) => {
  gridEl.innerHTML = '';

  if (restaurants.length === 0) {
    showStatus('No restaurants match your search.', 'info');
    return;
  }

  hideStatus();
  const fragment = document.createDocumentFragment();

  restaurants.forEach((restaurant) => {
    // Use the restaurantRow component to create the card element
    const card = restaurantRow(restaurant);

    // Attach interaction handlers here (keeps components.js pure/stateless)
    const openModal = () => showModal(restaurant);
    card.addEventListener('click', openModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });

    fragment.appendChild(card);
  });

  gridEl.appendChild(fragment);
};

/* ═══════════════════════════════════════════════════════
   Filtering
   ═══════════════════════════════════════════════════════ */
const getFiltered = () => {
  const query   = searchEl.value.toLowerCase().trim();
  const company = filterEl.value;

  return allRestaurants.filter((r) => {
    const matchSearch =
      !query ||
      r.name.toLowerCase().includes(query)    ||
      r.city.toLowerCase().includes(query)    ||
      r.address.toLowerCase().includes(query);

    const matchCompany = !company || r.company === company;

    return matchSearch && matchCompany;
  });
};

/* ═══════════════════════════════════════════════════════
   Modal – show restaurant details & fetch daily menu
   ═══════════════════════════════════════════════════════ */
const showModal = async (restaurant) => {
  const { _id, name, address, postalCode, city, phone, company } = restaurant;

  // Populate static info
  modalTitle.textContent = name;
  modalBadge.className   = `company-badge ${badgeClass(company)}`;
  modalBadge.textContent = company;
  modalAddr.textContent  = `${address}, ${postalCode}`;
  modalCity.textContent  = `📍 ${city}`;
  modalPhone.textContent = phone ? `📞 ${phone}` : '📞 N/A';

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
    const menu    = await fetchData(menuUrl);

    if (!menu.courses || menu.courses.length === 0) {
      modalMenu.innerHTML = '<p class="menu-empty">No menu available for today.</p>';
      return;
    }

    // Use the restaurantModal component to generate menu HTML
    modalMenu.innerHTML = restaurantModal(restaurant, menu);

  } catch (error) {
    console.error('Failed to load daily menu:', error);
    modalMenu.innerHTML = `
      <div class="menu-error">
        ⚠ Could not load today's menu. Make sure you are connected to the
        Metropolia network or VPN.<br><small>${escapeHtml(error.message)}</small>
      </div>
    `;
  }
};

const closeModal = () => {
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
};

/* ═══════════════════════════════════════════════════════
   Load restaurants (single AJAX call)
   ═══════════════════════════════════════════════════════ */
const loadRestaurants = async () => {
  showStatus('Loading restaurants…', 'loading');
  gridEl.innerHTML = '';

  try {
    const restaurants = await fetchData(`${API_BASE}/restaurants`);
    allRestaurants    = restaurants;
    renderGrid(allRestaurants);
  } catch (error) {
    console.error('Failed to load restaurants:', error);
    showStatus(
      `⚠ Could not load restaurants. Make sure you are connected to the ` +
      `Metropolia network or via VPN.\n\nTechnical detail: ${error.message}`,
      'error'
    );
  }
};

/* ═══════════════════════════════════════════════════════
   Event listeners
   ═══════════════════════════════════════════════════════ */
searchEl.addEventListener('input',  () => renderGrid(getFiltered()));
filterEl.addEventListener('change', () => renderGrid(getFiltered()));

modalClose.addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
});

/* ═══════════════════════════════════════════════════════
   Bootstrap
   ═══════════════════════════════════════════════════════ */
loadRestaurants();
