export default class GRIcon extends HTMLElement {
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

        :host( [concealed] ) {
          visibility: hidden;
        }        

        :host( [hidden] ) {
          display: none;
        }        

        img {
          cursor: default;          
          display: inline-block;
          height: var( --icon-size, 20px );
          object-fit: contain;
          width: var( --icon-size, 20px ); 
        }

        i {
          box-sizing: border-box;
          color: var( --icon-color, #161616 );
          cursor: var( --icon-cursor, default );
          direction: ltr;
          display: flex;
          font-family: 'Material Symbols Outlined';
          font-size: var( --icon-size, 20px );
          font-style: normal;
          font-weight: normal;
          height: var( --icon-size, 20px );
          letter-spacing: normal;
          line-height: var( --icon-size, 20px );
          margin: 0;
          max-height: var( --icon-size, 20px );         
          max-width: var( --icon-size, 20px );                    
          min-height: var( --icon-size, 20px );                               
          min-width: var( --icon-size, 20px );
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: var( --icon-size, 20px );
          word-wrap: normal;                    
        }

        :host( [size=s] ) i {
          font-size: 16px;
          height: 16px;
          line-height: 16px;
          max-height: 16px;
          max-width: 16px;
          min-height: 16px;
          min-width: 16px;
          width: 16px;
        }

        :host( [size=l] ) i {
          font-size: 24px;
          height: 24px;
          line-height: 24px;
          max-height: 24px;
          max-width: 24px;
          min-height: 24px;
          min-width: 24px;
          width: 24px;
        }        

        :host( [size=xl] ) i {
          font-size: 32px;
          height: 32px;
          line-height: 32px;
          max-height: 32px;
          max-width: 32px;
          min-height: 32px;
          min-width: 32px;
          width: 32px;
        }
        
        :host( [size=2xl] ) i {
          font-size: 48px;
          height: 48px;
          line-height: 48px;
          max-height: 48px;
          max-width: 48px;
          min-height: 48px;
          min-width: 48px;
          width: 48px;
        }        

        :host( [disabled] ) i {
          color: var( --icon-color-disabled, #16161640 );
          cursor: var( --icon-cursor-disabled, not-allowed );
        }

        :host( :not( [name] ) ) i {
          display: none;
        }        

        :host( :not( [src] ) ) img {
          display: none;
        }                
      </style>
      <img part="image" />
      <i part="font"></i>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$image = this.shadowRoot.querySelector( 'img' );
    this.$image.addEventListener( 'load', () => this.dispatchEvent( new CustomEvent( 'gr-load' ) ) );
    this.$font = this.shadowRoot.querySelector( 'i' );    
  }

  // When things change
  _render() {
    this.$font.textContent = this.name === null ? '' : this.name;
    this.$image.src = this.src === null ? '' : this.src;

    if( this.name !== null ) {
      const variation = [];

      if( this.filled )
        variation.push( '\'FILL\' 1' );
  
      if( this.weight !== null ) {
        variation.push( `'wght' ${this.weight}` );
      }
  
      this.$font.style.fontVariationSettings = variation.toString();    
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
    this._upgrade( 'concealed' );                
    this._upgrade( 'data' );                    
    this._upgrade( 'disabled' );                    
    this._upgrade( 'filled' );                
    this._upgrade( 'hidden' );    
    this._upgrade( 'name' );        
    this._upgrade( 'size' );        
    this._upgrade( 'src' );    
    this._upgrade( 'weight' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'filled',
      'hidden',
      'name',
      'size',      
      'src',
      'weight'
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

  get filled() {
    return this.hasAttribute( 'filled' );
  }

  set filled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'filled' );
      } else {
        this.setAttribute( 'filled', '' );
      }
    } else {
      this.removeAttribute( 'filled' );
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
  
  get src() {
    if( this.hasAttribute( 'src' ) ) {
      return this.getAttribute( 'src' );
    }

    return null;
  }

  set src( value ) {
    if( value !== null ) {
      this.setAttribute( 'src', value );
    } else {
      this.removeAttribute( 'src' );
    }
  }  

  get weight() {
    if( this.hasAttribute( 'weight' ) ) {
      return parseInt( this.getAttribute( 'weight' ) );
    }

    return null;
  }

  set weight( value ) {
    if( value !== null ) {
      this.setAttribute( 'weight', value );
    } else {
      this.removeAttribute( 'weight' );
    }
  }  
}

window.customElements.define( 'gr-icon', GRIcon );
