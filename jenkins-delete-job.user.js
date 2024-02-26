// ==UserScript==
// @name         Delete Button for Jenkins Jobs
// @namespace    https://rabin.io
// @version      1.4.4
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
    const hostname = new URL(baseURL).hostname;

    // Select all div elements with the class "task"
    //var tasksDiv = document.querySelectorAll('div.task'); //:nth-child(3) > span:nth-child(1) > a:nth-child(1) > span:nth-child(2)
    // Create a new div element
    //var newDiv = document.createElement('div');

    //Add Job clone button to the job page
    var jobH1Header = document.querySelector('h1');
    var jobTitle = jobH1Header.textContent.split(' ', 2)[0]

    var cloneButton = document.createElement('button');
    cloneButton.classList.add('jenkins-button--primary', 'jenkins-button');
    cloneButton.textContent = "Clone Job";
    cloneButton.addEventListener('click', () => {
        let cloneURL = `//${hostname}/job/generate-test-job/parambuild/`;
        let getParams = `ACCEPT=TRUE&JOB_NAME=${jobTitle}&REPO_OWNER=ryasharz&REPO_BRANCH=`;
        cloneURL += `?${getParams}`;
        window.location.href = cloneURL;
    });
    jobH1Header.parentNode.insertBefore(cloneButton, jobH1Header.nextSibling);

    var paramBuildButton = document.createElement('button');
    paramBuildButton.classList.add('jenkins-button--danger', 'jenkins-button');
    paramBuildButton.textContent = "Param Build";
    paramBuildButton.style.margin = '15px';
    paramBuildButton.addEventListener('click', () => {
        let paramBuildURL = `${baseURL}/parambuild/`;
        window.location.href = paramBuildURL;
    });
    jobH1Header.parentNode.insertBefore(paramBuildButton, jobH1Header.nextSibling);




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
