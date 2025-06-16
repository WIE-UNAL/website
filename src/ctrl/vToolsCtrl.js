export const vToolsAPI = async (Id) => {
  const url = `https://events.vtools.ieee.org/RST/events/api/public/v6/events/list?id=${Id}`;
  try {
    const response = await fetch(url, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json", 
            "Accept": "application/json", 
        },
    });
    
    if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data)

    return data;
    
    } catch (error) {
        console.error("Error al obtener el evento:", error);
        throw error;
    }
};

export default vToolsAPI;