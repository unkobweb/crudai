import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from '../../app/Models/User'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name: "Alexandre",
        age: 23
      },
      {
        name: "Léone",
        age: 22
      }
    ])
  }
}
