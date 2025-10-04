import { createFriend, getFriendList, getFriendsRequest, acceptFriend, deleteFriend, BlockFriend } from '../controllers/friendsController.js';
import { friendProperties } from '../schemas/schema.js';
const friendsRoutes = async (fastify, opts) => {
    const { db } = opts;
    fastify.route({
        method: 'POST',
        url: "/friendRequest",
        schema: {
            body: {
                type: 'object',
                required: ['friend_id'],
                properties: {
                    friend_id: { type: 'number' },
                },
                additionalProperties: false,
            },
            response: {
                201: { type: 'null' },
            },
        },
        handler: async (request, reply) => {
            const { friend_id, status = 'pending', } = request.body;
            try {
                let userId = request.user.userId;
                const friend = await createFriend(db, userId, friend_id, status);
                if (friend?.error == 'same id') {
                    reply.code(409).send({ error: "feeling lonely ? You can't be friend with yourself sorry" });
                    return;
                }
                if (friend?.error == 'friend') {
                    reply.code(409).send({ error: 'Friend request already exist' });
                    return;
                }
                if (friend?.error == 'user id') {
                    reply.code(409).send({ error: 'Invalid userID' });
                    return;
                }
                if (friend?.error == 'friend id') {
                    reply.code(409).send({ error: 'Invalid friendID' });
                    return;
                }
                reply.code(201).send();
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
    fastify.route({
        method: 'GET',
        url: "/friendlist",
        schema: {
            response: {
                200: friendProperties,
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
                const matches = await getFriendList(db, userId);
                reply.code(200).send(matches);
            }
            catch (err) {
                reply.code(500).send({ error: 'Failed to fetch user' });
            }
        }
    });
    fastify.route({
        method: 'GET',
        url: "/friendReq",
        schema: {
            response: {
                200: friendProperties,
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
                const matches = await getFriendsRequest(db, userId);
                reply.code(200).send(matches);
            }
            catch (err) {
                reply.code(500).send({ error: 'Failed to fetch user' });
            }
        }
    });
    fastify.route({
        method: 'PATCH',
        url: "/friendAccept",
        schema: {
            body: {
                type: 'object',
                required: ['user_id', 'friend_id'],
                properties: {
                    user_id: { type: 'number' },
                    friend_id: { type: 'number' },
                },
                additionalProperties: false,
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                },
            },
        },
        handler: async (request, reply) => {
            const { user_id, friend_id } = request.body;
            let userId = request.user.userId;
            let Idfriend;
            if (user_id != userId)
                Idfriend = user_id;
            else
                Idfriend = friend_id;
            try {
                const friend = await acceptFriend(db, userId, Idfriend);
                if (friend.changes === 0)
                    reply.code(404).send({ message: "Friend request not found" });
                reply.code(200).send({ message: "Friend request accepted" });
            }
            catch (err) {
                reply.code(500).send({ error: 'Failed to accept friend request' });
            }
        }
    });
    fastify.route({
        method: 'PATCH',
        url: "/friendRefuse",
        schema: {
            body: {
                type: 'object',
                required: ['user_id', 'friend_id'],
                properties: {
                    user_id: { type: 'number' },
                    friend_id: { type: 'number' },
                },
                additionalProperties: false,
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
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
            const { user_id, friend_id } = request.body;
            let userId = request.user.userId;
            let Idfriend;
            if (user_id != userId)
                Idfriend = user_id;
            else
                Idfriend = friend_id;
            try {
                const friend = await deleteFriend(db, userId, Idfriend);
                if (friend.changes === 0) {
                    reply.code(404).send({ error: "Friend request not found" });
                    return;
                }
                reply.send({ message: "Friend request refused" });
            }
            catch (err) {
                reply.code(500).send({ error: 'Failed to refuse friend request' });
            }
        }
    });
    fastify.route({
        method: 'PATCH',
        url: "/friendBlock",
        schema: {
            body: {
                type: 'object',
                required: ['user_id', 'friend_id'],
                properties: {
                    user_id: { type: 'number' },
                    friend_id: { type: 'number' },
                },
                additionalProperties: false,
            },
            response: {
                200: {
                    type: 'object', properties: { message: { type: 'string' } }
                },
                404: {
                    type: 'object', properties: { error: { type: 'string' } }
                }
            }
        },
        handler: async (request, reply) => {
            const { user_id, friend_id } = request.body;
            let userId = request.user.userId;
            let Idfriend;
            if (user_id != userId)
                Idfriend = user_id;
            else
                Idfriend = friend_id;
            try {
                const friend = await BlockFriend(db, userId, Idfriend);
                if (friend.changes === 0) {
                    reply.code(404).send({ error: "User not found" });
                    return;
                }
                reply.send({ message: "Blocked" });
            }
            catch (err) {
                reply.code(500).send({ error: 'Failed to block friend' });
            }
        }
    });
    fastify.route({
        method: 'DELETE',
        url: "/unblockFriend",
        schema: {
            body: {
                type: 'object',
                required: ['user_id', 'friend_id'],
                properties: {
                    user_id: { type: 'number' },
                    friend_id: { type: 'number' },
                },
                additionalProperties: false,
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            },
        },
        handler: async (request, reply) => {
            const { user_id, friend_id } = request.body;
            let userId = request.user.userId;
            let Idfriend;
            if (user_id != userId)
                Idfriend = user_id;
            else
                Idfriend = friend_id;
            try {
                const Unblock = await deleteFriend(db, userId, Idfriend);
                if (Unblock.changes === 0) {
                    reply.code(404).send({ error: "User not found" });
                    return;
                }
                reply.send({ message: "Unblocked" });
            }
            catch (err) {
                reply.code(500).send({ error: 'Failed to unblock user' });
            }
        }
    });
    fastify.delete('/deleteFriend/:id1/:id2', async (request, reply) => {
        const { id1, id2 } = request.params;
        const user = parseInt(id1);
        const friendId = parseInt(id2);
        let userId = request.user.userId;
        let Idfriend;
        if (user != userId)
            Idfriend = user;
        else
            Idfriend = friendId;
        try {
            const del = await deleteFriend(db, userId, Idfriend);
            if (del.changes === 0) {
                reply.code(404).send({ message: "Not found" });
                return;
            }
            reply.code(200).send({ message: "Friend deleted" });
        }
        catch (err) {
            reply.code(500).send({ error: 'Failed to delete user' });
        }
    });
};
export default friendsRoutes;
