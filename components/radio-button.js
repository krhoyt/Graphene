export default class GRRadioButton extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
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
          color: #161616;          
          cursor: pointer;
          display: flex;
          flex-direction: row;
          font-family: 'IBM Plex Sans', sans-serif;   
          font-size: 14px;
          font-weight: 400;                 
          gap: 4px;
          line-height: 18px;
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
          font-size: 24px;
          font-style: normal;
          font-variation-settings:
            'FILL' 0,
            'wght' 200;          
          font-weight: normal;
          height: 24px;
          letter-spacing: normal;
          line-height: 24px;
          margin: 0;
          max-height: 24px;         
          max-width: 24px;                    
          min-height: 24px;                               
          min-width: 24px;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: 24px;
          word-wrap: normal;                    
        }

        span {
          box-sizing: border-box;
          flex-basis: 0;
          flex-grow: 1;      
          line-height: 18px;    
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

        :host( [disabled] ) button,
        :host( [disabled] ) i,
        :host( [disabled] ) span {
          color: #16161640;
        }
      </style>
      <button part="button" type="button">
        <i part="icon">radio_button_unchecked</i>
        <span part="label"></span>
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
    this.$button.addEventListener( 'click', () => {
      if( !this.disabled )
        this.checked = !this.checked;

        this.dispatchEvent( new CustomEvent( 'gr-change', {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: {
            checked: this.checked,
            name: this.name,
            value: this.calculatedValue
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

    this.$icon.textContent = this.checked ? 'radio_button_checked' : 'radio_button_unchecked';
    this.$label.textContent = this.label === null ? '' : this.label;
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
    this._upgrade( 'calculatedValue' );            
    this._upgrade( 'checked' );            
    this._upgrade( 'concealed' );            
    this._upgrade( 'data' );             
    this._upgrade( 'disabled' );             
    this._upgrade( 'hidden' );    
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
  // Array, Date, Function, Object, null
  get calculatedValue() {
    let result = null;

    if( this.value === null ) {
      if( this.label === null ) {
        if( this.textContent.trim().length === 0 ) {
          result = null;
        } else {
          result = this.textContent;
        }
      } else {
        result = this.label;
      }
    } else {
      result = this.value;
    }

    return result;
  }

  set calculatedValue( value ) {
    // ?
  }

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
