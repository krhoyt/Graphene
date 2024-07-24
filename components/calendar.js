export default class GRCalendar extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #f4f4f4;
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
          padding: 4px 4px 8px 4px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        button[part=left],
        button[part=right] {
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          height: 40px;
          justify-content: center;
          margin: 0;
          min-height: 40px;
          min-width: 40px;
          outline: none;
          padding: 0;
          width: 40px;
        }

        button[part=left]:hover,
        button[part=right]:hover {
          background-color: #e8e8e8;        
        }

        div[part=calendar] {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
          grid-template-rows: repeat( auto-fill, 1fr );
          gap: 0px 0px;
          position: relative;
        }        

        div[part=calendar] button {
          background: none;
          border: none;
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          font-style: normal;
          font-weight: normal;
          height: 40px;
          margin: 0;
          outline: none;
          padding: 0;
          position: relative;
          text-rendering: optimizeLegibility;
          width: 40px;
          -webkit-tap-highlight-color: transparent;
        }

        div[part=calendar] button:not( .selected ):hover {
          background-color: #e8e8e8;
        }
        
        div[part=calendar] button.today {
          color: var( --calendar-today-color, #0f62fe );
          font-weight: 600;
        }

        div[part=calendar] button.today::after {
          background-color: var( --calendar-today-color, #0f62fe );
          bottom: 6px;
          content: ' ';
          height: 4px;
          position: absolute;
          left: calc( 50% - 2px );
          width: 4px;
        }

        div[part=calendar] button.selected.today {
          background-color: var( --calendar-selected-color, #0f62fe );
          color: #ffffff;
          font-weight: 600;
        }

        div[part=calendar] button.selected.today::after {
          background-color: #ffffff;
        }        

        div[part=calendar] button.outside {
          color: var( --calendar-outside-color, #6f6f6f );
        }

        div[part=calendar] button.selected {
          background-color: var( --calendar-selected-color, #0f62fe );
          color: #ffffff;
        }        

        div:not( [part=calendar] ) {
          align-items: center;
          display: flex;
          flex-direction: row;
        }

        div[part=date] {
          flex-basis: 0;
          flex-grow: 1;
          gap: 4px;
          justify-content: center;
        }

        div[part=days] p {
          height: 40px;
          line-height: 40px;
          min-height: 40px;
          min-width: 40px;
          text-align: center;
          width: 40px;
        }          

        i {
          box-sizing: border-box;
          color: #525252;
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

        input {
          appearance: textfield;
          background: none;
          border: none;
          box-sizing: border-box;
          font-weight: 600;
          height: 40px;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;          
          padding: 0 0 0 4px;
          width: 4em;
          -moz-appearance: textfield;
          -webkit-appearance: textfield;
          -webkit-tap-highlight-color: transparent;
        }

        input:hover {
          background-color: #e8e8e8;
          cursor: pointer;
        }

        input:focus {
          background-color: #e8e8e8;          
          cursor: text;
          outline: solid 2px #0f62fe;          
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
        }

        p[part=month] {
          font-weight: 600;
        }
      </style>
      <div part="controls">
        <button part="left" type="button">
          <i>chevron_left</i>
        </button>
        <div part="date">
          <p part="month"></p>
          <input min="0" part="year" step="1" type="number">
        </div>
        <button part="right" type="button">
          <i>chevron_right</i>
        </button>
      </div>
      <div part="days">
        <p>S</p>
        <p>M</p>
        <p>T</p>
        <p>W</p>
        <p>Th</p>
        <p>F</p>
        <p>S</p>
      </div>
      <div part="calendar"></div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$calendar = this.shadowRoot.querySelector( 'div[part=calendar]' );
    this.$left = this.shadowRoot.querySelector( 'button[part=left]' );
    this.$left.addEventListener( 'click', () => this.doLeftClick() );
    this.$month = this.shadowRoot.querySelector( 'p[part=month]' );
    this.$right = this.shadowRoot.querySelector( 'button[part=right]' );
    this.$right.addEventListener( 'click', () => this.doRightClick() );
    this.$year = this.shadowRoot.querySelector( 'input' );
    this.$year.addEventListener( 'change', () => {
      let displayed = null;

      if( this.display === null ) {
        if( this.value === null ) {
          displayed = new Date();
        } else {
          displayed = this.valueAsDate;
        }
      } else {
        displayed = this.displayAsDate;
      }

      displayed.setFullYear( parseInt( this.$year.value ) );
      this.displayAsDate = displayed;
    } );
  }

  doDateClick( evt ) {
    const selected = new Date(
      parseInt( evt.currentTarget.getAttribute( 'data-year' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-month' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-date' ) )
    );

    this.valueAsDate = selected;

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: {
        display: this.displayAsDate,
        name: this.name,
        value: this.valueAsDate
      } 
    } ) );
  }

  doLeftClick() {
    let displayed = null;

    if( this.display === null ) {
      if( this.value === null ) {
        displayed = new Date();
      } else {
        displayed = this.valueAsDate;
      }
    } else {
      displayed = this.displayAsDate;
    }    

    let month = displayed.getMonth();
    let year = displayed.getFullYear();

    year = ( month === 0 ) ? year - 1 : year;
    month = ( month === 0 ) ? 11 : month - 1;

    this.displayAsDate = new Date(
      year,
      month,
      displayed.getDate()
    );

    this.dispatchEvent( new CustomEvent( 'gr-previous', {
      detail: {
        display: this.displayAsDate,
        name: this.name,
        value: this.valueAsDate
      }
    } ) );
  }

  doRightClick() {
    let displayed = null;

    if( this.display === null ) {
      if( this.value === null ) {
        displayed = new Date();
      } else {
        displayed = this.valueAsDate;
      }
    } else {
      displayed = this.displayAsDate;
    }    

    let month = displayed.getMonth();
    let year = displayed.getFullYear();

    year = ( month === 11 ) ? year + 1 : year;
    month = ( month + 1 ) % 12;

    this.displayAsDate = new Date(
      year,
      month,
      displayed.getDate()
    );

    this.dispatchEvent( new CustomEvent( 'gr-next', {
      detail: {
        display: this.displayAsDate,
        name: this.name,
        value: this.valueAsDate
      }
    } ) );
  }

  // When attributes change
  _render() {
    while( this.$calendar.children.length < 42 ) {
      const date = document.createElement( 'button' );
      date.addEventListener( 'click', ( evt ) => this.doDateClick( evt ) );
      this.$calendar.appendChild( date );
    }

    let displayed = null;
    if( this.display === null ) {
      if( this.value === null ) {
        displayed = new Date();
      } else {
        displayed = this.valueAsDate;
      }
    } else {
      displayed = this.displayAsDate;
    }

    let selected = this.valueAsDate;
    const today = new Date();

    const formatted = new Intl.DateTimeFormat( navigator.language, {
      month: 'long'
    } ).format( displayed );    
    this.$month.innerText = formatted;
    this.$year.value = displayed.getFullYear();

    // Calendar used in iteration
    const calendar = new Date(
      displayed.getFullYear(),
      displayed.getMonth(),
      1
    );

    // First day of month may not be first day of week
    // Roll back until first day of week
    calendar.setDate( calendar.getDate() - calendar.getDay() );

    for( let d = 0; d < 42; d++ ) {
      // Date
      this.$calendar.children[d].innerText = calendar.getDate();
      this.$calendar.children[d].setAttribute( 'data-year', calendar.getFullYear() );
      this.$calendar.children[d].setAttribute( 'data-month', calendar.getMonth() );
      this.$calendar.children[d].setAttribute( 'data-date', calendar.getDate() );

      if(
        calendar.getUTCFullYear() === displayed.getUTCFullYear() &&
        calendar.getUTCMonth() === displayed.getUTCMonth()
      ) {
        this.$calendar.children[d].classList.remove( 'outside' );
      } else {
        this.$calendar.children[d].classList.add( 'outside' );
      }

      // Check for today
      if(
        calendar.getUTCFullYear() === today.getUTCFullYear() &&
        calendar.getUTCMonth() === today.getUTCMonth() &&
        calendar.getUTCDate() === today.getUTCDate()
      ) {
        this.$calendar.children[d].classList.add( 'today' );
      } else {
        this.$calendar.children[d].classList.remove( 'today' );
      }

      // Check for selection
      if( selected === null ) {
        this.$calendar.children[d].classList.remove( 'selected' );
      } else {
        if(
          calendar.getUTCFullYear() === selected.getUTCFullYear() &&
          calendar.getUTCMonth() === selected.getUTCMonth() &&
          calendar.getUTCDate() === selected.getUTCDate() &&
          calendar.getUTCMonth() === selected.getUTCMonth()
        ) {
          this.$calendar.children[d].classList.add( 'selected' );
        } else {
          this.$calendar.children[d].classList.remove( 'selected' );
        }
      }

      // Keep rolling
      calendar.setDate( calendar.getDate() + 1 );
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
    this._upgrade( 'hidden' );
    this._upgrade( 'display' );
    this._upgrade( 'displayAsDate' );
    this._upgrade( 'displayAsTime' );
    this._upgrade( 'name' );
    this._upgrade( 'valueAsDate' );
    this._upgrade( 'valueAsTime' );
    this._upgrade( 'value' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'display',
      'hidden',
      'name',
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
  get displayAsDate() {
    return this.display === null ? null : new Date( this.display );
  }

  set displayAsDate( date ) {
    this.display = date === null ? null : date.toISOString();
  }

  get displayAsTime() {
    return this.display === null ? null : new Date( this.display ).getTime();
  }

  set displayAsTime( time ) {
    this.display = time === null ? null : new Date( time ).toISOString();
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

  get display() {
    if( this.hasAttribute( 'display' ) ) {
      return this.getAttribute( 'display' );
    }

    return null;
  }

  set display( content ) {
    if( content !== null ) {
      this.setAttribute( 'display', content );
    } else {
      this.removeAttribute( 'display' );
    }
  }          

  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( content ) {
    if( content !== null ) {
      this.setAttribute( 'name', content );
    } else {
      this.removeAttribute( 'name' );
    }
  }           

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( content ) {
    if( content !== null ) {
      this.setAttribute( 'value', content );
    } else {
      this.removeAttribute( 'value' );
    }
  }          
}

window.customElements.define( 'gr-calendar', GRCalendar );
