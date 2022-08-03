const express = require('express');
const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const app = express();

const packageDefinition = protoLoader.loadSync('../protos/notes.proto');
const maxDefinition = protoLoader.loadSync('../protos/maximum.proto');
const NoteService = grpc.loadPackageDefinition(packageDefinition).NoteService;
const MaxService = grpc.loadPackageDefinition(maxDefinition).MaxService;

// @ts-ignore
const noteClient = new NoteService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// @ts-ignore
const maxClient = new MaxService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);


app.get('/', (req, res) => {
  noteClient.list({}, (error, data) => {
    if (error) {
      return res.send({
        error: error
      });
    }
    console.log(data);

    res.send({
      data
    });
  });
});

app.get('/max', (req, res) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  maxClient.maxArray({ numbers }, (error, data) => {
    if (error) {
      return res.send({ error: error });
    }
    res.send({ data });
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
