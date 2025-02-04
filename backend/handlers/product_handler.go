package handlers

import (
	"OnlineShopGo/database"
	"OnlineShopGo/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func CreateProduct(c *gin.Context) {
	var product models.Product

	// Bind JSON
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save to DB
	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func EditProduct(c *gin.Context) {
	productID := c.Param("id")
	var product models.Product

	// Check if product exists
	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Bind JSON updates
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update DB
	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
	productID := c.Param("id")

	// Delete from DB
	if err := database.DB.Delete(&models.Product{}, productID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// AddProductToCart - Empty function (to be implemented later)
func AddProductToCart(c *gin.Context) {
	// Implementation pending
}

func GetProductByID(c *gin.Context) {
	productID := c.Param("id")
	var product models.Product

	preloadComments := c.DefaultQuery("comments", "false") == "true"

	query := database.DB.Preload("Category")
	if preloadComments {
		query = query.Preload("Comments")
	}

	if err := query.First(&product, productID).Error; err != nil {
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

	preloadComments := c.DefaultQuery("comments", "false") == "true"

	query := database.DB.Where("category_id = ?", categoryID).Preload("Category")
	if preloadComments {
		query = query.Preload("Comments")
	}

	query.Find(&products)
	c.JSON(http.StatusOK, products)
}
