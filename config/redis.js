import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'ncf6WTXaSwKGvJzoKMHTDUpObQ0yMA7o',
    socket: {
        host: 'redis-18614.c321.us-east-1-2.ec2.cloud.redislabs.com',
        port: 18614
    }
});

client.on("error", (err) => {
    console.log("Redis error:", err);
});

export { client };
