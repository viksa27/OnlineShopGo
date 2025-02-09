package dto

type CreateCommentRequest struct {
	ProductID uint   `json:"ProductId" binding:"required"`
	Content   string `json:"Content" binding:"required"`
}
