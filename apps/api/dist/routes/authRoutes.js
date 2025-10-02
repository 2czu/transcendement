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
                201: { token: 'string' },
            },
        },
        handler: async (request, reply) => {
            const { id_token } = request.body;
            try {
                const google = await googleOAuth(db, id_token);
                console.log(google);
                reply.code(201).send({ token: google });
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
