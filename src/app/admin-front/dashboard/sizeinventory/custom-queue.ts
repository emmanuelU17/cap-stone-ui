export class CustomQueue<T> {
  private arr: T[];

  constructor() {
    this.arr = [];
  }

  /** Adds to the end of the array */
  addToQueue(data: T): void {
    this.arr.push(data);
  }

  endOfQueue(): T {
    return this.arr[this.arr.length - 1];
  }

  size(): number {
    return this.arr.length;
  }

  empty(): boolean {
    return this.arr.length === 0;
  }

  toArray(): T[] {
    return this.arr;
  }

  clear(): void {
    this.arr = [];
  }

}
