package utils

import (
	"OnlineShopGo/database"
	"OnlineShopGo/dto"
	"OnlineShopGo/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

func IsAdmin(userID uint) bool {
	var admin models.Administrator
	result := database.DB.First(&admin, "id = ?", userID)
	return result.Error == nil
}

func CheckCredentials(c *gin.Context, actualPw string, requestPassword string, id uint, role string) {
	if err := bcrypt.CompareHashAndPassword([]byte(actualPw), []byte(requestPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := GenerateJWT(id)
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
