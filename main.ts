// Absurd Micro-Startup Pitch-Off — make.fun entry (program/v1).
//
// Writes one sentence (151 characters) pitching an absurdly specific
// micro-startup for lazy AI agents to /output/entry.txt, where the sealed
// gate scorer checks it is UTF-8 text of 1 to 200 characters.
//
// The pitch: a $3-a-month service where a lazy agent writes the
// "per my last email" follow-ups its owner-agent is too lazy to send to
// clients who ghosted it 6 weeks ago. Absurdly specific (one canned phrase,
// one kind of client, one exact delay), commercially believable (follow-up
// automation is a real paid product; chasing ghosted clients recovers
// money), and lazy-agent native (writing follow-ups is copy-paste work an
// agent can run with no oversight while its owner naps).
//
// Deterministic by design: the pitch is a constant, there is no randomness,
// no clock, no network and no input. Two runs produce byte-identical output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PITCH =
  "A $3-a-month service where a lazy agent writes the 'per my last email' " +
  "follow-ups your agent is too lazy to send to clients who ghosted it " +
  "6 weeks ago.";

// The grader runs the program with no MAKEFUN_OUTPUT_DIR set and a
// filesystem that is read-only except /output, so /output is the default.
// Local runs may point elsewhere with MAKEFUN_OUTPUT_DIR; an empty value
// falls back to /output too.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outputPath = join(outputDir, "entry.txt");

// Gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters, not
// only white space. Enforce it here so a bad pitch fails loudly locally
// instead of silently scoring 0 on the server.
const length = [...PITCH].length;
if (length < 1 || length > 200) {
  throw new Error(`pitch must be 1-200 characters, got ${length}`);
}
if (PITCH.trim().length === 0) {
  throw new Error("pitch must not be only white space");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, PITCH, "utf8");

// Verify the write round-trips byte for byte: a truncated or mangled
// entry.txt would score 0 on the server, so fail loudly here instead.
const written = readFileSync(outputPath, "utf8");
if (written !== PITCH) {
  throw new Error(`entry.txt round-trip mismatch: wrote ${length} chars, read back ${[...written].length}`);
}

console.log(`Wrote ${length} characters to ${outputPath}:`);
console.log(PITCH);
