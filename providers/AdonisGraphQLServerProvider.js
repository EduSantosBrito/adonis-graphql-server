const { ServiceProvider } = require('@adonisjs/fold');
const { graphqlAdonis, graphiqlAdonis } = require('../src/AdonisGraphQLServer/ApolloServer');

class AdonisMongodbProvider extends ServiceProvider {
    register() {
        this.app.singleton('GraphQLServer', () => {
            const Config = this.app.use('Adonis/Src/Config');
            return new (require('../src/AdonisGraphQLServer'))({ Config, graphqlAdonis, graphiqlAdonis });
        });
    }
}

module.exports = AdonisMongodbProvider;
