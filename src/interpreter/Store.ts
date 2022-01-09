export default class Store {
  locations: any[];
  allocated: boolean[];

  constructor() {
    this.locations = [];
    this.allocated = [];
  }

  alloc(value: any) {
    let address = 0;
    const size = this.locations.length;

    while (address < size && this.allocated[address]) address++;

    if (address < size) {
      this.locations[address] = value;
      value.address = address;
      this.allocated[address] = true;
      return address;
    }

    this.locations.push(value);
    this.allocated.push(true);

    value.address = size;
    return size;
  }

  free(address: number) {
    if (address >= 0 && address < this.allocated.length) {
      this.allocated[address] = false;
    }
  }

  put(address: number, value: any) {
    if (address >= 0 && address < this.locations.length) {
      this.locations[address] = value;
    }
  }

  get(address: number) {
    if (address >= 0 && address < this.locations.length) {
      return this.locations[address];
    }

    return undefined;
  }
}
