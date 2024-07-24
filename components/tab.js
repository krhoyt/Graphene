export default class GRTab extends HTMLElement {
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
          background-color: #f4f4f4;
          border: none;
          border-left: solid 1px transparent;          
          box-shadow: inset 0 2px 0 0 #0f62fe;
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

        div {
          align-items: center;
          display: flex;
          flex-direction: row;
        }

        i {
          box-sizing: border-box;
          color: #161616;
          cursor: default;
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

        span {
          color: #161616;
          text-align: left;
        }

        span[part=label] {
          flex-basis: 0;
          flex-grow: 1;
          font-weight: 600;
        }

        span[part=helper] {
          font-size: 12px;
        }

        :host( :not( [label] ) ) span[part=label],
        :host( :not( [helper] ) ) span[part=helper],
        :host( :not( [icon] ) ) i {
          display: none;
        }

        :host( :not( [selected] ) ) button {
          background-color: #e0e0e0;
          border-left: solid 1px #8d8d8d;                     
          box-shadow: inset 0 2px 0 0 transparent;
        }
        :host( :not( [selected] ) ) i,
        :host( :not( [selected] ) ) span {
          color: #525252;
          cursor: pointer;
          font-weight: 400;          
        }
        :host( :not( [selected] ) ) button:hover {
          background-color: #d1d1d1;
        }
        :host( :not( [selected] ) ) button:hover i, 
        :host( :not( [selected] ) ) button:hover span {
          color: #161616;
        }

        :host( [disabled] ) button,
        :host( [disabled]:not( [selected] ) ) button:hover {        
          background-color: #c6c6c6;
          cursor: not-allowed;
        }
        :host( [disabled] ) i,
        :host( [disabled] ) span,
        :host( [disabled]:not( [selected] ) ) i,        
        :host( [disabled]:not( [selected] ) ) span,
        :host( [disabled]:not( [selected] ) ) button:hover i,
        :host( [disabled]:not( [selected] ) ) button:hover span {
          color: #8d8d8d;
          cursor: not-allowed;
        }
      </style>
      <button part="button" type="button">
        <div>
          <span part="label"></span>
          <i part="icon"></i>
        </div>
        <span part="helper"></span>        
      </button>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$helper = this.shadowRoot.querySelector( 'span[part=helper]' );
    this.$icon = this.shadowRoot.querySelector( 'i' );
    this.$label = this.shadowRoot.querySelector( 'span[part=label]' );
  }

   // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
    this.$label.innerText = this.label === null ? '' : this.label;    
    this.$helper.innerText = this.helper === null ? '' : this.helper;
    this.$icon.innerText = this.icon === null ? '' : this.icon;
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

window.customElements.define( 'gr-tab', GRTab );
