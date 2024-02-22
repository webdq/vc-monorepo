class Tooltip {
  _el: Element
  _title: Element
  _div: HTMLDivElement
  isDestroyed: boolean = false
  constructor(el: Element) {
    this._el = el

    const div = document.createElement('div')
    div.className = 'vcdh-draw-tooltip right'

    const arrow = document.createElement('div')
    arrow.className = 'vcdh-draw-tooltip-arrow'
    div.appendChild(arrow)

    const title = document.createElement('div')
    title.className = 'vcdh-draw-tooltip-inner'
    div.appendChild(title)

    this._div = div
    this._title = title
    this._el.appendChild(div)
  }

  setVisible(visible: boolean) {
    this._div.style.display = visible ? 'block' : 'none'
  }

  showAt(position?: { x: number; y: number }, message?: string) {
    if (position && message) {
      this.setVisible(true)
      this._title.innerHTML = message
      this._div.style.left = position.x + 10 + 'px'
      this._div.style.top = position.y - this._div.clientHeight / 2 + 'px'
    }
  }

  destroy() {
    if (this.isDestroyed) return
    this._el.removeChild(this._div)
    this.isDestroyed = true
  }
}

export default Tooltip
