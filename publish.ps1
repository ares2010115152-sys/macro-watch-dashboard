$ErrorActionPreference = "Stop"

$repoName = "macro-watch-dashboard"
$gh = Join-Path $PSScriptRoot "tools\bin\gh.exe"
if (-not (Test-Path $gh)) {
  $gh = "gh"
}

Write-Host "Checking GitHub authentication..."
& $gh auth status

$remote = git remote get-url origin 2>$null
if (-not $remote) {
  Write-Host "Creating GitHub repository: $repoName"
  & $gh repo create $repoName --public --source . --remote origin --push
} else {
  Write-Host "Pushing current repository..."
  git push -u origin main
}

$repo = & $gh repo view --json nameWithOwner -q ".nameWithOwner"
Write-Host "Enabling GitHub Pages for $repo ..."
& $gh api --method POST "repos/$repo/pages" -F "source[branch]=main" -F "source[path]=/" 2>$null
if ($LASTEXITCODE -ne 0) {
  & $gh api --method PUT "repos/$repo/pages" -F "source[branch]=main" -F "source[path]=/"
}

Write-Host "Published:"
Write-Host "https://$($repo.Split('/')[0]).github.io/$($repo.Split('/')[1])/"
