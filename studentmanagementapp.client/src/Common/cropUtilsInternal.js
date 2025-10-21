// Helper to create image element from src
export function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", error => reject(error));
    img.setAttribute("crossOrigin", "anonymous"); // needed for cross-origin images
    img.src = url;
  });
}