import GRTag from "./tag.js"

export default class GRGanttCard extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          border-bottom: solid 1px grey;
          border-top: solid 1px grey;
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: row;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          background: none;
          border: none;
          box-sizing: border-box;
          color: #6f6f6f;
          cursor: pointer;
          direction: ltr;
          font-family: 'Material Symbols Outlined';
          font-size: 20px;
          font-style: normal;
          font-weight: normal;
          height: 36px;
          letter-spacing: normal;
          line-height: 36px;
          margin: 0 0 0 4px;
          max-height: 36px;         
          max-width: 36px;                    
          min-height: 36px;                               
          min-width: 36px;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          width: 36px;
          word-wrap: normal;                    
        }

        div {
          display: flex;
        }

        div[part=card] {
          flex-direction: column;
        }

        div[part=tags] {
          flex-direction: row;
          gap: 4px;
          padding: 0;
        }

        p {
          box-sizing: border-box;
          color: #161616;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          padding: 0;
          text-align: left;
          text-decoration: none;
          text-rendering: optimizeLegibility;
          width: 100%;
        }
        
        p[part=label] {
          font-weight: 600;
          margin: 0 0 0 4px;
        }

        p[part=range] {
          color: #6f6f6f;
          font-size: 12px;
          margin: 0 0 0 4px;
        }
      </style>
      <button part="caret" type="button">keyboard_arrow_down</button>
      <div part="card">
        <p part="label">Task name</p>
        <p part="range">1 Feb - 20 May 2021</p>
        <div part="tags">
          <gr-tag label="subtask"></gr-tag>
          <gr-tag label="subtask"></gr-tag>
          <gr-tag label="subtask"></gr-tag>
          <gr-tag label="subtask"></gr-tag>                
        </div>
      </div>
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

window.customElements.define( 'gr-gantt-card', GRGanttCard );
