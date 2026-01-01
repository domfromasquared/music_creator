import fs from "fs";
import path from "path";

const SOUND_BANK_DIR = "soundbank";
const OUTPUT_FILE = path.join(SOUND_BANK_DIR, "manifest.json");

function walk(dir, root = dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) results = results.concat(walk(fullPath, root));

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".wav")) {
      const relPath = path.relative(root, fullPath).replace(/\\/g, "/");
      const parts = relPath.split("/");
      const category = parts.length > 1 ? parts[0] : "Misc";
      const label = entry.name.replace(/\.wav$/i, "");
      const key =
        "sb_" +
        relPath
          .replace(/\.wav$/i, "")
          .replace(/[^a-z0-9]+/gi, "_")
          .toLowerCase();

      results.push({
        key,
        label,
        category,
        url: `${SOUND_BANK_DIR}/${relPath}`
      });
    }
  }
  return results;
}

const samples = walk(SOUND_BANK_DIR);
const manifest = {
  generatedAt: new Date().toISOString(),
  count: samples.length,
  drums: samples.sort((a, b) =>
    a.category.localeCompare(b.category) || a.label.localeCompare(b.label)
  )
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
console.log(`✔ Soundbank manifest generated`);
console.log(`  Samples: ${manifest.count}`);
console.log(`  Output : ${OUTPUT_FILE}`);
