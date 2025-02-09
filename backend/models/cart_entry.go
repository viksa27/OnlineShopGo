package models

import "gorm.io/gorm"

type CartEntry struct {
	gorm.Model
	UserID    uint `json:"UserId"`
	ProductID uint `json:"ProductId"`
	Quantity  uint `json:"Quantity"`
}
