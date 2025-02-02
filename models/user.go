package models

import (
	"golang.org/x/crypto/bcrypt"
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID        uint      `gorm:"primaryKey" json:"id"`
	Email     string    `gorm:"unique;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	Name      string    `gorm:"not null" json:"name"`
	Surname   string    `gorm:"not null" json:"surname"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`

	//Addresses []Address `gorm:"foreignKey:UserID"` // One-to-Many relationship with Address
	//PaymentCards []PaymentCard `gorm:"foreignKey:UserID"` // One-to-Many relationship with PaymentMethod
	//Orders   []Order  `gorm:"foreignKey:UserID"` // One-to-Many relationship with Order
}

func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	return u.HashPassword()
}
