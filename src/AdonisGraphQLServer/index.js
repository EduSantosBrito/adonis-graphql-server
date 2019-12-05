/**
 * adonis-graphql-server is a provider that gives you power to use GraphQL whitout limitation
 *
 * @constructor
 * @singleton
 * @uses (['Adonis/Src/Config'])
 *
 * @class AdonisGraphQLServer
 */
class AdonisGraphQLServer {
    constructor({ Config, runHttpQuery, GraphiQL, makeExecutableSchema }) {
        this.Config = Config;
        this.options = this.Config.get('graphql');
        this.runHttpQuery = runHttpQuery;
        this.GraphiQL = GraphiQL;
        this.makeExecutableSchema = makeExecutableSchema;
    }

    async graphql({ request, response }) {
        const { typeDefs, resolvers, context, endpoint, ...options } = this.options;
        if (!this.options || !typeDefs || !resolvers) {
            throw new Error('Apollo Server requires options.');
        }
        try {
            const { graphqlResponse } = await this.runHttpQuery([request], {
                method: request.method(),
                options: {
                    schema: this.makeExecutableSchema({ typeDefs, resolvers }),
                    context: typeof context === 'function' ? context(request) : context,
                    ...options,
                },
                query: request.method() === 'POST' ? request.post() : request.get(),
            });
            response.safeHeader('Content-type', 'application/json');
            return response.json(graphqlResponse);
        } catch (error) {
            if (error.name !== 'HttpQueryError') {
                throw error;
            }
            if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                    response.header(header, error.headers[header]);
                });
            }
            return response.status(error.statusCode).send(error.message);
        }
    }

    async graphiql({ response }) {
        const { endpoint } = this.options;
        try {
            const graphqlOptions = { endpoint: endpoint || '/graphql' };
            const playground = this.GraphiQL.renderPlaygroundPage(graphqlOptions);
            return response.header('Content-Type', 'text/html').send(playground);
        } catch (error) {
            if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                    response.header(header, error.headers[header]);
                });
            }
            return response.status(error.statusCode).send(error.message);
        }
    }
}

module.exports = AdonisGraphQLServer;
