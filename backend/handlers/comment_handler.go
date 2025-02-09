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

func CreateComment(c *gin.Context) {
	var commentRequest dto.CreateCommentRequest
	if err := c.ShouldBindJSON(&commentRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		return
	}

	if commentRequest.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Comment content cannot be empty"})
		return
	}

	// Check if product exists
	var product models.Product
	if err := database.DB.First(&product, commentRequest.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var comment models.Comment
	comment.UserID = userId
	comment.ProductID = commentRequest.ProductID
	comment.Content = commentRequest.Content

	if err := database.DB.Preload("User").Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create comment"})
		return
	}

	if err := database.DB.Preload("User").First(&comment, comment.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not load user for rating"})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

func DeleteComment(c *gin.Context) {
	commentID := c.Param("id")
	parsedID, err := strconv.ParseUint(commentID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}

	var userId, ok = utils.GetUserIdFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var comment models.Comment
	if err := database.DB.First(&comment, uint(parsedID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	// Check if the user is the one who created the comment
	if comment.UserID != userId {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this comment"})
		return
	}

	// Delete the comment
	if err := database.DB.Delete(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}
