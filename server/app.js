import express from "express";
import {
  getUserByID,
  getPetByUserID,
  getUserByEmailAndPassword,
  getUserByEmail,
  getUsers,
  createUser,
  getPets,
  getUserReservations,
  getUserByNumber,
  updateUserLocation,
  updateUserOnlineStatus,
  updateUserDetails,
  addRatingAndReview,
  updateReservationStatus,
  createReservation,
  getWalkerReservations,
  updateWalkerScore,
} from "./database.js";
import cors from "cors";

const corsOptions = {
  origin: "*",
  methods: ["POST", "GET"],
  credentials: true,
};
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.get("/users", async (req, res) => {
  const users = await getUsers();
  res.status(200).send(users);
});
app.get("/user/:id", async (req, res) => {
  const user = await getUserByID(req.params.id);
  res.status(200).send(user);
});

app.get("/user/reservations/:id", async (req, res) => {
  try {
    const reservations = await getUserReservations(req.params.id);

    res.status(200).send(reservations);
  } catch (error) {
    console.error('Error al obtener las reservas del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener las reservas del usuario.' });
  }
});
app.get("/user/walker/reservations/:id", async (req, res) => {
  try {
    const reservations = await getWalkerReservations(req.params.id);

    res.status(200).send(reservations);
  } catch (error) {
    console.error('Error al obtener las reservas del paseador:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener las reservas del paseador.' });
  }
});
app.get("/user/:email/:password", async (req, res) => {
  
  try {
    const user = await getUserByEmailAndPassword(
      req.params.email,
      req.params.password
    );
    console.log(user)
    res.status(200).send(user);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error });
  }
  
});

app.get("/user/:email", async (req, res) => {
  const user = await getUserByEmail(req.params.email);
  console.log(user)
  res.status(200).send(user);
});

app.get("/user/:number", async (req, res) => {
  const user = await getUserByNumber(req.params.number);
  res.status(200).send(user);
});

app.post("/user", async (req, res) => {
  const { name, email, number, password, type } = req.body;

  const existingUserEmail = await getUserByEmail(email);
  const existingUserNumber = await getUserByNumber(number);
  if (existingUserEmail) {
    return res
      .status(400)
      .json({ error: "El correo electrónico ya está en uso." });
  } else if (existingUserNumber) {
    return res.status(400).json({ error: "El numero ya está en uso." });
  }
  try {
    const user = await createUser(name, email, number, password, type);
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});
app.get("/pets", async (req, res) => {
  const pets = await getPets();
  res.status(200).send(pets);
});
app.put("/user/onlineStatus", async (req, res) => {
  const { userId,onlineStatus } = req.body;
  console.log(onlineStatus)
  try {
    await updateUserOnlineStatus(userId, onlineStatus);
    res.status(200).send({ message: "Estado de conexión del usuario actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar el estado de conexión del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor al actualizar el estado de conexión del usuario." });
  }
});
app.put("/user/:id/location", async (req, res) => {
  const userID = req.params.id;
  const { latitude, longitude } = req.body;

  try {
    await updateUserLocation(userID, latitude, longitude);
    res.status(200).send({ message: "Ubicación del usuario actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar la ubicación del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor al actualizar la ubicación del usuario." });
  }
});
app.put('/user/:id', async (req, res) => {
  const userID = req.params.id;
  const { name, email, number } = req.body;

  try {
    await updateUserDetails(userID, name, email, number);
    res.status(200).send({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el usuario.' });
  }
});
//reservation
app.post("/reservations", async (req, res) => {
  const { userId, walkerId, date, time, duration } = req.body;

  try {
    const reservationId = await createReservation(userId, walkerId, date, time, duration);
    res.status(200).json({ id: reservationId, message: 'Reserva creada exitosamente.' });
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la reserva.' });
  }
});

app.put("/reservations/:id", async (req, res) => {
  const reservationId = req.params.id;
  const { status } = req.body;

  try {
    await updateReservationStatus(reservationId, status);
    res.status(200).json({ message: 'Estado de la reserva actualizado correctamente.' });
  } catch (error) {
    console.error('Error actualizando estado de la reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el estado de la reserva.' });
  }
});
app.put("/user/walkers/:id/score", async (req, res) => {
  const walkerId = req.params.id;
  const { score } = req.body;

  try {
    await updateWalkerScore(walkerId, score);
    res.status(200).json({ message: "Puntaje del paseador actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar el puntaje del paseador:", error);
    res.status(500).json({ error: "Error interno del servidor al actualizar el puntaje del paseador." });
  }
});
app.post("/reservations/:id/reviews", async (req, res) => {
  const reservationId = req.params.id;
  const { rating, review } = req.body;

  try {
    await addRatingAndReview(reservationId, rating, review);
    res.status(200).json({ message: 'Reseña agregada correctamente.' });
  } catch (error) {
    console.error('Error agregando reseña:', error);
    res.status(500).json({ error: 'Error interno del servidor al agregar la reseña.' });
  }
});
app.listen(8080, () => {
  console.log("Server running on port 8080");
});

