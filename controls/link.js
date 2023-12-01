import GraphiteLabelLabel from "./label.js";

export default class GraphiteLink extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        }
        
        :host( [hidden] ) {
          display: none;
        }        

        gr-label {
          --label-color: #0f62fe;
          --label-cursor: pointer;
          --label-font-size: var( --link-font-size, 14px );
        }        

        button {
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          margin: 0;
          outline: none;
          padding: 0;
          text-rendering: optimizeLegibility;
          -webkit-tap-highlight-color: transparent;                    
        }

        button:hover gr-label {
          --label-text-decoration: underline;
        }

        :host( [inline] ) button gr-label {
          --label-text-decoration: underline;          
        }

        :host( [disabled] ) button,
        :host( [disabled] ) button gr-label,
        :host( [disabled] ) button:hover gr-label {
          cursor: not-allowed;          
          --label-color: #c6c6c6;
          --label-cursor: not-allowed;
        }

        :host( [disabled]:not( [inline] ) ) button:hover gr-label {
          --label-text-decoration: none;
        }
      </style>
      <button part="button" type="button">
        <gr-label part="label" exportparts="label: p"></gr-label>
      </button>
    `;

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
    this.$label = this.shadowRoot.querySelector( 'gr-label' );
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
    this.$label.text = this.label;
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

window.customElements.define( 'gr-link', GraphiteLink );
