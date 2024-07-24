export default class GRColorSlider extends HTMLElement {
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
          transform: translate( 0, -10px );
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
          background: linear-gradient(
            red 0%,
            #ff0 17%,
            #0f0 33%,
            #0ff 50%,
            #00f 67%,
            #f0f 83%,
            red 100%
          );
          /* border-radius: 4px; */
          box-shadow: rgba( 0, 0, 0, 0.20 ) 0px 0px 0px 1px inset;
          box-sizing: border-box;
          height: 190px;
          position: relative;
          width: 24px;
        }

        :host( [direction=horizontal] ) button {
          left: 0;
          top: 2px;        
          transform: translate( -10px, 0 );
        }

        :host( [direction=horizontal] ) div {
          background: linear-gradient(
            to right,
            red 0%,
            #ff0 17%,
            #0f0 33%,
            #0ff 50%,
            #00f 67%,
            #f0f 83%,
            red 100%
          );          
          height: 24px;
          width: 100%;
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

        :host( [disabled] ) div {
          background: #f4f4f4;
        }
      </style>
      <div part="swatch">
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
    this.$swatch = this.shadowRoot.querySelector( 'div' );
    this.$swatch.addEventListener( 'mousedown', ( evt ) => {
      if( this.disabled ) return;

      this._bounds = this.$swatch.getBoundingClientRect();

      const relative = this.direction === 'horizontal' ? evt.clientX - this._bounds.left : evt.clientY - this._bounds.top;
      const maximum = this.direction === 'horizontal' ? this._bounds.width : this._bounds.height;
      this.value = this.map( relative, 0, maximum, 0, 360 );      

      document.addEventListener( 'mousemove', this.doMouseMove );
      document.addEventListener( 'mouseup', this.doMouseUp );

      this.dispatchEvent( new CustomEvent( 'gr-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );
  }

  map( value, in_min, in_max, out_min, out_max ) {
    return ( value - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
  }

  doMouseMove( evt ) {
    const maximum = this.direction === 'horizontal' ? this._bounds.width : this._bounds.height;

    let relative = this.direction === 'horizontal' ? evt.clientX - this._bounds.left : evt.clientY - this._bounds.top;    
    relative = relative < 0 ? 0 : relative;
    relative = relative > maximum ? maximum : relative;

    this.value = this.map( relative, 0, maximum, 0, 360 );      

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: {
        value: this.value
      }
    } ) );
  }

  doMouseUp( evt ) {
    document.removeEventListener( 'mousemove', this.doMouseMove );
    document.removeEventListener( 'mouseup', this.doMouseUp );

    const maximum = this.direction === 'horizontal' ? this._bounds.width : this._bounds.height;

    let relative = this.direction === 'horizontal' ? evt.clientX - this._bounds.left : evt.clientY - this._bounds.top;    
    relative = relative < 0 ? 0 : relative;
    relative = relative > maximum ? maximum : relative;

    this.value = this.map( relative, 0, maximum, 0, 360 );      
    
    this._bounds = null;    

    this.dispatchEvent( new CustomEvent( 'gr-change', {
      detail: {
        value: this.value
      }
    } ) );        
  }

  // When attributes change
  _render() {
    this.$handle.disabled = this.disabled;

    const hue = this.value === null ? 0 : this.value;
    this.$handle.children[0].style.backgroundColor = `hsl( ${hue}${hue === 0 ? '' : 'deg'} 100% 50% )`;          

    const maximum = this.direction === 'horizontal' ? this.$swatch.clientWidth : this.$swatch.clientHeight;    
    const relative = this.map( this.value, 0, 360, 0, maximum );

    if( this.direction === 'horizontal' ) {
      this.$handle.style.left = `${relative}px`;                    
    } else {
      this.$handle.style.top = `${relative}px`;                    
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
    this._upgrade( 'direction' );
    this._upgrade( 'disabled' );    
    this._upgrade( 'hidden' );
    this._upgrade( 'name' );
    this._upgrade( 'value' );

    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'direction',
      'disabled',
      'hidden',
      'name',
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

  get direction() {
    if( this.hasAttribute( 'direction' ) ) {
      return this.getAttribute( 'direction' );
    }

    return null;
  }

  set direction( value ) {
    if( value !== null ) {
      this.setAttribute( 'direction', value );
    } else {
      this.removeAttribute( 'direction' );
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

window.customElements.define( 'gr-color-slider', GRColorSlider );
