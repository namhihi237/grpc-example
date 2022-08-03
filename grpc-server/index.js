const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const server = new grpc.Server();
const packageDefinition = protoLoader.loadSync('../notes.proto');
const newsProto = grpc.loadPackageDefinition(packageDefinition);

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

server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
  console.log(`Server running at http://127.0.0.1:${port}`)
  server.start()
})