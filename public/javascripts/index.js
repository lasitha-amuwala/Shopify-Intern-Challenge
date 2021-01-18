function setPosterHeight() {
	var height = $('.poster').height();
	var newwidth = height / 1.48;
	$('.movie-tile').css({
		width: newwidth + 'px',
	});
}

function getMovies(query) {
	let endpoint = 'https://www.omdbapi.com/';
	let apiKey = 'f336ee65';

	let title = query ? query : $('#movie-input').val();

	$.ajax({
		url: endpoint + '?apikey=' + apiKey + ' &s=' + title + '&type=movie',

		success: function (result) {
			let resultList = '<ul id="movie-list">';

			result.Search.forEach((movie) => {
				let title = movie.Title.replace("'", '&quot');
				//console.log(title)
				let poster = movie.Poster.replace('300.jpg', '1000.jpg');
				resultList += '<li class="list-item"><div class="movie-tile">';
				resultList +=
					'<img class="poster" src=' +
					poster +
					'><div class="layer" ><p class="movie-title">' +
					movie.Title +
					' (' +
					movie.Year +
					')</p>';
				resultList +=
					'<div class="my-list"><button class="btn btn-primary" onclick="checkNominated(' +
					`'` +
					title +
					`'` +
					',' +
					`'` +
					poster +
					`'` +
					')" id="nominate-btn" type="button">Nominate</button></div></div></li>';
			});
			resultList += '</ul>';
			//console.log(resultList);
			$('#card-label').html('Results for ' + `"` + title + `"`);
			$('#movie-result').html(resultList);
			setPosterHeight();
		},
		error: function () {
			console.log('error');
		},
	});
}

function loadNominations() {
	let nominations = localStorage.getItem('nominations');
	if (nominations) {
		nominations = nominations.split(',');
		$('#my-nominations').html('');
		nominations.forEach((item) => {
			$('#my-nominations').append(
				'<a href="#" class="list-group-item list-group-item-action">' +
					item +
					'</a><button type="button" class="btn btn-danger" onclick="removeNomination(' +
					`'` +
					item +
					`'` +
					')">remove</button>'
			);
		});
	} else {
		$('#my-nominations').html('');
	}
}

function checkNominated(title, poster) {
	var existing = localStorage.getItem('nominations');
	existing = existing ? existing.split(',') : [];

	if (existing.length < 5) {
		let nominated = false;
		for (let i = 0; i < existing.length; i++) {
			if (existing[i] === title) {
				nominated = true;
			}
		}
		if (!nominated) {
			existing.push(title);
			localStorage.setItem('nominations', existing.toString());
			loadNominations();
		} else {
			alert('You have already nominated this movie');
		}
	} else {
		alert('You can only nominate 5 movies');
	}
}

function removeNomination(title) {
	let nominations = localStorage.getItem('nominations');
	if (nominations) {
		let nomSplit = nominations.split(',');
		if (nomSplit.length <= 1) {
			console.log('ENDDD');
			localStorage.setItem('nominations', []);
		} else {
			let index = nomSplit.indexOf(title);
			if (index > -1) {
				nomSplit.splice(index, 1);
			}

			localStorage.setItem('nominations', nomSplit.toString());
		}
		loadNominations();
	}
}

$(document).ready(function () {
	//randomly queries when page is first loaded
	let randomQueries = ['store', 'star', 'big', 'red', 'boy', 'new', 'man', 'adventures'];
	let num = Math.floor(Math.random() * 8);
	//console.log(randomQueries[num])
	getMovies(randomQueries[num]);

	loadNominations();
});
$(window).resize(function () {
	setPosterHeight();
});
$('#search-btn').click(function () {
	getMovies();
});
