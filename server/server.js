import express from 'express';
import cors from 'cors';
import category from './routes/categoriesRoute.js';
import images from './routes/imagesRoute.js';
import roles from './routes/rolesRoute.js';
import user from './routes/authRoute.js';
import base from './routes/baseRoute.js';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5050;
const app = express();

// Allow CORS from your frontend domain
const allowedOrigins = ['https://tacoportfolio.netlify.app'];

app.use(cors({
	origin: allowedOrigins,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'], // Incluye Authorization si usas tokens
	credentials: true, // Si necesitas enviar cookies o tokens en las solicitudes
  }));

app.use(express.json());
app.use('/categories', category);
app.use('/images', images);
app.use('/roles', roles);
app.use('/user', user);
app.use('/', base);

// start the Express server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
