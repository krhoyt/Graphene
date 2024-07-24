export default class GRDropdownOption extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          max-height: 240px;
          min-height: 40px;
          position: relative;
        }

        :host( :hover ) {
          background-color: #e8e8e8;
        }

        p {
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          line-height: 40px;
          min-height: 40px;
          margin: 0 16px 0 16px;
          padding: 0;
          text-decoration: none;
          text-rendering: optimizeLegibility;
          width: 100%;                   
        }
      </style>
      <p part="label"></p>
    `;

    // Private
    this._option = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements 
    this.$label = this.shadowRoot.querySelector( 'p' );
  }

  // When attributes change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'label' );
    this._upgrade( 'option' );    
    this._upgrade( 'value' );    

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'label',
      'value'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get option() {
    return this._option;
  }

  set option( data ) {
    this._option = data === null ? null : Object.assign( {}, data );
  }  

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }  
}

window.customElements.define( 'gr-dropdown-option', GRDropdownOption );
