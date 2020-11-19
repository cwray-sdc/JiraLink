chrome.extension.sendMessage({}, (response) => {
	const readyStateCheckInterval = setInterval(() => {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			const body = document.getElementsByTagName('body')[0];

			// If you're on github
			if (window.location.host.indexOf('github') !== -1) {
				const targets = ['js-issue-title'];

				targets.map(target => {
		
					const links = body.getElementsByClassName(target);
		
					for (let index = 0; index < links.length; index++) {
						const link = links[index];
			
						let jiraIssueTitle;
		
						if (link.innerText.indexOf(':') !== -1) {
							jiraIssueTitle = link.innerText.split(':');
						} else if (link.innerText.indexOf(' - ') !== -1) {
							jiraIssueTitle = link.innerText.split(' - ');
						}
			
						if (jiraIssueTitle && jiraIssueTitle.length === 2 && jiraIssueTitle[0].toLowerCase().indexOf('webapps') === 0) {
							link.innerHTML = `
								<a 
									target="_blank" 
									href="http://jira/browse/${jiraIssueTitle[0].trim()}/"
								>${jiraIssueTitle[0]}</a>: ${jiraIssueTitle[1].trim()}
								<a 
									target="_blank" 
									style="background-color: #0366d6; color: #fff; padding: 2px; border-radius: 3px; font-size: 1rem; display: inline-block;" 
									href="http://jira/browse/${jiraIssueTitle[0].trim()}/?githubUrl=${window.location.href}&jiraId=${jiraIssueTitle[0].trim()}">Link PR to Jira</a>
							`;
						}
					}
				})
			} 
			// If you're on Jira
			else if (window.location.host.indexOf('atlassian') !== -1) {
				const urlParams = new URLSearchParams(window.location.search);

				if (urlParams.get('githubUrl')) {

					const postData = {
						"object": {
							"url": urlParams.get('githubUrl'),
							"title":"GitHub.com Pull Request"
						}
					};

					const axiosConfig = {
						headers: {
						'Content-Type': 'application/json;charset=UTF-8',
						}
					};

					axios.post(`https://stamps.atlassian.net/rest/api/latest/issue/${urlParams.get('jiraId')}/remotelink`, postData, axiosConfig)
					.then((res) => {
						console.log("RESPONSE RECEIVED: ", res);
					})
					.catch((err) => {
						console.log("AXIOS ERROR: ", err);
					});

					window.location.href = window.location.origin + window.location.pathname;
				}
			}
		}
	}, 10);
});