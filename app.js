/**
 * @description function creates a new HTML element with given data
 * @param {Object} data 
 * @returns {HTMLElement} newCard
 */
const createCardReq = (data) => {
  const newCard = document.createElement('div');
  newCard.innerHTML = `
  <div class="card mb-3">
    <div class="card-body d-flex justify-content-between flex-row">
      <div class="d-flex flex-column">
        <h3>${data.topic_title}</h3>
        <p class="text-muted mb-2">${data.topic_details}</p>
        <p class="mb-0 text-muted">
          ${ data.expected_result &&
            `<strong>Expected results:</strong> ${data.expected_result}`}
        </p>
      </div>
      <div class="d-flex flex-column text-center">
        <a class="btn btn-link">🔺</a>
        <h3>0</h3>
        <a class="btn btn-link">🔻</a>
      </div>
    </div>
    <div class="card-footer d-flex flex-row justify-content-between">
      <div>
        <span class="text-info">${data.status.toUpperCase()}</span>
        &bullet; added by <strong>${data.author_name}</strong> on
        <strong>${new Date(data.update_date).toLocaleDateString()}</strong>
      </div>
      <div
        class="d-flex justify-content-center flex-column 408ml-auto mr-2"
      >
        <div class="badge badge-success">
          ${data.target_level}
        </div>
      </div>
    </div>
  </div>
  `;
  return newCard;
};

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Global variables
   */
  const formVidReqEle = document.getElementById("formVideoRequest");
  const listOfReqEle = document.getElementById('listOfRequests');

  /**
   * fetch API to make a GET request 
   * Gets the video requests from the DB and append it to the DOM
   */
  fetch("http://localhost:7777/video-request")
    .then((blob) => blob.json())
    .then((data) => {
      data.forEach(data => {
        listOfReqEle.appendChild(createCardReq(data));
      });
    });

  /**
   * Form event listener on submit
   * [1] Make a POST request to send the form data to the server
   * [2] Append the new card to the DOM
   * [3] reset the form
   */
  formVidReqEle.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formVidReqEle);

    fetch("http://localhost:7777/video-request", {
      method: "POST",
      body: formData,
    })
      .then((blob) => blob.json())
      .then((data) => {
          listOfReqEle.prepend(createCardReq(data));
      })
      .then(formVidReqEle.reset());
  });
});
