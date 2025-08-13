#!/bin/bash

PLUGINS=("azure-devbox" "azure-devbox-backend" "scaffolder-backend-module-azure-devbox")

DYNAMIC_PLUGIN_ROOT_DIR=./deploy
mkdir -p "$DYNAMIC_PLUGIN_ROOT_DIR"

echo ""
echo "Empacotando plugins estáticos"
echo "=============================="
echo ""

printf "%-30s | %-64s\n" "Plugin" "Hash de Integridade (sha512)"
printf '%.0s-' {1..100}
echo ""

for PLUGIN_NAME in "${PLUGINS[@]}"; do
  PLUGIN_PATH="plugins/$PLUGIN_NAME/dist-dynamic"

  if [ ! -d "$PLUGIN_PATH" ]; then
    printf "%-30s | %s\n" "$PLUGIN_NAME" "Diretório não encontrado"
    continue
  fi

  HASH=$(npm pack "$PLUGIN_PATH" --pack-destination "$DYNAMIC_PLUGIN_ROOT_DIR" --json | jq -r '.[0].integrity')
  printf "%-30s | %-64s\n" "$PLUGIN_NAME" "$HASH"
done

echo ""
echo "Arquivos gerados no diretório: $DYNAMIC_PLUGIN_ROOT_DIR"
ls -1 "$DYNAMIC_PLUGIN_ROOT_DIR"
echo ""
