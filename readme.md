# Newton Fractal Explorer

This is an interactive web-based Newton Fractal visualizer built with **p5.js** and WebGL shaders.  
It allows you to dynamically control the fractal's shape, color themes, and zoom/movement in real time.

---

## Features

- **Smooth Real-Time Rendering**  
  - GPU-accelerated shader rendering of a Newton fractal variant.
  
- **Power Control**  
  - Set the fractal's function power (n) between 0 and 6.
  - Resume automatic oscillation animation around the base power.
  
- **Camera Controls**  
  - **W / A / S / D**: Move the view Up / Left / Down / Right.
  - **Z / X**: Zoom In / Out.
  - **Hold keys** for continuous smooth movement and zoom.

- **UI Panel**  
  - **SPACE**: Toggle the UI panel visibility for full-screen exploration.
  
- **Dynamic Color Themes**  
  - Choose from preset color palettes: Default, Sunset, Ocean.
  - Generate completely random color sets with one click.

- **Custom Color Input**  
  - Manually define custom RGB colors for each fractal root.
  - Changes are immediately reflected in both the fractal and the color input fields.
  
---

## Demos

### Color Switching
![Color Theme Change](https://raw.githubusercontent.com/yiliu1237/dynamic_newton_fractal/main/demo/changeColor.gif)

### Power Oscillation
![Changing Power](https://raw.githubusercontent.com/yiliu1237/dynamic_newton_fractal/main/demo/changePower.gif)

### Camera Movement
![Camera Movement](https://raw.githubusercontent.com/yiliu1237/dynamic_newton_fractal/main/demo/movement.gif)

---
## Fractal Previews
<p align="center">
  <table>
    <tr>
      <td><img src="https://raw.githubusercontent.com/yiliu1237/dynamic_newton_fractal/main/demo/img1.png" width="500"></td>
      <td><img src="https://raw.githubusercontent.com/yiliu1237/dynamic_newton_fractal/main/demo/img2.png" width="500"></td>
      <td><img src="https://raw.githubusercontent.com/yiliu1237/dynamic_newton_fractal/main/demo/img3.png" width="500"></td>
    </tr>
    <tr>
      <td><img src="https://raw.githubusercontent.com/yiliu1237/dynamic_newton_fractal/main/demo/img4.png" width="500"></td>
      <td><img src="https://raw.githubusercontent.com/yiliu1237/dynamic_newton_fractal/main/demo/img5.png" width="500"></td>
      <td><img src="https://raw.githubusercontent.com/yiliu1237/dynamic_newton_fractal/main/demo/img6.png" width="500"></td>
    </tr>
  </table>
</p>

---

## Controls Summary

| Key / Button | Action |
|:------------|:-------|
| `W` / `A` / `S` / `D` | Move camera Up / Left / Down / Right |
| `Z` | Zoom In |
| `X` | Zoom Out |
| `SPACE` | Toggle panel visibility |
| `Apply` Button | Set custom fractal power and stop animation |
| `Resume Animation` Button | Resume automatic oscillation |
| Theme Buttons | Switch between color themes |
| Custom Colors Section | Manually define and apply RGB colors |


