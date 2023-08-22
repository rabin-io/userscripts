// ==UserScript==
// @name         Delete Button for Jenkins Jobs
// @namespace    https://rabin.io
// @version      1.3.1
// @description  Adds a delete button to each row in a Jenkins pane table
// @match        https://*/job/*/
// @connect      self
// @sandbox      JavaScript
// @grant        GM_xmlhttpRequest
// @icon         https://www.jenkins.io/favicon.ico
// @run-at       document-end
// ==/UserScript==

// Gist URL:    https://gist.github.com/rabin-io/72558495cbc1425eec2bbb57b798e78b
// DownloadURL: https://gist.githubusercontent.com/rabin-io/72558495cbc1425eec2bbb57b798e78b/raw/jenkins-delete-job.user.js

(function() {
    'use strict';

    const baseURL = window.location.href; // Get the current page URL

    // Find all table rows with the class "build-row" inside a table with the class "pane"
    const rows = document.querySelectorAll('table.pane tr.build-row');

    // Loop through each row starting from the second row
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        let jobLink = row.querySelector('a.model-link.inside.build-link.display-name').href;
        jobLink = jobLink.endsWith("/") ? jobLink.slice(0, -1) : jobLink; // removing the taling slash if exsis.
        //console.log("Job link: " + jobLink);

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('jenkins-!-destructive-color'); // Add the class to the button
        deleteButton.textContent = 'Delete';

        // Add a click event listener to the delete button
        deleteButton.addEventListener('click', () => {
            const deleteURL = `${jobLink}/doDelete`; // Form the delete URL
            // {{API_SERVER}}/job/{{JOB_NAME}}/{{currentBuildId}}/doDelete/api/json/
            //const deleteURL = `${jobLink}/doDelete/api/json/`; // Form the delete URL
            console.log(deleteURL)
            // Send a POST request to the delete URL
            GM_xmlhttpRequest({
                method: 'POST',
                url: deleteURL,
                withCredentials: true, // Include session cookie
                headers: {
                    'Content-Type': 'application/json',
                    //'Jenkins-Crumb': '',
                },
                onload: function(response) {
                    console.log(response.responseText);
                    // Check if the request was successful
                    if (response.status === 200) {
                        // Remove the table row from the DOM
                        row.parentNode.removeChild(row);
                    }
                    else {
                        // redirect to confirmDelete page
                        window.location.href = `${jobLink}/confirmDelete`
                    }
                },
                onerror: function(error) {
                    console.log('Error occurred during delete request:', error);
                // Handle the error scenario
                }
            });
        });
        // Get the existing cell within the row
        const cell = row.querySelector('td');
        // Append the delete button to the cell
        cell.appendChild(deleteButton);
    }
})();

