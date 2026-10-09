const fs = require("node:fs");
const path = require("node:path");

function moveDirContents(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(srcDir);
  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);

    if (fs.existsSync(destPath)) {
      if (fs.statSync(srcPath).isDirectory()) {
        moveDirContents(srcPath, destPath);
        try {
          fs.rmdirSync(srcPath);
        } catch {
          /* Ignore non-empty directory during migration. */
        }
      } else {
        fs.renameSync(srcPath, destPath);
      }
    } else {
      fs.renameSync(srcPath, destPath);
    }
  }
  try {
    fs.rmdirSync(srcDir);
  } catch {
    /* Ignore non-empty directory during migration. */
  }
}

// Move sections
moveDirContents(
  path.join(__dirname, "src/sections/tenants"),
  path.join(__dirname, "src/sections/tenant"),
);
moveDirContents(
  path.join(__dirname, "src/sections/tenant-management"),
  path.join(__dirname, "src/sections/tenant"),
);
// Also check app/api
moveDirContents(
  path.join(__dirname, "src/app/api/tenants"),
  path.join(__dirname, "src/app/api/tenant"),
);

console.log("Directories moved successfully.");

function updateImports(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!["node_modules", ".git"].includes(file)) {
        updateImports(filePath);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      const content = fs.readFileSync(filePath, "utf8");
      const newContent = content
        .replace(/@\/sections\/tenants\//g, "@/sections/tenant/")
        .replace(/@\/sections\/tenant-management\//g, "@/sections/tenant/")
        .replace(/\/api\/tenants/g, "/api/tenant")
        .replace(/@\/app\/api\/tenants\//g, "@/app/api/tenant/");

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log(`Updated imports in ${filePath}`);
      }
    }
  }
}

updateImports(path.join(__dirname, "src"));

console.log("Imports updated successfully.");
