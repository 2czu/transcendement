import { updateUserStatus } from '../controllers/usersController.js';
import { verifyToken } from '../jwt.js';
const websocketsRoutes = async (fastify, opts) => {
    const { db } = opts;
    fastify.get('/connexionStatus', { websocket: true }, (connection, req) => {
        // 	console.log(connection);
        // if (!connection || !connection.socket) {
        //   console.error('WebSocket connection or socket is undefined');
        //   return;
        // }
        try {
            console.log("\n---------------\n");
            let token = req.cookies.jwt;
            if (!token) {
                connection.close();
                return;
            }
            const decoded = verifyToken(token);
            if (!decoded?.userId) {
                connection.close();
                return;
            }
            const userId = decoded.userId;
            console.log(userId + "\n\n");
            updateUserStatus(db, userId, true);
            console.log(`${userId} is online`);
            connection.on('close', () => {
                updateUserStatus(db, userId, false);
                console.log(`${userId} is offline`);
            });
        }
        catch (err) {
            console.log(err);
            connection.close();
        }
    });
};
export default websocketsRoutes;
