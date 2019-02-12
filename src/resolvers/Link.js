//first fetching the Link using the prisma client instance and then invoke postedBy() on it
function postedBy(parent, args, context) {
  return context.prisma.link({ id: parent.id }).postedBy()
}

module.exports = {
  postedBy
}