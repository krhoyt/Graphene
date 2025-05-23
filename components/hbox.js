export default class GRHBox extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        :host( [center] ) {
          align-items: center;
        }

        :host( [justify] ) {
          justify-content: center;
        }

        :host( [gap=xs] ) { gap: 2px; }
        :host( [gap=sm] ) { gap: 4px; }       
        :host( [gap=md] ) { gap: 8px; }       
        :host( [gap=lg] ) { gap: 16px; }        
        :host( [gap=xl] ) { gap: 32px; }        

        :host( [fill] ),        
        :host( [flex] ),
        :host( [grow] ),
        :host( [stretch] ) {
          flex-basis: 0;
          flex-grow: 1;
        }

        :host( [width] ) {
          flex-grow: 0;
        }
      </style>
      <slot></slot>
    `;

    // Private
    this._data = null;    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // When attributes change
  _render() {
    this.style.minWidth = this.width === null ? '' : `${this.width}px`;
    this.style.width = this.width === null ? '' : `${this.width}px`;            
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
    this._upgrade( 'center' );  
    this._upgrade( 'concealed' );  
    this._upgrade( 'data' );                          
    this._upgrade( 'fill' );                          
    this._upgrade( 'flex' );                                          
    this._upgrade( 'gap' );        
    this._upgrade( 'grow' );                              
    this._upgrade( 'hidden' );    
    this._upgrade( 'justify' );  
    this._upgrade( 'stretch' );                          
    this._upgrade( 'width' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'center',
      'concealed',
      'fill',
      'flex',
      'gap', 
      'grow',     
      'hidden',
      'stretch',            
      'width'
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
  get center() {
    return this.hasAttribute( 'center' );
  }

  set center( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'center' );
      } else {
        this.setAttribute( 'center', '' );
      }
    } else {
      this.removeAttribute( 'center' );
    }
  }

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

  get fill() {
    return this.hasAttribute( 'fill' );
  }

  set fill( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'fill' );
      } else {
        this.setAttribute( 'fill', '' );
      }
    } else {
      this.removeAttribute( 'fill' );
    }
  }       

  get gap() {
    if( this.hasAttribute( 'gap' ) ) {
      return parseInt( this.getAttribute( 'gap' ) );
    }

    return null;
  }

  set gap( value ) {
    if( value !== null ) {
      this.setAttribute( 'gap', value );
    } else {
      this.removeAttribute( 'gap' );
    }
  }   

  get grow() {
    return this.hasAttribute( 'grow' );
  }

  set grow( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'grow' );
      } else {
        this.setAttribute( 'grow', '' );
      }
    } else {
      this.removeAttribute( 'grow' );
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

  get justify() {
    return this.hasAttribute( 'justify' );
  }

  set justify( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'justify' );
      } else {
        this.setAttribute( 'justify', '' );
      }
    } else {
      this.removeAttribute( 'justify' );
    }
  }  

  get stretch() {
    return this.hasAttribute( 'stretch' );
  }

  set stretch( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'stretch' );
      } else {
        this.setAttribute( 'stretch', '' );
      }
    } else {
      this.removeAttribute( 'stretch' );
    }
  }     

  get width() {
    if( this.hasAttribute( 'width' ) ) {
      return parseInt( this.getAttribute( 'width' ) );
    }

    return null;
  }

  set width( value ) {
    if( value !== null ) {
      this.setAttribute( 'width', value );
    } else {
      this.removeAttribute( 'width' );
    }
  }    
}

window.customElements.define( 'gr-hbox', GRHBox );
