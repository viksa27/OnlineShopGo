package main

import (
	"OnlineShopGo/database"
	"OnlineShopGo/handlers"
	"OnlineShopGo/utils"
	"github.com/gin-contrib/cors"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	database.InitDB()
	utils.InitRedis()

	r := gin.Default()

	r.Static("/uploads", "./uploads")

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:4200"}
	corsConfig.AllowMethods = []string{
		"GET",
		"POST",
		"PUT",
		"PATCH",
		"DELETE",
		"OPTIONS",
	}
	corsConfig.AllowHeaders = []string{"Content-Type", "Authorization"}

	r.Use(cors.New(corsConfig))

	api := r.Group("/api")
	{
		api.POST("/login", handlers.Login)
		api.POST("/register", handlers.Register)
		api.POST("/logout", utils.AuthMiddleware(), handlers.Logout)
		api.POST("/change-password", utils.AuthMiddleware(), handlers.ChangePassword)

		api.POST("/edit-profile", utils.AuthMiddleware(), handlers.EditProfile)
		api.GET("/users/id/:id", utils.AuthMiddleware(), handlers.GetUserByID)
		api.GET("/users/email/:email", utils.AuthMiddleware(), handlers.GetUserByEmail)

		api.POST("/payment-cards", utils.AuthMiddleware(), handlers.CreatePaymentCard)
		api.GET("/payment-cards", utils.AuthMiddleware(), handlers.GetUserCards)
		api.DELETE("/payment-cards/:id", utils.AuthMiddleware(), handlers.DeletePaymentCard)

		api.POST("/addresses", utils.AuthMiddleware(), handlers.CreateAddress)
		api.GET("/addresses", utils.AuthMiddleware(), handlers.GetUserAddresses)
		api.PUT("/addresses/:id", utils.AuthMiddleware(), handlers.EditAddress)
		api.DELETE("/addresses/:id", utils.AuthMiddleware(), handlers.DeleteAddress)

		api.GET("/cart", utils.AuthMiddleware(), handlers.GetAllCartEntries)
		api.POST("/cart/:id", utils.AuthMiddleware(), handlers.AddToCart)
		api.DELETE("/cart/:id", utils.AuthMiddleware(), handlers.RemoveFromCart)
		api.PUT("/cart", utils.AuthMiddleware(), handlers.SetCartEntryQuantity)
		api.DELETE("/cart/clear", utils.AuthMiddleware(), handlers.ClearCart)

		api.GET("/orders", utils.AuthMiddleware(), handlers.GetUserOrders)
		api.POST("/orders", utils.AuthMiddleware(), handlers.CreateOrder)

		api.POST("/comments", utils.AuthMiddleware(), handlers.CreateComment)
		api.DELETE("/comments/:id", utils.AuthMiddleware(), handlers.DeleteComment)

		// Public category routes
		api.GET("/categories", handlers.GetCategories)

		api.GET("/products", handlers.GetAllProducts)
		api.GET("/products/id/:id", handlers.GetProductByID)
		api.GET("/products/cart", utils.AuthMiddleware(), handlers.GetProductsInCart)

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
