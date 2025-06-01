// scripts/split-specs.js
const fs = require("fs");
const glob = require("glob");

const index = parseInt(process.argv[2]); // chunk index (0-based)
const totalChunks = parseInt(process.argv[3]); // total number of chunks

const specs = glob.sync("cypress/e2e/**/*.spec.js").sort();
const chunkSize = Math.ceil(specs.length / totalChunks);
const start = index * chunkSize;
const selected = specs.slice(start, start + chunkSize);

fs.writeFileSync(`chunk-specs-${index}.txt`, selected.join("\n"));
console.log(`Specs for chunk ${index}:`, selected);
