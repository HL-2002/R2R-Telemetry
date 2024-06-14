import { db } from '../db'

// id
// description
// percentage

const create = async (tax) => {
  const { description, percentage } = tax
  const result = await db.execute(`INSERT INTO tax (description, percentage) VALUES(?, ?)`, [
    description,
    percentage
  ])
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM tax`)
  return result
}

const update = async (tax) => {
  const { id, description, percentage } = tax
  const result = await db.execute(`UPDATE tax SET description = ?, percentage = ? WHERE id = ?`, [
    description,
    percentage,
    id
  ])
  return result
}

const read = async (id) => {
  const result = await db.execute(`SELECT * FROM tax WHERE id = ?`, [id])
  return result
}

const taxModel = {
  create,
  readALL,
  read,
  update
}

export default taxModel
