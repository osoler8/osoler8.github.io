param(
    [int]$Port = 8003,
    [string]$Folder = "."
)

Add-Type -AssemblyName System.Net

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "Static server running at $prefix"
Write-Host "Serving folder: $(Resolve-Path $Folder)"

while ($true) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.AbsolutePath
    if ($path -eq "/") { $path = "/index.html" }
    $local = Join-Path (Resolve-Path $Folder) ($path.TrimStart('/'))

    if (Test-Path $local) {
        $bytes = [System.IO.File]::ReadAllBytes($local)
        $ext = [System.IO.Path]::GetExtension($local).ToLower()
        $contentType = switch ($ext) {
            ".html" { "text/html" }
            ".css"  { "text/css" }
            ".js"   { "application/javascript" }
            ".png"  { "image/png" }
            ".jpg"  { "image/jpeg" }
            ".svg"  { "image/svg+xml" }
            default  { "application/octet-stream" }
        }
        $response.ContentType = $contentType
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $response.OutputStream.Close()
}