import GRCalendar from "./calendar.js";

export default class GRDatePicker extends HTMLElement {
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

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          background: none;
          box-sizing: border-box;
          border: none;
          color: #161616;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
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
          flex-basis: 0;
          flex-grow: 1;
          height: 39px;
          padding: 0 0 0 16px;
          text-align: left;
          width: 125px;
        }

        div[part=header] {
          display: flex;
          flex-direction: row;
        }

        div[part=header] div {
          flex-basis: 0;
          flex-grow: 1;
        }

        div[part=popover] {
          border: none;
          box-shadow: 0 2px 6px #0000004d;                      
          margin: 0;
          padding: 0;
          position: absolute;
        }

        i {
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          direction: ltr;
          font-family: 'Material Symbols Outlined';
          font-size: 20px;
          font-style: normal;
          font-variation-settings: "wght" 200;          
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

        i[part=invalid] {
          color: #da1e28;
          font-variation-settings: 
            "FILL" 1, 
            "wght" 700;                    
        }

        p {
          box-sizing: border-box;
          color: #161616;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-align: left;
          text-decoration: none;
          text-rendering: optimizeLegibility;
          width: 100%;
        }

        p[part=error] {
          color: #6f6f6f;          
          font-size: 12px;          
          padding: 4px 0 0 0;     
          visibility: hidden;               
        }

        p[part=helper] {
          color: #6f6f6f;
          font-size: 12px;          
          padding: 0 0 4px 0;
        }

        p[part=label] {
          color: #525252;          
          flex-basis: 0;
          flex-grow: 1;          
          font-size: 12px;
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
          padding: 0 14px 0 0;
          transition: background-color 150ms ease-in-out;
          -webkit-tap-highlight-color: transparent;
        }

        label:hover {
          background-color: #e8e8e8;
        }

        label:focus-within {
          outline: solid 2px #0f62fe;          
        }

        label:not( filled ) button[part=clear] {
          min-width: 0;
          overflow: hidden;
          width: 0;
        }

        :host( :not( [error] ) ) p[part=error] {
          visibility: hidden;
        }

        :host( :not( [helper] ) ) p[part=helper] {
          display: none;
        }

        :host( [label]:not( [helper] ) ) p[part=label] {
          padding: 0 0 4px 0;
        }         

        :host( :not( [label] ) ) p[part=label] {
          display: none;
        }        

        :host( [light] ) label {
          background-color: #ffffff;
        }

        :host( :not( [invalid] ) ) i[part=invalid] {
          display: none;
        }

        :host( :not( [value] ) ) button[part=input] {
          color: #a8a8a8;
        }

        :host( [read-only] ) button,
        :host( [read-only] ) i {
          cursor: default;
        }

        :host( [read-only] ) i {
          color: #a8a8a8;
        }
        
        :host( [read-only] ) label {
          border-bottom: solid 1px transparent;
          cursor: default;
        }

        :host( [read-only] ) label:hover {
          background-color: #f4f4f4;
        }        

        :host( [read-only] ) label:focus-within {
          outline: solid 2px transparent;
        }

        :host( [disabled] ) button {
          color: #16161640 !important;
          cursor: not-allowed;
        }

        :host( [disabled] ) i {
          color: #16161640;
          cursor: not-allowed;
        }

        :host( [disabled] ) label {
          border-bottom: solid 1px transparent;
          color: #16161640;
          cursor: not-allowed;
        }

        :host( [disabled] ) label:hover {        
          background-color: #f4f4f4;
        }

        :host( [disabled] ) p {
          color: #16161640;
        }
      </style>
      <label part="field">
        <button part="input" popovertarget="gr-popover" type="button"></button>
        <button part="clear" type="button">
          <i>close</i>
        </button>
        <i part="invalid">error</i>
        <button part="icon" popovertarget="gr-popover" type="button">
          <i>calendar_month</i>
        </button>
      </label>
      <div id="gr-popover" part="popover" popover>
        <gr-calendar part="calendar"></gr-calendar>
      </div>
    `;

    // Private
    this._format = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements 
    this.$calendar = this.shadowRoot.querySelector( 'gr-calendar' );
    this.$calendar.addEventListener( 'gr-change', ( evt ) => {
      this.$popover.hidePopover();
      this.valueAsDate = evt.detail.value;
      this.$input.focus();  
  
      this.dispatchEvent( new CustomEvent( 'gr-change', {
        detail: {
          name: this.name,
          value: this.valueAsDate
        }
      } ) );
    } );
    this.$clear = this.shadowRoot.querySelector( 'button[part=clear]' );
    this.$clear.addEventListener( 'click', () => this.value = null );        
    this.$field = this.shadowRoot.querySelector( 'label' );
    this.$icon = this.shadowRoot.querySelector( 'button[part=icon]' );
    this.$icon.addEventListener( 'click', () => this.doCalendarClick() );
    this.$input = this.shadowRoot.querySelector( 'button[part=input]' );
    this.$input.addEventListener( 'click', () => this.doCalendarClick() );
    this.$popover = this.shadowRoot.querySelector( 'div[part=popover]' );
  }

  doCalendarClick() {
    if( this.disabled || this.readOnly ) return;

    this._position( this.$input );
    
    this.$calendar.display = this.value;
    this.$calendar.value = this.value;
  }

  _position( target ) {
    const CALENDAR = 288;
    const bounds = target.parentElement.getBoundingClientRect();

    if( ( bounds.top + bounds.height + target.clientHeight + window.scrollY ) > window.innerHeight ) {
      this.$popover.style.top = `${bounds.top - target.clientHeight + window.scrollY}px`;
    } else {
      this.$popover.style.top = `${bounds.top + bounds.height + window.scrollY + 1}px`;  
    }

    if( ( bounds.x + CALENDAR ) > window.innerWidth ) {
      this.$popover.style.left = `${bounds.x + bounds.width - CALENDAR + window.scrollX}px`;
    } else {
      this.$popover.style.left = `${bounds.x + window.scrollX}px`;
    }
  }  

  // When attributes change
  _render() {
    if( this.readOnly ) {
      this.$input.disabled = this.readOnly;
    } else {
      this.$input.disabled = this.disabled;
      this.$icon.disabled = this.disabled;
    }

    if( this.value !== null ) {
      if( this._format === null ) {
        const formatted = new Intl.DateTimeFormat( navigator.language, {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        } ).format( this.valueAsDate );    
        this.$input.innerText = formatted;
      } else {
        this.$input.innerText = this._format( this.valueAsDate );
      }

      this.$field.classList.add( 'filled' );
    } else {
      this.$field.classList.remove( 'filled' );
      this.$input.innerText = this.placeholder === null ? '' : this.placeholder;
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
    this._upgrade( 'formatFunction' );    
    this._upgrade( 'hidden' );
    this._upgrade( 'invalid' );
    this._upgrade( 'light' );
    this._upgrade( 'name' );    
    this._upgrade( 'placeholder' );    
    this._upgrade( 'readOnly' );
    this._upgrade( 'value' );    
    this._upgrade( 'valueAsDate' );  
    this._upgrade( 'valueAsTime' );   

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'invalid',
      'light',
      'name',
      'placeholder',
      'read-only',
      'value'
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
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  get formatFunction() {
    return this._format;
  }

  set formatFunction( value ) {
    this._format = value;
  }  

  get valueAsDate() {
    return this.value === null ? null : new Date( this.value );
  }

  set valueAsDate( date ) {
    this.value = date === null ? null : date.toISOString();
  }

  get valueAsTime() {
    return this.value === null ? null : new Date( this.value ).getTime();
  }

  set valueAsTime( time ) {
    this.value = time === null ? null : new Date( time ).toISOString();
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
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }  
}

window.customElements.define( 'gr-date-picker', GRDatePicker );
