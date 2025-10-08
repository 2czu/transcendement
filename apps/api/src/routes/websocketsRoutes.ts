import { FastifyPluginAsync, FastifyInstance, FastifyRequest } from 'fastify';
import { Database } from 'sqlite';
import { updateUserStatus } from '../controllers/usersController.js';
import { verifyToken } from '../jwt.js';

interface TokenPayload {
    userId: number;
}

const websocketsRoutes: FastifyPluginAsync <{ db: Database }> = async (fastify: FastifyInstance, opts: any) => {
	const { db } = opts;

	fastify.get('/connexionStatus', { websocket: true }, (connection: any, req: FastifyRequest) => {
		try {
			let token = req.cookies.jwt;
			if (!token) {
				connection.close();
				return ;
			}
			const decoded = verifyToken(token) as TokenPayload | null;
			if (!decoded?.userId)
			{
				connection.close();
				return ;
			}
			const userId = decoded.userId;
			updateUserStatus(db, userId, true);
			console.log(`${userId} is online`);
			connection.on('close', () => {
				updateUserStatus(db, userId, false);
				console.log(`${userId} is offline`);

			});
		} catch (err) {
			console.log(err);
			connection.close();
		}
	});
}
export default websocketsRoutes;