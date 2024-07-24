export default class GRTableColumn extends HTMLElement {
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

        i {
          display: none;
          color: #161616;
          direction: ltr;
          display: inline-block;
          font-family: 'Material Symbols Outlined';
          font-size: 20px;
          font-style: normal;
          font-variation-settings: 'wght' 300;
          font-weight: normal;
          letter-spacing: normal;
          line-height: 1;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: 20px;
          word-wrap: normal;          
        }

        button {
          align-items: center;
          background: none;
          background-color: #e0e0e0;
          border: none;
          box-sizing: border-box;
          cursor: default;
          display: flex;
          flex-direction: row;
          height: 48px;
          margin: 0;
          min-width: 100px;
          overflow: hidden;
          padding: 0 16px 0 16px;
          text-align: left;
          width: 100%;
          -webkit-tap-highlight-color: transparent;          
        }

        div {
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
        }

        p[part=helper] {
          display: none;
          color: #525252;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        p[part=label] {
          color: #161616;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;          
        }

        :host( [helper-text] ) p[part=helper] {
          display: block;
        }

        :host( [sortable] ) i {
          display: inline-block;
        }

        :host( [sortable] ) button {
          cursor: pointer;
        }        

        :host( [sortable] ) button:focus {
          outline: solid 2px #0f62fe;
          outline-offset: -2px;
        }

        :host( [sortable] ) button:hover {
          background-color: #d1d1d1;
        }        

        :host( [sortable]:not( [sort-direction] ) ) i {
          display: none;
        }

        :host( [sortable][sort-direction] ) button {
          background-color: #d1d1d1;
        }

        :host( [sortable]:not( [sort-direction] ):hover ) gr-icon {
          display: inline-block;
        }
      </style>
      <button part="button">
        <div>
          <p part="label"></p>
          <p part="helper"></p>
        </div>
        <i part="icon"></i>
      </button>
    `;

    // Private
    this._data = null;
    this._label = null;
    this._sort = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'click', () => this.doButtonClick() );
    this.$label = this.shadowRoot.querySelector( 'p[part=label]' );
    this.$helper = this.shadowRoot.querySelector( 'p[part=helper]' );
    this.$icon = this.shadowRoot.querySelector( 'i' );
  }

  doButtonClick() {
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
  }

   // When attributes change
  _render() {
    this.style.flexBasis = this.width === null ? '0' : '';
    this.style.flexGrow = this.width === null ? '1' : '';
    this.style.minWidth = this.width === null ? '' : `${this.width}px`;
    this.style.maxWidth = this.width === null ? '' : `${this.width}px`;

    this.$label.innerText = this.headerText === null ? '' : this.headerText;
    this.$helper.innerText = this.helperText === null ? '' : this.helperText;

    if( this.sortable ) {
      if( this.sortDirection === null ) {
        this.$icon.name = 'height';
      } else if( this.sortDirection === 'desc' ) {
        this.$icon.name = 'south';
      } else if( this.sortDirection === 'asc' ) {
        this.$icon.name = 'north';
      }
    } else {
      this.$icon.name = null;
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
    this._upgrade( 'grow' );
    this._upgrade( 'headerText' );
    this._upgrade( 'helperText' );
    this._upgrade( 'hidden' );
    this._upgrade( 'itemRenderer' );
    this._upgrade( 'labelField' );
    this._upgrade( 'labelFunction' );
    this._upgrade( 'sortable' );
    this._upgrade( 'sortCompareFunction' );
    this._upgrade( 'sortDirection' );
    this._upgrade( 'width' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'grow',
      'header-text',
      'helper-text',
      'hidden',
      'item-renderer',
      'label-field',
      'sortable',
      'sort-direction',
      'width'
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
  get labelFunction() {
    return this._label;
  }

  set labelFunction( value ) {
    this._label = value;
  }

  get sortCompareFunction() {
    return this._sort;
  }

  set sortCompareFunction( value ) {
    this._sort = value;
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

  get grow() {
    if( this.hasAttribute( 'grow' ) ) {
      return parseInt( this.getAttribute( 'grow' ) );
    }

    return null;
  }

  set grow( value ) {
    if( value !== null ) {
      this.setAttribute( 'grow', value );
    } else {
      this.removeAttribute( 'grow' );
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

  get itemRenderer() {
    if( this.hasAttribute( 'item-renderer' ) ) {
      return this.getAttribute( 'item-renderer' );
    }

    return null;
  }

  set itemRenderer( value ) {
    if( value !== null ) {
      this.setAttribute( 'item-renderer', value );
    } else {
      this.removeAttribute( 'item-renderer' );
    }
  }

  get labelField() {
    if( this.hasAttribute( 'label-field' ) ) {
      return this.getAttribute( 'label-field' );
    }

    return null;
  }

  set labelField( value ) {
    if( value !== null ) {
      this.setAttribute( 'label-field', value );
    } else {
      this.removeAttribute( 'label-field' );
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

  get width() {
    if( this.hasAttribute( 'width' ) ) {
      return parseInt( this.getAttribute( 'width' ) );
    }

    return null;
  }

  set width( value ) {
    if( value !== null ) {
      this.setAttribute( 'width', value );
    } else {
      this.removeAttribute( 'width' );
    }
  }
}

window.customElements.define( 'gr-table-column', GRTableColumn );
