import GRCheckbox from "./checkbox.js";
import GRLabelItemRenderer from "./label-item-renderer.js";
import GRRadioButton from "./radio-button.js";
import GRTableColumn from "./table-column.js";

export default class GRTable extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
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

        div[part=empty] {
          align-items: center;
          background-color: #f4f4f4;
          display: flex;
          flex-basis: 0;
          flex-direction: column; 
          flex-grow: 1;
          gap: 16px;
          justify-content: center;
        }

        div[part=list] {
          background-color: #f4f4f4;          
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
          /* overflow: scroll; */
        }

        :host( [light] ) div[part=list] {
          background-color: #ffffff;
        }        

        div[part=list] div {
          align-items: center;
          box-sizing: border-box;
          border-bottom: solid 1px #e0e0e0;
          border-top: solid 1px #f4f4f4;
          display: flex;
          flex-direction: row;
        }

        div[part=list] div:hover {
          background-color: #e8e8e8;
          border-bottom: solid 1px #e8e8e8;
          border-top: solid 1px #e8e8e8;
          cursor: default;
        }

        :host( [inert] ) div[part=list] {
          height: unset !important;
        }

        :host( [light] ) div[part=empty],
        :host( [light] ) div[part=list] {
          background-color: #ffffff;
        }

        :host( [selectable] ) div[part=list] div.selected {
          background-color: #e0e0e0;
          border-bottom: solid 1px #c6c6c6;
          border-top: solid 1px #e0e0e0;
        }

        :host( [selectable] ) div[part=list] div.selected:first-of-type {
          border-bottom: solid 1px #e0e0e0;
          border-top: solid 1px #e0e0e0;
        }

        :host( [selectable] ) div[part=list] div.selected:hover {
          background-color: #d1d1d1;
          border-bottom: solid 1px #d1d1d1;
          border-top: solid 1px #d1d1d1;
        }
      </style>
      <div part="columns">
        <slot></slot>
      </div>
      <div part="list"></div>
      <div part="footer">
        <slot name="footer"></slot>
      </div>
      <div part="empty">
        <slot name="empty"></slot>
      </div>
    `;

    // Private
    this._compare = null;
    this._data = [];    
    this._internal = [];
    this._selected = [];

    // Events
    this.doRowClick = this.doRowClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$empty = this.shadowRoot.querySelector( 'div[part=empty]' );
    this.$footer = this.shadowRoot.querySelector( 'div[part=footer]' );    
    this.$header = this.shadowRoot.querySelector( 'div[part=columns]' );
    this.$list = this.shadowRoot.querySelector( 'div[part=list]' );

    // Columns
    this.addEventListener( 'sort', ( evt ) => this.doColumnSort( evt ) );
  }

  doColumnSort( evt ) {
    for( let c = 0; c < this.children.length; c++ ) {
      if( this.children[c].tagName === 'GR-TABLE-COLUMN' ) {
        if( this.children[c] !== evt.detail.column ) {
          this.children[c].sortDirection = null;
        }
      }
    }

    if( !this.sortable ) return;

    const selected = [... this.selectedItems];
    this._internal = [... this._data];

    if( evt.detail.sortDirection !== null ) {
      if( evt.detail.column.sortCompareFunction !== null ) {
        this._internal.sort( evt.detail.column.sortCompareFunction );
      } else {
        this._internal.sort( ( a, b ) => {
          if( evt.detail.column.labelFunction !== null ) {
            if( evt.detail.column.labelFunction( a ) > evt.detail.column.labelFunction( b ) ) return 1;
            if( evt.detail.column.labelFunction( a ) < evt.detail.column.labelFunction( b ) ) return -1;
            return 0;
          } else if( evt.detail.column.labelField !== null ) {
            if( a[evt.detail.column.labelField] > b[evt.detail.column.labelField] ) return 1;
            if( a[evt.detail.column.labelField] < b[evt.detail.column.labelField] ) return -1;
            return 0;
          } else {
            if( a > b ) return 1;
            if( a < b ) return -1;
            return 0;
          }
        } );
      }

      if( evt.detail.sortDirection === 'desc' ) {
        this._internal.reverse();
      }
    }

    this.selectedItems = selected;
  }

  doRowClick( evt ) {
    if( !this.selectable )
      return;

    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( this.multiple ) {
      const found = this._selected.indexOf( index );

      if( found === -1 ) {
        this._selected.push( index );
      } else {
        this._selected.splice( found, 1 );
      }

      this.dispatchEvent( new CustomEvent( 'gr-change', {
        detail: {
          selectedIndex: this.selectedIndex,
          selectedItems: this.selectedItems
        }
      } ) );
    } else {
      if( this._selected[0] === index ) {
        this._selected = [];
      } else {
        this._selected = [index];
      }

      this.dispatchEvent( new CustomEvent( 'gr-change', {
        detail: {
          selectedIndex: this.selectedIndex,
          selectedItem: this.selectedItem
        }
      } ) );
    }

    this._render();
  }

   // When attributes change
  _render() {
    this.$empty.style.display = this._internal.length === 0 ? 'flex' : 'none';
    this.$header.style.display = this.hideHeader ? 'none' : 'flex';
    this.$list.style.display = this._internal.length === 0 ? 'none' : 'flex';
    this.$footer.style.display = this._internal.length === 0 ? 'none' : 'flex';    

    while( this.$list.children.length > this._internal.length ) {
      while( this.$list.children[0].children.length > 0 ) {
        this.$list.children[0].children[0].remove();
      }

      this.$list.children[0].removeEventListener( 'click', this.doRowClick );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._internal.length ) {
      const row = document.createElement( 'div' );
      row.addEventListener( 'click', this.doRowClick );

      for( let c = 0; c < this.children.length; c++ ) {
        if( this.children[c].tagName !== 'GR-TABLE-COLUMN' ) continue;

        const renderer = this.children[c].itemRenderer === null ? 'gr-label-item-renderer' : this.children[c].itemRenderer;
        const cell = document.createElement( renderer );
        row.appendChild( cell );
      }

      this.$list.appendChild( row );
    }

    for( let i = 0; i < this._internal.length; i++ ) {
      this.$list.children[i].setAttribute( 'data-index', i );

      if( this.selectable ) {
        if( this._selected.indexOf( i ) >= 0 ) {
          this.$list.children[i].classList.add( 'selected' );
        } else {
          this.$list.children[i].classList.remove( 'selected' );
        }
      }

      for( let c = 0; c < this.children.length; c++ ) {
        if( this.children[c].tagName !== 'GR-TABLE-COLUMN' ) continue;

        this.$list.children[i].children[c].hidden = this.children[c].hidden;

        if( this.children[c].width === null ) {
          this.$list.children[i].children[c].style.flexBasis = '0';
          this.$list.children[i].children[c].style.flexGrow = '1';          
          this.$list.children[i].children[c].style.minWidth = '';          
          this.$list.children[i].children[c].style.maxWidth = '';                    
        } else {
          this.$list.children[i].children[c].style.flexBasis = '';
          this.$list.children[i].children[c].style.flexGrow = '';          
          this.$list.children[i].children[c].style.minWidth = `${this.children[c].width}px`;                   
          this.$list.children[i].children[c].style.maxWidth = `${this.children[c].width}px`;                             
        }

        if( this.children[c].itemRenderer !== null ) {
          this.$list.children[i].children[c].data = this._internal[i];
        } else if( this.children[c].labelFunction !== null ) {
          this.$list.children[i].children[c].data = this.children[c].labelFunction( this._internal[i] );
        } else if( this.children[c].labelField !== null ) {
          this.$list.children[i].children[c].data = this._internal[i][this.children[c].labelField];
        } else {
          this.$list.children[i].children[c].data = this._internal[i].toString();
        }
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
    this._upgrade( 'hide-header' );
    this._upgrade( 'inert' );
    this._upgrade( 'light' );    
    this._upgrade( 'multiple' );
    this._upgrade( 'selectable' );
    this._upgrade( 'selectedIndex' );
    this._upgrade( 'selectedIndices' );
    this._upgrade( 'selectedItem' );
    this._upgrade( 'selectedItems' );
    this._upgrade( 'selectedItemsCompareFunction' );
    this._upgrade( 'sortable' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'hide-header',
      'inert',
      'light',
      'multiple',
      'selectable',
      'sortable'
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
    return this._data.length === 0 ? null : this._data;
  }

  set data( value ) {
    this._data = value === null ? [] : [... value];
    this._internal = value === null ? [] : [... value];
    this._render();
  }

  get selectedIndex() {
    return this._selected.length === 0 ? null : this._selected[0];
  }

  set selectedIndex( value ) {
    this._selected = [value];
    this._render();
  }

  get selectedIndices() {
    return this._selected;
  }

  set selectedIndices( value ) {
    if( value === null ) {
      this._selected = [];
    } else {
      if( this.multiple ) {
        this._selected = [... value];
      } else {
        this._selected = [value[value.length - 1]];
      }
    }

    this._render();
  }

  get selectedItem() {
    if( this.selectedIndex === null ) return null;
    return this._internal[this.selectedIndex];
  }

  set selectedItem( value ) {
    this._internal[this.selectedIndex] = value;
    this._render();
  }

  get selectedItems() {
    if( this._selected.length === 0 )
      return [];

    const result = [];

    for( let s = 0; s < this._selected.length; s++ ) {
      result.push( this._internal[this._selected[s]] );
    }

    return result;
  }

  set selectedItems( value ) {
    if( value === null ) {
      this._selected = [];
    } else {
      this._selected = [];

      for( let i = 0; i < this._internal.length; i++ ) {
        for( let v = 0; v < value.length; v++ ) {
          if( this.selectedItemsCompareFunction === null ) {
            if( this._internal[i] === value[v] ) {
              this._selected.push( i );
            }
          } else {
            if( this.selectedItemsCompareFunction( this._internal[i], value[v] ) ) {
              this._selected.push( i );
            }
          }
        }

        if( !this.multiple && this._selected.length === 1 ) {
          break;
        }                                
      }
    }

    this._render();
  }

  get selectedItemsCompareFunction() {
    return this._compare;
  }

  set selectedItemsCompareFunction( value ) {
    this._compare = value;
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

  get hideHeader() {
    return this.hasAttribute( 'hide-header' );
  }

  set hideHeader( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-header' );
      } else {
        this.setAttribute( 'hide-header', '' );
      }
    } else {
      this.removeAttribute( 'hide-header' );
    }
  }

  get inert() {
    return this.hasAttribute( 'inert' );
  }

  set inert( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'inert' );
      } else {
        this.setAttribute( 'inert', '' );
      }
    } else {
      this.removeAttribute( 'inert' );
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
}

window.customElements.define( 'gr-table', GRTable );
