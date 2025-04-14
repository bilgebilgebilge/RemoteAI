@echo off
echo AutoTech AI Destekli Uzaktan Erisim Cozumu Kurulumu
echo ------------------------------------------------------
echo.

echo Paketler yukleniyor, lutfen bekleyin...
echo.

cd server
echo Server paketleri yukleniyor...
call npm install
cd ..

cd client
echo Client paketleri yukleniyor...
call npm install
cd ..

echo.
echo Kurulum tamamlandi!
echo start.bat dosyasini calistirarak uygulamayi baslatin.
echo.
pause