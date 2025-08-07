import "reflect-metadata"
import cors from "cors"
import dotenv from "dotenv"
import express, { Request, Response } from "express"
import { RedisClient } from "./Util/Redis"
import { nanoid } from "nanoid"

dotenv.config()
const app = express()
app.use(cors({ origin: "*" }))

app.use(express.json())

const main = async () => {
    // await RedisClient.connect()
    console.log("Redis Client is connected")
    //@ts-ignore
    app.post("/signup", async (req: Request, res: Response) => {
        const { id, username, addiction, date } = req.body;
        if (!id || !username) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        await RedisClient.hmset(`user:${username}`, { username, addiction, date, userWallet: id });
        res.status(201).json({ message: 'User created' });
    })

    //@ts-ignore
    app.post("/posts", async (req: Request, res: Response) => {
        const { user_id, body, categories } = req.body;
        const id = nanoid();
        console.log(user_id, body, categories);
        if (!id || !user_id || !body) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        const now = Date.now();
        // Save post data
        await RedisClient.hmset(`post:${id}`, { user_id, body, time: now, id: id });
        // Add to user's posts and global timeline
        await RedisClient.lpush(`posts:${user_id}`, id);
        await RedisClient.lpush('timeline', id);
        await RedisClient.ltrim('timeline', 0, 999); // Keep recent_posts capped at 1000
        // Add to categories
        if (Array.isArray(categories)) {
            for (const cat of categories) {
                await RedisClient.sadd(`category:${cat}:posts`, id);
                await RedisClient.sadd(`post:${id}:categories`, cat);
            }
        }
        console.log(`Post created with ID: ${id}`);
        res.status(201).json({ message: 'Post created' });
    })

    app.get('/posts/recent', async (_: Request, res: Response) => {
        const postIds = await RedisClient.lrange('timeline', 0, 9);
        const posts = await Promise.all(
            postIds.map(async (id: string) => await RedisClient.hgetall(`post:${id}`))
            // get post likes

        );
        console.log(posts);
        res.json({ posts });
    });

    app.get('/posts/:userId', async (req: Request, res: Response) => {
        const { userId } = req.params;
        const postIds = await RedisClient.smembers(`user:${userId}:posts`);
        console.log(`Fetching posts for user: ${postIds}`);
        const posts = await Promise.all(
            postIds.map(async (id: string) => await RedisClient.hgetall(`post:${id}`))
        );
        console.log(posts);
        res.json({ posts });
    });

    app.get('/posts/:postId', async (req: Request, res: Response) => {
        const { postId } = req.params;
        const post = await RedisClient.hgetall(`post:${postId}`);
        res.json({ post });
    });

    app.post('/posts/:postId/like', async (req: Request, res: Response) => {
        const { user_id } = req.body;
        const { postId } = req.params;
        await RedisClient.sadd(`post:${postId}:likes`, user_id);
        await RedisClient.sadd(`user:${user_id}:likes`, postId);
        res.json({ message: 'Post liked' }).status(201);
    });

    app.post('/users/:userId/follow', async (req: Request, res: Response) => {
        const { follower_id } = req.body;
        const { userId } = req.params;
        const now = Date.now();
        await RedisClient.zadd(`followers:${userId}`, now, follower_id);
        await RedisClient.zadd(`following:${follower_id}`, now, userId);
        res.json({ message: 'Followed user' });
    });

    app.get('/profiles/:userId', async (req: Request, res: Response) => {
        const { userId } = req.params;
        const user = await RedisClient.hgetall(`user:${userId}`);
        const posts = await RedisClient.lrange(`posts:${userId}`, 0, -1);
        // Fetch posts for the user
        const postsDetails = await Promise.all(
            posts.map(async (postId: string) => await RedisClient.hgetall(`post:${postId}`))
        );
        // Combine user data with posts details
        const userObj = {
            ...user,
            posts,
            postsAmount: posts.length,
            postsDetails: postsDetails
        }
        console.log(`Fetching profile for user: ${userId}`, userObj);
        res.json({ userObj });
    });

    app.get('/categories/:category/posts', async (req: Request, res: Response) => {
        const { category } = req.params;
        const postIds = await RedisClient.smembers(`category:${category}:posts`);
        const posts = await Promise.all(
            postIds.map(async (id: string) => await RedisClient.hgetall(`post:${id}`))
        );
        res.json({ posts });
    });

    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}

main().catch((err) => {
    console.error("Error starting the server:", err);
});
