module.exports = {
    async feed(parent, args, context) {
        return await context.prisma.link.findMany()
    },
}