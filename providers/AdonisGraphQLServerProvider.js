const { ServiceProvider } = require('@adonisjs/fold');

class AdonisGraphQLServerProvider extends ServiceProvider {
    register() {
        this.app.singleton('GraphQLServer', () => {
            const Config = this.app.use('Adonis/Src/Config');
            const { runHttpQuery, gql } = this.app.use('apollo-server-core');
            const GraphiQL = this.app.use('graphql-playground-html');
            const { makeExecutableSchema } = this.app.use('graphql-tools');
            const { print } = this.app.use('graphql/language/printer');
            const { GraphQLUpload } = this.app.use('graphql-upload');

            return new (require('../src/AdonisGraphQLServer'))({
                Config,
                runHttpQuery,
                GraphiQL,
                makeExecutableSchema,
                print,
                GraphQLUpload,
                gql,
            });
        });
    }
}

module.exports = AdonisGraphQLServerProvider;
