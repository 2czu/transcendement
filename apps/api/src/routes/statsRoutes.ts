import { FastifyPluginAsync } from 'fastify';
import { Database } from 'sqlite';
import { incrementGameplayed, getStats } from '../controllers/statsController.js'

const statsRoute: FastifyPluginAsync <{ db: Database }> = async (fastify: any, opts: any) => {
	const { db } = opts;

fastify.route({
		method: 'PATCH',
		url: "/incrementGameplayed",
		schema: {
			body: {
				type: 'object',
				required: ['player1_id', 'player2_id'],
				properties: {
					player1_id: { type: 'number' },
					player2_id : { type: 'number'},
				},
				additionalProperties: false,
			},
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
		handler: async(request: any, reply: any) => {
			const { player1_id, player2_id } = request.body;
			try {
				const gameplayed = await incrementGameplayed(db, player1_id, player2_id);
				if ('error' in gameplayed) {
					reply.code(404).send({ error : gameplayed.error })
				}
				reply.send({ message: gameplayed.message});
			} catch (err) {
				reply.code(500).send({ error: 'Failed to increment game played' }); 
			}
		}
	});
		fastify.route({
			method: 'GET',
			url: "/stats",
			schema: {
				response:  {
					200: {
						type: 'object',
						properties: {
							game_played: { type: 'number' },
							games_won: { type: 'number' },
							total_score: { type: 'number' }
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
			handler: async(request: any, reply: any) => {
				const userId = (request as any).user.userId;
				try {
					const stats = await getStats(db, userId);
					if (!stats)
					{
						reply.code(404).send({ error: "User not found"});
						return ;
					}
					reply.send(stats);
				} catch (err) {
					reply.code(500).send({ error: 'Failed to fetch user stats' }); 
				}
			}
		});
}
export default statsRoute;
