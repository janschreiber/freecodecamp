function searchWikipedia()
{
	var string = document.getElementById("searchbox").value;
	document.getElementById("result").innerHTML = '';
	if (string === '')
	{
		return false;
	}
	$.ajax(
	{
		url: 'https://en.wikipedia.org/w/api.php',
		data:
		{
			action: 'query',
			list: 'search',
			srsearch: string,
			format: 'json'
		},
		dataType: 'jsonp',
		success: function(obj)
		{
			if (!obj.query)
			{
				return false;
			}
// 			var h2 = document.createElement('h2');
// 			h2.innerHTML = 'Results';
// 			document.getElementById("result").appendChild(h2);
			for (var i = 0, l = obj.query.search.length; i < l; ++i)
			{
				// console.log('title: ', obj.query.search[i].title);
				var b = document.createElement('b');
				b.innerHTML = obj.query.search[i].title;
				document.getElementById("result").appendChild(b);
				document.getElementById("result").innerHTML += '<br \/>';
				// console.log('snippet: ', obj.query.search[i].snippet);
				document.getElementById("result").innerHTML += obj.query.search[i].snippet;
				document.getElementById("result").innerHTML += '&hellip;<br \/>';
				var articleUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(obj.query.search[i].title.replace(/ /g, '_'));
				var a = document.createElement('a');
				a.href = articleUrl;
				a.title = articleUrl + ' (opens in new tab)';
				a.target =  '_blank';
    				a.innerHTML = 'View full article on Wikipedia';
				document.getElementById("result").appendChild(a);
				document.getElementById("result").innerHTML += '<br \/>';
				document.getElementById("result").innerHTML += '<br \/>';
			}
			return true;
		}
	});
}

function submitOnEnter(inputElement, event)
{
	if (event.keyCode == 13)
	{
		searchWikipedia();
	}
}