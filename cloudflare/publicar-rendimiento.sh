#!/bin/bash
# Publica SOLO el dashboard (index.html, rendimiento.html, su JSON y el logo) en Cloudflare.
# Necesita CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID (en la Mac: cloudflare/lofton.env;
# en GitHub Actions: secretos del repo).
set -euo pipefail
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$RAIZ/cloudflare/lofton.env" ] && { set -a; . "$RAIZ/cloudflare/lofton.env"; set +a; }
SALIDA="$RAIZ/cloudflare/rendimiento/publicar"
rm -rf "$SALIDA"; mkdir -p "$SALIDA/data" "$SALIDA/Lofton Logos"
cp "$RAIZ/index.html" "$RAIZ/rendimiento.html" "$SALIDA/"
cp "$RAIZ/data/rendimiento.json" "$SALIDA/data/"
cp "$RAIZ/Lofton Logos/Logo blanco .png" "$SALIDA/Lofton Logos/"
echo "Not found" > "$SALIDA/404.html"
cd "$RAIZ/cloudflare/rendimiento"
npx --yes wrangler@4 deploy
