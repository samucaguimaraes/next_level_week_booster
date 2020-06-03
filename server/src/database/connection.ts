import knex from 'knex';
import path from 'path';

/**
 * Utilizado o knex como Query Builder e o path para generalizar o caminho do banco de dados.
 */
const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite'),
  },
  useNullAsDefault: true, 
});

export default connection;