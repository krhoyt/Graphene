export default class GRFormatNumber extends HTMLElement {
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

        p {
          box-sizing: border-box;
          color: var( --format-number-color, #161616 );
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: var( --format-number-size, 14px );
          font-style: normal;
          font-weight: var( --format-number-weight, 400 );
          line-height: var( --format-number-line-height, 20px );
          margin: 0;
          padding: 0;
          text-align: var( --format-number-text-align, left );
          text-decoration: var( --format-number-text-decoration, none );
          text-rendering: optimizeLegibility;
          width: 100%;          
        }
      </style>
      <p part="label"></p>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p' );
  }

  // When things change
  _render() {
    const options = {};

    options.style = this.type === null ? 'decimal' : this.type;
    options.useGrouping = !this.noGrouping;
    options.currency = this.currency === null ? 'USD' : this.currency;
    options.currencyDisplay = this.currencyDisplay === null ? 'symbol' : this.currencyDisplay;

    if( this.maximumFractionDigits !== null ) options.maximumFractionDigits = this.maximumFractionDigits;    
    if( this.minimumFractionDigits !== null ) options.minimumFractionDigits = this.minimumFractionDigits;    
    if( this.minimumIntegerDigits !== null ) options.minimumIntegerDigits = this.minimumIntegerDigits;    
    if( this.maximumSignificantDigits !== null ) options.maximumSignificantDigits = this.maximumSignificantDigits;    
    if( this.minimumSignificantDigits !== null ) options.minimumSignificantDigits = this.minimumSignificantDigits;         

    const locale = new Intl.Locale( this.lang === null ? navigator.language : this.lang );
    const value = this.value === null ? 0 : this.value;
    const formatter = new Intl.NumberFormat( locale, options );
    this.$label.textContent = formatter.format( value );
  }

  // Properties set before module loaded
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
    this._upgrade( 'currency' );                         
    this._upgrade( 'currencyDisplay' );                         
    this._upgrade( 'data' );                     
    this._upgrade( 'hidden' );     
    this._upgrade( 'lang' );         
    this._upgrade( 'maximumFractionDigits' );                                            
    this._upgrade( 'minimumFractionDigits' );                                            
    this._upgrade( 'minimumIntegerDigits' );                                            
    this._upgrade( 'maximumSignificantDigits' );                                                
    this._upgrade( 'minimumSignificantDigits' );                                            
    this._upgrade( 'noGrouping' );                        
    this._upgrade( 'type' );                            
    this._upgrade( 'value' );                                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'currency',
      'currency-display',
      'hidden',
      'lang',
      'maximum-fraction-digits',
      'minimum-fraction-digits',
      'minimum-integer-digits',
      'maximum-significant-digits',
      'minimum-significant-digits',      
      'no-grouping',
      'type',
      'value'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
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

  get currency() {
    if( this.hasAttribute( 'currency' ) ) {
      return this.getAttribute( 'currency' );
    }

    return null;
  }

  set currency( value ) {
    if( value !== null ) {
      this.setAttribute( 'currency', value );
    } else {
      this.removeAttribute( 'currency' );
    }
  }     

  get currencyDisplay() {
    if( this.hasAttribute( 'currency-display' ) ) {
      return this.getAttribute( 'currency-display' );
    }

    return null;
  }

  set currencyDisplay( value ) {
    if( value !== null ) {
      this.setAttribute( 'currency-display', value );
    } else {
      this.removeAttribute( 'currency-display' );
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

  get maximumFractionDigits() {
    if( this.hasAttribute( 'maximum-fraction-digits' ) ) {
      return parseInt( this.getAttribute( 'maximum-fraction-digits' ) );
    }

    return null;
  }

  set maximumFractionDigits( value ) {
    if( value !== null ) {
      this.setAttribute( 'maximum-fraction-digits', value );
    } else {
      this.removeAttribute( 'maximum-fraction-digits' );
    }
  }
  
  get minimumFractionDigits() {
    if( this.hasAttribute( 'minimum-fraction-digits' ) ) {
      return parseInt( this.getAttribute( 'minimum-fraction-digits' ) );
    }

    return null;
  }

  set minimumFractionDigits( value ) {
    if( value !== null ) {
      this.setAttribute( 'minimum-fraction-digits', value );
    } else {
      this.removeAttribute( 'minimum-fraction-digits' );
    }
  }
  
  get minimumIntegerDigits() {
    if( this.hasAttribute( 'mimimum-integer-digits' ) ) {
      return parseInt( this.getAttribute( 'minimum-integer-digits' ) );
    }

    return null;
  }

  set minimumIntegerDigits( value ) {
    if( value !== null ) {
      this.setAttribute( 'minimum-integer-digits', value );
    } else {
      this.removeAttribute( 'minimum-integer-digits' );
    }
  }

  get maximumSignificantDigits() {
    if( this.hasAttribute( 'maximum-significant-digits' ) ) {
      return parseInt( this.getAttribute( 'maximum-significant-digits' ) );
    }

    return null;
  }

  set maximumSignificantDigits( value ) {
    if( value !== null ) {
      this.setAttribute( 'maximum-significant-digits', value );
    } else {
      this.removeAttribute( 'maximum-significant-digits' );
    }
  }
  
  get minimumSignificantDigits() {
    if( this.hasAttribute( 'minimum-significant-digits' ) ) {
      return parseInt( this.getAttribute( 'minimum-significant-digits' ) );
    }

    return null;
  }

  set minimumSignificantDigits( value ) {
    if( value !== null ) {
      this.setAttribute( 'minimum-significant-digits', value );
    } else {
      this.removeAttribute( 'minimum-significant-digits' );
    }
  }

  get noGrouping() {
    return this.hasAttribute( 'no-grouping' );
  }

  set noGrouping( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'no-grouping' );
      } else {
        this.setAttribute( 'no-grouing', '' );
      }
    } else {
      this.removeAttribute( 'no-grouping' );
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

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return parseFloat( this.getAttribute( 'value' ) );
    }

    return null;
  }

  set value( num ) {
    if( num !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }
}

window.customElements.define( 'gr-format-number', GRFormatNumber );
