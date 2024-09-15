class MensajeError extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  static get observedAttributes() {
    return ["mensaje"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    this.innerHTML = `
            <div class="mensaje-error">
                <p>${this.getAttribute("mensaje")}</p>
            </div>
        `;
  }
}

customElements.define("mensaje-error", MensajeError);
