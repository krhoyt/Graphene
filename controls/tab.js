import GrapheneHBox from "../containers/hbox.js";

import GrapheneIcon from "./icon.js";
import GrapheneLabel from "./label.js";

export default class GrapheneTab extends HTMLElement {
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

        button {
          background: none;
          background-color: #e0e0e0;
          border: none;
          border-left: solid 1px #8d8d8d;            
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 48px;
          justify-content: center;
          margin: 0;
          min-width: 145px;
          outline: none;
          padding: 0 16px 0 16px;
          /* transition: background-color 150ms ease-in-out; */
          -webkit-tap-highlight-color: transparent;
        }

        button:hover {
          background-color: #cacaca;
        }

        gr-icon {
          display: none;
          --icon-color: #6f6f6f;
          --icon-cursor: pointer;
        }

        gr-label {
          display: none;          
          --label-color: #393939;
          --label-cursor: pointer;
          --label-font-size: 14px;
          --label-font-weight: 400;          
        }

        gr-label[part=helper] {
          --label-color: #6f6f6f;
          --label-font-size: 12px;
        }

        gr-label[part=label] {        
          flex-basis: 0;
          flex-grow: 1;
        }

        gr-hbox {
          align-items: center;
        }

        :host( [helper] ) gr-label[part=helper] {
          display: inline-block;
        }

        :host( [icon] ) gr-icon {
          display: inline-block;
        }

        :host( [icon] ) gr-icon::part( font ) {
          height: 18px;
          line-height: 18px;
          width: 18px;
        }

        :host( [label] ) gr-label[part=label] {
          display: inline-block;
        }

        :host( [selected] ) button {
          background-color: #f4f4f4;
          border-left: solid 1px transparent;          
          box-shadow: inset 0 2px 0 0 #0f62fe;
        }
        :host( [selected] ) gr-icon {
          --icon-color: #525252;
        }
        :host( [selected] ) gr-label[part=helper] {
          --label-color: #525252;
        }
        :host( [selected] ) gr-label[part=label] {
          --label-color: #161616;
          --label-font-weight: 600;
        }

        :host( [disabled] ) gr-icon {
          --icon-color: #c6c6c6;
          --icon-cursor: not-allowed;
        }
        :host( [disabled] ) button {
          background-color: #c6c6c6;
          cursor: not-allowed;
        }
        :host( [disabled] ) gr-label {
          --label-color: #8d8d8d;
          --label-cursor: not-allowed;
        }
      </style>
      <button part="button" type="button">
        <gr-hbox part="box">
          <gr-label exportparts="label: label-p" part="label"></gr-label>
          <gr-icon exportparts="font: font" part="icon" weight="200"></gr-icon>                    
        </gr-hbox>
        <gr-label exportparts="label: helper-p" part="helper"></gr-label>
      </button>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$helper = this.shadowRoot.querySelector( 'gr-label[part=helper]' );
    this.$icon = this.shadowRoot.querySelector( 'gr-icon' );
    this.$label = this.shadowRoot.querySelector( 'gr-label[part=label]' );
  }

   // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
    this.$label.text = this.label;    
    this.$helper.text = this.helper;
    this.$icon.name = this.icon;
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
    this._upgrade( 'disabled' );
    this._upgrade( 'helper' );
    this._upgrade( 'hidden' );
    this._upgrade( 'icon' );
    this._upgrade( 'label' );
    this._upgrade( 'selected' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'helper',
      'hidden',
      'icon',
      'label',
      'selected'
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

  get helper() {
    if( this.hasAttribute( 'helper' ) ) {
      return this.getAttribute( 'helper' );
    }

    return null;
  }

  set helper( value ) {
    if( value !== null ) {
      this.setAttribute( 'helper', value );
    } else {
      this.removeAttribute( 'helper' );
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

  get icon() {
    if( this.hasAttribute( 'icon' ) ) {
      return this.getAttribute( 'icon' );
    }

    return null;
  }

  set icon( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon', value );
    } else {
      this.removeAttribute( 'icon' );
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

  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
    }
  }
}

window.customElements.define( 'gr-tab', GrapheneTab );
