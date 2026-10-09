const fs = require("node:fs");
const path = require("node:path");

const srcDir = path.resolve("d:/Project/Website/next-moodle/src");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  const originalContent = content;

  const regex =
    /(from|import|export|vi\.mock|jest\.mock)\s*\(?\s*['"](\.[^'"]+)['"]/g;

  content = content.replace(regex, (match, _keyword, relativePath) => {
    const fileDir = path.dirname(file);
    const resolvedPath = path.resolve(fileDir, relativePath);

    if (resolvedPath.startsWith(srcDir)) {
      const aliasPath = resolvedPath.replace(srcDir, "@").replace(/\\/g, "/");
      return match.replace(relativePath, aliasPath);
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, "utf8");
    changedFiles++;
  }
});

console.log(`Replaced relative imports in ${changedFiles} files.`);
