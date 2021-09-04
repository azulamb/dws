# DenoWebServer

Simple static web server made by Deno.

## Exec

```sh
deno run --allow-read --allow-net --allow-env ./src/server.ts
```

## Sample config.json

```json
{
	"http": {
		"post": 8080,
		"hostname": "localhost"
	},
	"docs": "./docs",
	"mime": {
		".htm": "text/html",
		"jpeg": "image/jpeg"
	},
	"headers": {
		"X-CODE": "XXXXXXXXXXXXXXXX"
	},
	"indexes": [
		"index.html"
	]
}
```

### Set config

```sh
DWS_CONFIG=config.json deno run --allow-read --allow-net --allow-env ./src/server.ts
```

## Sample config ENV

```
DWS_PORT=8000 deno run --allow-read --allow-net --allow-env ./src/server.ts
```

### ENV list

* DWS_PORT
* DWS_DOCS
* DWS_DEBUG

## Debug Mode

Set ENV `DWS_DEBUG` .
