package models

import "gorm.io/gorm"

type Rating struct {
	gorm.Model
	UserID    uint `json:"UserId"`
	ProductID uint `json:"ProductId"`
	Rating    uint `json:"Rating" gorm:"check:Rating>=1 AND Rating<=5"`
}
