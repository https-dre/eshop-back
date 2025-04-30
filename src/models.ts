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

export type User = {
    id: string,
    name: string,
    email: string,
    password_hash: string,
    cpf: string
}

export type CartItem = {
    id: string,
    product_id: string,
    user_id: string
}

export type Order = {
    id: string,
    user_id: string,
    product_id: string,
    payment_method: string,
    status: string,
    payment_date: Date
}