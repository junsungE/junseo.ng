from flask import Flask, request, jsonify
import requests
import re

app = Flask(__name__)


@app.route('/fetch-title')
def fetch_title():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'missing url parameter'}), 400
    try:
        r = requests.get(url, timeout=6, headers={'User-Agent': 'wt-mc-id-link-generator/1.0'})
        r.raise_for_status()
        m = re.search(r'<title>([\s\S]*?)</title>', r.text, re.IGNORECASE)
        title = m.group(1).strip() if m else ''
        return jsonify({'title': title})
    except Exception as e:
        return jsonify({'error': str(e)}), 502


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
