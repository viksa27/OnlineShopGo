package handlers

import (
	"OnlineShopGo/database"
	"OnlineShopGo/dto"
	"OnlineShopGo/models"
	"OnlineShopGo/utils"
	"errors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func AddToCart(c *gin.Context) {
	productIDStr := c.Param("id")

	productID, err := strconv.ParseUint(productIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Product ID"})
		return
	}

	var product models.Product
	if err = database.DB.First(&product, uint(productID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	// Check if the cart already has an entry for this product and user
	var cart models.CartEntry
	err = database.DB.Where("user_id = ? AND product_id = ?", userId, uint(productID)).First(&cart).Error

	if err == nil {
		cart.Quantity += 1
		if updateErr := database.DB.Save(&cart).Error; updateErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Cart updated", "cart": cart})
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		newCart := models.CartEntry{
			UserID:    userId,
			ProductID: product.ID,
			Quantity:  1,
		}
		if createErr := database.DB.Create(&newCart).Error; createErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to cart"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "Product added to cart", "cart": newCart})
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check cart"})
	}
}

func RemoveFromCart(c *gin.Context) {
	productIDStr := c.Param("id")

	productID, err := strconv.ParseUint(productIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Product ID"})
		return
	}

	var userID, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	var cart models.CartEntry
	err = database.DB.Where("user_id = ? AND product_id = ?", userID, uint(productID)).First(&cart).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cart entry doesn't exist"})
		return
	}

	if deleteErr := database.DB.Delete(&cart).Error; deleteErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove product from cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product removed from cart"})
}

func SetCartEntryQuantity(c *gin.Context) {
	var updateCartRequest dto.UpdateCartQuantityRequest
	if err := c.ShouldBindJSON(&updateCartRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if updateCartRequest.Quantity == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request (0 quantity)"})
		return
	}

	var userID, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	var cart models.CartEntry
	err := database.DB.Where("user_id = ? AND product_id = ?", userID, updateCartRequest.ProductID).First(&cart).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cart entry doesn't exist"})
		return
	}

	cart.Quantity = updateCartRequest.Quantity
	if err := database.DB.Save(&cart).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart entry"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart entry updated successfully"})
}

func ClearCart(c *gin.Context) {
	var userID, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	if err := database.DB.Where("user_id = ?", userID).Delete(&models.CartEntry{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart cleared successfully"})
}
