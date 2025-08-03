// Exportar datos a JSON
window.exportToJson = (data) => {
  const json = JSON.stringify(data, null, 2); // Convertir datos a JSON con indentación
  const blob = new Blob([json], { type: 'application/json' }); // Crear un Blob de tipo JSON
  return URL.createObjectURL(blob); // Crear una URL para el Blob
};
 
// Exportar datos a XML
window.exportToXml = (data) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<records>\n';
  data.forEach((item) => {
    xml += '  <record>\n';
    Object.keys(item).forEach((key) => {
      xml += `    <${key}>${item[key]}</${key}>\n`; // Crear nodos XML para cada propiedad
    });
    xml += '  </record>\n';
  });
  xml += '</records>';
  const blob = new Blob([xml], { type: 'application/xml' }); // Crear un Blob de tipo XML
  return URL.createObjectURL(blob); // Crear una URL para el Blob
};
  
// Exportar datos a CSV
window.exportToCsv = (data) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',') + '\n'; // Obtener los encabezados
  const rows = data.map((row) =>
    Object.values(row)
    .map((value) => `"${value}"`) // Escapar valores con comillas
    .join(',')
  ).join('\n');
    
  const csv = headers + rows;
  const blob = new Blob([csv], { type: 'text/csv' }); // Crear un Blob de tipo CSV
  return URL.createObjectURL(blob); // Crear una URL para el Blob
};
  