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

		api.POST("/edit-profile", utils.UserAuthMiddleware(), handlers.EditProfile)
		api.GET("/users/id/:id", utils.AuthMiddleware(), handlers.GetUserByID)
		api.GET("/users/email/:email", utils.AuthMiddleware(), handlers.GetUserByEmail)

		api.POST("/payment-cards", utils.UserAuthMiddleware(), handlers.CreatePaymentCard)
		api.GET("/payment-cards", utils.AuthMiddleware(), handlers.GetUserCards)
		api.DELETE("/payment-cards/:id", utils.UserAuthMiddleware(), handlers.DeletePaymentCard)

		api.POST("/addresses", utils.UserAuthMiddleware(), handlers.CreateAddress)
		api.GET("/addresses", utils.AuthMiddleware(), handlers.GetUserAddresses)
		api.PUT("/addresses/:id", utils.UserAuthMiddleware(), handlers.EditAddress)
		api.DELETE("/addresses/:id", utils.UserAuthMiddleware(), handlers.DeleteAddress)

		api.GET("/cart", utils.AuthMiddleware(), handlers.GetAllCartEntries)
		api.POST("/cart/:id", utils.UserAuthMiddleware(), handlers.AddToCart)
		api.DELETE("/cart/:id", utils.UserAuthMiddleware(), handlers.RemoveFromCart)
		api.PUT("/cart", utils.UserAuthMiddleware(), handlers.SetCartEntryQuantity)
		api.DELETE("/cart/clear", utils.UserAuthMiddleware(), handlers.ClearCart)

		api.GET("/orders", utils.AuthMiddleware(), handlers.GetUserOrders)
		api.POST("/orders", utils.UserAuthMiddleware(), handlers.CreateOrder)

		api.POST("/comments", utils.UserAuthMiddleware(), handlers.CreateComment)
		api.DELETE("/comments/:id", utils.AuthMiddleware(), handlers.DeleteComment)

		api.POST("/ratings", utils.UserAuthMiddleware(), handlers.CreateRating)
		api.DELETE("/ratings/:id", utils.UserAuthMiddleware(), handlers.DeleteRating)

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
			admin.PUT("/categories/id/:id", handlers.UpdateCategory)
			admin.DELETE("/categories/id/:id", handlers.DeleteCategory)

			admin.POST("/products", handlers.CreateProduct)
			admin.PUT("/products/id/:id", handlers.EditProduct)
			admin.DELETE("/products/id/:id", handlers.DeleteProduct)
			admin.POST("/products/image/id/:id", handlers.AddPicture)
			admin.DELETE("/products/image/id/:id", handlers.DeletePicture)

			admin.POST("/register-admin", handlers.RegisterAdmin)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
