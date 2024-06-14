import { db } from '../db'

// id
// total
// cost
// id_tax
// id_session

const create = async (bill) => {
  const { total, cost, id_tax, id_session } = bill
  const result = await db.execute(
    `INSERT INTO tax (total, cost, id_tax, id_session) VALUES(?, ?, ?, ?)`,
    [total, cost, id_tax, id_session]
  )
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM tax`)
  return result
}

const read = async (id) => {
  const result = await db.execute(`SELECT * FROM tax WHERE id = ?`, [id])
  return result
}

const billModel = {
  create,
  readALL,
  read
}

export default billModel
