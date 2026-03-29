const target = document.getElementById('target');

// 1. Browser name and version
const userAgent = navigator.userAgent;
let browserName = 'Unknown';
let browserVersion = 'Unknown';

if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
  browserName = 'Google Chrome';
  browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] ?? 'Unknown';
} else if (userAgent.includes('Firefox')) {
  browserName = 'Mozilla Firefox';
  browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] ?? 'Unknown';
} else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
  browserName = 'Apple Safari';
  browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] ?? 'Unknown';
} else if (userAgent.includes('Edg')) {
  browserName = 'Microsoft Edge';
  browserVersion = userAgent.match(/Edg\/(\d+)/)?.[1] ?? 'Unknown';
}

// 2. Operating system
let os = 'Unknown';
if (userAgent.includes('Windows')) os = 'Windows';
else if (userAgent.includes('Mac OS X')) os = 'macOS';
else if (userAgent.includes('Linux')) os = 'Linux';
else if (userAgent.includes('Android')) os = 'Android';
else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

// 3. Screen width and height
const screenWidth = screen.width;
const screenHeight = screen.height;

// 4. Available screen space
const availWidth = screen.availWidth;
const availHeight = screen.availHeight;

// 5. Current date and time with Finnish localization
const now = new Date();
const dateStr = now.toLocaleDateString('fi-FI', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const timeStr = now.toLocaleTimeString('fi-FI', {
  hour: '2-digit',
  minute: '2-digit',
});

target.innerHTML = `
  <p>Selain: ${browserName}, versio ${browserVersion}</p>
  <p>Käyttöjärjestelmä: ${os}</p>
  <p>Näytön koko: ${screenWidth} × ${screenHeight} px</p>
  <p>Käytettävissä oleva näyttötila: ${availWidth} × ${availHeight} px</p>
  <p>Päivämäärä: ${dateStr}</p>
  <p>Aika: ${timeStr}</p>
`;
