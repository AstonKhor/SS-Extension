window.addEventListener('DOMContentLoaded', (event) => {
	console.log(document.getElementById('upload_btn'));
	document.getElementById('upload_btn').addEventListener('click', () => {
		document.getElementById('file').click();
	})
	document.getElementById('file').addEventListener('input', () => {
		var file = document.getElementById("file").files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			console.log(e.target);
			let fileName = document.getElementById('file').value.toString().split('\\');
			fileName = fileName[fileName.length - 1];
			console.log(fileName);
			// var base64Rejex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
			// var isBase64Valid = base64Rejex.test(e.target.result);
			// console.log(isBase64Valid);
			chrome.runtime.sendMessage({type: 'save', file: e.target.result, fileName: fileName})
		}
		reader.readAsText(file);
	});

	let files = document.getElementsByClassName('file_card');
	console.log(files);
	for (let i = 0; i < files.length; i++) {
		files[i].addEventListener('click',() => {
			chrome.runtime.sendMessage({type: 'clicked', fileName: '1.png'});
		})
	}
	console.log(files);

	chrome.runtime.onMessage.addListener(function(request, sender, cb) {
		if (request.type === 'file saved') {
			//create new card

			console.log('creating card')
			let link = document.createElement('a');
			link.className = 'file_card_link';
			link.href = 'drive_files/' + request.fileName;
			link.setAttribute('download', request.fileName);
			let card = document.createElement('div');
			card.className = 'file_card';
			let top = document.createElement('div');
			let img = document.createElement('img');
			img.src = 'drive_files/' + request.fileName;
			img.width = '150';
			top.className = 'file_card_top';
			let bot = document.createElement('div');
			let botTitle = document.createElement('div');
			botTitle.innerHTML = 'New File Name';
			botTitle.className = 'file_card_bot_title'
			let botLastEdit = document.createElement('div');
			botLastEdit.className = 'file_card_bot_lastedit'
			botLastEdit.innerHTML = 'Last editted 0 seconds ago';
			bot.className = 'file_card_bot';
			link.append(card);
			top.append(img);
			bot.append(botTitle);
			bot.append(botLastEdit);
			card.append(top);
			card.append(bot);
			document.getElementById('all_files_container').append(link);

		}
		if (request.type === 'download') {
			//create download link
			// let link = document.createElement('a');
			// document.body.append(link);
			// link.href = request.img;
			// link.setAttribute('download', '1.png');
			// link.click()
		}
	})
});