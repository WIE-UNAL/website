const API_url = process.env.REACT_APP_BACKEND_URL;

export const getEventTitle = async (eventId) => {
    try {
        const response = await fetch(`${API_url}/event/${eventId}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            return data.title;
        } else {
            console.error('Error obteniendo título:', data.message);
            return eventId;
        }

    } catch (error) {
        console.error('Error obteniendo título:', error);
    }
};