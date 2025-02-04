import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import pkg from 'pg';
const { Client } = pkg;


const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || '3005';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect().then(() => {
    console.log('Connected to PostgreSQL database');
}).catch((error) => {
    console.error('Failed to connect to PostgreSQL:', error);
});

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const getRoomsFromDB = async () => {
    try {
        const res = await client.query('SELECT name FROM rooms');
        return res.rows.map(row => row.name);
    } catch (error) {
        console.error('Error fetching rooms from DB:', error);
        return [];
    }
};

const createRoomInDB = async (newRoom) => {
    try {
        const checkRes = await client.query('SELECT * FROM rooms WHERE name = $1', [newRoom]);
        if (checkRes.rows.length > 0) return null;

        const res = await client.query('INSERT INTO rooms (name) VALUES ($1) RETURNING *', [newRoom]);
        return res.rows[0];
    } catch (error) {
        console.error('Error creating room in DB:', error);
        return null;
    }
};

const getUsersInRoom = async (room) => {
    try {
        const roomRes = await client.query('SELECT id FROM rooms WHERE name = $1', [room]);
        const roomId = roomRes.rows[0]?.id;

        if (roomId) {
            const usersRes = await client.query('SELECT user_name FROM room_users WHERE room_id = $1', [roomId]);
            return usersRes.rows.map(row => row.user_name);
        }
        return [];
    } catch (error) {
        console.error('Error fetching users from room_users table:', error);
        return [];
    }
};

app.prepare().then(() => {
    const httpServer = createServer(handle);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`${socket.id} has connected`);

        socket.on("join-room", async ({ room, username }) => {
            console.log(`User ${username} joined room: ${room}`);
            socket.join(room);

            const roomRes = await client.query('SELECT id FROM rooms WHERE name = $1', [room]);
            const roomId = roomRes.rows[0]?.id;

            if (roomId) {
                await client.query('INSERT INTO room_users (room_id, user_name) VALUES ($1, $2)', [roomId, username]);
                console.log(`User ${username} added to room_users table`);
                socket.to(room).emit("user_joined", `${username} joined the room`);

                const messages = await getMessagesFromDB(room);
                socket.emit("messageHistory", messages);
            }
        });

        socket.on("leave-room", async (room) => {
            console.log(`User left room: ${room}`);
            socket.leave(room);

            const roomRes = await client.query('SELECT id FROM rooms WHERE name = $1', [room]);
            const roomId = roomRes.rows[0]?.id;

            if (roomId) {
                await client.query('DELETE FROM room_users WHERE room_id = $1 AND user_name = $2', [roomId, socket.id]);
                console.log(`User removed from room_users table`);

                socket.to(room).emit("user_left", `${socket.id} left the room`);
            }
        });

        socket.on("createRoom", async (newRoom) => {
            const room = await createRoomInDB(newRoom);
            if (room) {
                io.emit("availableRooms", await getRoomsFromDB());
            }
        });
    });
      
    socket.on("get-users-in-room", async (room) => {
        const users = await getUsersInRoom(room);
        socket.emit("users-in-room", users); // Send back the list of users
    });
    
    httpServer.listen(port, '0.0.0.0', () => {
        console.log(`Server is listening on http://${hostname}:${port}`);
    });
}).catch((err) => {
    console.error('Error preparing Next.js app:', err);
});
