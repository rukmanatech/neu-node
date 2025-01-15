@echo off
cd "%~dp0"
node server.js > backend.log 2>&1
