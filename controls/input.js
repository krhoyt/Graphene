import GraphiteHBox from "../containers/hbox.js";
import GraphiteVBox from "../containers/vbox.js";
import GraphiteIcon from "./icon.js";
import GraphiteLabel from "./label.js";

export default class GraphiteInput extends HTMLElement {
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

        button {
          align-items: center;
          background: none;
          border: none;
          box-sizing: border-box;
          color: #525252;
          cursor: pointer;
          direction: ltr;        
          display: flex;
          font-family: 'Material Symbols Outlined';
          font-size: 18px;
          font-style: normal;
          font-weight: normal; 
          height: 20px;
          justify-content: center;
          letter-spacing: normal;          
          margin: 0;
          min-height: 20px;
          min-width: 0;
          margin: 0;
          opacity: 0;
          overflow: hidden;
          padding: 0;
          text-transform: none;
          text-rendering: optimizeLegibility;
          transition: 
            margin 300ms ease-out,
            min-width 300ms ease-out,
            opacity 300ms ease-out,
            width 300ms ease-out;  
          white-space: nowrap;            
          width: 0; 
          word-wrap: normal;          
          -webkit-tap-highlight-color: transparent;
        }

        div {
          align-items: flex-end;
          display: none;
          flex-basis: 0;
          flex-direction: row;
          flex-grow: 1;
          margin: 0;
          padding: 0;
        }

        div > div {
          align-items: flex-start;
          display: flex;
          flex-direction: column;
        }

        input {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          margin: 0;
          min-height: 40px;
          outline: none;
          padding: 0 16px 0 16px;
          text-rendering: optimizeLegibility;
          width: 0;
          -webkit-tap-highlight-color: transparent;
        }

        input::placeholder {
          color: #a8a8a8;
        }        

        input[type=search]::-webkit-search-decoration,
        input[type=search]::-webkit-search-cancel-button,
        input[type=search]::-webkit-search-results-button,
        input[type=search]::-webkit-search-results-decoration {
          -webkit-appearance:none;
        }

        label {
          align-items: center;
          background-color: #f4f4f4;
          border-bottom: solid 1px #8d8d8d;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0;
          transition: background-color 150ms ease-in-out;
          -webkit-tap-highlight-color: transparent;
        }

        label:focus-within {
          outline: solid 2px #0f62fe;
        }

        p {
          text-rendering: optimizeLegibility;          
        }

        p.icon {
          box-sizing: border-box;
          color: #da1e28;
          cursor: default;
          direction: ltr;
          font-family: 'Material Symbols Outlined';
          font-size: 18px;
          font-style: normal;
          font-weight: normal;
          height: 20px;
          letter-spacing: normal;
          opacity: 0;
          overflow: hidden;
          margin: 0;
          min-height: 20px;
          min-width: 0;
          padding: 0;
          text-transform: none;
          transition: margin 300ms ease-out;
          white-space: nowrap;
          width: 0;
          word-wrap: normal;
        }                

        p.text {
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          padding: 0;
        }

        p[part=error] {
          color: #6f6f6f;          
          font-size: 12px;
          padding: 4px 0 0 0;
          visibility: hidden;
        }

        p[part=helper] {
          color: #6f6f6f;     
          display: none;
          font-size: 12px;          
          padding: 0 0 4px 0;               
        }

        p[part=label] {
          color: #525252;          
          flex-basis: 0;
          flex-grow: 1;
          font-size: 12px;
          padding: 0;
        }

        ::slotted( gr-icon ) {
          margin: 0 -4px 0 12px;
          --icon-color: #525252;
          --icon-font-size: 18px;
          --icon-size: 18px;
        }

        ::slotted( gr-label ) {
          margin: 0 0 4px 0;
          --label-color: #6f6f6f;                         
          --label-font-size: 12px;
        }

        ::slotted( gr-link ) {
          margin: 0 0 2px 0;
          --link-font-size: 12px;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [error] ) p[part=error] {
          visibility: visible;
        }

        :host( [label] ) div {
          display: flex;
        }

        :host( [label]:not( [helper] ) ) p[part=label] {
          padding: 0 0 4px 0;
        } 

        :host( [helper] ) p[part=helper] {
          display: block;
        }

        :host( [hidden] ) {
          display: none;
        }

        :host( [invalid] ) label {
          outline: solid 2px #da1e28;
        }

        :host( [invalid] ) label:focus-within {
          outline: solid 2px #0f62fe;
        }

        :host( [invalid] ) p[part=error] {
          color: #da1e28;
        }

        :host( [invalid] ) p.icon {
          min-width: 20px;
          opacity: 1.0;
          margin: 0 12px 0 0;
          width: 20px;
        }

        :host( [light] ) label {
          background-color: #ffffff;
        }

        :host( [type=password] ) button[part=reveal] {
          min-width: 20px;
          opacity: 1.0;
          margin: 0 12px 0 0;
          width: 20px;          
        }

