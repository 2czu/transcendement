import { Database } from 'sqlite'

export const incrementGameplayed = async (db: Database, player1_id: number):
	Promise<any | { error: string }> => {
	const player1 = await db.get('SELECT * FROM users WHERE id = ?', [player1_id]);
	if (!player1)
		return { error: 'user' };
	await db.get("UPDATE stats SET game_played = game_played + 1 WHERE id = ? ", [player1_id]);
	return { message : "incremented"};
};

export const getStats = async (db: Database, id: number) => {
	const stats = await db.get('SELECT game_played, games_won, total_score FROM stats WHERE user_id = ?', [id]);
	return stats;
};