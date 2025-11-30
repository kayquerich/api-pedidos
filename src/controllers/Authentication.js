import jwt from 'jsonwebtoken';

// GUARDAR EM VARIÁVEL DE AMBIENTE
const SECRET_KEY = '$2a$12$4/jPgZiXzmDPwgIAQKjcVun08P/HAcZEAEpuMdKBaQsNWssiX/kMS'

// Simulação de autenticação simples

const user = { id : 1, username: 'admin', password: 'password123' , email : 'admin@email.com'};

export function login(payload) {

    if (payload.email === user.email && payload.password === user.password) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        return { token };
    } else {
        throw new Error('login não autorizado, Credenciais inválidas.');
    }
}

export function IsAuthenticated(req, res, next) { // middleware de autenticação

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });

}