import GRCheckbox from "./checkbox.js";
import GRRadioButton from "./radio-button.js";
import GRLabelItemRenderer from "../internal/label-item-renderer.js";

export default class GRList extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #f4f4f4;
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
          position: relative;
        }

        :host( [conceealed] ) {
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
          cursor: default;
          display: flex;
          flex-basis: 0;
          flex-direction: row;
          flex-grow: 1;
          height: 48px;
          margin: 0;
          padding: 0 16px 0 8px;
        }

        button span {
          color: #161616;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          text-rendering: optimizeLegibility;          
        }

        div[part=list] {
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
        }

        div[part=empty] {
          display: flex;          
          align-items: center;
          flex-basis: 0;
          flex-grow: 1;          
          justify-content: center;
        }

        div[part=header] {
          align-items: center;
          background: #e0e0e0;          
          display: flex;
          flex-direction: row;
          outline-offset: -2px;          
        }

        div[part=header]:focus-within {
          outline: solid 2px #0f62fe;
        }

        div[part=header] gr-checkbox {
          height: 46px;
          justify-content: center;
          padding: 0 0 0 14px;
          width: 40px;
        }        

        div[part=header] gr-checkbox::part( icon ) {        
          font-size: 20px;
        }

        div.row {
          align-items: center;
          border-bottom: solid 1px #e0e0e0;
          border-top: solid 1px transparent;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
        }

        div.row gr-checkbox {
          height: 46px;
          justify-content: center;
          padding: 0 0 0 14px;
          width: 40px;
        }

        div.row gr-checkbox::part( icon ) {
          font-size: 20px;
        }

        div.row gr-radio-button {
          height: 46px;
          justify-content: center;
          padding: 0 0 0 14px;
          width: 40px;
        }

        div.row gr-radio-button::part( icon ) {        
          font-size: 20px;
        }

        div.row.selected {
          background-color: #e0e0e0;
          border-bottom: solid 1px #c6c6c6;          
          border-top: solid 1px #e0e0e0;          
        }

        div.row:first-of-type.selected {
          background-color: #e0e0e0;
          border-bottom: solid 1px #c6c6c6;          
          border-top: solid 1px #c6c6c6;          
        }        

        i {
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          direction: ltr;
          font-family: 'Material Symbols Outlined';
          font-size: 20px;
          font-style: normal;
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
          visibility: hidden;
          white-space: nowrap;
          width: 20px;
          word-wrap: normal;                              
        }

        :host( [sortable] ) button {
          cursor: pointer;
        }

        :host( [sortable] ) div[part=header]:hover {
          background-color: #d1d1d1;
        }

        :host( [sortable] ) button:hover i {
          visibility: visible;
        }

        :host( [sortable][sort-direction] ) i {
          visibility: visible;
        }

        :host( [sortable]:not( [multiple] ) ) gr-checkbox {
          visibility: hidden;
        }

        :host( :not( [header-text] ) ) div[part=header] {
          display: none;
        }

        :host( [selectable] ) div.row:hover {
          background-color: #e8e8e8;
          border-bottom: solid 1px #e8e8e8;          
          border-top: solid 1px #e8e8e8;
        }

        :host( [selectable] ) div.row.selected:hover {
          background-color: #d1d1d1;
          border-bottom: solid 1px #d1d1d1;          
          border-top: solid 1px #d1d1d1;          
        }        

        :host( :not( [selectable] ) ) button {
          padding: 0 16px 0 16px;
        }

        :host( [light] ) {
          background-color: #ffffff;
        }

        :host( :not( [selectable] ) ) div[part=header] gr-checkbox,
        :host( :not( [selectable] ) ) div.row gr-radio-button,
        :host( :not( [selectable] ) ) div.row gr-checkbox {
          display: none;
        }

        :host( [selectable] ) div.row gr-checkbox {
          display: none;
        }

        :host( [selectable]:not( [multiple] ) ) div[part=header] gr-checkbox {
          visibility: hidden;
        }

        :host( [selectable][multiple] ) div.row gr-radio-button {
          display: none;
        }

        :host( [selectable][multiple] ) div.row gr-checkbox {
          display: inline-flex;
        }
      </style>
      <div part="header">      
        <gr-checkbox></gr-checkbox>
        <button type="button">
          <span></span>
          <i>height</i>
        </button>
      </div>
      <div part="list"></div>
      <div part="empty">
        <slot></slot>
      </div>
    `;
    
    // Private
    this._data = [];
    this._label = null;
    this._selected = [];

    // Events
    this.doRowSelect = this.doRowSelect.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$all = this.shadowRoot.querySelector( 'div[part=header] gr-checkbox' );
    this.$all.addEventListener( 'gr-change', ( evt ) => {
      if( evt.detail.checked ) {
        this._selected = [... this._data.keys()] ;
      } else {
        this._selected = [];
      }

      for( let r = 0; r < this.$list.children.length; r++ ) {
        const found = this._selected.indexOf( r );

        this.$list.children[r].children[1].checked = found === -1 ? false : true;
        
        if( found === -1 ) {
          this.$list.children[r].classList.remove( 'selected' );
        } else {
          this.$list.children[r].classList.add( 'selected' );
        }
      }
    } )
    this.$empty = this.shadowRoot.querySelector( 'div[part=empty]' );    
    this.$header = this.shadowRoot.querySelector( 'button' );    
    this.$header.addEventListener( 'click', () => {
      if( this.sortable ) {
        if( this.sortDirection === null ) {
          this.sortDirection = 'asc';
        } else if( this.sortDirection === 'asc' ) {
          this.sortDirection = 'desc';
        } else if( this.sortDirection === 'desc' ) {
          this.sortDirection = null;
        }
      }  
      
      this._build();

      this.dispatchEvent( new CustomEvent( 'gr-sort', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          column: this,
          sortDirection: this.sortDirection
        }
      } ) );      
    } );    
    this.$label = this.shadowRoot.querySelector( 'button span' );            
    this.$list = this.shadowRoot.querySelector( 'div[part=list]' );
    this.$sort = this.shadowRoot.querySelector( 'i' );
  }

  doRowSelect( evt ) {
    const index = parseInt( evt.target.parentElement.getAttribute( 'data-index' ) );

    if( this.multiple ) {
      const found = this._selected.indexOf( index );

      if( found === -1 ) {
        this._selected.push( index );
      } else {
        this._selected.splice( found, 1 );
      }
    } else {
      if( this.toggle ) {
        const found = this._selected.indexOf( index );
        this._selected = found === - 1 ? [index] : [];
      } else {
        this._selected = [index];
      }
    }

    for( let r = 0; r < this.$list.children.length; r++ ) {
      const found = this._selected.indexOf( r );

      this.$list.children[r].children[0].checked = found === -1 ? false : true;
      this.$list.children[r].children[1].checked = found === -1 ? false : true;
      
      if( found === -1 ) {
        this.$list.children[r].classList.remove( 'selected' );
      } else {
        this.$list.children[r].classList.add( 'selected' );
      }
    }

    this.$all.checked = this._selected.length === this._data.length ? true : false;

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: {
        selectedIndices: [... this._selected]
      }
    } ) );
  }

  _build() {
    let provider = [... this._data];

    if( this.sortable ) {
      if( this.sortDirection === 'desc' ) {
        provider = this._data.toSorted( ( a, b ) => {
          if( this.labelField === null ) {
            if( a < b ) return 1;
            if( a > b ) return -1;
            return 0;
          } else {
            if( a[this.labelField] < b[this.labelField] ) return 1;
            if( a[this.labelField] > b[this.labelField] ) return -1;
            return 0;
          }
        } );
      } else if( this.sortDirection === 'asc' ) {
        provider = this._data.toSorted( ( a, b ) => {
          if( this.labelField === null ) {
            if( a < b ) return -1;
            if( a > b ) return 1;
            return 0;
          } else {
            if( a[this.labelField] < b[this.labelField] ) return -1;
            if( a[this.labelField] > b[this.labelField] ) return 1;
            return 0;
          }
        } );
      }
    }

    const renderer = this.itemRenderer === null ? 'gr-label-item-renderer' : this.itemRenderer;

    while( this.$list.children.length > provider.length ) {
      this.$list.children[0].children[0].removeEventListener( 'gr-change', this.doRowSelect );
      this.$list.children[0].children[1].removeEventListener( 'gr-change', this.doRowSelect );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < provider.length ) {
      const row = document.createElement( 'div' );
      row.classList.add( 'row' );

      const radio = document.createElement( 'gr-radio-button' );
      radio.addEventListener( 'gr-change', this.doRowSelect );
      row.appendChild( radio );

      const check = document.createElement( 'gr-checkbox' );
      check.addEventListener( 'gr-change', this.doRowSelect );
      row.appendChild( check );     
      
      const cell = document.createElement( renderer );
      row.appendChild( cell );

      this.$list.appendChild( row );
    }

    for( let r = 0; r < this.$list.children.length; r++ ) {
      this.$list.children[r].setAttribute( 'data-index', r );
      this.$list.children[r].children[0].checked = false;
      this.$list.children[r].children[1].checked = false;

      if( this._label === null ) {
        this.$list.children[r].children[2].data = this.labelField === null ? provider[r] : provider[r][this.labelField];
      } else {
        this.$list.children[r].children[2].data = this._label( provider[r] );        
      }
    }
  }

  // When attributes change
  _render() {
    this.$label.innerText = this.headerText;

    switch( this.sortDirection ) {
      case 'asc':
        this.$sort.innerText = 'north'
        break;        
      case 'desc':
        this.$sort.innerText = 'south'
        break;
      default:
        this.$sort.innerText = 'height';
        break;
    }

    this.$empty.style.display = this.$list.children.length > 0 ? 'none' : 'flex';
    this.$list.style.display = this.$list.children.length > 0 ? 'flex' : 'none';
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
    this._upgrade( 'itemRenderer' );        
    this._upgrade( 'headerText' );          
    this._upgrade( 'labelField' );  
    this._upgrade( 'labelFunction' );      
    this._upgrade( 'light' );                  
    this._upgrade( 'multiple' );    
    this._upgrade( 'selectable' );        
    this._upgrade( 'sortable' );            
    this._upgrade( 'sortDirection' );            
    this._upgrade( 'toggle' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'item-renderer',
      'header-text',
      'label-field',
      'light',
      'multiple',
      'selectable',
      'sortable',
      'sort-direction',
      'toggle'
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
    return this._data.length === 0 ? null : this._data;
  }

  set data( value ) {
    this._data = value === null ? [] : [... value];
    this._selected = [];
    this._build();
  }  

  get labelFunction() {
    return this._label;
  }

  set labelFunction( func ) {
    this._label = func;
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
}

window.customElements.define( 'gr-list', GRList );
