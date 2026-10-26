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
  assert.deepEqual((await readdir('dist')).sort(),['facade-to-interior.html','images','index.html','interior-segmentation.html','internal-wall-inference.html','models','scripts','styles']);
});
test('all source module relative imports resolve after moving',async()=>{
  for(const dir of ['src/pages','src/components'])for(const file of await readdir(dir)){
    const path=resolve(dir,file),source=await readFile(path,'utf8');
    for(const [,specifier] of source.matchAll(/from\s+['"]([^'"]+)['"]/g))if(specifier.startsWith('.'))await access(resolve(dirname(path),specifier));
  }
});

test('photogrammetry viewer publishes a complete textured GLB',async()=>{
  const html=await readFile('dist/facade-to-interior.html','utf8');
  const [,modelPath]=html.match(/data-model-src="([^"]+)"/);
  const bytes=await readFile(resolve('dist',modelPath));
  assert.equal(bytes.readUInt32LE(0),0x46546c67);
  assert.equal(bytes.readUInt32LE(4),2);
  assert.equal(bytes.readUInt32LE(8),bytes.length);
  const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
  assert.ok(json.accessors[0].count>0);
  assert.ok(json.accessors[2].count/3<500000,'Mesh stays within the browser triangle budget');
  assert.equal(json.images[0].mimeType,'image/jpeg');
  for(const view of json.bufferViews)assert.ok(view.byteOffset+view.byteLength<=json.buffers[0].byteLength);
});
