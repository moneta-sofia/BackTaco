import {express} from 'express';
import {db} from '../db/connection.js'


const app = express();
app.use(express.json());
const router = express.Router();




export default router;