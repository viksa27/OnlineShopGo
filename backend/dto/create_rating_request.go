package dto

type CreateRatingRequest struct {
	ProductID uint `json:"ProductId" binding:"required"`
	Rating    uint `json:"Rating" binding:"required"`
}
