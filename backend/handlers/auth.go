package handlers

import (
	"OnlineShopGo/models"
	"OnlineShopGo/utils"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"time"

	"OnlineShopGo/database"
	"OnlineShopGo/dto"
)

func Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var user models.User
	var admin models.Administrator

	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err == nil {
		utils.CheckCredentials(c, user.Password, req.Password, user.ID, "user")
		return
	}

	if err := database.DB.Where("email = ?", req.Email).First(&admin).Error; err == nil {
		utils.CheckCredentials(c, admin.Password, req.Password, admin.ID, "administrator")
		return
	}

	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
}

func Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Check if the email already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email is already taken"})
		return
	}

	user := models.User{
		Email:    req.Email,
		Password: req.Password, // Will hash password before saving
		Name:     req.Name,
		Surname:  req.Surname,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		log.Println("Error saving user:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not register user"})
		return
	}

	token, err := utils.GenerateJWT(user.ID)
	if err != nil {
		log.Println("Error generating token:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func Logout(c *gin.Context) {
	tokenStr := c.GetHeader("Authorization")

	if tokenStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
		return
	}

	const prefix = "Bearer "
	if len(tokenStr) > len(prefix) && tokenStr[:len(prefix)] == prefix {
		tokenStr = tokenStr[len(prefix):]
	}

	claims, err := utils.ValidateJWT(tokenStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	expiryTime := time.Until(time.Unix(claims.ExpiresAt, 0))

	err = utils.BlacklistToken(tokenStr, expiryTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not logout"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
