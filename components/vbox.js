export default class GRVBox extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        :host( [flex] ) {
          flex-basis: 0;
          flex-grow: 1;
        }

        :host( [gap=xs] ) {
          gap: 2px;
        }

        :host( [gap=s] ) {
          gap: 4px;
        }       
        
        :host( [gap=m] ) {
          gap: 8px;
        }       
        
        :host( [gap=l] ) {
          gap: 16px;
        }        

        :host( [gap=xl] ) {
          gap: 32px;
        }

        :host( [width] ) {
          flex-grow: 0;
        }
      </style>
      <slot></slot>
    `;

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
    this._upgrade( 'concealed' ); 
    this._upgrade( 'flex' );                           
    this._upgrade( 'gap' );                   
    this._upgrade( 'hidden' );    
    this._upgrade( 'width' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'flex',      
      'gap',
      'hidden',
      'width'
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

  get flex() {
    return this.hasAttribute( 'flex' );
  }

  set flex( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'flex' );
      } else {
        this.setAttribute( 'flex', '' );
      }
    } else {
      this.removeAttribute( 'flex' );
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

window.customElements.define( 'gr-vbox', GRVBox );
