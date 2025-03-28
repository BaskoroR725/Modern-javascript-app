const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class usersRepository extends Repository{
  async comparePassword(saved, supplied){
    // Saved  => password saved in our database. 'hashed.salt
    // Supplied => password given to us by a user trying sign in
    const [ hashed, salt ] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString('hex');
  }
  
  async create(attrs){
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attrs.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`
    }
    records.push( record );

    await this.writeAll(records)

    return record;
  }

  
}

module.exports = new usersRepository('users.json');

/* const test = async() =>{
  const repo = new usersRepository('users.json');

/*   await repo.create({ email: 'test@test.com}', password:'test'})

  const users =  await repo.getAll(); */

  /*  const user = await repo.getOne('3cf850df');

  await repo.update('3cf850df', { password: 'myPassword'}); */

  /* const user = await repo.getOneBy({
    id: '3cf850df',
    email: "test@test.com}"
  });
  
  console.log(user);

} 

test();

*/
