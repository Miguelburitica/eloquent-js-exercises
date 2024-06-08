class Group {
  private _elements: unknown[]
  
  constructor () {
    this._elements = []
  }

  static from(elements: Iterable<unknown>) {
    const group = new Group()
    for (const element of elements) {
      group.add(element)
    }
    return group
  }

  getElements () {
    return structuredClone(this._elements)
  }

  getElement (index: number) {
    return structuredClone(this._elements[index])
  }

  /**
   * Check if the element is in the group
   * @param element value to be checked
   * @returns if the element is in the group, returns the index of the element, otherwise returns false
   */
  check (element: unknown): { elementExists: boolean, position: number } {
    let position = -1
    let elementExists = false
    this._elements.some((e, iPosition) => {
      if (typeof e === 'object' && typeof element === 'object') {
        elementExists = JSON.stringify(e) === JSON.stringify(element)
      } else {
        elementExists = e === element
      }

      if (elementExists) position = iPosition
      return elementExists
    })

    return {
      elementExists,
      position
    }
  }

  add (element: unknown) {
    if (this.check(element).elementExists) return this._elements
    this._elements.push(element)
    return this._elements
  }

  delete (element: unknown) {
    const { position, elementExists } = this.check(element)

    if (!elementExists) return this._elements
    this._elements = this._elements.toSpliced(position, 1)
    return this._elements
  }
}

class GroupIterator {
  private _group: Group
  private _position: number

  constructor (group: Group) {
    this._group = group
    this._position = 0
  }

  next () {
    if (this._position >= this._group.getElements().length) return { done: true }

    const result = { value: this._group.getElement(this._position), done: false }
    this._position++
    return result
  }
}

Group.prototype[Symbol.iterator] = function () {
  return new GroupIterator(this)
}

// const group = new Group()

// console.log(' -------------> ', group.getElements())

// console.log(group.add(1))
// console.log(group.add({ x: 1, y: 2 }))
// console.log(group.add({ x: 1, y: 2 }))
// console.log(group.add(1))
// console.log(group.add(2))
// console.log(group.delete({ x: 1, y: 2 }))
// console.log(group.delete(1))


// console.log(' -------------> ', group.getElements())

// const group = Group.from([1, 2, 3, 4, 5])

// console.log(group.getElements())
// console.log(group.add(1))

// const group2 = Group.from([1, 2, 3, 3, { x: 1, y: 2 }, 3, 4, 5, { x: 1, y: 2 }, { x: 1, y: 2 }, [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]])

// console.log({ lalala: group2.getElements() })
// console.log(group2.add(1))
// console.log(group2.delete(1))
// console.log(group2.delete(1))

const group = new Group()
const group2 = Group.from([1, 2, 3, 3, { x: 1, y: 2 }, 3, 4, 5, { x: 1, y: 2 }, { x: 1, y: 2 }, [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5]])

group.add(1)
group.add(2)

// @ts-ignore
for (const value of group) {
  console.log(value)
}

console.log('\n\n -------------> second group')
// @ts-ignore
for (const value of group2) {
  console.log(value)
}
