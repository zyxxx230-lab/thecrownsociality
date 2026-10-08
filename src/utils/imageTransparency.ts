/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility functions for automatic character background transparency
 * and silhouette contour outline generation according to the character photo.
 */

export interface BackgroundRemovalOptions {
  tolerance?: number; // 0 - 100, default 30
  protectInterior?: boolean; // Flood-fill from borders only to protect character's clothes/eyes
  featherRadius?: number; // 0 - 2, smooth edges
}

/**
 * Converts a solid/semi-solid background in an image (JPG, PNG, WebP, etc.)
 * into true transparent alpha channel using HTML5 Canvas flood-fill & chroma-keying.
 */
export async function makeImageBackgroundTransparent(
  imageUrl: string,
  options: BackgroundRemovalOptions = {}
): Promise<string> {
  const { tolerance = 32, protectInterior = true, featherRadius = 1 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        if (width === 0 || height === 0) {
          resolve(imageUrl);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        // Draw the original image onto canvas
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Sample 4 corners to determine background color
        const cornerCoords = [
          [0, 0],
          [width - 1, 0],
          [0, height - 1],
          [width - 1, height - 1],
          [Math.floor(width / 2), 0], // Top center edge
        ];

        let bgR = 0;
        let bgG = 0;
        let bgB = 0;
        let sampleCount = 0;

        for (const [cx, cy] of cornerCoords) {
          const idx = (cy * width + cx) * 4;
          const a = data[idx + 3];
          if (a > 200) {
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
            sampleCount++;
          }
        }

        // If corners are already transparent, image is already transparent!
        if (sampleCount === 0) {
          resolve(imageUrl);
          return;
        }

        bgR = Math.round(bgR / sampleCount);
        bgG = Math.round(bgG / sampleCount);
        bgB = Math.round(bgB / sampleCount);

        const colorDist = (r: number, g: number, b: number) => {
          return Math.sqrt(
            Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
          );
        };

        const maxDist = (tolerance / 100) * 441.67; // 441.67 is max RGB distance sqrt(255^2*3)

        if (protectInterior) {
          // BFS Flood-fill from outer edges to only eliminate background and avoid internal white/black areas
          const visited = new Uint8Array(width * height);
          const queue: number[] = [];

          // Add all border pixels that match background color
          for (let x = 0; x < width; x++) {
            // Top border
            const topIdx = (0 * width + x) * 4;
            if (colorDist(data[topIdx], data[topIdx + 1], data[topIdx + 2]) <= maxDist) {
              queue.push(0 * width + x);
              visited[0 * width + x] = 1;
            }
            // Bottom border
            const btmIdx = ((height - 1) * width + x) * 4;
            if (colorDist(data[btmIdx], data[btmIdx + 1], data[btmIdx + 2]) <= maxDist) {
              queue.push((height - 1) * width + x);
              visited[(height - 1) * width + x] = 1;
            }
          }

          for (let y = 0; y < height; y++) {
            // Left border
            const leftIdx = (y * width + 0) * 4;
            if (!visited[y * width + 0] && colorDist(data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]) <= maxDist) {
              queue.push(y * width + 0);
              visited[y * width + 0] = 1;
            }
            // Right border
            const rightIdx = (y * width + (width - 1)) * 4;
            if (!visited[y * width + (width - 1)] && colorDist(data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]) <= maxDist) {
              queue.push(y * width + (width - 1));
              visited[y * width + (width - 1)] = 1;
            }
          }

          // Process flood fill queue
          let head = 0;
          while (head < queue.length) {
            const current = queue[head++];
            const cx = current % width;
            const cy = Math.floor(current / width);

            // Make current pixel transparent
            const pixelIdx = current * 4;
            data[pixelIdx + 3] = 0;

            // Neighbors: N, S, E, W
            const neighbors = [
              [cx, cy - 1],
              [cx, cy + 1],
              [cx - 1, cy],
              [cx + 1, cy],
            ];

            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIndex = ny * width + nx;
                if (!visited[nIndex]) {
                  visited[nIndex] = 1;
                  const nPixelIdx = nIndex * 4;
                  const dist = colorDist(data[nPixelIdx], data[nPixelIdx + 1], data[nPixelIdx + 2]);
                  if (dist <= maxDist) {
                    queue.push(nIndex);
                  } else if (dist <= maxDist * 1.25 && featherRadius > 0) {
                    // Soft anti-aliased edge feathering
                    const factor = (dist - maxDist) / (maxDist * 0.25);
                    data[nPixelIdx + 3] = Math.round(data[nPixelIdx + 3] * factor);
                  }
                }
              }
            }
          }
        } else {
          // Global color keying
          for (let i = 0; i < data.length; i += 4) {
            const dist = colorDist(data[i], data[i + 1], data[i + 2]);
            if (dist <= maxDist) {
              data[i + 3] = 0;
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultDataUrl = canvas.toDataURL('image/png');
        resolve(resultDataUrl);
      } catch (err) {
        console.warn('Transparent background conversion error:', err);
        resolve(imageUrl);
      }
    };

    img.onerror = () => {
      resolve(imageUrl);
    };

    img.src = imageUrl;
  });
}

/**
 * Generates a clean, lightweight silhouette contour outline for transparent character photos.
 * Optimized for low-spec phones: uses a crisp 4-directional filter without heavy multi-layer blur fog.
 */
export function getCharacterContourOutlineStyle(
  color: string,
  thickness: number = 2.0,
  includeGlow: boolean = false,
  _glowAlpha: number = 0.5
): React.CSSProperties {
  const r = Math.max(1.2, Math.min(2.5, thickness));

  // Clean 4-point silhouette contour (lightweight on GPU & non-crowded)
  const shadowFilters = [
    `drop-shadow(${r}px 0 0 ${color})`,
    `drop-shadow(-${r}px 0 0 ${color})`,
    `drop-shadow(0 ${r}px 0 ${color})`,
    `drop-shadow(0 -${r}px 0 ${color})`,
  ];

  if (includeGlow) {
    shadowFilters.push(`drop-shadow(0 0 6px ${color})`);
  }

  return {
    filter: shadowFilters.join(' '),
  };
}
