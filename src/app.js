const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();


//ROUTES LINKS
const indexRouter = require('./routes/index');
const moviesRoutes = require('./routes/moviesRoutes');
const genresRoutes = require('./routes/genresRoutes');

//ROUTES START
app.use('/', indexRouter);
app.use(moviesRoutes);
app.use(genresRoutes);

//ROUTES APIs LINKS
const apiMoviesRouter = require('./routes/api/moviesApi')
const apiGenresRouter = require('./routes/api/genresApi')
const apiActorsRouter = require('./routes/api/actorsApi')

//ROUTES APIs START
app.use('/api/movies', apiMoviesRouter);
app.use('/api/actors', apiActorsRouter);
app.use('/api/genres', apiGenresRouter);

// view engine setup
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, '../public')));

//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
app.use(express.urlencoded({ extended: false }));

//Aquí estoy disponiendo la posibilidad para utilizar el seteo en los formularios para el usod e los metodos put ó delete
app.use(methodOverride('_method'));

//Activando el servidor desde express
app.listen('3000', () => console.log('Servidor corriendo en el puerto 3000'));



