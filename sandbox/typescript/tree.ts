export class TreeNode{
  value: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(value:number){
    this.value = value
    this.left = null
    this.right = null
  }
}

export class Tree{
  root:TreeNode | null = null

  insert (value: number):void{
    if(this.root === null){
      this.root = new TreeNode(value)
    }
    else{
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
}
