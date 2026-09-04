import zlib
import struct

def create_png(width, height, filename):
    # Create raw RGBA image buffer (iOS Reminders style: Blue background with white card & dots)
    raw_data = bytearray()
    
    for y in range(height):
        raw_data.append(0) # Filter type 0 (None)
        for x in range(width):
            # Normalize coordinates
            nx = x / width
            ny = y / height
            
            # Check rounded box / card area
            is_outer = (nx < 0.05 or nx > 0.95 or ny < 0.05 or ny > 0.95)
            
            if is_outer:
                # Background iOS Blue (#007AFF)
                r, g, b, a = 0, 122, 255, 255
            else:
                # White inner card with dots
                # Row 1 Red dot
                d1 = ((x - width*0.35)**2 + (y - height*0.3)**2)**0.5
                # Row 2 Blue dot
                d2 = ((x - width*0.35)**2 + (y - height*0.5)**2)**0.5
                # Row 3 Orange dot
                d3 = ((x - width*0.35)**2 + (y - height*0.7)**2)**0.5

                r_dot = width * 0.08

                if d1 < r_dot:
                    r, g, b, a = 255, 59, 48, 255 # Red
                elif d2 < r_dot:
                    r, g, b, a = 0, 122, 255, 255 # Blue
                elif d3 < r_dot:
                    r, g, b, a = 255, 149, 0, 255 # Orange
                elif (height*0.25 <= y <= height*0.35 or height*0.45 <= y <= height*0.55 or height*0.65 <= y <= height*0.75) and width*0.48 <= x <= width*0.85:
                    r, g, b, a = 229, 229, 234, 255 # Gray bar
                else:
                    r, g, b, a = 255, 255, 255, 255 # White background
            
            raw_data.extend([r, g, b, a])

    compressed = zlib.compress(raw_data)

    def chunk(chunk_type, data):
        length = struct.pack('>I', len(data))
        crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return length + chunk_type + data + crc

    png_bytes = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png_bytes.extend(chunk(b'IHDR', ihdr_data))
    
    # IDAT
    png_bytes.extend(chunk(b'IDAT', compressed))
    
    # IEND
    png_bytes.extend(chunk(b'IEND', b''))

    with open(filename, 'wb') as f:
        f.write(png_bytes)
    print(f"Generated {filename} ({width}x{height})")

if __name__ == '__main__':
    create_png(192, 192, 'public/icon-192.png')
    create_png(512, 512, 'public/icon-512.png')
