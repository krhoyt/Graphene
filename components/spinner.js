export default class GRSpinner extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-flex;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        @keyframes spin {
          0% {
            stroke-dasharray: 1% 300%;
            transform: rotate( 0 );
          }

          50% {
            stroke-dasharray: 137% 137%;
            transform: rotate( 450deg );            
          }
          
          100% {
            stroke-dasharray: 1% 300%;            
            transform: rotate( 1080deg );
          }
        }        

        svg {
          height: 16px;
          width: 16px;
        }

        circle:first-of-type {
          cx: 8px;
          cy: 8px;                    
          fill: none;
          r: 6px;          
          stroke: #e0e0e0;
          stroke-width: 2px;
        }

        circle:last-of-type {
          animation: spin 2s linear infinite;
          cx: 8px;
          cy: 8px;
          fill: none;
          r: 6px;
          stroke: #0f62fe;
          stroke-dasharray: 150% 75%;          
          stroke-linecap: round;
          stroke-width: 2px;
          transform-origin: 50% 50% 0px;
        }

        :host( [size=big] ) svg {
          height: 32px;
          width: 32px;
        }
        :host( [size=big] ) circle {
          cx: 16px;
          cy: 16px;
          r: 14px;   
          stroke-width: 4px;       
        }

        :host( [size=large] ) svg {
          height: 48px;
          width: 48px;
        }
        :host( [size=large] ) circle {
          cx: 24px;
          cy: 24px;
          r: 20px;          
          stroke-width: 6px;                 
        }

        :host( [light] ) circle:first-of-type {
          stroke: transparent;
        }        
        :host( [light] ) circle:last-of-type {
          stroke: #ffffff;
        }        
      </style>
      <svg part="vector">
        <circle></circle>
        <circle></circle>
      </svg>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // When things change
  _render() {;}

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
    this._upgrade( 'hidden' );                    
    this._upgrade( 'light' );                    
    this._upgrade( 'size' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'light',
      'size'
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

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
    }
  }
}

window.customElements.define( 'gr-spinner', GRSpinner );
