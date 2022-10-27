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

						let projects = ['webapps', 'server'];
						
						if (localStorage.getItem('JiraLinkProjects')) {
							projects = [...JSON.parse(localStorage.getItem('JiraLinkProjects')), ...projects];
						} 
			
						if (jiraIssueTitle && jiraIssueTitle.length === 2 && projects.indexOf(jiraIssueTitle[0].toLowerCase().split('-')[0]) != -1) {
							const PRID = window.location.href.split('/')[window.location.href.split('/').length-1];
							const StoredLinkIDs = JSON.parse(localStorage.getItem('JiraLinksAdded')) || [];
							const linkedPR = `<span id="linked">Linked to Jira 🔗</span>`;

							let innerHTML = `
								<a 
									target="_blank" 
									href="https://auctane.atlassian.net/browse/${jiraIssueTitle[0].trim()}/"
								>${jiraIssueTitle[0]}</a>: ${jiraIssueTitle[1].trim()}
							`;

							if (StoredLinkIDs.indexOf(PRID) === -1) {
								
								StoredLinkIDs.push(PRID);

								innerHTML += `<a 
									id="linkPR"
									target="_blank" 
									href="https://auctane.atlassian.net/browse/${jiraIssueTitle[0].trim().toUpperCase()}/?githubUrl=${window.location.href}&jiraId=${jiraIssueTitle[0].trim()}">Link PR to Jira</a>
								`;

								innerHTML += linkedPR;

								link.innerHTML = innerHTML;

								document.getElementById('linked').classList.add('hide');

								document.getElementById("linkPR").addEventListener("click", () => {
									localStorage.setItem('JiraLinksAdded', JSON.stringify(StoredLinkIDs));

									document.getElementById('linkPR').classList.add('hide');
									document.getElementById('linked').classList.remove('hide');
								});

							} else {
								innerHTML += linkedPR;
								link.innerHTML = innerHTML;
							}
						}
					}
				})
			} 
			// If you're on Jira
			else if (window.location.host.indexOf('atlassian') !== -1) {
				const urlParams = new URLSearchParams(window.location.search);

				if (urlParams.get('githubUrl')) {

					const postData = {};

					const axiosConfig = {
						headers: {
						'Content-Type': 'application/json;charset=UTF-8',
						}
					};


					axios.get(`https://auctane.atlassian.net/rest/api/latest/issue/${urlParams.get('jiraId')}/remotelink`, postData, axiosConfig)
					.then((res) => {
						let duplicateDetected = false;
						const items = res.data;

						if (items.length) {
							items.map(item => {
								duplicateDetected = item.object.title === "GitHub.com Pull Request";
							});
						}

						if (duplicateDetected) {
							return;
						}

						const postData = { "object": {
							"url": urlParams.get('githubUrl'),
							"title":"GitHub.com Pull Request"
						} };

						axios.post(`https://auctane.atlassian.net/rest/api/latest/issue/${urlParams.get('jiraId')}/remotelink`, postData, axiosConfig)
						.then((res) => {
							console.log("Link added: ", res);

							window.location.href = window.location.origin + window.location.pathname;
						})
						.catch((err) => {
							console.log("AXIOS Link PR ERROR: ", err);

							window.location.href = window.location.origin + window.location.pathname;
						});
					})
					.catch((err) => {
						console.log("AXIOS Get all links ERROR: ", err);

						window.location.href = window.location.origin + window.location.pathname;
					});

				}
			}
		}
	}, 10);
});