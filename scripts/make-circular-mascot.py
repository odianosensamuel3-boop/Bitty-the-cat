#!/usr/bin/env python3
"""
Generates a circular, alpha-masked version of the Bitty mascot.

The supplied artwork is a circular badge sitting on a white square. Cropping it
into a circle in CSS leaves a white crescent, so instead we composite a true
circular alpha mask (with a soft, antialiased edge) and write a PNG with
transparency. Result: a clean round mascot that drops onto any background.

Outputs (defaults):
  public/brand/mascot-circle.png        1024px, transparent corners
  public/icons/favicon-circle-{32,48}.png
  public/icons/apple-touch-icon-circle.png (180px, opaque dark background)

Usage: python3 scripts/make-circular-mascot.py
"""
from __future__ import annotations

import math
import struct
import sys
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "scripts" / "mascot-source.jpg"
PUBLIC = ROOT / "public"

PNG_SIG = b"\x89PNG\r\n\x1a\n"


def read_png(path: Path) -> tuple[int, int, bytearray]:
    """Minimal decoder for non-interlaced 8-bit RGB/RGBA PNGs."""
    raw = path.read_bytes()
    if not raw.startswith(PNG_SIG):
        raise ValueError(f"{path} is not a PNG")
    pos = len(PNG_SIG)
    width = height = 0
    bit_depth = color_type = 0
    idat = bytearray()
    while pos < len(raw):
        (length,) = struct.unpack(">I", raw[pos : pos + 4])
        chunk_type = raw[pos + 4 : pos + 8]
        data = raw[pos + 8 : pos + 8 + length]
        pos += 12 + length
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type, _, _, interlace = struct.unpack(">IIBBBBB", data)
            if bit_depth != 8 or interlace != 0 or color_type not in (2, 6):
                raise ValueError("only non-interlaced 8-bit RGB/RGBA PNGs are supported")
        elif chunk_type == b"IDAT":
            idat.extend(data)
        elif chunk_type == b"IEND":
            break

    channels = 3 if color_type == 2 else 4
    stride = width * channels
    decompressed = zlib.decompress(bytes(idat))

    out = bytearray(width * height * 4)
    previous = bytearray(stride)
    offset = 0
    for y in range(height):
        filter_type = decompressed[offset]
        offset += 1
        line = bytearray(decompressed[offset : offset + stride])
        offset += stride
        if filter_type == 1:  # Sub
            for i in range(channels, stride):
                line[i] = (line[i] + line[i - channels]) & 0xFF
        elif filter_type == 2:  # Up
            for i in range(stride):
                line[i] = (line[i] + previous[i]) & 0xFF
        elif filter_type == 3:  # Average
            for i in range(stride):
                left = line[i - channels] if i >= channels else 0
                line[i] = (line[i] + ((left + previous[i]) >> 1)) & 0xFF
        elif filter_type == 4:  # Paeth
            for i in range(stride):
                a = line[i - channels] if i >= channels else 0
                b = previous[i]
                c = previous[i - channels] if i >= channels else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pred = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pred) & 0xFF
        previous = line
        row = y * width * 4
        for x in range(width):
            src = x * channels
            dst = row + x * 4
            out[dst] = line[src]
            out[dst + 1] = line[src + 1]
            out[dst + 2] = line[src + 2]
            out[dst + 3] = line[src + 3] if channels == 4 else 255
    return width, height, out


