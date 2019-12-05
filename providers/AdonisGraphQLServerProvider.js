const { ServiceProvider } = require('@adonisjs/fold');

class AdonisGraphQLServerProvider extends ServiceProvider {
    register() {
        this.app.singleton('GraphQLServer', () => {
            const Config = this.app.use('Adonis/Src/Config');
            const { runHttpQuery } = this.app.use('apollo-server-core');
            const GraphiQL = this.app.use('apollo-server-module-graphiql');
            const qs = this.app.use('querystring');

            return new (require('../src/AdonisGraphQLServer'))({ Config, runHttpQuery, GraphiQL, qs });
        });
    }
}

module.exports = AdonisGraphQLServerProvider;
