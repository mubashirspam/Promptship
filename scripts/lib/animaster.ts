/**
 * Shared scanning logic for the animaster asset library. Used by both the
 * seeder and the CSV exporter — they MUST agree on which files form a
 * template, or the CSV you fill in won't line up with the rows that get seeded.
 *
 * Layout is flat per category folder, grouped by a `<prefix>-<n>` id:
 *   3d-17.webp   preview image
 *   3d-17.webm   preview video
 *   3d-17-650.zip   the code  (note: zips sometimes carry an extra suffix
 *                              the media files don't — hence the grouping)
 */

import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';

export const SOURCE_ROOT = '/Users/mymac/Documents/animaster';

export const CATEGORY_MAP: Record<string, { slug: string; name: string }> = {
  '3D Animation': { slug: '3d-animation', name: '3D Animation' },
  'Background Animation': { slug: 'background-animation', name: 'Background Animation' },
  'Grid Animation': { slug: 'grid-animation', name: 'Grid Animation' },
  'Hero Animation': { slug: 'hero-animation', name: 'Hero Animation' },
  'Hover Effect': { slug: 'hover-effect', name: 'Hover Effects' },
  'Mouse Effect': { slug: 'mouse-effect', name: 'Mouse Effects' },
  'Navigation Menu': { slug: 'navigation-menu', name: 'Navigation Menus' },
  'Scroll Animation': { slug: 'scroll-animation', name: 'Scroll Animation' },
  'Page Transition': { slug: 'page-transition', name: 'Page Transitions' },
  'Physics Effect': { slug: 'physics-effect', name: 'Physics Effects' },
  'SVG Animation': { slug: 'svg-animation', name: 'SVG Animation' },
  'Slider': { slug: 'slider', name: 'Sliders' },
  'Text Animation': { slug: 'text-animation', name: 'Text Animation' },
  'WebGL Shader': { slug: 'webgl-shader', name: 'WebGL Shaders' },
};

export interface TemplateGroup {
  id: string;
  categoryFolder: string;
  webp?: string;
  webm?: string;
  zip?: string;
  /** Other zips that matched this id and were not chosen. */
  zipAlternatives: string[];
}

/**
 * Files named `preview.zip` / `prev.zip` carry no id and are not templates —
 * requiring a trailing `-<number>` excludes them.
 */
function groupKey(filename: string): string | null {
  const m = filename.match(/^(.+?-\d+)(?:-\d+)?(?:-instruction)?\.(webm|webp|zip|txt)$/);
  return m ? m[1] : null;
}

export function scanCategory(folder: string): TemplateGroup[] {
  const dir = join(SOURCE_ROOT, folder);
  if (!existsSync(dir)) return [];

  const groups = new Map<string, TemplateGroup & { zips: string[] }>();

  for (const file of readdirSync(dir)) {
    if (file.startsWith('.')) continue;
    const key = groupKey(file);
    if (!key) continue;

    const g =
      groups.get(key) ??
      ({ id: key, categoryFolder: folder, zips: [], zipAlternatives: [] } as TemplateGroup & {
        zips: string[];
      });
    if (file.endsWith('.webp')) g.webp = file;
    else if (file.endsWith('.webm')) g.webm = file;
    else if (file.endsWith('.zip')) g.zips.push(file);
    groups.set(key, g);
  }

  return [...groups.values()]
    .map((g) => {
      // A few ids have two zips with genuinely different contents (e.g.
      // hero-5.zip has no video; hero-5-650.zip ships a 13MB video.mp4).
      // readdir order is not a decision — sort largest-first so the pick is
      // deterministic, and prefer the variant carrying media assets, which is
      // what the single preview file almost always depicts.
      const zips = g.zips.sort(
        (a, b) => statSync(join(dir, b)).size - statSync(join(dir, a)).size
      );
      const { zips: _zips, ...rest } = g;
      return { ...rest, zip: zips[0], zipAlternatives: zips.slice(1) };
    })
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

/** Groups with more than one candidate zip — worth a human glance. */
export function collisions(groups: TemplateGroup[]) {
  return groups.filter((g) => g.zipAlternatives.length > 0);
}
