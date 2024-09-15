class TablaDinamica extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `
         <link rel="stylesheet" href="tabladinamica.css">
          <div class="contenedor-tabla">
          <table>
              <thead>
                  <tr>${configuracionCampos
                    .map((campo) => `<th>${campo.placeholder}</th>`)
                    .join("")}</tr>
              </thead>
              <tbody>
              </tbody>
              <tfoot>
              <tr>
                  <td colspan="${configuracionCampos.length - 1}">Total</td>
                  <td id="totalPorcentaje">0%</td>
              </tr>
          </tfoot>
          </table>
          <div class="contenedor-control">
            <button id="borrarSeleccionadas">Borrar Filas Seleccionadas</button>
            <button id="borrarTodo">Borrar Todo</button>
          </div>
          </div>
                    <mensaje-error mensaje="" id="mensajeError2"></mensaje-error>
      `;
    this.shadowRoot
      .getElementById("borrarSeleccionadas")
      .addEventListener("click", () => this.borrarFilasSeleccionadas());
    this.shadowRoot
      .getElementById("borrarTodo")
      .addEventListener("click", () => this.borrarTodo());
    this.selectedRows = [];
  }

  calcularTotalPorcentaje() {
    this.totalPorcentaje = Array.from(
      this.shadowRoot.querySelectorAll("tbody tr")
    ).reduce(
      (sum, row) =>
        sum +
        parseFloat(
          row.cells[
            configuracionCampos.findIndex(
              (campo) => campo.nombre === "porcentaje"
            )
          ].textContent
        ),
      0
    );
    this.shadowRoot.getElementById("totalPorcentaje").textContent =
      this.totalPorcentaje.toFixed(2) + "%";
  }

  agregarFila(datosFila) {
    // Validación para la suma de porcentajes
    const sumaPorcentajesActual = Array.from(
      this.shadowRoot.querySelectorAll("tbody tr")
    ).reduce((acc, tr) => {
      const porcentaje = Number(
        tr.children[
          configuracionCampos.findIndex(
            (campo) => campo.nombre === "porcentaje"
          )
        ].textContent
      );
      return acc + porcentaje;
    }, 0);
    const porcentajeNuevo = Number(
      datosFila[
        configuracionCampos.findIndex((campo) => campo.nombre === "porcentaje")
      ]
    );
    if (sumaPorcentajesActual + porcentajeNuevo > 100) {
      this.mostrarMensajeError("La suma de porcentajes no puede exceder el 100%.");
      return;
    }

    const tbody = this.shadowRoot.querySelector("tbody");
    const tr = document.createElement("tr");
    datosFila.forEach((dato) => {
      const td = document.createElement("td");
      td.textContent = dato;
      tr.appendChild(td);
    });
    tr.addEventListener("click", () =>
      this.seleccionarFila(tr, !tr.classList.contains("selected"))
    );
    tbody.appendChild(tr);
    this.calcularTotalPorcentaje();
  }

  seleccionarFila(tr, isSelected) {
    if (isSelected) {
      tr.classList.add("selected");
      this.selectedRows.push(tr);
    } else {
      tr.classList.remove("selected");
      this.selectedRows = this.selectedRows.filter((row) => row !== tr);
    }
  }

  borrarFilasSeleccionadas() {
    this.selectedRows.forEach((row) => row.remove());
    this.selectedRows = [];
    this.calcularTotalPorcentaje();
  }

  borrarTodo() {
    this.shadowRoot.querySelector("tbody").innerHTML = "";
    this.selectedRows = [];
    this.calcularTotalPorcentaje();
  }

  mostrarMensajeError(mensaje) {
    const mensajeError = this.shadowRoot.getElementById('mensajeError2');
    mensajeError.setAttribute('mensaje', mensaje);

    // Ocultar el mensaje de error después de 3 segundos
    setTimeout(() => {
      mensajeError.setAttribute('mensaje', "");
    }, 3000);
  }
}
customElements.define("tabla-dinamica", TablaDinamica);
