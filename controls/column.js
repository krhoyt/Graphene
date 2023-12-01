import GraphiteHBox from "../containers/hbox.js";
import GraphiteVBox from "../containers/vbox.js";

import GraphiteIcon from "./icon.js";
import GraphiteLabel from "./label.js";

export default class GraphiteColumn extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          flex-basis: 0;
          flex-grow: 1;
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
          background-color: #e0e0e0;
          border: none;
          box-sizing: border-box;
          cursor: default;
          display: flex;
          flex-direction: row;
          height: 48px;
          margin: 0;
          outline: none;
          padding: 0 16px 0 16px;
          width: 100%;
        }

        gr-icon {
          --icon-color: #161616;
          --icon-cursor: pointer;
        }

        gr-label[part=label] {
          --label-color: #161616;
          --label-font-weight: 700;
        }

        gr-vbox {
          flex-basis: 0;
          flex-grow: 1;
        }

        :host( [sortable] ) button {
          cursor: pointer;
          padding: 0 8px 0 16px;
        }

        :host( [sortable] ) gr-label {        
          --label-cursor: pointer;
        }

        :host( [sortable] ) button:hover {
          background-color: #d1d1d1;
        }

        :host( [sortable] ) button:hover gr-icon {
          display: auto;
        }        

        :host( :not( [sortable] ) ) gr-icon {
          display: none;
        }

        :host( [sortable]:not( [sort-direction] ) ) gr-icon {
          display: none;
        }

        :host( [sortable]:not( [sort-direction] ) ) button:hover gr-icon {
          display: inline-block;
        }

        :host( :not( [header-text] ) ) gr-label[part=label] {
          display: none;
        }

        :host( :not( [helper-text] ) ) gr-label[part=helper] {
          display: none;
        }
      </style>
      <button part="button">
        <gr-vbox>
          <gr-label part="label"></gr-label>
          <gr-label part="helper"></gr-label>          
        </gr-vbox>
        <gr-icon name="swap_vert" weight="300"></gr-icon>
      </button>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => {
      if( this.sortable ) {
        if( this.sortDirection === null ) {
          this.sortDirection = 'desc';
        } else if( this.sortDirection === 'desc' ) {
          this.sortDirection = 'asc';
        } else {
          this.sortDirection = null;
        }
  
        this.dispatchEvent( new CustomEvent( 'gr-sort', {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            column: this,
            sortDirection: this.sortDirection
          }
        } ) );
      }
    } );
    this.$label = this.shadowRoot.querySelector( 'gr-label[part=label]' );
    this.$helper = this.shadowRoot.querySelector( 'gr-label[part=helper]' );
    this.$icon = this.shadowRoot.querySelector( 'gr-icon' );
  }

  // When attributes change
  _render() {
    this.$label.text = this.headerText;
    this.$helper.text = this.helperText;

    if( this.sortable ) {
      if( this.sortDirection === null ) {
        this.$icon.name = 'swap_vert';
      } else if( this.sortDirection === 'desc' ) {
        this.$icon.name = 'south';
      } else if( this.sortDirection === 'asc' ) {
        this.$icon.name = 'north';
      }
    } else {
      this.$icon.name = 'swap_vert';
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
    this._upgrade( 'headerText' );
    this._upgrade( 'helperText' );
    this._upgrade( 'hidden' );
    this._upgrade( 'sortable' );    
    this._upgrade( 'sortDirection' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'header-text',
      'helper-text',
      'hidden',
      'sortable',
      'sort-direction'
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

  get headerText() {
    if( this.hasAttribute( 'header-text' ) ) {
      return this.getAttribute( 'header-text' );
    }

    return null;
  }

  set headerText( value ) {
    if( value !== null ) {
      this.setAttribute( 'header-text', value );
    } else {
      this.removeAttribute( 'header-text' );
    }
  }

  get helperText() {
    if( this.hasAttribute( 'helper-text' ) ) {
      return this.getAttribute( 'helper-text' );
    }

    return null;
  }

  set helperText( value ) {
    if( value !== null ) {
      this.setAttribute( 'helper-text', value );
    } else {
      this.removeAttribute( 'helper-text' );
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

  get sortable() {
    return this.hasAttribute( 'sortable' );
  }

  set sortable( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'sortable' );
      } else {
        this.setAttribute( 'sortable', '' );
      }
    } else {
      this.removeAttribute( 'sortable' );
    }
  }  

  get sortDirection() {
    if( this.hasAttribute( 'sort-direction' ) ) {
      return this.getAttribute( 'sort-direction' );
    }

    return null;
  }

  set sortDirection( value ) {
    if( value !== null ) {
      this.setAttribute( 'sort-direction', value );
    } else {
      this.removeAttribute( 'sort-direction' );
    }
  }  
}

window.customElements.define( 'gr-column', GraphiteColumn );
