export const formatearFecha = (fechaISO) => {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]; 
  
  const fecha = new Date(fechaISO); // Crear un objeto Date a partir de la cadena ISO
  const dia = fecha.getDate()+1; // Obtener el día
  const mes = meses[fecha.getMonth()]; // Obtener el mes en texto (0 = Enero)
  const año = fecha.getFullYear(); // Obtener el año
  
  return `${dia} de ${mes} de ${año}`; // Formatear la fecha
};