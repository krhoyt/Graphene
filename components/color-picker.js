import GRColorArea from "./color-area.js";
import GRColorSlider from "./color-slider.js";
import GRInput from "./input.js";
import GRSelect from "./select.js";
import GRSelectOption from "./select-option.js";

export default class GRColorPicker extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-flex;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        div[part=picker] {
          display: inline-flex; 
          flex-direction: column; 
          gap: 16px; 
          min-width: 280px;
          padding: 16px;
        }

        div[part=picker] > div {
          display: inline-flex; 
          flex-direction: row; 
          gap: 16px;          
        }

        div[part=sample] {
          box-shadow: rgba( 0, 0, 0, 0.20 ) 0px 0px 0px 1px inset; 
          box-sizing: border-box; 
          height: 24px; 
          width: 24px;          
        }

        gr-color-area {
          width: 100%;
        }

        gr-color-slider {
          flex-basis: 0;
          flex-grow: 1;
        }

        gr-input {
          flex-basis: 0;
          flex-grow: 1;
        }
      </style>
      <div part="picker">
        <gr-color-area></gr-color-area>      
        <div> 
          <gr-color-slider direction="horizontal"></gr-color-slider>      
          <div part="sample"></div>
        </div>
        <div>
          <gr-input value="#ff0000"></gr-input>
          <gr-select>
          <gr-select-option label="Hex" value="hex"></gr-select-option>          
            <gr-select-option label="RGB" value="rgb"></gr-select-option>
            <gr-select-option label="HSL" value="hsl"></gr-select-option>
            <gr-select-option label="HSV" value="hsv"></gr-select-option>
          </gr-select>
        </div>
      </div>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$area = this.shadowRoot.querySelector( 'gr-color-area' );
    this.$input = this.shadowRoot.querySelector( 'gr-input' );
    this.$sample = this.shadowRoot.querySelector( 'div[part=sample]' );    
    this.$slider = this.shadowRoot.querySelector( 'gr-color-slider' );
    this.$slider.addEventListener( 'gr-change', ( evt ) => this.$area.hue = evt.detail.value );
  }

  // When attributes change
  _render() {
    const hue = this.$slider.value === null ? 0 : this.$slider.value;
    const saturation = this.$area.saturation === null ? 100 : this.$area.saturation;    
    const luminance = this.$area.luminance === null ? 50 : this.$area.luminance;        
    this.$sample.style.backgroundColor = `hsl( ${hue}deg ${saturation}% ${luminance}% )`;
    this.$input.value = `hsl( ${hue}${hue === 0 ? '' : 'deg'} ${saturation}${saturation === 0 ? '' : '%'} ${luminance}${luminance === 0 ? '' : '%'} )`;
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
      return parseFloat( this.getAttribute( 'value' ) );
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

window.customElements.define( 'gr-color-picker', GRColorPicker );
