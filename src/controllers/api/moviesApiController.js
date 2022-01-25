const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const fetch = require('node-fetch');

//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

module.exports = {

    // list: (req, res) => {
    //     db.Movie.findAll()
    //         .then(movies => {
    //             res.status(200).json({
    //                 meta: {
    //                     status: 200,
    //                     total: movies.length,
    //                     url: 'api/movies'
    //                 },
    //                 data: movies
    //             })
    //         })
    //         .catch(error => res.send(error)) //  QUE DEVUELVA ALGO Y NO QUEDE LA MAQUINA COMPUTANDO
    // },
    'list': async (req, res) => {
        let movie = await fetch('https://www.omdbapi.com/?apikey=5ceb580d&t=Doctor+Strange')
        .then(response => response.json());
        // return res.json({ movie });
        return res.render('moviesDetailOmdb', { movie })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include: ['genre']
            })
            .then(movie => {
                let respuesta = {
                    meta: {
                        status: 200,
                        total_time: movie.length,
                        url: '/api/movies/' + req.params.id
                    },
                    data: movie
                }
                res.json(respuesta);
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            include: ['genre'],
            where: {
                rating: { [db.Sequelize.Op.gte]: req.params.rating }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                let respuesta = {
                    meta: {
                        status: 200,
                        recommended_total: movies.length,
                        url: 'api/movies/recomended/' + req.params.rating
                    },
                    data: movies
                }
                res.json(respuesta);
            })
            .catch(error => console.log(error))
    },

    store: (req, res) => {
        // return res.json(req.body) //COMPROBAR
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
            .then(confirm => {
                let respuesta;
                if (confirm) {
                    respuesta = {
                        meta: {
                            status: 201,
                            total: confirm.length,
                            url: 'api/movies/store',
                            created: 'ok'
                        },
                        data: confirm
                    }
                } else {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: 'api/movies/create'
                        },
                        data: confirm
                    }
                }
                res.json(respuesta);
            })
            .catch(error => res.send(error))
    },
    update: (req, res) => {
        let movieId = req.params.id;
        Movies.update(
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
            .then(confirm => {
                let respuesta;
                if (confirm > 0) {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: 'api/movies/update/' + req.params.id,
                            update: 'ok',
                            id: req.params.id
                        },
                        data: req.body
                    }
                } else {
                    respuesta = {
                        meta: {
                            status: 204,
                            total: confirm.length,
                            url: 'api/movies/update/' + req.params.id,
                            update: 'nothing',
                            id: req.params.id
                        },
                        data: confirm
                    }
                }
                res.json(respuesta);
            })
            .catch(error => res.send(error))
    },
    destroy: (req, res) => {
        let movieId = req.params.id;
        Movies
            .destroy({ where: { id: movieId }, force: true }) // force: true es para asegurar que se ejecute la acción
            .then(confirm => {
                let respuesta;
                if (confirm > 0) {
                    respuesta = {
                        meta: {
                            status: 200,
                            total: confirm.length,
                            url: 'api/movies/destroy/' + req.params.id,
                            delete: 'ok'
                        },
                        data: confirm
                    }
                } else {
                    respuesta = {
                        meta: {
                            status: 204,
                            total: confirm.length,
                            url: 'api/movies/destroy/' + req.params.id,
                            delete: 'not'
                        },
                        data: confirm
                    }
                }
                res.json(respuesta);
            })
            .catch(error => res.send(error))
    }



}; //module.exports /