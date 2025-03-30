const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Runner{
  constructor(){
    this.testFiles = [];
  }

  async runTests(){
    for (let file of this.testFiles){
      console.log(chalk.grey(`---- ${file.shortName}`))
        const beforeEaches = [];
        global.beforeEach = (fn) =>{
          beforeEaches.push(fn);
        };
        global.it = (desc, fn) =>{
          beforeEaches.forEach(func => func());
          try{
            fn();
            console.log(chalk.green(`\tOK - ${desc}`));
          } catch(err) {
            const message = err.message.replace(/\n/g, '\n\t\t');
            console.log(chalk.red(`\tX - ${desc}`));
            console.log(chalk.red('\t', err.message));
          }
        };
        try{
          require(file.name);
        } catch (err){
          console.log('X - Error loading file');
          console.log(chalk.red(err));
        }
      };
    }

  async collectFiles(targetedPath){
    const files = await fs.promises.readdir(targetedPath);
  
    for (let file of files){
      const filepath = path.join(targetedPath, file);
      const stats = await fs.promises.lstat(filepath);

      if (stats.isFile() && file.includes('.test.js')){
        this.testFiles.push({ name: filepath, shortName: file })
      } else if (stats.isDirectory()) {
        const childFiles = await fs.promises.readdir(filepath);

        files.push(...childFiles.map(f => path.join(file, f)));
      }
    }
  }


}

module.exports = Runner;