// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest } from "next"
import getstream from "getstream"

const client = getstream.connect(
	process.env.STREAM_API_KEY as string,
	process.env.STREAM_SECRET_KEY as string,
	process.env.STREAM_PROJECT_ID ?? ""
)
interface InputData {
	userId: string
}
export default function handler(req: NextApiRequest) {
	if (req.method !== "POST") {
		return new Response("Method not allowed", { status: 405 })
	}
	const authorization = req.headers.authorization
	if (!authorization) {
		return new Response("Unauthorized", { status: 401 })
	}

	const token = authorization.replace("Bearer ", "")
	if (token !== process.env.API_SECRET_JWT) {
		return new Response("Unauthorized", { status: 401 })
	}
	const { userId }: InputData = req.body
	const userToken = client.createUserToken(userId)
	return new Response(JSON.stringify({ data: userToken, error: null }), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	})
}
