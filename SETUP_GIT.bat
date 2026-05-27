@echo off
cd /d "%~dp0"
echo.
echo  PrepRigs — One-time Git Setup
echo  ─────────────────────────────────────────────

git init
git add .
git commit -m "init: PrepRigs site"

echo.
echo  Pushing to GitHub...
git remote add origin https://github.com/aikitbuilds/preprigs.git
git branch -M main
git push -u origin main

echo.
echo  Done! Repo is live at:
echo    https://github.com/michaelcongtran/preprigs
echo.
echo  Next: add FIREBASE_SERVICE_ACCOUNT secret in GitHub repo settings.
echo  https://github.com/michaelcongtran/preprigs/settings/secrets/actions
echo.
pause
