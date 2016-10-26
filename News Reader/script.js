function getCamperNews()
{
	// console.log("getCamperNews");
	document.getElementById('date').innerHTML = dateConvert(Date.now());

	var xmlhttp = new XMLHttpRequest();
	var url = "http://www.freecodecamp.com/news/hot";

	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			var myArr = JSON.parse(xmlhttp.responseText);
			parseData(myArr);
		}
	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function parseData( arr )
{
	document.getElementById('content').innerHTML = '';

	// do this for each item in the array
	for (var i in arr)
	{
		/* //Log to console
		console.log('headline: ' + arr[i].headline);
		console.log('link: ' + arr[i].link);
		console.log('author: ' + arr[i].author.username);
		console.log('rank: ' + arr[i].rank);
		*/

		// Create a div for each article
		var div = document.createElement('div');
		div.id = 'id_' + arr[i].id;
		div.className = 'article';
		document.getElementById('content').appendChild(div);
		document.getElementById('id_' + arr[i].id).innerHTML += '\n';
		var image = document.createElement('img');
		image.src = arr[i].author.picture;
		image.className = 'article_img';
		document.getElementById('id_' + arr[i].id).appendChild(image);
		document.getElementById('content').innerHTML += '\n';

		// add link to div if available
		var articleUrl = arr[i].link;
		if (articleUrl != 'http://')
		{
			var a = document.createElement('a');
			a.href = articleUrl;
			a.title = articleUrl + ' (opens in new tab)';
			a.target = '_blank';
			a.innerHTML = arr[i].headline;
			a.className = 'article_link';
			document.getElementById('id_' + arr[i].id).appendChild(a);
			document.getElementById('content').innerHTML += '\n';
		}
		else
		{
			document.getElementById('id_' + arr[i].id).innerHTML += arr[i].headline;
		}

		// add author info, upvotes etc. in a paragraph
		var p = document.createElement('p');
		p.className = 'info';
		p.innerHTML = 'Posted by ';
		a = document.createElement('a');
		var url = "http://www.freecodecamp.com/" + arr[i].author.username;
		a.href = url;
		a.title = url;
		a.innerHTML = arr[i].author.username;
		p.appendChild(a);
		p.innerHTML += ' on ' + dateConvert(arr[i].timePosted);
		var date_diff = dateDiff(arr[i].timePosted);
		if (date_diff === 0)
		{
			p.innerHTML += ' (less than 24 hours ago)';
		}
		else if (date_diff === 1)
		{
			p.innerHTML += ' (less than two days ago)';
		}
		else
		{
			p.innerHTML += ' (' + date_diff + ' days ago)';
		}
		p.innerHTML += ' &middot; ' + arr[i].rank + '&nbsp;<i class=\"fa\" style=\"\">&#xf087;</i>';
		document.getElementById('id_' + arr[i].id).appendChild(p);
	}
	// console.log('parseData');
}

function dateConvert( timestamp, includeTimeOfDay )
{
	var d = new Date(timestamp);
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var year = d.getFullYear();
	var month = months[d.getMonth()];
	var date = d.getDate();
	var time = month + ' ' + date + ', ' + year;
	if (includeTimeOfDay)
	{
		var hour = d.getHours();
		var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
		time += ', ' + hour + ':' + min ;
	}
	return time;
}

function dateDiff( timestamp )
{
	var delta = Date.now() - timestamp;
	return Math.floor(delta/86400000);
}
