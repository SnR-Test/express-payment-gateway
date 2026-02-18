export const authJwt = () => async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {
	const tokenHeader: string = req.headers.authorization
	if (!tokenHeader) {
		message({
			response: res,
			statusCode: 401,
			method: req.method,
			message: 'unauthorized, access token is required'
		})
		return
	}

	// Check if token starts with 'Bearer '
	if (!tokenHeader.startsWith('Bearer ')) {
		message({
			response: res,
			statusCode: 401,
			method: req.method,
			message: 'unauthorized, invalid token format'
		})
		return
	}

	const token = tokenHeader.substring(7) // Remove 'Bearer '
	if (!token) {
		message({
			response: res,
			statusCode: 401,
			method: req.method,
			message: 'unauthorized, access token is required'
		})
		return
	}

	try {
		const decodedToken = await verifySignAccessToken(token)
		req.user = decodedToken
		next()
	} catch (err) {
		message({
			response: res,
			statusCode: 401,
			method: req.method,
			message: 'unauthorized, access token expired or invalid'
		})
		return
	}
}