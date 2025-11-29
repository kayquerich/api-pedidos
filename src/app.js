import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {    
    res.send('Primeiro Teste!');
});

app.listen(port, () => {
    console.log(`servidor rodando na url http://localhost:${port}`);
});

export default app;