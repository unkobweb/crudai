const baseUrl = "http://localhost:3333"

export const getUsers = async () => {
  const users = await fetch(`${baseUrl}/users`)
  return await users.json()
}