import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import { Database } from 'sqlite';
import { createUser, checkUser, getUser, updateUser, deleteUser, signIn, req_2fa, getProfile, getPersonnalData, anonymiseUser, upload, getAvatar } from '../controllers/usersController.js'
import { userResponseSchema, profileResponseSchema, myprofileResponseSchema } from '../schemas/schema.js';
import { verifyToken } from '../jwt.js';
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userRoutes: FastifyPluginAsync <{ db: Database }> = async (fastify: FastifyInstance, opts: any) => {
	const { db } = opts;

	fastify.route({
		method: 'POST',
		url: "/signUp",
		schema: {
			body: {
				type: 'object',
				required: ['username', 'email', 'password', 'is_2fa'],
				properties: {
					username: { type: 'string', minLength: 3 },
					email : { type: 'string', format: 'email'},
					password: {type: 'string' },
					is_2fa: { type: 'integer', enum: [0,1] },
					avatar_url: {type: 'string'},
					isLogged: {type: 'string'},
				},
				additionalProperties: false,
			},
			response: {
				201: userResponseSchema,
			},
		},
		handler: async(request: any, reply: any) => {
			const {
				username,
				email,
				password,
				is_2fa,
				avatar_url = "placeholder.jpg",
				isLogged = "offline",
			} = request.body as {
				username: string;
				email: string;
				password: string;
				is_2fa: number;
				avatar_url?: string;
				isLogged: string,
			};
			try {
				const user = await createUser(db, username, email, password, is_2fa, avatar_url, isLogged, 0);
				if (user?.error == 'username') {
					reply.code(409).send({ error: 'Username unavalaible' });
					return ;
				}
				if (user?.error == 'google account')
				{
					reply.code(409).send({ error: 'Please use the google button'})
					return ;
				}
				if (user?.error == 'email') {
					reply.code(409).send({ error: 'Email already exists' });
					return ;
				}
				reply.code(201).send(user);
			} catch (err: any) {
				if (err.code === 'SQLITE_CONSTRAINT') {
						reply.code(409).send({ error: 'constraint problems' });
				} else {
					throw err;
				}
			};
		},
	});
	fastify.post("/avatar", async (req: any, reply: any) => {
			try {
				const userId = (req as any).user.userId;
				const file = await req.file();
				if (!file)
				{
					reply.code(400).send({ error: "There is no file"});
					return ;
				}
				const allowedExt = ["image/png", "image/jpeg", "image/jpg"]
				if (!allowedExt.includes(file.mimetype)) 
				{
					reply.code(400).send({ error: "Invalid format"});
					return;
				}
				const dir = path.join(process.cwd(), "/uploads");
				console.log(dir);

				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}
				const ext = path.extname(file.filename);
				const fileName = `avatar_${userId}${ext}`;
				const filePath = path.join(dir, fileName);

				await fs.promises.writeFile(filePath, await file.toBuffer());

				await upload(db, userId, fileName);

				reply.send({ message: "Avatar Uploaded"});
			} catch (err: any) {
				if (err.code === 'SQLITE_CONSTRAINT') {
						reply.code(409).send({ error: 'constraint problems' });
				} else {
					throw err;
				}
			};
	});
	fastify.route({
		method: 'POST',
		url: "/signIn",
		schema: {
			body: {
				type: 'object',
				required: ['email', 'password'],
				properties: {
					email : { type: 'string', format: 'email'},
					password: {type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: {
					type: 'object',
					properties: {
						require2FA: {type: 'string'},
						userId: {type: 'integer'}
					},
				},
				401: {
					type: 'object',
					properties: {
						error: { type: 'string'}
					},
				}
			},
		},
		handler: async(request: any, reply: any) => {
			const {
				email,
				password,
			} = request.body as {
				email: string;
				password: string;
			};
			try {
				const res = await signIn(db, email, password);
				if (res?.error == 'email') {
					reply.code(401).send({ error: 'Invalid email' });
					return ;
				}
				if (res?.error == 'password') {
					reply.code(401).send({ error: 'Invalid password' });
					return ;
				}
				if (res?.require2FA) {
					reply.code(200).send({ require2FA: true, userId: res.userId});
					return ;
				}
				reply.setCookie('jwt', res.token, {
					httpOnly: true,
					secure: true,
					sameSite: 'none',
					path: '/',
					expires: new Date(Date.now() + 60 * 60 * 24 * 1000)
				}).code(200).send({ require2FA: false, userId: res.userId});
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
		url: "/users/:id",
		schema: {
			params: {
				type : 'object',
				required: ['id'],
				properties: {
					id: {type: 'integer' }
				}
			},
			response:  {
				200: profileResponseSchema,
				404: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				}
			}
		},
		handler: async(request: any, reply: any) => {
		 const { id } = request.params as { id: number };
			try {
				const profile = await getProfile(db, id);
				if (!profile.user)
				{
					reply.code(404).send({ error: "User not found"});
					return ;
				}
				reply.send(profile);
			} catch (err) {
				reply.code(500).send({ error: 'Failed to fetch user' }); 
			}
		}
	});
	fastify.route({
		method: 'GET',
		url: "/userId",
		schema: {
			response:  {
				200: profileResponseSchema,
				404: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				}
			}
		},
		handler: async(request: any, reply: any) => {
			try {
				reply.code(201).send({ userId: request.user.userId});
			} catch (err) {
				reply.code(500).send({ error: 'Failed to fetch user' }); 
			}
		}
	});
	fastify.route({
		method: 'GET',
		url: "/checkUser/:username",
		schema: {
			params: {
				type: 'object',
				required: ['username'],
				properties: {
					username: { type: 'string' }
				}
			},
			response:  {
				200: {
					type: 'object',
					properties: {
						id: { type: 'number' }
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
		 const { username } = request.params as { username: string };
			try {
				const user = await checkUser(db, username);
				if (!user)
				{
					reply.code(404).send({ error: "User not found"});
					return ;
				}
				reply.send(user);
			} catch (err) {
				reply.code(500).send({ error: 'Failed to fetch user' }); 
			}
		}
	});
	fastify.route({
		method: 'GET',
		url: "/myprofile",
		schema: {
			response:  {
				200: myprofileResponseSchema,
				404: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				}
			}
		},
		handler: async(request: any, reply: any) => {
			try {
				const userId = request.user.userId;
				const data = await getPersonnalData(db, userId);
				if (!data.user)
				{
					reply.code(404).send({ error: "User not found"});
					return ;
				}
				reply.send(data);
			} catch (err) {
				reply.code(500).send({ error: 'Failed to fetch user' }); 
			}
		}
	});
	fastify.route({
		method: 'PATCH',
		url: "/user/patch",
		schema: {
			body: {
				type: 'object',
				properties: {
					username: { type: 'string', minLength: 3 },
					email : { type: 'string', format: 'email'},
					password_hash: { type: 'string' },
					is_2fa: { type: 'integer', enum: [0,1] },
					secret_2fa: { type: ['string', 'null'] },
					avatar_url: { type: 'string' },
					isLogged: { type: 'string' },
				},
				additionalProperties: false,
			},
			response: {
				200: userResponseSchema,
				404: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				}
			},
		},
		handler: async(request: any, reply: any) => {
			const updates = request.body as Partial<{
				username: string;
				email: string;
				password_hash: string;
				is_2fa: number;
				secret_2fa: string | null;
				avatar_url: string;
				isLogged: string,
			}>;
			try {
				const userId = request.user.userId;
				const updatedUser = await updateUser(db, userId, updates);
				reply.send(updatedUser);
			} catch (err) {
				reply.code(500).send({ error: 'Failed to update user' }); 
			}
		}
	});
	fastify.route({
		method: 'PATCH',
		url: "/anonymise",
		schema: {
			response: {
				200: {
				type: 'object',
				properties: {
					username: { type: 'string' },
					email: { type: 'string' },
				},
				required: ['username', 'email'],
				},
				404: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				}
			},
		},
		handler: async(request: any, reply: any) => {
			try {
				const token = request.cookies.jwt;
				const payload = verifyToken(token);
				if (!payload) 
					return reply.code(401).send({ error: "Unauthorized" });
				const userId = (payload as any).userId;
				const data = await anonymiseUser(db, userId);
				if (!data)
				{
					reply.code(404).send({ error: "User not found"});
					return ;
				}
				reply.send(data);
			} catch (err) {
				reply.code(500).send({ error: 'Failed to anonymise user' }); 
			}
		}
	});
	fastify.route({
		method: 'DELETE',
		url: "/users/:id",
		schema: {
			params: {
				type : 'object',
				required: ['id'],
				properties: {
					id: {type: 'integer' }
				}
			},
			response: {
				200: userResponseSchema,
				404: {
					type: 'object',
					properties: {
						error: { type: 'string' }
					}
				}
			},
		},
		handler: async(request: any, reply: any) => {
			try {
				const token = request.cookies.jwt;
				const payload = verifyToken(token);
				if (!payload) 
					return reply.code(401).send({ error: "Unauthorized" });
				const userId = (payload as any).userId;
				const deletedUser = await deleteUser(db, userId);
				if (!deletedUser)
				{
					reply.code(404).send({ error: "User not found"});
					return ;
				}
				reply.send(deletedUser);
			} catch (err) {
				reply.code(500).send({ error: 'Failed to delete user' }); 
			}
		}
	});
		fastify.route({
		method: 'POST',
		url: "/2fa_req",
		schema: {
			body: {
				type: 'object',
				required: ['id', 'secret_2fa'],
				properties: {
					id : { type: 'number'},
					secret_2fa: {type: 'string', pattern: '^[0-9]{6}$' },
				},
				additionalProperties: false,
			},
			response: {
				200: {
					type: 'object',
					properties: {
						token: { type: 'string'}
					},
					required: ['token']
				}
			},
		},
		handler: async(request: any, reply: any) => {
			const {
				id,
				secret_2fa,
			} = request.body as {
				id: number;
				secret_2fa: string;
			};
			try {
				const res = await req_2fa(db, id, secret_2fa);
				if (res?.error == 'user') {
					reply.code(401).send({ error: 'Invalid user' });
					return ;
				}
				if (res?.error == 'expired') {
					reply.code(401).send({ error: 'code expired: 5min' });
					return ;
				}
				if (res?.error == 'code') {
					reply.code(401).send({ error: 'Invalid code' });
					return ;
				}
				reply.code(200).send({ token: res.token });
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
		method: 'POST',
		url: "/signOut",
		handler: async(request: any, reply: any) => {
			reply.cookie('jwt' , '', {
				httpOnly: true,
				sameSite: 'none',
				secure: true,
				expires: new Date(0)
			});
			reply.code(204).send();
		}
	});
}
export default userRoutes;