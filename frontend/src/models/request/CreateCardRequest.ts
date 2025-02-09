export interface CreateCardRequest {
    name: string,
    number: string,
    cvc: string,
    expiry_month: number,
    expiry_year: number,
}
