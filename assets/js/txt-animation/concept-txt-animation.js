/*
 * Copyright MIT © <2013> <Francesco Trillini>
 * Modified for responsive + mobile-friendly ambient animation
 * Unified version for all text animations: CONCEPT, VALUE, CASE STUDY, SOLUTION, FLOW, ABOUT US
 */

var Typo = {};

(function (Typo) {

	// Configuration for each section
	var sections = [
		{
			selector: '.concept .title-box',
			text: 'CONCEPT',
			name: 'CONCEPT',
			hasLineBreak: false
		},
		{
			selector: '.value-txt .title-box',
			text: 'VALUE',
			name: 'VALUE',
			hasLineBreak: false
		},
		{
			selector: '.study .title-box',
			text: 'CASE STUDIES',
			name: 'CASE STUDIES',
			hasLineBreak: true,
			breakWidth: 425
		},
		{
			selector: '.solution .title-box',
			text: 'SOLUTION',
			name: 'SOLUTION',
			hasLineBreak: false
		},
		{
			selector: '.flow .title-box',
			text: 'FLOW',
			name: 'FLOW',
			hasLineBreak: false
		},
		{
			selector: '.about .title-box',
			text: 'ABOUT US',
			name: 'ABOUT US',
			hasLineBreak: true,
			breakWidth: 425
		}
	];

	// Store instances for each section
	var instances = {};

	// ==========================
	// RESPONSIVE HELPERS
	// ==========================

	function isMobile() {
		return window.innerWidth < 768;
	}

	function getTextForScreen(section, canvasWidth) {
		if (section.hasLineBreak && canvasWidth <= section.breakWidth) {
			if (section.name === 'CASE STUDIES') {
				return 'CASE\nSTUDIES';
			} else if (section.name === 'ABOUT US') {
				return 'ABOUT\nUS';
			}
		}
		return section.text;
	}

	function getResponsiveFontSize(canvasWidth) {
		if (canvasWidth <= 768) return Math.max(80, canvasWidth * 0.15);
		if (canvasWidth <= 950) return Math.max(120, canvasWidth * 0.18);
		if (canvasWidth <= 1200) return Math.max(180, canvasWidth * 0.2);
		return Math.min(250, canvasWidth / 5);
	}

	function getResponsiveParticleSpacing(canvasWidth) {
		if (canvasWidth <= 768) return 8;
		if (canvasWidth <= 950) return 10;
		return 12;
	}

	// ==========================
	// INIT FOR EACH SECTION
	// ==========================

	function initSection(section) {
		var titleBox = document.querySelector(section.selector);
		if (!titleBox) {
			console.error(section.name + " title-box not found");
			return null;
		}

		var canvas = document.createElement('canvas');
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

		if (!canvas.getContext || !canvas.getContext('2d')) {
			console.error("Sorry, your browser doesn't support canvas.");
			return null;
		}

		var context = canvas.getContext('2d');
		var interactive = !isMobile();
		var mouse = { x: -99999, y: -99999 };
		var nodes = [];
		var dirtyRegions = [];
		var inputForce = 0;
		var force = 0;
		var input = false;
		var forceFactor = false;
		var isVisible = false;
		var resizeTimer = null;

		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				isVisible = entry.isIntersecting;
			});
		}, { threshold: 0.01 });
		observer.observe(titleBox);

		// Update interaction mode
		function updateInteractionMode() {
			interactive = !isMobile();
			forceFactor = false;
			inputForce = 0;
		}

		// Resize handler
		function onResize() {
			if (resizeTimer) clearTimeout(resizeTimer);

			resizeTimer = setTimeout(function () {
				var titleBox = document.querySelector(section.selector);
				if (!titleBox || !canvas) return;

				updateInteractionMode();

				var newWidth = titleBox.offsetWidth;
				var newHeight = titleBox.offsetHeight;

				if (canvas.width !== newWidth || canvas.height !== newHeight) {
					canvas.width = newWidth;
					canvas.height = newHeight;
					nodes = [];
					dirtyRegions = [];
					input = true;
				}
			}, 150);
		}

		// Input handlers
		function onMouseDown(e) {
			e.preventDefault();
			forceFactor = true;
		}

		function onMouseUp(e) {
			e.preventDefault();
			forceFactor = false;
		}

		function onMouseMove(e) {
			e.preventDefault();
			var rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		}

		function onTouchStart(e) {
			e.preventDefault();
			forceFactor = true;
		}

		function onTouchEnd(e) {
			e.preventDefault();
			forceFactor = false;
		}

		function onTouchMove(e) {
			e.preventDefault();
			var rect = canvas.getBoundingClientRect();
			mouse.x = e.touches[0].clientX - rect.left;
			mouse.y = e.touches[0].clientY - rect.top;
		}

		// Events (desktop only)
		updateInteractionMode();

		if (!isMobile() && 'ontouchstart' in window) {
			canvas.addEventListener('touchstart', onTouchStart, false);
			canvas.addEventListener('touchend', onTouchEnd, false);
			canvas.addEventListener('touchmove', onTouchMove, false);
		} else if (!isMobile()) {
			canvas.addEventListener('mousedown', onMouseDown, false);
			canvas.addEventListener('mouseup', onMouseUp, false);
			canvas.addEventListener('mousemove', onMouseMove, false);
		}

		window.addEventListener('resize', onResize);

		// Distance calculation
		function distanceTo(a, b, angle) {
			var dx = a.x - b.x;
			var dy = a.y - b.y;

			if (angle) {
				var d = Math.sqrt(dx * dx + dy * dy);
				return (1000 + (interactive ? inputForce : 0)) / (d || 1);
			}
			return Math.sqrt(dx * dx + dy * dy);
		}

		function distanceToSq(a, b) {
			var dx = a.x - b.x;
			var dy = a.y - b.y;
			return dx * dx + dy * dy;
		}

		// Clear dirty regions
		function clear() {
			dirtyRegions.forEach(function (dirty) {
				var size = (2 * dirty.radius) + 4;
				context.clearRect(
					Math.floor(dirty.x - size / 2),
					Math.floor(dirty.y - size / 2),
					Math.ceil(size),
					Math.ceil(size)
				);
			});
		}

		// Update nodes
		function update() {
			nodes.forEach(function (node, index) {
				// MOBILE = SMOOTH AMBIENT MOTION
				if (!interactive) {
					var displayText = getTextForScreen(section, canvas.width);
					var textWidth = context.measureText(displayText.split('\n')[0] || displayText).width;
					var t = Date.now() * 0.0005;
					var radius = textWidth * 0.15;

					mouse.x = canvas.width * 0.3 + Math.cos(t) * radius;
					mouse.y = canvas.height * 0.8 + Math.sin(t * 1.3) * radius * 0.6;
				}

				var angle = Math.atan2(node.y - mouse.y, node.x - mouse.x);
				node.vx += Math.cos(angle) * distanceTo(mouse, node, true) + (node.goalX - node.x) * 0.1;
				node.vy += Math.sin(angle) * distanceTo(mouse, node, true) + (node.goalY - node.y) * 0.1;

				node.vx *= 0.7;
				node.vy *= 0.7;

				node.x += node.vx;
				node.y += node.vy;

				if (forceFactor)
					inputForce = Math.min(inputForce + 1, 2000);
				else
					inputForce = Math.max(inputForce - 1, 0);

				var connectionDistance = canvas.width <= 768 ? 30 : 50;
				var connectionDistanceSq = connectionDistance * connectionDistance;

				for (var j = index + 1; j < nodes.length; j++) {
					var other = nodes[j];
					var distSq = distanceToSq(node, other);

					if (distSq < connectionDistanceSq) {
						var dist = Math.sqrt(distSq);
						context.save();
						context.beginPath();
						context.globalAlpha = 1 - dist / (connectionDistance * 2);
						context.lineWidth = canvas.width <= 768 ? 0.5 : 1;
						context.strokeStyle = '#d1d5db';
						context.moveTo(node.x, node.y);
						context.lineTo(other.x, other.y);
						context.stroke();
						context.restore();
					}
				}
			});
		}

		// Render nodes
		function render() {
			nodes.forEach(function (node, i) {
				context.save();
				context.fillStyle = '#d1d5db';
				context.beginPath();
				context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
				context.fill();
				context.restore();

				dirtyRegions[i].x = node.x;
				dirtyRegions[i].y = node.y;
			});
		}

		// Build texture
		function buildTexture() {
			if (!isVisible && nodes.length > 0 && !input) {
				requestAnimFrame(buildTexture);
				return;
			}

			context.clearRect(0, 0, canvas.width, canvas.height);

			if (nodes.length === 0 || input) {
				input = false;

				var fontSize = getResponsiveFontSize(canvas.width);
				var particleSpacing = getResponsiveParticleSpacing(canvas.width);
				var displayText = getTextForScreen(section, canvas.width);

				context.font = 'bold ' + fontSize + 'px Outfit';
				context.fillStyle = '#d1d5db';
				context.textAlign = 'center';

				// Handle multi-line text
				var lines = displayText.split('\n');
				if (lines.length > 1) {
					var lineHeight = fontSize * 1.2;
					var totalHeight = (lines.length - 1) * lineHeight;
					var startY = canvas.height * 0.55 - (totalHeight / 2);

					lines.forEach(function (line, index) {
						var y = startY + (index * lineHeight);
						context.fillText(line, canvas.width * 0.5, y);
					});
				} else {
					context.fillText(displayText, canvas.width * 0.5, canvas.height * 0.55);
				}

				var surface = context.getImageData(0, 0, canvas.width, canvas.height);
				context.clearRect(0, 0, canvas.width, canvas.height);

				nodes = [];
				dirtyRegions = [];

				for (var w = 0; w < surface.width; w += particleSpacing) {
					for (var h = 0; h < surface.height; h += particleSpacing) {
						var color = surface.data[(h * surface.width * 4) + (w * 4) - 1];
						if (color === 255) {
							var baseRadius = canvas.width <= 768 ? 1.5 : 2;
							var maxRadius = canvas.width <= 768 ? 3 : 5;
							var radius = baseRadius + Math.random() * (maxRadius - baseRadius);

							nodes.push({
								x: canvas.width * 0.5,
								y: canvas.height * 0.5,
								vx: 0,
								vy: 0,
								goalX: w,
								goalY: h,
								radius: radius
							});

							dirtyRegions.push({
								x: canvas.width * 0.5,
								y: canvas.height * 0.5,
								radius: radius
							});
						}
					}
				}
			}

			clear();
			update();
			render();
			requestAnimFrame(buildTexture);
		}

		// Start animation
		buildTexture();

		return {
			canvas: canvas,
			section: section
		};
	}

	// ==========================
	// INITIALIZE ALL SECTIONS
	// ==========================

	Typo.init = function () {
		sections.forEach(function (section) {
			var instance = initSection(section);
			if (instance) {
				instances[section.name] = instance;
			}
		});
	};

	// ==========================
	// REQUEST ANIMATION FRAME
	// ==========================

	window.requestAnimFrame = (function () {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	if (document.fonts) {
		document.fonts.ready.then(function () {
			Typo.init();
		});
	} else {
		window.addEventListener('DOMContentLoaded', Typo.init);
	}

})(Typo);
