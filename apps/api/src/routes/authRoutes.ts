import { FastifyPluginAsync } from 'fastify';
import { Database } from 'sqlite';
import { googleOAuth } from '../controllers/authController.js';

const authRoutes: FastifyPluginAsync <{ db: Database }> = async (fastify: any, opts: any) => {
	const { db } = opts;

	fastify.route({
		method: 'POST',
		url: "/auth/google/callback",
		schema: {
			body: {
				type : 'object',
				required: ['id_token'],
				properties: {
					id_token: {type: 'string' }
				}
			},
			response: {
				201: { message: 'string' },
				},
			},
		handler: async(request: any, reply: any) => {
			const { id_token } = request.body as { id_token: string };
			try {
				const google = await googleOAuth(db, id_token);
				reply.setCookie('jwt', google, {
					httpOnly: true,
					secure: true,
					sameSite: 'none',
					path: '/',
				})
				.code(201).send({ message: 'Connected with google'})
			} catch (err: any) {
				if (err.code === 'SQLITE_CONSTRAINT') {
						reply.code(409).send({ error: 'Constraint problems' });
				} else {
					throw err;
				}
			};
		},
	});
}
export default authRoutes;