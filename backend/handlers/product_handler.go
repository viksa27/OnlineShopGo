package handlers

import (
	"OnlineShopGo/database"
	"OnlineShopGo/dto"
	"OnlineShopGo/models"
	"OnlineShopGo/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"
)

const STATIC_UPLOADS_PATH = "./uploads"

// Function to handle file upload
func uploadFile(c *gin.Context) (string, error) {
	file, _ := c.FormFile("image")
	if file == nil {
		return "", fmt.Errorf("no file uploaded")
	}

	// Create the directory if it doesn't exist
	err := os.MkdirAll(STATIC_UPLOADS_PATH, os.ModePerm)
	if err != nil {
		return "", fmt.Errorf("failed to create directory: %v", err)
	}

	// Create a unique file name
	fileExtension := filepath.Ext(file.Filename)
	fileName := fmt.Sprintf("%d%s", time.Now().UnixNano(), fileExtension)

	// Save the file to the upload path
	filePath := filepath.Join(STATIC_UPLOADS_PATH, fileName)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	return fileName, nil
}

func CreateProduct(c *gin.Context) {
	var request dto.CreateProductRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var noImgPath = "no_image.png"
	product := models.Product{
		CategoryID:  request.CategoryID,
		Name:        request.Name,
		Price:       request.Price,
		Description: request.Description,
		Quantity:    request.Quantity,
		Image:       &noImgPath,
	}

	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func AddPicture(c *gin.Context) {
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

	if file, _ := c.FormFile("image"); file != nil {
		// Upload image and get the file path
		imagePath, err := uploadFile(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		product.Image = &imagePath
		if err := database.DB.Save(&product).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Could not update product with image"})
			return
		}

		c.JSON(http.StatusCreated, product)
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "Couldn't read file"})
		return
	}
}

func DeletePicture(c *gin.Context) {
	productIDStr := c.Param("id")
	var product models.Product

	productID, err := strconv.ParseUint(productIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Product ID"})
		return
	}

	if err = database.DB.First(&product, uint(productID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var noImgPath = "no_image.png"
	product.Image = &noImgPath

	if err = database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
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

	var request dto.CreateProductRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product.CategoryID = request.CategoryID
	product.Name = request.Name
	product.Price = request.Price
	product.Description = request.Description
	product.Quantity = request.Quantity

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

	if err = database.DB.Delete(&models.Product{}, productID).Error; err != nil {
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
		query = query.Preload("Comments.User")
	}

	preloadRatings := c.DefaultQuery("ratings", "false") == "true"
	if preloadRatings {
		query = query.Preload("Ratings")
		query = query.Preload("Ratings.User")
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
