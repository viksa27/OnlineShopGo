package dto

type CreatePaymentCardRequest struct {
	Name        string `json:"name" binding:"required"`
	Number      string `json:"number" binding:"required"`
	CVC         string `json:"cvc" binding:"required"`
	ExpiryMonth int    `json:"expiry_month" binding:"required"`
	ExpiryYear  int    `json:"expiry_year" binding:"required"`
}
