function info() {
	return `This is the API of a Hackernews Clone`
}


// function feed(parent, args, context, info) {
//   return context.prisma.links()
// }

async function feed(parent, args, context, info) {
  //if no filter string is provided, then the where object will be just an empty object and no filtering conditions will be applied by the Prisma engine
  //in case there is a filter carried by the incoming args, you’re constructing a where object that expresses our two filter conditions from above
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {}

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  })
  //return links

  //using the linksConnection query from the Prisma client API to retrieve the total number of Link elements currently stored in the database
  const count = await context.prisma
    .linksConnection({
      where
    })
    .aggregate()
    .count()

  return {
    links,
    count
  }
}


function getById(root, args, context, info) {
  return context.prisma.link({id: args.id})
}


module.exports = {
  info,
  feed,
  getById
}