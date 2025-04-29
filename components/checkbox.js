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
          color: var( --checkbox-label-color, #161616 );          
          cursor: var( --checkbox-cursor, pointer );
          display: flex;
          flex-direction: row;
          font-family: 'IBM Plex Sans', sans-serif;       
          font-size: var( --checkbox-label-font-size, 14px );
          font-weight: var( --checkbox-label-font-weight, 400 );          
          gap: var( --checkbox-gap, 8px );
          line-height: var( --checkbox-label-line-height, 20px );
          margin: 0;
          outline: none;
          padding: 0;
          width: 100%;
        }

        div {
          align-items: center;
          display: flex;
          flex-direction: row;
          gap: 8px;
          padding: 4px 0 0 2px;
        }

        i {
          box-sizing: border-box;
          color: var( --checkbox-icon-color, #161616 );
          cursor: var( --checkbox-cursor, pointer );
          direction: ltr;
          display: inline-block;
          font-family: 'Material Symbols Outlined';
          font-size: var( --checkbox-size, 20px );
          font-style: normal;
          font-variation-settings:
            'FILL' 0,
            'opsz' 20,
            'wght' 200;          
          font-weight: normal;
          height: var( --checkbox-size, 20px );
          letter-spacing: normal;
          line-height: var( --checkbox-size, 20px );
          margin: 0;
          max-height: var( --checkbox-size, 20px );         
          max-width: var( --checkbox-size, 20px );                    
          min-height: var( --checkbox-size, 20px );                               
          min-width: var( --checkbox-size, 20px );
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: var( --checkbox-size, 20px );
          word-wrap: normal;                    
        }

        div i {
          cursor: var( --checkbox-helper-cursor, default );
          font-size: 16px;
          font-variation-settings:
            'FILL' 1,
            'opsz' 16,
            'wght' 400;                    
          height: 16px;
          line-height: 16px;
          max-height: 16px;
          max-width: 16px;
          min-height: 16px;
          min-width: 16px;
          width: 16px;
        }

        p {
          box-sizing: border-box;
          color: var( --checkbox-helper-color, #525252 );
          cursor: var( --checkbox-helper-cursor, default );
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: var( --checkbox-helper-font-size, 12px );
          line-height: var( --checkbox-helper-line-height, 16px );
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        span {
          box-sizing: border-box;
          flex-basis: 0;
          flex-grow: 1;          
          margin: 0;
          padding: 0;
          text-align: left;
          text-decoration: none;
          text-rendering: optimizeLegibility;
        }

        :host( [checked] ) i {
          font-variation-settings:
            'FILL' 1,
            'opsz' 20,
            'wght' 400;
        }

        :host( :not( [helper] ) ) p {
          display: none;
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

        :host( [read-only] ) button i {
          color: #a8a8a8;
        }

        :host( [error] ) div,
        :host( [warning] ) div {
          padding: 4px 0 0 2px;
          gap: 10px;
        }

        :host( [error] ) div i {
          color: #da1e28;
        }

        :host( [error] ) div p {
          color: #da1e28;          
        }

        :host( [error] ) button i {
          color: #da1e28;          
        }

        :host( [warning] ) div i {
          color: #f1c21b;
        }

        :host( :not( [warning] ):not( [error] ) ) div i {
          display: none;
        }

        :host( [disabled] ) button,
        :host( [disabled] ) i,
        :host( [disabled] ) span {
          cursor: not-allowed;
        }

        :host( [disabled] ) button i {
          color: #16161640;
        }
      </style>
      <button part="button" type="button">
        <i part="icon">check_box_outline_blank</i>
        <span part="label"></span>
        <slot></slot>
      </button>
      <div>
        <i></i>
        <p part="helper"></p>
      </div>
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
          detail: {
            checked: this.checked,
            name: this.name,
            value: this.value
          }
        } ) )
    } );
    this.$helper = this.shadowRoot.querySelector( 'p' );
    this.$icon = this.shadowRoot.querySelector( 'i' );
    this.$label = this.shadowRoot.querySelector( 'span' );
    this.$error = this.shadowRoot.querySelector( 'div i' );
  }

  // When attributes change
  _render() {
    if( this.readOnly ) {
      this.$button.disabled = true;
    } else {
      this.$button.disabled = this.disabled;
    }

    this.$icon.textContent = this.checked ? 'check_box' : 'check_box_outline_blank';
    this.$label.textContent = this.label === null ? '' : this.label;
    
    if( this.error !== null ) {
      this.$error.textContent = 'error';
      this.$helper.textContent = this.error === null ? '' : this.error;
    } else {
      if( this.warning !== null ) {
        this.$error.textContent = 'warning';
        this.$helper.textContent = this.warning === null ? '' : this.warning;
      } else {
        this.$helper.textContent = this.helper === null ? '' : this.helper;      
      }
    }
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
    this._upgrade( 'error' );             
    this._upgrade( 'helper' );        
    this._upgrade( 'hidden' );    
    this._upgrade( 'inline' );                   
    this._upgrade( 'label' );    
    this._upgrade( 'name' );        
    this._upgrade( 'readOnly' );            
    this._upgrade( 'value' );    
    this._upgrade( 'warning' );    
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
      'value',
      'warning'
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

  get warning() {
    if( this.hasAttribute( 'warning' ) ) {
      return this.getAttribute( 'warning' );
    }

    return null;
  }

  set warning( value ) {
    if( value !== null ) {
      this.setAttribute( 'warning', value );
    } else {
      this.removeAttribute( 'warning' );
    }
  }  
}

window.customElements.define( 'gr-checkbox', GRCheckbox );
