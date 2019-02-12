const { GraphQLServer } = require('graphql-yoga')

//used to store the links at runtime
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

// 2
//actual implementation of the GraphQL schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,    
    feed: () => links,
    getById: (parent, args) => {
    	return links.find(function(item){
    		return item.id === args.id
    	})
    }
  },
  Mutation: {    
    post: (parent, args) => {
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    update: (parent, args) => {
        let updated = links.find(function(item){
    		return item.id === args.id
    	})

    	updated.url = args.url
    	updated.description = args.description

    	return updated
    },
    delete: (parent, args) => {
        let itemToDelete = links.find(function(item){
    		return item.id === args.id
    	})

    	var index = links.indexOf(itemToDelete);
		if (index !== -1) links.splice(index, 1);
    },
  },
  // Link: {
  //   id: (parent) => parent.id, //argument, commonly called parent (or sometimes root) is the result of the previous resolver execution level
  //   description: (parent) => parent.description,
  //   url: (parent) => parent.url,
  // } 
}

// 3
// the schema and resolvers are bundled and passed to the GraphQLServer
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))