import app from "./app.js";
import http from "http";

const port = process.env.PORT || "3000";
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', (err) => {
    console.error(err);
});

server.on('listening', () => {
    console.log(`Server listening on ${server.address().port}`);
});