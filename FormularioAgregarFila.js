class FormularioAgregarFila extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    connectedCallback() {
        this.querySelector('button').addEventListener('click', () => this.agregarFila());
    }

    render() {
        this.innerHTML = `
            ${configuracionCampos.map(campo => `<input type="${campo.tipo || 'text'}" id="${campo.nombre}" placeholder="${campo.placeholder}">`).join('')}
            <button>Agregar</button>
        `;
    }

    agregarFila() {
        const datosFila = [];
        let esValido = true;
        const targetTableId = this.getAttribute('targetTable');
        const targetTable = document.querySelector(`#${targetTableId}`);

        configuracionCampos.forEach(campo => {
            const input = this.querySelector(`#${campo.nombre}`);
            const valor = input.value;
            if (!campo.validacion(valor)) {
                alert(campo.mensajeError);
                esValido = false;
                return;
            }
            datosFila.push(valor);
        });

        if (esValido && targetTable) {
            targetTable.agregarFila(datosFila);
            configuracionCampos.forEach(campo => {
                this.querySelector(`#${campo.nombre}`).value = '';
            });
        } else if (!targetTable) {
            console.error(`No se encontró la tabla con id '${targetTableId}'`);
        }
    }
}
customElements.define('formulario-agregar-fila', FormularioAgregarFila);
