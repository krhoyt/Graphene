import GrapheneIcon from "./icon.js";
import GrapheneLabel from "./label.js";

export default class GrapheneButton extends HTMLElement {
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

        :host( [hidden] ) {
          display: none;
        }

        gr-label {
          --label-color: #ffffff;
          --label-cursor: pointer;
          flex-basis: 0;
          flex-grow: 1;
        }

        button {
          align-items: center;
          background: none;
          background-color: #0f62fe;
          border: none;
          border: solid 1px transparent;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          height: 48px;
          margin: 0;
          outline: solid 1px transparent;
          outline-offset: -3px;
          padding: 0 65px 0 15px;
          position: relative;
          -webkit-tap-highlight-color: transparent;          
        }

        button:hover {
          background-color: #0050e6;
        }

        button:focus {
          border-color: #0f62fe;
          box-shadow:
            inset 0 0 0 1px #0f62fe,
            inset 0 0 0 2px #ffffff;
        }

        button:active {
          background-color: #002d9c;
        }

        gr-icon{
          --icon-color: #ffffff;
          --icon-cursor: pointer;
        }

        :host( [size=sm] ) button {
          height: 32px;
          padding: 0 60px 0 12px;
        }
        :host( [size=md] ) button {
          height: 40px;
          padding: 0 60px 0 12px;
        }
        :host( [size=xl] ) button {
          align-items: flex-start;
          height: 64px;
          padding: 14px 65px 0 16px;
        }
        :host( [size=xxl] ) button {
          align-items: flex-start;
          height: 80px;
          padding: 14px 65px 0 16px;
        }

        :host( [kind=secondary] ) button { background-color: #393939; }
        :host( [kind=secondary] ) button:hover { background-color: #4a4a4a; }
        :host( [kind=secondary] ) button:active { background-color: #6f6f6f; }

        :host( [kind=tertiary] ) gr-label { --label-color: #0f62fe; }
        :host( [kind=tertiary] ) button {
          background-color: transparent;
          border: solid 1px #0f62fe;
        }
        :host( [kind=tertiary] ) button:hover gr-label { --label-color: #ffffff; }        
        :host( [kind=tertiary] ) button:hover {
          background-color: #0353e9;
          border: solid 1px #0353e9;
        }
        :host( [kind=tertiary] ) button:focus gr-label { --label-color: #ffffff; }
        :host( [kind=tertiary] ) button:focus { background-color: #0f62fe; }        
        :host( [kind=tertiary] ) button:active { background-color: #002d9c; }

        :host( [kind=danger] ) button { background-color: #da1e28; }
        :host( [kind=danger] ) button:hover { background-color: #bc1a22; }
        :host( [kind=danger] ) button:active { background-color: #750e13; }

        :host( [kind=ghost] ) button { background-color: transparent; }
        :host( [kind=ghost] ) button { padding: 0 15px 0 15px; }        
        :host( [kind=ghost] ) button gr-label { --label-color: #0f62fe; }
        :host( [kind=ghost] ) button:hover { background-color: #e5e5e5e4; }
        :host( [kind=ghost] ) button:active { background-color: #8d8d8d80; }
        :host( [kind=ghost] ) gr-icon { 
          padding: 0 0 0 15px;
          --icon-color: #0f62fe; 
        }
        :host( [kind=ghost]:not( [label] ) ) gr-icon {         
          padding: 0;
        }

        :host( :not( [icon-name] ) ) gr-icon { display: none; }
        :host( :not( [label] ) ) button { padding: 0 13px 0 13px; }
        :host( :not( [label] ) ) gr-label { display: none; }

        :host( [disabled] ) gr-icon { --icon-color: #8d8d8d; }
        :host( [disabled] ) gr-label { 
          --label-color: #8d8d8d; 
          --label-cursor: not-allowed;
        }
        :host( [disabled] ) button {
          background-color: #c6c6c6;
          cursor: not-allowed;
        }
        :host( [disabled][kind=tertiary] ) button gr-label { --label-color: #c6c6c6; }        
        :host( [disabled][kind=tertiary] ) button {        
          background-color: transparent;
          border-color: #c6c6c6;
        }
        :host( [disabled][kind=tertiary] ) button:hover gr-label { --label-color: #c6c6c6; }        
        :host( [disabled][kind=ghost] ) button { background-color: transparent; }        
        :host( [disabled][kind=ghost] ) gr-label { --label-color: #8d8d8d; }   
      </style>
      <button part="button">
        <gr-label exportparts="label: p" part="label"></gr-label>
        <gr-icon exportparts="font: f, image: i" part="icon" weight="200"></gr-icon>
      </button>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( 'focus', () => this.dispatchEvent( new CustomEvent( 'gr-focus' ) ) );
    this.$button.addEventListener( 'blur', () => this.dispatchEvent( new CustomEvent( 'gr-blur' ) ) );    
    this.$button.addEventListener( 'click', () => {
      if( this.href !== null )
        if( this.target !== null ) {
          window.open( this.href, this.target );
        } else {
          window.open( this.href );
        }
    } );        
    this.$label = this.shadowRoot.querySelector( 'gr-label' );
    this.$icon = this.shadowRoot.querySelector( 'gr-icon' );
  }

  blur() {
    this.$button.blur();
  }

  click() {
    this.$button.click();
  }

  focus() {
    this.$button.focus();
  }  

   // When attributes change
  _render() {
    this.$button.type = this.type === null ? 'button' : this.type;
    this.$button.disabled = this.disabled;
    this.$label.text = this.label;
    this.$icon.name = this.iconName;
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
    this._upgrade( 'hidden' );
    this._upgrade( 'href' ); 
    this._upgrade( 'iconName' ); 
    this._upgrade( 'kind' );
    this._upgrade( 'label' );
    this._upgrade( 'size' );
    this._upgrade( 'target' );    
    this._upgrade( 'type' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'href',
      'icon-name',
      'kind',
      'label',
      'size',
      'target',
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

  get href() {
    if( this.hasAttribute( 'href' ) ) {
      return this.getAttribute( 'href' );
    }

    return null;
  }

  set href( value ) {
    if( value !== null ) {
      this.setAttribute( 'href', value );
    } else {
      this.removeAttribute( 'href' );
    }
  }

  get iconName() {
    if( this.hasAttribute( 'icon-name' ) ) {
      return this.getAttribute( 'icon-name' );
    }

    return null;
  }

  set iconName( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon-name', value );
    } else {
      this.removeAttribute( 'icon-name' );
    }
  }

  get kind() {
    if( this.hasAttribute( 'kind' ) ) {
      return this.getAttribute( 'kind' );
    }

    return null;
  }

  set kind( value ) {
    if( value !== null ) {
      this.setAttribute( 'kind', value );
    } else {
      this.removeAttribute( 'kind' );
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

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
    }
  }

  get target() {
    if( this.hasAttribute( 'target' ) ) {
      return this.getAttribute( 'target' );
    }

    return null;
  }

  set target( value ) {
    if( value !== null ) {
      this.setAttribute( 'target', value );
    } else {
      this.removeAttribute( 'target' );
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

window.customElements.define( 'gr-button', GrapheneButton );
