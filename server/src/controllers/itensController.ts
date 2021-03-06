import knex from '../database/connection';
import { Request, Response } from 'express';

class ItensController {

  async index(request: Request, response: Response) {
    const itens = await knex('itens').select('*');

    const serializedItens = itens.map(item => {
      return {
        id: item.id,
        name: item.name,
        image_url: `http://localhost:3333/uploads/${item.image}`,
      };
    });
    return response.json(serializedItens);
  }

}

export default ItensController;