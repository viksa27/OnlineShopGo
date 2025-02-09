package models

import "gorm.io/gorm"

type Comment struct {
	gorm.Model
	UserID    uint   `gorm:"not null" json:"UserId"`    // Foreign key for User
	ProductID uint   `gorm:"not null" json:"ProductId"` // Foreign key for Product
	Content   string `gorm:"type:text;not null" json:"Content"`

	// Lazy loading relationships
	User User `gorm:"foreignKey:UserID;preload:true" json:"User"`
	//Product   Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}
