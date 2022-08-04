package main

import (
	"context"
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

// server is used to implement notes.NoteService.
type server struct {
	pb.UnimplementedNoteServiceServer
}

// List implements notes.NoteService
func (s *server) List(ctx context.Context, in *pb.Empty) (*pb.NoteList, error) {
	fmt.Println("List notes...")
	note := &pb.Note{
		Id:      "1",
		Title:   "List notes",
		Content: "List notes",
	}
	// response lists notes
	resp := &pb.NoteList{
		Notes: []*pb.Note{note},
	}

	return resp, nil
}

func main() {
	fmt.Println("Starting.....")
	lis, err := net.Listen("tcp", ":9000")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	fmt.Println("Connecting to server...")
	grpcServer := grpc.NewServer()
	pb.RegisterNoteServiceServer(grpcServer, &server{})
	fmt.Printf("GRPC Server Listen: %v", lis.Addr().String())

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
