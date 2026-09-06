import {build} from 'esbuild';
import {mkdir,rm,cp,appendFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import config from '../config/build.mjs';
process.chdir(fileURLToPath(new URL('..',import.meta.url)));
await mkdir('logs',{recursive:true});
try {
  await rm('dist',{recursive:true,force:true});
  await cp('public','dist',{recursive:true});
  await cp('src/styles','dist/styles',{recursive:true});
  await build(config);
  await appendFile('logs/build.log',`${new Date().toISOString()} OK build dist/\n`);
  console.log('Built dist/ (HTML, images, styles, bundled scripts).');
} catch(error) {
  await appendFile('logs/error.log',`${new Date().toISOString()} BUILD ${error.stack}\n`);
  throw error;
}
