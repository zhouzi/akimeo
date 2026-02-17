export type LeafValue = number | null;

export interface Leaf {
  url: string;
  description: string;
  value: LeafValue | Record<string, LeafValue>[];
}

export interface Branch {
  [key: string]: Branch | Leaf;
}

export function isLeaf(node: Branch | Leaf): node is Leaf {
  return "value" in node;
}
