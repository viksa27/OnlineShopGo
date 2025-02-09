package models

import (
	"OnlineShopGo/models/utils"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"unique;not null" json:"Email"`
	Password string `gorm:"not null" json:"-"`
	Name     string `json:"Name"`
	Surname  string `json:"Surname"`
}

func (u *User) HashUserPassword() error {
	hashedPassword, err := utils.HashPassword(u.Password)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	return u.HashUserPassword()
}
