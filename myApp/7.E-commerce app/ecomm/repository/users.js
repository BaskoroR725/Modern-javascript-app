const fs = require('fs');
const crypto = require('crypto');

class usersRepository{
  constructor(filename){
    if(!filename){
      throw new Error('There is a error happen');
    }
    this.filename = filename;
    try{
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]');
    }
  }

  async getAll(){
    return JSON.parse(
      await fs.promises.readFile(this.filename, { 
        encoding : 'utf8'
      })
    );
  }

  async create(attrs){
    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records)
  }
  
  async writeAll(records){
    await fs.promises.writeFile(
      this.filename, JSON.stringify(records, null, 2)
    )
  }

  randomId(){
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id){
    const records = await this.getAll();
    return records.find(record => record.id === id);
  }

  async delete(id){
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecords);
  }

}

const test = async() =>{
  const repo = new usersRepository('users.json');

/*   await repo.create({ email: 'test@test.com}', password:'test'})

  const users =  await repo.getAll(); */

  const user = await repo.getOne('3cf850df');

  console.log(user);
}

test();