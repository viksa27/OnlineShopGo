package handlers

import (
	"OnlineShopGo/database"
	"OnlineShopGo/dto"
	"OnlineShopGo/models"
	"OnlineShopGo/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func CreateRating(c *gin.Context) {
	var ratingRequest dto.CreateRatingRequest
	if err := c.ShouldBindJSON(&ratingRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Ensure that the rating is between 1 and 5
	if ratingRequest.Rating < 1 || ratingRequest.Rating > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Rating must be between 1 and 5"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var product models.Product
	if err := database.DB.First(&product, ratingRequest.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Check if the user has already rated this product (to prevent multiple ratings from the same user)
	var existingRating models.Rating
	err := database.DB.Where("user_id = ? AND product_id = ?", userId, ratingRequest.ProductID).First(&existingRating).Error
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "You have already rated this product"})
		return
	}

	var rating models.Rating
	rating.UserID = userId
	rating.ProductID = ratingRequest.ProductID
	rating.Rating = ratingRequest.Rating

	if err := database.DB.Preload("User").Create(&rating).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create rating"})
		return
	}

	if err := database.DB.Preload("User").First(&rating, rating.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not load user for rating"})
		return
	}

	c.JSON(http.StatusCreated, rating)
}

func DeleteRating(c *gin.Context) {
	ratingId, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid rating ID"})
		return
	}

	var rating models.Rating
	if err := database.DB.First(&rating, uint(ratingId)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rating not found"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok || rating.UserID != userId {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized to delete this rating"})
		return
	}

	if err := database.DB.Delete(&rating).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete rating"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rating deleted successfully"})
}
