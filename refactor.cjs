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
        } catch { /* Ignore non-empty directory during migration. */ }
      } else {
        // file conflict, just overwrite or log
        fs.renameSync(srcPath, destPath);
      }
    } else {
      fs.renameSync(srcPath, destPath);
    }
  }
  try {
    fs.rmdirSync(srcDir);
  } catch { /* Ignore non-empty directory during migration. */ }
}

// 1. Move quiz-attempts -> quiz
moveDirContents(
  path.join(__dirname, "src/modules/quiz-attempts"),
  path.join(__dirname, "src/modules/quiz"),
);
// 2. Move exam-administration -> exam
moveDirContents(
  path.join(__dirname, "src/modules/exam-administration"),
  path.join(__dirname, "src/modules/exam"),
);
// Move sections
moveDirContents(
  path.join(__dirname, "src/sections/exams"),
  path.join(__dirname, "src/sections/exam"),
);
moveDirContents(
  path.join(__dirname, "src/sections/exam-administration"),
  path.join(__dirname, "src/sections/exam"),
);
// Move API routes
moveDirContents(
  path.join(__dirname, "src/app/api/attempts"),
  path.join(__dirname, "src/app/api/quizzes/attempts"),
);
moveDirContents(
  path.join(__dirname, "src/app/api/exam-admin"),
  path.join(__dirname, "src/app/api/exam"),
);

console.log("Directories moved successfully.");

// Now replace import paths globally
function updateImports(dir) {
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
        // Update modules
        .replace(/@\/modules\/quiz-attempts\//g, "@/modules/quiz/")
        .replace(/@\/modules\/exam-administration\//g, "@/modules/exam/")
        // Update sections
        .replace(/@\/sections\/exams\//g, "@/sections/exam/")
        .replace(/@\/sections\/exam-administration\//g, "@/sections/exam/")
        // Update APIs (fetch calls or absolute api calls)
        .replace(/\/api\/exam-admin/g, "/api/exam")
        .replace(/\/api\/attempts/g, "/api/quizzes/attempts")
        // factory imports in API routes
        .replace(/@\/app\/api\/exam-admin\//g, "@/app/api/exam/")
        .replace(/@\/app\/api\/attempts\//g, "@/app/api/quizzes/attempts/");

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log(`Updated imports in ${filePath}`);
      }
    }
  }
}

updateImports(path.join(__dirname, "src"));

console.log("Imports updated successfully.");
