import axios from 'axios';

const API_URL = 'https://emil-mamanov-js20-todolist-default-rtdb.europe-west1.firebasedatabase.app/';

export const todosApi = {
    fetchTodos: async () => {
        const response = await axios.get<{ [key: string]: Todo }>(`${API_URL}/todos.json`);
        return response.data ? Object.values(response.data) : [];
    },

    createTodo: async (title: string) => {
        const response = await axios.post<{ name: string }>(`${API_URL}/todos.json`, { title, status: false });
        const id = response.data.name;
        return { id, title, status: false };
    },

    updateTodoStatus: async (id: string, status: boolean) => {
        await axios.patch(`${API_URL}/todos/${id}.json`, { status });
        return { id, status };
    },

    deleteTodo: async (id: string, status: boolean) => {
        if (status) {
            await axios.delete(`${API_URL}/completedTodos/${id}.json`);
        } else {
            await axios.delete(`${API_URL}/todos/${id}.json`);
        }
    },

    deleteTodoCompleted: async (id: string) => {
        await axios.delete(`${API_URL}/completedTodos/${id}.json`);
    },
};

export interface Todo {
    id: string;
    title: string;
    status: boolean;
}