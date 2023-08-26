document.addEventListener("DOMContentLoaded", () => {
  const downloadButton = document.getElementById("downloadButton");
  const qrCodeDataURL = document.querySelector(".qr-code img").getAttribute("src");
  const lastName = "<%= data.lastName %>";

  downloadButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = qrCodeDataURL;
    link.download = lastName + "-qr_code.png";
    link.click();
  });
});
