// Extract and validate the authorization token
  const authToken = headers.Authorization || headers.authorization;
  
  if (!authToken) {
    throw new Error('Unauthorized: No authorization token provided');
  }
  
  try {
    // Remove 'Bearer ' prefix if present
    const token = authToken.replace(/^Bearer\s+/i, '');
    
    // Validate JWT token (implement your JWT validation logic here)
    const decodedToken = validateJWTToken(token);
    
    // Check if token is expired
    if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
      throw new Error('Unauthorized: Token expired');
    }
    
    // Validate user permissions for the resource
    if (!hasPermission(decodedToken, methodArn)) {
      throw new Error('Forbidden: Insufficient permissions');
    }
    
    return createAuthorizedResponse(methodArn);
  } catch (error) {
    console.error('Authorization failed:', error.message);
    throw new Error('Unauthorized: ' + error.message);
  }