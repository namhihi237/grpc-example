package main

import (
	"fmt"
	"log"
	"net"

	pb "github.com/namhihi237/grpc-example/node/grpc-server/packets"
	"google.golang.org/grpc"
)

type Note struct {
	Id      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

type Server struct {
	pb.UnimplementedNoteServiceServer
}

func main() {
	fmt.Println("Starting.....")
	lis, err := net.Listen("tcp", ":9000")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	fmt.Println("Connecting to server...")
	grpcServer := grpc.NewServer()
	pb.RegisterNoteServiceServer(grpcServer, &Server{})

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}

}
