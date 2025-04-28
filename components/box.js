export default class GRBox extends HTMLElement {
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

        div {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        p {
          box-sizing: border-box;          
          color: #525252;
          cursor: default;
          line-height: 16px;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        p[part=group] {
          padding: 0 0 6px 3px;
        }

        p[part=helper] {
          padding: 0 0 0 3px;
        }

        :host( [direction=row] ) div {
          flex-direction: row;
        }
        :host( [direction=row-reverse] ) div {
          flex-direction: row-reverse;
        }
        :host( [direction=column-reverse] ) div {
          flex-direction: column-reverse;
        }         

        :host( [center] ) div {
          align-items: center;
        }

        :host( [justify] ) div {
          justify-content: center;
        }

        :host( [fill] ),
        :host( [flex] ),
        :host( [grow] ),
        :host( [stretch] ) {
          flex-basis: 0;
          flex-grow: 1;
        }

        :host( [gap=xs] ) div { gap: 2px; }
        :host( [gap=sm] ) div { gap: 4px; }       
        :host( [gap=md] ) div { gap: 8px; }       
        :host( [gap=lg] ) div { gap: 16px; }        
        :host( [gap=xl] ) div { gap: 32px; }        

        :host( [width] ) {
          flex-grow: 0;
        }

        :host( :not( [helper] ) ) p[part=helper] {
          display: none;
        }

        :host( :not( [label] ) ) p[part=label] {
          display: none;
        }
      </style>
      <p part="group"><p>
      <div>
        <slot></slot>
      </div>
      <p part="helper"></p>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$group = this.shadowRoot.querySelector( 'p[part=group]' );
    this.$helper = this.shadowRoot.querySelector( 'p[part=helper]' );
  }

  // When attributes change
  _render() {
    this.$group.textContent = this.label === null ? '' : this.label;
    this.$helper.textContent = this.helper === null ? '' : this.helper;
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
    this._upgrade( 'direction' );      
    this._upgrade( 'fill' );                      
    this._upgrade( 'flex' );                      
    this._upgrade( 'gap' );            
    this._upgrade( 'grow' );                       
    this._upgrade( 'helper' );            
    this._upgrade( 'hidden' );    
    this._upgrade( 'justify' );        
    this._upgrade( 'label' );                
    this._upgrade( 'stretch' );                          
    this._upgrade( 'width' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'center',
      'concealed',
      'direction',
      'fill',      
      'flex',
      'gap',
      'grow',
      'helper',
      'hidden',
      'justify',
      'label',
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

  get direction() {
    if( this.hasAttribute( 'direction' ) ) {
      return this.getAttribute( 'direction' );
    }

    return null;
  }

  set direction( value ) {
    if( value !== null ) {
      this.setAttribute( 'direction', value );
    } else {
      this.removeAttribute( 'direction' );
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

window.customElements.define( 'gr-box', GRBox );
