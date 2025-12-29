
// Clase Cita
class Cita {
    constructor({fecha, hora, nombre, apellidos, dni, telefono, nacimiento, observaciones}) {
        this.id = Date.now(); // identificador único
        this.fecha = fecha;
        this.hora = hora;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.dni = dni;
        this.telefono = telefono;
        this.nacimiento = nacimiento;
        this.observaciones = observaciones;
    }
}

//elementos del formulario
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const dni = document.getElementById("dni");
const telefono = document.getElementById("telefono");
const nacimiento = document.getElementById("nacimiento"); 
const observaciones = document.getElementById("observaciones");

//formulario y tabla de citas
const formulario = document.getElementById("formularioCita");
const citasCuerpo = document.getElementById("citasBody"); 

//variables para editar y eliminar 
let filaEditando = null;
let filaEliminando = null; 

//variable para saber si el formulario tiene errores
let error = false;

//array de citas
let citas = []; 

//carga de citas cuando la página termina de cargar
window.addEventListener("DOMContentLoaded", () => {
    citas = getCitasCookie();
    citasDavante();
});

//mensajes de error del formulario por campo
const errorFecha = document.getElementById("errorFecha");
const errorHora = document.getElementById("errorHora");
const errorNombre = document.getElementById("errorNombre");
const errorApellidos = document.getElementById("errorApellidos");
const errorDni = document.getElementById("errorDni");
const errorTelf = document.getElementById("errorTelf");
const errorNac = document.getElementById("errorNac");
const errorObserv = document.getElementById("errorObserv");

//botón para limpiar el formulario
document.getElementById("limpiar").addEventListener("click", limpiarFormulario);

//función para obtener las citas guardadas en cookies
function getCitasCookie() {
    const cookie = document.cookie.split(";").find(f => f.startsWith("citasDavante="));
    return cookie ? JSON.parse(decodeURIComponent(cookie.split("=")[1])) : [];
}

//función para guardar citas en la cookies
function guardarCitasCookie(citas) {
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 60); // se borran en 60 dias
    document.cookie = "citasDavante=" + encodeURIComponent(JSON.stringify(citas)) +
                      "; expires=" + fechaExpiracion.toUTCString() + "; path=/";
}

//función para limpiar el formulario
function limpiarFormulario() {
    formulario.reset();
    document.getElementById("citaId").value = "";
    //oculta todos los errores
    const errores = [errorFecha,errorHora,errorNombre,errorApellidos,errorDni,errorTelf,errorNac,errorObserv];
    errores.forEach(e => e.hidden = true);
}

//función para validar el formulario antes de guardar
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
    } else if (!isNaN(nombre.value)) { 
        error = true;
        errorNombre.hidden = false;
        errorNombre.textContent = "El nombre no puede ser solo números";
    } else {
        errorNombre.hidden = true;
    }

    if (apellidos.value === "") {
        error = true;
        errorApellidos.hidden = false;
    } else if (!isNaN(apellidos.value)) {  
        error = true;
        errorApellidos.hidden = false;
        errorApellidos.textContent = "Los apellidos no pueden ser solo números";
    } else {
        errorApellidos.hidden = true;
    }

    if (dni.value === "") {
        error = true;
        errorDni.hidden = false;
    } else if (dni.value.length < 8) {
        error = true;
        errorDni.hidden = false;
        errorDni.textContent = "El DNI no es válido";
    } else {
        errorDni.hidden = true;
    }

    if(telefono.value === "") { 
        error = true;
        errorTelf.hidden = false; 
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


//función para renderizar la tabla vacía
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

//función para eliminar la fila vacía si hay citas
function removeEmptyRow() {
    const fila = document.getElementById("filaVacia");
    if (fila) {
        fila.remove();
    }
}

//función para cargar las citas en la tabla
function citasDavante() {
    citasCuerpo.innerHTML = ""; 

    if(citas.length === 0) {
        renderEmptyRow();
        return;
    }
    
    removeEmptyRow();

    //crea una fila para cada cita
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

//función submit (guardar o editar cita)
formulario.addEventListener("submit", function (event) {
    //evita que el formulario recargue la pag
    event.preventDefault();
    
    console.log("Editando id:", document.getElementById("citaId").value);
    console.log("Fila editando:", filaEditando);
    
    validarFormulario();

    //si hay errores no continúa
    if(error) {
        return; 
    }

    let idEdicion = document.getElementById("citaId").value;

    //si estamos editando una cita existente
    if(idEdicion) {
        let citaEncontrada = citas.find(c => c.id == Number(idEdicion));
        
        //actualizamos los campos
        citaEncontrada.fecha = fecha.value;
        citaEncontrada.hora = hora.value;
        citaEncontrada.nombre = nombre.value;
        citaEncontrada.apellidos = apellidos.value;
        citaEncontrada.dni = dni.value;
        citaEncontrada.telefono = telefono.value;
        citaEncontrada.nacimiento = nacimiento.value;
        citaEncontrada.observaciones = observaciones.value; 

        //guardar cambios
        guardarCitasCookie(citas);

        //actualiza la tabla sin recargar
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
        //si la cita es nueva
        const cita = new Cita({
            fecha: fecha.value,
            hora: hora.value,
            nombre: nombre.value,
            apellidos: apellidos.value,
            dni: dni.value,
            telefono: telefono.value,
            nacimiento: nacimiento.value,
            observaciones: observaciones.value
});

        citas.push(cita);
        guardarCitasCookie(citas);
        removeEmptyRow();
        //refresca la tabla
        citasDavante();
    }
        
        limpiarFormulario(); 
}); 

    //eventos de editar y eliminar desde la tabla
    citasCuerpo.addEventListener("click", function (event) {
       
       let botonClick = event.target;
       let id = Number(botonClick.dataset.id);
       console.log(id);
       console.log(citas);

       let citaEncontrada = citas.find(c => c.id == id);
        
       //si pulsamos editar
       if (botonClick.classList.contains("editarBtn")) {
        const fila = botonClick.parentElement.parentElement;
        filaEditando = fila;
        
        //rellena el formulario con los datos existentes.
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

       //si pulsamos eliminar
       if(botonClick.classList.contains("eliminarBtn")) {
        const fila = botonClick.parentElement.parentElement;
        filaEliminando = fila;
        fila.remove();
        //ellimina del array
        citas = citas.filter(c => c.id != Number(id));
        guardarCitasCookie(citas);

        citasDavante();
        //si no hay citas, muestra la fila vacía
        if(citas.length === 0) {
            renderEmptyRow();
        }
       }

    }); 
    