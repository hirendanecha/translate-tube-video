if [[ $VERCEL_GIT_COMMIT_REF == "main" ]]; then
  echo "This is our production branch"
  npm run build
elif [[ $VERCEL_GIT_COMMIT_REF == "develop" ]]; then
  echo "This is our develop branch"
  npm run build:dev
fi 