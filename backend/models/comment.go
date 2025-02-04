package models

import "gorm.io/gorm"

type Comment struct {
	gorm.Model
	ID          uint   `gorm:"primaryKey" json:"id"`
	CommenterID uint   `gorm:"not null" json:"commenter_id"` // Foreign key for User
	ProductID   uint   `gorm:"not null" json:"product_id"`   // Foreign key for Product
	Content     string `gorm:"type:text;not null" json:"content"`

	// Lazy loading relationships
	Commenter User    `gorm:"foreignKey:CommenterID" json:"commenter,omitempty"`
	Product   Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
}
