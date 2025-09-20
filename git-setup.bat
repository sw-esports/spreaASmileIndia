@echo off
echo ========================================
echo    SPREAD A SMILE INDIA - Git Setup
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo Or make sure Git is added to your PATH environment variable.
    echo.
    echo After installing Git, restart your computer and try again.
    echo.
    pause
    exit /b 1
)

echo Git is installed. Proceeding with setup...
echo.

echo Creating README.md...
echo # SPREAD A SMILE INDIA > README.md
echo ## NGO Website Project >> README.md
echo. >> README.md
echo A modern, responsive website for Spread A Smile India NGO. >> README.md
echo. >> README.md
echo ### Features: >> README.md
echo - Modern responsive design >> README.md
echo - Mobile-first approach >> README.md
echo - Interactive navigation >> README.md
echo - Donation system integration >> README.md
echo - Theme switching (Light/Dark) >> README.md
echo - GSAP animations >> README.md
echo. >> README.md
echo ### Tech Stack: >> README.md
echo - Node.js ^& Express.js >> README.md
echo - EJS templating >> README.md
echo - CSS3 with advanced animations >> README.md
echo - JavaScript ES6+ >> README.md
echo - Font Awesome ^& BoxIcons >> README.md
echo - Google Fonts >> README.md
echo. >> README.md
echo ### Development: >> README.md
echo npm install >> README.md
echo npm start >> README.md
echo. >> README.md
echo Website will be available at: http://localhost:3002 >> README.md

echo Initializing Git repository...
git init 2>&1
if errorlevel 1 (
    echo ERROR: Failed to initialize Git repository!
    pause
    exit /b 1
)

echo Adding files to Git...
git add . 2>&1
if errorlevel 1 (
    echo ERROR: Failed to add files!
    pause
    exit /b 1
)

echo Creating first commit...
git commit -m "feat: Initial commit - Complete header with responsive navbar, mobile sidebar, and micro-interactions" 2>&1
if errorlevel 1 (
    echo ERROR: Failed to create commit!
    pause
    exit /b 1
)

echo Setting main branch...
git branch -M main 2>&1
if errorlevel 1 (
    echo ERROR: Failed to set main branch!
    pause
    exit /b 1
)

echo Adding remote origin...
git remote add origin https://github.com/sw-esports/SPREAD-A-SMILE-INDIA.git 2>&1
if errorlevel 1 (
    echo ERROR: Failed to add remote origin!
    pause
    exit /b 1
)

echo Pushing to GitHub...
git push -u origin main 2>&1
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub!
    echo Make sure you have internet connection and GitHub access.
    echo You may need to authenticate with GitHub.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Setup Complete! Repository created.
echo ========================================
pause