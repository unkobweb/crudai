import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User, { userUpdatableColumns } from '../../Models/User'
import { OpenAIService } from '../../Services/OpenAIService'

export default class UsersController {

  private openaiService: OpenAIService

  constructor() {
    this.openaiService = new OpenAIService()
  }

  async getAll({response}: HttpContextContract) {
    const users = await User.all()
    return response.json(users)
  }

  async askAI({request, response}: HttpContextContract) {
    const threadId = await this.openaiService.createThread()
    const userRequest = request.input("request")

    const users = await User.all()

    const obj = {
      userRequest: userRequest,
      //@ts-ignore
      columns: Object.values(User.$keys.serializedToAttributes.keys),
      primaryKey: User.primaryKey,
      updatableColumns: userUpdatableColumns,
      data: users
    }

    const message = await this.openaiService.chat(threadId, JSON.stringify(obj))

    console.log({message})
    const instructions = JSON.parse(message).instructions

    const promiseArray: Promise<any>[] = []

    for (const instruction of instructions) {
      const splittedInstruction = instruction.split("|")
      console.log(splittedInstruction)
      if (splittedInstruction[0] === 'CREATE') {
        const entry = JSON.parse(splittedInstruction[1])
        promiseArray.push(User.create(entry))
        continue
      }
      if (splittedInstruction[0] === "UPDATE") {
        const user = await User.find(splittedInstruction[1])
        if (!user) continue

        const newAttributes = JSON.parse(splittedInstruction[2])

        for (const attribute in newAttributes) {
          user[attribute] = newAttributes[attribute]
        }

        promiseArray.push(user.save())
        continue
      }
      if (splittedInstruction === "DELETE") {
        const deletePromise = User.query().where(User.primaryKey,splittedInstruction[1]).delete()
        promiseArray.push(deletePromise)
      }
    }

    await Promise.all(promiseArray)

    return await User.all()
  }
}
