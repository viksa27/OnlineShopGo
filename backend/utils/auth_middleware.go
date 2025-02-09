package utils

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		claims := CheckToken(c)
		if claims == nil {
			return // Error already set in CheckToken function
		}

		// Store user ID in context for use in protected routes
		c.Set("userID", claims.UserID)
		c.Next()
	}
}

func UserAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		claims := CheckToken(c)
		if claims == nil {
			return // Error already set in CheckToken function
		}

		if claims.UserID == 0 || !IsUser(claims.UserID) {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			c.Abort()
			return
		}

		// Store admin ID in context
		c.Set("userID", claims.UserID)
		c.Next()
	}
}

func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		claims := CheckToken(c)
		if claims == nil {
			return // Error already set in CheckToken function
		}

		// Check if the user is an administrator
		if claims.AdminID == 0 || !IsAdmin(claims.AdminID) {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			c.Abort()
			return
		}

		// Store admin ID in context
		c.Set("adminID", claims.UserID)
		c.Next()
	}
}
