package models

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name        string `gorm:"unique;not null" json:"Name"`
	Description string `json:"Description"`

	//Products []Product `gorm:"foreignKey:CategoryID"` // One-to-Many relationship with Product
}
