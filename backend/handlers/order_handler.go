package handlers

import (
	"OnlineShopGo/database"
	"OnlineShopGo/dto"
	"OnlineShopGo/models"
	"OnlineShopGo/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func CreateOrder(c *gin.Context) {
	userID, ok := utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	var orderRequest dto.CreateOrderRequest
	if err := c.ShouldBindJSON(&orderRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if len(orderRequest.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order must contain at least one item"})
		return
	}

	// Ensure enough products are available
	var orderItems []models.OrderItem
	for _, item := range orderRequest.Items {
		var product models.Product
		if err := database.DB.First(&product, item.ProductID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Product ID: " + strconv.Itoa(int(item.ProductID))})
			return
		}

		// Check product availability
		if product.Quantity < item.Quantity {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Insufficient stock for product %s. Available items: %d", product.Name, product.Quantity)})
			return
		}

		product.Quantity -= item.Quantity
		if err := database.DB.Model(&product).Update("quantity", product.Quantity).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product stock"})
			return
		}

		orderItems = append(orderItems, models.OrderItem{
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     product.Price,
		})
	}

	order := models.Order{
		UserID:          userID,
		ShippingAddress: orderRequest.ShippingAddress,
		PaymentMethod:   orderRequest.PaymentMethod,
	}

	// Save order first to generate ID
	if err := database.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Assigning order id
	for _, item := range orderItems {
		item.OrderID = order.ID
	}

	if err := database.DB.Create(&orderItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add order items"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Order placed successfully", "orderId": order.ID})
}

func GetUserOrders(c *gin.Context) {
	userID, ok := utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	var orders []models.Order
	err := database.DB.Preload("Items").Where("user_id = ?", userID).Find(&orders).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve orders"})
		return
	}

	c.JSON(http.StatusOK, orders)
}
