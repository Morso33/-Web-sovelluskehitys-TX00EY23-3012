// Assignment 1 – GET Method
// Fetches a user from the Reqres API and logs the response to the console.

const API_KEY = 'reqres-free-v1';
const REQUEST_URL = 'https://reqres.in/api/users/1';

/**
 * Fetches user #1 from the Reqres API using async/await.
 * Logs the full response data object to the browser console.
 */
async function getUser() {
  const btn = document.getElementById('btn-fetch');
  const output = document.getElementById('output');

  btn.disabled = true;
  btn.textContent = 'Fetching…';
  output.classList.add('hidden');

  const response = await fetch(REQUEST_URL, {
    headers: {
      'x-api-key': API_KEY,
    },
  });

  const data = await response.json();

  // ── Required: log response data to the console ──────────────
  console.log('Response data:', data);

  // ── Display in the page as well for easy inspection ─────────
  output.textContent = JSON.stringify(data, null, 2);
  output.classList.remove('hidden');

  btn.disabled = false;
  btn.textContent = 'Fetch User #1';
}

document.getElementById('btn-fetch').addEventListener('click', getUser);
