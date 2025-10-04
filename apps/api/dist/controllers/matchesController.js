export const createMatch = async (db, player1_id, winner_id, score_player1, score_player2) => {
    const p1Exist = await db.get('SELECT 1 FROM users WHERE id = ?', [player1_id]);
    if (!p1Exist)
        return { error: 'Invalid player1 id' };
    if (player1_id != winner_id)
        return { error: 'Invalid winner id' };
    const result = await db.run(`INSERT INTO matches (player1_id, player2_id, winner_id, score_player1, score_player2) VALUES (?,?,?,?,?)`, [player1_id, 0, winner_id, score_player1, score_player2]);
    await db.run("UPDATE stats SET games_won = games_won + 1, total_score = total_score + ?, game_played = game_played + 1 WHERE user_id = ?", [score_player1, player1_id]);
    return result;
};
export const getMatches = async (db, player_id) => {
    const result = await db.all('SELECT * FROM matches WHERE player1_id = ?', [player_id]);
    return result;
};
