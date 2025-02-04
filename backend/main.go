package main

import (
	"OnlineShopGo/database"
	"OnlineShopGo/handlers"
	"OnlineShopGo/utils"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	database.InitDB()
	utils.InitRedis()

	r := gin.Default()

	api := r.Group("/api")
	{
		api.POST("/login", handlers.Login)
		api.POST("/register", handlers.Register)
		api.POST("/logout", utils.AuthMiddleware(), handlers.Logout) // 🔥 Add logout route

		// Public category routes
		api.GET("/categories", handlers.GetCategories)

		// Protected admin routes
		admin := api.Group("/admin")
		admin.Use(utils.AdminAuthMiddleware()) // Require admin token
		{
			admin.POST("/categories", handlers.CreateCategory)
			admin.PUT("/categories/:id", handlers.UpdateCategory)
			admin.DELETE("/categories/:id", handlers.DeleteCategory)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
