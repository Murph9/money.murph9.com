# powershell script to deploy straight to s3 + version

[CmdletBinding()]
param (
   [Parameter(mandatory)]
   [string] $BucketName,
   [Parameter()]
   [switch] $IgnoreGitVersion
)

if (test-path 'dist') {
    Remove-Item 'dist' -R
}

if (-not $IgnoreGitVersion) {
    npm version patch
}

npm run build

Write-Output "Writing build to bucket name: $BucketName"
aws s3 sync dist/. s3://$BucketName --delete

if (-not $IgnoreGitVersion) {
    git push
}
