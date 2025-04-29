export default class GRLink extends HTMLElement {
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
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: var( --link-cursor, pointer );
          display: flex;
          flex-direction: row;
          gap: var( --link-icon-gap, 4px );
          margin: 0;
          outline: none;
          padding: 0;
          -webkit-tap-highlight-color: transparent;                    
        }        

        button:hover p {
          text-decoration: underline;
        }

        p {
          box-sizing: border-box;
          color: var( --link-color, #0f62fe );
          cursor: var( --link-cursor, pointer );
          font-family: 'IBM Plex Sans', sans-serif;          
          font-size: var( --link-font-size, 14px );
          font-weight: var( --link-font-weight, 400 );
          line-height: var( --line-line-height, 20px );
          margin: 0;
          padding: 0;
          text-decoration: none;          
          text-rendering: optimizeLegibility;
        }
        
        :host( [inline] ) p {
          text-decoration: underline;          
        }

        :host( :not( [label] ) ) span {
          display: none;
        }

        :host( [disabled] ) p,
        :host( [disabled] ) button:hover p {
          color: #16161640;          
          cursor: not-allowed;          
        }

        :host( [disabled]:not( [inline] ) ) button:hover p {
          text-decoration: none;
        }
      </style>
      <button part="button" type="button">
        <p>
          <span part="label"></span>
          <slot></slot>
        </p>
        <slot name="icon"></slot>
      </button>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'focus', () => this.dispatchEvent( new CustomEvent( 'gr-focus' ) ) );
    this.$button.addEventListener( 'blur', () => this.dispatchEvent( new CustomEvent( 'gr-blur' ) ) );    
    this.$button.addEventListener( 'click', () => {
      if( this.href !== null ) {
        let reference = null;

        if( this.target !== null ) {
          reference = window.open( this.href, this.target );
        } else {
          reference = window.open( this.href );
        }

        if( this.href.indexOf( 'mailto' ) >= 0 ) {
          reference.close();
        }
      }
    } );        
    this.$label = this.shadowRoot.querySelector( 'span' );
  }

  blur() {
    this.$button.blur();
  }

  click() {
    this.$button.click();
  }

  focus() {
    this.$button.focus();
  }

  // When things change
  _render() {
    this.$button.disabled = this.disabled;
    this.$label.innerText = this.label === null ? '' : this.label;
  }

   // Properties set before module loaded
   _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }    
  }     

  // Setup
  connectedCallback() {
    // Check data property before render
    // May be assigned before module is loaded    
    this._upgrade( 'concealed' );
    this._upgrade( 'data' );
    this._upgrade( 'disabled' );    
    this._upgrade( 'hidden' );    
    this._upgrade( 'href' );    
    this._upgrade( 'inline' );    
    this._upgrade( 'label' );   
    this._upgrade( 'target' );         
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'href',
      'inline',
      'label',
      'target'
    ];
  }

  // Observed tag attribute has changed
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

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
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

  get href() {
    if( this.hasAttribute( 'href' ) ) {
      return this.getAttribute( 'href' );
    }

    return null;
  }

  set href( value ) {
    if( value !== null ) {
      this.setAttribute( 'href', value );
    } else {
      this.removeAttribute( 'href' );
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

  get target() {
    if( this.hasAttribute( 'target' ) ) {
      return this.getAttribute( 'target' );
    }

    return null;
  }

  set target( value ) {
    if( value !== null ) {
      this.setAttribute( 'target', value );
    } else {
      this.removeAttribute( 'target' );
    }
  }  
}

window.customElements.define( 'gr-link', GRLink );
