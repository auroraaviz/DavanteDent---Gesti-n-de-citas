
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const dni = document.getElementById("dni");
const telefono = document.getElementById("telefono");
const nacimiento = document.getElementById("nacimiento"); 
const observaciones = document.getElementById("observaciones");

const formulario = document.getElementById("formularioCita");
const citasCuerpo = document.getElementById("citasBody"); 

let filaEditando = null;
let filaEliminando = null; 
let error = false;

let citas = [];

const errorFecha = document.getElementById("errorFecha");
const errorHora = document.getElementById("errorHora");
const errorNombre = document.getElementById("errorNombre");
const errorApellidos = document.getElementById("errorApellidos");
const errorDni = document.getElementById("errorDni");
const errorTelf = document.getElementById("errorTelf");
const errorNac = document.getElementById("errorNac");
const errorObserv = document.getElementById("errorObserv");

document.getElementById("limpiar").addEventListener("click", limpiarFormulario);


function getCitasCookie() {
    const cookie = document.cookie.split(";").find(f => f.startsWith("citasDavante="));
    return cookie ? JSON.parse(decodeURIComponent(cookie.split("=")[1])) : [];
}

function guardarCitasCookie(citas) {
    document.cookie = "citasDavante=" + encodeURIComponent(JSON.stringify(citas)) + "; path=/";
}

function limpiarFormulario() {
    formulario.reset();
    document.getElementById("citaId").value = "";
    const errores = [errorFecha,errorHora,errorNombre,errorApellidos,errorDni,errorTelf,errorNac,errorObserv];
    errores.forEach(e => e.hidden = true);
}


function validarFormulario() {
    error = false; 

    if(fecha.value === "") {
        error = true;
        errorFecha.hidden = false;
    } else {
        errorFecha.hidden = true;
    }

    if(hora.value === "") {
        error = true
        errorHora.hidden = false;
    } else {
        errorHora.hidden = true;
    }

    if (nombre.value === "") {
        error = true; 
        errorNombre.hidden = false;
    } else {
        errorNombre.hidden = true;
    }

    if (apellidos.value === "") {
        error = true;
        errorApellidos.hidden = false;
    } else {
        errorApellidos.hidden = true;
    }

    if(dni.value === "") {
        error = true;
        errorDni.hidden = false;
    } else {
        errorDni.hidden = true;
    }

    if(telefono.value === "") { 
        error = true;
        errorTelf.hidden = false; 
        errorTelf.textContent = "El teléfono es obligatorio";
    } else if (isNaN(telefono.value)) {
        error = true;
        errorTelf.hidden = false;
        errorTelf.textContent = "Sólo se pueden escribir números";
    } else {
        errorTelf.hidden = true;
    }

    if(nacimiento.value === "") {
        error = true;
        errorNac.hidden = false;
    } else {
        errorNac.hidden = true;
    }

    if(observaciones.value === "") {
        error = true;
        errorObserv.hidden = false;
    } else {
        errorObserv.hidden = true;
    }
};

renderEmptyRow();
removeEmptyRow();

function renderEmptyRow() { 

    if (document.getElementById("filaVacia")) {
        return;
    }

    const tr = document.createElement("tr");
    tr.id = "filaVacia";

    const td = document.createElement("td");
    td.colSpan = 10;
    td.textContent = "Dato vacío";

    tr.appendChild(td);
    citasCuerpo.appendChild(tr);
}
    
function removeEmptyRow() {
    const fila = document.getElementById("filaVacia");
    if (fila) {
        fila.remove();
    }
}


function citasDavante() {
    citasCuerpo.innerHTML = ""; 
    citas = getCitasCookie();

    if(citas.length === 0) {
        renderEmptyRow();
        return;
    }
    
    removeEmptyRow();

    citas.forEach((cita, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${cita.fecha}</td>
        <td>${cita.hora}</td>
        <td>${cita.nombre}</td>
        <td>${cita.apellidos}</td>
        <td>${cita.dni}</td>
        <td>${cita.telefono}</td>
        <td>${cita.nacimiento}</td>
        <td>${cita.observaciones}</td>
        <td>
            <button class ="editarBtn" data-id=${cita.id}>Editar</button>
            <button class ="eliminarBtn" data-id=${cita.id}>Eliminar</button>
            </td>
        `;
        citasCuerpo.appendChild(fila);
    }); 

}

formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Formulario no enviado");
    validarFormulario();

    if(error) {
        return; 
    }

    let idEdicion = document.getElementById("citaId").value;
    citas = getCitasCookie();

    if(idEdicion) {
        let citaEncontrada = citas.find(c => c.id == idEdicion);

        citaEncontrada.fecha = fecha.value;
        citaEncontrada.hora = hora.value;
        citaEncontrada.nombre = nombre.value;
        citaEncontrada.apellidos = apellidos.value;
        citaEncontrada.dni = dni.value;
        citaEncontrada.telefono = telefono.value;
        citaEncontrada.nacimiento = nacimiento.value;
        citaEncontrada.observaciones = observaciones.value; 

        guardarCitasCookie(citas);

        filaEditando.children[1].textContent = fecha.value;
        filaEditando.children[2].textContent = hora.value;
        filaEditando.children[3].textContent = nombre.value;
        filaEditando.children[4].textContent = apellidos.value;
        filaEditando.children[5].textContent = dni.value;
        filaEditando.children[6].textContent = telefono.value;
        filaEditando.children[7].textContent = nacimiento.value;
        filaEditando.children[8].textContent = observaciones.value;

        filaEditando = null;
        document.getElementById("citaId").value = "";

    } else {

        const cita = {
            id: Date.now(),
            fecha: fecha.value,
            hora: hora.value,
            nombre: nombre.value,
            apellidos: apellidos.value,
            dni: dni.value,
            telefono: telefono.value,
            nacimiento: nacimiento.value,
            observaciones: observaciones.value,
        };

        citas.push(cita);
        guardarCitasCookie(citas);
    }
        removeEmptyRow();

        let citasGuardadas = getCitasCookie();
        console.log(citasGuardadas);
        
        citasDavante();
        limpiarFormulario(); 
}); 

    citasCuerpo.addEventListener("click", function (event) {
       
       let botonClick = event.target;
       let id = botonClick.dataset.id;
       console.log(id);
       citas = getCitasCookie();
       console.log(citas);

       let citaEncontrada = citas.find(c => c.id == id);

       if (botonClick.classList.contains("editarBtn")) {
        const fila = botonClick.parentElement.parentElement;
        filaEditando = fila;
        
        fecha.value = citaEncontrada.fecha;
        hora.value = citaEncontrada.hora;
        nombre.value = citaEncontrada.nombre;
        apellidos.value = citaEncontrada.apellidos;
        dni.value = citaEncontrada.dni;
        telefono.value = citaEncontrada.telefono;
        nacimiento.value = citaEncontrada.nacimiento;
        observaciones.value = citaEncontrada.observaciones;

        document.getElementById("citaId").value = id;
       }

       if(botonClick.classList.contains("eliminarBtn")) {
        const fila = botonClick.parentElement.parentElement;
        filaEliminando = fila;
        fila.remove();
        citas = getCitasCookie();
        citas = citas.filter(c => c.id != id);
        guardarCitasCookie(citas);

        citasDavante();
        
        if(citas.length === 0) {
            renderEmptyRow();
        }
       }

    }); 

    window.addEventListener("DOMContentLoaded", citasDavante);