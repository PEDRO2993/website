#!/usr/bin/env bash
# Cria uma demo personalizada a partir de hotel-alpina/ em 1 comando.
# Uso: bash autopilot/business/demo-personalizar.sh "Hotel Bergsonne" "Saas-Fee" "3906" demos/bergsonne
set -euo pipefail
NAME="${1:?nome do hotel}"; VILLAGE="${2:?aldeia}"; PLZ="${3:?código postal}"; OUT="${4:?pasta de saída}"
SHORT="$(echo "$NAME" | sed -E 's/^Hotel //; s/^Hôtel //')"
mkdir -p "$OUT" && cp -r hotel-alpina/. "$OUT/"
find "$OUT" -type f \( -name '*.html' -o -name '*.js' \) -print0 | xargs -0 sed -i \
  -e "s/Hotel Alpina Grächen/$NAME $VILLAGE/g" -e "s/Alpina Grächen/$SHORT $VILLAGE/g" \
  -e "s/Grächen/$VILLAGE/g" -e "s/3925/$PLZ/g" -e "s/ALPINA/$(echo "$SHORT" | tr a-z A-Z)/g" -e "s/Alpina/$SHORT/g" \
  -e "s/hotelalpinagraechen\.ch/prstudio.ch\/demos/g" -e "s/+41279552600/+41270000000/g; s/027 955 26 00/027 000 00 00/g"
# marca de água "Demo"
sed -i 's|<body>|<body><div style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#C5A059;color:#0A0D12;font:600 12px/1.4 system-ui;text-align:center;padding:6px">DEMO · PR Studio · Vorschau für '"$NAME"' – unverbindlich</div>|' "$OUT/index.html"
echo "Demo criada em $OUT/index.html — substituir fotos em $OUT e publicar em prstudio.ch/demos/…"
