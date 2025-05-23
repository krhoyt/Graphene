export default class GRRelativeTime extends HTMLElement {
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

        :host( [conceealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        p {
          box-sizing: border-box;
          color: #161616;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          margin: 0;
          padding: 0;
          text-align: left;
          text-decoration: none;
          text-rendering: optimizeLegibility;
          width: 100%;
        }
      </style>
      <p part="label"></p>
    `;

    // Private
    this._data = null;
    this._interval = null;

    // Thanks to Shoelace
    // https://github.com/shoelace-style/shoelace/blob/next/src/components/relative-time/relative-time.component.ts
    this._units = [
      {max: 2760000, value: 60000, unit: 'minute' }, // max 46 minutes
      {max: 72000000, value: 3600000, unit: 'hour' }, // max 20 hours
      {max: 518400000, value: 86400000, unit: 'day' }, // max 6 days
      {max: 2419200000, value: 604800000, unit: 'week' }, // max 28 days
      {max: 28512000000, value: 2592000000, unit: 'month' }, // max 11 months
      {max: Infinity, value: 31536000000, unit: 'year' }
    ];

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p' );
  }

  // When attributes change
  _render() {
    const format = this.format === null ? 'long' : this.format;
    const now = new Date();    
    const numeric = this.numeric === null ? 'auto' : this.numeric;
    const relative = new Intl.RelativeTimeFormat( this.lang === null ? navigator.language : this.lang, {style: format, numeric: numeric} );
    const then = this.date === null ? new Date() : this.dateAsObject;
    const diff = then.getTime() - now.getTime();
    
    const range = this._units.find( ( item ) => Math.abs( diff ) < item.max );
    this.$label.innerText = relative.format( Math.round( diff / range.value ), range.unit );

    if( this.sync ) {
      if( this._interval === null ) {
        this._interval = setInterval( () => {
          this._render();
        }, 1000 );
      }
    } else {
      if( this._interval !== null ) {
        clearInterval( this._interval );
        this._interval = null;
      }
    }   
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
    this._upgrade( 'date' );        
    this._upgrade( 'dateAsObject' );        
    this._upgrade( 'format' );                     
    this._upgrade( 'hidden' );    
    this._upgrade( 'lang' );    
    this._upgrade( 'numeric' );                         
    this._upgrade( 'sync' );                             
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'format',
      'lang',
      'numeric',
      'sync'
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

  get dateAsObject() {
    return this.date === null ? null : new Date( Date.parse( this.date ) );
  }
  
  set dateAsObject( value ) {
    this.date = value === null ? null : value.toString();
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

  get date() {
    if( this.hasAttribute( 'date' ) ) {
      return this.getAttribute( 'date' );
    }

    return null;
  }

  set date( value ) {
    if( value !== null ) {
      this.setAttribute( 'date', value );
    } else {
      this.removeAttribute( 'date' );
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
  
  get format() {
    if( this.hasAttribute( 'format' ) ) {
      return this.getAttribute( 'format' );
    }

    return null;
  }

  set format( value ) {
    if( value !== null ) {
      this.setAttribute( 'format', value );
    } else {
      this.removeAttribute( 'format' );
    }
  }

  get lang() {
    if( this.hasAttribute( 'lang' ) ) {
      return this.getAttribute( 'lang' );
    }

    return null;
  }

  set lang( value ) {
    if( value !== null ) {
      this.setAttribute( 'lang', value );
    } else {
      this.removeAttribute( 'lang' );
    }
  }  
  
  get numeric() {
    if( this.hasAttribute( 'numeric' ) ) {
      return this.getAttribute( 'numeric' );
    }

    return null;
  }

  set numeric( value ) {
    if( value !== null ) {
      this.setAttribute( 'numeric', value );
    } else {
      this.removeAttribute( 'numeric' );
    }
  }  

  get sync() {
    return this.hasAttribute( 'sync' );
  }

  set sync( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'sync' );
      } else {
        this.setAttribute( 'sync', '' );
      }
    } else {
      this.removeAttribute( 'sync' );
    }
  }
}

window.customElements.define( 'gr-relative-time', GRRelativeTime );
