import GrapheneIcon from "./icon.js";
import GrapheneLabel from "./label.js";

export default class GrapheneCheckbox extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
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
          flex-direction: row;
          gap: 4px;
          margin: 0;
          outline: none;
          padding: 0;
          width: 100%;
        }

        gr-icon { 
          --icon-cursor: pointer; 
          --icon-size: 22px;
        }

        gr-label { --label-cursor: pointer; }

        :host( :not( [label] ) ) gr-label {
          display: none;
        }

        :host( [disabled] ) button,
        :host( [disabled] ) gr-icon,        
        :host( [disabled] ) gr-label {
          cursor: default;
        }
      </style>
      <button part="button" type="button">
        <gr-icon name="check_box_outline_blank" part="icon" weight="200"></gr-icon>
        <gr-label part="label"></gr-label>
      </button>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => {
      if( !this.disabled )
        this.checked = !this.checked;

        this.dispatchEvent( new CustomEvent( 'gr-change', {
          detail: {
            checked: this.checked,
            name: this.name,
            value: this.value
          }
        } ) )
    } );
    this.$icon = this.shadowRoot.querySelector( 'gr-icon' );
    this.$label = this.shadowRoot.querySelector( 'gr-label' );
  }

   // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
    this.$icon.name = this.checked ? 'check_box' : 'check_box_outline_blank';
    this.$icon.filled = this.checked;
    this.$icon.weight = this.checked ? 400 : 200;
    this.$label.text = this.label;
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
    this._upgrade( 'checked' );            
    this._upgrade( 'disabled' );               
    this._upgrade( 'hidden' );    
    this._upgrade( 'label' );    
    this._upgrade( 'name' );        
    this._upgrade( 'value' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'checked',      
      'disabled',
      'hidden',
      'label',
      'name',
      'value'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get checked() {
    return this.hasAttribute( 'checked' );
  }

  set checked( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'checked' );
      } else {
        this.setAttribute( 'checked', '' );
      }
    } else {
      this.removeAttribute( 'checked' );
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

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( content ) {
    if( value !== null ) {
      this.setAttribute( 'value', content );
    } else {
      this.removeAttribute( 'lavaluebel' );
    }
  }        
}

window.customElements.define( 'gr-checkbox', GrapheneCheckbox );
