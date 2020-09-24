chrome.extension.sendMessage({}, (response) => {
	const readyStateCheckInterval = setInterval(() => {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		const body = document.getElementsByTagName('body')[0];

		const targets = ['js-issue-title'];

		
		targets.map(target => {

			const links = body.getElementsByClassName(target);

			for (let index = 0; index < links.length; index++) {
				const link = links[index];
	
				let c;

				if (link.innerText.indexOf(':') !== -1) {
					c = link.innerText.split(':');
				} else if (link.innerText.indexOf(' - ') !== -1) {
					c = link.innerText.split(' - ');
				}
	
				if (c && c.length === 2 && c[0].toLowerCase().indexOf('webapps') === 0) {
					link.innerHTML = `<a target="_blank" href="http://jira/browse/${c[0].trim()}">${c[0]}</a>: ${c[1].trim()}`;
				}
			}
		})
		

	}
	}, 10);
});