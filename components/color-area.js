export default class GRColorArea extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          height: 190px;
          position: relative;
          width: 190px;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          appearance: none;
          background: #ffffff;          
          border: solid 1px #8d8d8d;
          border-radius: 20px;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 20px;
          justify-content: center;
          left: 2px;
          margin: 0;
          padding: 0;
          position: absolute;
          transform: translate( -10px, -10px );
          width: 20px;
        }

        button span {
          background-color: red;
          border-radius: 14px;
          box-shadow: rgba( 0, 0, 0, 0.20 ) 0px 0px 0px 1px inset;
          box-sizing: border-box;
          height: 14px;
          width: 14px;
        }

        div {
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        div[part=swatch] {
          box-shadow: rgba( 0, 0, 0, 0.20 ) 0px 0px 0px 1px inset;          
        }

        div[part=swatch] div:first-of-type {
          background-image: linear-gradient( 
            to right, 
            rgb( 255, 255, 255 ) 0%, 
            rgba( 255, 255, 255, 0 ) 100% 
          );          
        }

        div[part=swatch] div:last-of-type {   
          background-image: linear-gradient( 
            rgba( 0, 0, 0, 0 ) 0%, 
            rgb( 0, 0, 0 ) 100% 
          );               
        }

        :host( [disabled] ) button {
          background-color: #f4f4f4;
          border: solid 1px #16161640;
          cursor: not-allowed;
        }

        :host( [disabled] ) span {
          background-color: #f4f4f4;
          border: solid 1px transparent;
          box-shadow: none;
        }        

        :host( [disabled] ) div[part=swatch] {
          background-color: #f4f4f4;
        }

        :host( [disabled] ) div:not( [part=swatch] ) {
          display: none;
        }
      </style>
      <div part="swatch">
        <div></div>
        <div></div>
        <button part="handle" type="button">
          <span></span>
        </button>
      </div>
    `;

    // Events
    this.doMouseMove = this.doMouseMove.bind( this );
    this.doMouseUp = this.doMouseUp.bind( this );    

    // Private
    this._bounds = null;
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements 
    this.$handle = this.shadowRoot.querySelector( 'button' );
    this.$swatch = this.shadowRoot.querySelector( 'div[part=swatch]' );
    this.$swatch.addEventListener( 'mousedown', ( evt ) => {
      if( this.disabled ) return;

      this._bounds = this.$swatch.getBoundingClientRect();

      const relativeX = evt.clientX - this._bounds.left;
      const relativeY = evt.clientY - this._bounds.top;
      
      this.saturation = Math.round( 100 * ( relativeX / this._bounds.width ) );
      this.brightness = Math.round( 100 * ( 1 - ( relativeY / this._bounds.height ) ) );

      document.addEventListener( 'mousemove', this.doMouseMove );
      document.addEventListener( 'mouseup', this.doMouseUp );

      this.dispatchEvent( new CustomEvent( 'gr-change', {
        detail: {
          hue: this.hue === null ? 0 : this.hue,
          saturation: this.saturation,
          brightness: this.brightness
        }
      } ) );      
    } );
  }

  map( value, in_min, in_max, out_min, out_max ) {
    return ( value - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
  }    

  doMouseMove( evt ) {
    let relativeX = evt.clientX - this._bounds.left;
    relativeX = relativeX > this._bounds.width ? this._bounds.width : relativeX;
    relativeX = relativeX < 0 ? 0 : relativeX;

    let relativeY = evt.clientY - this._bounds.top;
    relativeY = relativeY > this._bounds.height ? this._bounds.height : relativeY;
    relativeY = relativeY < 0 ? 0 : relativeY;    
    
    this.saturation = Math.round( 100 * ( relativeX / this._bounds.width ) );
    this.brightness = Math.round( 100 * ( 1 - ( relativeY / this._bounds.height ) ) );

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: {
        hue: this.hue === null ? 0 : this.hue,
        saturation: this.saturation,
        brightness: this.brightness
      }
    } ) );
  }

  doMouseUp( evt ) {
    document.removeEventListener( 'mousemove', this.doMouseMove );
    document.removeEventListener( 'mouseup', this.doMouseUp );

    let relativeX = evt.clientX - this._bounds.left;
    relativeX = relativeX > this._bounds.width ? this._bounds.width : relativeX;
    relativeX = relativeX < 0 ? 0 : relativeX;

    let relativeY = evt.clientY - this._bounds.top;
    relativeY = relativeY > this._bounds.height ? this._bounds.height : relativeY;
    relativeY = relativeY < 0 ? 0 : relativeY;    

    this.saturation = Math.round( 100 * ( relativeX / this._bounds.width ) );
    this.brightness = Math.round( 100 * ( 1 - ( relativeY / this._bounds.height ) ) );

    this._bounds = null;    

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: {
        hue: this.hue === null ? 0 : this.hue,
        saturation: this.saturation,
        brightness: this.brightness
      }
    } ) );        
  }  

  // When attributes change
  _render() {
    this.$handle.disabled = this.disabled;

    if( !this.disabled ) {
      const hue = this.hue === null ? 0 : this.hue;
      this.$swatch.style.backgroundColor = `hsl( ${hue} 100% 50% )`;

      const saturation = this.saturation === null ? 0 : this.saturation;
      const brightness = this.brightness === null ? 0 : this.brightness;

      const left = this.map( saturation, 0, 100, 0, this.$swatch.clientWidth );
      const top = this.map( 100 - brightness, 0, 100, 0, this.$swatch.clientHeight );

      this.$handle.style.left = `${left}px`;                     
      this.$handle.style.top = `${top}px`;                     
      this.$handle.children[0].style.backgroundColor = this.valueAsHSL;
    } else {
      this.$handle.style.left = `0`;                     
      this.$handle.style.top = `0`;                     
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
    this._upgrade( 'brightness' );        
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );
    this._upgrade( 'disabled' );    
    this._upgrade( 'hidden' );
    this._upgrade( 'hue' );
    this._upgrade( 'name' );
    this._upgrade( 'saturation' );    
    this._upgrade( 'valueAsHex' );        
    this._upgrade( 'valueAsHSL' );    
    this._upgrade( 'valueAsHSV' );
    this._upgrade( 'valueAsRGB' );    

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'brightness',
      'concealed',
      'disabled',
      'hidden',
      'hue',
      'name',
      'saturation',
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
  // Array, Date, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  get valueAsHex() {
    const hue = ( this.hue === null ? 0 : this.hue ) / 360;
    const saturation = ( this.saturation === null ? 0 : this.saturation ) / 100;
    const brightness = ( this.brightness === null ? 100 : this.brightness ) / 100;

    let i = Math.floor( hue * 6 );
    let f = hue * 6 - i;
    let p = brightness * ( 1 - saturation );
    let q = brightness * ( 1 - f * saturation );
    let t = brightness * ( 1 - ( 1 - f ) * saturation );

    let red = 0;
    let green = 0;
    let blue = 0;
    
    switch( i % 6 ) {
      case 0: 
        red = brightness;
        green = t;
        blue = p; 
        break;        
      case 1: 
        red = q; 
        green = brightness; 
        blue = p; 
        break;
      case 2: 
        red = p;
        green = brightness;
        blue = t; 
        break;
      case 3: 
        red = p;
        green = q;
        blue = brightness; 
        break;
      case 4: 
        red = t;
        green = p;
        blue = brightness; 
        break;
      case 5: 
        red = brightness;
        green = p
        blue = q; 
        break;
    }

    red = Math.round( 255 * red ).toString( 16 ).padStart( 2, '0' );
    green = Math.round( 255 * green ).toString( 16 ).padStart( 2, '0' );    
    blue = Math.round( 255 * blue ).toString( 16 ).padStart( 2, '0' );    

    return `#${red}${green}${blue}`;        
  }

  get valueAsHSL() {
    const hue = this.hue === null ? 0 : this.hue;
    
    let saturation = this.saturation === null ? 0 : this.saturation;
    let brightness = this.brightness === null ? 100 : this.brightness;   
    
    const x = ( 200 - saturation ) * brightness / 100;
    
    saturation = x === 0 || x === 200 ? 0 : Math.round( saturation * brightness / ( x <= 100 ? x : 200 - x ) );
    brightness = Math.round( x / 2 );    

    return `hsl( ${hue}${hue === 0 ? '' : 'deg'}, ${saturation}${saturation === 0 ? '' : '%'}, ${brightness}${brightness === 0 ? '' : '%'} )`;
  }

  get valueAsHSV() {
    const hue = this.hue === null ? 0 : this.hue;
    const saturation = this.saturation === null ? 0 : this.saturation;
    const brightness = this.brightness === null ? 100 : this.brightness;

    return `hsv( ${hue}${hue === 0 ? '' : 'deg'}, ${saturation}${saturation === 0 ? '' : '%'}, ${brightness}${brightness === 0 ? '' : '%'} )`;
  }

  get valueAsRGB() {
    const hue = ( this.hue === null ? 0 : this.hue ) / 360;
    const saturation = ( this.saturation === null ? 0 : this.saturation ) / 100;
    const brightness = ( this.brightness === null ? 100 : this.brightness ) / 100;

    let i = Math.floor( hue * 6 );
    let f = hue * 6 - i;
    let p = brightness * ( 1 - saturation );
    let q = brightness * ( 1 - f * saturation );
    let t = brightness * ( 1 - ( 1 - f ) * saturation );

    let red = 0;
    let green = 0;
    let blue = 0;
    
    switch( i % 6 ) {
      case 0: 
        red = brightness;
        green = t;
        blue = p; 
        break;        
      case 1: 
        red = q; 
        green = brightness; 
        blue = p; 
        break;
      case 2: 
        red = p;
        green = brightness;
        blue = t; 
        break;
      case 3: 
        red = p;
        green = q;
        blue = brightness; 
        break;
      case 4: 
        red = t;
        green = p;
        blue = brightness; 
        break;
      case 5: 
        red = brightness;
        green = p
        blue = q; 
        break;
    }

    return `rgb( ${Math.round( red * 255 )}, ${Math.round( green * 255)}, ${Math.round( blue * 255 )} )`;    
  }
 
  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get brightness() {
    if( this.hasAttribute( 'brightness' ) ) {
      return parseInt( this.getAttribute( 'brightness' ) );
    }

    return null;
  }

  set brightness( value ) {
    if( value !== null ) {
      this.setAttribute( 'brightness', value );
    } else {
      this.removeAttribute( 'brightness' );
    }
  }

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

  get hue() {
    if( this.hasAttribute( 'hue' ) ) {
      return parseInt( this.getAttribute( 'hue' ) );
    }

    return null;
  }

  set hue( value ) {
    if( value !== null ) {
      this.setAttribute( 'hue', value );
    } else {
      this.removeAttribute( 'hue' );
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

  get saturation() {
    if( this.hasAttribute( 'saturation' ) ) {
      return parseInt( this.getAttribute( 'saturation' ) );
    }

    return null;
  }

  set saturation( value ) {
    if( value !== null ) {
      this.setAttribute( 'saturation', value );
    } else {
      this.removeAttribute( 'saturation' );
    }
  }  
}

window.customElements.define( 'gr-color-area', GRColorArea );
