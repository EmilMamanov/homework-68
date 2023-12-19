import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { todosApi, Todo } from './todosApi';

interface TodosState {
    todos: Todo[];
    completed: Todo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed' | boolean ;
    error: string | null;
}

const initialState: TodosState = {
    todos: [],
    completed: [],
    status: 'idle',
    error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    return todosApi.fetchTodos();
});

export const createTodo = createAsyncThunk('todos/createTodo', async (title: string) => {
    return todosApi.createTodo(title);
});

export const updateTodoStatus = createAsyncThunk(
    'todos/updateTodoStatus',
    async ({ id, status }: { id: string; status: boolean }) => {
        await todosApi.updateTodoStatus(id, status);
        return { id, status };
    }
);

export const deleteTodo = createAsyncThunk(
    'todos/deleteTodo',
    async ({ id, status }: { id: string; status: boolean }) => {
        await todosApi.deleteTodo(id, status);
        return id;
    }
);

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.todos = action.payload;

                state.completed = action.payload.filter((todo) => todo.status);
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(createTodo.fulfilled, (state, action) => {
                const newTodo = action.payload;
                state.todos.push(newTodo);

                if (newTodo.status) {
                    state.completed.push(newTodo);
                }
            })
            .addCase(updateTodoStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;

                state.todos = state.todos.map((todo) =>
                    todo.id === id ? { ...todo, status } : todo
                );

                state.completed = state.todos.filter((todo) => todo.status);
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                const deletedId = action.payload;
                console.log('Deleted todo id:', deletedId);

                state.todos = state.todos.filter((todo) => todo.id !== deletedId);
                state.completed = state.completed.filter((todo) => todo.id !== deletedId);

                state.completed = state.todos.filter((todo) => todo.status);
            })
    },
});

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectCompleted = (state: RootState) => state.todos.completed;
export const selectStatus = (state: RootState) => state.todos.status;
export const selectError = (state: RootState) => state.todos.error;

export default todosSlice.reducer;
