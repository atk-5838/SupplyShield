/**
 * Priority Queue (Binary Heap)
 * Configurable as Max-Heap or Min-Heap for alert prioritization.
 * Elements with higher priority scores bubble to the root.
 */
export interface HeapItem<T> {
  priority: number;
  data: T;
}

export class PriorityQueue<T> {
  private heap: HeapItem<T>[] = [];
  private isMaxHeap: boolean;

  constructor(isMaxHeap: boolean = true) {
    this.isMaxHeap = isMaxHeap;
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  peek(): T | null {
    return this.heap.length > 0 ? this.heap[0].data : null;
  }

  insert(data: T, priority: number): void {
    const item: HeapItem<T> = { data, priority };
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  extract(): T | null {
    if (this.isEmpty()) return null;
    const top = this.heap[0].data;
    const bottom = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.bubbleDown(0);
    }
    return top;
  }

  toArray(): T[] {
    // Clone and return sorted by priority without destroying internal heap
    const cloned = [...this.heap];
    cloned.sort((a, b) => (this.isMaxHeap ? b.priority - a.priority : a.priority - b.priority));
    return cloned.map((c) => c.data);
  }

  private compare(aIdx: number, bIdx: number): boolean {
    const a = this.heap[aIdx].priority;
    const b = this.heap[bIdx].priority;
    return this.isMaxHeap ? a > b : a < b;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.compare(index, parentIdx)) {
        this.swap(index, parentIdx);
        index = parentIdx;
      } else {
        break;
      }
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      let targetIdx = index;
      const leftChildIdx = 2 * index + 1;
      const rightChildIdx = 2 * index + 2;

      if (leftChildIdx < length && this.compare(leftChildIdx, targetIdx)) {
        targetIdx = leftChildIdx;
      }
      if (rightChildIdx < length && this.compare(rightChildIdx, targetIdx)) {
        targetIdx = rightChildIdx;
      }

      if (targetIdx !== index) {
        this.swap(index, targetIdx);
        index = targetIdx;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
