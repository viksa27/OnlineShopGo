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

func CreatePaymentCard(c *gin.Context) {
	var cardRequest dto.CreatePaymentCardRequest
	if err := c.ShouldBindJSON(&cardRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	// Check if the user has more than 5 cards
	var cardCount int64
	if err := database.DB.Model(&models.PaymentCard{}).Where("user_id = ?", userId).Count(&cardCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not check card limit"})
		return
	}

	if cardCount >= 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Card limit reached (5 cards max)"})
		return
	}

	var card models.PaymentCard
	card.UserID = userId
	card.Name = cardRequest.Name
	card.Number = cardRequest.Number
	card.ExpiryMonth = cardRequest.ExpiryMonth
	card.ExpiryYear = cardRequest.ExpiryYear
	card.CVC = cardRequest.CVC

	if err := database.DB.Create(&card).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create payment card"})
		return
	}

	c.JSON(http.StatusCreated, card)
}

func DeletePaymentCard(c *gin.Context) {
	cardIDStr := c.Param("id")

	cardID, err := strconv.ParseUint(cardIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Card ID"})
		return
	}

	var card models.PaymentCard
	if err := database.DB.First(&card, uint(cardID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment card not found"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return // Error msg and status set in GetUserIdFromContext
	}

	if userId != card.UserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "That card does not belong to the logged user"})
		return
	}

	if err := database.DB.Delete(&card).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete payment card"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment card deleted successfully"})
}

func GetUserCards(c *gin.Context) {
	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return // Error msg and status set in GetUserIdFromContext
	}

	var cards []models.PaymentCard
	if err := database.DB.Where("user_id = ?", userId).Find(&cards).Preload("User").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve payment cards"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"cards": cards})
}

func GetAllCartEntries(c *gin.Context) {
	var userID, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	var cartEntries []models.CartEntry
	if err := database.DB.Where("user_id = ?", userID).Find(&cartEntries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart entries"})
		return
	}

	c.JSON(http.StatusOK, cartEntries)
}
