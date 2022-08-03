const express = require('express');
const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const app = express();

const packageDefinition = protoLoader.loadSync('../notes.proto');
const newsProto = grpc.loadPackageDefinition(packageDefinition);

const NoteService = grpc.loadPackageDefinition(packageDefinition).NoteService;

// @ts-ignore
const client = new NoteService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

app.get('/', (req, res) => {
  client.list({}, (error, data) => {
    if (error) {
      return res.send({
        error: error
      });
    }
    res.send({
      data
    });
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
