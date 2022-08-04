# generate protobuf

export GOPATH=$(go env GOPATH)
export PATH=$PATH:$GOPATH/bin

`protoc proto/*.proto --go_out=. --go-grpc_out=.`
