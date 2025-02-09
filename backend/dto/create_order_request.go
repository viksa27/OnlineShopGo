package dto

type CreateOrderRequest struct {
	Items           []OrderItemRequest `json:"Items" binding:"required"`
	ShippingAddress string             `json:"ShippingAddress" binding:"required"`
	PaymentMethod   string             `json:"PaymentMethod"`
}
