const jwt = require('jsonwebtoken')
const APP_SECRET = 'GraphQL-is-aw3some'

//helper function that you’ll call in resolvers which require authentication
function getUserId(context) {
  // first retrieves the Authorization header (which contains the User’s JWT)
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    //verifies the JWT and retrieves the User’s ID from it
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getUserId
}