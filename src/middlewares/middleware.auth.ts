export const authJwt = () => (req: Request | any, res: Response, next: NextFunction): void => {
	const tokenHeader: string = req.headers.authorization
	
	if (!tokenHeader) {
		return message({
			response: res,
			statusCode: 401,
			method: req.method,
			message: 'Unauthorized: access token is required'
		})
	}
	
	if (!tokenHeader.startsWith('Bearer ')) {
		return message({
			response: res,
			statusCode: 401,
			method: req.method,
			message: 'Unauthorized: invalid token format'
		})
	}
	
	const token = tokenHeader.substring(7) // Remove 'Bearer ' prefix
	
	if (!token) {
		return message({
			response: res,
			statusCode: 401,
			method: req.method,
			message: 'Unauthorized: token is empty'
		})
	}
	
	try {
		const decodedToken = verifySignAccessToken(token)
		req.user = decodedToken
		next()
	} catch (err) {
		return message({
			response: res,
			statusCode: 401,
			method: req.method,
			message: 'Unauthorized: access token expired or invalid'
		})
	}
}