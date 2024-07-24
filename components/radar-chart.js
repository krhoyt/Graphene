export default class GrapheneRadarChart extends HTMLElement {
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

        canvas {
          box-sizing: border-box;
          display: inline-block;
          margin: 0;
          padding: 0;
        }

        p {
          box-sizing: border-box;
          font-family: 'IBM Plex Sans';
          font-size: 12px;
          left: 0;
          margin: 0;
          padding: 0;
          position: absolute;
          top: 0;
          visibility: hidden;
          z-index: -100;
        }
      </style>
      <canvas></canvas>
      <p>Label</p>
    `;

    // Private 
    this._data = [];
    this._label = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$canvas = this.shadowRoot.querySelector( 'canvas' );
    this.$label = this.shadowRoot.querySelector( 'p' );

    const face = new FontFace( 'IBM Plex Sans', 'url( /fonts/Plex/Sans/IBMPlexSans-Regular.woff2 )' );
    face.load().then( ( font ) => {
      document.fonts.add( font );
      this._render();
    } );    
  }

  _map( x, in_min, in_max, out_min, out_max ) {
    return ( x - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
  }    

   // When attributes change
  _render() {
    const width = this.width === null ? 350 : this.width;
    const height = this.height === null ? 300 : this.height;
    const dpr = window.devicePixelRatio;

    const circles = this.circles;
    const hollow = this.hollow;
    const label_gap = this.labelGap === null ? 12 : this.labelGap;
    const label_height = this.$label.clientHeight;
    const labels = !this.hideLabels;
    const label_color = this.labelColor === null ? '#525252' : this.labelColor;
    const levels = this.levels === null ? 5 : this.levels;   
    const level_color = this.levelColor === null ? '#e0e0e0' : this.levelColor;
    const spoke_color = this.spokeColor === null ? '#e0e0e0' : this.spokeColor; 

    // Device pixel ratio
    this.$canvas.width = width * dpr;
    this.$canvas.height = height * dpr;
    this.$canvas.style.width = `${width}px`;
    this.$canvas.style.height = `${height}px`;    

    const context = this.$canvas.getContext( '2d' );
    context.scale( dpr, dpr );
    context.font = '12px "IBM Plex Sans"';
    context.fillStyle = label_color;

    // NOTE: -2 for line thickness
    // NOTE: Keeps inside canvas rendering area when point to draw is zero
    const diameter = Math.min( width, height ) - 2;
    const labeling = labels ? ( label_height + label_gap ) * 2 : 0;
    const radius = ( diameter - labeling ) / 2;
    const center = {
      x: ( width / 2 ),
      y: ( height / 2 )
    };

    let spokes = 5;
    let step = radius / levels;
    let offset = hollow ? step / 2 : 0;
    step = offset === 0 ? step : ( radius - offset ) / levels;

    const slice = ( 360 / spokes ) * ( Math.PI / 180 );

    context.clearRect( 0, 0, width, height );

    // Spokes                
    for( let s = 0; s < spokes; s++ ) {
      const start_x = offset * Math.sin( slice * s );
      const start_y = offset * ( 0 - Math.cos( slice * s ) );

      const end_x = radius * Math.sin( slice * s );
      const end_y = radius * ( 0 - Math.cos( slice * s ) );

      context.beginPath();
      context.strokeStyle = spoke_color;      
      context.moveTo( center.x + start_x, center.y + start_y );
      context.lineTo( center.x + end_x, center.y + end_y );
      context.stroke();
    }

    // Levels (polygons or circles)
    for( let p = 0; p < levels + 1; p++ ) {
      context.moveTo( center.x, center.y + offset + ( step * p ) );
      context.beginPath();
      context.strokeStyle = level_color;      

      if( circles ) {
        context.arc( center.x, center.y, offset + ( step * p ), 0, 2 * Math.PI );
      } else {
        context.lineCap = 'round';
        context.lineJoin = 'round';
  
        // Edges
        for( let e = 0; e < spokes; e++ ) {
          const x = ( ( p * step ) + offset ) * Math.sin( slice * e );
          const y = ( ( p * step ) + offset ) * ( 0 - Math.cos( slice * e ) );
          context.lineTo( center.x + x, center.y + y );
        }
    
        context.closePath();
      }

      context.stroke();
    }

    // Labels
    if( labels ) {
      for( let s = 0; s < spokes; s++ ) {
        const label_x = ( radius + label_gap ) * Math.sin( slice * s );
        const label_y = ( radius + label_gap ) * ( 0 - Math.cos( slice * s ) );
  
        const degrees = ( slice * s ) * ( 180 / Math.PI );
  
        if( degrees === 0 ) {
          context.textAlign = 'center';
          context.textBaseline = 'alphabetic';        
        } else if( degrees > 0 && degrees < 90 ) {
          context.textAlign = 'start';
          context.textBaseline = 'alphabetic';                
        }  else if( degrees === 90 ) {
          context.textAlign = 'start';
          context.textBaseline = 'middle';        
        } else if( degrees > 90 && degrees < 180 ) {
          context.textAlign = 'start';
          context.textBaseline = 'top';        
        } else if( degrees === 180 ) {
          context.textAlign = 'center';        
          context.textBaseline = 'top';                
        } else if( degrees > 90 && degrees < 270 ) {
          context.textAlign = 'end';
          context.textBaseline = 'top';                
        } else if( degrees === 270 ) {
          context.textAlign = 'end'; 
          context.textBaseline = 'middle';                               
        } else if( degrees > 270 && degrees < 360 ) {
          context.textAlign = 'end';
          context.textBaseline = 'alphabetic';                                
        }

        const formatted = this._label === null ? 'Label' : this._label( 'Label', s );
        context.fillText( formatted, center.x + label_x, center.y + label_y );               
      }
    }

    // Plots
    if( this._data.length > 0 ) {
      const value_field = this.valueField === null ? 'value' : this.valueField;
      const group_field = this.groupField === null ? 'group' : this.groupField;

      const maximum = this.maximum === null ? this._data.reduce( ( acc, value ) => value[value_field] > acc ? value[value_field] : acc, 0 ) : this.maximum;
      const minimum = this.minimum === null ? this._data.reduce( ( acc, value ) => value[value_field] < acc ? value[value_field] : acc, maximum ) : this.minimum;

      if( !this.hideValues ) {
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText( minimum, center.x, center.y - offset );
        context.fillText( maximum, center.x, center.y - radius );      
      }

      let group = null;

      context.lineWidth = 1.5;
      context.strokeStyle = '#6929c4';
      context.fillStyle = '#6929c4' + '4c';

      for( let d = 0; d < this._data.length; d++ ) {
        const x = ( this._map( this._data[d][value_field], minimum, maximum, offset, radius ) ) * Math.sin( slice * d );
        const y = ( this._map( this._data[d][value_field], minimum, maximum, offset, radius ) ) * ( 0 - Math.cos( slice * d ) );

        if( group === null ) {
          group = this._data[d][group_field];
          context.moveTo( center.x + x, center.y + y );
          context.beginPath();
        }

        if( group !== this._data[d][group_field] ) {
          group = this._data[d][group_field];
          context.closePath();
          context.stroke();
          context.fill();
          context.moveTo( center.x + x, center.y + y );
          context.beginPath();          
        }

        context.lineTo( center.x + x, center.y + y );
      }

      context.closePath();
      context.stroke();
      context.fill();
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
    this._upgrade( 'angleField' );
    this._upgrade( 'circles' );    
    this._upgrade( 'data' );        
    this._upgrade( 'groupField' );     
    this._upgrade( 'height' );     
    this._upgrade( 'hidden' );    
    this._upgrade( 'hideLabels' );    
    this._upgrade( 'hideValues' );    
    this._upgrade( 'hollow' );  
    this._upgrade( 'labelColor' );        
    this._upgrade( 'labelFunction' );            
    this._upgrade( 'labelGap' );
    this._upgrade( 'levels' );  
    this._upgrade( 'levelColor' );        
    this._upgrade( 'maximum' );  
    this._upgrade( 'minimum' );  
    this._upgrade( 'spokeColor' );            
    this._upgrade( 'valueField' );        
    this._upgrade( 'width' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'angle-field',
      'circles',
      'group-field',
      'height',
      'hidden',
      'hide-labels',
      'hide-values',
      'hollow',
      'label-color',
      'label-gap',
      'levels',
      'level-color',
      'maximum',
      'minimum',
      'spoke-color',
      'value-field',
      'width'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Properties
  // Not reflected
  // Object, Date, Array
  set data( value ) {
    this._data = value === null ? [] : [... value];
    this._render();
  }

  get data() {
    return this._data;
  }

  set labelFunction( func ) {
    this._label = func;
    this._render();
  }

  get labelFunction() {
    return this._label;
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get angleField() {
    if( this.hasAttribute( 'angle-field' ) ) {
      return this.getAttribute( 'angle-field' );
    }

    return null;
  }

  set angleField( value ) {
    if( value !== null ) {
      this.setAttribute( 'angle-field', value );
    } else {
      this.removeAttribute( 'angle-field' );
    }
  }

  get circles() {
    return this.hasAttribute( 'circles' );
  }

  set circles( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'circles' );
      } else {
        this.setAttribute( 'circles', '' );
      }
    } else {
      this.removeAttribute( 'circles' );
    }
  }     

  get groupField() {
    if( this.hasAttribute( 'group-field' ) ) {
      return this.getAttribute( 'group-field' );
    }

    return null;
  }

  set groupField( value ) {
    if( value !== null ) {
      this.setAttribute( 'group-field', value );
    } else {
      this.removeAttribute( 'group-field' );
    }
  }  

  get height() {
    if( this.hasAttribute( 'height' ) ) {
      return parseInt( this.getAttribute( 'height' ) );
    }

    return null;
  }

  set height( value ) {
    if( value !== null ) {
      this.setAttribute( 'height', value );
    } else {
      this.removeAttribute( 'height' );
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

  get hideLabels() {
    return this.hasAttribute( 'hide-labels' );
  }

  set hideLabels( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-labels' );
      } else {
        this.setAttribute( 'hide-labels', '' );
      }
    } else {
      this.removeAttribute( 'hide-labels' );
    }
  }
  
  get hideValues() {
    return this.hasAttribute( 'hide-values' );
  }

  set hideValues( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-values' );
      } else {
        this.setAttribute( 'hide-values', '' );
      }
    } else {
      this.removeAttribute( 'hide-values' );
    }
  }  

  get hollow() {
    return this.hasAttribute( 'hollow' );
  }

  set hollow( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hollow' );
      } else {
        this.setAttribute( 'hollow', '' );
      }
    } else {
      this.removeAttribute( 'hollow' );
    }
  }     

  get labelColor() {
    if( this.hasAttribute( 'label-color' ) ) {
      return this.getAttribute( 'label-color' );
    }

    return null;
  }

  set labelColor( value ) {
    if( value !== null ) {
      this.setAttribute( 'label-color', value );
    } else {
      this.removeAttribute( 'label-color' );
    }
  }    

  get labelGap() {
    if( this.hasAttribute( 'label-gap' ) ) {
      return parseInt( this.getAttribute( 'label-gap' ) );
    }

    return null;
  }

  set labelGap( value ) {
    if( value !== null ) {
      this.setAttribute( 'label-gap', value );
    } else {
      this.removeAttribute( 'label-gap' );
    }
  }  

  get levels() {
    if( this.hasAttribute( 'levels' ) ) {
      return parseInt( this.getAttribute( 'levels' ) );
    }

    return null;
  }

  set levels( value ) {
    if( value !== null ) {
      this.setAttribute( 'levels', value );
    } else {
      this.removeAttribute( 'levels' );
    }
  }

  get levelColor() {
    if( this.hasAttribute( 'level-color' ) ) {
      return this.getAttribute( 'level-color' );
    }

    return null;
  }

  set levelColor( value ) {
    if( value !== null ) {
      this.setAttribute( 'level-color', value );
    } else {
      this.removeAttribute( 'level-color' );
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

  get spokeColor() {
    if( this.hasAttribute( 'spoke-color' ) ) {
      return this.getAttribute( 'spoke-color' );
    }

    return null;
  }

  set spokeColor( value ) {
    if( value !== null ) {
      this.setAttribute( 'spoke-color', value );
    } else {
      this.removeAttribute( 'spoke-color' );
    }
  }

  get valueField() {
    if( this.hasAttribute( 'value-field' ) ) {
      return this.getAttribute( 'value-field' );
    }

    return null;
  }

  set valueField( value ) {
    if( value !== null ) {
      this.setAttribute( 'value-field', value );
    } else {
      this.removeAttribute( 'value-field' );
    }
  }  

  get width() {
    if( this.hasAttribute( 'width' ) ) {
      return parseInt( this.getAttribute( 'width' ) );
    }

    return null;
  }

  set width( value ) {
    if( value !== null ) {
      this.setAttribute( 'width', value );
    } else {
      this.removeAttribute( 'width' );
    }
  }  
}

window.customElements.define( 'gr-radar-chart', GrapheneRadarChart );
