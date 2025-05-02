export default class GRTextarea extends HTMLElement {
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

        div {
          align-items: center;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }

        div[part=after] {
          padding: 4px 0 0 0;
        }

        div[part=before] {
          padding: 0 0 4px 0;
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

        label {
          align-items: center;
          background-color: #f4f4f4;
          border-bottom: solid 1px #8d8d8d;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          height: 100%;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0;
          position: relative;
          transition: background-color 150ms ease-in-out;          
          -webkit-tap-highlight-color: transparent;
        }

        label:hover {
          background-color: #e8e8e8;          
        }

        label:focus-within {
          background-color: #f4f4f4;
          outline: solid 2px #0f62fe;
        }

        p {
          color: #525252;
          cursor: default;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          line-height: 16px;
          margin: 0;
          padding: 0;
        }

        p[part=helper] {
          height: 16px;
        }

        textarea {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 100%;
          line-height: 20px;
          margin: 0;          
          outline: none;
          padding: 10px 40px 0 16px;
          resize: none;
          text-rendering: optimizeLegibility;
          -webkit-tap-highlight-color: transparent;
        }

        textarea::placeholder {
          color: #a8a8a8;
          opacity: 1.0;
        }                

        :host( [invalid] ) label {
          outline: solid 2px #da1e28;
        }

        :host( [invalid] ) label:focus-within {
          outline: solid 2px #0f62fe;
        }

        :host( [invalid] ) i {
          min-width: 20px;
          opacity: 1.0;
          position: absolute;
          right: 12px;       
          top: 12px;   
          width: 20px;
          --icon-color: #da1e28;
        }

        :host( :not( :has( [slot=before] ) ):not( [label] ) ) div[part=before],
        :host( :not( [label] ) ) p[part=label] {
          display: none;
        }

        :host( :not( [invalid] ) ) i {
          display: none;
        }

        :host( [light] ) label {
          background-color: #ffffff;
        }

        :host( [read-only] ) label {
          border-bottom: solid 1px transparent;
          cursor: default;
        }        

        :host( [read-only] ) label:hover {
          background-color: #f4f4f4;
        }                
        
        :host( [read-only][light] ) label:hover {
          background-color: #ffffff;
        }                               

        :host( [read-only] ) label:focus-within {        
          outline: solid 2px transparent;
        }

        :host( [read-only] ) textarea {
          cursor: default;
        }                

        :host( [disabled] ) label {
          border-bottom: solid 1px transparent;
        }

        :host( [disabled] ) label:hover {
          background-color: #f4f4f4;
        }                

        :host( [disabled] ) p {
          color: #16161640;
        }

        :host( [disabled] ) textarea {
          color: #c6c6c6;
          cursor: not-allowed;
        }

        :host( [disabled] ) textarea::placeholder {        
          color: #c6c6c6;
        }        
      </style>
      <div part="before">
        <p part="label"></p>
        <slot name="before"></slot>
      </div>
      <label part="field">
        <textarea part="input"></textarea>
        <i part="invalid">error</i>        
      </label>
      <div part="after">
        <p part="helper"></p>
        <slot name="after"></slot>
      </div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$helper = this.shadowRoot.querySelector( 'p[part=helper]' );
    this.$label = this.shadowRoot.querySelector( 'p[part=label]' );
    this.$textarea = this.shadowRoot.querySelector( 'textarea' );
    this.$textarea.addEventListener( 'input', ( evt ) => {
      this.value = evt.currentTarget.value;
      this.dispatchEvent( new CustomEvent( 'gr-change', { 
        detail: {
          name: this.name,
          value: this.value
        }
      } ) );
    } );
  }

  blur() {
    this.$textarea.blur();
  }

  clear( focus = false ) {
    this.$textarea.value = '';
    this.value = null;

    if( focus ) {
      this.$textarea.focus();
    }
  }

  focus() {
    this.$textarea.focus();
  }

  // When things change
  _render() {
    this.$label.textContent = this.label === null ? '' : this.label;

    this.$textarea.disabled = this.disabled;
    this.$textarea.inputMode = this.mode === null ? '' : this.mode;
    this.$textarea.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$textarea.readOnly = this.readOnly;
    this.$textarea.value = this.value === null ? '' : this.value;

    this.$helper.textContent = this.helper === null ? '' : this.helper;    
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
    this._upgrade( 'error' );
    this._upgrade( 'helper' );
    this._upgrade( 'hidden' );
    this._upgrade( 'invalid' );
    this._upgrade( 'label' );
    this._upgrade( 'light' );
    this._upgrade( 'mode' );
    this._upgrade( 'name' );    
    this._upgrade( 'placeholder' );
    this._upgrade( 'readOnly' );
    this._upgrade( 'value' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'error',
      'helper',
      'hidden',
      'invalid',
      'label',
      'light',
      'mode',
      'name',
      'placeholder',
      'read-only',
      'value'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Arbitrary storage
  // For your convenience
  // Not used in component
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

  get error() {
    if( this.hasAttribute( 'error' ) ) {
      return this.getAttribute( 'error' );
    }

    return null;
  }

  set error( value ) {
    if( value !== null ) {
      this.setAttribute( 'error', value );
    } else {
      this.removeAttribute( 'error' );
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

  get invalid() {
    return this.hasAttribute( 'invalid' );
  }

  set invalid( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'invalid' );
      } else {
        this.setAttribute( 'invalid', '' );
      }
    } else {
      this.removeAttribute( 'invalid' );
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

  get mode() {
    if( this.hasAttribute( 'mode' ) ) {
      return this.getAttribute( 'mode' );
    }

    return null;
  }

  set mode( value ) {
    if( value !== null ) {
      this.setAttribute( 'mode', value );
    } else {
      this.removeAttribute( 'mode' );
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

  get value() {
    let result = null;

    if( this.hasAttribute( 'value' ) ) {
      if( this.getAttribute( 'value').trim().length > 0 ) {
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

window.customElements.define( 'gr-textarea', GRTextarea );
