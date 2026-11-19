/* Evaluates data scripts of the app (level content, wine database) in a sandbox and prints the requested globals as JSON.
   Usage: node tools/i18n/dump_js.js <file.js> NAME [NAME…]   (functions are dropped) */
const fs = require("fs"), vm = require("vm");
const [file, ...names] = process.argv.slice(2);
const ctx = { console: { log() {}, warn() {} } }; ctx.window = ctx; ctx.self = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
const o = {}; for (const n of names) o[n] = ctx[n];
process.stdout.write(JSON.stringify(o));
