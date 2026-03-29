// Assignment 2 – POST Method
// Creates a new user on the Reqres API and logs the response to the console.

const API_KEY = 'reqres-free-v1';
const REQUEST_URL = 'https://reqres.in/api/users';

/**
 * Sends a POST request to create a new user, then logs the response data.
 */
async function createUser() {
  const btn = document.getElementById('btn-post');
  const output = document.getElementById('output');

  const name = document.getElementById('name').value.trim();
  const job  = document.getElementById('job').value.trim();

  if (!name || !job) {
    output.textContent = 'Please fill in both Name and Job fields.';
    output.classList.remove('hidden');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Creating…';

  // ── JSON payload ─────────────────────────────────────────────
  const payload = { name, job };

  const response = await fetch(REQUEST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  // ── Required: log response data to the console ───────────────
  console.log('Response data:', data);

  output.textContent = JSON.stringify(data, null, 2);
  output.classList.remove('hidden');

  btn.disabled = false;
  btn.textContent = 'Create User';
}

document.getElementById('btn-post').addEventListener('click', createUser);
