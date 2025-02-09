package dto

type CategoryRequest struct {
	Name        string `json:"Name" binding:"required"`
	Description string `json:"Description" binding:"required"`
}
