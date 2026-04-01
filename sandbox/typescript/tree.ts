export class TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(value: number) {
    this.value = value
    this.left = null
    this.right = null
  }
}

export class Tree {
  root: TreeNode | null = null

  insert(value: number): void {
    if (this.root === null) {
      this.root = new TreeNode(value)
      return
    }
    else {
      // TODO: 
      // let curr:TreeNode | null = this.root
      // while (){
      //   if(){
      //     let newNode:TreeNode = new TreeNode(value)
      //   }
      //   else{
      //
      //   }
      // }
    }
  }
  delete(value: number): void {
    //TODO: implement delete
  }

  search(value: number): boolean {
    //TODO: search should return true if item found or else false.
    return false
  }
  inOrder(): number[] {
    //TODO: implement inOrder tree traversal.
    return []
  }
  preOrder(): number[] {
    //TODO: implement preOrder tree traversal
    return []
  }
  postOrder(): number[] {
    //TODO: implement postOrder tree traversal
    return []
  }
  bfs(): number[] {
    //TODO: implement bfs
    return []
  }
  isEmpty(): boolean {
    //TODO: return true if no node exists in the tree.
    return false
  }
  clear(): void {
    //TODO: remove all the nodes  from the tree
  }
  findMin(): number | null {
    //TODO: find and return the smallest value in the tree.
    return 0
  }
  findMax(): number | null {
    //TODO: find and return the largest value in the tree.
    return 0
  }
  height(): number {
    //TODO: return tree height measured in edges.
    return 0
  }


}
