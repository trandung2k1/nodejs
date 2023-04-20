const http = require('http');
const colors = require('colors');
const server = http.createServer();
const port = 4000;
server.on('request', async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        const data = {
            message: 'Welcome to the server',
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else if (req.method === 'GET' && req.url === '/api/todos') {
        const response = await fetch('http://localhost:3000/todos');
        const todos = await response.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos));
    } else if (req.method === 'POST' && req.url === '/api/todos') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            let todo = JSON.parse(JSON.stringify(body));
            const data = await (await fetch('http://localhost:3000/todos')).json();
            const id = data.length + 1;
            const json = JSON.parse(todo);
            const newData = {
                id,
                ...json,
                completed: json?.completed === true ? json?.completed : false,
            };
            const newDt = await (
                await fetch('http://localhost:3000/todos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newData),
                })
            ).json();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newDt));
        });
    } else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === 'GET') {
        const id = +req.url.split('/')[3];
        const response = await fetch(`http://localhost:3000/todos/${id}`);
        const todo = await response.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (!todo.id) {
            const data = {
                message: 'Todo not found',
            };
            return res.end(JSON.stringify(data));
        }
        res.end(JSON.stringify(todo));
    } else if (req.url.match(/\/api\/todos\/([0-9]+)/) && req.method === 'DELETE') {
        const id = +req.url.split('/')[3];
        const findTodo = await (await fetch(`http://localhost:3000/todos/${id}`)).json();
        if (!findTodo?.id) {
            const data = {
                message: 'Todo not found',
            };
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } else {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'DELETE',
            });
            await response.json();
            const data = {
                message: 'Deleted successfully',
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Route ${req.url} not found` }));
    }
});

server.listen(port, () => {
    console.log(colors.green(`Server listening on http://localhost:${port}`));
});
