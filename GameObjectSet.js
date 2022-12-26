class gameObjectSet {
    constructor(name, images, firstGid, objectCount, columns) {
      this.name = name
      this.images = images
      this.firstGid = firstGid
      this.lastGid = firstGid + objectCount - 1
      this.objectCount = objectCount
      this.columns = columns
      this.rows = objectCount / columns || 1
    }
  
    //call only after loading images
    get_objects() {
        let gid = this.firstGid
        const gameObjects = {}
        for (let i = 0; i < this.images.length; i++) {
          gameObjects[gid] = new GameObject(this.images[i], gid)
          gid++
        }
        return gameObjects
    }
  }