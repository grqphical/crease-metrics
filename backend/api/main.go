package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateProxyHandler(key string) func(*gin.Context) {
	return func(c *gin.Context) {
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
	}

}

func main() {
	router := gin.Default()

	api := router.Group("/api")
	api.GET("/leaderboard/wins", CreateProxyHandler("wins"))
	api.GET("/leaderboard/svpct", CreateProxyHandler("savePctg"))
	api.GET("/leaderboard/gaa", CreateProxyHandler("goalsAgainstAverage"))

	fmt.Println("API running on 127.0.0.1:8000")
	router.Run("127.0.0.1:8000")
}
