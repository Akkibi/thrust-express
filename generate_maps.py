# #!/usr/bin/env python3
# import json
# import os

# from PIL import Image

# INPUT_DIR = "public/mapImages"
# OUTPUT_DIR = "public/mapData"

# def is_not_black_transparent(pixel):
#     return pixel != (0, 0, 0, 0)

# def is_blue(pixel):
#     r, g, b, a = pixel
#     return b > 200 and r < 100 and g < 100 and a > 0

# def is_red(pixel):
#     r, g, b, a = pixel
#     return r > 200 and g < 100 and b < 100 and a > 0

# def is_green(pixel):
#     r, g, b, a = pixel
#     return g > 200 and r < 100 and b < 100 and a > 0

# def process_image(image_path, output_path):
#     img = Image.open(image_path).convert("RGBA")
#     width, height = img.size
#     pixels = list(img.getdata())

#     walls = []
#     player = None
#     goal = None

#     for i, pixel in enumerate(pixels):
#         x = i % width
#         y = i // width

#         if not is_not_black_transparent(pixel):
#             continue

#         if is_blue(pixel):
#             walls.append({"position": {"x": x, "y": y}})
#         elif is_red(pixel):
#             player = {"position": {"x": x, "y": y}}
#         elif is_green(pixel):
#             goal = {"position": {"x": x, "y": y}}

#     data = {
#         "walls": walls,
#         "player": player,
#         "goal": goal
#     }

#     with open(output_path, "w", encoding="utf-8") as f:
#         json.dump(data, f, indent=2)

# def main():
#     if not os.path.isdir(INPUT_DIR):
#         raise SystemExit(f"Input directory not found: {INPUT_DIR}")

#     os.makedirs(OUTPUT_DIR, exist_ok=True)

#     for filename in sorted(os.listdir(INPUT_DIR)):
#         if filename.lower().endswith(".png"):
#             input_path = os.path.join(INPUT_DIR, filename)
#             output_filename = os.path.splitext(filename)[0] + ".json"
#             output_path = os.path.join(OUTPUT_DIR, output_filename)
#             process_image(input_path, output_path)
#             print(f"Generated: {output_path}")

# if __name__ == "__main__":
#     main()

#!/usr/bin/env python3
import json
import os

from PIL import Image

INPUT_DIR = "public/mapImages"
OUTPUT_DIR = "public/mapData"

def is_not_black_transparent(pixel):
    return pixel != (0, 0, 0, 0)

def is_blue(pixel):
    r, g, b, a = pixel
    return b > 200 and r < 100 and g < 100 and a > 0

def is_red(pixel):
    r, g, b, a = pixel
    return r > 200 and g < 100 and b < 100 and a > 0

def is_green(pixel):
    r, g, b, a = pixel
    return g > 200 and r < 100 and b < 100 and a > 0

def find_horizontal_lines(grid, width, height):
    optimized_walls = []
    visited = set()

    for y in range(height):
        x = 0
        while x < width:
            if (x, y) in visited or not grid[y][x]:
                x += 1
                continue

            # Found the start of a potential horizontal line
            line_start_x = x
            line_length = 0
            while x < width and grid[y][x] and (x, y) not in visited:
                line_length += 1
                x += 1

            if line_length > 0:
                # Try to extend this horizontal line vertically
                block_start_y = y
                block_height = 0
                while block_start_y + block_height < height:
                    is_full_row = True
                    for check_x in range(line_start_x, line_start_x + line_length):
                        if not grid[block_start_y + block_height][check_x] or \
                           (check_x, block_start_y + block_height) in visited:
                            is_full_row = False
                            break
                    if is_full_row:
                        block_height += 1
                    else:
                        break

                # Mark all pixels in the found block as visited
                for by in range(block_start_y, block_start_y + block_height):
                    for bx in range(line_start_x, line_start_x + line_length):
                        visited.add((bx, by))

                # Calculate position and scale
                position_x = line_start_x + (line_length / 2) - 0.5
                position_y = block_start_y + (block_height / 2) - 0.5
                scale_x = line_length
                scale_y = block_height

                optimized_walls.append({
                    "position": {"x": position_x, "y": position_y},
                    "scale": {"x": scale_x, "y": scale_y}
                })
            else:
                x += 1 # Move to the next pixel if no line was found

    return optimized_walls

def process_image(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    pixels = list(img.getdata())

    walls = []
    player = None
    goal = None

    # Create a 2D grid to easily manage wall pixels for optimization
    wall_grid = [[False for _ in range(width)] for _ in range(height)]

    for i, pixel in enumerate(pixels):
        x = i % width
        y = i // width

        if not is_not_black_transparent(pixel):
            continue

        if is_blue(pixel):
            walls.append({"position": {"x": x, "y": y}})
            wall_grid[y][x] = True
        elif is_red(pixel):
            player = {"position": {"x": x, "y": y}}
        elif is_green(pixel):
            goal = {"position": {"x": x, "y": y}}

    optimized_walls = find_horizontal_lines(wall_grid, width, height)

    data = {
        "walls": walls,
        "optimizedWalls": optimized_walls,
        "player": player,
        "goal": goal
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def main():
    if not os.path.isdir(INPUT_DIR):
        raise SystemExit(f"Input directory not found: {INPUT_DIR}")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for filename in sorted(os.listdir(INPUT_DIR)):
        if filename.lower().endswith(".png"):
            input_path = os.path.join(INPUT_DIR, filename)
            output_filename = os.path.splitext(filename)[0] + ".json"
            output_path = os.path.join(OUTPUT_DIR, output_filename)
            process_image(input_path, output_path)
            print(f"Generated: {output_path}")

if __name__ == "__main__":
    main()
