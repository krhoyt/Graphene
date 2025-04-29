export default class GRContentSwitcher extends HTMLElement {
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

        div {
          align-items: center;
          border: solid 1px #161616;
          border-radius: 4px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          height: 40px;
        }

        :host( [size=sm] ) div {
          height: 32px;
        }

        :host( [size=lg] ) div {
          height: 48px;
        }

        :host( [disabled] ) div {
          border-color: #e8e8e8;
        }
      </style>
      <div part="switcher">
        <slot></slot>      
      </div>
    `;

    // Private
    this._data = null;    

    // Events
    this.doSwitchClick = this.doSwitchClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$slot = this.shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', () => {
      for( let c = 0; c < this.children.length; c++ ) {
        this.children[c].removeEventListener( 'click', this.doSwitchClick );
        this.children[c].addEventListener( 'click', this.doSwitchClick );        
        this.children[c].setAttribute( 'data-index', c );
      }
    } );
  }

  doSwitchClick( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );
    this.selectedIndex = index;

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: {
        index: this.selectedIndex,
        name: evt.currentTarget.name,
        text: evt.currentTarget.text === null ? evt.currentTarget.textContent : evt.currentTarget.text
      }
    } ) );
  }

  // When attributes change
  _render() {
    const index = this.selectedIndex === null ? 0 : this.selectedIndex;
    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].selected = c === index ? true : false;
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
    this._upgrade( 'hidden' );   
    this._upgrade( 'light' );   
    this._upgrade( 'selectedIndex' );   
    this._upgrade( 'size' );   
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'light',
      'selected-index',
      'size'
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
  
  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( content ) {
    if( content !== null ) {
      this.setAttribute( 'size', content );
    } else {
      this.removeAttribute( 'size' );
    }
  }        
}

window.customElements.define( 'gr-content-switcher', GRContentSwitcher );
