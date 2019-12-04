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
    constructor({ Config, graphiqlAdonis, graphqlAdonis }) {
        this.Config = Config;
        this.options = this.Config.get('graphql');
        this.graphiqlAdonis = graphiqlAdonis;
        this.graphqlAdonis = graphqlAdonis;
    }

    handle(context) {
        return this.graphqlAdonis({
            context,
            schema: this.$schema,
        })(context);
    }

    handleUi(context) {
        return this.graphiqlAdonis({ endpointURL: '/' })(context);
    }
}

module.exports = AdonisGraphQLServer;
