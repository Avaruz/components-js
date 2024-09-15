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
            <mensaje-error mensaje="" id="mensajeError1"></mensaje-error>
        `;
    }

    agregarFila() {
        const datosFila = [];
        let esValido = true;
        const targetTableId = this.getAttribute('targetTable');
        const targetTable = document.querySelector(`#${targetTableId}`);

        configuracionCampos.forEach(campo => {
            const valor = this.querySelector(`#${campo.nombre}`).value;
            if (!campo.validacion(valor)) {
                this.mostrarMensajeError(campo.mensajeError);
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

    mostrarMensajeError(mensaje) {
        const mensajeError = this.querySelector('#mensajeError1');
        mensajeError.setAttribute('mensaje', mensaje);

        // Ocultar el mensaje de error después de 3 segundos
        setTimeout(() => {
            mensajeError.setAttribute('mensaje', '');
        }, 3000);
    }
}


customElements.define('formulario-agregar-fila', FormularioAgregarFila);