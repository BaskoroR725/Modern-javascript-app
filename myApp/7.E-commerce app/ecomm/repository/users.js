const fs = require('fs');

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
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records)
  }
  
  async writeAll(records){
    await fs.promises.writeFile(
      this.filename, JSON.stringify(records, null, 2)
    )
  }

}

const test = async() =>{
  const repo = new usersRepository('users.json');

  await repo.create({ email: 'test@test.com}', password:'test'})

  const users =  await repo.getAll();

  console.log(users);
}

test();