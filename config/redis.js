import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'llrT0dqkfb9AyVQGbbyfjfEHVZ2ItAXF',
    socket: {
        host: 'redis-13995.crce214.us-east-1-3.ec2.cloud.redislabs.com',
        port: 13995
    }
});

client.on("error", (err) => {
    console.log("Redis error:", err);
});

export { client };