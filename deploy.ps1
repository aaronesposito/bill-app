param(
    [ValidateSet("dev","prod")]
    [string]$Environment = "dev"
)

# set env vars seen by docker and the app
$env:ENV = $Environment

if ($Environment -eq "dev") {
    $env:VITE_API_BASE_URL = "http://localhost:5005"
}
else {
    $env:VITE_API_BASE_URL = "http://prometheus:5040"
}

$composeFiles = @(
    "docker-compose.yml",
    "docker-compose.$Environment.yml"
)

$projectName = "bill-app-$Environment"

Write-Host "Deploying $projectName with ENV=$Environment"
Write-Host "Using VITE_API_BASE_URL=$($env:VITE_API_BASE_URL)"

docker compose `
  -f $composeFiles[0] `
  -f $composeFiles[1] `
  -p $projectName `
  up -d --build


#   .\deploy.ps1 -Environment [dev/prod]