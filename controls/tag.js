import GrapheneIcon from "./icon.js";
import GrapheneLabel from "./label.js";

export default class GrapheneTag extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background-color: var( --tag-background-color, #e0e0e0 );
          border-radius: 24px;
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: row;
          height: 24px;
          padding: 0 8px 0 8px;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          background: none;
          background-color: transparent;
          border: none;
          border-radius: 24px;
          box-sizing: border-box;
          color: var( --tag-color, #393939 );
          cursor: pointer;
          display: none;
          height: 24px;
          justify-content: center;
          margin: 0 -8px 0 2px;
          outline: none;
          padding: 0;
          width: 24px;
        }

        button:hover {
          background-color: var( --tag-hover-color, #c6c6c6 );
        }

        gr-icon {
          --icon-cursor: pointer;
          --icon-size: 16px;
        }

        gr-label {
          --label-color: var( --tag-color, #393939 );
          --label-cursor: var( --tag-cursor, default );
          --label-font-size: var( --tag-font-size, 12px );
        }

        :host( [filter] ) button {
          display: flex;
        }

        :host( [type=red] ) { background-color: #ffd7d9; }
        :host( [type=red] ) button:hover { background-color: #ffb3b8; }
        :host( [type=red] ) gr-label { --label-color: #750e13; }
        :host( [type=red] ) gr-icon { --icon-color: #750e13; }        

        :host( [type=magenta] ) { background-color: #ffd6e8; }
        :host( [type=magenta] ) button:hover { background-color: #ffafd2; }
        :host( [type=magenta] ) gr-label { --label-color: #740937; }
        :host( [type=magenta] ) gr-icon { --icon-color: #740937; }        

        :host( [type=purple] ) { background-color: #e8daff; }
        :host( [type=purple] ) button:hover { background-color: #d4bbff; }
        :host( [type=purple] ) gr-label { --label-color: #491d8b; }
        :host( [type=purple] ) gr-icon { --icon-color: #491d8b; }

        :host( [type=blue] ) { background-color: #d0e2ff; }
        :host( [type=blue] ) button:hover { background-color: #a6c8ff; }
        :host( [type=blue] ) gr-label { --label-color: #002d9c; }
        :host( [type=blue] ) gr-icon { --icon-color: #002d9c; }

        :host( [type=cyan] ) { background-color: #bae6ff; }
        :host( [type=cyan] ) button:hover { background-color: #82cfff; }
        :host( [type=cyan] ) gr-label { --label-color: #003a6d; }
        :host( [type=cyan] ) gr-icon { --icon-color: #003a6d; }

        :host( [type=teal] ) { background-color: #9ef0f0; }
        :host( [type=teal] ) button:hover { background-color: #3ddbd9; }
        :host( [type=teal] ) gr-label { --label-color: #004144; }
        :host( [type=teal] ) gr-icon { --icon-color: #004144; }

        :host( [type=green] ) { background-color: #a7f0ba; }
        :host( [type=green] ) button:hover { background-color: #6fdc8c; }
        :host( [type=green] ) gr-label { --label-color: #044317; }
        :host( [type=green] ) gr-icon { --icon-color: #044317; }

        :host( [type=cool-gray] ) { background-color: #dde1e6; }
        :host( [type=cool-gray] ) button:hover { background-color: #c1c7cd; }
        :host( [type=cool-gray] ) gr-label { --label-color: #343a3f; }
        :host( [type=cool-gray] ) gr-icon { --icon-color: #343a3f; }

        :host( [type=warm-gray] ) { background-color: #e5e0df; }
        :host( [type=warm-gray] ) button:hover { background-color: #cac5c4; }
        :host( [type=warm-gray] ) gr-label { --label-color: #3c3838; }
        :host( [type=warm-gray] ) gr-icon { --icon-color: #3c3838; }

        :host( [type=high-contrast] ) { background-color: #393939; }
        :host( [type=high-contrast] ) button:hover { background-color: #474747; }
        :host( [type=high-contrast] ) gr-label { --label-color: #ffffff; }
        :host( [type=high-contrast] ) gr-icon { --icon-color: #ffffff; }        

        :host( [type=outline] ) { 
          background-color: transparent; 
          border: solid 1px #161616;
        }        
        :host( [type=outline] ) button { 
          height: 22px;
          width: 22px;
        }        
        :host( [type=outline] ) button:hover { background-color: #e8e8e8; }
        :host( [type=outline] ) gr-label { --label-color: #161616; }
        :host( [type=outline] ) gr-icon { --icon-color: #161616; }                

        :host( [disabled] ) {
          background-color: #f4f4f4;
          cursor: not-allowed;
        }

        :host( [disabled] ) button {
          background-color: transparent;
          cursor: not-allowed;
        }

        :host( [disabled] ) button gr-icon {        
          --icon-cursor: not-allowed;
          --icon-color: #c6c6c6;
        }

        :host( [disabled] ) button:hover {
          background-color: transparent;
          cursor: not-allowed;
        }

        :host( [disabled] ) gr-label {
          --label-color: #c6c6c6;
          --label-cursor: not-allowed;
        }        
      </style>
      <gr-label part="label"></gr-label>
      <button part="button" type="button">
        <gr-icon exportparts="font: font" name="close" part="icon" weight="200"></gr-icon>                    
      </button>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$label = this.shadowRoot.querySelector( 'gr-label' );
  }

   // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
    this.$label.text = this.label;    
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
    this._upgrade( 'disabled' );
    this._upgrade( 'filter' );    
    this._upgrade( 'hidden' );
    this._upgrade( 'label' );
    this._upgrade( 'type' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'filter',
      'hidden',
      'label',
      'type'
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
  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
    }
  }

  get filter() {
    return this.hasAttribute( 'filter' );
  }

  set filter( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'filter' );
      } else {
        this.setAttribute( 'filter', '' );
      }
    } else {
      this.removeAttribute( 'filter' );
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

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }

  get type() {
    if( this.hasAttribute( 'type' ) ) {
      return this.getAttribute( 'type' );
    }

    return null;
  }

  set type( value ) {
    if( value !== null ) {
      this.setAttribute( 'type', value );
    } else {
      this.removeAttribute( 'type' );
    }
  }  
}

window.customElements.define( 'gr-tag', GrapheneTag );
