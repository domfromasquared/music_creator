#!/usr/bin/env node
/**
 * Generates midi/index.json by scanning /midi/* folders for .mid/.midi files.
 * - Packs come from midi/packs.json if present (for nice display names + ordering)
 * - Otherwise packs are inferred from subfolders in /midi
 * - File display names are inferred from filenames (best-effort)
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MIDI_DIR = path.join(ROOT, "midi");
const OUT_FILE = path.join(MIDI_DIR, "index.json");
const PACKS_META = path.join(MIDI_DIR, "packs.json");

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function titleCase(str) {
  return str
    .split(" ")
    .filter(Boolean)
    .map(w => w.length ? (w[0].toUpperCase() + w.slice(1)) : w)
    .join(" ");
}

function humanizeFilename(filename, packPath) {
  // strip extension
  let base = filename.replace(/\.(mid|midi)$/i, "");

  // normalize separators
  base = base.replace(/[-]+/g, "_").replace(/\s+/g, "_");

  // drop common junk prefixes (best-effort)
  base = base.replace(/^(NW_|MID_|MIDI_)/i, "");
  base = base.replace(/^\d+_/, ""); // leading numbers + underscore

  // remove pack path token if present in name (nightlife, trap, etc)
  const packToken = (packPath || "").toLowerCase();
  if (packToken) {
    base = base
      .split("_")
      .filter(t => t.toLowerCase() !== packToken)
      .join("_");
  }

  // detect a trailing "key" token (Abmaj, Cmin, F#maj, etc) and move to parentheses
  // Very loose pattern: optional note + optional #/b + maj|min|m|minor|major
  const tokens = base.split("_").filter(Boolean);
  let key = null;

  if (tokens.length) {
    const last = tokens[tokens.length - 1];
    const keyPattern = /^[A-Ga-g](#|b)?(maj|min|m|major|minor)$/;
    if (keyPattern.test(last)) {
      key = last;
      tokens.pop();
    }
  }

  // turn remaining tokens into spaced words
  let name = tokens.join(" ");
  name = name.replace(/\b([A-Za-z])\b/g, "$1"); // keep single letters as-is
  name = titleCase(name);

  if (key) {
    // normalize key casing: Abmaj -> Abmaj, cmin -> Cmin
    key = key[0].toUpperCase() + key.slice(1);
    name = `${name} (${key})`;
  }

  return name || filename;
}

function listSubfolders(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

function listMidiFiles(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => d.name)
    .filter(f => /\.(mid|midi)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function loadPacks() {
  if (exists(PACKS_META)) {
    const meta = JSON.parse(fs.readFileSync(PACKS_META, "utf8"));
    if (meta && Array.isArray(meta.packs)) return meta.packs;
  }
  // fallback: infer packs from midi subfolders
  return listSubfolders(MIDI_DIR).map(p => ({ path: p, name: titleCase(p.replace(/[-_]/g, " ")) }));
}

function main() {
  if (!exists(MIDI_DIR)) {
    console.error(`Missing /midi directory at ${MIDI_DIR}`);
    process.exit(1);
  }

  const packs = loadPacks();

  const out = {
    packs: packs.map(pack => {
      const packFolder = path.join(MIDI_DIR, pack.path);
      const files = listMidiFiles(packFolder).map(file => ({
        name: humanizeFilename(file, pack.path),
        file
      }));

      return {
        name: pack.name || titleCase(pack.path),
        path: pack.path,
        files
      };
    })
  };

  const json = JSON.stringify(out, null, 2) + "\n";
  fs.writeFileSync(OUT_FILE, json, "utf8");

  console.log(`✅ Wrote ${path.relative(ROOT, OUT_FILE)} (${out.packs.length} packs)`);
}

main();
