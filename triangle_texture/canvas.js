function canvasText(ctx, text, x, y, style, font, align){
	ctx.font = font;
	ctx.fillStyle = style;
	ctx.textAlign = align;
	ctx.fillText(text, x, y);
}

function canvasCircle(ctx, x, y, r, startAngle, endAngle, style, isFill){
	ctx.fillStyle = style;
	ctx.beginPath();
	ctx.arc(x, y, r, startAngle, endAngle, false);
	if(isFill){
		ctx.fill();
	}
}

function drawPixel(x, y, rgba){
	var index = (x + y * canvas.width) * 4;
	canvasData[index + 0] = rgba.r;
	canvasData[index + 1] = rgba.g;
	canvasData[index + 2] = rgba.b;
	canvasData[index + 3] = rgba.a;
}

function drawPixel(data, rgba){
	content.strokeStyle = rgba;
	content.strokeRect(data.x, data.y, 1, 1);
}

function getPixel(imageData, x, y) {
    var index = (x + y * imageData.width) * 4;
    var r = imageData.data[index+0];
    var g = imageData.data[index+1];
    var b = imageData.data[index+2];
    var a = imageData.data[index+3];
	return [r, g, b, a];
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function updateCanvas(){
	content.putImageData(canvasData, 0, 0);
}