package dto

import "github.com/dgrijalva/jwt-go"

type JwtClaims struct {
	UserID  uint `json:"user_id"`
	AdminID uint `json:"admin_id"`
	jwt.StandardClaims
}
