/*
 * Copyright MIT © <2013> <Francesco Trillini>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Typo = {}; 
 
(function(Typo) {
	
	var Typo = window.Typo || {}, canvas, context, mouse = { x: -99999, y: -99999 }, nodes = [], dirtyRegions = [], inputForce = force = 0, input = forceFactor = false, FPS = 60, resizeTimer = null;

	// Default values
	var text = 'CASE STUDY', interactive = true;
	
	/*
	 * Get responsive font size based on screen width.
	 */
	
	function getResponsiveFontSize(canvasWidth) {
		// Base font size is 250px for desktop (based on CSS)
		// Scale down proportionally for smaller screens
		if (canvasWidth <= 768) {
			// Mobile: scale to about 40% of base
			return Math.max(80, canvasWidth * 0.15);
		} else if (canvasWidth <= 950) {
			// Tablet: scale to about 60% of base
			return Math.max(120, canvasWidth * 0.18);
		} else if (canvasWidth <= 1200) {
			// Small desktop: scale to about 80% of base
			return Math.max(180, canvasWidth * 0.2);
		} else {
			// Desktop: use proportional scaling
			return Math.min(250, canvasWidth / 5);
		}
	}
	
	/*
	 * Get responsive particle spacing based on screen width.
	 */
	
	function getResponsiveParticleSpacing(canvasWidth) {
		// Base spacing is 12px
		// Scale down for smaller screens
		if (canvasWidth <= 768) {
			return 8; // Mobile: smaller spacing
		} else if (canvasWidth <= 950) {
			return 10; // Tablet: medium spacing
		} else {
			return 12; // Desktop: default spacing
		}
	}
		
	/*
	 * Init.
	 */
	
	Typo.init = function() {
		
		var titleBox = document.querySelector('.study .title-box');
		
		if (!titleBox) {
			console.error("CASE STUDY title-box not found");
			return;
		}
		
		canvas = document.createElement('canvas');
			
		canvas.width = titleBox.offsetWidth;
		canvas.height = titleBox.offsetHeight;
		
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.zIndex = 1;
		canvas.style.pointerEvents = 'auto';
		
		titleBox.appendChild(canvas);
		
		// Browser supports canvas?
		if(!!(Typo.gotSupport())) {
		
			context = canvas.getContext('2d');
		
			// Events
			if('ontouchstart' in window) {
				
				canvas.addEventListener('touchstart', Typo.onTouchStart, false);
				canvas.addEventListener('touchend', Typo.onTouchEnd, false);
				canvas.addEventListener('touchmove', Typo.onTouchMove, false);
				
			}	
			
			else {
				
				canvas.addEventListener('mousedown', Typo.onMouseDown, false);
				canvas.addEventListener('mouseup', Typo.onMouseUp, false);
				canvas.addEventListener('mousemove', Typo.onMouseMove, false);
				
			}
			
			window.onresize = onResize;
		
			Typo.buildTexture();
			
		}
		
		else {
		
			console.error("Sorry, your browser doesn't support canvas.");
		
		}
        
	};
	
	/*
	 * On resize window event with debounce.
	 */
	
	function onResize() {
		
		// Clear existing timer
		if (resizeTimer) {
			clearTimeout(resizeTimer);
		}
		
		// Debounce resize event
		resizeTimer = setTimeout(function() {
			var titleBox = document.querySelector('.study .title-box');
			if (titleBox && canvas) {
				var newWidth = titleBox.offsetWidth;
				var newHeight = titleBox.offsetHeight;
				
				// Only update if size actually changed
				if (canvas.width !== newWidth || canvas.height !== newHeight) {
					canvas.width = newWidth;
					canvas.height = newHeight;
					
					// Reset nodes and dirty regions to trigger re-render
					nodes = [];
					dirtyRegions = [];
					input = true; // Trigger texture rebuild
				}
			}
		}, 150); // 150ms debounce
			
	}
	
	/*
	 * Check if browser supports canvas element.
	 */
	
	Typo.gotSupport = function() {
	
		return canvas.getContext && canvas.getContext('2d');
	
	};
	
	/*
	 * Mouse down event.
	 */
	
	Typo.onMouseDown = function(event) {
	
		event.preventDefault();
		
		forceFactor = true;
	
	};
	
	/*
	 * Mouse up event.
	 */
	
	Typo.onMouseUp = function(event) {
	
		event.preventDefault();
		
		forceFactor = false;
	
	};
	
	/*
	 * Mouse move event.
	 */
	
	Typo.onMouseMove = function(event) {
	
		event.preventDefault();
	
		var rect = canvas.getBoundingClientRect();
		mouse.x = event.clientX - rect.left;
		mouse.y = event.clientY - rect.top;
			
	};
	
	/*
	 * Touch start event.
	 */
	
	Typo.onTouchStart = function(event) {
	
		event.preventDefault();

		forceFactor = true;

	};
	
	/*
	 * Touch end event.
	 */
	
	Typo.onTouchEnd = function(event) {
	
		event.preventDefault();
		
		forceFactor = false;
	
	};
	
	/*
	 * Touch move event.
	 */
	
	Typo.onTouchMove = function(event) {
	
		event.preventDefault();
	
		var rect = canvas.getBoundingClientRect();
		mouse.x = event.touches[0].clientX - rect.left;
		mouse.y = event.touches[0].clientY - rect.top;
			
	};
	
	/*
	 * Building texture.
	 */
	
	Typo.buildTexture = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	
		// Let's start by drawing the original texture
		if(nodes.length === 0 || input) {
			
			// Reset input flag
			input = false;
			
			// Get responsive font size
			var fontSize = getResponsiveFontSize(canvas.width);
			var particleSpacing = getResponsiveParticleSpacing(canvas.width);
			
			context.font = 'bold ' + fontSize + 'px Outfit';
			context.fillStyle = '#FFFFFF';		
			context.textAlign = 'center';
			context.fillText(text, canvas.width * 0.5, canvas.height * 0.55);
			
			var surface = context.getImageData(0, 0, canvas.width, canvas.height);
			
			context.clearRect(0, 0, canvas.width, canvas.height);
			
			// Clear existing nodes and dirty regions
			nodes = [];
			dirtyRegions = [];
			
			for(var width = 0; width < surface.width; width += particleSpacing) {
			
				for(var height = 0; height < surface.height; height += particleSpacing) {
			
					var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];
					
					// The pixel color is white? So draw on it...
					if(color === 255) {	
						
						var x, y, radius;				
						
						x = canvas.width * 0.5;
						y = canvas.height * 0.5;
						
						// Responsive particle radius
						var baseRadius = canvas.width <= 768 ? 1.5 : 2;
						var maxRadius = canvas.width <= 768 ? 3 : 5;
						radius = baseRadius + Math.random() * (maxRadius - baseRadius);
					
						nodes.push({
						
							x: x,
							y: y,
							vx: 0,
							vy: 0,
							goalX: width,
							goalY: height,
							
							radius: radius
							
						});
						
						dirtyRegions.push({
						
							x: x,
							y: y,
							
							radius: radius
						
						});
					
					}
					
				}
		
			}
							
		}
	
		// Logic
		Typo.clear();
		Typo.update();
		Typo.render();
		
		requestAnimFrame(Typo.buildTexture);
	
	};
	
	/*
	 * Clear only dirty regions.
	 */
	
	Typo.clear = function() {
	
		[].forEach.call(dirtyRegions, function(dirty, index) {
		
			var x, y, width, height;
			
			width = (2 * dirty.radius) + 4;
            height = width;
				
            x = dirty.x - (width / 2);
			y = dirty.y - (height / 2);
			
			context.clearRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
		
		});
	
	};
	
	/*
	 * Let's update the nodes.
	 */
	
	Typo.update = function() {
			
		[].forEach.call(nodes, function(node, index) {
			
			if(!interactive) {
					
				mouse.x = canvas.width * 0.5 + Math.sin(force) * context.measureText(text).width * 0.5;
				mouse.y = canvas.height * 0.47;
				
				force += 0.0001;
			
			}	
					
			var angle = Math.atan2(node.y - mouse.y, node.x - mouse.x);
			
			// Ease
			node.vx += Math.cos(angle) * Typo.distanceTo(mouse, node, true) + (node.goalX - node.x) * 0.1;
			node.vy += Math.sin(angle) * Typo.distanceTo(mouse, node, true) + (node.goalY - node.y) * 0.1;
			
			// Friction
			node.vx *= 0.7;
			node.vy *= 0.7;
				
			node.x += node.vx;
			node.y += node.vy;	

			if(!!forceFactor) 
					
				inputForce = Math.min(inputForce + 1, 2000);
						
			else
					
				inputForce = Math.max(inputForce - 1, 0);
					
					
			// Check a neighborhood node
			// Responsive connection distance
			var connectionDistance = canvas.width <= 768 ? 30 : 50;
			
			for(var nextMolecule = index + 1; nextMolecule < nodes.length; nextMolecule++) {
			
				var otherMolecule = nodes[nextMolecule];
				
				// Oh we've found one!
				if(Typo.distanceTo(node, otherMolecule) < connectionDistance) {
					
					context.save();
					context.beginPath();
					context.globalCompositeOperation = 'destination-over';
					context.globalAlpha = 1 - Typo.distanceTo(node, otherMolecule) / (connectionDistance * 2);
					context.lineWidth = canvas.width <= 768 ? 0.5 : 1;
					context.strokeStyle = '#FFFFFF';
					context.moveTo(node.x, node.y);
					context.lineTo(otherMolecule.x, otherMolecule.y);
					context.stroke();
					context.closePath();
					context.restore();
					
				}
				
			}
		
		});
		
	};
	
	/*
	 * Let's render the nodes.
	 */
	
	Typo.render = function() {
			
		[].forEach.call(nodes, function(node, index) {
			
			context.save();
			context.fillStyle = '#FFFFFF';
			context.translate(node.x, node.y);
			context.beginPath();
			context.arc(0, 0, node.radius, 0, Math.PI * 2);
			context.fill();
			context.restore();
			
			// Dirty regions
			dirtyRegions[index].x = node.x;
			dirtyRegions[index].y = node.y;
			dirtyRegions[index].radius = node.radius;
			
		});
	
	};
	
	/*
	 * Distance between two points.
	 */
	
	Typo.distanceTo = function(pointA, pointB, angle) {
	
		var dx = Math.abs(pointA.x - pointB.x);
		var dy = Math.abs(pointA.y - pointB.y);
		
		if(angle) 
		
			return (1000 + (interactive ? inputForce : 0)) / Math.sqrt(dx * dx + dy * dy);
		
		else
			
			return Math.sqrt(dx * dx + dy * dy);
	
	};
	
	/*
	 * Request new frame by Paul Irish.
	 * 60 FPS.
	 */
	
	window.requestAnimFrame = (function() {
	 
		return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
			  
				function(callback) {
			  
					window.setTimeout(callback, 1000 / FPS);
				
				};
			  
    	})();

	window.addEventListener ? window.addEventListener('load', Typo.init, false) : window.onload = Typo.init;
	
})(Typo);
