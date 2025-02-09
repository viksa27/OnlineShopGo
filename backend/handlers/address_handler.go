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

func CreateAddress(c *gin.Context) {
	var addressRequest dto.AddressRequest
	if err := c.ShouldBindJSON(&addressRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	var address models.Address
	address.UserID = userId
	address.Street = addressRequest.Street
	address.City = addressRequest.City
	address.State = addressRequest.State
	address.ZipCode = addressRequest.ZipCode
	address.Country = addressRequest.Country

	if err := database.DB.Create(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create address"})
		return
	}

	c.JSON(http.StatusCreated, address)
}

func DeleteAddress(c *gin.Context) {
	addressIDStr := c.Param("id")

	addressID, err := strconv.ParseUint(addressIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Address ID"})
		return
	}

	var address models.Address
	if err := database.DB.First(&address, uint(addressID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return // Error msg and status set in GetUserIdFromContext
	}

	if userId != address.UserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "That address does not belong to the logged user"})
		return
	}

	if err := database.DB.Delete(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete address"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Address deleted successfully"})
}

func GetUserAddresses(c *gin.Context) {
	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return // Error msg and status set in GetUserIdFromContext
	}

	var addresses []models.Address
	if err := database.DB.Where("user_id = ?", userId).Find(&addresses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve addresses"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"addresses": addresses})
}

func EditAddress(c *gin.Context) {
	addressIDStr := c.Param("id")

	addressID, err := strconv.ParseUint(addressIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Address ID"})
		return
	}

	var addressRequest dto.AddressRequest
	if err := c.ShouldBindJSON(&addressRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var address models.Address
	if err := database.DB.First(&address, uint(addressID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	if userId != address.UserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "That address does not belong to the logged user"})
		return
	}

	address.Street = addressRequest.Street
	address.City = addressRequest.City
	address.State = addressRequest.State
	address.ZipCode = addressRequest.ZipCode
	address.Country = addressRequest.Country

	if err := database.DB.Save(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update address"})
		return
	}

	c.JSON(http.StatusOK, address)
}
