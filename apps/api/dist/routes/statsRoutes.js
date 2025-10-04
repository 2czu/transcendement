import { incrementGameplayed, getStats } from '../controllers/statsController.js';
const statsRoute = async (fastify, opts) => {
    const { db } = opts;
    fastify.route({
        method: 'PATCH',
        url: "/incrementGameplayed",
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    },
                    404: {
                        type: 'object',
                        properties: {
                            error: { type: 'string' }
                        }
                    }
                },
            },
        },
        handler: async (request, reply) => {
            const userId = request.user.userId;
            try {
                const gameplayed = await incrementGameplayed(db, userId);
                if ('error' in gameplayed) {
                    reply.code(404).send({ error: gameplayed.error });
                }
                reply.send({ message: gameplayed.message });
            }
            catch (err) {
                reply.code(500).send({ error: 'Failed to increment game played' });
            }
        }
    });
    fastify.route({
        method: 'GET',
        url: "/stats",
        schema: {
            response: {
                200: {
                    type: 'object',
                    properties: {
                        game_played: { type: 'number' },
                        games_won: { type: 'number' },
                        total_score: { type: 'number' },
                        goal_taken: { type: 'number' }
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        },
        handler: async (request, reply) => {
            const userId = request.user.userId;
            try {
                const stats = await getStats(db, userId);
                if (!stats) {
                    reply.code(404).send({ error: "User not found" });
                    return;
                }
                reply.send(stats);
            }
            catch (err) {
                reply.code(500).send({ error: 'Failed to fetch user stats' });
            }
        }
    });
};
export default statsRoute;
