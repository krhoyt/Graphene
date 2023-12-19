import GrapheneHBox from "../containers/hbox.js";
import GrapheneVBox from "../containers/vbox.js";

import GrapheneCalendar from "./calendar.js";
import GrapheneIcon from "./icon.js";
import GrapheneLabel from "./label.js";

export default class GrapheneDatePicker extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          background: none;
          box-sizing: border-box;
          border: none;
          cursor: pointer;
          margin: 0;
          padding: 0;
          -webkit-tap-highlight-color: transparent;          
        }

        button[part=clear] {
          align-items: center;
          display: flex;
          height: 39px;
          justify-content: center;
          width: 40px;
        }

        button[part=icon] {          
          align-items: center;
          display: flex;
          height: 39px;
          justify-content: center;
          width: 20px;
        }

        button[part=input] {
          height: 39px;
          padding: 0 0 0 16px;
          text-align: left;
          width: 125px;
        }

        gr-icon {
          --icon-color: #161616;
          --icon-cursor: pointer;
        }

        gr-icon[part=invalid] {
          --icon-color: #da1e28;
        }

        gr-label[part=error] {
          padding: 4px 0 0 0;     
          visibility: hidden;               
          --label-color: #6f6f6f;          
          --label-font-size: 12px;
        }

        gr-label[part=helper] {
          padding: 0 0 4px 0;
          --label-color: #6f6f6f;
          --label-font-size: 12px;
        }

        gr-label[part=label] {
          flex-basis: 0;
          flex-grow: 1;          
          --label-color: #525252;
          --label-font-size: 12px;
        }

        label {
          align-items: center;
          background-color: #f4f4f4;
          border-bottom: solid 1px #8d8d8d;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0 12px 0 0;
          -webkit-tap-highlight-color: transparent;
        }

        label:focus-within {
          outline: solid 2px #0f62fe;          
        }

        label:not( filled ) button[part=clear] {
          min-width: 0;
          width: 0;
        }

        :host( :not( [invalid] ) ) gr-icon[part=invalid] {
          display: none;
        }
      </style>
      <gr-hbox part="header">
        <gr-vbox>
          <gr-label part="label"></gr-label>
          <gr-label part="helper"></gr-label>
        </gr-vbox>
        <slot></slot>
      </gr-hbox>
      <label part="field">
        <button part="input" type="button" />
        <button part="clear" type="button">
          <gr-icon name="close" weight="200"></gr-icon>
        </button>
        <gr-icon filled name="error" part="invalid"></gr-icon>        
        <button part="icon" type="button">
          <gr-icon name="calendar_month" weight="200"></gr-icon>
        </button>
      </label>
      <gr-label part="error"></gr-label>
    `;

    // Events
    this.doCalendarChange = this.doCalendarChange.bind( this );

    // Private
    this._calendar = null;
    this._format = null;
    this._value = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$calendar = this.shadowRoot.querySelector( 'button[part=icon]' );
    this.$calendar.addEventListener( 'click', () => this.doCalendarClick() ); 
    this.$clear = this.shadowRoot.querySelector( 'button[part=clear]' );
    this.$clear.addEventListener( 'click', () => this.value = null );        
    this.$error = this.shadowRoot.querySelector( 'gr-label[part=error]' );
    this.$field = this.shadowRoot.querySelector( 'label' );
    this.$helper = this.shadowRoot.querySelector( 'gr-label[part=helper]' );
    this.$input = this.shadowRoot.querySelector( 'button[part=input]' );
    this.$input.addEventListener( 'click', () => this.doCalendarClick() );
    this.$label = this.shadowRoot.querySelector( 'gr-label[part=label]' );
  }

  doCalendarChange( evt ) {
    this._calendar.hidden = true;
    this._calendar.owner = null;
    this._calendar.removeEventListener( 'gr-change', this.doCalendarChange );    
    
    this.value = new Date( evt.detail.getTime() );
    this.$input.focus();  

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: new Date( this.value.getTime() )
    } ) );
  }

  doCalendarClick() {
    if( this._calendar.hidden ) {
      this._calendar.addEventListener( 'gr-change', this.doCalendarChange );
      this._calendar.owner = this;
      this._calendar.value = this.value;
      this._calendar.hidden = false;                  
    } else {
      if( this._calendar.owner === this ) {
        this._calendar.hidden = true;
        this._calendar.owner = null;
      } else {
        this._calendar.owner = this;
      }

      this._calendar.removeEventListener( 'gr-change', this.doCalendarChange );      
    }

    const bounds = this.$field.getBoundingClientRect();
    this._calendar.style.left = ( bounds.right + this._calendar.clientWidth ) > window.innerWidth ? `${(bounds.right - this._calendar.clientWidth)}px` : `${bounds.x}px`;
    this._calendar.style.top = `${bounds.top + bounds.height}px`;          
  }

   // When attributes change
  _render() {
    this.$error.text = this.error === null ? ' ' : this.error;
    this.$helper.text = this.helper;
    this.$label.text = this.label;

    this.$input.disabled = this.readOnly;

    if( this._value !== null ) {
      if( this._format === null ) {
        const formatted = new Intl.DateTimeFormat( navigator.language, {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        } ).format( this._value );    
        this.$input.innerText = formatted;
      } else {
        this.$input.innerText = this._format( this._value );
      }
      
      this.$field.classList.add( 'filled' );
    } else {
      this.$field.classList.remove( 'filled' );
      this.$input.value = this.placeholder === null ? '' : this.placeholder;
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
    this._calendar = document.body.querySelector( 'gr-calendar' );

    if( this._calendar === null ) {
      this._calendar = document.createElement( 'gr-calendar' );
      this._calendar.setAttribute( 'data-picker', true );
      this._calendar.setAttribute( 'data-open', false );
      this._calendar.hidden = true;
      document.body.appendChild( this._calendar );
    }

    this._upgrade( 'error' );
    this._upgrade( 'formatFunction' );    
    this._upgrade( 'helper' );
    this._upgrade( 'hidden' );
    this._upgrade( 'invalid' );
    this._upgrade( 'label' );
    this._upgrade( 'light' );
    this._upgrade( 'placeholder' );    
    this._upgrade( 'readOnly' );
    this._upgrade( 'value' );    

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'error',
      'helper',
      'hidden',
      'invalid',
      'label',
      'light',
      'placeholder',
      'read-only'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get formatFunction() {
    return this._format;
  }

  set formatFunction( value ) {
    this._format = value;
  }  

  get value() {
    return this._value;
  }

  set value( date ) {
    if( date === null ) {
      this._value = null;
    } else {
      if( date instanceof Date ) {
        this._value = new Date( date.getTime() );
      } else if( typeof( date ) === 'number' ) {
        this._value = new Date( date );
      }
    }

    this._render();
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
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
}

window.customElements.define( 'gr-date-picker', GrapheneDatePicker );
