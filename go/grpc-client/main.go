package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	pb "github.com/namhihi237/grpc-example/node/grpc-client/packets"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Note struct {
	Id      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

type NoteHandler struct {
	c pb.NoteServiceClient
}

func (note *NoteHandler) getNoteList(w http.ResponseWriter, r *http.Request) {
	noteLists, err := note.c.List(context.Background(), &pb.Empty{})

	if err != nil {
		log.Fatalf("While call getNoteList %v", err)
	}

	resp := make(map[string]interface{})
	resp["message"] = "Status Created"
	resp["notes"] = noteLists.Notes

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}

	// response json
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	w.Write(jsonResp)
}

func main() {
	fmt.Println("Starting.....")

	conn, err := grpc.Dial("localhost:9000", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("While connect in Server grpc: %v", err)
	}

	defer conn.Close()

	c := pb.NewNoteServiceClient(conn)
	noteHandler := &NoteHandler{c: c}

	http.HandleFunc("/", noteHandler.getNoteList)

	fmt.Println("Server started...http://localhost:8000")
	http.ListenAndServe(":8000", nil)
}
