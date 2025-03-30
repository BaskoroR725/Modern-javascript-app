const fs = require('fs');
const path = reqquire('path');

class Runner{
  constructor(){
    this.testFiles = [];
  }

  async runTests(){
    for (let file of this.testFiles){
      for (let file of this.testFiles){
        const beforeEaches = [];
        global.beforeEach = (fn) =>{
          beforeEaches.push(fn);
        };
        global.it = (desc, fn) =>{
          beforeEaches.forEach(func => func());
          try{
            fn();
            console.log(`OK - ${desc}`)
          } catch(err) {
            console.log(`X - ${desc}`);
            console.log('\t', err.message);
          }
        };
        try{
          require(file.name);
        } catch (err){
          console.log('X - Error loading file');
          console.log(err);
        }
      };

    }
  }

  async collectFiles(targetedPath){
    const files = await fs.promises.readdir(targetedPath);
  
    for (let file of files){
      const filepath = path.join(targetedPath, file);
      const stats = await fs.promises.lstat(filepath);

      if (stats.isFile() && file.includes('.test.js')){
        this.testFiles.push({ name: filepath })
      } else if (stats.isDirectory()) {
        const childFiles = await fs.promises.readdir(filepath);

        files.push(...childFiles.map(f => path.join(file, f)));
      }
    }
  }


}

module.exports = Runner;