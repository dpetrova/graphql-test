const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')


async function signup(parent, args, context, info) {
  //encrypting the User’s password using the bcryptjs library   
  const password = await bcrypt.hash(args.password, 10)
  //use the prisma client instance to store the new User in the database  
  const user = await context.prisma.createUser({ ...args, password })
  // then generating a JWT which is signed with an APP_SECRET
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}


async function login(parent, args, context, info) {
  //using the prisma client instance to retrieve the existing User record by the email address  
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }
  //compare the provided password with the one that is stored in the database
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}


function post(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  })
}


function update(parent, args, context, info){
  return context.prisma.updateLink({url: args.url, description: args.description}, {id: args.id})
}


function deleteLink(parent, args, context, info){
  return context.prisma.deleteLink({id: args.id})
}


async function vote(parent, args, context, info) { 
  //validate the incoming JWT with the getUserId helper function 
  const userId = getUserId(context)
  //$exists function takes a where filter object that allows to specify certain conditions about elements of that type
  //only if the condition applies to at least one element in the database, the $exists function returns true
  //in this case, you’re using it to verify that the requesting User has not yet voted for the Link that’s identified by args.linkId
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  })
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  })
}

module.exports = {
  signup,
  login,
  post,
  update,
  deleteLink,
  vote
}