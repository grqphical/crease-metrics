package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.etcd.io/bbolt"
)

var ErrNothingInCache error = errors.New("nothing in cache")

type APIState struct {
	db *bbolt.DB
}

func CreateProxyHandler(key string) func(*gin.Context) {
	return func(c *gin.Context) {
		state, _ := c.Get("appState")
		db := state.(*APIState).db

		err := db.View(func(tx *bbolt.Tx) error {
			b := tx.Bucket([]byte("cache"))

			if b == nil {
				return ErrNothingInCache
			}

			data := b.Get([]byte(key))
			if data == nil {
				return ErrNothingInCache
			}

			c.Data(http.StatusOK, "application/json", data)
			return nil
		})

		if err == ErrNothingInCache {
			resp, err := http.DefaultClient.Get("https://api-web.nhle.com/v1/goalie-stats-leaders/current?limit=5")
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			var data map[string]any
			err = json.NewDecoder(resp.Body).Decode(&data)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, data[key])
			err = db.Update(func(tx *bbolt.Tx) error {
				b, err := tx.CreateBucketIfNotExists([]byte("cache"))
				if err != nil {
					return err
				}

				jsonData, err := json.Marshal(data[key])
				if err != nil {
					return err
				}
				b.Put([]byte(key), jsonData)
				return nil
			})

			if err != nil {
				log.Printf("db error: %s\n", err)
			}
		}
	}

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
	api.GET("/leaderboard/wins", CreateProxyHandler("wins"))
	api.GET("/leaderboard/svpct", CreateProxyHandler("savePctg"))
	api.GET("/leaderboard/gaa", CreateProxyHandler("goalsAgainstAverage"))

	fmt.Println("API running on 127.0.0.1:8000")
	router.Run("127.0.0.1:8000")
}
