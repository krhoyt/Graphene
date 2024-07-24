export default class GRCheckbox extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
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
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          gap: 4px;
          margin: 0;
          outline: none;
          padding: 0;
          width: 100%;
        }

        i {
          box-sizing: border-box;
          color: #161616;
          direction: ltr;
          display: inline-block;
          font-family: 'Material Symbols Outlined';
          font-size: 22px;
          font-style: normal;
          font-variation-settings:
            'FILL' 0,
            'wght' 200;          
          font-weight: normal;
          height: 22px;
          letter-spacing: normal;
          line-height: 22px;
          margin: 0;
          max-height: 22px;         
          max-width: 22px;                    
          min-height: 22px;                               
          min-width: 22px;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: 22px;
          word-wrap: normal;                    
        }

        span {
          box-sizing: border-box;
          color: #161616;
          flex-basis: 0;
          font-family: 'IBM Plex Sans', sans-serif;
          flex-grow: 1;          
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-align: left;
          text-decoration: none;
          text-rendering: optimizeLegibility;
        }

        :host( [checked] ) i {
          font-variation-settings:
            'FILL' 1,
            'wght' 400;
        }

        :host( [inline] ) button {
          height: 40px;
        }

        :host( :not( [label] ) ) span {
          display: none;
        }

        :host( [read-only] ) button {
          cursor: default;
        }

        :host( [read-only] ) i {
          color: #a8a8a8;
        }

        :host( [disabled] ) button {
          cursor: not-allowed;
        }

        :host( [disabled] ) span,
        :host( [disabled] ) i {
          color: #16161640;
        }
      </style>
      <button part="button" type="button">
        <i part="icon">check_box_outline_blank</i>
        <span part="label"></span>
      </button>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => {
      if( !this.disabled )
        this.checked = !this.checked;

        this.dispatchEvent( new CustomEvent( 'gr-change', {
          detail: {
            checked: this.checked,
            name: this.name,
            value: this.value
          }
        } ) )
    } );
    this.$icon = this.shadowRoot.querySelector( 'i' );
    this.$label = this.shadowRoot.querySelector( 'span' );
  }

  // When attributes change
  _render() {
    if( this.readOnly ) {
      this.$button.disabled = true;
    } else {
      this.$button.disabled = this.disabled;
    }

    this.$icon.innerText = this.checked ? 'check_box' : 'check_box_outline_blank';
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
    this._upgrade( 'checked' );            
    this._upgrade( 'concealed' );     
    this._upgrade( 'data' );                       
    this._upgrade( 'disabled' );             
    this._upgrade( 'hidden' );    
    this._upgrade( 'inline' );                   
    this._upgrade( 'label' );    
    this._upgrade( 'name' );        
    this._upgrade( 'readOnly' );            
    this._upgrade( 'value' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'checked',      
      'concealed',
      'disabled',
      'hidden',
      'inline',
      'label',
      'name',
      'read-only',
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

  get checked() {
    return this.hasAttribute( 'checked' );
  }

  set checked( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'checked' );
      } else {
        this.setAttribute( 'checked', '' );
      }
    } else {
      this.removeAttribute( 'checked' );
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

  get inline() {
    return this.hasAttribute( 'inline' );
  }

  set inline( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'inline' );
      } else {
        this.setAttribute( 'inline', '' );
      }
    } else {
      this.removeAttribute( 'inline' );
    }
  } 

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

  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( value ) {
    if( value !== null ) {
      this.setAttribute( 'name', value );
    } else {
      this.removeAttribute( 'name' );
    }
  }        

  get readOnly() {
    return this.hasAttribute( 'read-only' );
  }

  set readOnly( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'read-only' );
      } else {
        this.setAttribute( 'read-only', '' );
      }
    } else {
      this.removeAttribute( 'read-only' );
    }
  }  

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( content ) {
    if( content !== null ) {
      this.setAttribute( 'value', content );
    } else {
      this.removeAttribute( 'value' );
    }
  }        
}

window.customElements.define( 'gr-checkbox', GRCheckbox );
