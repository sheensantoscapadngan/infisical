import { apiRequest } from "@app/config/request"
import { getSession } from "next-auth/react"

export default async (req, res) => {
    const session = await getSession({ req })
    console.log('SESSION EMAIL IS', session?.user?.email)
    apiRequest()
}

export const createEmailSignup = () => fetch()