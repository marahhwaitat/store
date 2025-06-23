import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './src/data_source';
import authRoutes from './src/routes/auth.routes';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/test', (req, res) => {
  res.status(200).send('OK');
});

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to MySQL with TypeORM');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to DB:', error.message);
  });
