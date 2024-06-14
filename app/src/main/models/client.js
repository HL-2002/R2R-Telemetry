import { db } from '../db'

const create = async (client) => {
  // cedula
  // nombre
  // apellido
  // vehiculo
  //  direccion
  const { cedula, name, lastname, vehicle, address } = client
  const result = await db.execute(
    `INSERT INTO client (cedula, name, lastname, vehicle, address) VALUES(?, ?, ?, ?, ?)`,
    [cedula, name, lastname, vehicle, address]
  )
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM client`)
  return result
}

const read = async (cedula) => {
  const result = await db.execute(`SELECT * FROM client WHERE cedula = ?`, [cedula])
  return result
}

const remove = async (cedula) => {
  const result = await db.execute(`DELETE FROM client WHERE cedula = ?`, [cedula])
  return result
}

const clientModel = {
  create,
  readALL,
  read,
  remove
}

export default clientModel
