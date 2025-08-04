package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"go.etcd.io/bbolt"
)

// used to access the database among Gin routes
type APIState struct {
	db *bbolt.DB
}

func main() {
	db, err := bbolt.Open("cache.db", 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	state := &APIState{
		db,
	}

	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(func(c *gin.Context) {
		c.Set("appState", state)
		c.Next()
	})

	api := router.Group("/api")
	api.GET("/leaderboard/wins", CreateLeaderboardProxyHandler("wins"))
	api.GET("/leaderboard/svpct", CreateLeaderboardProxyHandler("savePctg"))
	api.GET("/leaderboard/gaa", CreateLeaderboardProxyHandler("goalsAgainstAverage"))

	fmt.Println("API running on 127.0.0.1:8000")
	router.Run("127.0.0.1:8000")
}
