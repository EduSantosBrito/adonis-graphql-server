function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}

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
    constructor({ Config, runHttpQuery, GraphiQL, makeExecutableSchema, print }) {
        this.Config = Config;
        this.options = this.Config.get('graphql');
        this.runHttpQuery = runHttpQuery;
        this.GraphiQL = GraphiQL;
        this.makeExecutableSchema = makeExecutableSchema;
        this.print = print;
    }

    _getQueryObject(body) {
        const { query, variables } = body;
        if (variables) {
            if (isString(query)) {
                return { query, variables };
            }
            return { query: this.print(query), variables };
        }
        if (isString(query)) {
            return { query };
        }
        return { query: this.print(query) };
    }

    _getSchemaValues() {
        const { typeDefs, resolvers, schemaDirectives } = this.options;
        if (!typeDefs || !resolvers) {
            throw new Error('typeDefs and resolvers are required');
        }
        if (schemaDirectives) {
            return { typeDefs, resolvers, schemaDirectives };
        }
        return { typeDefs, resolvers };
    }

    async graphql({ request, response }) {
        const { typeDefs, resolvers, context, endpoint, ...options } = this.options;
        if (!this.options) {
            throw new Error('Options is required.');
        }
        const { query, variables } = request.method() === 'POST' ? request.post() : request.get();
        try {
            const { graphqlResponse } = await this.runHttpQuery([request], {
                method: request.method(),
                options: {
                    schema: this.makeExecutableSchema(this._getSchemaValues()),
                    context: typeof context === 'function' ? context(request) : context,
                    ...options,
                },
                query: this._getQueryObject({ query, variables }),
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
