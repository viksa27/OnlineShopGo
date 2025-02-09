package handlers

import (
	"OnlineShopGo/database"
	"OnlineShopGo/models"
	"OnlineShopGo/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func CreateProduct(c *gin.Context) {
	var product models.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func EditProduct(c *gin.Context) {
	productIDStr := c.Param("id")
	var product models.Product

	productID, err := strconv.ParseUint(productIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Product ID"})
		return
	}

	if err := database.DB.First(&product, uint(productID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	productIDStr := c.Param("id")

	productID, err := strconv.ParseUint(productIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Product ID"})
		return
	}

	if err := database.DB.Delete(&models.Product{}, productID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func GetProductByID(c *gin.Context) {
	productIDStr := c.Param("id")
	var product models.Product

	productID, err := strconv.ParseUint(productIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Product ID"})
		return
	}

	// Get the query parameter ?comments=true (optional)
	preloadComments := c.DefaultQuery("comments", "false") == "true"

	query := database.DB.Preload("Category")
	if preloadComments {
		query = query.Preload("Comments")
	}

	if err := query.First(&product, uint(productID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func GetAllProducts(c *gin.Context) {
	var products []models.Product

	// Get the query parameter ?comments=true (optional)
	preloadComments := c.DefaultQuery("comments", "false") == "true"

	query := database.DB.Preload("Category")
	if preloadComments {
		query = query.Preload("Comments")
	}

	query.Find(&products)
	c.JSON(http.StatusOK, products)
}

func GetAllProductsByCategory(c *gin.Context) {
	categoryID := c.Param("category_id")
	var products []models.Product

	// Get the query parameter ?comments=true (optional)
	preloadComments := c.DefaultQuery("comments", "false") == "true"

	query := database.DB.Where("category_id = ?", categoryID).Preload("Category")
	if preloadComments {
		query = query.Preload("Comments")
	}

	query.Find(&products)
	c.JSON(http.StatusOK, products)
}

func GetProductsInCart(c *gin.Context) {
	var userID, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	var cartEntries []models.CartEntry
	if err := database.DB.Where("user_id = ?", userID).Find(&cartEntries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart entries"})
		return
	}

	if len(cartEntries) == 0 {
		c.JSON(http.StatusOK, []models.Product{})
		return
	}

	var productIDs []uint
	for _, entry := range cartEntries {
		productIDs = append(productIDs, entry.ProductID)
	}

	var products []models.Product
	if err := database.DB.Where("id IN ?", productIDs).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, products)
}
