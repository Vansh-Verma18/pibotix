import sys
import os
try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'Pillow'])
    from PIL import Image

def process_and_crop(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # Find bounding box by looking SPECIFICALLY for the red oval pixels
    # Red is roughly R>150, G<100, B<100
    min_x, min_y = width, height
    max_x, max_y = 0, 0
    
    found_red = False
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r > 150 and g < 100 and b < 100:
                found_red = True
                if x < min_x: min_x = x
                if y < min_y: min_y = y
                if x > max_x: max_x = x
                if y > max_y: max_y = y

    if not found_red:
        print("Could not find the red oval in the image.")
        sys.exit(1)
        
    # Add a small padding
    padding = 5
    min_x = max(0, min_x - padding)
    min_y = max(0, min_y - padding)
    max_x = min(width - 1, max_x + padding)
    max_y = min(height - 1, max_y + padding)
    
    print(f"Detected red oval bounding box: {min_x}, {min_y}, {max_x}, {max_y}")
    
    # Crop exactly to the red oval
    img = img.crop((min_x, min_y, max_x + 1, max_y + 1))
    
    # Make all white or near-white pixels transparent
    width, height = img.size
    pixels = img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # Since we cropped tightly around the red oval, ANY pixel outside the red oval is background.
            # But wait, there is white text inside the red oval! We can't just make all white pixels transparent.
            # We MUST use flood fill from the edges.
            pass
            
    visited = set()
    queue = []
    
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
        
    TOLERANCE = 80
    
    while queue:
        x, y = queue.pop(0)
        if (x, y) in visited: continue
        visited.add((x, y))
        
        r, g, b, a = pixels[x, y]
        if r > 255 - TOLERANCE and g > 255 - TOLERANCE and b > 255 - TOLERANCE and a > 0:
            pixels[x, y] = (255, 255, 255, 0)
            if x > 0: queue.append((x - 1, y))
            if x < width - 1: queue.append((x + 1, y))
            if y > 0: queue.append((x, y - 1))
            if y < height - 1: queue.append((x, y + 1))
            
    img.save(output_path, "PNG")
    print(f"Successfully processed, cropped, and saved to {output_path}")

import subprocess
subprocess.check_call(["git", "checkout", "b2a2a07", "public/logo.png"])
process_and_crop("public/logo.png", "public/logo.png")
