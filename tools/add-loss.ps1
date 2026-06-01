param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("Retard", "Message", "Courriel", "Comportement")]
  [string] $Reason,

  [Parameter(Mandatory = $false)]
  [string] $Note = "",

  [Parameter(Mandatory = $false)]
  [string] $Date = (Get-Date -Format "yyyy-MM-dd")
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dataPath = Join-Path $root "data.json"
$data = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json

$reasonLabels = @{
  Retard = "Retard"
  Message = "Message de l'ecole"
  Courriel = "Courriel de l'ecole"
  Comportement = "Comportement"
}

$losses = @($data.losses)
if ($losses.Count -ge $data.startingPoints) {
  throw "Félix n'a plus de points à retirer."
}

$losses += [pscustomobject]@{
  id = [guid]::NewGuid().ToString()
  date = $Date
  reason = $reasonLabels[$Reason]
  note = $Note
}

$data.losses = $losses
$data.lastUpdated = Get-Date -Format "yyyy-MM-dd"

$json = $data | ConvertTo-Json -Depth 8
Set-Content -LiteralPath $dataPath -Value $json -Encoding UTF8

$pointsLeft = [Math]::Max($data.startingPoints - $losses.Count, 0)
Write-Host "Perte ajoutee. Points restants: $pointsLeft"
