import * as THREE from "three/webgpu";
import ships from "../static/ships";
import { loadGLTFModel } from "../utils/loadGLTFModel";

interface Ships {
  [key: string]: IShipElement;
}

interface IPosition {
  index: number;
  shipName: string;
}

interface IShipElement {
  url: string;
  model: THREE.Group;
  name: string;
  description: string;
}

class ShipSelect {
  private static _instance: ShipSelect;
  private ships: Ships;
  public selectedShip: string;
  private position: IPosition;

  constructor() {
    this.ships = {};

    for (const [key, value] of Object.entries(ships)) {
      const elementGroup = new THREE.Group();
      loadGLTFModel(elementGroup, value.url);

      const shipData: IShipElement = {
        url: value.url,
        model: elementGroup,
        name: value.name,
        description: value.description,
      };

      this.ships[key] = shipData;
    }

    this.selectedShip = Object.keys(this.ships)[0];
    this.position = {
      index: 0,
      shipName: this.selectedShip,
    };
    console.log(this.position);
  }

  public selectShip(shipName: string) {
    if (this.ships[shipName]) {
      this.selectedShip = shipName;
    }
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new ShipSelect();
    }
    return this._instance;
  }

  public show() {}
}

export default ShipSelect;
