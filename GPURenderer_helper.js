function adjustOffsetAfterZoom(mouseX, mouseY, oldZoom, newZoom) {
  let worldBeforeX = (mouseX - width/2) / oldZoom + offsetX;
  let worldBeforeY = (mouseY - height/2) / oldZoom + offsetY;

  offsetX = worldBeforeX - (mouseX - width/2) / newZoom;
  offsetY = worldBeforeY - (mouseY - height/2) / newZoom;
}
