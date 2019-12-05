const { ServiceProvider } = require('@adonisjs/fold');

class AdonisGraphQLServerProvider extends ServiceProvider {
    register() {
        this.app.singleton('GraphQLServer', () => {
            const Config = this.app.use('Adonis/Src/Config');
            const { runHttpQuery } = this.app.use('apollo-server-core');
            const GraphiQL = this.app.use('apollo-server-module-graphiql');
            const jsonBody = this.app.use('body/json');

            return new (require('../src/AdonisGraphQLServer'))({ Config, runHttpQuery, GraphiQL, jsonBody });
        });
    }
}

module.exports = AdonisGraphQLServerProvider;
