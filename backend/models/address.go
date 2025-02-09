package models

import "gorm.io/gorm"

type Address struct {
	gorm.Model
	UserID  uint   `gorm:"not null;index" json:"UserId"` // Foreign key referencing User
	Street  string `gorm:"size:255;not null" json:"Street"`
	City    string `gorm:"size:100;not null" json:"City"`
	State   string `gorm:"size:100" json:"State"`
	ZipCode string `gorm:"size:20;not null" json:"ZipCode"`
	Country string `gorm:"size:100;not null" json:"Country"`

	//User User `gorm:"foreignKey:UserID" json:"-"` // Relation to User
}
