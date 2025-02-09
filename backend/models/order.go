package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model
	UserID          uint        `json:"UserId"`
	Items           []OrderItem `json:"Items" gorm:"foreignKey:OrderID"`
	ShippingAddress string      `json:"ShippingAddress"` // Store full address as a snapshot
	PaymentMethod   string      `json:"-"`
}
