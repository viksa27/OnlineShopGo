package models

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	ID          uint    `gorm:"primaryKey" json:"id"`
	CategoryID  uint    `gorm:"foreignKey:CategoryID"`
	Name        string  `gorm:"unique;not null" json:"name"`
	Description string  `json:"description"`
	Image       *string `json:"image"` // Nullable string

	Category Category `gorm:"type:text;not null" json:"category"`
	//Comments    []Comment  `gorm:"foreignKey:ProductID" json:"comments",omitempty` // One-to-Many with Comments
	//Ratings     []Rating   `gorm:"foreignKey:ProductID" json:"ratings",omitempty` // One-to-Many with Ratings
}
