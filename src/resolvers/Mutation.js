const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

module.exports = {
    async post(parent, args, context, info) {
        const userId = getUserId(context);
        return await context.prisma.link.create({
            data: {
                url: args.url,
                description: args.description,
                postedBy: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    },

    async updateLink(parent, args, context, info) {
        const data = {};
        for (const key in args) {
            if (args.hasOwnProperty(key) && key != "id") {
                data[key] = args[key];
            }
        };
        const link = await context.prisma.link.update({
            where: { id: parseInt(args.id) },
            data
        })
        return link;
    },

    async deleteLink(parent, args, context, info) {
        return await context.prisma.link.delete({
            where: { id: parseInt(args.id) }
        })
    },

    async signup(parent, args, context, info) {
        const password = await bcrypt.hash(args.password, 10)
        
        const user = await context.prisma.user.create({ data: { ...args, password } })
      
        const token = jwt.sign({ userId: user.id }, APP_SECRET)
      
        return {
          token,
          user,
        }
    },

    async login(parent, args, context, info) {
        const user = await context.prisma.user.findOne({ where: { email: args.email } });

        if (!user) {
          throw new Error('No such user found')
        };
      
        const valid = await bcrypt.compare(args.password, user.password);

        if (!valid) {
          throw new Error('Invalid password')
        };
      
        const token = jwt.sign({ userId: user.id }, APP_SECRET);
      
        return {
          token,
          user,
        }
    }
}