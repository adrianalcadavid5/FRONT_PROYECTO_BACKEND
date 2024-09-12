const apiURL = "http://localhost:8080";

// Obtener la referencia a la tabla y al modal
const tableBody = document.querySelector("#turnoTable tbody");
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editForm = document.getElementById("editForm");
let currentTurnoId;

// Función para obtener y mostrar los turnos
function fetchTurnos() {
  fetch(`${apiURL}/turnos/buscartodos`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Limpiar el contenido actual de la tabla
      tableBody.innerHTML = "";

      // Insertar los datos en la tabla
      data.forEach((turno, index) => {
        const row = document.createElement("tr");

        // Verificar que turno tenga los objetos de paciente y odontólogo antes de acceder a sus propiedades
        const paciente = turno.pacienteResponseDto || {}; // Usar un objeto vacío si es undefined
        const odontologo = turno.odontologoResponseDto || {}; // Usar un objeto vacío si es undefined

        row.innerHTML = `
          <td>${turno.id || 'N/A'}</td>
          <td>${paciente.nombre || 'N/A'}</td>
          <td>${paciente.apellido || 'N/A'}</td>
          <td>${paciente.dni || 'N/A'}</td>
          <td>${odontologo.nombre || 'N/A'}</td>
          <td>${odontologo.apellido || 'N/A'}</td>
          <td>${odontologo.matricula || 'N/A'}</td>
          <td>${turno.fecha || 'N/A'}</td>
          <td>
 
            <button class="btn btn-danger btn-sm" onclick="deleteTurno(${turno.id})">Eliminar</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error obteniendo los datos del turno:", error);
    });
}


// Función para abrir el modal y cargar los datos del turno a editar
function editTurno(id) {
  // Llamada al backend para obtener los datos del turno por ID
  fetch(`${apiURL}/turnos/${id}`)
  .then((response) => {
    console.log(response);  // Verifica la respuesta antes de intentar parsear como JSON
    return response.json();
  })
  .then((data) => {
    const turno = data;
    // Resto de tu código...
  })
  .catch((error) => {
    console.error("Error obteniendo los datos del turno:", error);
  });

}




// Función para editar un turno
editForm.addEventListener("submit", function (event) {
  event.preventDefault();
  
  const pacienteNombre = document.getElementById("editPacienteNombre").value;
  const pacienteApellido = document.getElementById("editPacienteApellido").value;
  const pacienteDni = document.getElementById("editPacienteDni").value;
  const odontologoNombre = document.getElementById("editOdontologoNombre").value;
  const odontologoApellido = document.getElementById("editOdontologoApellido").value;
  const odontologoMatricula = document.getElementById("editOdontologoMatricula").value;
  const fecha = document.getElementById("editFecha").value;
  const formattedDate = new Date(fecha).toISOString().split('T')[0]; // Esto garantiza que la fecha esté en formato 'yyyy-MM-dd'

  // Verificar que currentTurnoId esté asignado
  if (!currentTurnoId) {
    console.error("No se ha seleccionado un turno para modificar.");
    return;
  }

  // se añade el console.log para ver qué datos se están enviando
  console.log({
    id: currentTurnoId,
    paciente_id: pacienteId,
    odontologo_id: odontologoId,
    fecha: fecha
  });

  // Enviar la solicitud de modificación
  fetch(`${apiURL}/turnos/modificar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: currentTurnoId,
      paciente_id: document.getElementById("editPacienteId").value, // Asegúrate de tener este input en el formulario
      odontologo_id: document.getElementById("editOdontologoId").value, // Asegúrate de tener este input en el formulario
      fecha: document.getElementById("editFecha").value, // Verifica que el formato de fecha sea correcto
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert("Turno modificado con éxito");
      fetchTurnos();
      editModal.hide();
    })
    .catch((error) => {
      console.error("Error editando turno:", error);
    });
  })
  


// Función para eliminar un turno
function deleteTurno(id) {
  if (confirm("¿Está seguro de que desea eliminar este turno?")) {
    // eliminar el turno
    fetch(`${apiURL}/turnos/eliminar/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Turno eliminado con éxito");
        fetchTurnos();
      })
      .catch((error) => {
        console.error("Error borrando turno:", error);
      });
  }
}


// Llamada inicial para cargar los turnos al cargar la página
fetchTurnos();
