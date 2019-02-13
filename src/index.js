const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Vote = require('./resolvers/Vote')

// add a link to the database
// async function main() {
//   // Create a new link
//   const newLink = await prisma.createLink({ 
//     url: 'www.prisma.io',
//     description: 'Prisma replaces traditional ORMs',
//   })
//   console.log(`Created new link: ${newLink.url} (ID: ${newLink.id})`)

//   // Read all links from the database and print them to the console
//   const allLinks = await prisma.links()
//   console.log(allLinks)
// }

// main().catch(e => console.error(e))


//actual implementation of the GraphQL schema
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote
}


// the schema and resolvers are bundled and passed to the GraphQLServer
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  // creating the context as a function which returns the context
  //the advantage of this approach is that you can attach the HTTP request that carries the incoming GraphQL query (or mutation) to the context
  context: request => {
    return {
      ...request, //spread over the request object and get all its properties, then overwrite the existing properties with the prisma we're passing
      prisma,
    }
  }
})

server.start(() => console.log(`Server is running on http://localhost:4000`))