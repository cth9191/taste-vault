@echo off
cd /d "%~dp0"
start "" http://127.0.0.1:4610/?v=2
python server.py --port 4610
