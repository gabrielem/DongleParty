
import buildApp from "./app";

async function main() {
    const server = await buildApp();
    try {
        server.listen({ port: 8001, host: "0.0.0.0" }, function (err, address) {
            if (err) server.log.error(err);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
