var Texture = {};
Texture.HandleLoadedTexture2D = function( image, texture, flipY ) {
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    if ( flipY != undefined && flipY == true )
      gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    gl.bindTexture( gl.TEXTURE_2D, null );
    return texture;
}
Texture.LoadTexture2D = function( name ) {
    var texture = gl.createTexture();
    texture.image = new Image(64,64);
    texture.image.setAttribute('crossorigin', 'anonymous');
    texture.image.onload = function () {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 512;
        canvas.height = 256;
        var context = canvas.getContext( '2d' );
        context.drawImage( texture.image, 0, 0, canvas.width, canvas.height );
        Texture.HandleLoadedTexture2D( canvas, texture, true )
    }
    texture.image.src = name;
    return texture;
}


Track = function() {
	bufRect = gl.createBuffer()
	gl.bindBuffer( gl.ARRAY_BUFFER, bufRect );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ -1, -1, 1, -1, 1, 1, -1, 1 ] ), gl.STATIC_DRAW );
}

Track.prototype.initShader = function(perspective) {
	this.shader = loadShader("track-vs", "track-fs", ["inPos"], ["u_texture"]);
    gl.uniformMatrix4fv(this.shader.uniform["u_texture"], false, perspective);	
}

Track.prototype.draw = function() {
	gl.useProgram(this.shader);// Enable shader program and attributes.
    enableAttributes(this.shader);
	gl.disable( gl.DEPTH_TEST );
	var texUnit = 1;
	gl.activeTexture( gl.TEXTURE0 + texUnit );
	gl.bindTexture( gl.TEXTURE_2D, textureObj );
	var tex_loc = gl.getUniformLocation( progBG, this.shader.uniform["u_texture"] );
	gl.useProgram( progBG );
	gl.uniform1i( tex_loc, texUnit );

	var v_attr_inx = gl.getAttribLocation( progBG, "inPos" );
	gl.bindBuffer( gl.ARRAY_BUFFER, bufRect );
	gl.vertexAttribPointer( v_attr_inx, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( v_attr_inx );
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	gl.disableVertexAttribArray( v_attr_inx );

	gl.clear( gl.DEPTH_BUFFER_BIT );
	gl.enable( gl.DEPTH_TEST );

	textureObj = Texture.LoadTexture2D( "images/track1.jpg" );
}









