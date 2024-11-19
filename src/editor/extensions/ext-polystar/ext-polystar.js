/**
 * @file ext-polystar.js
 *
 *
 * @copyright 2010 CloudCanvas, Inc. All rights reserved
 * @copyright 2021 Optimistik SAS, Inc. All rights reserved
 * @license MIT
 *
 */

const name = 'polystar'

const loadExtensionTranslation = async function (svgEditor) {
  let translationModule
  const lang = svgEditor.configObj.pref('lang')
  try {
    translationModule = await import(`./locale/${lang}.js`)
  } catch (_error) {
    console.warn(`Missing translation (${lang}) for ${name} - using 'en'`)
    translationModule = await import('./locale/en.js')
  }
  svgEditor.i18next.addResourceBundle(lang, name, translationModule.default)
}

export default {
  name,
  async init() {
    const svgEditor = this
    const { svgCanvas } = svgEditor
    const { ChangeElementCommand } = svgCanvas.history
    const addToHistory = (cmd) => { svgCanvas.undoMgr.addCommandToHistory(cmd) }
    const { $id, $click } = svgCanvas
    let selElems
    let started
    let newFO
    let startX, startY;
    await loadExtensionTranslation(svgEditor)

    /**
     * @param {boolean} on true=display
     * @param {string} tool "star" or "polygone"
     * @returns {void}
     */
    const showPanel = (on, tool) => {
      if (on) {
        $id(`${tool}_panel`).style.removeProperty('display')
      } else {
        $id(`${tool}_panel`).style.display = 'none'
      }
    }

    /**
     *
     * @param {string} attr attribute to change
     * @param {string|Float} val new value
     * @returns {void}
     */
    const setAttr = (attr, val) => {
      svgCanvas.changeSelectedAttribute(attr, val)
      svgCanvas.call('changed', selElems)
    }

    /**
     * @param {Float} n angle
     * @return {Float} cotangeante
     */
    const cot = (n) => 1 / Math.tan(n)

    /**
     * @param {Float} n angle
     * @returns {Float} sec
     */
    const sec = (n) => 1 / Math.cos(n)

    return {
      name: svgEditor.i18next.t(`${name}:name`),
      // The callback should be used to load the DOM with the appropriate UI items
      callback() {
        // Add the button and its handler(s)
        // Note: the star extension needs to be loaded before the polygon extension
        const fbtitle = `${name}:title`
        const titleStar = `${name}:buttons.0.title`
        const titlePolygon = `${name}:buttons.1.title`
        const titleStarlight = `${name}:buttons.2.title`;
        const buttonTemplate = `
            <se-flyingbutton id="tools_polygon" title="${fbtitle}">
              <se-button id="tool_star" title="${titleStar}" src="star.svg">
              </se-button>
              <se-button id="tool_polygon" title="${titlePolygon}" src="starBold.svg">
              </se-button>
               <se-button id="tool_starlight" title="${titleStarlight}" src="starLight.svg"></se-button>
            </se-flyingbutton>
          `
        svgCanvas.insertChildAtIndex($id('tools_left'), buttonTemplate, 10)
        // handler
        $click($id('tool_star'), () => {
          if (this.leftPanel.updateLeftPanel('tool_star')) {
            svgCanvas.setMode('star')
            showPanel(true, 'star')
            showPanel(false, 'polygon')
            showPanel(false, 'starlight');
          }
        })
        $click($id('tool_polygon'), () => {
          if (this.leftPanel.updateLeftPanel('tool_polygon')) {
            svgCanvas.setMode('polygon')
            showPanel(true, 'polygon')
            showPanel(false, 'star')
            showPanel(false, 'starlight');
          }
        })

        $click($id('tool_starlight'), () => {
          if (this.leftPanel.updateLeftPanel('tool_starlight')) {
            svgCanvas.setMode('starlight');
            showPanel(false, 'star');
            showPanel(false, 'polygon');
            showPanel(false, 'starlight');
          }
        });
        const label0 = `${name}:contextTools.0.label`
        const title0 = `${name}:contextTools.0.title`
        const label1 = `${name}:contextTools.1.label`
        const title1 = `${name}:contextTools.1.title`
        const label2 = `${name}:contextTools.2.label`
        const title2 = `${name}:contextTools.2.title`
        const label3 = `${name}:contextTools.3.label`
        const title3 = `${name}:contextTools.3.title`
        // Add the context panel and its handler(s)
        const panelTemplate = document.createElement('template')
        panelTemplate.innerHTML = `
          <div id="star_panel">
            <se-spin-input id="starNumPoints" label="${label0}" min=1 step=1 value=5 title="${title0}">
            </se-spin-input>
            <se-spin-input id="RadiusMultiplier" label="${label1}" min=1 step=2.5 value=3 title="${title1}">
            </se-spin-input>
            <se-spin-input id="radialShift" min=0 step=1 value=0 label="${label2}" title="${title2}">
            </se-spin-input>
          </div>
          <div id="polygon_panel">
            <se-spin-input size="3" id="polySides" min=1 step=1 value=5 label="${label3}" title="${title3}">
            </se-spin-input>
          </div>
          <div id="starlight_panel">
            <se-spin-input id="starlightIntensity" label="Intensity" min=0 step=0.1 value=1 title="Adjust the starlight intensity"></se-spin-input>
          </div>
        `
        // add handlers for the panel
        $id('tools_top').appendChild(panelTemplate.content.cloneNode(true))
        // don't display the panels on start
        showPanel(false, 'star')
        showPanel(false, 'polygon')
        showPanel(false, 'starlight');
        $id('starNumPoints').addEventListener('change', (event) => {
          setAttr('point', event.target.value)
          const orient = 'point'
          const point = event.target.value
          let i = selElems.length
          while (i--) {
            const elem = selElems[i]
            if (elem.hasAttribute('r')) {
              const oldPoint = elem.getAttribute('point')
              const oldPoints = elem.getAttribute('points')
              const radialshift = elem.getAttribute('radialshift')
              let xpos = 0
              let ypos = 0
              if (elem.points) {
                const list = elem.points
                const len = list.numberOfItems
                for (let i = 0; i < len; ++i) {
                  const pt = list.getItem(i)
                  xpos += parseFloat(pt.x)
                  ypos += parseFloat(pt.y)
                }
                const cx = xpos / len
                const cy = ypos / len
                const circumradius = Number(elem.getAttribute('r'))
                const inradius = circumradius / elem.getAttribute('starRadiusMultiplier')

                let polyPoints = ''
                for (let s = 0; point >= s; s++) {
                  let angle = 2.0 * Math.PI * (s / point)
                  if (orient === 'point') {
                    angle -= Math.PI / 2
                  } else if (orient === 'edge') {
                    angle = angle + Math.PI / point - Math.PI / 2
                  }

                  let x = circumradius * Math.cos(angle) + cx
                  let y = circumradius * Math.sin(angle) + cy

                  polyPoints += x + ',' + y + ' '

                  if (!isNaN(inradius)) {
                    angle = 2.0 * Math.PI * (s / point) + Math.PI / point
                    if (orient === 'point') {
                      angle -= Math.PI / 2
                    } else if (orient === 'edge') {
                      angle = angle + Math.PI / point - Math.PI / 2
                    }
                    angle += radialshift

                    x = inradius * Math.cos(angle) + cx
                    y = inradius * Math.sin(angle) + cy

                    polyPoints += x + ',' + y + ' '
                  }
                }
                elem.setAttribute('points', polyPoints)
                addToHistory(new ChangeElementCommand(elem, { point: oldPoint, points: oldPoints }))
              }
            }
          }
        })
        $id('RadiusMultiplier').addEventListener('change', (event) => {
          setAttr('starRadiusMultiplier', event.target.value)
        })
        $id('radialShift').addEventListener('change', (event) => {
          setAttr('radialshift', event.target.value)
        })
        $id('starlightIntensity').addEventListener('change', (event) => {
          setAttr('intensity', event.target.value);
        });
        $id('polySides').addEventListener('change', (event) => {
          setAttr('sides', event.target.value)
          const sides = event.target.value
          let i = selElems.length
          while (i--) {
            const elem = selElems[i]
            if (elem.hasAttribute('edge')) {
              const oldSides = elem.getAttribute('sides')
              const oldPoints = elem.getAttribute('points')
              let xpos = 0
              let ypos = 0
              if (elem.points) {
                const list = elem.points
                const len = list.numberOfItems
                for (let i = 0; i < len; ++i) {
                  const pt = list.getItem(i)
                  xpos += parseFloat(pt.x)
                  ypos += parseFloat(pt.y)
                }
                const cx = xpos / len
                const cy = ypos / len
                const edg = elem.getAttribute('edge')
                const inradius = (edg / 2) * cot(Math.PI / sides)
                const circumradius = inradius * sec(Math.PI / sides)
                let points = ''
                for (let s = 0; sides >= s; s++) {
                  const angle = (2.0 * Math.PI * s) / sides
                  const x = circumradius * Math.cos(angle) + cx
                  const y = circumradius * Math.sin(angle) + cy
                  points += x + ',' + y + ' '
                }
                elem.setAttribute('points', points)
                addToHistory(new ChangeElementCommand(elem, { sides: oldSides, points: oldPoints }))
              }
            }
          }
        })
      },
      mouseDown(opts) {
        if (svgCanvas.getMode() === 'starlight') {
          const fill = svgCanvas.getColor('fill');
          const stroke = svgCanvas.getColor('stroke');
          const strokeWidth = 2;
          started = true;

          // Define as coordenadas iniciais
          startX = opts.start_x;
          startY = opts.start_y;

          // Cria o SVG do 'X' usando duas linhas
          newFO = svgCanvas.addSVGElementsFromJson({
            element: 'g', // agrupa as duas linhas
            attr: {
              id: svgCanvas.getNextId(),
              shape: 'xShape' // novo tipo de forma
            },
            children: [
              {
                element: 'line',
                attr: {
                  x1: startX,
                  y1: startY,
                  x2: startX,
                  y2: startY, stroke,
                  'stroke-width': strokeWidth,
                  'stroke-linecap': 'round'
                }
              },
              {
                element: 'line',
                attr: {
                  x1: startX,
                  y1: startY,
                  x2: startX,
                  y2: startY,
                  stroke,
                  'stroke-width': strokeWidth,
                  'stroke-linecap': 'round'
                }
              }
            ]
          });
          return {
            started: true
          }
        }

        if (svgCanvas.getMode() === 'star') {
          const fill = svgCanvas.getColor('fill');
          const stroke = svgCanvas.getColor('stroke');
          const strokeWidth = 10;
          started = true;

          // Define as coordenadas iniciais
          startX = opts.start_x;
          startY = opts.start_y;

          // Cria o SVG do 'X' usando duas linhas
          newFO = svgCanvas.addSVGElementsFromJson({
            element: 'g', // agrupa as duas linhas
            attr: {
              id: svgCanvas.getNextId(),
              shape: 'xShape' // novo tipo de forma
            },
            children: [
              {
                element: 'line',
                attr: {
                  x1: startX,
                  y1: startY,
                  x2: startX,
                  y2: startY, stroke,
                  'stroke-width': strokeWidth,
                  'stroke-linecap': 'round'
                }
              },
              {
                element: 'line',
                attr: {
                  x1: startX,
                  y1: startY,
                  x2: startX,
                  y2: startY,
                  stroke,
                  'stroke-width': strokeWidth,
                  'stroke-linecap': 'round'
                }
              }
            ]
          });
          return {
            started: true
          }
        }
        if (svgCanvas.getMode() === 'polygon') {
          const fill = svgCanvas.getColor('fill');
          const stroke = svgCanvas.getColor('stroke');
          const strokeWidth = 20;
          started = true;

          // Define as coordenadas iniciais
          startX = opts.start_x;
          startY = opts.start_y;

          // Cria o SVG do 'X' usando duas linhas
          newFO = svgCanvas.addSVGElementsFromJson({
            element: 'g', // agrupa as duas linhas
            attr: {
              id: svgCanvas.getNextId(),
              shape: 'xShape' // novo tipo de forma
            },
            children: [
              {
                element: 'line',
                attr: {
                  x1: startX,
                  y1: startY,
                  x2: startX,
                  y2: startY, stroke,
                  'stroke-width': strokeWidth,
                  'stroke-linecap': 'round'
                }
              },
              {
                element: 'line',
                attr: {
                  x1: startX,
                  y1: startY,
                  x2: startX,
                  y2: startY,
                  stroke,
                  'stroke-width': strokeWidth,
                  'stroke-linecap': 'round'
                }
              }
            ]
          });
          
          return {
            started: true
          }
        }
        return undefined
      },
      mouseMove(opts) {
        if (!started) {
          return undefined
        }
        if (svgCanvas.getMode() === 'starlight') {
          // Calcula a distância do ponto inicial ao ponto atual do mouse
          const x = opts.mouse_x;
          const y = opts.mouse_y;
          const deltaX = x - startX;
          const deltaY = y - startY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          // Define o tamanho do 'X' com base na distância
          newFO.firstChild.setAttribute('x1', startX - distance);
          newFO.firstChild.setAttribute('y1', startY - distance);
          newFO.firstChild.setAttribute('x2', startX + distance);
          newFO.firstChild.setAttribute('y2', startY + distance);

          newFO.lastChild.setAttribute('x1', startX + distance);
          newFO.lastChild.setAttribute('y1', startY - distance);
          newFO.lastChild.setAttribute('x2', startX - distance);
          newFO.lastChild.setAttribute('y2', startY + distance);


          return {
            started: true
          }
        }
        if (svgCanvas.getMode() === 'star') {
          // Calcula a distância do ponto inicial ao ponto atual do mouse
          const x = opts.mouse_x;
          const y = opts.mouse_y;
          const deltaX = x - startX;
          const deltaY = y - startY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          // Define o tamanho do 'X' com base na distância
          newFO.firstChild.setAttribute('x1', startX - distance);
          newFO.firstChild.setAttribute('y1', startY - distance);
          newFO.firstChild.setAttribute('x2', startX + distance);
          newFO.firstChild.setAttribute('y2', startY + distance);

          newFO.lastChild.setAttribute('x1', startX + distance);
          newFO.lastChild.setAttribute('y1', startY - distance);
          newFO.lastChild.setAttribute('x2', startX - distance);
          newFO.lastChild.setAttribute('y2', startY + distance);


          return {
            started: true
          }
        }
        if (svgCanvas.getMode() === 'polygon') {
          const x = opts.mouse_x;
          const y = opts.mouse_y;
          const deltaX = x - startX;
          const deltaY = y - startY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          // Define o tamanho do 'X' com base na distância
          newFO.firstChild.setAttribute('x1', startX - distance);
          newFO.firstChild.setAttribute('y1', startY - distance);
          newFO.firstChild.setAttribute('x2', startX + distance);
          newFO.firstChild.setAttribute('y2', startY + distance);

          newFO.lastChild.setAttribute('x1', startX + distance);
          newFO.lastChild.setAttribute('y1', startY - distance);
          newFO.lastChild.setAttribute('x2', startX - distance);
          newFO.lastChild.setAttribute('y2', startY + distance);

          return {
            started: true
          }
        }
        return undefined
      },
      mouseUp() {
        if (svgCanvas.getMode() === 'starlight') {
          const selectToolButton = document.getElementById('tool_select');
          if (selectToolButton) {
            selectToolButton.click();
          }
          const sl = newFO.getAttribute('sl');
          return {
            keep: sl !== '0',
            element: newFO
          };
          
        }
        if (svgCanvas.getMode() === 'star') {
          const r = newFO.getAttribute('r')
          return {
            keep: r !== '0',
            element: newFO
          }
        }
        if (svgCanvas.getMode() === 'polygon') {
          const edge = newFO.getAttribute('edge')
          const keep = edge !== '0'
          // svgCanvas.addToSelection([newFO], true);
          return {
            keep,
            element: newFO
          }
        }
        return undefined
      },
      selectedChanged(opts) {
        // Use this to update the current selected elements
        selElems = opts.elems
        let i = selElems.length
        // Hide panels if nothing is selected
        if (!i) {
          showPanel(false, 'star')
          showPanel(false, 'polygon')
          showPanel(false, 'starlight');
          return
        }
        while (i--) {
          const elem = selElems[i]
          if (elem?.getAttribute('shape') === 'star') {
            if (opts.selectedElement && !opts.multiselected) {
              $id('starNumPoints').value = elem.getAttribute('point')
              $id('radialShift').value = elem.getAttribute('radialshift')
              showPanel(true, 'star')
            } else {
              showPanel(false, 'star')
            }
          } else if (elem?.getAttribute('shape') === 'regularPoly') {
            if (opts.selectedElement && !opts.multiselected) {
              $id('polySides').value = elem.getAttribute('sides')
              showPanel(true, 'polygon')
            } else {
              showPanel(false, 'polygon')
            }
          } else if (elem?.getAttribute('shape') === 'starlight') {
            if (opts.selectedElement && !opts.multiselected) {
              $id('starlightIntensity').value = elem.getAttribute('intensity');
              showPanel(true, 'starlight');
            } else {
              showPanel(false, 'starlight');
            }
          } else {
            showPanel(false, 'star')
            showPanel(false, 'polygon')
            showPanel(false, 'starlight');
          }
        }
      }
    }
  }
}
