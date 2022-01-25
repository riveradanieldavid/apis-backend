const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

//MOVIES
router.get('/movies', moviesController.list);
router.get('/movies/new', moviesController.new);
router.get('/movies/recommended', moviesController.recomended);
router.get('/movies/detail/:id', moviesController.detail);

// API
router.get('/movies/search', moviesController.search)
// ESTA       /movies/detailOmdbapi/:imdbID  RUTA ES LA MISMA DEL LINK DE VISTA moviesListOmdbapi.ejs
router.get('/movies/detailOmdbapi/:imdbID', moviesController.detailOmdbapi)

//CRUD
router.get('/movies/add', moviesController.add);
router.post('/movies/create', moviesController.create);
router.get('/movies/edit/:id', moviesController.edit);
router.put('/movies/update/:id', moviesController.update);
router.get('/movies/delete/:id', moviesController.delete);
router.delete('/movies/delete/:id', moviesController.destroy);

module.exports = router;