document.addEventListener('DOMContentLoaded', function () {
  let generateBtn = document.getElementById("generateBtn");
  let confirmBtn = document.getElementById("confirmBtn");
  let qrCodeContainer = document.querySelector(".qr-code-container");
  generateBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    let lastName = document.querySelector("input[name='lastName']").value;
    let firstName = document.querySelector("input[name='firstName']").value;
    let middleName = document.querySelector("input[name='middleName']").value;
    let QLFR = document.querySelector("input[name='QLFR']").value;
    let rank = document.querySelector("input[name='rank']").value;
    let station = document.querySelector("input[name='station']").value;
    let Gtype = document.querySelector("input[name='Gtype']").value;
    let Gname = document.querySelector("input[name='Gname']").value;
    let caliber = document.querySelector("input[name='caliber']").value;
    let serialN = document.querySelector("input[name='serialN']").value;
    let cost = document.querySelector("input[name='cost']").value;
    let acquisition = document.querySelector("input[name='acquisition']").value;
    let turnOver = document.querySelector("input[name='turnOver']").value;
    let returned = document.querySelector("input[name='returned']").value;



    if (lastName !== "" && firstName !== "" && middleName !== "" && QLFR !== "" && rank !== "" && station !== "" && Gtype !== "" && Gname !== "" && caliber !== "" && serialN !== "" && cost !== "" && acquisition !== "" && turnOver !== "" && returned !== "") {
      let userDetails = ` ${lastName} ${firstName} ${middleName} ${QLFR} ${rank} ${station} ${Gtype} ${Gname} ${caliber} ${serialN} ${cost} ${acquisition} ${turnOver} ${returned}`;

      generateQRCode(userDetails);

      generateBtn.style.display = "none";
      confirmBtn.style.display = "block";
    } else {
      console.log("Invalid input");
      qrCodeContainer.style.display = "none";
    }
  });

  confirmBtn.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("myForm").submit();
  });

  async function generateQRCode(userDetails) {
    qrCodeContainer.style.display = "";
    var size = 220;

    var qrcode = new QRCode(qrCodeContainer, {
      text: userDetails,
      width: size,
      height: size,
      colorDark: "#3BA676",
      colorLight: "#222",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
});