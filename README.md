# junseo.ng


# WT.mc_id Link Generator

Simple static web app to append a WT.mc_id contributor ID to a given URL. It removes lang-locale path segments (like `/en-us/`) before adding the ID, and it remembers the ID in localStorage.

Files
- `index.html` — main page
- `script.js` — client-side logic
- `styles.css` — basic styles

How to use

1. Open `index.html` in a browser.
2. Enter your ID in the top input (only the part after `?WT.mc_id=`).
3. Enter the URL you want to add your ID.
4. Click Generate. Copy the generated URL.

Notes
- If the URL already contains a query string, the ID will be appended with `&`.
- Your ID is stored in the browser's localStorage until you clear it.

<br>
Server-side title fetch (optional)

If you want to reliably get the remote page 'title' (the client-side fetch can fail due to CORS), there's a tiny Flask proxy included:

- `server.py` — simple Flask app exposing `/fetch-title?url=<url>` which returns JSON `{ "title": "..." }`.
- `requirements.txt` — dependencies for the server.

To run the proxy locally:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python server.py
```

Then the client can call `http://localhost:5000/fetch-title?url=...` to get the title. I didn't wire the client to use it automatically to avoid adding a hardcoded origin, but I can wire it to use a configurable proxy URL if you want.

<br>
<a href="mailto:junsungE@studentambassadors.com?subject=WT.mc_id Link Generator Feedback" style="text-decoration:none"><button id="feedback" title="Send feedback">Feedback</button></a>