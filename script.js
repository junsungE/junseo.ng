(function () {
  const canonical = '/WTmcid';
  const p = window.location.pathname || '/';
  // normalize trailing slash and compare case-insensitively
  const norm = p.replace(/\/+$/, '').toLowerCase();
  const canonNorm = canonical.replace(/\/+$/, '').toLowerCase();

  if (norm === canonNorm && p !== canonical) {
    // preserve search and hash, replace history so back doesn't loop
    window.location.replace(canonical + window.location.search + window.location.hash);
  }
})();