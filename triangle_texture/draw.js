// Mantém o valor entre 0 e 1
function Clamp(value, min = 0, max = 1){
	return Math.max(min, Math.min(value, max));
};

// Interpola o valor de 2 vertices
// Min é o ponto inicial
// Max é o ponto final
// Gradient é o modulo (%) entre os dois pontos do vertices
function Interpolate(min, max, gradient){
	return min + (max - min) * Clamp(gradient);
};

// Rasterização em X
function processScanLine(data, pa, pb, pc, pd, color){
	// Calcula o gradient nos pontos Y tanto para achar os pontos startX e endX (0 a 1)
	var gradient1 = pa.y != pb.y ? (data.y - pa.y) / (pb.y - pa.y) : 1;
	var gradient2 = pc.y != pd.y ? (data.y - pc.y) / (pd.y - pc.y) : 1;
		
	// Calcula o X inicial e o X final
	var startX = Interpolate(pa.x, pb.x, gradient1);
	var endX = Interpolate(pc.x, pd.x, gradient2);

	// Será usado para o deep buffer
	var startZ = Interpolate(pa.z, pb.z, gradient1);
	var endZ = Interpolate(pc.z, pd.z, gradient2);
	
	// X do UV
	var startU 	= Interpolate(pa.CoordUV.u, pb.CoordUV.u, gradient1);
	var endU 	= Interpolate(pc.CoordUV.u, pd.CoordUV.u, gradient2);
	
	// Y do UV
	var startV 	= Interpolate(pa.CoordUV.v, pb.CoordUV.v, gradient1);
	var endV 	= Interpolate(pc.CoordUV.v, pd.CoordUV.v, gradient2);

	for(var x = startX; x < endX; x++){
		var gradient = (x - startX) / (endX - startX);
		
 		var z = Interpolate(startZ, endZ, gradient);
		
		var u = Interpolate(startU, endU, gradient);
        var v = Interpolate(startV, endV, gradient); // Sempre vai ser igual ....
		
		rgba = Map(u, v);

		drawPixel({x:x, y:data.y}, rgbToHex(rgba.r, rgba.g, rgba.b));
	}
};

// Ordena os vetores sempre nessa ordem v1 < v2 < v3
function orderVertices(v1, v2, v3){
	if(v1.y > v2.y){
		var tmp = v2;
		v2 = v1;
		v1 = tmp;
	}
	
	if(v2.y > v3.y){
		var tmp = v2;
		v2 = v3;
		v3 = tmp;
	}
	
	if(v1.y > v2.y){
		var tmp = v2;
		v2 = v3;
		v3 = tmp;
	}
	
	return [v1, v2, v3];
};

// Para mais informações, segue o site abaixo ...
// https://www.davrous.com/2013/06/21/tutorial-part-4-learning-how-to-write-a-3d-software-engine-in-c-ts-or-js-rasterization-z-buffering/
function drawTriangle(v1, v2, v3, color){
	vertices = orderVertices(v1, v2, v3);
	v1 = vertices[0];
	v2 = vertices[1];
	v3 = vertices[2];
	
	// Inverse Slopes
	var dv1v2 = 0;
	var dv1v3 = 0;
	
	// Computing inverse slopes
	var v2_v1 = v2.y - v1.y;
	if(v2_v1 > 0){
		dv1v2 = (v2.x - v1.x) / v2_v1;
	}
	
	var v3_v1 = v3.y - v1.y;
	if(v3_v1 > 0){
		dv1v3 = (v3.x - v1.x) / v3_v1;
	}
	
	// Primeiro caso de triangulo
    // P1 (uv)
    // -
    // -- 
    // - -
    // -  -
    // -   - P2 (uv)
    // -  -
    // - -
    // -
    // P3 (uv)
	if(dv1v2 > dv1v3){
		// Vai de v1.y até v3.y decendo no polygon
		//for(var y = parseInt(v1.y); y < parseInt(v3.y); y++){
		for(var y = parseInt(v1.y); y < parseInt(v3.y); y++){
			// se o y for menor que p2.y, está na parte de baixo do polygon
			if(y < v2.y){
				processScanLine({y:y}, v1, v3, v1, v2, rgbToHex(255, 0, 0));
			}
			// se o y for maior que p2.y, estamos na parte de cima do polygon
			else{
				processScanLine({y:y}, v1, v3, v2, v3, rgbToHex(0, 255, 0));
			}
		}
	}
	// Segundo caso de triangulo
    //            P1 (uv)
    //            -
    //           -- 
    //          - -
    //         -  -
    // (uv )P2 -  - 
    //         -  -
    //          - -
    //           -
    //           P3 (uv)
	else{
		for(var y = parseInt(v1.y); y < parseInt(v3.y); y++){
			if(y < v2.y){
				processScanLine({y:y}, v1, v2, v1, v3, rgbToHex(255, 0, 0));
			}else{
				processScanLine({y:y}, v2, v3, v1, v3, rgbToHex(0, 255, 0));
			}
		}
	}
};

// Mapping U V na textura
function Map(u, v){
	if(texture_data == null){
		return rgbToHex(255, 255, 255);
	}
	
	var u = Math.abs(parseInt(u * texture_data.width) % texture_data.width);
	var v = Math.abs(parseInt(v * texture_data.height) % texture_data.height);
	
	var rgba = getPixel(texture_data, u, v);
	return rgba;
};

function draw(content){
	// LIMPA TELA
	content.clearRect(0, 0, canvas.width, canvas.height);
	
	var v1 = {x: 0, y: 0, z: 0, CoordUV:{u:0, v:0}};
	var v2 = {x: 500, y: 300, z: 0, CoordUV:{u:1, v:1}};
	var v3 = {x: 100, y: 200, z: 0, CoordUV:{u:0, v:1}};
	
	/*var v1 = {x: 0.5, y: 0.5, z: 0, CoordUV:{u:0, v:0}};
	var v2 = {x: 1, y: 0, z: 0, CoordUV:{u:1, v:1}};
	var v3 = {x: 0, y: 0, z: 0, CoordUV:{u:0, v:1}};*/
	
	drawTriangle(v1, v2, v3, 0);
	
	/*var y = 0.25;
	var factor = (y - v1.y) / (v2.y - v1.y);
	var factor = 1;
	var startX = Interpolate(v1.x, v2.x, factor);
	var endX = Interpolate(v1.x, v3.x, factor);
	
	console.log("Y: " + y + "  "+ startX, endX, factor);*/
	
	content.font = "10px Arial";
	content.fillStyle = rgbToHex(255, 0, 0);
	
	content.beginPath();
	content.moveTo(v1.x, v1.y);
	
	content.lineTo(v2.x, v2.y);
	content.fillText("V2(" + v2.x + ", " + v2.y + ")", v2.x, v2.y);
	
	content.lineTo(v3.x, v3.y);
	content.fillText("V3(" + v3.x + ", " + v3.y + ")", v3.x, v3.y);
	
	content.lineTo(v1.x, v1.y);
	content.fillText("V1 (" + v1.x + ", " + v1.y + ")", v1.x, v1.y);
	
	content.stroke();
	
	
	// DESENHA UM CIRCULO MOVENDO-SE JUNTO COM O MOUSE
	// canvasCircle(x, y, r, startAngle, endAngle, style, isFill)
	canvasCircle(content, Mouse.x, Mouse.y, 2, 0, 2*Math.PI, "#dd3838", true);
	
	// EXIBE O FPS NA TELA
	// canvasText(ctx, text, x, y, style, font, align)
	canvasText(content, "FPS " + fps_state, 30, 30, "blue", "12px Arial", "center");
}