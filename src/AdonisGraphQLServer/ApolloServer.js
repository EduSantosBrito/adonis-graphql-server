const Route = require('@adonisjs/framework/src/Route/Manager');
const { renderPlaygroundPage } = require('@apollographql/graphql-playground-html');
const { ApolloServerBase } = require('apollo-server-core');
const { graphqlAdonis } = require('./AdonisApollo');

export { GraphQLExtension, GraphQLOptions } from 'apollo-server-core';

class ApolloServer extends ApolloServerBase {
    constructor() {
        super();
        this.registerRoutes = this.registerRoutes.bind(this);
    }

    // This translates the arguments from the middleware into graphQL options It
    // provides typings for the integration specific behavior, ideally this would
    // be propagated with a generic to the super class
    async createGraphQLServerOptions(ctx) {
        return super.graphQLServerOptions({ ctx });
    }

    supportsSubscriptions() {
        return true;
    }

    supportsUploads() {
        return false;
    }

    registerRoutes({ router, path }) {
        if (!path) {
            this.path = '/graphql';
        }

        if (!router) {
            this.router = Route;
        }

        const promiseWillStart = this.willStart();

        this.graphqlPath = this.path;

        this.router.any(this.path, async ctx => {
            await promiseWillStart;
            if (this.playgroundOptions && ctx.req.method() === 'GET') {
                // perform more expensive content-type check only if necessary
                const prefersHTML = ctx.req.types().find(x => x === 'text/html' || x === 'application/json') === 'text/html';

                if (prefersHTML) {
                    const playgroundRenderPageOptions = {
                        endpoint: this.path,
                        subscriptionEndpoint: this.subscriptionsPath,
                        ...this.playgroundOptions,
                    };
                    const playground = renderPlaygroundPage(playgroundRenderPageOptions);
                    ctx.req.type('text/html').send(playground);
                    return;
                }
            }
            // eslint-disable-next-line consistent-return
            return graphqlAdonis(() => {
                return this.createGraphQLServerOptions(ctx);
            })(ctx);
        });
    }
}

module.exports = ApolloServer;
