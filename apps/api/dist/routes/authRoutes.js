import { googleOAuth } from '../controllers/authController.js';
const authRoutes = async (fastify, opts) => {
    const { db } = opts;
    fastify.route({
        method: 'POST',
        url: "/auth/google/callback",
        schema: {
            body: {
                type: 'object',
                required: ['id_token'],
                properties: {
                    id_token: { type: 'string' }
                }
            },
            response: {
                200: { message: 'string' },
            },
        },
        handler: async (request, reply) => {
            const { id_token } = request.body;
            try {
                const google = await googleOAuth(db, id_token);
                reply.setCookie('jwt', google, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                    expires: new Date(Date.now() + 60 * 60 * 24 * 1000)
                })
                    .code(200).send({ message: 'Connected with google' });
            }
            catch (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    reply.code(409).send({ error: 'Constraint problems' });
                }
                else {
                    throw err;
                }
            }
            ;
        },
    });
};
export default authRoutes;
