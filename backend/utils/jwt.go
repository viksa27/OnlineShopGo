package utils

import (
	"time"

	"github.com/dgrijalva/jwt-go"

	"OnlineShopGo/dto"
)

var jwtSecret = []byte("TKro3oiQodzp1YF49yVKc5YIiZp0jQJSlDmpub3PWsE=")

func GenerateJWT(userID uint, admin bool) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &dto.JwtClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	if admin {
		claims.AdminID = userID
		claims.UserID = 0
	} else {
		claims.AdminID = 0
		claims.UserID = userID
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ValidateJWT(tokenStr string) (*dto.JwtClaims, error) {
	claims := &dto.JwtClaims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	return claims, nil
}
