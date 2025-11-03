// Basic DOM refs
const STORAGE_KEY = 'wt_mc_id_saved';
const idInput = document.getElementById('idInput');
const clearIdBtn = document.getElementById('clearId');
const urlInput = document.getElementById('urlInput');
const clearUrlBtn = document.getElementById('clearUrl');
const generateBtn = document.getElementById('generate');
const siteAnchor = document.getElementById('siteAnchor');
const output = document.getElementById('output');
const copiedLabel = document.getElementById('copied');
const copyBtn = document.getElementById('copy');

// Load saved ID
function loadSavedId() {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v) idInput.value = v;
}

loadSavedId();

// Initial control state
function resetControls() {
  generateBtn.disabled = true;
  if (siteAnchor) siteAnchor.hidden = true;
  const resultSection = document.querySelector('.result');
  if (resultSection) resultSection.hidden = true;
}

resetControls();
// ensure controls reflect loaded values
updateControls();

// Save ID whenever changed
idInput.addEventListener('input', () => {
  const v = idInput.value.trim();
  if (v) localStorage.setItem(STORAGE_KEY, v);
  else localStorage.removeItem(STORAGE_KEY);
  updateControls();
});
// also handle paste/change
idInput.addEventListener('change', updateControls);
idInput.addEventListener('paste', () => setTimeout(updateControls, 50));

  clearIdBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  idInput.value = '';
  idInput.focus();
  updateControls();
  clearGenerated();
});

if (clearUrlBtn) {
  clearUrlBtn.addEventListener('click', () => {
    urlInput.value = '';
    urlInput.focus();
    updateControls();
  clearGenerated();
  });
}

// ensure url input updates controls on input/paste/change
urlInput.addEventListener('input', updateControls);
urlInput.addEventListener('change', updateControls);
urlInput.addEventListener('paste', () => setTimeout(updateControls, 50));

function clearGenerated() {
  output.value = '';
  if (copyBtn) copyBtn.disabled = true;
  if (siteAnchor) {
    siteAnchor.hidden = true;
    siteAnchor.href = '#';
    siteAnchor.textContent = '';
  }
  const resultSection = document.querySelector('.result');
  if (resultSection) resultSection.hidden = true;
  autoGrow();
}

function removeLocaleFromPath(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      const first = parts[0].toLowerCase();
      if (/^[a-z]{2}(-[a-z]{2})?$/.test(first)) parts.shift();
    }
    u.pathname = '/' + parts.join('/');
    return u.toString();
  } catch (e) {
    return url;
  }
}

function appendWtMcId(url, id) {
  try {
    const u = new URL(url);
    u.search = (u.search ? u.search + '&' : '?') + 'WT.mc_id=' + encodeURIComponent(id);
    return u.toString();
  } catch (e) {
    if (!url) return '';
    const hasQuery = url.includes('?');
    return url + (hasQuery ? '&' : '?') + 'WT.mc_id=' + encodeURIComponent(id);
  }
}

// Auto-grow textarea to fit content
function autoGrow() {
  if (!output) return;
  // reset height to compute scrollHeight
  output.style.height = 'auto';
  const scroll = output.scrollHeight;
  // set a max height to avoid huge growth
  const max = Math.max(120, window.innerHeight - 300);
  output.style.height = Math.min(scroll + 6, max) + 'px';
}

// Ensure textarea grows responsively
window.addEventListener('resize', autoGrow);

function generate() {
  // reveal result section and populate below
  const id = idInput.value.trim();
  const rawUrl = urlInput.value.trim();
  if (!id) {
    output.value = '';
    idInput.focus();
    return;
  }
  if (!rawUrl) {
    output.value = '';
    urlInput.focus();
    return;
  }

  const noLocale = removeLocaleFromPath(rawUrl);
  const result = appendWtMcId(noLocale, id);

  output.value = result;
  // reveal result section and site anchor
  const resultSection = document.querySelector('.result');
  if (resultSection) resultSection.hidden = false;
  if (siteAnchor) siteAnchor.hidden = false;
  if (copyBtn) copyBtn.disabled = false;
  autoGrow();

  // populate siteAnchor friendly name
  siteAnchor.href = result;
  try {
    const parsed = new URL(result);
    siteAnchor.textContent = parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
  } catch (e) {
    siteAnchor.textContent = result;
  }
}

generateBtn.addEventListener('click', generate);

// Allow pressing Enter in URL input to generate
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') generate();
});

// Copy generated URL to clipboard
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    if (!output.value) return;
    try {
      await navigator.clipboard.writeText(output.value);
      if (copiedLabel) {
        copiedLabel.style.opacity = '1';
        setTimeout(() => (copiedLabel.style.opacity = '0'), 1500);
      }
    } catch (e) {
      // fallback
      output.select();
      document.execCommand('copy');
      if (copiedLabel) {
        copiedLabel.style.opacity = '1';
        setTimeout(() => (copiedLabel.style.opacity = '0'), 1500);
      }
    }
  });
}

function updateControls() {
  const hasId = !!idInput.value.trim();
  const hasUrl = !!urlInput.value.trim();
  generateBtn.disabled = !(hasId && hasUrl);
}
