import { MongoClient } from "mongodb";
import {app, db} from "./app";
import { SETTINGS } from "./settings";

async function main() {
    const port = 8080;

    const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL)
    await  db.init(client);

    app.listen(port, () => {
        console.log("Server started on port:", port);
    })
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
