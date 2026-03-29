// Assignment 3 – Error Handling
// Makes a GET request to a non-existent URL and handles errors with try/catch.

const API_KEY = 'reqres-free-v1';
const REQUEST_URL = 'https://reqres.in/api/unknown/23'; // 404 – does not exist

/**
 * Attempts a GET request to a non-existent resource.
 * Uses try/catch to handle both HTTP-level errors (non-2xx status)
 * and network-level errors.
 */
async function fetchNonExistent() {
  const btn    = document.getElementById('btn-fetch');
  const result = document.getElementById('result');

  btn.disabled = true;
  btn.textContent = 'Fetching…';
  result.className = 'hidden';

  try {
    const response = await fetch(REQUEST_URL, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    // fetch() only rejects on network failures; a 404 still resolves.
    // We must explicitly check the status and throw if it is not OK.
    if (!response.ok) {
      throw new Error(`HTTP error – status: ${response.status} ${response.statusText}`);
    }

    // This line is only reached if the response is somehow successful.
    const data = await response.json();
    console.log('Response data:', data);

    result.className = 'success';
    result.textContent = JSON.stringify(data, null, 2);

  } catch (error) {
    // ── Required: log error message to the console ───────────────
    console.error('Error occurred:', error.message);

    result.className = 'error';
    result.innerHTML =
      `<strong>⚠ Error caught in catch block</strong><br>` +
      `${error.message}<br><br>` +
      `<em>Check the browser console for the full error log.</em>`;
  }

  result.classList.remove('hidden');
  btn.disabled = false;
  btn.textContent = 'Try Request';
}

document.getElementById('btn-fetch').addEventListener('click', fetchNonExistent);
