const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

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
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.prisma.links()
    },
    getById: (root, args, context, info) => {
     	return context.prisma.link({id: args.id})
    }
  },
  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      })
    },
    // update: (root, args, context) => {
    // 	return context.prisma.updateLink({url: args.url, description: args.description}, {id: args.id})
    // },
    delete: (root, args, context) => {
    	return context.prisma.deleteLink({id: args.id})
    }
  },
}


// const resolvers = {
//   Query: {
//     info: () => `This is the API of a Hackernews Clone`,    
//     feed: () => links,
//     getById: (parent, args) => {
//     	return links.find(function(item){
//     		return item.id === args.id
//     	})
//     }
//   },
//   Mutation: {    
//     post: (parent, args) => {
//        const link = {
//         id: `link-${idCount++}`,
//         description: args.description,
//         url: args.url,
//       }
//       links.push(link)
//       return link
//     },
//     update: (parent, args) => {
//         let updated = links.find(function(item){
//     		return item.id === args.id
//     	})

//     	updated.url = args.url
//     	updated.description = args.description

//     	return updated
//     },
//     delete: (parent, args) => {
//         let itemToDelete = links.find(function(item){
//     		return item.id === args.id
//     	})

//     	var index = links.indexOf(itemToDelete);
// 		if (index !== -1) links.splice(index, 1);
//     },
//   },  
// }


// the schema and resolvers are bundled and passed to the GraphQLServer
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})

server.start(() => console.log(`Server is running on http://localhost:4000`))