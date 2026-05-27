@echo off
cd /d "%~dp0"
git add .
git commit -m "update %DATE% %TIME%"
git push
echo.
echo  Pushed. GitHub Actions is building + deploying now.
echo  Watch progress: https://github.com/aikitbuilds/preprigs/actions
echo.
pause
