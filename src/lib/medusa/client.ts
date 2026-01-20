const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

const medusaClient = {
  baseUrl: MEDUSA_BACKEND_URL,
}

export { medusaClient }

