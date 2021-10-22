// IMC

function imc(peso, altura) {
    return peso / (altura * altura);
}

function imcCalculator(element) {

    let peso = element.querySelector('.info-peso').textContent;
    let altura = element.querySelector('.info-altura').textContent;
    let isValid = true;

    if (peso <=0 || peso >= 300) {
        isValid = false;
        element.querySelector('.info-imc').textContent = 'Peso inválido';

    }

    if (altura <= 0 || altura >= 3) {
        isValid = false;
        element.querySelector('.info-imc').textContent = 'Altura inválida';
    }

    if (isValid) {
        element.querySelector('.info-imc').textContent = imc(peso, altura).toFixed(2);
    } else {
        element.classList.add('valor-invalido');
    }
}

function imcCalculateForTable() {
    let pacientes = document.querySelectorAll(".paciente");

    pacientes.forEach(imcCalculator);
}

//Objeto

function pacienteFromJSON(obj) {
    let paciente = obj;

    paciente.propertyNames = Object.getOwnPropertyNames(paciente);

    return paciente;
}

function pacienteFromForm(form) {
    let paciente = {};

    paciente.nome = form.nome.value;
    paciente.peso = form.peso.value;
    paciente.altura = form.altura.value;
    paciente.gordura = form.gordura.value;

    paciente.imc = imc(paciente.peso, paciente.altura).toFixed(2);

    paciente.propertyNames = Object.getOwnPropertyNames(paciente);

    return paciente;
}

function verificaPaciente(paciente) {
    let erros = [];

    paciente.propertyNames.forEach(function (property) {
        if(paciente[property].length === 0) {
            erros.push(property.concat(' não pode ser em branco'));
        }
    });

    if ((paciente.peso <=0 || paciente.peso >= 300) && paciente.peso.length > 0) {
        erros.push('Valor inválido para o peso');
    }

    if ((paciente.altura <= 0 || paciente.altura >= 3) && paciente.altura.length > 0) {
        erros.push('Valor inválido para a altura');
    }

    return erros;
}

//Adicionar paciente na tabela

function addTableCell(name, obj) {
    let tableCell = document.createElement('td');
    tableCell.textContent = obj[name];
    tableCell.classList.add('info-'.concat(name));
    return tableCell;
}

function addTableRow(paciente) {
    let tableRow = document.createElement('tr');
    tableRow.classList.add('paciente');
    paciente.propertyNames.forEach(function(name){
        let tableCell = addTableCell(name, paciente);
        tableRow.appendChild(tableCell);
    });
    return tableRow;
}

function addItemToList(text) {
    let lista = document.querySelector('.mensagem-erro');
    let item = document.createElement('li');
    item.classList.add('valor-invalido');
    item.textContent = text;
    lista.appendChild(item);
}

function addPaciente(paciente) {

    let erros = verificaPaciente(paciente);

    document.querySelector('.mensagem-erro').innerHTML = '';

    if (erros.length === 0) {

        let tableRow = addTableRow(paciente);

        document.querySelector('#tabela-pacientes').appendChild(tableRow);

        return true;

    } else {

        erros.forEach(addItemToList);

        return false;

    }
}

// Buscar pacientes

function searchFilter(paciente) {
    let filtro = this.value;
    let nomePaciente = paciente.querySelector('.info-nome').textContent;
    let stringInclude = new RegExp(this.value, 'i'); // for case sensitive we can use a bult-in function: String.prototype.includes()

    if (!stringInclude.test(nomePaciente) && filtro.length > 0) {
        paciente.classList.add('hide');
    } else {
        paciente.classList.remove('hide')
    }
}

// Listeners

function addPacienteListener(event) {
    event.preventDefault();
    let form = document.querySelector('#form-adiciona');
    let paciente = pacienteFromForm(form);
    if(addPaciente(paciente)) form.reset();
}

function removerPacienteListener(event) {
    let linhaClicada = event.target.parentNode;
    linhaClicada.classList.add('fadeOut');
    setTimeout(function () {
        linhaClicada.remove();
    }, 500);
}

function searchFilterListener() {
    document.querySelectorAll('.paciente').forEach(searchFilter.bind(this));
}

function sendRequestListener() {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://api-pacientes.herokuapp.com/pacientes');
    xhttp.addEventListener('load', loadRequestListener);
    xhttp.send();
}

function loadRequestListener() {
    let requestResponse = this.responseText;
    let pacientes = [];

    if (this.status === 200) {
        JSON.parse(requestResponse).forEach(function (obj) {
            pacientes.push(pacienteFromJSON(obj));
        });

        pacientes.forEach(addPaciente);

        document.querySelector('.requisicao-http-erro').classList.add('hide')
    } else {
        document.querySelector('.requisicao-http-erro').classList.remove('hide')
    }
}

// Main

imcCalculateForTable();

document.querySelector('#adicionar-paciente').addEventListener('click', addPacienteListener);

document.querySelector('#tabela-pacientes').addEventListener('dblclick', removerPacienteListener);

document.querySelector('.pesquisar-input').addEventListener('input', searchFilterListener);

document.querySelector('.requisicao-http').addEventListener('click', sendRequestListener);

// Em teste

