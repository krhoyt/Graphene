import GRRadioButton from "./radio-button.js";

export default class GRRadioGroup extends HTMLElement {
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

        ul {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          gap: 16px;
          height: 40px;
          list-style-type: none;
          margin: 0;
          min-height: 40px;
          padding: 0;
        }

        :host( [direction=column] ) ul,
        :host( [direction=vertical] ) ul {
          align-items: flex-start;
          flex-direction: column;
          height: auto;
          gap: 8px;
          min-height: auto;       
          padding: 9px 0 0 0;   
        }

        :host( [direction=row] ) ul,
        :host( [direction=horizontal] ) ul {
          flex-direction: row;
        }
      </style>
      <ul part="group">
        <slot></slot>
      </ul>
    `;

    // Events
    this.doRadioChange = this.doRadioChange.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$slot = this.shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', () => {
      for( let c = 0; c < this.children.length; c++ ) {
        this.children[c].removeEventListener( 'gr-change', this.doRadioChange );
        this.children[c].addEventListener( 'gr-change', this.doRadioChange );
      }
    } );
  }

  doRadioChange( evt ) {
    if( this.toggle ) {
      if( this.value === evt.detail.value ) {
        this.value = null;
      } else {
        this.value = evt.detail.value;
      }
    } else {
      this.value = evt.detail.value;
    }

    for( let c = 0; c < this.children.length; c++ ) {
      if( this.toggle ) {
        if( this.value === null ) {
          this.children[c].checked = false;
        } else {
          this.children[c].checked = evt.currentTarget === this.children[c] ? true : false;          
        }
      } else {
        this.children[c].checked = evt.currentTarget === this.children[c] ? true : false;
      }
    }

    this.dispatchEvent( new CustomEvent( 'rf-change', {
      detail: {
        name: this.name,
        value: this.value
      }
    } ) );
  }

   // When attributes change
  _render() {;}

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
    this._upgrade( 'direction' );             
    this._upgrade( 'hidden' );    
    this._upgrade( 'name' );        
    this._upgrade( 'toggle' );            
    this._upgrade( 'value' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'direction',
      'hidden',
      'name',
      'toggle',
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

  get direction() {
    if( this.hasAttribute( 'direction' ) ) {
      return this.getAttribute( 'direction' );
    }

    return null;
  }

  set direction( value ) {
    if( value !== null ) {
      this.setAttribute( 'direction', value );
    } else {
      this.removeAttribute( 'direction' );
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

window.customElements.define( 'gr-radio-group', GRRadioGroup );
