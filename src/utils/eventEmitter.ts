/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* @ts-nocheck */

interface Name {
  original: string;
  value: string;
  namespace: string;
}

export class EventEmitter {
  private static instance: EventEmitter;
  callbacks: any = {};

  private constructor() {
    this.callbacks = {};
    this.callbacks.base = {};
  }

  public static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  on(_names: string, callback: Function) {
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong names");
      return false;
    }

    if (typeof callback === "undefined") {
      console.warn("wrong callback");
      return false;
    }

    const names = this.resolveNames(_names);

    names.forEach((_name) => {
      const name = this.resolveName(_name);

      if (!(this.callbacks[name.namespace] instanceof Object))
        this.callbacks[name.namespace] = {};

      if (!(this.callbacks[name.namespace][name.value] instanceof Array))
        this.callbacks[name.namespace][name.value] = [];

      this.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  off(_names: string, callbackToRemove?: Function) {
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong name");
      return false;
    }

    const names = this.resolveNames(_names);

    names.forEach((_name) => {
      const name = this.resolveName(_name);

      const namespaces =
        name.namespace === "base"
          ? Object.keys(this.callbacks)
          : [name.namespace];

      namespaces.forEach((namespace) => {
        const eventCallbacks = this.callbacks[namespace]?.[name.value];

        if (!Array.isArray(eventCallbacks)) return;

        if (callbackToRemove) {
          // Filter out the specific callback
          this.callbacks[namespace][name.value] = eventCallbacks.filter(
            (cb) => cb !== callbackToRemove,
          );

          // Remove event if empty
          if (this.callbacks[namespace][name.value].length === 0) {
            delete this.callbacks[namespace][name.value];
          }
        } else {
          // Remove all callbacks for that event
          delete this.callbacks[namespace][name.value];
        }

        // Clean up namespace if empty
        if (Object.keys(this.callbacks[namespace]).length === 0) {
          delete this.callbacks[namespace];
        }
      });
    });

    return this;
  }

  trigger(_name: string, _args?: any[]) {
    if (typeof _name === "undefined" || _name === "") {
      console.warn("wrong name");
      return false;
    }

    let finalResult: any = null;
    let result = null;
    const args = !(_args instanceof Array) ? [] : _args;
    const nameArray = this.resolveNames(_name);
    const name = this.resolveName(nameArray[0]);

    if (name.namespace === "base") {
      for (const namespace in this.callbacks) {
        const cbList = this.callbacks[namespace]?.[name.value];
        if (Array.isArray(cbList)) {
          cbList.forEach((callback: Function) => {
            result = callback.apply(this, args);
            if (typeof finalResult === "undefined") {
              finalResult = result;
            }
          });
        }
      }
    } else {
      const cbList = this.callbacks[name.namespace]?.[name.value];
      if (!Array.isArray(cbList)) return this;
      cbList.forEach((callback: Function) => {
        result = callback.apply(this, args);
        if (typeof finalResult === "undefined") finalResult = result;
      });
    }

    return finalResult;
  }

  resolveNames(_names: string) {
    let names: string | string[] = _names;
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, "");
    names = names.replace(/[,/]+/g, " ");
    names = names.split(" ");
    return names;
  }

  resolveName(name: string) {
    const newName: Partial<Name> = {};
    const parts = name.split(".");

    newName.original = name;
    newName.value = parts[0];
    newName.namespace = "base";

    if (parts.length > 1 && parts[1] !== "") {
      newName.namespace = parts[1];
    }

    return newName as Name;
  }
}

export const eventEmitter = EventEmitter.getInstance();
