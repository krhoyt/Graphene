import GraphiteHBox from "../containers/hbox.js";
import GraphiteVBox from "../containers/vbox.js";

import GraphiteColumn from "./column.js";
// import GraphiteLabelItemRenderer from "./label-item-renderer.js";

export default class GraphiteTable extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #f4f4f4;
          box-sizing: border-box;
          display: block;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        :host( [light] ) {
          background-color: #ffffff;
        }

        gr-hbox[part=columns] {
          background-color: #e0e0e0;
        }

        gr-hbox[part=columns] button {
          align-items: center;
          background: none;
          background-color: #e0e0e0;
          border: none;
          cursor: pointer;
          display: flex;
          height: 48px;
          justify-content: flex-end;
          margin: 0;
          outline: none;
          padding: 0;
          width: 40px;
        }

        gr-hbox[part=columns] button gr-icon {        
          --icon-cursor: pointer;
        }

        gr-vbox[part=empty] {
          align-items: center;
          flex-basis: 0;
          flex-grow: 1;
          justify-content: center;
        }

        :host( :not( [selectable] ) ) gr-hbox[part=columns] button {
          display: none;
        }

        :host( :not( [selectable][multiple] ) ) gr-hbox[part=columns] button {
          visibility: hidden;
        }

        :host( [selectable][multiple] ) gr-hbox[part=columns] button {
          visibility: visible;
        }
      </style>
      <gr-hbox part="columns">
        <button>
          <gr-icon name="check_box_outline_blank" weight="200"></gr-icon>
        </button>
        <slot></slot>
      </gr-hbox>
      <gr-vbox part="list"></gr-vbox>
      <gr-vbox part="empty">
        <slot name="empty"></slot>
      </gr-vbox>
    `;

    // Private
    this._provider = [];

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$columns = this.shadowRoot.querySelector( 'gr-hbox[part=columns]' );    
    this.$empty = this.shadowRoot.querySelector( 'gr-vbox[part=empty]' );
    this.$list = this.shadowRoot.querySelector( 'gr-vbox[part=list]' );
    this.$select = this.shadowRoot.querySelector( 'gr-hbox[part=columns] button' );    
  }

  // When attributes change
  _render() {
    this.$empty.hidden = this._provider.length === 0 ? false : true;
    this.$columns.hidden = this._provider.length === 0 ? true : false;
    this.$list.hidden = this._provider.length === 0 ? true : false;
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
    this._upgrade( 'light' );   
    this._upgrade( 'multiple' );     
    this._upgrade( 'provider' );
    this._upgrade( 'selectable' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'light',
      'multiple',
      'selectable'
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
  get provider() {
    return this._provider.length === 0 ? null : this._provider;
  }

  set provider( value ) {
    this._provider = value === null ? [] : [... value];
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

  get selectable() {
    return this.hasAttribute( 'selectable' );
  }

  set selectable( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selectable' );
      } else {
        this.setAttribute( 'selectable', '' );
      }
    } else {
      this.removeAttribute( 'selectable' );
    }
  }  
}

window.customElements.define( 'gr-table', GraphiteTable );
