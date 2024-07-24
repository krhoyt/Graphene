import GRTab from "./tab.js";
import GRTabPanel from "./tab-panel.js";

export default class GRTabGroup extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
          position: relative;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          border: solid 1px transparent;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 48px;
          justify-content: center;          
          margin: 0;
          outline: solid 1px transparent;
          outline-offset: -3px;
          padding: 0;
          width: 48px;
        }

        button:hover {
          background-color: #e5e5e5e4;          
        }

        button:focus {
          border-color: #0f62fe;
          box-shadow:
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;
        }

        div {
          align-items: center;
          display: flex;
          flex-direction: row;
        }

        div[part=tabs] {
          flex-basis: 0;
          flex-grow: 1;
          overflow: hidden;
        }

        div[part=panels] {
          background-color: #f4f4f4;
        }

        i {
          box-sizing: border-box;
          color: #161616;
          cursor: pointer;
          direction: ltr;
          font-family: 'Material Symbols Outlined';
          font-size: 18px;
          font-style: normal;
          font-weight: normal;
          height: 18px;
          letter-spacing: normal;
          line-height: 18px;
          margin: 0;
          max-height: 18px;         
          max-width: 18px;                    
          min-height: 18px;                               
          min-width: 18px;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: 18px;
          word-wrap: normal;                    
        }        

        gr-tab:first-of-type::part( button ) {
          border-left: solid 1px transparent;
        }

        gr-tab[selected] + gr-tab::part( button ) {
          border-left: solid 1px transparent;
        }

        :host( :not( [expandable] ) ) button {
          display: none;
        }

        :host( [light] ) div[part=panels] {
          background-color: #ffffff;
        }        
      </style>
      <div part="header">
        <div part="tabs"></div>
        <button part="zoom" type="button">
          <i>open_in_full</i>
        </button>
      </div>
      <div part="panels">
        <slot></slot>
      </div>
    `;

    // Removeable events
    this.doTabClick = this.doTabClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$icon = this.shadowRoot.querySelector( 'i' );
    this.$tabs = this.shadowRoot.querySelector( 'div[part=tabs]' );
    this.$views = this.shadowRoot.querySelector( 'slot' );
    this.$views.addEventListener( 'slotchange', ( evt ) => this.doSlotChange( evt ) );
    this.$zoom = this.shadowRoot.querySelector( 'button' );
    this.$zoom.addEventListener( 'click', () => {
      this.expanded = !this.expanded;
      this.dispatchEvent( new CustomEvent(
        this.expanded ? 'gr-expand' : 'gr-collapse', {
          detail: {
            value: this.expanded
          }
        }
      ) );
    } );
  }

  collapse() {
    this.expanded = false;
  }

  expand() {
    this.expanded = true;
  }

  show( index ) {
    this.selectedIndex = index === null ? 0 : index;
  }

  // Children added or removed
  doSlotChange() {
    // Remove excess
    while( this.$tabs.children.length > this.children.length ) {
      this.$tabs.children[0].removeEventListener( 'click', this.doTabClick );
      this.$tabs.children[0].remove();
    }

    // Add where needed
    while( this.$tabs.children.length < this.children.length ) {
      const tab = document.createElement( 'gr-tab' );
      tab.addEventListener( 'click', this.doTabClick );
      this.$tabs.appendChild( tab );
    }

    const selected = this.selectedIndex === null ? 0 : this.selectedIndex;

    for( let c = 0; c < this.$tabs.children.length; c++ ) {
      this.$tabs.children[c].setAttribute( 'data-index', c );
      this.$tabs.children[c].label = this.children[c].label;
      this.$tabs.children[c].helper = this.children[c].helper;
      this.$tabs.children[c].icon = this.children[c].icon;
      this.$tabs.children[c].disabled = this.children[c].disabled;
      this.$tabs.children[c].selected = c === selected ? true : false;
      this.children[c].hidden = c === selected ? false : true;
    }
  }

  // Tab selection change
  doTabClick( evt ) {
    if( evt.currentTarget.disabled )
      return;

    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );

    if( index === this.selectedIndex )
      return;

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: {
        previousIndex: this.selectedIndex,
        selectedIndex: index
      }
    } ) );

    this.selectedIndex = index;
  }

  // When things change
  _render() {
    this.$icon.innerText = this.expanded ? 'hide' : 'open_in_full';

    const index = this.selectedIndex === null ? 0 : this.selectedIndex;
    for( let c = 0; c < this.$tabs.children.length; c++ ) {
      this.$tabs.children[c].selected = c === index ? true : false;
      this.children[c].hidden = c === index ? false : true;
    }
  }

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Default render
  // No attributes set
  connectedCallback() {
    // Check data property before render
    // May be assigned before module is loaded
    this._upgrade( 'expandable' );
    this._upgrade( 'expanded' );
    this._upgrade( 'hidden' );
    this._upgrade( 'light' );    
    this._upgrade( 'selectedIndex' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'expandable',
      'expanded',
      'hidden',
      'light',
      'selected-index'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
  get expandable() {
    return this.hasAttribute( 'expandable' );
  }

  set expandable( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'expandable' );
      } else {
        this.setAttribute( 'expandable', '' );
      }
    } else {
      this.removeAttribute( 'expandable' );
    }
  }

  get expanded() {
    return this.hasAttribute( 'expanded' );
  }

  set expanded( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'expanded' );
      } else {
        this.setAttribute( 'expanded', '' );
      }
    } else {
      this.removeAttribute( 'expanded' );
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
}

window.customElements.define( 'gr-tab-group', GRTabGroup );
