import { db } from '../db'

const create = async (client) => {
  // cedula
  // nombre
  // apellido
  // vehiculo
  //  direccion
  const { cedula, name, lastname, vehicle, address } = client
  console.log(cedula)
  const result = await db.execute({
    sql: `INSERT INTO client (cedula, name, lastname, vehicle, address) VALUES(?, ?, ?, ?, ?)`,
    args: [cedula, name, lastname, vehicle, address]
  })
  return result
}

const readALL = async () => {
  const result = await db.execute(`SELECT * FROM client`)
  return result
}

const read = async (cedula) => {
  const result = await db.execute({ sql: `SELECT * FROM client WHERE cedula = ?`, args: [cedula] })
  return result
}

const remove = async (cedula) => {
  const result = await db.execute({ sql: `DELETE FROM client WHERE cedula = ?`, args: [cedula] })
  return result
}

const clientModel = {
  create,
  readALL,
  read,
  remove
}

export default clientModel
