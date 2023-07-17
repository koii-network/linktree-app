export function animatedSection() {
  let images = ["/images/o3_saim.png", "/images/o1_al.png"];
  let currentIndex = 0;
  document.head.appendChild(document.createElement("style")).innerHTML =
    "#animated-image-frame { animation: rotateAnimation 5s infinite linear; animation-delay: 0s; }";

  let imgElement = document.getElementById("animated-image-frame");
  if (imgElement) imgElement.style.backgroundImage = images[currentIndex++];

  // Define the image swapping function
  function preSwapImage() {
    function swapImage() {
      imgElement = document.getElementById("animated-image-frame");

      if (!imgElement) return;

      imgElement.src = images[currentIndex % images.length];
      currentIndex++;
      setTimeout(swapImage, 2500);
    }

    setTimeout(swapImage, 1250);
  }
  preSwapImage();
}
