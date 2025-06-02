// scripts/split-specs.js
const fs = require("fs");
const glob = require("glob");

const index = parseInt(process.argv[2]); // chunk index (0-based)
const totalChunks = parseInt(process.argv[3]); // total number of chunks

const specs = glob.sync("cypress/e2e/**/*.spec.js").sort();
const selected = specs.filter((_, i) => i % totalChunks === index);

fs.writeFileSync(`chunk-specs-${index}.txt`, selected.join("\n"));
console.log(`Specs for chunk ${index}:`, selected);
