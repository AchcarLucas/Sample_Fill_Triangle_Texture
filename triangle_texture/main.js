$(document).ready(function(){
	canvas 				= document.getElementById("canvas");
	content 			= canvas.getContext("2d");
	canvasData			= content.getImageData(0, 0, canvas.width, canvas.height);
	fps_controller 		= $('#fps_controller');
	fps_range			= $('#fps_range');
	
		
	texture = new Image();
	
	texture.onload = function () {
		console.log(texture);
		content.drawImage(texture, 0, 0, texture.width, texture.width);
		texture_data = content.getImageData(0, 0, texture.width, texture.width);
		console.log(texture_data);
	};
	
	$("#texture").change(function(e){
		var input = $("#texture");		
		var reader = new FileReader();
		reader.onload = function(e){
		  console.log(reader);
		  texture.src = e.target.result;
        };
        reader.readAsDataURL(input[0].files[0]);
	});
	
	Mouse.x = canvas.width / 2;
	Mouse.y = canvas.height / 2;

	console.log("Canvas Width " + canvas.width);
	console.log("Canvas Height " + canvas.height);
	
	// Mostra o valor do FPS ao lado da Range de controle
	fps_controller.change(function(){
		fps_range.html(fps_controller[0].value + " FPS");
	});
	
	canvas.onmousemove = function(event){
		var rect = canvas.getBoundingClientRect();
		Mouse.x = event.clientX - rect.left;
		Mouse.y = event.clientY - rect.top;
	}
	
	canvas.onmousedown = function(event){
		var rect = canvas.getBoundingClientRect();
		Mouse.dragOffset.x = event.clientX - rect.left;
		Mouse.dragOffset.y = event.clientY - rect.top;
		Mouse.drag = true;
	}
	
	canvas.onmouseup = function(event){
		Mouse.drag = false;
	}

	// LOOP PRINCIPAL ...
	var updateCanvas = true;
	function mainLoop(){
		if(updateCanvas){
			update(content);
			draw(content);
			fps_count++;
		}
	}

	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
	
	// A cada 1000 / fps milisegundos (FPS), desenhar a tela novamente
	function setTimeOutLoop(){
		setTimeout(function(){
			requestAnimationFrame(mainLoop);
			setTimeOutLoop();
		}, 1000 / fps_controller[0].value);
	}
	
	// A cada 1 segundo, exibir quantos FPS a tela está sendo atualizada
	function setTimeOutFPS(){
		setTimeout(function(){
			fps_state = fps_count;
			fps_count = 0;
			setTimeOutFPS();
		}, 1000);
	}
	
	setTimeOutLoop();
	setTimeOutFPS();
});