package models

import (
	"gorm.io/gorm"
	"time"
)

type PaymentCard struct {
	gorm.Model
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null" json:"user_id"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	Number      string    `gorm:"size:16;not null" json:"number"`
	CVC         string    `gorm:"size:3;not null" json:"cvc"`
	ExpiryMonth int       `gorm:"not null" json:"expiry_month"`
	ExpiryYear  int       `gorm:"not null" json:"expiry_year"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`

	User User `gorm:"foreignKey:UserID"`
}
