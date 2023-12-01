export default class GrapheneDrawer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #262626;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          padding: 16px 0 16px 0;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }
      </style>
      <slot></slot>
    `;

    // Private
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Events
    this.doItemClick = this.doItemClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$slot = this.shadowRoot.querySelector( 'slot' );
    this.$slot.addEventListener( 'slotchange', () => {
      var index = 0;

      for( let c = 0; c < this.children.length; c++ ) {
        if( this.children[c].tagName === 'ADC-DRAWER-ITEM' ) {
          this.children[c].setAttribute( 'data-index', index );
          this.children[c].removeEventListener( this._touch, this.doItemClick );
          this.children[c].addEventListener( this._touch, this.doItemClick );
          index = index + 1;
        }        
      }
    } );
  }

  doItemClick( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( this.selectedIndex === index ) return;

    this.dispatchEvent( new CustomEvent( 'change', {
      detail: {
        selectedIndex: index,
        previousIndex: this.selectedIndex === null ? 0 : this.selectedIndex
      }
    } ) );

    this.selectedIndex = index;
  }

   // When attributes change
  _render() {
    const selected = this.selectedIndex === null ? 0 : this.selectedIndex;
    var index = 0;

    for( let c = 0; c < this.children.length; c++ ) {
      if( this.children[c].tagName === 'ADC-DRAWER-ITEM' ) {
        this.children[c].selected = selected === index ? true : false;
        index = index + 1;
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
    this._upgrade( 'hidden' );    
    this._upgrade( 'opened' );        
    this._upgrade( 'selectedIndex' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'opened',
      'selected-index'
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

  get opened() {
    return this.hasAttribute( 'opened' );
  }

  set opened( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'opened' );
      } else {
        this.setAttribute( 'opened', '' );
      }
    } else {
      this.removeAttribute( 'opened' );
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
}

window.customElements.define( 'gr-drawer', GrapheneDrawer );