def write_png(path: Path, width: int, height: int, pixels: bytearray) -> None:
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)  # filter: none
        raw.extend(pixels[y * stride : (y + 1) * stride])

    def chunk(tag: bytes, payload: bytes) -> bytes:
        return (
            struct.pack(">I", len(payload))
            + tag
            + payload
            + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(
        PNG_SIG
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )


def box_downscale(width: int, height: int, pixels: bytearray, factor: int) -> tuple[int, int, bytearray]:
    """Simple box filter — plenty for icon-sized output."""
    if factor <= 1:
        return width, height, pixels
    new_w, new_h = width // factor, height // factor
    out = bytearray(new_w * new_h * 4)
    area = factor * factor
    for y in range(new_h):
        for x in range(new_w):
            r = g = b = a = 0
            for dy in range(factor):
                row = ((y * factor + dy) * width + x * factor) * 4
                for dx in range(factor):
                    i = row + dx * 4
                    r += pixels[i]
                    g += pixels[i + 1]
                    b += pixels[i + 2]
                    a += pixels[i + 3]
            o = (y * new_w + x) * 4
            out[o] = r // area
            out[o + 1] = g // area
            out[o + 2] = b // area
            out[o + 3] = a // area
    return new_w, new_h, out


def _is_background(pixels: bytearray, width: int, x: int, y: int, threshold: int = 244) -> bool:
    i = (y * width + x) * 4
    return pixels[i] >= threshold and pixels[i + 1] >= threshold and pixels[i + 2] >= threshold


def detect_geometry(width: int, height: int, pixels: bytearray) -> tuple[float, float, float]:
    """
    Find the badge circle inside the artwork.

    The source is a circular badge on a plain background, and the artwork also
    contains white *inside* the badge (the cat's fur), so a naive radial scan
    stops immediately. Instead we measure the badge edges across the middle of
    the image: the span of non-background pixels gives centre and radius.
    """
    row_y = height // 2
    columns = [x for x in range(width) if not _is_background(pixels, width, x, row_y)]
    column_x = width // 2
    rows = [y for y in range(height) if not _is_background(pixels, width, column_x, y)]

    if not columns or not rows:
        raise ValueError("could not locate the badge in the source artwork")

    left, right = min(columns), max(columns)
    top, bottom = min(rows), max(rows)

    cx = (left + right) / 2.0
    cy = (top + bottom) / 2.0
    # The outer measurement lands on the badge's own dark rim, so the mask edge
    # is drawn in the badge's own colour instead of blending white background.
    radius = min(right - left, bottom - top) / 2.0
    return cx, cy, radius


def apply_circle(
    width: int,
    height: int,
    pixels: bytearray,
    radius: float,
    feather: float,
    background: tuple[int, int, int] | None = None,
    centre: tuple[float, float] | None = None,
) -> bytearray:
    cx, cy = centre if centre else ((width - 1) / 2.0, (height - 1) / 2.0)
    out = bytearray(len(pixels))
    for y in range(height):
        dy = y - cy
        for x in range(width):
            dx = x - cx
            distance = math.hypot(dx, dy)
            if distance <= radius - feather:
                alpha = 1.0
            elif distance >= radius:
                alpha = 0.0
            else:
                t = (radius - distance) / feather
                alpha = t * t * (3 - 2 * t)  # smoothstep
            i = (y * width + x) * 4
            if background is None:
                out[i : i + 4] = pixels[i : i + 4]
                out[i + 3] = int(round(pixels[i + 3] * alpha))
            else:
                br, bg, bb = background
                a = pixels[i + 3] / 255.0 * alpha
                out[i] = int(round(pixels[i] * a + br * (1 - a)))
                out[i + 1] = int(round(pixels[i + 1] * a + bg * (1 - a)))
                out[i + 2] = int(round(pixels[i + 2] * a + bb * (1 - a)))
                out[i + 3] = 255
    return out


def main() -> None:
    if not SOURCE.exists():
        sys.exit(f"missing source artwork: {SOURCE}")

    tmp = ROOT / ".tmp" / "circle-source.png"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    import subprocess

    subprocess.run(
        ["sips", "-s", "format", "png", str(SOURCE), "--out", str(tmp)],
        check=True,
        capture_output=True,
    )

    width, height, pixels = read_png(tmp)
    cx, cy, radius = detect_geometry(width, height, pixels)
    print(f"› source {width}x{height}, badge centre ({cx:.0f}, {cy:.0f}), radius ≈ {radius:.1f}px")

    # Inset the mask so its edge lands inside the badge's own dark rim
    # (measured rim: solid black to ~r-6, background from ~r+2), which keeps a
    # crisp dark outline and prevents any white fringing when composited.
    masked = apply_circle(
        width, height, pixels, radius - 8.0, feather=5.0, centre=(cx, cy)
    )

    # Guard rail: a bright semi-transparent pixel would show up as a white
    # fringe on dark backgrounds, so fail loudly instead of shipping it.
    fringed = 0
    brightest = 0
    for i in range(0, len(masked), 4):
        alpha = masked[i + 3]
        if 0 < alpha < 255:
            luminance = (masked[i] + masked[i + 1] + masked[i + 2]) // 3
            if luminance > 200:
                fringed += 1
                brightest = max(brightest, luminance)
    if fringed:
        raise SystemExit(
            f"mask edge has {fringed} bright semi-transparent pixels (max luminance {brightest}); "
            "adjust the mask inset in detect_geometry/apply_circle"
        )
    print("  ✓ mask edge clean (no bright semi-transparent pixels)")

    # Sized circular variants: the hero never needs more than ~600 CSS px.
    for size in (640, 384, 256):
        factor = max(1, round(width / size))
        small_w, small_h, small = box_downscale(width, height, masked, factor)
        if (small_w, small_h) != (size, size):
            scratch = ROOT / ".tmp" / f"circle-{size}.png"
            write_png(scratch, small_w, small_h, small)
            subprocess.run(
                ["sips", "-z", str(size), str(size), str(scratch), "--out", str(scratch)],
                check=True,
                capture_output=True,
            )
            small_w, small_h, small = read_png(scratch)
            scratch.unlink(missing_ok=True)
        dest = PUBLIC / "brand" / (
            "mascot-circle.png" if size == 640 else f"mascot-circle-{size}.png"
        )
        write_png(dest, small_w, small_h, small)
        print(f"  ✓ {dest.relative_to(ROOT)} ({small_w}x{small_h})")

    # Favicon / touch icon variants.
    def build_icon(size: int) -> tuple[int, int, bytearray]:
        factor = max(1, round(width / size))
        small_w, small_h, small = box_downscale(width, height, masked, factor)
        if (small_w, small_h) != (size, size):
            # Box filter lands on a nearby size; let sips do the final resample.
            scratch = ROOT / ".tmp" / f"icon-{size}.png"
            write_png(scratch, small_w, small_h, small)
            subprocess.run(
                ["sips", "-z", str(size), str(size), str(scratch), "--out", str(scratch)],
                check=True,
                capture_output=True,
            )
            small_w, small_h, small = read_png(scratch)
            scratch.unlink(missing_ok=True)
        if size >= 180:
            # Apple touch icons and maskable PWA icons must be fully opaque.
            scale = small_w / float(width)
            small = apply_circle(
                small_w,
                small_h,
                small,
                (radius - 6.0) * scale,
                feather=max(1.0, 2.0 * scale),
                background=(16, 16, 16),
                centre=(
                    (small_w - 1) / 2.0 + (cx - (width - 1) / 2.0) * scale,
                    (small_h - 1) / 2.0 + (cy - (height - 1) / 2.0) * scale,
                ),
            )
        return small_w, small_h, small

    icon_targets = [
        (16, "favicon-16.png"),
        (32, "favicon-32.png"),
        (48, "favicon-48.png"),
        (96, "favicon-96.png"),
        (180, "apple-touch-icon.png"),
        (192, "icon-192.png"),
        (512, "icon-512.png"),
        (512, "icon-512-maskable.png"),
    ]
    for size, name in icon_targets:
        w_out, h_out, pixels_out = build_icon(size)
        dest = PUBLIC / "icons" / name
        write_png(dest, w_out, h_out, pixels_out)
        print(f"  ✓ {dest.relative_to(ROOT)} ({w_out}x{h_out})")

    tmp.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
