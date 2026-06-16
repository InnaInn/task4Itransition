const API_URL = 'http://localhost:5000/api';

export const checkServerConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('Сервер работает:', data);
    return data;
  } catch (error) {
    console.error('Сервер не отвечает:', error);
    throw error;
  }
};

export const getUsers = async (email, sortField, sortOrder) => {
  try {
    const url = new URL(`${API_URL}/users`);
    if (email) {
        url.searchParams.set('filter[email][ilike]', email);
    }
    url.searchParams.set(`sort[${sortField}]`, sortOrder);
    url.searchParams.set('page[number]', '1');
    url.searchParams.set('page[size]', '100');
    const response = await fetch(url);
    const data = await response.json();
    console.log('Пользователи из БД:', data);
    return data.data || []; 
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    throw error;
  }
};

