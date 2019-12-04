/*
 * adonis-graphql-server
 *
 * (c) Eduardo Santos de Brito <edu.santos.brito@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path');

module.exports = async cli => {
    try {
        await cli.makeConfig('graphql.js', path.join(__dirname, './templates/config.mustache'));
        cli.command.completed('create', 'config/graphql.js');
    } catch (error) {
        // ignore errors
    }
};
