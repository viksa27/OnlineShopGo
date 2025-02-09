package database

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"OnlineShopGo/models"
)

var DB *gorm.DB

func InitDB() {
	dsn := "host=localhost user=postgres password=postgres dbname=ShopDB port=5432 sslmode=disable TimeZone=UTC"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}
	fmt.Println("✅ Database connected successfully!")

	modelsToMigrate := []interface{}{
		&models.User{},
		&models.Administrator{},
		&models.Category{},
		&models.PaymentCard{},
		&models.Product{},
		&models.Comment{},
		&models.Address{},
		&models.CartEntry{},
		&models.Order{},
		&models.OrderItem{},
		&models.Rating{},
		// more models here
	}

	err = DB.AutoMigrate(modelsToMigrate...)
	if err != nil {

		log.Fatal("❌ Failed to migrate database:", err)
	}
	fmt.Println("✅ Database migration completed successfully!")
}
