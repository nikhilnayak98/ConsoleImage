/**
* The MIT License (MIT)
*
* Copyright (c) 2016. Nikhil Nayak <nikhilnayak98@gmail.com>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
(function(console) {
	"use strict";

	/**
	 * Since the console.log doesn't respond to the `display` style,
	 * setting a width and height has no effect. In fact, the only styles
	 * I've found it responds to is font-size, background-image and color.
	 * To combat the image repeating, we have to get a create a font bounding
	 * box so to speak with the unicode box characters. EDIT: See Readme.md
	 *
	 * @param  {int} width  The height of the box
	 * @param  {int} height The width of the box
	 * @return {object}     {string, css}
	 */
	function getBox(width, height) {
		return {
			string: "+",
			style: "font-size: 1px; padding: " + Math.floor(height/2) + "px " + Math.floor(width/2) + "px; line-height: " + height + "px;"
		}
	}

	/**
	 * Draw's meme text on a context.
	 *
	 * @param  {CanvasRenderingContext2D} ctx   The canvas context
	 * @param  {string} type  "upper"|"lower"
	 * @param  {string} text  The text to draw
	 * @param  {int} width The width of the image
	 * @param  {int} y     The y value to draw at
	 * @return {null}
	 */
	function drawMemeText(ctx, type, text, width, y) {
		text = text.toUpperCase();
		//Determine the font size
		if(text.length < 24) {
			var val = Math.max(0, text.length - 12),
				size = 70 + (val * - 3);

			drawText(ctx, size, text, width/2, y);
		} else if(text.length < 29) {
			drawText(ctx, 40, text, width/2, y);
		} else {
			var strs = wrap(text, 27);
			strs.forEach(function(str, i) {
				drawText(ctx, 40, str, width/2, (type == "lower") ? (y - ((strs.length - 1) * 40)) + (i * 40) : y + (i * 40));
			});
		}
	}

	/**
	 * Draws text in impact font with stroke on context
	 *
	 * @param  {CanvasRenderingContext2D} ctx  The canvas context
	 * @param  {int} size Font size
	 * @param  {string} text The string to write
	 * @param  {int} x    X Position
	 * @param  {int} y    Y position
	 * @return {null}
	 */
	function drawText(ctx, size, text, x, y) {
		//Set the text styles
		ctx.font = "bold " + size + "px Impact";
		ctx.fillStyle = "#fff";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.lineWidth = 7;
		ctx.strokeStyle = "#000";
		ctx.strokeText(text, x, y);
		ctx.fillText(text, x, y);
	}

	/**
	 * Wrap a line of text at an index
	 *
	 * @param  {string} text The text
	 * @param  {int} num  The index to wrap at
	 * @return {array}      Array of text
	 */
	function wrap(text, num) {
		var output = [],
			split = text.split(" ");

		var str = [];
		for(var i = 0, cache = split.length; i < cache; i++) {
			if((str + split[i]).length < num) str.push(split[i])
			else {
				output.push(str.join(" "));
				str.length = 0;
				str.push(split[i]);
			}
		}

		//Push the final line
		output.push(str.join(" "));

		return output;
	}

	/**
	 * Display an image in the console.
	 * @param  {string} url The url of the image.
	 * @param  {int} scale Scale factor on the image
	 * @return {null}
	 */
	console.image = function(url, scale) {
		scale = scale || 1;
		var img = new Image();

		img.onload = function() {
			var dim = getBox(this.width * scale, this.height * scale);
			console.log("%c" + dim.string, dim.style + "background: url(" + url + "); background-size: " + (this.width * scale) + "px " + (this.height * scale) + "px; color: transparent;");
		};

		img.src = url;
	};
})(console);
