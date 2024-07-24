export default class GRAvatar extends HTMLElement {
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
          background-color: #f4f4f4;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          border: none;
          border: solid 1px #8d8d8d;
          border-radius: 60px;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 60px;
          justify-content: center;
          outline: solid 2px transparent;
          outline-offset: -2px;          
          transition: background-color 150ms ease-in-out;          
          width: 60px;
          -webkit-tap-highlight-color: transparent;
        }

        button:hover {
          background-color: #e8e8e8;
        }

        button:focus {
          outline: solid 2px #0f62fe;                    
        }

        button:disabled {
          cursor: not-allowed;
        }

        button:disabled:hover {
          background-color: #f4f4f4;
        }

        canvas {
          display: none;
        }

        input {
          display: none;
          -webkit-tap-highlight-color: transparent;
        }

        span {
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 20px;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-align: center;
          text-decoration: none;
          text-rendering: optimizeLegibility;
          text-transform: uppercase;
          width: 100%;
        }

        :host( :not( [label] ) ) span {
          display: none;
        }

        :host( [light] ) button {
          background-color: #ffffff;
        }

        :host( [read-only] ) button {
          border: none;
          cursor: default;
        }

        :host( [disabled] ) button {
          border: solid 1px transparent;
        }
      </style>
      <button part="button" type="button">
        <slot></slot>
        <span part="label"></span>
      </button>
      <input accept="image/png, image/jpeg" type="file" />
      <canvas></canvas>
    `;

    // Private
    this._data = null;

    // Properties
    this._label = null;
    this._source = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => {
      if( !this.readOnly ) 
        this.$input.click() 
    } );
    this.$canvas = this.shadowRoot.querySelector( 'canvas' );
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'change', () => {
      if( this.$input.files.length > 0 ) {
        const img = new Image();
        img.setAttribute( 'data-name', this.$input.files[0].name );
        img.setAttribute( 'data-type', this.$input.files[0].type );
        img.addEventListener( 'load', ( evt ) => {
          const img = evt.currentTarget;
          const compression = this.compression === null ? 0.80 : this.compression;
          const constraint = this.constraint === null ? 320 : this.constraint;
          const format = this.format === null ? img.getAttribute( 'data-type' ) : this.format;
      
          let width = img.width;
          let height = img.height;
          
          const longest = Math.max( width, height );
            
          if( longest > constraint ) {
            const ratio = constraint / longest;
            width = width * ratio;
            height = height * ratio;
          }
      
          this.$canvas.width = width;
          this.$canvas.height = height;
          const context = this.$canvas.getContext( '2d' );
          context.drawImage( img, 0, 0, width, height );

          this.$button.setAttribute( 'data-format', format );          
          this.$button.setAttribute( 'data-name', img.getAttribute( 'data-name' ) );
          this.$button.setAttribute( 'data-modified', Date.now() );          
          this.$button.setAttribute( 'data-width', img.width );
          this.$button.setAttribute( 'data-height', img.height );
          this.src = this.$canvas.toDataURL( format, compression );          
          this.label = null;
        } );        
        img.src = URL.createObjectURL( this.$input.files[0] );        
        this.$input.value = '';        
      }
    } );
    this.$label = this.shadowRoot.querySelector( 'span' );
  }

  clear() {
    this.label = null;    
    this.src = null;
  }

  // Utility method
  // Extract initials for name
  initials( name ) {
    const cleaned = name.replace( /\([^()]*\)/g, '' );
    const parts = cleaned.split( ' ' );
    let result = '';

    for( let p = 0; p < parts.length; p++ ) {
      const name = parts[p].trim();

      if( name.length === 0 ) {
        continue;
      }

      let letter = name.charAt( 0 );

      if( name.indexOf( '-' ) > -1 ) {
        const hyphens = name.split( '-' );

        for( let h = 1; h < hyphens.length; h++ ) {
          letter = letter + hyphens[h].charAt( 0 );
        }
      }

      result = result + letter;
    }

    return result.toUpperCase();
  }

  // When things change
  _render() {
    if( this.readOnly ) {
      this.$button.disabled = this.readOnly;
    } else {
      this.$button.disabled = this.disabled;
    }

    // Image or label
    if( this.src !== null ) {
      this.$button.style.backgroundImage = `url( ${this.src} )`;
    } else {
      this.$button.style.backgroundImage = 'none';
    }

    // Content
    let content = this.label;

    // Handle shortening
    // If necessary
    if( content === null ) {
      content = '';
    } else {
      // Might provide initials
      if( this.shorten ) {
        content = this.initials( this.label );

        /*
        // Default font size
        let size = 20;

        // Determine on character count
        switch( this.label.trim().length ) {
          case 4:
            size = 18;
            break
          case 5:
            size = 14;
            break;
        }        

        // Set font size
        this.$label.style.fontSize = `${size}px`;        
        */
      }

      // User-defined label function
      if( this._label !== null ) {
        content = this._label( this.label );
      }
    }

    // Place content
    this.$label.innerText = content;
  }

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Default render
  // No attributes set
  connectedCallback() {
    // Check data property before render
    // May be assigned before module is loaded
    this._upgrade( 'compression' );        
    this._upgrade( 'concealed' );
    this._upgrade( 'constraint' );    
    this._upgrade( 'data' );        
    this._upgrade( 'disabled' );
    this._upgrade( 'hidden' );
    this._upgrade( 'format' );    
    this._upgrade( 'label' );
    this._upgrade( 'labelFunction' );    
    this._upgrade( 'light' );    
    this._upgrade( 'name' );        
    this._upgrade( 'readOnly' );
    this._upgrade( 'shorten' );
    this._upgrade( 'src' );
    this._upgrade( 'value' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'compression',
      'concealed',
      'constraint',
      'disabled',
      'hidden',
      'format',
      'label',
      'light',
      'name',
      'read-only',
      'shorten',
      'src'
    ];
  }

  // Observed tag attribute has changed
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

  get labelFunction() {
    return this._label;
  }

  set labelFunction( value ) {
    this._label = value;
  }  

  /*
  get src() {
    return this._source;
  }

  set src( data ) {
    this._source = data;
    this._render();
  }
  */

  get value() {
    if( this.$button.hasAttribute( 'data-format' ) ) {
      return {
        format: this.$button.getAttribute( 'data-format' ),
        name: this.$button.getAttribute( 'data-name' ),
        modified: parseInt( this.$button.getAttribute( 'data-modified' ) ),        
        width: parseInt( this.$button.getAttribute( 'data-width' ) ),
        height: parseInt( this.$button.getAttribute( 'data-height' ) ),
        data: this.src
      };
    }

    return null;
  }

  set value( photo ) {
    if( photo === null ) {
      this.$button.removeAttribute( 'data-id' );      
      this.$button.removeAttribute( 'data-format' );
      this.$button.removeAttribute( 'data-name' );
      this.$button.removeAttribute( 'data-modified' );      
      this.$button.removeAttribute( 'data-width' );
      this.$button.removeAttribute( 'data-height' );
      this.src = null;
    } else {
      this.$button.setAttribute( 'data-id', photo.id );
      this.$button.setAttribute( 'data-format', photo.format );
      this.$button.setAttribute( 'data-name', photo.name );
      this.$button.setAttribute( 'data-modified', photo.modified );      
      this.$button.setAttribute( 'data-width', photo.width );
      this.$button.setAttribute( 'data-height', photo.height );
      this.src = photo.data;
    }
  }

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
  get compression() {
    if( this.hasAttribute( 'compression' ) ) {
      return parseFloat( this.getAttribute( 'compression' ) );
    }

    return null;
  }

  set compression( value ) {
    if( value !== null ) {
      this.setAttribute( 'compression', value );
    } else {
      this.removeAttribute( 'compression' );
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

  get constraint() {
    if( this.hasAttribute( 'constraint' ) ) {
      return parseInt( this.getAttribute( 'constraint' ) );
    }

    return null;
  }

  set constraint( value ) {
    if( value !== null ) {
      this.setAttribute( 'constraint', value );
    } else {
      this.removeAttribute( 'constraint' );
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

  get format() {
    if( this.hasAttribute( 'format' ) ) {
      return this.getAttribute( 'format' );
    }

    return null;
  }

  set format( value ) {
    if( value !== null ) {
      this.setAttribute( 'format', value );
    } else {
      this.removeAttribute( 'format' );
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

  get shorten() {
    return this.hasAttribute( 'shorten' );
  }

  set shorten( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'shorten' );
      } else {
        this.setAttribute( 'shorten', '' );
      }
    } else {
      this.removeAttribute( 'shorten' );
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
}

window.customElements.define( 'gr-avatar', GRAvatar );
