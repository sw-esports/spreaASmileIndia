# Simple Git Operations for SPREAD A SMILE INDIA
# Run this in PowerShell for better Git support

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    SPREAD A SMILE INDIA - Git Helper" -ForegroundColor Yellow  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is available
try {
    $gitVersion = git --version 2>$null
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Git is not installed or not in PATH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Then restart PowerShell and try again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if this is a Git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ This is not a Git repository!" -ForegroundColor Red
    Write-Host ""
    $init = Read-Host "Do you want to initialize Git repository? (y/n)"
    
    if ($init -eq "y" -or $init -eq "Y") {
        Write-Host "Initializing Git repository..." -ForegroundColor Yellow
        git init
        
        Write-Host "Creating README.md..." -ForegroundColor Yellow
        @"
# SPREAD A SMILE INDIA
## NGO Website Project

A modern, responsive website for Spread A Smile India NGO.

### Features:
- ✨ Modern responsive design
- 📱 Mobile-first approach  
- 🧭 Interactive navigation
- 💖 Donation system integration
- 🌙 Theme switching (Light/Dark)
- 🎬 GSAP animations

### Tech Stack:
- Node.js & Express.js
- EJS templating
- CSS3 with advanced animations
- JavaScript ES6+
- Font Awesome & BoxIcons
- Google Fonts

### Development:
``````bash
npm install
npm start
``````

Website will be available at: http://localhost:3002

### Project Structure:
- `/views` - EJS templates
- `/public` - Static assets (CSS, JS, images)
- `/routes` - Express.js routes
- `/copilot-instructions.md` - Development guidelines
"@ | Out-File -FilePath "README.md" -Encoding UTF8
        
        Write-Host "Adding remote origin..." -ForegroundColor Yellow
        git remote add origin https://github.com/sw-esports/SPREAD-A-SMILE-INDIA.git
        
        Write-Host "Repository initialized!" -ForegroundColor Green
    } else {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 1
    }
}

# Get commit message
$message = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($message)) {
    $message = "Update: General improvements and fixes"
}

Write-Host ""
Write-Host "🔄 Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host "📝 Committing: $message" -ForegroundColor Yellow
git commit -m $message

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Failed to push. You may need to authenticate with GitHub." -ForegroundColor Red
    Write-Host "Try running: git push origin main" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"