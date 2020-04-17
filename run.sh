if [[ "$ENVIRONMENT" != "dev" ]]; then
  npm run watch:dev
fi

if [[ "$ENVIRONMENT" != "prod" ]]; then
  npm run prod
fi