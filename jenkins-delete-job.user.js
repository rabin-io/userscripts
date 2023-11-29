// ==UserScript==
// @name         Delete Button for Jenkins Jobs
// @namespace    https://rabin.io
// @version      1.4.0
// @description  Adds a delete button to each row in a Jenkins pane table
// @match        https://*/job/*/
// @connect      self
// @sandbox      JavaScript
// @grant        GM_xmlhttpRequest
// @icon         https://www.jenkins.io/favicon.ico
// @run-at       document-end
// ==/UserScript==

// URL:         https://github.com/rabin-io/userscripts/blob/dev/jenkins-delete-job.user.js
// DownloadURL: https://github.com/rabin-io/userscripts/raw/dev/jenkins-delete-job.user.js

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

        // Create a rebuild button
        const rebuildButton = document.createElement('button');
        // rebuildButton.classList.add('jenkins-!-destructive-color'); // Add the class to the button
        rebuildButton.style.margin = '5px';
        rebuildButton.textContent = 'Rebuild';

        // Add a click event listener to the rebuild button
        rebuildButton.addEventListener('click', () => {
            //https://main-jenkins-csb-cnvqe.apps.ocp-c1.prod.psi.redhat.com/job/dev-deploy-cnv-4.15-on-aws-ipi-ryasharz/33/rebuild
            const rebuildURL = `${jobLink}/rebuild`;
            window.location.href = rebuildURL;
        });

        // Add a click event listener to the delete button
        deleteButton.addEventListener('click', () => {
            const deleteURL = `${jobLink}/doDelete`; // Form the delete URL
            // {{API_SERVER}}/job/{{JOB_NAME}}/{{currentBuildId}}/doDelete/api/json/
            // const deleteURL = `${jobLink}/doDelete/api/json/`; // Form the delete URL
            // console.log(deleteURL)
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
        cell.appendChild(rebuildButton);
    }
})();
