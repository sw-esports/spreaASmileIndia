# SPREAD A SMILE INDIA - Git Operations Script

function Show-Header {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "    SPREAD A SMILE INDIA - Git Tools" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Initialize-Repository {
    Show-Header
    Write-Host "Setting up GitHub repository..." -ForegroundColor Green
    
    # Create README.md
    Write-Host "Creating README.md..." -ForegroundColor Yellow
    @"
# SPREAD A SMILE INDIA
## NGO Website Project

A modern, responsive website for Spread A Smile India NGO.

### Features:
- Modern responsive design
- Mobile-first approach  
- Interactive navigation
- Donation system integration
- Theme switching (Light/Dark)
- GSAP animations

### Tech Stack:
- Node.js & Express.js
- EJS templating
- CSS3 with advanced animations
- JavaScript ES6+
- Font Awesome & BoxIcons
- Google Fonts

### Development:
```bash
npm install
npm start
```

Website will be available at: http://localhost:3002
"@ | Out-File -FilePath "README.md" -Encoding UTF8
    
    # Git operations
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    
    Write-Host "Adding files..." -ForegroundColor Yellow
    git add .
    
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "feat: Initial commit - Complete header with responsive navbar, mobile sidebar, and micro-interactions"
    
    Write-Host "Setting main branch..." -ForegroundColor Yellow
    git branch -M main
    
    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    git remote add origin https://github.com/sw-esports/SPREAD-A-SMILE-INDIA.git
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host "" 
    Write-Host "Repository setup complete!" -ForegroundColor Green
}

function Quick-Push {
    param(
        [string]$Message = "Update: General improvements and fixes"
    )
    
    Show-Header
    Write-Host "Quick push to GitHub..." -ForegroundColor Green
    
    if (-not $Message -or $Message -eq "") {
        $Message = Read-Host "Enter commit message (or press Enter for default)"
        if (-not $Message) {
            $Message = "Update: General improvements and fixes"
        }
    }
    
    Write-Host "Adding all changes..." -ForegroundColor Yellow
    git add .
    
    Write-Host "Committing: $Message" -ForegroundColor Yellow
    git commit -m $Message
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "Push complete!" -ForegroundColor Green
}

function Show-Status {
    Show-Header
    Write-Host "Git Status:" -ForegroundColor Green
    git status
    Write-Host ""
    Write-Host "Recent Commits:" -ForegroundColor Green
    git log --oneline -5
}

# Main menu
function Show-Menu {
    Show-Header
    Write-Host "Select an option:" -ForegroundColor White
    Write-Host "1. Initialize Repository (first time only)" -ForegroundColor Cyan
    Write-Host "2. Quick Commit & Push" -ForegroundColor Cyan
    Write-Host "3. Show Git Status" -ForegroundColor Cyan
    Write-Host "4. Exit" -ForegroundColor Cyan
    Write-Host ""
}

# Main execution
if ($args.Length -eq 0) {
    do {
        Show-Menu
        $choice = Read-Host "Enter your choice (1-4)"
        
        switch ($choice) {
            "1" { Initialize-Repository }
            "2" { Quick-Push }
            "3" { Show-Status }
            "4" { Write-Host "Goodbye!" -ForegroundColor Green; break }
            default { Write-Host "Invalid choice. Please try again." -ForegroundColor Red }
        }
        
        if ($choice -ne "4") {
            Write-Host ""
            Read-Host "Press Enter to continue"
        }
    } while ($choice -ne "4")
} else {
    # Command line usage
    switch ($args[0]) {
        "init" { Initialize-Repository }
        "push" { Quick-Push $args[1] }
        "status" { Show-Status }
        default { 
            Write-Host "Usage: .\git-operations.ps1 [init|push|status]" -ForegroundColor Yellow
            Write-Host "Or run without parameters for interactive menu" -ForegroundColor Yellow
        }
    }
}