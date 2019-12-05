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
    constructor({ Config, runHttpQuery, GraphiQL, qs }) {
        this.Config = Config;
        this.options = this.Config.get('graphql');
        this.runHttpQuery = runHttpQuery;
        this.GraphiQL = GraphiQL;
        this.qs = qs;
    }

    async getBodyData(request) {
        if (request.method === 'POST') {
            let body = '';

            request.on('data', data => {
                body += data;
            });

            request.on('end', () => {
                const post = this.qs.parse(body);
                console.log(post);
            });
        }
    }

    async graphql({ req, res }) {
        if (!this.options) {
            throw new Error('Apollo Server requires options.');
        }
        await this.getBodyData();
        try {
            const gqlResponse = await this.runHttpQuery([req], {
                method: req.method,
                options: this.options,
                query: req.method === 'POST' ? req.post() : req.get(),
            });
            return res.json(gqlResponse);
        } catch (error) {
            if (error.name !== 'HttpQueryError') {
                throw error;
            }
            if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                    res.header(header, error.headers[header]);
                });
            }
            return res.statusCode(error.statusCode).send(error.message);
        }
    }

    // async graphiql(options, request, response) {
    //     if (!options) {
    //         throw new Error('Apollo Server GraphiQL requires options.');
    //     }

    //     const query = request.originalUrl();

    //     try {
    //         const graphiqlString = await this.GraphiQL.resolveGraphiQLString(query, options, request);
    //         return response.header('Content-Type', 'text/html').send(graphiqlString);
    //     } catch (error) {
    //         return response.send(error);
    //     }
    // }
}

module.exports = AdonisGraphQLServer;
