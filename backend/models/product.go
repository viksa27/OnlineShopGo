package models

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	CategoryID  uint    `json:"CategoryId"`
	Name        string  `gorm:"unique;not null" json:"Name"`
	Price       float64 `json:"Price"`
	Description string  `json:"Description"`
	Quantity    uint    `json:"Quantity"`
	Image       *string `json:"Image"` // Nullable string

	Category Category  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"Category,omitempty"`
	Comments []Comment `gorm:"foreignKey:ProductID" json:"Comments,omitempty"` // One-to-Many with Comments
	Ratings  []Rating  `gorm:"foreignKey:ProductID" json:"Ratings,omitempty"`  // One-to-Many with Ratings
}
