const grpc = require('@grpc/grpc-js');
const { log } = require('@grpc/grpc-js/build/src/logging');
const protoLoader = require('@grpc/proto-loader');
const server = new grpc.Server();
const packageDefinition = protoLoader.loadSync('../protos/notes.proto');
const maxDefinition = protoLoader.loadSync('../protos/maximum.proto');
const newsProto = grpc.loadPackageDefinition(packageDefinition);
const maxProto = grpc.loadPackageDefinition(maxDefinition);

const notes = {
  notes: [
    { id: '1', title: 'Note 1', content: 'Content 1' },
    { id: '2', title: 'Note 2', content: 'Content 2' }
  ]
}
// @ts-ignore
server.addService(newsProto.NoteService.service, {
  list: (_, callback) => {
    callback(null, notes)
  },
})


// @ts-ignore
server.addService(maxProto.MaxService.service, {
  maxArray: (call, callback) => {
    const { numbers } = call.request
    console.log(call.request);
    let maxNumber = 0;
    if (numbers && numbers.length) {
      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > maxNumber) {
          maxNumber = numbers[i];
        }
      }
    }
    callback(null, { number: maxNumber });
  }
});

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
  console.log(`Server running at http://127.0.0.1:${port}`)
  server.start()
})