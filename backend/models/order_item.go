package models

import "gorm.io/gorm"

type OrderItem struct {
	gorm.Model
	OrderID   uint    `json:"OrderId"`
	ProductID uint    `json:"ProductId"`
	Quantity  uint    `json:"Quantity"`
	Price     float64 `json:"Price"` // Store price at the time of order
}
