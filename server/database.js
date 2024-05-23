import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getUserByID(id) {
  const [row] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return row[0];
}
export async function getPetByUserID(id) {
  const [row] = await pool.query(`SELECT * FROM pets WHERE user_id = ?`, [id]);
  return row[0];
}
export async function getUserByEmailAndPassword(email, password) {
  const [row] = await pool.query(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password]
  );
  return row[0];
}
export async function getUserByEmail(email) {
  const [row] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email
  ]);
  return row[0];
}
export async function getUserByNumber(number) {
  const [row] = await pool.query(`SELECT * FROM users WHERE number = ?`, [
    number,
  ]);
  return row[0];
}
export async function getUsers() {
  const [rows] = await pool.query(`SELECT * FROM users`);
  return rows;
}
export async function getPets() {
  const [rows] = await pool.query(`SELECT * FROM pets`);
  return rows;
}
export async function createUser(name, email, number, password, type, latitude, longitude,online_status) {

  const [result] = await pool.query(
    `INSERT INTO users(name, email, number, password, type, latitude, longitude, online_status) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?);`,
    [name, email, number, password, type, latitude, longitude, online_status]
  );
  const userID = result.insertId;
  return getUserByID(userID);
}

export async function updateUserLocation(userID, latitude, longitude) {
  try {
    await pool.query(
      `UPDATE users 
       SET latitude = ?, longitude = ?
       WHERE id = ?`,
      [latitude, longitude, userID]
    );
    console.log(`Ubicación actualizada para el usuario con ID: ${userID}`);
  } catch (error) {
    console.error("Error al actualizar la ubicación del usuario:", error);
    throw error;
  }
}

export async function updateUserOnlineStatus(userID, onlineStatus) {
  try {
    await pool.query(
      `UPDATE users 
       SET online_status = ?
       WHERE id = ?`,
      [onlineStatus, userID]
    );
    console.log(`Estado de conexión actualizado para el usuario con ID: ${userID}`);
  } catch (error) {
    console.error("Error al actualizar el estado de conexión del usuario:", error);
    throw error;
  }
}

export async function updateUserDetails(userID, name, email, number) {
  try {
    await pool.query(
      `UPDATE users 
       SET name = ?, email = ?, number = ?
       WHERE id = ?`,
      [name, email, number, userID]
    );
    console.log(`Usuario actualizado con ID: ${userID}`);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
}
//reservations
export async function createReservation(userId, walkerId, date, time, duration) {
  try {
    const [result] = await pool.query(
      `INSERT INTO reservations (userId, walkerId, date, time, duration) 
      VALUES (?, ?, ?, ?, ?);`,
      [userId, walkerId, date, time, duration]
    );
    const reservationId = result.insertId;
    return reservationId;
  } catch (error) {
    console.error('Error creando reserva:', error);
    throw error;
  }
}

export async function updateReservationStatus(reservationId, status) {
  try {
    await pool.query(
      `UPDATE reservations 
       SET status = ?
       WHERE id = ?`,
      [status, reservationId]
    );
    console.log(`Estado de la reserva actualizado exitosamente.`);
  } catch (error) {
    console.error('Error actualizando estado de la reserva:', error);
    throw error;
  }
}

export async function addRatingAndReview(reservationId, rating, review) {
  try {
    await pool.query(
      `UPDATE reservations 
       SET rating = ?, review = ?
       WHERE id = ?`,
      [rating, review, reservationId]
    );
    console.log(`Reseña agregada exitosamente.`);
  } catch (error) {
    console.error('Error agregando reseña:', error);
    throw error;
  }
}
export async function updateWalkerScore(walkerId, newScore) {
  try {
    await pool.query(
      `UPDATE users 
       SET score = ?
       WHERE id = ? AND type = 'walker'`,
      [newScore, walkerId]
    );
    console.log(`Puntaje actualizado para el paseador con ID: ${walkerId}`);
  } catch (error) {
    console.error("Error al actualizar el puntaje del paseador:", error);
    throw error;
  }
}
export async function getUserReservations(userId) {
  try {
    const [rows] = await pool.query(`SELECT * FROM reservations WHERE userId = ?`, [userId]);
    return rows;
  } catch (error) {
    console.error('Error al obtener las reservas del usuario desde la base de datos:', error);
    throw error;
  }
}
export async function getWalkerReservations(walkerId) {
  try {
    const [rows] = await pool.query(`SELECT * FROM reservations WHERE walkerId = ?`, [walkerId]);
    return rows;
  } catch (error) {
    console.error('Error al obtener las reservas del paseador desde la base de datos:', error);
    throw error;
  }
}