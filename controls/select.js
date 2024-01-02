import GrapheneHBox from "../containers/hbox.js";
import GrapheneVBox from "../containers/vbox.js";

import GrapheneIcon from "./icon.js";
import GrapheneLabel from "./label.js";

export default class GrapheneSelect extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
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

        gr-label[part=alternate] {
          display: none;
        }

        gr-label[part=alternate]::part( label ) {
          background-color: #f4f4f4;
          color: #161616;          
          height: 40px;
          line-height: 40px;
          padding: 0 44px 0 12px;
        }        

        gr-label[part=error] {
          padding: 4px 0 0 0;     
          visibility: hidden;               
          --label-color: #6f6f6f;          
          --label-font-size: 12px;
        }

        gr-label[part=helper] {
          padding: 0 0 4px 0;
          --label-color: #6f6f6f;
          --label-font-size: 12px;
        }

        gr-label[part=label] {
          flex-basis: 0;
          flex-grow: 1;          
          --label-color: #525252;
          --label-font-size: 12px;
        }

        select {
          appearance: none;
          background: none;
          background-color: #f4f4f4;
          border: none;
          border-bottom: solid 1px #8d8d8d;
          box-sizing: border-box; 
          color: #161616;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          height: 40px;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0 48px 0 12px;
          text-overflow: ellipsis;
          text-rendering: optimizeLegibility;
          -webkit-tap-highlight-color: transparent;                    
        }

        select:hover {
          background-color: #e8e8e8;
        }

        select:focus {
          outline: solid 2px #0f62fe;          
        }     

        :host( :not( [label] ) ) gr-hbox {
          display: none;
        }

        :host( [disabled] ) select {
          border-bottom: solid 1px transparent;
          color: #c6c6c6;
          cursor: not-allowed;
        }

        :host( [disabled] ) select:hover {
          background-color: #f4f4f4;
        }        

        :host( [disabled] ) gr-label[part=error],
        :host( [disabled] ) gr-label[part=helper],
        :host( [disabled] ) gr-label[part=label] {
          --label-color: #16161640;
        }

        :host( [disabled][invalid] ) gr-label[part=error] {
          --label-color: #da1e28;
        }
        
        :host( [error] ) gr-label[part=error] {
          visibility: visible;
        }

        :host( [invalid] ) gr-label[part=error] {
          --label-color: #da1e28;
        }

        :host( [invalid] ) select {
          outline: solid 2px #da1e28;
        }

        :host( [invalid] ) select:focus {
          outline: solid 2px #0f62fe;
        }

        :host( [light] ) select {
          background-color: #ffffff;
        }

        :host( [read-only] ) select {
          display: none;
        }

        :host( [read-only] ) gr-label[part=alternate] {
          display: inline-block;
        }        

        :host( [read-only] ) select:hover {
          background-color: #f4f4f4;
        }        
      </style>
      <gr-hbox part="header">
        <gr-vbox>
          <gr-label part="label"></gr-label>
          <gr-label part="helper"></gr-label>
        </gr-vbox>
        <slot></slot>
      </gr-hbox>      
      <select></select>
      <gr-label part="alternate"></gr-label>
      <gr-label part="error"></gr-label>      
    `;

    // Private
    this._provider = [];

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$alternate = this.shadowRoot.querySelector( 'gr-label[part=alternate]' );        
    this.$error = this.shadowRoot.querySelector( 'gr-label[part=error]' );    
    this.$helper = this.shadowRoot.querySelector( 'gr-label[part=helper]' ); 
    this.$label = this.shadowRoot.querySelector( 'gr-label[part=label]' );    
    this.$select = this.shadowRoot.querySelector( 'select' );
    this.$select.addEventListener( 'change', () => {
      this.value = this.$select.value;
      this.dispatchEvent( new CustomEvent( 'gr-change', {
        detail: {
          selectedIndex: this.selectedIndex,
          selectedOptions: this.selectedOptions,
          value: this.value
        }
      } ) );
    } );
  }

  blur() {
    this.$select.blur();
  }

  focus() {
    this.$select.focus();
  }

   // When attributes change
  _render() {
    this.$label.text = this.label;
    this.$helper.text = this.helper;
    this.$select.disabled = this.disabled;
    this.$select.value = this.value;
    this.$alternate.text = this.value;
    this.$error.text = this.error;
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
    this._upgrade( 'error' );        
    this._upgrade( 'helper' );                          
    this._upgrade( 'hidden' );    
    this._upgrade( 'invalid' );        
    this._upgrade( 'label' );        
    this._upgrade( 'light' );        
    this._upgrade( 'name' );            
    this._upgrade( 'provider' );        
    this._upgrade( 'readOnly' );    
    this._upgrade( 'selectedIndex' );   
    this._upgrade( 'selectedOptions' );             
    this._upgrade( 'value' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'error',
      'helper',
      'hidden',
      'invalid',
      'label',
      'light',
      'name',
      'read-only',
      'value'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Properties
  // Not reflected
  get provider() {
    return this._provider.length === 0 ? null : this._provider;
  }

  set provider( value ) {
    this._provider = value === null ? [] : [... value];
    
    while( this.$select.children.length > this._provider.length )
      this.$select.children[0].remove();

    while( this.$select.children.length < this._provider.length ) {
      const option = document.createElement( 'option' );
      this.$select.appendChild( option );
    }

    for( let p = 0; p < this._provider.length; p++ ) {
      this.$select.children[p].innerText = this._provider[p];
    }

    this.$select.value = null;
    this.value = null;
  }

  get selectedIndex() {
    return this.$select.selectedIndex;
  }

  set selectedIndex( value ) {
    this.$select.selectedIndex = value;
    this.$alternate.text = this.$select.value;
  }

  get selectedOptions() {
    return this.$select.selectedOptions;
  }

  set selectedOptions( value ) {
    this.$select.selectedOptions = value;
    this.$alternate.text = this.$select.value;    
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

  get error() {
    if( this.hasAttribute( 'error' ) ) {
      return this.getAttribute( 'error' );
    }

    return null;
  }

  set error( value ) {
    if( value !== null ) {
      this.setAttribute( 'error', value );
    } else {
      this.removeAttribute( 'error' );
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

  get invalid() {
    return this.hasAttribute( 'invalid' );
  }

  set invalid( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'invalid' );
      } else {
        this.setAttribute( 'invalid', '' );
      }
    } else {
      this.removeAttribute( 'invalid' );
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
      return this.getAttribute( 'value' );
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

window.customElements.define( 'gr-select', GrapheneSelect );
