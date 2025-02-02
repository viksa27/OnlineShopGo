package models

import (
	"time"

	"gorm.io/gorm"
)

type Administrator struct {
	gorm.Model
	ID        uint      `gorm:"primaryKey" json:"id"`
	Email     string    `gorm:"unique;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	Name      string    `gorm:"not null" json:"name"`
	Surname   string    `gorm:"not null" json:"surname"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
