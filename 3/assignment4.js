// Assignment 4 – Generic Fetch Function
// Defines a reusable fetchData(url, options) helper and tests it with
// both a successful POST and an intentional 404 error.

const API_KEY = 'reqres-free-v1';

// ── fetchData – reusable async helper ───────────────────────────────────────
/**
 * Makes an HTTP request to `url` with the given `options`.
 *
 * @param {string} url     - The endpoint to request.
 * @param {RequestInit} options - Optional fetch options (method, headers, body…).
 * @returns {Promise<any>} - The parsed JSON response on success.
 * @throws {Error}         - Throws if the response status is not in the 2xx range.
 */
async function fetchData(url, options = {}) {
  // Inject the API key into every request automatically.
  const mergedOptions = {
    ...options,
    headers: {
      'x-api-key': API_KEY,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, mergedOptions);

  // Throw on non-2xx status so callers can rely on try/catch.
  if (!response.ok) {
    throw new Error(
      `Request failed – URL: ${url} | Status: ${response.status} ${response.statusText}`
    );
  }

  // Return the JSON promise as required by the assignment.
  return response.json();
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function setOutput(text, type /* 'success' | 'error' */) {
  const el = document.getElementById('output');
  el.className = type;          // removes 'hidden' as a side-effect
  el.textContent = text;
}

function setButtons(disabled) {
  document.getElementById('btn-success').disabled = disabled;
  document.getElementById('btn-error').disabled   = disabled;
}

// ── Test 1 – Successful POST ─────────────────────────────────────────────────
async function runSuccessCase() {
  setButtons(true);
  setOutput('Fetching…', 'success');

  try {
    const user = {
      name: 'John Doe',
      job: 'Developer',
    };
    const url = 'https://reqres.in/api/users';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };

    const userData = await fetchData(url, options);
    console.log(userData);                             // Required log

    setOutput(
      '✓ Success\n\n' + JSON.stringify(userData, null, 2),
      'success'
    );
  } catch (error) {
    console.error('An error occurred:', error);        // Required error log
    setOutput('✗ ' + error.message, 'error');
  }

  setButtons(false);
}

// ── Test 2 – Intentional error (404) ─────────────────────────────────────────
async function runErrorCase() {
  setButtons(true);
  setOutput('Fetching…', 'error');

  try {
    const url = 'https://reqres.in/api/unknown/23';   // Does not exist → 404
    const userData = await fetchData(url);
    console.log(userData);
    setOutput('✓ ' + JSON.stringify(userData, null, 2), 'success');
  } catch (error) {
    console.error('An error occurred:', error);        // Required error log
    setOutput(
      '✗ Error caught by try/catch\n\n' + error.message +
      '\n\nSee the browser console for details.',
      'error'
    );
  }

  setButtons(false);
}

// ── Event listeners ──────────────────────────────────────────────────────────
document.getElementById('btn-success').addEventListener('click', runSuccessCase);
document.getElementById('btn-error').addEventListener('click', runErrorCase);
