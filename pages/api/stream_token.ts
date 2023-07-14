// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "getstream"

interface InputData {
	userId: string
}

type Data = {
	data: string
	error?: string
}
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method !== "POST") {
		return new Response("Method not allowed", { status: 405 })
	}
	const authorization = req.headers.authorization
	if (!authorization) {
		return new Response("Unauthorizedzz", { status: 401 })
	}

	const token = authorization.replace("Bearer ", "")

	if (token !== process.env.API_SECRET_JWT) {
		return res.status(401).json({ error: "Unauthorizedz", data: null })
	}
	const { userId }: InputData = req.body

	const streamClient = connect(
		process.env.STREAM_API_KEY as string,
		process.env.STREAM_SECRET_KEY as string,
		undefined,
		{
			browser: false,
			location: "us-east",
		}
	)

	const userToken = streamClient.createUserToken(userId)

	return res.status(200).json({ data: userToken })
}
