package dto

type ChangePasswordRequest struct {
	Role            string `json:"role" binding:"required"` // "user" or "administrator"
	Email           string `json:"email" binding:"required"`
	CurrentPassword string `json:"password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required"`
}
