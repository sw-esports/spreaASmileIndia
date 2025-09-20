@echo off
echo ========================================
echo    SPREAD A SMILE INDIA - Quick Push
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
    pause
    exit /b 1
)

REM Check if this is a Git repository
if not exist ".git" (
    echo ERROR: This is not a Git repository!
    echo.
    echo Please run git-setup.bat first to initialize the repository.
    echo.
    pause
    exit /b 1
)

set /p commit_msg="Enter commit message: "

if "%commit_msg%"=="" (
    set commit_msg=Update: General improvements and fixes
)

echo.
echo Adding all changes...
git add . 2>&1
if errorlevel 1 (
    echo ERROR: Failed to add files!
    pause
    exit /b 1
)

echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%" 2>&1
if errorlevel 1 (
    echo ERROR: Failed to commit! (Maybe no changes to commit?)
    pause
    exit /b 1
)

echo Pushing to GitHub...
git push origin main 2>&1
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub!
    echo Make sure you have internet connection and GitHub access.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Push Complete Successfully!
echo ========================================
echo.
pause