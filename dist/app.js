import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/index.js';
import { checkAllConnections } from './db/index.js';
import { errorHandler } from './middleware/error.js';
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
}));
app.get('/api/health', async (_req, res) => {
    try {
        const status = await checkAllConnections();
        res.json({ ok: true, status });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: err?.message || String(err) });
    }
});
app.use('/api', apiRouter);
app.use(errorHandler);
export default app;
