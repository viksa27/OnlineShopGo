package handlers

import (
	"OnlineShopGo/database"
	"OnlineShopGo/dto"
	"OnlineShopGo/models"
	"OnlineShopGo/utils"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strconv"
)

func EditProfile(c *gin.Context) {
	var request dto.EditProfileRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	userIDUint, ok := utils.GetUserIdFromContext(c)
	if !ok {
		return // Error message and status already set in GetUserIdFromContext
	}

	var user models.User
	if err := database.DB.First(&user, userIDUint).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Email = request.Email
	user.Name = request.Name
	user.Surname = request.Surname

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":      user.ID,
		"email":   user.Email,
		"name":    user.Name,
		"surname": user.Surname,
	})
}

func GetUserByID(c *gin.Context) {
	idParam := c.Param("id")
	userID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := database.DB.First(&user, uint(userID)).Error; err != nil {
		log.Println("Error fetching user:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func GetUserByEmail(c *gin.Context) {
	email := c.Param("email")

	var user models.User
	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		log.Println("User not found:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}
