/*
 * Copyright MIT © <2013> <Francesco Trillini>
 * Customized for "COMCEPT" - White Text on Light Theme
 */


var Typo = {};


(function(Typo) {
    'use strict';


    var canvas,
        context,
        width,
        height,
        pixelRatio = window.devicePixelRatio || 1;


    var settings = {
        text: "CONCEPT",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontWeight: "bold",
       
        // 自動調整されるパラメータの初期値
        particleGap: 5,
        connectionDist: 20,
        checkRange: 30,
       
        // アニメーション設定
        waveSpeed: 0.002,      
        waveFrequency: 0.003,  
        waveAmplitude: 12,      
       
        particleWiggle: 0.3    
    };


    var particles = [];


    var Particle = function(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.phase = Math.random() * Math.PI * 2;
        this.wiggleSpeed = 0.002 + Math.random() * 0.002;
    };


    Particle.prototype.update = function(time) {
        var wavePhase = time * settings.waveSpeed + this.baseX * settings.waveFrequency;
        var waveY = Math.sin(wavePhase) * settings.waveAmplitude;
        var waveX = Math.cos(wavePhase * 0.8) * (settings.waveAmplitude * 0.3);


        var wiggleX = Math.sin(time * this.wiggleSpeed + this.phase) * settings.particleWiggle;
        var wiggleY = Math.cos(time * this.wiggleSpeed + this.phase) * settings.particleWiggle;


        this.x = this.baseX + waveX + wiggleX;
        this.y = this.baseY + waveY + wiggleY;
    };


    Typo.init = function() {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');


        window.addEventListener('resize', this.resize.bind(this));
       
        this.resize();
        this.loop();
    };


    Typo.createParticles = function() {
        // [Error Fix] 幅や高さが0の場合は処理を中断する（IndexSizeError防止）
        if (!width || !height || width <= 0 || height <= 0) return;


        particles = [];
       
        var tempFontSize = 100;
        context.font = settings.fontWeight + " " + tempFontSize + "px " + settings.fontFamily;
        var tempMetric = context.measureText(settings.text);
       
        var targetWidth = width * (width < 768 ? 0.92 : 0.85);
        // tempMetric.widthが0の場合のゼロ除算対策
        var ratio = (tempMetric.width > 0) ? targetWidth / tempMetric.width : 0;
       
        var fontSize = Math.floor(tempFontSize * ratio);
        if (fontSize > 300) fontSize = 300;
        // フォントサイズが極端に小さい場合も処理しない
        if (fontSize <= 0) return;


        // --- パラメータ調整 ---
        if (width < 768) {
            settings.particleGap = Math.max(3, Math.floor(fontSize / 14));
            settings.connectionDist = settings.particleGap * 3.5;
            settings.checkRange = 35;
            settings.waveFrequency = 0.004;
        } else {
            settings.particleGap = Math.max(5, Math.floor(fontSize / 18));
            settings.connectionDist = settings.particleGap * 3.5;
            settings.checkRange = 45;
            settings.waveFrequency = 0.0025;
        }


        context.font = settings.fontWeight + " " + fontSize + "px " + settings.fontFamily;
        context.textAlign = "center";
        context.textBaseline = "middle";


        var centerX = width / 2;
        var centerY = height / 2;


        context.clearRect(0, 0, width, height);
        // 背景が明るいので、文字データ取得用は黒で描画して確実にピクセルを拾う
        context.fillStyle = "black";
        context.fillText(settings.text, centerX, centerY);


        var scanMargin = fontSize * 0.6;
        var startY = Math.max(0, Math.floor(centerY - scanMargin));
        var endY = Math.min(height, Math.floor(centerY + scanMargin));
       
        // [Error Fix] スキャン範囲が無効な場合はgetImageDataを実行しない
        if (endY <= startY) return;


        var imageData = context.getImageData(0, startY, width, endY - startY);
        var data = imageData.data;
       
        var gap = settings.particleGap;
        // gapが0以下にならないように保護
        if (gap <= 0) gap = 1;


        var jitterStrength = gap * 0.3;


        for (var y = 0; y < (endY - startY); y += gap) {
            var rowOffset = (y % (gap * 2)) === 0 ? 0 : Math.floor(gap / 2);
           
            for (var x = 0; x < width; x += gap) {
                // 配列アクセス範囲チェック
                var index = ((width * y) + x + rowOffset) * 4 + 3;
                if (index < data.length) {
                    var alpha = data[index];
                   
                    if (alpha > 100) {
                        var jx = (Math.random() - 0.5) * jitterStrength;
                        var jy = (Math.random() - 0.5) * jitterStrength;
                       
                        particles.push(new Particle(x + rowOffset + jx, y + startY + jy));
                    }
                }
            }
        }
       
        context.clearRect(0, 0, width, height);
    };


    Typo.resize = function() {
        width = window.innerWidth;
        height = window.innerHeight;


        // [Error Fix] サイズが0の場合は処理しない
        if (!width || !height) return;


        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
       
        context.scale(pixelRatio, pixelRatio);
       
        this.createParticles();
    };


    Typo.loop = function() {
        requestAnimationFrame(Typo.loop);


        // 幅が有効でないときは描画しない
        if (!width || !height) return;


        context.clearRect(0, 0, width, height);
       
        var time = Date.now();


        var len = particles.length;
        for (var i = 0; i < len; i++) {
            particles[i].update(time);
        }


        // --- 調整箇所: 線の色を白に変更 ---
        // 背景が明るいため、白が見えるように不透明度を高め(0.8)に設定
        context.strokeStyle = "rgba(255, 255, 255, 0.85)";
        context.lineWidth = 0.8; // 線も少し太く
        context.beginPath();


        var distLimit = settings.connectionDist;
        var checkRange = settings.checkRange;


        for (var i = 0; i < len; i++) {
            var p1 = particles[i];
            var maxCheck = Math.min(len, i + checkRange);


            for (var j = i + 1; j < maxCheck; j++) {
                var p2 = particles[j];
               
                var dx = p1.x - p2.x;
                if (Math.abs(dx) > distLimit) { continue; }


                var dy = p1.y - p2.y;
                if (Math.abs(dy) > distLimit) { continue; }


                if ((dx * dx + dy * dy) < (distLimit * distLimit)) {
                    context.moveTo(p1.x, p1.y);
                    context.lineTo(p2.x, p2.y);
                }
            }
        }
        context.stroke();


        // --- 調整箇所: 点の色を白に変更 ---
        context.fillStyle = "#FFFFFF";
        context.beginPath();
        for (var i = 0; i < len; i++) {
             context.rect(particles[i].x, particles[i].y, 2.4, 2.4);
        }
        context.fill();
    };


})(Typo);


window.onload = function() {
    Typo.init();
};