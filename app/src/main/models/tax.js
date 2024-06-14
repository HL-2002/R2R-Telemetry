import { db } from '../db'

// id
// description
// percentage

const create = async (tax) => {
  const { description, percentage } = tax
  const result = await db.execute({
    sql: `INSERT INTO tax (description, percentage) VALUES(?, ?)`,
    args: [description, percentage]
  })
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM tax`)
  return result
}

const update = async (tax) => {
  const { id, description, percentage } = tax
  const result = await db.execute({
    sql: `UPDATE tax SET description = ?, percentage = ? WHERE id = ?`,
    args: [description, percentage, id]
  })
  return result
}

const read = async (id) => {
  const result = await db.execute({ sql: `SELECT * FROM tax WHERE id = ?`, args: [id] })
  return result
}

const taxModel = {
  create,
  readALL,
  read,
  update
}

export default taxModel
