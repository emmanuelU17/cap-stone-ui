// Called in SizeInventoryComponent
export class CustomQueue<T> {
  private readonly arr: T[];

  constructor() {
    this.arr = [];
  }

  addToQueue(data: T): void {
    this.arr.push(data);
  }

  endOfQueue(): T {
    return this.arr[this.arr.length - 1];
  }

  empty(): boolean {
    return this.arr.length === 0;
  }

  toArray(): T[] {
    return this.arr;
  }

}
