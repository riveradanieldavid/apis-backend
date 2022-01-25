const express = require('express');
const router = express.Router();
const moviesApiController = require('../../controllers/api/moviesApiController');

//RUTAS API

//MOVIES
//Listado de películas
router.get('/', moviesApiController.list);
//Detalle de una película
router.get('/:id', moviesApiController.detail);
//Filtrar películas por rating. Puede colocar desde 1 hasta 10
router.get('/recomended/:rating', moviesApiController.recomended);

// CRUD
//Agregar una película
router.post('/store', moviesApiController.store);
//Modificar una película
router.put('/update/:id', moviesApiController.update);
//Eliminar una película
router.delete('/delete/:id', moviesApiController.destroy);

module.exports = router;