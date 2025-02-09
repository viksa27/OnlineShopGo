package models

import (
	"gorm.io/gorm"
)

type PaymentCard struct {
	gorm.Model
	UserID      uint   `gorm:"not null" json:"UserId"`
	Name        string `gorm:"size:255;not null" json:"Name"`
	Number      string `gorm:"size:16;not null" json:"Number"`
	CVC         string `gorm:"size:3;not null" json:"Cvc"`
	ExpiryMonth int    `gorm:"not null" json:"ExpiryMonth"`
	ExpiryYear  int    `gorm:"not null" json:"ExpiryYear"`
}
