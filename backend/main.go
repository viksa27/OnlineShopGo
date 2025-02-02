package main

import (
	"OnlineShopGo/database"
	"OnlineShopGo/handlers"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	database.InitDB()

	r := gin.Default()

	// Public Routes
	r.POST("/login", handlers.Login)

	// Protected Routes (Require JWT)
	protected := r.Group("/api")
	protected.Use(handlers.AuthMiddleware())
	{
		protected.GET("/profile", func(c *gin.Context) {
			userID := c.GetUint("userID")
			c.JSON(http.StatusOK, gin.H{"message": "Authenticated", "user_id": userID})
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
