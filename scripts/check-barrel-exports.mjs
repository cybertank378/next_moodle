import { readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

async function findBarrelExports(dir) {
  let hasError = false;
  
  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        const parsed = parse(entry.name);
        if (parsed.name === 'index' && (parsed.ext === '.ts' || parsed.ext === '.tsx')) {
          console.error(`❌ NO BARREL EXPORT ALLOWED: Found barrel export at ${fullPath}`);
          hasError = true;
        }
      }
    }
  }

  await walk(dir);
  
  if (hasError) {
    console.error('\n🚨 Barrel exports (index.ts / index.tsx) are strictly forbidden in this project due to Hexagonal / DDD module boundary constraints.');
    process.exit(1);
  } else {
    console.log('✅ No barrel exports found. Architecture constraint satisfied.');
    process.exit(0);
  }
}

findBarrelExports('./src').catch(err => {
  console.error(err);
  process.exit(1);
});
