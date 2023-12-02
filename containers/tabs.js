import GrapheneHBox from "./hbox.js";
import GrapheneStack from "./stack.js";

import GrapheneButton from "../controls/button.js";
import GrapheneTab from "../controls/tab.js";

export default class GrapheneTabs extends HTMLElement {
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

        gr-hbox[part=header] {
          align-items: center;
        }

        gr-hbox[part=tabs] {
          flex-basis: 0;
          flex-grow: 1;
          overflow: hidden;
        }

        gr-icon-button {
          display: none;
        }

        gr-stack {
          background-color: var( --tabs-background-color, #f4f4f4 );
        }

        gr-tab:first-of-type::part( button ) {
          border-left: solid 1px transparent;
        }

        gr-tab[selected] + gr-tab::part( button ) {
          border-left: solid 1px transparent;
        }

        :host( [expandable] ) gr-icon-button {
          display: inline-block;
        }

        :host( [light] ) gr-stack {
          background-color: #ffffff;
        }        
      </style>
      <gr-hbox part="header">
        <gr-hbox part="tabs"></gr-hbox>
        <gr-icon-button 
          exportparts="icon: icon, font: zoom-p" 
          name="open_in_full" 
          part="zoom" 
          kind="ghost">
        </gr-icon-button>
      </gr-hbox>
      <gr-stack part="views">
        <slot></slot>
      </gr-stack>
    `;

    // Removeable events
    this.doTabClick = this.doTabClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$tabs = this.shadowRoot.querySelector( 'gr-hbox[part=tabs]' );
    this.$views = this.shadowRoot.querySelector( 'slot' );
    this.$views.addEventListener( 'slotchange', ( evt ) => this.doSlotChange( evt ) );
    this.$zoom = this.shadowRoot.querySelector( 'gr-icon-button' );
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
      const renderer = this.tabRenderer === null ? 'gr-tab' : this.tabRenderer;
      const tab = document.createElement( renderer );
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
    this.$zoom.name = this.expanded ? 'hide' : 'open_in_full';

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
    this._upgrade( 'tabRenderer' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'expandable',
      'expanded',
      'hidden',
      'light',
      'selected-index',
      'tab-renderer'
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

  get tabRenderer() {
    if( this.hasAttribute( 'tab-renderer' ) ) {
      return this.getAttribute( 'tab-renderer' );
    }

    return null;
  }

  set tabRenderer( value ) {
    if( value !== null ) {
      this.setAttribute( 'tab-renderer', value );
    } else {
      this.removeAttribute( 'tab-renderer' );
    }
  }
}

window.customElements.define( 'gr-tabs', GrapheneTabs );
