@echo off
echo AutoTech AI Destekli Uzaktan Erisim Cozumu Baslatiliyor
echo -------------------------------------------------------
echo.

start cmd /k "cd server && npm install && npm start"
timeout /t 5
start cmd /k "cd client && npm install && npm start"

echo.
echo Server ve client baslatildi!
echo Client otomatik olarak tarayicida acilacaktir.
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
pause