const { GraphQLServer } = require('graphql-yoga');

// Fake links DB
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
},
    {
    id: 'link-1',
    url: 'www.lala.ru',
    description: 'Fullstack tutorial'
}]
//fake id generator
let idCount = links.length;

const resolvers = {
    Query: {
        info() {
            return 'This is the API of Hackernews Clone'
        },
        feed() {
            return links
        },
        link(parent, args) {
            return links.find(link => link.id == args.id)
        }
    },
    Mutation: {
        post(parent, args) {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            };
            links.push(link);
            return link;
        },
        updateLink(parent, args) {
            const ind = links.findIndex(link => link.id == args.id);
            const link = links[ind];
            for (const prop in args) {
                if (args.hasOwnProperty(prop)) {
                   link[prop] = args[prop]
                }
            }
            return link;
        },
        deleteLink(parent, args) {
            const ind = links.findIndex(link => link.id == args.id);
            return links.splice(ind, 1)[0];
        }
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers
});

server.start(() => {
    console.log(`Server is running on host 4000`)
});