import { FastifyPluginAsync } from 'fastify';
import { Database } from 'sqlite';
import { createMatch, getMatches } from '../controllers/matchesController.js'
import { matchProperties } from '../schemas/schema.js';

const matchesRoutes: FastifyPluginAsync <{ db: Database }> = async (fastify: any, opts: any) => {
	const { db } = opts;

	fastify.route({
		method: 'POST',
		url: "/newMatch",
		schema: {
			body: {
				type: 'object',
				required: ['winner_id', 'score_player1', 'score_player2'],
				properties: {
					winner_id: { type: 'number' },
					score_player1: { type: 'number', minimum: 0 },
					score_player2: { type: 'number', minimum: 0 }
				},
				additionalProperties: false,
			},
			response: {
				201: { type: 'null'}
				},
			},
		handler: async(request: any, reply: any) => {
			const {
				winner_id,
				score_player1,
				score_player2,
			} = request.body as {
				winner_id: number;
				score_player1: number;
				score_player2: number;
			};
			try {
				const userId = request.user.userId;
				let win;
				if (winner_id === 1)
					win = userId;
				else
					win = 1;
				const match = await createMatch(db, userId, win, score_player1, score_player2);
				if ('error' in match) {
					reply.code(409).send({ error: match.error });
					return ;
				}
				reply.code(201).send();
			} catch (err: any) {
				if (err.code === 'SQLITE_CONSTRAINT') {
						reply.code(409).send({ error: 'constraint problems' });
				} else {
					throw err;
				}
			};
		},
	});
	fastify.route({
		method: 'GET',
		url: "/matches",
		schema: {
			response:  {
				200: matchProperties,
				404: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				}
			}
		},
		handler: async(request: any, reply: any) => {
			let userId = request.user.userId;
			try {
				const matches = await getMatches(db, userId);
				reply.send(matches);
			} catch (err) {
				reply.code(500).send({ error: 'Failed to fetch user' }); 
			}
		}
	});
}
export default matchesRoutes;