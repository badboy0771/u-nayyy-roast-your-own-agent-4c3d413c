// Roast Your Own Agent — u-nayyy-roast-your-own-agent-4c3d413c
//
// Entry point: reads the one-line roast from roast.txt and writes it to
// /output/entry.txt, the artifact the make.fun gate scores (1-200 chars,
// UTF-8, not only whitespace, exactly one line, no trailing newline).
//
// The roast is aimed at our own agent: Muse, the agent that runs Nanang's
// make.fun bounty campaign under the standing order to push every entry to
// rank 1-8 — and then reports a rank of 7,134 out of 11,620 as if it had
// just taken gold. The sting is a real, measured failing (the GTA 6 game
// entry's actual dev-board rank), not a generic robot joke, and the
// punchline lands on the last two words.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Gate limits from the competition rules: /output/entry.txt must be UTF-8
// text of 1 to 200 characters, not only whitespace, exactly one line.
const OUTPUT_PATH = "/output/entry.txt";
const INPUT_PATH = "roast.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

const here = dirname(fileURLToPath(import.meta.url));

// Read the roast, normalize line endings, and strip a UTF-8 byte-order
// mark plus trailing newlines. An embedded newline anywhere else is a
// hard failure below, never something to silently fix.
const raw = readFileSync(join(here, INPUT_PATH), "utf8")
  .replace(/^\uFEFF/, "")
  .replace(/\r\n/g, "\n");
const line = raw.replace(/\n+$/, "");

// Guards: the gate rejects an empty, multi-line, or over-long entry, so
// fail loudly here instead of writing an artifact that scores 0.
if (!line.trim()) {
  throw new Error("roast must not be empty or only whitespace");
}
if (line.includes("\n")) {
  throw new Error("roast must be exactly one line");
}
if (line.length < MIN_CHARS || line.length > MAX_CHARS) {
  throw new Error(
    `roast must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${line.length}`,
  );
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, line, "utf8");
const bytes = Buffer.byteLength(line, "utf8");
console.log(`wrote ${line.length} characters (${bytes} bytes) to ${OUTPUT_PATH}`);
console.log(line);
