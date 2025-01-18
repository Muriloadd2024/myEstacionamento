// Global variables
let currentUser = null;
let tariff = 10; // Default tariff
let tickets = [];

// Utility to format date
function formatDate(date) {
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Login functionality
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validation for empty fields
    if (!username || !password) {
        alert('Username and Password are required');
        return;
    }

    // Mock authentication
    if (username === 'admin' && password === 'admin123') {
        currentUser = 'ADMIN';
        document.getElementById('admin-section').classList.remove('d-none');
    } else if (username === 'employee' && password === 'emp123') {
        currentUser = 'EMPLOYEE';
        document.getElementById('employee-section').classList.remove('d-none');
    } else {
        alert('Invalid credentials');
        return;
    }

    document.getElementById('login-section').classList.add('d-none');
});

// Update tariff functionality
document.getElementById('update-tariff').addEventListener('click', function () {
    const newTariff = parseFloat(document.getElementById('tariff').value);
    if (!isNaN(newTariff) && newTariff > 0) {
        tariff = newTariff;
        alert(`Tariff updated to ${tariff}`);
    } else {
        alert('Please enter a valid tariff');
    }
});

// Create ticket functionality
document.getElementById('create-ticket').addEventListener('click', function () {
    const plate = prompt('Enter vehicle plate:');
    if (!plate) {
        alert('Plate is required');
        return;
    }

    const ticket = {
        id: tickets.length + 1,
        plate,
        entry: new Date(),
        exit: null,
        price: null
    };

    tickets.push(ticket);
    renderTickets();

    alert('Ticket created successfully');
});

// Render tickets on the table
function renderTickets() {
    const tbody = document.getElementById('tickets');
    tbody.innerHTML = '';

    tickets.forEach(ticket => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.plate}</td>
            <td>${formatDate(ticket.entry)}</td>
            <td>${ticket.exit ? formatDate(ticket.exit) : '-'}</td>
            <td>${ticket.price !== null ? ticket.price.toFixed(2) : '-'}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="setExitTime(${ticket.id})">Exit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTicket(${ticket.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to set the exit time and calculate the price
function setExitTime(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket.exit) {
        ticket.exit = new Date();
        ticket.price = calculatePrice(ticket.entry, ticket.exit);
        renderTickets();
        alert(`Exit time recorded: ${formatDate(ticket.exit)}. Price: ${ticket.price.toFixed(2)}`);
    } else {
        alert('Exit time already recorded for this ticket.');
    }
}

// Function to calculate ticket price based on hours
function calculatePrice(entry, exit) {
    const hours = Math.ceil((exit - entry) / (1000 * 60 * 60));
    if (hours <= 1) {
        return tariff;
    } else if (hours <= 5) {
        return tariff + (hours - 1) * (tariff / 2);
    } else {
        return tariff + (hours - 1) * (tariff / 3);
    }
}

// Function to delete a ticket
function deleteTicket(ticketId) {
    tickets = tickets.filter(ticket => ticket.id !== ticketId);
    renderTickets();
}

// Função para gerar o relatório diário
function getDailyReport() {
    const today = new Date().toISOString().split('T')[0]; // Data de hoje (YYYY-MM-DD)
    const dailyTickets = tickets.filter(ticket => {
        const ticketDate = ticket.entry.toISOString().split('T')[0];
        return ticketDate === today;
    });
    return dailyTickets;
}

// Função para baixar arquivos
function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

// Exportar relatório em JSON
document.getElementById('export-json').addEventListener('click', () => {
    const dailyReport = getDailyReport();
    const jsonContent = JSON.stringify(dailyReport, null, 2); // Formata o JSON
    downloadFile(jsonContent, 'relatorio_diario.json', 'application/json');
});

// Exportar relatório em XML
document.getElementById('export-xml').addEventListener('click', () => {
    const dailyReport = getDailyReport();

    // Converte o relatório para XML
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<tickets>\n';
    dailyReport.forEach(ticket => {
        xmlContent += `
  <ticket>
    <id>${ticket.id}</id>
    <plate>${ticket.plate}</plate>
    <entry>${ticket.entry.toISOString()}</entry>
    <exit>${ticket.exit ? ticket.exit.toISOString() : 'null'}</exit>
    <price>${ticket.price !== null ? ticket.price.toFixed(2) : 'null'}</price>
  </ticket>`;
    });
    xmlContent += '\n</tickets>';

    downloadFile(xmlContent, 'relatorio_diario.xml', 'application/xml');
});

// Exibir se o usuário for ADMIN ou EMPLOYEE
function showReportsSection() {
    const reportsSection = document.getElementById('reports-section');
    if (currentUser === 'ADMIN' || currentUser === 'EMPLOYEE') {
        reportsSection.classList.remove('d-none');
    }
}

// Login functionality
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Mock authentication
    if (username === 'admin' && password === 'admin123') {
        currentUser = 'ADMIN';
        document.getElementById('admin-section').classList.remove('d-none');
    } else if (username === 'employee' && password === 'emp123') {
        currentUser = 'EMPLOYEE';
        document.getElementById('employee-section').classList.remove('d-none');
    } else {
        alert('Invalid credentials');
        return;
    }

    document.getElementById('login-section').classList.add('d-none');
    showReportsSection(); // Exibir relatórios após o login
});

// Atualizar tarifa
document.getElementById('update-tariff').addEventListener('click', function () {
    const newTariff = parseFloat(document.getElementById('tariff').value);
    if (!isNaN(newTariff) && newTariff > 0) {
        tariff = newTariff;
        localStorage.setItem('tariff', tariff);  // Salva no localStorage
        alert(`Tariff updated to ${tariff}`);
    } else {
        alert('Please enter a valid tariff');
    }
});

// Recuperar a tarifa armazenada no localStorage (se existir)
window.onload = function() {
    const savedTariff = localStorage.getItem('tariff');
    if (savedTariff) {
        tariff = parseFloat(savedTariff);  // Recupera e define a tarifa
        document.getElementById('tariff').value = tariff;  // Exibe a tarifa na tela de admin
    }
};
