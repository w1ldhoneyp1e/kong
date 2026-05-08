# Nest Backend Migration

## Goal

Replace Medusa with a project-owned NestJS backend without blocking current frontend work.

## Current approach

The new backend lives in `api/` and is started in parallel to the existing Medusa service.

## First migration slices

1. `health` and environment bootstrapping
2. `catalog/products` read path for admin and storefront
3. `catalog/products` write path for admin
4. `staff auth` and permissions
5. `cart`
6. `orders`
7. `customers`

## Notes

- The Prisma schema already reflects the target R1 domain shape: products, variants, prices, customers, carts, orders, staff, and permissions.
- Until a slice is fully migrated, frontend routes should continue using the existing backend for that slice.
