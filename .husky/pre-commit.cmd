@echo off
npx --no-install lint-staged
exit /b %ERRORLEVEL%