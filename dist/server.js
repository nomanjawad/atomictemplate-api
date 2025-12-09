import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { checkAllConnections } from './db/index.js';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
async function start() {
    console.log(`\n🚀 Server starting on port ${PORT}...`);
    console.log('━'.repeat(50));
    try {
        const status = await checkAllConnections();
        if (status.healthy) {
            console.log('✓ All services are healthy!');
        }
        else {
            console.log('⚠ Some services are not responding:');
        }
        console.log('\n📊 Connection Status:');
        console.log(JSON.stringify(status, null, 2));
        console.log('━'.repeat(50));
    }
    catch (err) {
        console.warn('⚠ Failed health check at startup:', err);
    }
    if (typeof process.send === 'function') {
        // child process under ts-node-dev --respawn: ensure graceful shutdown
        process.on('SIGTERM', () => process.exit(0));
    }
    app.listen(PORT, () => {
        console.log(`\n✓ Server is running on http://localhost:${PORT}`);
        console.log(`✓ Health check available at http://localhost:${PORT}/api/health\n`);
    });
}
start();
