const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const fetch = require('node-fetch');


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;
const API = 'http://www.omdbapi.com/?apikey=d4e35e92'; // http://www.omdbapi.com/?apikey=5ceb580d&t=harry

let resultsFromOmdbapi = '';
let resultsFromOmdbapiImdbID = '';

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll({
            include: ['genre']
        })
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include: ['genre']
            })
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    },


    // API
    //Aqui debo modificar para crear la funcionalidad requerida

    //QUITÁNDOLE  EL then.(results=>{})  TIRA UN OBJETO CON SU URL
    // 'search': async (req, res) => { //async  ESTA ES UN AFUNCION ASINCRÓNICA
    //     let moviesOmdbapi = 'http://www.omdbapi.com/?apikey=5ceb580d&s=' + req.query.fromOmdbapi;
    //     // let prueba = 'http://www.omdbapi.com/?apikey=5ceb580d&t=muy'; //PUEDE FETCHEARSE VARIABLE CON URL
    //     await fetch(moviesOmdbapi) //ESPERAR QUE ESTE FETCH SE RESUELVA
    //         .then(response => response.json()) //LUEGO, OBTENER RESPUESTA
    //     // .then(results => { //LUEGO, PONER RESPUESTA EN results
    //     return res.send({ moviesOmdbapi }) //RETORNAR results
    // },

    // MUESTRA RESULTADOS DE LA BUSQUEDA EFECTUADA. ESTE ME SIREVE AHORA
    //          async  ESTA ES UN AFUNCION ASINCRÓNICA
    'search': async (req, res) => {
        let moviesOmdbapi = 'http://www.omdbapi.com/?apikey=5ceb580d&t=' + req.query.fromOmdbapi;
        // let prueba = 'http://www.omdbapi.com/?apikey=5ceb580d&t=muy'; //PUEDE FETCHEARSE VARIABLE CON URL
        //ESPERAR QUE ESTE FETCH SE RESUELVA        
        await fetch(moviesOmdbapi)
            //LUEGO, OBTENER RESPUESTA
            .then(response => response.json())
            //LUEGO, PONER RESPUESTA EN results            
            .then(results => {
                //RETORNAR results
                // return res.send(results)
                return res.render('moviesDetail', {
                    results
                })
            })
    },

    //MUESTRA 1 RESULTADO ESTATICO DE API omdbapi
    // 'search': async (req, res) => {
    //     await fetch('http://www.omdbapi.com/?apikey=5ceb580d&t=azul')
    //         .then(response => response.json())
    //         .then(moviesOmdbapi => {
    //             return res.json({ moviesOmdbapi })
    //         })
    // },

    //                       async  ESTA ES UN AFUNCION ASINCRÓNICA
    'detailOmdbapi': async (req, res) => {
        let moviesOmdbapi = 'http://www.omdbapi.com/?apikey=5ceb580d&t=' + resultsFromOmdbapiImdbID;
        //ESPERAR QUE ESTE FETCH SE RESUELVA        
        await fetch(moviesOmdbapi)
            //LUEGO, OBTENER RESPUESTA
            .then(response => response.json())
            //LUEGO, PONER RESPUESTA EN results            
            .then(results => {
                //RETORNAR results
                return res.send(results) //COMPROBAR EN FORMATO JSON | .send O .json DEVUELVE UN JSON PUES ANTES SE CONFIGURÓ PARA ESO
                return res.render('moviesListOmdbapi', {
                    resultsFromOmdbapi
                })
            })
    },
    // API /

    //CRUD
    add: function (req, res) {
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();

        Promise
            .all([promGenres, promActors])
            .then(([allGenres, allActors]) => {
                return res.render(path.resolve(__dirname, '..', 'views', 'moviesAdd'), { allGenres, allActors })
            })
            .catch(error => res.send(error))
    },
    create: function (req, res) {
        Movies
            .create(
                {
                    title: req.body.title,
                    rating: req.body.rating,
                    awards: req.body.awards,
                    release_date: req.body.release_date,
                    length: req.body.length,
                    genre_id: req.body.genre_id
                }
            )
            .then(() => {
                return res.redirect('/movies')
            })
            .catch(error => res.send(error))
    },
    edit: function (req, res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId, { include: ['genre', 'actors'] });
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
            .all([promMovies, promGenres, promActors])
            .then(([Movie, allGenres, allActors]) => {
                Movie.release_date = moment(Movie.release_date).format('L');
                return res.render(path.resolve(__dirname, '..', 'views', 'moviesEdit'), { Movie, allGenres, allActors })
            })
            .catch(error => res.send(error))
    },
    update: function (req, res) {
        let movieId = req.params.id;
        Movies
            .update(
                {
                    title: req.body.title,
                    rating: req.body.rating,
                    awards: req.body.awards,
                    release_date: req.body.release_date,
                    length: req.body.length,
                    genre_id: req.body.genre_id
                },
                {
                    where: { id: movieId }
                })
            .then(() => {
                return res.redirect('/movies')
            })
            .catch(error => res.send(error))
    },
    delete: function (req, res) {
        let movieId = req.params.id;
        Movies
            .findByPk(movieId)
            .then(Movie => {
                return res.render(path.resolve(__dirname, '..', 'views', 'moviesDelete'), { Movie })
            })
            .catch(error => res.send(error))
    },
    destroy: function (req, res) {
        let movieId = req.params.id;
        Movies
            .destroy({ where: { id: movieId }, force: true }) // force: true es para asegurar que se ejecute la acción
            .then(() => {
                return res.redirect('/movies')
            })
            .catch(error => res.send(error))
    },
    // search: (req, res) => {
    //     Movies
    //         .findAll({
    //             where: {
    //                 title: { [Op.like]: '%' + req.query.keyword + '%' }
    //             }
    //         })
    //         .then(movies => {
    //             return res.status(200).json(movies);
    //         })
    // },


}

module.exports = moviesController;