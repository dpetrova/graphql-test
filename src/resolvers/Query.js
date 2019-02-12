function info() {
	return `This is the API of a Hackernews Clone`
}

function feed(parent, args, context, info) {
  return context.prisma.links()
}

function getById(root, args, context, info) {
  return context.prisma.link({id: args.id})
}

module.exports = {
  info,
  feed,
  getById
}