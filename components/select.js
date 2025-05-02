export default class GRSelect extends HTMLElement {
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

        div:not( [part=options] ) {
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

        div[part=options] {
          display: none;
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
          pointer-events: none;
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

        label {
          align-items: center;
          background-color: #f4f4f4;          
          border-bottom: solid 1px #8d8d8d;          
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          height: 40px;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0 10px 0 16px;
          position: relative;
          transition: background-color 150ms ease-in-out;          
        }        

        label:hover {
          background-color: #e8e8e8;
        }

        label:focus-within {
          outline: solid 2px #0f62fe;          
        }        

        p {
          color: #525252;
          cursor: default;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          margin: 0;
          padding: 0;
        }

        p[part=value] {
          color: #161616;
          font-size: 14px;
          line-height: 20px;
        }

        select {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box; 
          cursor: pointer;
          height: 39px;
          left: 0;
          margin: 0;
          opacity: 0;
          padding: 0;
          position: absolute;
          right: 0;
          top: 0;
          -webkit-tap-highlight-color: transparent;                    
        }

        p[part=value].placeholder {
          color: #a8a8a8;
        }    
        
        :host( [invalid] ) label {
          outline: solid 2px #da1e28;
        }

        :host( [invalid] ) label:focus-within {
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

        :host( [read-only] ) label {
          border-bottom: solid 1px transparent;
        }

        :host( [read-only] ) label:hover {
          background-color: #f4f4f4;
        }

        :host( [read-only] ) label i {
          color: #a8a8a8;
        }        

        :host( [read-only] ) select {
          cursor: default;
        }

        :host( [disabled] ) label {
          border-bottom: solid 1px transparent;
          cursor: not-allowed;
        }

        :host( [disabled] ) label:hover {
          background-color: #f4f4f4;
        }

        :host( [disabled][light] ) label:hover {
          background-color: #ffffff;
        }        

        :host( [disabled] ) label i {
          color: #c6c6c6;          
        }

        :host( [disabled] ) select {
          color: #c6c6c6;
          cursor: not-allowed;
        }

        :host( [disabled] ) p {
          color: #16161640;
        }        

        :host( [light] ) label {
          background-color: #ffffff;
        }        
      </style>
      <div part="before">
        <p part="label"></p>
        <slot name="before"></slot>
      </div>
      <label>
        <p part="value"></p>
        <i part="invalid">error</i>
        <i>expand_more</i>
        <select></select>        
      </label>
      <div part="after">
        <p part="helper"></p>
        <slot name="after"></slot>
      </div>      
      <div part="options">
        <slot></slot>
      </div>
    `;

    // Private
    this._data = null;
    this._label = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$helper = this.shadowRoot.querySelector( 'p[part=helper]' );
    this.$label = this.shadowRoot.querySelector( 'p[part=label]' );    
    this.$options = this.shadowRoot.querySelector( 'slot:not( [name] )' );
    this.$options.addEventListener( 'slotchange', () => {
      while( this.$select.children.length > 0 ) {
        this.$select.children[0].remove();
      }

      this.build( this.children );

      if( this.$select.selectedIndex === 0 && 
          this.$select.children[0].selected && 
          this.$select.children[0].disabled ) {
        this.$select.classList.add( 'placeholder' );
      } else {
        this.$select.classList.remove( 'placeholder' );
      }
    } );
    this.$select = this.shadowRoot.querySelector( 'select' );
    this.$select.addEventListener( 'change', () => {
      this.value = this.$select.selectedOptions[0].text;
      this.selectedIndex = this.$select.selectedIndex;

      this.dispatchEvent( new CustomEvent( 'gr-change', {
        detail: {
          selectedIndex: this.selectedIndex,
          value: this.value
        }
      } ) );
    } );
    this.$value = this.shadowRoot.querySelector( 'p[part=value]' );
  }

  blur() {
    this.$select.blur();
  }

  build( items ) {
    const defaulted = document.createElement( 'option' );
    defaulted.value = null;
    defaulted.text = this.placeholder === null ? '' : this.placeholder;    
    defaulted.disabled = true;
    defaulted.selected = true;
    this.$select.appendChild( defaulted );

    for( let i = 0; i < items.length; i++ ) {
      const option = document.createElement( items[i].tagName );
      
      for( let a = 0; a < items[i].attributes.length; a++ ) {
        option.setAttribute( items[i].attributes[a].name, items[i][items[i].attributes[a].name] );
        option.innerText = this.labelFunction === null ? items[i].innerText : this.labelFunction( items[i] );
        this.$select.appendChild( option );
      }
    }
  }

  focus() {
    this.$select.focus();
  }

   // When attributes change
  _render() {
    if( this.disabled ) {
      this.$select.disabled = true;
    } else {
      this.$select.disabled = this.readOnly;
    }

    this.$select.multiple = this.multiple;

    this.$label.textContent = this.label === null ? '' : this.label;
    this.$helper.textContent = this.helper === null ? '' : this.helper;

    if( this.$select.selectedIndex === -1 ) {
      this.$value.classList.add( 'placeholder' );      
      this.$value.textContent = this.placeholder === null ? '' : this.placeholder;
    } else {
      this.$value.classList.remove( 'placeholder' );      
      this.$value.textContent = this.value === null ? '' : this.value;
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
    this._upgrade( 'multiple' );                
    this._upgrade( 'name' );            
    this._upgrade( 'placeholder' );                
    this._upgrade( 'readOnly' );    
    this._upgrade( 'selectedIndex' );   
    this._upgrade( 'selectedOptions' );       
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
      'multiple',
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
  // Array, Date, Function, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  get labelFunction() {
    return this._label;
  }

  set labelFunction( named ) {
    this._label = named;
  }

  get selectedIndex() {
    return this.$select.selectedIndex;
  }

  set selectedIndex( index ) {
    this.$select.selectedIndex = index === null ? -1 : index;
  }

  get selectedOptions() {
    return this.$select.selectedOptions;
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

  get multiple() {
    return this.hasAttribute( 'multiple' );
  }

  set multiple( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'multiple' );
      } else {
        this.setAttribute( 'multiple', '' );
      }
    } else {
      this.removeAttribute( 'multiple' );
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

window.customElements.define( 'gr-select', GRSelect );
