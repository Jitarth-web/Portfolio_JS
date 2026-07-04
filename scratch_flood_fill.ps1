Add-Type -AssemblyName System.Drawing
$imagePath = "c:\Users\jitar\Documents\Codex\js\portfolio\src\assets\figma\image 41.png"
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
$width = $bmp.Width
$height = $bmp.Height

# We will use a flood fill algorithm from the 4 corners to remove the black background
# without touching any black pixels inside the dog character.
$visited = New-Object "Boolean[,]" $width, $height
$queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()

# Helper to push boundary points
function Push-Point($x, $y) {
    if ($x -ge 0 -and $x -lt $width -and $y -ge 0 -and $y -lt $height) {
        if (-not $visited[$x, $y]) {
            $visited[$x, $y] = $true
            $queue.Enqueue([System.Drawing.Point]::new($x, $y))
        }
    }
}

# Seed the queue with the four corners and borders
for ($x = 0; $x -lt $width; $x++) {
    Push-Point $x 0
    Push-Point $x ($height - 1)
}
for ($y = 0; $y -lt $height; $y++) {
    Push-Point 0 $y
    Push-Point ($width - 1) $y
}

while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    $pixel = $bmp.GetPixel($pt.X, $pt.Y)
    
    # If the pixel is black/very dark (background)
    if ($pixel.R -lt 30 -and $pixel.G -lt 30 -and $pixel.B -lt 30) {
        # Make it transparent
        $bmp.SetPixel($pt.X, $pt.Y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        
        # Add 4-way neighbors to queue
        Push-Point ($pt.X + 1) $pt.Y
        Push-Point ($pt.X - 1) $pt.Y
        Push-Point $pt.X ($pt.Y + 1)
        Push-Point $pt.X ($pt.Y - 1)
    }
}

$tempPath = "c:\Users\jitar\Documents\Codex\js\portfolio\src\assets\figma\image 41_transparent.png"
$bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

if (Test-Path $tempPath) {
    Remove-Item $imagePath -Force
    Move-Item $tempPath $imagePath -Force
    Write-Host "Success"
} else {
    Write-Host "Failed to save transparent image"
}
