export default class GRLabel extends HTMLElement {
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

        p {
          box-sizing: border-box;
          color: var( --label-color, #161616 );
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;  
          font-size: var( --label-font-size, 14px );
          font-weight: var( --label-font-weight, 400 );                  
          line-height: var( --label-line-height, 20px );
          margin: 0;
          padding: 0;
          text-align: var( --label-text-align, left );
          text-decoration: var( --label-text-decoration, none );
          text-rendering: optimizeLegibility;
          width: 100%;
        }

        :host( [size=xs] ) p {
          font-size: 12px;
          line-height: 16px;
        }
        :host( [size=md] ) p {
          font-size: 16px;
          line-height: 22px;
        }        
        :host( [size=lg] ) p {
          font-size: 18px;
          line-height: 24px;
        }                
        :host( [size=xl] ) p {
          font-size: 20px;
          line-height: 28px;
        }                        
        :host( [size=xxl] ) p {
          font-size: 24px;
          line-height: 30px;
        }                        
        :host( [size=h3] ) p {
          font-size: 28px;
          line-height: 40px;
        }                                                        
        :host( [size=h2] ) p {
          font-size: 32px;
          line-height: 48px;
        }                                                
        :host( [size=h1] ) p {
          font-size: 42px;
          line-height: 64px;
        }                                

        :host( [truncate] ) p {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        :host( [disabled] ) p {
          color: var( --label-disabled-color, #16161640 );
        }          
        
        :host( :not( [text] ) ) span {
          display: none;
        }
      </style>
      <p part="text">
        <span></span>
        <slot></slot>
      </p>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'span' );
  }

  // When attributes change
  _render() {
    this.$label.textContent = this.text === null ? '' : this.text;
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
    this._upgrade( 'hidden' );    
    this._upgrade( 'size' );    
    this._upgrade( 'text' );    
    this._upgrade( 'truncate' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'size',
      'text',
      'truncate'
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

  get text() {
    if( this.hasAttribute( 'text' ) ) {
      return this.getAttribute( 'text' );
    }

    return null;
  }

  set text( value ) {
    if( value !== null ) {
      this.setAttribute( 'text', value );
    } else {
      this.removeAttribute( 'text' );
    }
  } 

  get truncate() {
    return this.hasAttribute( 'truncate' );
  }

  set truncate( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'truncate' );
      } else {
        this.setAttribute( 'truncate', '' );
      }
    } else {
      this.removeAttribute( 'truncate' );
    }
  }  
}

window.customElements.define( 'gr-label', GRLabel );
