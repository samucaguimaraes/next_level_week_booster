import express from 'express';
import PointsController from './controllers/pointsController';
import ItensController from './controllers/itensController';

//Iniciando objetos
const routes = express.Router();
const pointsController =  new PointsController();
const itensController =  new ItensController();

/** Rota para listar os itens  */
routes.get('/itens', itensController.index);
/** Rota para criação de Points */
routes.post('/points',pointsController.create);
routes.get('/points/',pointsController.index);
routes.get('/points/:id',pointsController.show);

export default routes;
