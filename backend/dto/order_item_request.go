package dto

type OrderItemRequest struct {
	ProductID uint `json:"ProductId"`
	Quantity  uint `json:"Quantity"`
}
