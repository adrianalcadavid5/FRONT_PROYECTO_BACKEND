document.addEventListener("DOMContentLoaded", function () {
  const noOdontologosModal = new bootstrap.Modal(document.getElementById("noOdontologosModal"));


const apiURL = "http://localhost:8080";

// Obtener la referencia a la tabla y al modal
const tableBody = document.querySelector("#odontologoTable tbody");
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editForm = document.getElementById("editForm");
let currentOdontologoId;


// Función para obtener y mostrar los odontólogos
function fetchOdontologos() {
  // listar los odontologos
  fetch(`${apiURL}/odontologo/buscartodos`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Limpiar el contenido actual de la tabla
      tableBody.innerHTML = "";

      console.log(data);
      //si el array de odontologos está vacio
      if (data.length === 0) {
        noOdontologosModal.show();

        // Mostrar el modal de aviso 
        
      } else {

      // Insertar los datos en la tabla
      data.forEach((odontologo, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
              <td>${odontologo.id}</td>
               <td>${odontologo.numeroMatricula}</td>
              <td>${odontologo.nombre}</td>
              <td>${odontologo.apellido}</td>                     
              <td>
                <button class="btn btn-primary btn-sm" onclick="editOdontologo(${odontologo.id}, '${odontologo.numeroMatricula}','${odontologo.nombre}','${odontologo.apellido}')">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteOdontologo(${odontologo.id})">Eliminar</button>
              </td>
            `;

        tableBody.appendChild(row);
      });
    }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Función para abrir el modal y cargar los datos del odontologo
editOdontologo = function (
  id,
  numeroMatricula,
  nombre,
  apellido
) {
  currentOdontologoId = id;
  document.getElementById("editMatricula").value = numeroMatricula;
  document.getElementById("editNombre").value = nombre;
  document.getElementById("editApellido").value = apellido;
  editModal.show();
};

// Función para editar un odontologo
editForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const numeroMatricula = document.getElementById("editMatricula").value;
  const nombre = document.getElementById("editNombre").value;
  const apellido = document.getElementById("editApellido").value;

  // Mostrar los valores obtenidos en la consola para verificar
  console.log("Datos enviados:", {
      id: currentOdontologoId,
      numeroMatricula,
      nombre,
      apellido,
  });

  // Modificar un odontólogo
  fetch(`${apiURL}/odontologo/modificar`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          id: currentOdontologoId,
          numeroMatricula,
          nombre,
          apellido,
      }),
  })
  .then((response) => {
    console.log("Response status:", response.status); // Log del estado de la respuesta
    if (response.ok) {
        return response.json(); // Procesar la respuesta solo si fue exitosa
    } else {
        return response.text().then(text => { throw new Error(text) });
    }
})

  .then((data) => {
      console.log("Datos de respuesta:", data);
      alert("Odontólogo modificado con éxito");
      editModal.hide();   // Cerrar el modal inmediatamente
      fetchOdontologos(); // Recargar la lista de odontólogos después de cerrar el modal
  })
  .catch((error) => {
    console.error("Error editando odontólogo:", error.message);
    console.error("Error detalles:", error);
    alert(`Hubo un error al modificar el odontólogo: ${error.message}. Revisa la consola para más detalles.`);
});

});


// Función para eliminar un odontolog
deleteOdontologo = function (id) {
  if (confirm("¿Está seguro de que desea eliminar este odontologo?")) {
    // eliminar el odontolog
    fetch(`${apiURL}/odontologo/eliminar/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Odontologo eliminado con éxito");
        fetchOdontologos();
      })
      .catch((error) => {
        console.error("Error borrando odontologo:", error);
      });
  }
};

// Llamar a la función para obtener y mostrar los odontólogos
fetchOdontologos();
});
