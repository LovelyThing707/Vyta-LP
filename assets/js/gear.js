document.addEventListener('DOMContentLoaded', () => {
    const rotatingCircle = document.getElementById('rotatingCircle');
    const centerGear = document.getElementById('centerGear');
    const sections = document.querySelectorAll('.content-section');
    const markers = document.querySelectorAll('.step-marker');
    const markerContents = document.querySelectorAll('.marker-content');
   
    const stepAngle = 60; // 外円のステップ角度 (360/6)
    const gearStepAngle = 45; // ギアのステップ角度 (360/8)
   
    let isOpening = true;


    // --- 1. タイトル文字の分割処理 ---
    document.querySelectorAll('.step-title').forEach(title => {
        const subSpan = title.querySelector('.step-sub');
        let text = "";
        Array.from(title.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.nodeValue;
            }
        });
        text = text.trim();


        title.innerHTML = '';
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char-reveal';
            span.style.transitionDelay = `${0.6 + (i * 0.05)}s`;
            title.appendChild(span);
        });
        if(subSpan) {
            title.appendChild(subSpan);
        }
    });


    // --- 2. オープニング終了監視 ---
    setTimeout(() => {
        isOpening = false;
        // 外円のアニメーション終了処理
        rotatingCircle.classList.remove('opening-animation');
        rotatingCircle.classList.add('interactive');
        rotatingCircle.style.transform = `translate(-50%, -50%) rotate(0deg)`;


        // ギアのアニメーション終了処理
        centerGear.classList.remove('opening-animation');
        centerGear.classList.add('interactive');
        centerGear.style.transform = `translate(-50%, -50%) rotate(0deg)`;
       
        // マーカーのアニメーションリセット
        markerContents.forEach((el) => {
            el.style.animation = 'none';
        });


        updateAnimation();
    }, 2000);


    // --- 3. アニメーション制御関数 ---
    const updateAnimation = () => {
        if(isOpening) return;


        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const sectionHeight = windowHeight;
       
        // アクティブセクション判定
        let activeIndex = 0;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const dist = Math.abs(windowHeight / 2 - center);
            if (center > 0 && center < windowHeight && dist < windowHeight / 3) {
                 activeIndex = index;
            }
        });


        // スクロール進捗率の計算
        const floatIndex = Math.max(0, (scrollY) / sectionHeight);
       
        // 外円の回転 (反時計回り)
        const currentCircleRotation = -(floatIndex * stepAngle);
        rotatingCircle.style.transform = `translate(-50%, -50%) rotate(${currentCircleRotation}deg)`;
       
        // ギアの回転 (反時計回り・8歯ペース)
        const currentGearRotation = -(floatIndex * gearStepAngle);
        centerGear.style.transform = `translate(-50%, -50%) rotate(${currentGearRotation}deg)`;


        // マーカー数字の正立補正
        const initialAngles = [0, 60, 120, 180, 240, 300];
        markerContents.forEach((content, index) => {
            const counterRotation = -currentCircleRotation - initialAngles[index];
            content.style.transform = `rotate(${counterRotation}deg)`;
        });
       
        // クラス付与
        markers.forEach((marker, index) => {
            if (index === activeIndex) {
                marker.classList.add('active-marker');
                sections[index].classList.add('animate-trigger');
            } else {
                marker.classList.remove('active-marker');
                sections[index].classList.remove('animate-trigger');
            }
        });
    };


    window.addEventListener('scroll', updateAnimation);
    window.addEventListener('resize', updateAnimation);
   
    setTimeout(() => {
        sections[0].classList.add('animate-trigger');
        markers[0].classList.add('active-marker');
    }, 500);
});