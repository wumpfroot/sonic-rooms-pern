const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

//Routes

// GET ALL ROOMS
app.get("/rooms", async (req, res) => {
	try {
		const allRooms = await pool.query("SELECT * FROM room");
		res.json(allRooms.rows);
	} catch (error) {
		console.error(error.message);
	}
});

// GET A ROOM WHERE ID MATCHES THE PARAM IN THE REQUEST
app.get("/rooms/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const room = await pool.query("SELECT * FROM room WHERE id = $1", [id]);

		res.json(room.rows[0]);
	} catch (error) {
		console.error(error.message);
	}
});

// POST A BOOKING
app.post("/booking", async (req, res) => {
	try {
		const { room_id, start_time, end_time, created_at, booking_date, user_id } = req.body;
		const newBooking = await pool.query(
			"INSERT INTO booking (room_id, start_time, end_time, created_at, booking_date, user_id) VALUES($1) RETURNING *"[(room_id, start_time, end_time, created_at, booking_date, user_id)]
		);
		res.json(newBooking.rows[0]);
	} catch (error) {
		console.error(error);
	}
});

// GET A BOOKING OF A CERTAIN USER
app.get("/booking/:user_id", async (req, res) => {
	try {
		const { user_id } = req.params;
		const allUserBookings = await pool.query('SELECT * FROM booking JOIN "user" ON booking.user_id = "user".id WHERE booking.user_id = $1', [user_id]);
		res.json(allUserBookings.rows);
	} catch (error) {
		console.error(error.message);
	}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server has started on port ${PORT}`);
});
