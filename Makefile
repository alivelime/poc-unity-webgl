
prepare:
	npm i -g ngrok

serve:
	cd deploy && serve
	# cd deploy && python -m http.server 8080 # gzipのヘッダーに対応していない

tunnel:
	ngrok http ${PORT} -host-header=localhost
	# cloudflared tunnel --http-host-header=localhost --url localhost:${PORT}

modified:
	cp deploy/StreamingAssets/js/*.js Assets/StreamingAssets/js/
