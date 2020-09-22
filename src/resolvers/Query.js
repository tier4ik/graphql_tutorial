module.exports = {
    async feed(parent, args, context) {

        const where = args.filter ? {
            OR: [
                { description: { contains: args.filter } },
                { url: { contains: args.filter } }
            ]
        } : {};

        const links = await context.prisma.link.findMany({
            where,
            skip: args.skip,
            take: args.take
        });

        const count = await context.prisma.link.count({ where });

        return {
            links,
            count
        }
    },
    async link(parent, args, context) {
        return await context.prisma.link.findOne({
            where: {
                id: parseInt(args.id)
            }
        })
    }
}