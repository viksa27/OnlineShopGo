package models

import (
	"OnlineShopGo/models/utils"

	"gorm.io/gorm"
)

type Administrator struct {
	gorm.Model
	Email    string `gorm:"unique;not null" json:"Email"`
	Password string `gorm:"not null" json:"-"`
	Name     string `gorm:"not null" json:"Name"`
	Surname  string `gorm:"not null" json:"Surname"`
}

func (a *Administrator) HashAdminPassword() error {
	hashedPassword, err := utils.HashPassword(a.Password)
	if err != nil {
		return err
	}
	a.Password = string(hashedPassword)
	return nil
}

func (a *Administrator) BeforeCreate(tx *gorm.DB) error {
	return a.HashAdminPassword()
}

func (a *Administrator) BeforeSave(tx *gorm.DB) error {
	// Only hash the password if it has been modified
	if tx.Statement.Changed("Password") {
		return a.HashAdminPassword()
	}
	return nil
}
