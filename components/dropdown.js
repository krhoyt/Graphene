import GRDropdownOption from "./dropdown-option.js";

export default class GRDropdown extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
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
          background-color: #f4f4f4;
          border: none;
          border-bottom: solid 1px #8d8d8d;          
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          gap: 16px;
          height: 40px;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0 14px 0 16px;
          text-rendering: optimizeLegibility;
          transition: background-color 150ms ease-in-out;    
          width: 100%;      
        }

        button:hover {
          background-color: #e8e8e8;
        }

        button:focus {
          outline: solid 2px #0f62fe;
        }        

        div[part=popover] {
          align-items: flex-start;
          background-color: #f4f4f4;
          border: none;
          box-shadow: 0 2px 6px #0000004d;                      
          display: auto;
          margin: 0;
          padding: 0;
          position: absolute;
        }        

        div[part=popover] gr-dropdown-option:last-of-type::part( label ) {
          border-bottom: solid 1px transparent;
        }

        i {
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
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

        p {
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          flex-basis: 0;
          flex-grow: 1;
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

        p[part=placeholder] {
          color: #a8a8a8;
        }        

        :host( [light] ) button {
          background-color: #ffffff;
        }

        :host( [read-only] ) button {
          border-bottom: solid 1px transparent;
          cursor: default;
        }

        :host( [read-only] ) button:hover {        
          background-color: #f4f4f4;
        }

        :host( [read-only] ) i {
          color: #a8a8a8;
          cursor: default;
        }        

        :host( [read-only] ) p {
          cursor: default;
        }

        :host( [disabled] ) button {
          border-bottom: solid 1px transparent;
          cursor: not-allowed;
        }        

        :host( [disabled] ) button:hover {
          background-color: #f4f4f4;
        }

        :host( [disabled][light] ) button:hover {
          background-color: #ffffff;
        }

        :host( [disabled] ) p {
          color: #c6c6c6;
          cursor: not-allowed;
        }

        :host( [disabled] ) i[part=caret] {
          color: #c6c6c6;
          cursor: not-allowed;
        }

        :host( :not( [value] ) ) p[part=value] {
          display: none;
        }

        :host( [value] ) p[part=placeholder] {
          display: none;
        }        
      </style>
      <button part="button" popovertarget="gr-popover" type="button">
        <p part="placeholder"></p>
        <p part="value"></p>          
        <i part="caret">expand_more</i>        
      </button>
      <div id="gr-popover" part="popover" popover></div>
    `;

    // Private
    this._data = [];
    this._label = null;

    // Events
    this.doOption = this.doOption.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => this._position( this.$button ) );
    this.$placeholder = this.shadowRoot.querySelector( 'p[part=placeholder]' );    
    this.$popover = this.shadowRoot.querySelector( 'div[popover]' );
    this.$value = this.shadowRoot.querySelector( 'p[part=value]' );
  }

  doOption( evt ) {
    this.$popover.hidePopover();
    this.$button.focus();

    this.selectedIndex = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );
    this.value = this._data[this.selectedIndex].value;

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: {
        selectedIndex: this.selectedIndex,
        value: this.value
      }
    } ) );    
  }

  _position( target ) {
    const bounds = target.getBoundingClientRect();

    if( ( bounds.top + bounds.height + target.clientHeight + window.scrollY ) > window.innerHeight ) {
      this.$popover.style.top = `${bounds.top - target.clientHeight + window.scrollY}px`;
    } else {
      this.$popover.style.top = `${bounds.top + bounds.height + window.scrollY}px`;  
    }

    this.$popover.style.left = `${bounds.x + window.scrollX}px`;
    this.$popover.style.width = `${bounds.width}px`;
  }  

  // When things change
  _render() {
    this.$button.disabled = this.disabled || this.readOnly;
    this.$placeholder.innerText = this.placeholder === null ? '' : this.placeholder;

    if( this._data.length > 0 ) {
      if( this.selectedIndex !== null ) {
        this.$value.innerText = this.labelFunction === null ? this._data[this.selectedIndex].label : this.labelFunction( this._data[this.selectedIndex] );
      }
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
    this._upgrade( 'hidden' );    
    this._upgrade( 'invalid' );      
    this._upgrade( 'labelFunction' );      
    this._upgrade( 'light' );            
    this._upgrade( 'name' );         
    this._upgrade( 'placeholder' );     
    this._upgrade( 'readOnly' );        
    this._upgrade( 'selectedIndex' );                
    this._upgrade( 'value' );                
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
      'selected-index',
      'value'
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

  set data( options ) {
    this._data = options === null ? [] : [... options];

    while( this.$popover.children.length > this._data.length ) {
      this.$popover.children[0].removeEventListener( 'click', this.doOption );
      this.$popover.children[0].remove();
    }

    while( this.$popover.children.length < this._data.length ) {
      const element = document.createElement( 'gr-dropdown-option' );
      element.addEventListener( 'click', this.doOption );
      this.$popover.appendChild( element );
    }

    for( let d = 0; d < this._data.length; d++ ) {
      this.$popover.children[d].label = this.labelFunction === null ? this._data[d].label : this.labelFunction( this._data[d] );
      this.$popover.children[d].value = this._data[d].value;
      // this.$popover.children[d].option = this._data[d];
      this.$popover.children[d].setAttribute( 'data-index', d ); 
    }
  }    

  get labelFunction() {
    return this._label;
  }

  set labelFunction( named ) {
    this._label = named;
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

  get selectedIndex() {
    if( this.hasAttribute( 'selected-index' ) ) {
      return parseInt( this.getAttribute( 'selected-index' ) );
    }

    return null;
  }

  set selectedIndex( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-index', value );
    } else {
      this.removeAttribute( 'selected-index' );
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

window.customElements.define( 'gr-dropdown', GRDropdown );
