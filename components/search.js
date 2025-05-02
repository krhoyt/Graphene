export default class GRSearch extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
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

        button {
          align-items: center;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          justify-content: center;
          margin: 0;
          min-height: 20px;
          min-width: 0;
          margin: 0;
          opacity: 0;
          overflow: hidden;
          padding: 0;
          transition: 
            margin 300ms ease-out,
            min-width 300ms ease-out,
            opacity 300ms ease-out,
            width 300ms ease-out;  
          width: 0; 
          -webkit-tap-highlight-color: transparent;
        }

        button i {
          cursor: pointer;
        }

        input {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          color: #161616;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 48px;
          margin: 0;
          min-height: 48px;
          outline: none;
          padding: 0 16px 0 0;
          text-rendering: optimizeLegibility;
          width: 0;
          -webkit-tap-highlight-color: transparent;
        }

        input::placeholder {
          color: #c6c6c6;          
          opacity: 1.0;
        }        

        label {
          align-items: center;
          background-color: #f4f4f4;
          box-sizing: border-box;
          cursor: text;
          display: flex;
          flex-direction: row;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0;
          transition: background-color 150ms ease-in-out;
          -webkit-tap-highlight-color: transparent;
        }

        label:hover {
          background-color: #e8e8e8;
        }

        label:focus-within {
          background-color: #e8e8e8;
          outline: solid 2px #0f62fe;
        }

        i {
          box-sizing: border-box;
          color: #161616;
          cursor: default;
          direction: ltr;
          font-family: 'Material Symbols Outlined';
          font-size: 20px;
          font-style: normal;
          font-variation-settings: 'wght' 200;
          font-weight: normal;
          height: 20px;
          letter-spacing: normal;
          line-height: 20px;
          margin: 0;
          max-height: 20px;         
          max-width: 20px;                    
          min-height: 20px;                               
          min-width: 20px;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: 20px;
          word-wrap: normal;                              
        }

        i[part=search] {
          cursor: text;
          margin: 0 14px 0 14px;
        }

        :host( [value] ) label {
          background-color: #e8e8e8;
        }

        :host( [value] ) button[part=clear] {
          min-width: 20px;
          opacity: 1.0;
          margin: 0 14px 0 0;
          width: 20px; 
        }

        :host( [size=md] ) button[part=clear] {
          margin: 0 10px 0 0;
        }

        :host( [size=md] ) i[part=search] {
          margin: 0 10px 0 10px;
        }

        :host( [size=md] ) input {
          height: 40px;
          min-height: 40px;
        }     

        :host( [size=sm] ) button[part=clear] {
          margin: 0 6px 0 0;
        }

        :host( [size=sm] ) i[part=search] {
          margin: 0 6px 0 6px;
        }

        :host( [size=sm] ) input {
          height: 32px;
          min-height: 32px;
        }        

        :host( [disabled] ) i {
          color: #c6c6c6;   
          cursor: not-allowed;       
        }        

        :host( [disabled] ) input {
          color: #c6c6c6;
          cursor: not-allowed;
        }

        :host( [disabled] ) input::placeholder {        
          color: #c6c6c6;
        }

        :host( [disabled] ) label {
          border-bottom: solid 1px transparent;
          background-color: #f4f4f4;
          cursor: not-allowed;
        }

        :host( [disabled] ) label:hover {
          background-color: #f4f4f4;
        }        
      </style>
      <label part="field">
        <i part="search"></i>
        <input part="input" type="text">
        <button part="clear" type="button">
          <i>close</i>
        </button>
      </label>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$clear = this.shadowRoot.querySelector( 'button[part=clear]' );
    this.$clear.addEventListener( 'click', () => {
      this.clear();
      this.focus();

      this.dispatchEvent( new CustomEvent( 'gr-clear' ) );
    } );
    this.$icon = this.shadowRoot.querySelector( 'i[part=search]' );
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', ( evt ) => {
      this.value = evt.currentTarget.value;
    } );
    this.$input.addEventListener( 'keypress', ( evt ) => {
      if( evt.key === 'Enter' ) {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        this.dispatchEvent( new CustomEvent( 'gr-enter', {
          detail: {
            name: evt.currentTarget.name,
            value: evt.currentTarget.value
          }
        } ) );
      }
    } );
  }

  blur() {
    this.$input.blur();
  }

  clear() {
    this.$input.value = '';
    this.value = null;
  }

  focus() {
    this.$input.focus();
  }

  // When things change
  _render() {
    this.$icon.innerText = this.icon === null ? 'search' : this.icon;
    this.$input.disabled = this.disabled;
    this.$input.placeholder = this.placeholder === null ? 'Search' : this.placeholder;
    this.$input.value = this.value === null ? '' : this.value;
    this.$clear.disabled = this.disabled;
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
    this._upgrade( 'disabled' );
    this._upgrade( 'hidden' );
    this._upgrade( 'icon' );
    this._upgrade( 'name' );
    this._upgrade( 'placeholder' );
    this._upgrade( 'size' );    
    this._upgrade( 'value' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'icon',
      'name',
      'placeholder',
      'size',
      'value'
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

  get icon() {
    if( this.hasAttribute( 'icon' ) ) {
      return this.getAttribute( 'icon' );
    }

    return null;
  }

  set icon( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon', value );
    } else {
      this.removeAttribute( 'icon' );
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

  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( value ) {
    if( value !== null ) {
      this.setAttribute( 'placeholder', value );
    } else {
      this.removeAttribute( 'placeholder' );
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

  get value() {
    let result = null;

    if( this.hasAttribute( 'value' ) ) {
      if( this.getAttribute( 'value').length > 0 ) {
        result = this.getAttribute( 'value' );
      }
    }

    return result;
  }

  set value( content ) {
    if( content !== null ) {
      if( content.trim().length === 0 ) {
        this.removeAttribute( 'value' );
      } else {
        this.setAttribute( 'value', content );
      }
    } else {
      this.removeAttribute( 'value' );
    }
  }
}

window.customElements.define( 'gr-search', GRSearch );
