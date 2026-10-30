/**
 * Disjoint Set Union (Union-Find) with Path Compression and Union by Rank
 * Used to identify connected components and network fragmentation when disruptions occur.
 */
export class UnionFind {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();
  private count: number = 0;

  constructor(elements: string[]) {
    this.count = elements.length;
    for (const elem of elements) {
      this.parent.set(elem, elem);
      this.rank.set(elem, 0);
    }
  }

  find(i: string): string {
    const p = this.parent.get(i);
    if (!p) {
      this.parent.set(i, i);
      this.rank.set(i, 0);
      return i;
    }
    if (p === i) return i;
    const root = this.find(p);
    this.parent.set(i, root); // Path compression
    return root;
  }

  union(i: string, j: string): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI === rootJ) return false;

    const rankI = this.rank.get(rootI) || 0;
    const rankJ = this.rank.get(rootJ) || 0;

    if (rankI < rankJ) {
      this.parent.set(rootI, rootJ);
    } else if (rankI > rankJ) {
      this.parent.set(rootJ, rootI);
    } else {
      this.parent.set(rootJ, rootI);
      this.rank.set(rootI, rankI + 1);
    }

    this.count--;
    return true;
  }

  connected(i: string, j: string): boolean {
    return this.find(i) === this.find(j);
  }

  getComponentCount(): number {
    return this.count;
  }

  getComponents(): Map<string, string[]> {
    const groups = new Map<string, string[]>();
    for (const key of this.parent.keys()) {
      const root = this.find(key);
      if (!groups.has(root)) {
        groups.set(root, []);
      }
      groups.get(root)!.push(key);
    }
    return groups;
  }
}
