import GRDropdownOption from "./dropdown-option.js";

export default class GRDropdown extends HTMLElement {
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
          background-color: #f4f4f4;
          border: none;
          border-bottom: solid 1px #8d8d8d;          
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          height: 40px;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0 10px 0 16px;
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

        div:not( [part=popover] ) {
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

        i[part=invalid] {
          color: #da1e28;
          font-variation-settings:
            'FILL' 1.0,
            'wght' 700;
          margin: 0;
          min-width: 0;
          opacity: 0;
          overflow: hidden;
          transition:
            margin 300ms ease-out,
            min-width 300ms ease-out,
            opacity 300ms ease-out,
            width 300ms ease-out;              
          width: 0;
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
          padding: 0 16px 0 0;
        }        

        p[part=helper],
        p[part=label] {
          color: #525252;
          cursor: default;
          font-size: 12px;
          line-height: 16px;
        }

        p[part=helper] {
          height: 16px;
        }        

        :host( [invalid] ) button {
          outline: solid 2px #da1e28;
        }

        :host( [invalid] ) button:focus-within {
          outline: solid 2px #0f62fe;
        }

        :host( [invalid] ) i[part=invalid] {
          min-width: 20px;
          opacity: 1.0;
          margin: 0 10px 0 0;
          width: 20px;
        }

        :host( [invalid] ) p[part=helper] {
          color: #da1e28;
        }

        :host( :not( :has( [slot=before] ) ):not( [label] ) ) div[part=before],
        :host( :not( [label] ) ) p[part=label] {
          display: none;
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
          color: #c6c6c6;
          cursor: default;
        }        

        :host( [read-only] ) p[part=placeholder],
        :host( [read-only] ) p[part=value] {
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

        :host( [disabled] ) p[part=placeholder],
        :host( [disabled] ) p[part=value] {
          color: #c6c6c6;
          cursor: not-allowed;
        }

        :host( [disabled] ) p[part=helper],
        :host( [disabled] ) p[part=label] {
          color: #16161640;
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
      <div part="before">
        <p part="label"></p>
        <slot name="before"></slot>
      </div>
      <button part="button" popovertarget="gr-popover" type="button">
        <p part="placeholder"></p>
        <p part="value"></p>        
        <i part="invalid">error</i>  
        <i part="caret">expand_more</i>        
      </button>
      <div part="after">
        <p part="helper"></p>
        <slot name="after"></slot>
      </div>      
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
    this.$helper = this.shadowRoot.querySelector( 'p[part=helper]' );
    this.$label = this.shadowRoot.querySelector( 'p[part=label]' );    
    this.$placeholder = this.shadowRoot.querySelector( 'p[part=placeholder]' );    
    this.$popover = this.shadowRoot.querySelector( 'div[popover]' );
    this.$value = this.shadowRoot.querySelector( 'p[part=value]' );
  }

  doOption( evt ) {
    this.$popover.hidePopover();
    this.$button.focus();

    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( this.toggle ) {
      if( this.selectedIndex === index ) {
        this.selectedIndex = null;
        this.value = null;
      } else {
        this.selectedIndex = index;
        this.value = this._data[this.selectedIndex].value;        
      }
    } else {
      this.selectedIndex = index;
      this.value = this._data[this.selectedIndex].value;      
    }

    for( let c = 0; c < this.$popover.children.length; c++ ) {
      if( this.selectedIndex === null ) {
          this.$popover.children[c].selected = false;
      } else {
        this.$popover.children[c].selected = this.selectedIndex === c ? true : false;
      }
    }

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
    this.$label.textContent = this.label === null ? '' : this.label;
    this.$button.disabled = this.disabled || this.readOnly;
    this.$placeholder.textContent = this.placeholder === null ? '' : this.placeholder;
    this.$helper.textContent = this.helper === null ? '' : this.helper;

    if( this._data.length > 0 ) {
      if( this.selectedIndex !== null ) {
        this.$value.textContent = this.labelFunction === null ? this._data[this.selectedIndex].label : this.labelFunction( this._data[this.selectedIndex] );
      }
    }

    if( this.invalid ) {
      if( this.error === null ) {
        this.$helper.textContent = this.helper === null ? '' : this.helper;    
      } else {
        this.$helper.textContent = this.error === null ? '' : this.error;            
      }
    } else {
      this.$helper.textContent = this.helper === null ? '' : this.helper;          
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
    this._upgrade( 'error' );    
    this._upgrade( 'helper' );    
    this._upgrade( 'hidden' );    
    this._upgrade( 'invalid' );      
    this._upgrade( 'label' );    
    this._upgrade( 'labelFunction' );      
    this._upgrade( 'light' );            
    this._upgrade( 'name' );         
    this._upgrade( 'placeholder' );     
    this._upgrade( 'readOnly' );        
    this._upgrade( 'selectedIndex' );                
    this._upgrade( 'toggle' );                    
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
      'light',
      'name',
      'label',
      'placeholder',
      'read-only',
      'selected-index',
      'toggle',
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

  get toggle() {
    return this.hasAttribute( 'toggle' );
  }

  set toggle( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'toggle' );
      } else {
        this.setAttribute( 'toggle', '' );
      }
    } else {
      this.removeAttribute( 'toggle' );
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
