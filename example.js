async function updateTodo(id, dataUpdate) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataUpdate),
    });
    return await res.json();
}
const id = 1;
const data = {
    userId: 1,
    title: 'Oke',
    completed: false,
};

//Using update todo
// updateTodo(id, data).then((data) => console.log(data));

async function completedTodo() {
    const todoUpdate = await updateTodo(id, data);
    console.log(todoUpdate);
}
completedTodo();
