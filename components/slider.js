import GRHBox from "./hbox.js";
import GRVBox from "./vbox.js";

import GRLabel from "./label.js";

export default class GrapheneSlider extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }         

        div[part=handle] {
          background-color: #161616;
          border-radius: 14px;
          border: solid 1px transparent;
          box-sizing: border-box;
          cursor: pointer;
          height: 14px;
          left: 0;
          position: absolute;
          top: 50%;
          transform: translateY( -50% );
          width: 14px;
        }

        div[part=handle]:hover {        
          background-color: #0f62fe;
        }

        div[part=handle]:active {
          border: solid 1px #ffffff;
          outline: solid 2px #0f62fe;
        }

        div[part=line] {
          background-color: #e0e0e0;
          flex-basis: 0;
          flex-grow: 1;
          height: 2px;
          min-width: 100px;
        }

        div[part=slider] {
          display: flex;
          flex-basis: 0;
          flex-grow: 1;
          justify-content: center;
          margin: 0 9px 0 9px;
          padding: 0 7px 0 7px;
          position: relative;
        }

        gr-hbox {
          align-items: center;
        }

        gr-hbox gr-label {
          --label-font-size: 14px;
        }

        gr-label {
          --label-font-size: 12px;
        }

        gr-label[part=helper] {
          padding: 0 0 4px 0;
          --label-color: #6f6f6f;          
        }

        gr-label[part=label] {
          --label-color: #525252;
        }

        input {
          background: none;
          background-color: #f4f4f4;
          border: none;
          border-bottom: solid 1px #8d8d8d;
          box-sizing: border-box;
          color: #161616;
          font-family: 'IBM Plex Sans';
          font-size: 14px;
          height: 40px;
          line-height: 40px;
          margin: 0 0 0 16px;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0 16px 0 16px;
          width: 65px;
        }

        input:focus {
          outline: solid 2px #0f62fe;          
        }

        :host( [light] ) input {
          background-color: #ffffff;
        }

        :host( [light] ) div[part=line] {
          background-color: #c6c6c6;
        }        

        :host( :not( [helper] ) ) gr-label[part=helper] {
          display: none;
        }

        :host( :not( [error] ) ) gr-label[part=error] {
          visibility: hidden;
        }        

        :host( [read-only] ) div[part=handle] {
          display: none;
        }

        :host( [read-only] ) input {
          border-bottom: solid 1px transparent;          
          cursor: default;
        }        

        :host( [read-only] ) input:focus {        
          outline: solid 2px transparent;
        }        
      </style>
      <gr-label part="label" text="Label"></gr-label>      
      <gr-label part="helper" text="Helper"></gr-label>    
      <gr-hbox>
        <gr-label text="0"></gr-label>
        <div part="slider">
          <div part="line"></div>
          <div part="handle"></div>
        </div>
        <gr-label text="100"></gr-label>
        <input value="100">          
      </gr-hbox>
      <gr-label part="error" text="Error"></gr-label>              
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$error = this.shadowRoot.querySelector( 'gr-label[part=error]' );        
    this.$helper = this.shadowRoot.querySelector( 'gr-label[part=helper]' );    
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$label = this.shadowRoot.querySelector( 'gr-label[part=label]' );    
  }

  // When things change
  _render() {
    this.$label.text = this.label;
    this.$helper.text = this.helper;    
    this.$input.readOnly = this.readOnly;
    this.$error.text = this.error === null ? '&nbsp;' : this.error;
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
    this._upgrade( 'helper' );        
    this._upgrade( 'hidden' );    
    this._upgrade( 'hideTextInput' );    
    this._upgrade( 'label' );     
    this._upgrade( 'light' );         
    this._upgrade( 'maximum' );             
    this._upgrade( 'maximumLabel' );             
    this._upgrade( 'minimum' );         
    this._upgrade( 'minimumLabel' );             
    this._upgrade( 'name' );                     
    this._upgrade( 'readOnly' );                         
    this._upgrade( 'value' );                 
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'helper',
      'hidden',
      'hide-text-input',
      'label',
      'light',
      'maximum',
      'maximum-label',
      'minimum',
      'minimum-label',
      'name',
      'read-only',
      'value'
    ];
  }

  // Observed tag attribute has changed
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

  get hideTextInput() {
    return this.hasAttribute( 'hide-text-input' );
  }

  set hideTextInput( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-text-input' );
      } else {
        this.setAttribute( 'hide-text-input', '' );
      }
    } else {
      this.removeAttribute( 'hide-text-input' );
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

  get maximum() {
    if( this.hasAttribute( 'maximum' ) ) {
      return parseInt( this.getAttribute( 'maximum' ) );
    }

    return null;
  }

  set maximum( value ) {
    if( value !== null ) {
      this.setAttribute( 'maximum', value );
    } else {
      this.removeAttribute( 'maximum' );
    }
  }

  get maximumLabel() {
    if( this.hasAttribute( 'maximum-label' ) ) {
      return this.getAttribute( 'maximum-label' );
    }

    return null;
  }

  set maximumLabel( value ) {
    if( value !== null ) {
      this.setAttribute( 'maximum-label', value );
    } else {
      this.removeAttribute( 'maximum-label' );
    }
  }  
  
  get minimum() {
    if( this.hasAttribute( 'minimum' ) ) {
      return parseInt( this.getAttribute( 'minimum' ) );
    }

    return null;
  }

  set minimum( value ) {
    if( value !== null ) {
      this.setAttribute( 'minimum', value );
    } else {
      this.removeAttribute( 'minimum' );
    }
  }  

  get minimumLabel() {
    if( this.hasAttribute( 'minimum-label' ) ) {
      return this.getAttribute( 'minimum-label' );
    }

    return null;
  }

  set minimumLabel( value ) {
    if( value !== null ) {
      this.setAttribute( 'minimum-label', value );
    } else {
      this.removeAttribute( 'minimum-label' );
    }
  }    

  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( value ) {
    if( value !== null ) {
      this.setAttribute( 'name', value );
    } else {
      this.removeAttribute( 'name' );
    }
  }
  
  get readOnly() {
    return this.hasAttribute( 'read-only' );
  }

  set readOnly( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'read-only' );
      } else {
        this.setAttribute( 'read-only', '' );
      }
    } else {
      this.removeAttribute( 'read-only' );
    }
  }

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return parseInt( this.getAttribute( 'value' ) );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }  
}

window.customElements.define( 'gr-slider', GrapheneSlider );
