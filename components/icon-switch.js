export default class GRIconSwitch extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {          
          box-sizing: border-box;
          display: inline-block;
          height: 100%;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 100%;
          justify-content: center;
          margin: 0;
          max-width: 40px;
          min-width: 40px;
          padding: 0;
          width: 40px;
        }

        :host( [selected] ) button {
          background: #161616;
        }
        :host( [light][selected] ) button {
          background: #f4f4f4;          
        }

        :host( [size=sm] ) button {
          max-width: 32px;
          min-width: 32px;
          width: 32px;
        }
        :host( [size=lg] ) button {
          max-width: 48px;
          min-width: 48px;
          width: 48px;
        }        

        :host( [disabled][selected] ) button {
          background: #8d8d8d;
          cursor: not-allowed;
        }
        :host( [disabled]:not( [selected] ) ) button {
          background: transparent;
          cursor: not-allowed;
        }        
      </style>
      <button part="button" type="button">
        <slot></slot>
      </button>
    `;

    // Private
    this._data = null;    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
  }

  // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
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
    this._upgrade( 'concealed' );  
    this._upgrade( 'data' );     
    this._upgrade( 'disabled' );     
    this._upgrade( 'hidden' );   
    this._upgrade( 'light' );       
    this._upgrade( 'name' );       
    this._upgrade( 'selected' );   
    this._upgrade( 'size' );   
    this._upgrade( 'text' );       
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'light',
      'name',
      'selected',
      'size',
      'text'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Properties
  // Not reflected
  // Array, Date, Function, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }    

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }
  
  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
    }
  }  

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }

  get light() {
    return this.hasAttribute( 'light' );
  }

  set light( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'light' );
      } else {
        this.setAttribute( 'light', '' );
      }
    } else {
      this.removeAttribute( 'light' );
    }
  }

  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( content ) {
    if( content !== null ) {
      this.setAttribute( 'name', content );
    } else {
      this.removeAttribute( 'name' );
    }
  }         
  
  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
    }
  }  

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( content ) {
    if( content !== null ) {
      this.setAttribute( 'size', content );
    } else {
      this.removeAttribute( 'size' );
    }
  }       

  get text() {
    if( this.hasAttribute( 'text' ) ) {
      return this.getAttribute( 'text' );
    }

    return null;
  }

  set text( content ) {
    if( content !== null ) {
      this.setAttribute( 'text', content );
    } else {
      this.removeAttribute( 'text' );
    }
  }        
}

window.customElements.define( 'gr-icon-switch', GRIconSwitch );
