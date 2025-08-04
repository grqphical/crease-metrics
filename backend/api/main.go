package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.etcd.io/bbolt"
)

var ErrInvalidCache error = errors.New("nothing in cache")

// represents leaderboard data stored in the cache
type LeaderboardCacheItem struct {
	CreationTimestamp int64 `json:"creationTimestamp"`
	Data              any   `json:"data"`
}

// used to access the database among Gin routes
type APIState struct {
	db *bbolt.DB
}

// creates a new handler to retrieve NHL goaltender leader data with a given key
func CreateProxyHandler(key string) func(*gin.Context) {
	return func(c *gin.Context) {
		state, _ := c.Get("appState")
		db := state.(*APIState).db

		err := db.View(func(tx *bbolt.Tx) error {
			b := tx.Bucket([]byte("cache"))

			if b == nil {
				return ErrInvalidCache
			}

			data := b.Get([]byte(key))
			if data == nil {
				return ErrInvalidCache
			}

			var cacheItem LeaderboardCacheItem
			err := json.Unmarshal(data, &cacheItem)
			if err != nil {
				log.Printf("error while loading JSON from cache: %s\n", err)
				return ErrInvalidCache
			}

			// if this cache item is older than 24 hours, delete it so we can repopulate it
			if time.Unix(int64(cacheItem.CreationTimestamp), 0).After(time.Now()) {
				b.Delete([]byte(key))
				return ErrInvalidCache
			}

			encodedLeaderboardData, err := json.Marshal(cacheItem.Data)
			if err != nil {
				return ErrInvalidCache
			}

			c.Data(http.StatusOK, "application/json", encodedLeaderboardData)
			return nil
		})

		if err == ErrInvalidCache {
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

			cacheItem := LeaderboardCacheItem{
				CreationTimestamp: time.Now().Unix(),
				Data:              data[key],
			}

			err = db.Update(func(tx *bbolt.Tx) error {
				b, err := tx.CreateBucketIfNotExists([]byte("cache"))
				if err != nil {
					return err
				}

				jsonData, err := json.Marshal(cacheItem)
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
