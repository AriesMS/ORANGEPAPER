import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';

test('all published HTML links, scripts, styles and images resolve',async()=>{
  const pages=(await readdir('dist')).filter(p=>p.endsWith('.html'));
  assert.equal(pages.length,4);
  for(const page of pages){
    const html=await readFile(`dist/${page}`,'utf8');
    for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
      if(/^(?:https?:|data:|mailto:|#)/.test(url))continue;
      await access(resolve('dist',url.split(/[?#]/)[0]));
    }
  }
  for(const file of ['journey.js','facade-study.js'])new vm.Script(await readFile(`dist/scripts/${file}`,'utf8'));
});
test('published output excludes documentation and raw research',async()=>{
  assert.deepEqual((await readdir('dist')).sort(),['facade-to-interior.html','images','index.html','interior-segmentation.html','internal-wall-inference.html','scripts','styles']);
});
test('all source module relative imports resolve after moving',async()=>{
  for(const dir of ['src/pages','src/components'])for(const file of await readdir(dir)){
    const path=resolve(dir,file),source=await readFile(path,'utf8');
    for(const [,specifier] of source.matchAll(/from\s+['"]([^'"]+)['"]/g))if(specifier.startsWith('.'))await access(resolve(dirname(path),specifier));
  }
});
