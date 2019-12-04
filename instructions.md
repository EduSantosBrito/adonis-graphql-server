## Registering provider

Make sure to register the adonis-graphql-server provider to make use of `GraphQLServer`. The providers are registered inside `start/app.js`

```js
const providers = ['adonis-graphql-server/providers/AdonisGraphQLServerProvider'];
```

### Config graphql

the config automatic create to `config/graphql.js` file

```js
const Env = use('Env')

module.exports = {
    typeDefs: {},
    resolvers: {}
};
```

## Usage