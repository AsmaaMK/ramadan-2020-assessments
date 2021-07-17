/**
 * Global variables
 */
const formVidReqEle = document.getElementById('formVideoRequest');
const listOfReqEle = document.getElementById('listOfRequests');

/**
 * @description function creates a new HTML element and appends it to the DOM
 * @param { Object } data
 * @param { Boolean } isPrepend
 */
const createCardReq = (data, isPrepend) => {
  const newCard = document.createElement('div');
  newCard.innerHTML = `
  <div class="card mb-3">
    <div class="card-body d-flex justify-content-between flex-row">
      <div class="d-flex flex-column">
        <h3>${data.topic_title}</h3>
        <p class="text-muted mb-2">${data.topic_details}</p>
        <p class="mb-0 text-muted">
          ${
            data.expected_result &&
            `<strong>Expected results:</strong> ${data.expected_result}`
          }
        </p>
      </div>
      <div class="d-flex flex-column text-center">
        <a id="votes_ups_${data._id}" class="btn btn-link">🔺</a>
        <h3 id="score_vote_${data._id}">${
    data.votes.ups - data.votes.downs
  }</h3>
        <a id="votes_downs_${data._id}" class="btn btn-link">🔻</a>
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

  isPrepend ? listOfReqEle.prepend(newCard) : listOfReqEle.appendChild(newCard);

  const voteUpsEle = document.getElementById(`votes_ups_${data._id}`);
  const voteDownsEle = document.getElementById(`votes_downs_${data._id}`);
  const scoreVoteEle = document.getElementById(`score_vote_${data._id}`);

  /**
   * Event listener that listen to click event on the vote UP button
   */
  voteUpsEle.addEventListener('click', (e) => {
    fetch('http://localhost:7777/video-request/vote', {
      method: 'PUT',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({
        id: data._id,
        vote_type: 'ups',
      }),
    })
      .then((blob) => blob.json())
      .then((data) => {
        scoreVoteEle.innerText = data.ups - data.downs;
      });
  });

  /**
   * Event listener that listen to click event on the vote DOWN button
   */
  voteDownsEle.addEventListener('click', (e) => {
    fetch('http://localhost:7777/video-request/vote', {
      method: 'PUT',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({
        id: data._id,
        vote_type: 'downs',
      }),
    })
      .then((blob) => blob.json())
      .then((data) => {
        scoreVoteEle.innerText = data.ups - data.downs;
      });
  });
};

/**
 * fetch API to make a GET request
 * Gets the video requests from the DB and append it to the DOM
 */
fetch('http://localhost:7777/video-request')
  .then((blob) => blob.json())
  .then((data) => {
    data.forEach((data) => {
      createCardReq(data, false);
    });
  });

/**
 * Event listeners
 */

/**
 * Form event listener on submit
 * [1] Make a POST request to send the form data to the server
 * [2] Prepend the new card to the DOM
 * [3] reset the form
 */
formVidReqEle.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(formVidReqEle);

  fetch('http://localhost:7777/video-request', {
    method: 'POST',
    body: formData,
  })
    .then((blob) => blob.json())
    .then((data) => {
      createCardReq(data, true);
    })
    .then(formVidReqEle.reset());
});