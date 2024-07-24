import GRRadioGroup from "./radio-group.js";

export default class GRRadioButton extends HTMLElement {
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

        p,
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

        p {
          color: #6f6f6f;
          cursor: default;
          font-size: 12px;
          margin: 0 0 2px 2px;
        }

        :host( [checked] ) i {
          font-variation-settings:
            'FILL' 1,
            'wght' 400;
        }

        :host( :not( [error] ) ) p[part=error] {
          display: none;
        }

        :host( [helper] ) p[part=helper] {
          flex-grow: 0;
          margin: 0 0 4px 0;
        }

        :host( :not( [helper] ) ) p[part=helper] {
          display: none;
        }

        :host( [inline] ) button {
          height: 39px;
        }

        :host( [inline][helper] ) p[part=helper] {
          color: #6f6f6f;
        }

        :host( [inline]:not( [helper] ) ) p[part=helper] {
          display: inline-block;
          height: auto;
          flex-grow: 0;
          margin: 0 0 4px 0;
          padding: 0;
          visibility: hidden;
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
        :host( [disabled] ) p,
        :host( [disabled] ) i {
          color: #16161640;
        }

        :host( [disabled] ) p[part=helper] {
          color: #16161640 !important;
        }
      </style>
      <p part="helper"></p>      
      <button part="button" type="button">
        <i part="icon">radio_button_unchecked</i>
        <span part="label"></span>
      </button>
      <p part="error"></p>
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
    this.$error = this.shadowRoot.querySelector( 'p[part=error]' );
    this.$helper = this.shadowRoot.querySelector( 'p[part=helper]' );
    this.$icon = this.shadowRoot.querySelector( 'i' );
    this.$label = this.shadowRoot.querySelector( 'span' );
  }

  // When attributes change
  _render() {
    this.$helper.innerText = this.helper === null ? 'G' : this.helper;
    
    if( this.readOnly ) {
      this.$button.disabled = true;
    } else {
      this.$button.disabled = this.disabled;
    }

    this.$icon.innerText = this.checked ? 'radio_button_checked' : 'radio_button_unchecked';
    this.$label.innerText = this.label === null ? '' : this.label;
    this.$error.innerText = this.error === null ? '' : this.error;
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
    this._upgrade( 'disabled' );             
    this._upgrade( 'error' );                 
    this._upgrade( 'helper' );               
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
      'error',
      'helper',
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

  get error() {
    if( this.hasAttribute( 'error' ) ) {
      return this.getAttribute( 'error' );
    }

    return null;
  }

  set error( value ) {
    if( value !== null ) {
      this.setAttribute( 'error', value );
    } else {
      this.removeAttribute( 'error' );
    }
  }  

  get helper() {
    if( this.hasAttribute( 'helper' ) ) {
      return this.getAttribute( 'helper' );
    }

    return null;
  }

  set helper( value ) {
    if( value !== null ) {
      this.setAttribute( 'helper', value );
    } else {
      this.removeAttribute( 'helper' );
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

window.customElements.define( 'gr-radio-button', GRRadioButton );
