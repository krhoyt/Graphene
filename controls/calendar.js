import GrapheneHBox from "../containers/hbox.js";

import GrapheneIcon from "./icon.js";
import GrapheneLabel from "./label.js";

export default class GrapheneCalendar extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #ffffff;
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
          padding: 4px 4px 8px 4px;
          position: relative;
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

        button[part=left] gr-icon,
        button[part=right] gr-icon {
          --icon-color: #525252;
          --icon-cursor: pointer;
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

        button:not( .selected ):hover {
          background-color: #e8e8e8;
        }        

        gr-hbox > gr-hbox {
          align-items: center;
          flex-basis: 0;
          flex-grow: 1;
          gap: 4px;
          justify-content: center;
        }

        gr-hbox[part=days] gr-label::part( label ) {
          height: 40px;
          line-height: 40px;
          min-height: 40px;
          min-width: 40px;
          text-align: center;
          width: 40px;
        }          

        gr-label[part=month] {
          --label-font-weight: 600;
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

        .today {
          color: var( --calendar-today-color, #0f62fe );
          font-weight: 600;
        }

        .today::after {
          background-color: var( --calendar-today-color, #0f62fe );
          bottom: 6px;
          content: ' ';
          height: 4px;
          position: absolute;
          left: calc( 50% - 2px );
          width: 4px;
        }

        .selected.today {
          background-color: var( --calendar-selected-color, #0f62fe );
          color: #ffffff;
          font-weight: 600;
        }

        .selected.today::after {
          background-color: #ffffff;
        }        

        .outside {
          color: var( --calendar-outside-color, #6f6f6f );
        }

        .selected {
          background-color: var( --calendar-selected-color, #0f62fe );
          color: #ffffff;
        }
      </style>
      <gr-hbox>
        <button part="left">
          <gr-icon name="chevron_left"></gr-icon>
        </button>
        <gr-hbox>
          <gr-label part="month"></gr-label>
          <input min="0" part="year" step="1" type="number">
        </gr-hbox>
        <button part="right">
          <gr-icon name="chevron_right"></gr-icon>
        </button>
      </gr-hbox>
      <gr-hbox part="days">
        <gr-label text="S"></gr-label>
        <gr-label text="M"></gr-label>
        <gr-label text="T"></gr-label>
        <gr-label text="W"></gr-label>
        <gr-label text="Th"></gr-label>
        <gr-label text="F"></gr-label>
        <gr-label text="S"></gr-label>
      </gr-hbox>
      <div part="calendar"></div>
    `;

    // Private
    this._displayed = null;
    this._value = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$calendar = this.shadowRoot.querySelector( 'div[part=calendar]' );
    this.$left = this.shadowRoot.querySelector( 'button[part=left]' );
    this.$left.addEventListener( 'click', () => this.doLeftClick() );
    this.$month = this.shadowRoot.querySelector( 'gr-label[part=month]' );
    this.$right = this.shadowRoot.querySelector( 'button[part=right]' );
    this.$right.addEventListener( 'click', () => this.doRightClick() );
    this.$year = this.shadowRoot.querySelector( 'input' );
    this.$year.addEventListener( 'change', () => {
      const displayed = this._displayed === null ? new Date() : new Date( this._displayed );
      displayed.setFullYear( this.$year.value );
      this._displayed = new Date( displayed.getTime() );
      this._render();
    } );
  }

  doDateClick( evt ) {
    const selected = new Date(
      parseInt( evt.currentTarget.getAttribute( 'data-year' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-month' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-date' ) )
    );

    this.value = selected;
    this.dispatchEvent( new CustomEvent( 'change', {
      detail: new Date( selected.getTime() )
    } ) );
  }

  doLeftClick() {
    const displayed = this._displayed === null ? new Date() : new Date( this._displayed.getTime() );

    let month = displayed.getMonth();
    let year = displayed.getFullYear();

    year = ( month === 0 ) ? year - 1 : year;
    month = ( month === 0 ) ? 11 : month - 1;

    this._displayed = new Date(
      year,
      month,
      displayed.getDate()
    );
    this._render();

    this.dispatchEvent( new CustomEvent( 'previous', {
      detail: new Date( displayed.getTime() )
    } ) );
  }

  doRightClick() {
    const displayed = this._displayed === null ? new Date() : new Date( this._displayed.getTime() );

    let month = displayed.getMonth();
    let year = displayed.getFullYear();

    year = ( month === 11 ) ? year + 1 : year;
    month = ( month + 1 ) % 12;

    this._displayed = new Date(
      year,
      month,
      displayed.getDate()
    );
    this._render();

    this.dispatchEvent( new CustomEvent( 'next', {
      detail: new Date( displayed.getTime() )
    } ) );
  }

  // When attributes change
  _render() {
    while( this.$calendar.children.length < 42 ) {
      const date = document.createElement( 'button' );
      date.addEventListener( 'click', ( evt ) => this.doDateClick( evt ) );
      this.$calendar.appendChild( date );
    }

    const displayed = this._displayed === null ? new Date() : new Date( this._displayed.getTime() );
    const selected = this._value === null ? null : new Date( this._value.getTime() );
    const today = new Date();

    const formatted = new Intl.DateTimeFormat( navigator.language, {
      month: 'long'
    } ).format( displayed );    
    this.$month.text = formatted;
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
        calendar.getFullYear() === displayed.getFullYear() &&
        calendar.getMonth() === displayed.getMonth()
      ) {
        this.$calendar.children[d].classList.remove( 'outside' );
      } else {
        this.$calendar.children[d].classList.add( 'outside' );
      }

      // Check for today
      if(
        calendar.getFullYear() === today.getFullYear() &&
        calendar.getMonth() === today.getMonth() &&
        calendar.getDate() === today.getDate()
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
          calendar.getFullYear() === selected.getFullYear() &&
          calendar.getMonth() === selected.getMonth() &&
          calendar.getDate() === selected.getDate() &&
          calendar.getMonth() === selected.getMonth()
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
    this._upgrade( 'hidden' );
    this._upgrade( 'value' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden'
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
  get displayed() {
    return this._displayed;
  }

  set displayed( date ) {
    this._displayed = date === null ? null : new Date( date.getTime() );
    this._render();
  }

  get value() {
    return this._value;
  }

  set value( date ) {
    this._displayed = date === null ? null : new Date( date.getTime() );
    this._value = date === null ? null : new Date( date.getTime() );
    this._render();
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
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
}

window.customElements.define( 'gr-calendar', GrapheneCalendar );
