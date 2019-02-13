//first fetching the Link using the prisma client instance and then invoke postedBy() on it
function postedBy(parent, args, context) {
  return context.prisma.link({ id: parent.id }).postedBy()
}


function votes(parent, args, context) {
  return context.prisma.link({ id: parent.id }).votes()
}


module.exports = {
  postedBy,
  votes
}