async function fetchPatientData() {
    const patientName = document.getElementById('patientName').value;
    if (!patientName) {
        alert('Por favor, ingrese el nombre del paciente.');
        return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay token de autenticación. Inicie sesión nuevamente.');
        return;
    }

    const url = `https://nax-iot-api.onrender.com/api/records/data?name=${encodeURIComponent(patientName)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener los datos del paciente.');
        }

        const data = await response.json();
        updateCharts(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al obtener los datos.');
    }
}

function updateCharts(data) {
    if (data.length > 10) {
        data = data.slice(-10); // Obtener los últimos 10 registros
    }

    const datasets = {
        bpm: [],
        spo2: [],
        systolic: [],
        diastolic: [],
        temperature: []
    };

    data.forEach((entry, index) => {
        datasets.bpm.push({ x: index, y: entry.bpm });
        datasets.spo2.push({ x: index, y: entry.spo2 });
        datasets.systolic.push({ x: index, y: entry.p_sys });
        datasets.diastolic.push({ x: index, y: entry.p_dia});
        datasets.temperature.push({ x: index, y: entry.temp });
    });

    updateChart('scatterChart1', datasets.bpm, 'bpm', 'rgba(255, 99, 132, 0.7)');
    updateChart('scatterChart2', datasets.spo2, 'SpO2 %', 'rgba(54, 162, 235, 0.7)');
    updateChart('scatterChart3', datasets.systolic, 'mmHg (Sistólica)', 'rgba(75, 192, 192, 0.7)');
    updateChart('scatterChart4', datasets.diastolic, 'mmHg (Diastólica)', 'rgba(255, 206, 86, 0.7)');
    updateChart('scatterChart5', datasets.temperature, '°C', 'rgba(153, 102, 255, 0.7)');
}

function updateChart(chartId, data, label, color) {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{ label, data, backgroundColor: color }]
        },
        options: {
            scales: {
                x: { type: 'linear', position: 'bottom', beginAtZero: true },
                y: { beginAtZero: false }
            }
        }
    });
}
