## Registering provider

Make sure to register the adonis-graphql-server provider to make use of `GraphQLServer`. The providers are registered inside `start/app.js`

```js
const providers = ['adonis-graphql-server/providers/AdonisGraphQLServerProvider'];
```

### Config graphql

the config automatic create to `config/graphql.js` file

```js
module.exports = {
    typeDefs: {},
    resolvers: {},
};
```

## Usage

We need to create typeDefs and resolvers to use this provider, this is an example of config file:

```js
// config/graphql.js

const { gql } = use("apollo-server-core");

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books
  }
};

module.exports = {
  typeDefs,
  resolvers
  context: (request) => ({
        auth: {
            check() => {
                // can check if user is authenticated
            },
            logout() => {},
            refreshToken() => {},
        }
        // you can change context with everything you want
  }),
  endpoint: "/graphql", // default is already /graphql, but if you want to change graphql endpoint, change this to make graphiql work
  formatError: err => {
    return err.message;
  }
};

```

Now we need to configure routes

```js
// start/routes.js

'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

/** @type {import('adonis-graphql-server/src/AdonisGraphQLServer')} */
const GraphQL = use('GraphQLServer');

Route.post('/graphql', context => {
    return GraphQL.graphql(context);
});

Route.get('/graphiql', context => {
    return GraphQL.graphiql(context);
});
```

And **that's it**! Now you're free to use GraphQL Server.
