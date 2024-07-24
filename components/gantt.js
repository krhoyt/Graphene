import GRGanttCard from "./gantt-card.js";
import GRGanttTask from "./gantt-task.js";

export default class GRGantt extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        circle {
          fill: #0047d7;
        }

        .bar {
          fill: #8e8e8d;
          stroke: none;
          height: 3px;
          y: 37px;
          width: 200px;
        }

        .gap {
          fill: #ffffff;
          stroke: none;
          height: 3px;
          width: 2px;
          y: 37px;
          x: 99px;
        }

        .helper {
          dominant-baseline: middle;
          fill: #8e8e8d;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;          
          text-anchor: end;
        }

        .label {
          dominant-baseline: middle;
          fill: #161616;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
        }

        .milestone {
          fill: #0047d7;
          stroke: #0047d7;
          stroke-width: 1.5px;
          transform: translate( 50%, 50% ) rotate( 45deg );
          y: 39px;
          height: 5px;
          width: 5px;
          x: 10px;
          transform-box: fill-box;
        }

        .milestone2 {
          fill: none;
          stroke: #0047d7;
          stroke-width: 1.5px;
          transform: translate( 50%, 50% ) rotate( 45deg );
          y: 39px;
          height: 5px;
          width: 5px;
          x: 150px;
          transform-box: fill-box;
        }        

        .progress {
          fill: #0047d7;
          stroke: none;
          height: 3px;
          y: 37px;
          width: 99px;
        }

        .task {
          fill: #cce3ff;
          stroke: #8e8e8d;
          stroke-width: 1px;
          height: 40px;
          width: 200px;
        }
      </style>
      <gr-gantt-card></gr-gantt-card>
      <gr-gant-task></gr-gantt-task>
      <!--
      <svg>
        <g>
          <rect class="task"></rect>
          <rect class="bar"></rect>
          <rect class="progress"></rect>
          <rect class="gap"></rect>
          <circle r="8" cx="20" cy="20"></circle>
          <text class="label" dx="36" dy="21">Task name</text>
          <text class="helper" dx="190" dy="21">50%</text>          
          <rect class="milestone"></rect>
          <rect class="milestone2"></rect>
        </g>
      </svg>
      -->
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // When attributes change
  _render() {;}

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
    this._upgrade( 'value' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'value'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( data ) {
    if( data !== null ) {
      this.setAttribute( 'value', data );
    } else {
      this.removeAttribute( 'value' );
    }
  }
}

window.customElements.define( 'gr-gantt', GRGantt );
