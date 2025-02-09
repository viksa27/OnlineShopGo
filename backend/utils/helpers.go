package utils

import (
	"OnlineShopGo/database"
	"OnlineShopGo/dto"
	"OnlineShopGo/models"
	"OnlineShopGo/models/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

func IsAdmin(userID uint) bool {
	var admin models.Administrator
	result := database.DB.First(&admin, "id = ?", userID)
	return result.Error == nil
}

func IsUser(userID uint) bool {
	var user models.User
	result := database.DB.First(&user, "id = ?", userID)
	return result.Error == nil
}

func CheckCredentials(c *gin.Context, actualPw string, requestPassword string, id uint, role string) {
	if err := bcrypt.CompareHashAndPassword([]byte(actualPw), []byte(requestPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := GenerateJWT(id, role == "administrator")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "role": role})
	return
}

func CheckToken(c *gin.Context) *dto.JwtClaims {
	tokenStr := c.GetHeader("Authorization")
	if tokenStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
		c.Abort()
		return nil
	}

	const prefix = "Bearer "
	if len(tokenStr) > len(prefix) && tokenStr[:len(prefix)] == prefix {
		tokenStr = tokenStr[len(prefix):]
	}

	if IsTokenBlacklisted(tokenStr) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has been revoked"})
		c.Abort()
		return nil
	}

	claims, err := ValidateJWT(tokenStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		c.Abort()
		return nil
	}

	return claims
}

func ChangePasswordUser(c *gin.Context, request dto.ChangePasswordRequest) {
	var user models.User
	if err := database.DB.Where("email = ?", request.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.CurrentPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Current password is incorrect"})
		return
	}

	hashedPw, err := utils.HashPassword(request.NewPassword)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't hash password"})
		return
	}

	database.DB.Model(&user).Update("Password", string(hashedPw))

	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}

func ChangePasswordAdministrator(c *gin.Context, request dto.ChangePasswordRequest) {
	var admin models.Administrator
	if err := database.DB.Where("email = ?", request.Email).First(&admin).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Administrator not found"})
		return
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(request.CurrentPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Current password is incorrect"})
		return
	}

	hashedPw, err := utils.HashPassword(request.NewPassword)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't hash password"})
		return
	}

	database.DB.Model(&admin).Update("Password", string(hashedPw))

	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}

func GetUserIdFromContext(c *gin.Context) (uint, bool) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return 0, false
	}

	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return 0, false
	}

	userIDUint, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return 0, false
	}

	return userIDUint, true
}
