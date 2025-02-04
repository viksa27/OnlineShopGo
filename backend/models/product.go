package models

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	ID          uint    `gorm:"primaryKey" json:"id"`
	CategoryID  uint    `json:"category_id"`
	Name        string  `gorm:"unique;not null" json:"name"`
	Description string  `json:"description"`
	Quantity    uint    `json:"quantity"`
	Image       *string `json:"image"` // Nullable string

	Category Category  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"category"`
	Comments []Comment `gorm:"foreignKey:ProductID" json:"comments,omitempty"` // One-to-Many with Comments
	//Ratings     []Rating   `gorm:"foreignKey:ProductID" json:"ratings,omitempty"` // One-to-Many with Ratings
}
