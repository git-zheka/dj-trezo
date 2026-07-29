@echo off
cd /d "C:\DJ TREZO"
echo.
echo  ================================
echo  DJ TREZO — Запуск сайту
echo  ================================
echo.
echo  Сайт: http://localhost:3000
echo  Адмін: http://localhost:3000/admin
echo  Пароль: trezo2024
echo.
if not exist "node_modules" (
  echo  Встановлення залежностей (перший раз)...
  npm install
  echo.
)
npm run dev
