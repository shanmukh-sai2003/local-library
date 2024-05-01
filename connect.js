const mongoose = require('mongoose');

const password = "DB2003sai";
const mongoUri = `mongodb+srv://shanmukh:${password}@atlascluster.xvry0av.mongodb.net/local_library?retryWrites=true&w=majority&appName=AtlasCluster`;

mongoose.set("strictQuery", false);

async function makeConnection() {
    try {
        await mongoose.connect(mongoUri);
        console.log("database connected ...");
    } catch (error) {
        console.log(error);
    }
}

module.exports = makeConnection;