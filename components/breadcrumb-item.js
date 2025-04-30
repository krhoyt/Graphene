export default class GRBreadcrumbItem extends HTMLElement {
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

        a {
          color: #0f62fe;
          cursor: pointer;
          display: inline-block;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          margin: 0;
          padding: 0;
          text-decoration: none;
          text-rendering: optimizeLegibility;
        }

        a:hover {
          text-decoration: underline;
        }

        p {
          display: inline-block;
          color: #161616;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          margin: 0;
          padding: 0;
          text-decoration: none;
          text-rendering: optimizeLegibility;          
        }

        :host( [is-current-page] ) a {
          display: none;
        }

        :host( :not( [is-current-page] ) ) p {
          display: none;
        }
      </style>      
      <a part="anchor"></a>
      <p part="label"></p>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$anchor = this.shadowRoot.querySelector( 'a' );
    this.$current = this.shadowRoot.querySelector( 'p' );
  }

  // When attributes change
  _render() {
    this.$anchor.textContent = this.textContent;
    this.$current.textContent = this.textContent;
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
    this._upgrade( 'href' );        
    this._upgrade( 'isCurrentPage' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'href',
      'is-current-page'
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
    return this._data;
  }

  set data( value ) {
    this._data = value;
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

  get isCurrentPage() {
    return this.hasAttribute( 'is-current-page' );
  }

  set isCurrentPage( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'is-current-page' );
      } else {
        this.setAttribute( 'is-current-page', '' );
      }
    } else {
      this.removeAttribute( 'is-current-page' );
    }
  }   
}

window.customElements.define( 'gr-breadcrumb-item', GRBreadcrumbItem );
