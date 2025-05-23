export default class GRFormField extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        div {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
        }

        div[part=header] {
          align-items: flex-end;
          margin: 0 0 4px 0;
        }

        div[part=header] div {
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
        }

        div[part=footer] {
          margin: 4px 0 4px 0;
          min-height: 16px;
        }

        div[part=footer] div {
          align-items: center;
          flex-basis: 0;
          flex-grow: 1;
          gap: 4px;
        }        

        i {
          box-sizing: border-box;
          color: var( --field-icon-color, #da1e28 );
          cursor: var( --field-icon-cursor, default );
          direction: ltr;
          display: inline-block;
          font-family: 'Material Symbols Outlined';
          font-size: var( --field-icon-size, 16px );
          font-style: normal;
          font-variation-settings:
            'FILL' 0,
            'opsz' 16,
            'wght' 400;          
          font-weight: normal;
          height: var( --field-icon-size, 16px );
          letter-spacing: normal;
          line-height: var( --field-icon-size, 16px );
          margin: 0;
          max-height: var( --field-icon-size, 16px );         
          max-width: var( --field-icon-size, 16px );                    
          min-height: var( --field-icon-size, 16px );                               
          min-width: var( --field-icon-size, 16px );
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: var( --field-icon-size, 16px );
          word-wrap: normal;                    
        }        

        p {
          box-sizing: border-box;
          color: #161616;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-feature-settings: 'liga' 1;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.32px;
          line-height: 16px;
          margin: 0;
          padding: 0;
          text-align: left;
          text-decoration: none;
          text-rendering: optimizeLegibility;
          width: 100%;
        }

        p[part=constraints],
        p[part=helper] {
          color: #6f6f6f;          
        }

        p[part=label] {
          color: #525252;          
        }
 

        :host( :not( [helper] ) ) p[part=helper],
        :host( :not( [invalid] ) ) div[part=footer] i,
        :host( :not( [label] ) ) p[part=label] {
          display: none;
        }

        :host( [grow] ) {
          flex-basis: 0;
          flex-grow: 1;
        }

        :host( [invalid] ) div[part=footer] div p {
          color: #da1e28;          
        }        

        :host( [disabled] ) p[part=constraints],
        :host( [disabled] ) p[part=helper],
        :host( [disabled] ) p[part=label] {
          color: #16161640;
        }
      </style>
      <div part="header">
        <div>      
          <p part="label"></p>
          <p part="helper"></p>
        </div>
        <slot name="top"></slot>        
      </div>
      <slot></slot>
      <div part="footer">
        <div>      
          <i>error</i>
          <p part="constraints"></p>
        </div>
        <slot name="bottom"></slot>        
      </div>      
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$constraints = this.shadowRoot.querySelector( 'p[part=constraints]' );    
    this.$helper = this.shadowRoot.querySelector( 'p[part=helper]' );        
    this.$label = this.shadowRoot.querySelector( 'p[part=label]' );
  }

  // When things change
  _render() {
    this.$label.textContent = this.label === null ? '' : this.label;
    this.$helper.textContent = this.helper === null ? '' : this.helper;     
    this.$constraints.textContent = this.invalid ? this.error : this.constraints;
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
    this._upgrade( 'constraints' );
    this._upgrade( 'data' );    
    this._upgrade( 'disabled' );
    this._upgrade( 'error' );
    this._upgrade( 'grow' );    
    this._upgrade( 'helper' );
    this._upgrade( 'hidden' );
    this._upgrade( 'invalid' );    
    this._upgrade( 'label' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'constraints',
      'disabled',
      'error',
      'grow',
      'helper',
      'hidden',
      'invalid',
      'label'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties (Array, Date, Object)
  // Not reflected
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
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

  get constraints() {
    if( this.hasAttribute( 'constraints' ) ) {
      return this.getAttribute( 'constraints' );
    }

    return null;
  }

  set constraints( value ) {
    if( value !== null ) {
      this.setAttribute( 'constraints', value );
    } else {
      this.removeAttribute( 'constraints' );
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

  get grow() {
    return this.hasAttribute( 'grow' );
  }

  set grow( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'grow' );
      } else {
        this.setAttribute( 'grow', '' );
      }
    } else {
      this.removeAttribute( 'grow' );
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
}

window.customElements.define( 'gr-form-field', GRFormField );
