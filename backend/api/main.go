package main

import (
	"fmt"
	"net/http"
)

func main() {
	server := http.NewServeMux()

	fmt.Println("API running on 127.0.0.1:8000")
	http.ListenAndServe("127.0.0.1:8000", server)
}
