const { convertNodeHttpToRequest, runHttpQuery } = require('apollo-server-core');

function graphqlAdonis(options) {
    if (!options) {
        throw new Error('Apollo Server requires options.');
    }

    if (arguments.length > 1) {
        // TODO: test this
        throw new Error(`Apollo Server expects exactly one argument, got ${arguments.length}`);
    }

    const graphqlHandler = ctx => {
        const method = ctx.req.method();
        let query = method === 'POST' ? ctx.req._body : ctx.req._qs;
        if (query === null) {
            query = undefined;
        }
        return runHttpQuery([ctx], {
            method,
            query,
            options,
            request: convertNodeHttpToRequest(ctx.req.request),
        }).then(
            ({ graphqlResponse, responseInit }) => {
                Object.keys(responseInit.headers).forEach(key => ctx.res.header(key, responseInit.headers[key]));
                ctx.res.send(graphqlResponse);
            },
            error => {
                if (error.name !== 'HttpQueryError') {
                    throw error;
                }

                if (error.headers) {
                    Object.keys(error.headers).forEach(header => {
                        ctx.res.header(header, error.headers[header]);
                    });
                }

                ctx.res.status(error.statusCode).send(error.message);
            },
        );
    };

    return graphqlHandler;
}

module.exports = { graphqlAdonis };
