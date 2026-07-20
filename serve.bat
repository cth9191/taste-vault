@echo off
cd /d "%~dp0"
start "" http://localhost:4610
python -m http.server 4610
