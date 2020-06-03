import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {


    async index(request: Request, response: Response) {
        // Filtros: city, uf e itens

        const {city, uf, itens} = request.query;

        /** Retornar os pontos que possuem itens específicos */
        /** Quebrando o o query itens para colocar no IN do select */
        const parsedItens = String(itens)
            .split(',')
            .map(item => Number(item.trim()));
         
         
        /** Query */ 
        const points = await knex('points')
            .join('point_itens','points.id', '=', 'point_itens.point_id')
            .whereIn('point_itens.item_id',parsedItens)
            .where('city',String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(points);

    }

    async show(request: Request, response: Response) {

        /** Utilizado a desconstrução, pois o nome do Id = Params.id */
        const { id } = request.params;

        /**SELECT * FROM POINTS WHERE id = {id} LIMIT 1 */
        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({ message: 'Point not found' });
        }

        /** Listando os itens que pertencem ao point */
        /** SELECT * FROM itens
         *      JOIN point_itens ON itens.id = point_itens.pointe_id = {id}
         */
        const itens = await knex('itens')
            .join('point_itens', 'itens.id', '=', 'point_itens.item_id')
            .where('point_itens.item_id', id)
            .select('itens.name');


        return response.json({ point, itens });
    }


    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            itens
        } = request.body;

        /*Start da trasanção */
        const trx = await knex.transaction();

        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        /** Insert na tabela itens e  */
        const insertedIds = await trx('points').insert(point);
        /* armazeno o id gerado para alimentar a tabela de cruzamento*/
        const point_id = insertedIds[0];

        /** Pegando os itens inserido */
        const pointItens = itens.map((item_id: number) => {

            return {
                item_id,
                point_id,
            };
        });

        await trx('point_itens').insert(pointItens);

        await trx.commit();

        return response.json({
            id: point_id,
            ...point

        });
    }


}

export default PointsController