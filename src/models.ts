export type Product = {
    id: string,
    name: string,
    description: string,
    price_in_cents: number,
    created_at_utc: string,
    created_at: string
}

export type ProductImage = {
    id: string,
    name: string,
    local: string,
    product_id: string
}