        :host( [type=password] ) label:focus-within button[part=reveal] {
          min-width: 20px;
          opacity: 1.0;
          margin: 0 12px 0 6px;
          width: 20px;          
        }

        :host( [type=search][value] ) label {
          background-color: #e8e8e8;
        }

        :host( [type=search] ) label:hover {
          background-color: #e8e8e8;
        }        

        :host( [value]:not( [read-only] ) ) label:focus-within p.icon {
          margin: 0 6px 0 0;
        }

        :host( [value]:not( [read-only] ) ) label:focus-within button[part=clear] {
          min-width: 20px;
          opacity: 1.0;
          margin: 0 12px 0 0;
          width: 20px;
        }

        :host( [read-only] ) button[part=clear] {
          min-width: 0;
          opacity: 0;
          margin: 0;
          width: 0;                    
        }

        :host( [read-only] ) input {
          cursor: default;
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

        :host( [type=search][value] ) button[part=clear] {
          min-width: 20px;
          opacity: 1.0;
          margin: 0 12px 0 0;
          width: 20px; 
        }

        :host( [disabled] ) input {
          color: #c6c6c6;
          cursor: not-allowed;
        }

        :host( [disabled] ) label {
          border-bottom: solid 1px transparent;
        }

        :host( [disabled] ) p[part=error],
        :host( [disabled] ) p[part=helper],
        :host( [disabled] ) p[part=label] {
          color: #16161640;
        }

        :host( [disabled][invalid] ) p[part=error] {
          color: #da1e28;
        }
      </style>
      <div>
        <div>
          <p class="text" part="label"></p>
          <p class="text" part="helper"></p>                
        </div>
        <slot></slot>        
      </div>
      <label part="field">
        <slot name="prefix"></slot>
        <input part="input" type="text">
        <p class="icon" part="invalid">error</p>
        <button part="reveal" type="button">visibility</button>
        <button part="clear" type="button">close</button>
      </label>
      <p class="text" part="error"></p>
    `;

    // Root
    const shadowRoot = this.attachShadow( {mode: 'open'} );
    shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$clear = shadowRoot.querySelector( 'button[part=clear]' );
    this.$clear.addEventListener( 'click', () => {
      this.clear();
      this.focus();

      this.dispatchEvent( new CustomEvent( 'gr-clear' ) );
    } );
    this.$error = shadowRoot.querySelector( 'p[part=error]' );    
    this.$label = shadowRoot.querySelector( 'p[part=label]' );
    this.$helper = shadowRoot.querySelector( 'p[part=helper]' );
    this.$input = shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', ( evt ) => {
      this.value = evt.currentTarget.value;
    } );
    this.$input.addEventListener( 'keypress', ( evt ) => {
      if( evt.key === 'Enter' ) {
        evt.preventDefault();
        evt.stopImmediatePropagation();

        this.dispatchEvent( new CustomEvent( 'gr-enter', {
          detail: {
            value: evt.currentTarget.value
          }
        } ) );
      }
    } );
    this.$reveal = shadowRoot.querySelector( 'button[part=reveal]' );
    this.$reveal.addEventListener( 'click', () => {
      this.$input.type = this.$input.type === 'password' ? 'text' : 'password';
      this.$input.focus();
      this.$reveal.innerText = this.$input.type === 'password' ? 'visibility' : 'visibility_off';
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
    this.$error.innerText = this.error === null ? '&nbsp;' : this.error;
    this.$input.disabled = this.disabled;
    this.$input.inputMode = this.mode === null ? 'text' : this.mode;
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$input.readOnly = this.readOnly;
    this.$input.value = this.value === null ? '' : this.value;

    if( this.type === 'password' ) {
      this.$input.type = this.$reveal.innerText === 'visibility' ? 'password' : 'type';      
    } else {
      this.$input.type = this.type === null ? 'text' : this.type;      
    }

    this.$label.innerText = this.label === null ? '' : this.label;
    this.$helper.innerText = this.helper === null ? '' : this.helper;
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
    this._upgrade( 'error' );
    this._upgrade( 'helper' );
    this._upgrade( 'hidden' );
    this._upgrade( 'invalid' );
    this._upgrade( 'label' );
    this._upgrade( 'light' );
    this._upgrade( 'mode' );
    this._upgrade( 'placeholder' );
    this._upgrade( 'readOnly' );
    this._upgrade( 'type' );
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
      'placeholder',
      'read-only',
      'type',
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

  get type() {
    if( this.hasAttribute( 'type' ) ) {
      return this.getAttribute( 'type' );
    }

    return null;
  }

  set type( value ) {
    if( value !== null ) {
      this.setAttribute( 'type', value );
    } else {
      this.removeAttribute( 'type' );
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

window.customElements.define( 'gr-input', GraphiteInput );
