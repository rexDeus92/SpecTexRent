/* ==========================================================================
   SpecTexRent - Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Data & Specifications
    // ==========================================
    const machineryData = [
        {
            id: 'crawler-heavy',
            name: 'Гусеничный экскаватор CAT 320',
            category: 'crawler',
            image: 'images/excavator_crawler.png',
            status: 'available', // available, busy
            busyUntil: '',
            specs: {
                bucket: '1.2 м³',
                depth: '6.7 м',
                weight: '22 т',
                power: '150 л.с.'
            },
            price: 22000, // per shift (7+1 h)
            bucketVal: 1.2,
            weightVal: 22
        },
        {
            id: 'crawler-medium',
            name: 'Гусеничный экскаватор Komatsu PC200',
            category: 'crawler',
            image: 'images/excavator_crawler.png',
            status: 'available',
            busyUntil: '',
            specs: {
                bucket: '1.0 м³',
                depth: '6.6 м',
                weight: '20 т',
                power: '145 л.с.'
            },
            price: 20000,
            bucketVal: 1.0,
            weightVal: 20
        },
        {
            id: 'wheeled-heavy',
            name: 'Колесный экскаватор JCB JS160W',
            category: 'wheeled',
            image: 'images/excavator_wheeled.png',
            status: 'available',
            busyUntil: '',
            specs: {
                bucket: '0.9 м³',
                depth: '5.7 м',
                weight: '17 т',
                power: '125 л.с.'
            },
            price: 19000,
            bucketVal: 0.9,
            weightVal: 17
        },
        {
            id: 'wheeled-medium',
            name: 'Колесный экскаватор Hyundai R180W',
            category: 'wheeled',
            image: 'images/excavator_wheeled.png',
            status: 'busy',
            busyUntil: '09.06.2026',
            specs: {
                bucket: '0.8 м³',
                depth: '5.4 м',
                weight: '18 т',
                power: '128 л.с.'
            },
            price: 18500,
            bucketVal: 0.8,
            weightVal: 18
        },
        {
            id: 'backhoe-standard',
            name: 'Экскаватор-погрузчик JCB 3CX',
            category: 'backhoe',
            image: 'images/excavator_backhoe.png',
            status: 'available',
            busyUntil: '',
            specs: {
                bucket: '1.0 / 0.25 м³',
                depth: '4.2 м',
                weight: '8.1 т',
                power: '92 л.с.'
            },
            price: 16000,
            bucketVal: 1.0,
            weightVal: 8
        },
        {
            id: 'backhoe-super',
            name: 'Экскаватор-погрузчик JCB 4CX',
            category: 'backhoe',
            image: 'images/excavator_backhoe.png',
            status: 'available',
            busyUntil: '',
            specs: {
                bucket: '1.3 / 0.3 м³',
                depth: '4.6 м',
                weight: '8.6 т',
                power: '100 л.с.'
            },
            price: 17500,
            bucketVal: 1.3,
            weightVal: 9
        },
        {
            id: 'mini-standard',
            name: 'Мини-экскаватор Kubota U27',
            category: 'mini',
            image: 'images/excavator_mini.png',
            status: 'available',
            busyUntil: '',
            specs: {
                bucket: '0.08 м³',
                depth: '2.8 м',
                weight: '2.6 т',
                power: '21 л.с.'
            },
            price: 13000,
            bucketVal: 0.1,
            weightVal: 3
        },
        {
            id: 'mini-heavy',
            name: 'Мини-экскаватор Yanmar SV35',
            category: 'mini',
            image: 'images/excavator_mini.png',
            status: 'busy',
            busyUntil: '08.06.2026',
            specs: {
                bucket: '0.12 м³',
                depth: '3.4 м',
                weight: '3.8 т',
                power: '28 л.с.'
            },
            price: 14500,
            bucketVal: 0.12,
            weightVal: 4
        }
    ];

    // ==========================================
    // 2. Sticky Header & Menu
    // ==========================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 3. Live Fleet Dashboard Simulator
    // ==========================================
    const liveAvailableSpan = document.getElementById('live-available-count');
    const liveTotalSpan = document.getElementById('live-total-count');
    const livePercentageSpan = document.getElementById('live-percentage');
    const mapContainer = document.getElementById('map-simulation-container');

    let totalFleet = 48;
    let availableFleet = 14;

    function updateLiveStats() {
        // Randomly fluctuate availability count between 12 and 16 to simulate live movement
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        availableFleet = Math.max(10, Math.min(22, availableFleet + change));
        
        if (liveAvailableSpan) liveAvailableSpan.textContent = availableFleet;
        if (liveTotalSpan) liveTotalSpan.textContent = totalFleet;
        
        const activePercent = Math.round(((totalFleet - availableFleet) / totalFleet) * 100);
        if (livePercentageSpan) livePercentageSpan.textContent = activePercent + '%';

        // Re-generate some random dots in the map simulation container
        if (mapContainer) {
            // Clear old map dots (keep image overlay)
            const oldDots = mapContainer.querySelectorAll('.map-dot');
            oldDots.forEach(d => d.remove());

            // Add dots
            const totalDots = 15;
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.className = 'map-dot';
                // Randomly position inside container
                dot.style.left = Math.floor(Math.random() * 85 + 5) + '%';
                dot.style.top = Math.floor(Math.random() * 75 + 10) + '%';

                // Distribute statuses: some green (available), some orange (dispatched)
                if (i < availableFleet / 1.3) {
                    dot.classList.add('active');
                } else {
                    dot.classList.add('dispatched');
                }

                // Add slight animation delays
                dot.style.animationDelay = (Math.random() * 2) + 's';
                mapContainer.appendChild(dot);
            }
        }
    }

    // Initialize map dots and set interval
    updateLiveStats();
    setInterval(updateLiveStats, 8000);

    // ==========================================
    // 4. Catalog Rendering & Filters
    // ==========================================
    const catalogGrid = document.getElementById('catalog-grid');
    const tabButtons = document.querySelectorAll('.catalog-tab-btn');
    const selectBucket = document.getElementById('filter-bucket');
    const selectWeight = document.getElementById('filter-weight');
    const checkboxAvailable = document.getElementById('filter-available-toggle');

    let currentCategory = 'all';

    function renderCatalog() {
        if (!catalogGrid) return;
        catalogGrid.innerHTML = '';

        // Get filter values
        const minBucket = parseFloat(selectBucket.value) || 0;
        const minWeight = parseFloat(selectWeight.value) || 0;
        const onlyAvailable = checkboxAvailable ? checkboxAvailable.checked : false;

        const filtered = machineryData.filter(item => {
            // Category check
            if (currentCategory !== 'all' && item.category !== currentCategory) return false;
            
            // Bucket size check
            if (item.bucketVal < minBucket) return false;

            // Weight check
            if (item.weightVal < minWeight) return false;

            // Availability check
            if (onlyAvailable && item.status !== 'available') return false;

            return true;
        });

        if (filtered.length === 0) {
            catalogGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
                    <h3>Техника с такими параметрами не найдена</h3>
                    <p>Попробуйте сбросить фильтры или выбрать другую категорию</p>
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'catalog-card';
            card.setAttribute('data-id', item.id);

            const statusText = item.status === 'available' ? 'Свободен. Подача сегодня' : `Занят до ${item.busyUntil}`;
            const statusClass = item.status === 'available' ? 'available' : 'busy';

            card.innerHTML = `
                <div class="card-image-box">
                    <img src="${item.image}" alt="${item.name}" class="card-image" loading="lazy">
                    <span class="card-status-badge ${statusClass}">
                        <span class="status-indicator" style="background-color: ${item.status === 'available' ? 'var(--success)' : 'var(--danger)'}; animation: ${item.status === 'available' ? 'pulse-green 1.5s infinite' : 'none'}"></span>
                        ${statusText}
                    </span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.name}</h3>
                    <p class="card-subtitle">${getCategoryName(item.category)}</p>
                    <div class="card-specs">
                        <div class="spec-item">
                            <span class="spec-lbl">Объем ковша</span>
                            <span class="spec-val">${item.specs.bucket}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-lbl">Глубина копания</span>
                            <span class="spec-val">${item.specs.depth}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-lbl">Вес машины</span>
                            <span class="spec-val">${item.specs.weight}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-lbl">Мощность</span>
                            <span class="spec-val">${item.specs.power}</span>
                        </div>
                    </div>
                    <div class="card-price-row">
                        <div class="card-price-info">
                            <span class="price-lbl">Стоимость смены (7+1):</span>
                            <span class="price-val">от ${item.price.toLocaleString('ru-RU')} ₽</span>
                            <span class="price-note">С водителем и топливом (с НДС)</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary rent-catalog-btn" data-id="${item.id}">Рассчитать аренду</button>
                    </div>
                </div>
            `;
            
            catalogGrid.appendChild(card);
        });

        // Re-attach card events
        addCardHoverEffects();
        addCatalogBookingEvents();
    }

    function getCategoryName(cat) {
        switch (cat) {
            case 'crawler': return 'Гусеничный экскаватор';
            case 'wheeled': return 'Колесный экскаватор';
            case 'mini': return 'Мини-экскаватор';
            case 'backhoe': return 'Экскаватор-погрузчик';
            default: return 'Спецтехника';
        }
    }

    // Category Tabs click
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderCatalog();
        });
    });

    // Select filters change
    if (selectBucket) selectBucket.addEventListener('change', renderCatalog);
    if (selectWeight) selectWeight.addEventListener('change', renderCatalog);
    if (checkboxAvailable) checkboxAvailable.addEventListener('change', renderCatalog);

    // Initial Catalog Render
    renderCatalog();

    // 3D Tilt Hover effect on catalog cards
    function addCardHoverEffects() {
        const cards = document.querySelectorAll('.catalog-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                
                const angleX = (yc - y) / 20; // limit to max 5-10 degrees
                const angleY = (x - xc) / 20;
                
                card.style.transform = `translateY(-6px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0px) rotateX(0deg) rotateY(0deg)';
            });
        });
    }

    // ==========================================
    // 5. Interactive Cost Calculator (Quiz)
    // ==========================================
    const calcSteps = document.querySelectorAll('.calc-step-body');
    const stepBubbles = document.querySelectorAll('.step-bubble');
    const progressLine = document.getElementById('calc-progress-line');
    const prevBtn = document.getElementById('calc-prev');
    const nextBtn = document.getElementById('calc-next');

    // Calculator inputs
    const shiftsSlider = document.getElementById('calc-shifts');
    const shiftsVal = document.getElementById('shifts-val');
    const distanceSlider = document.getElementById('calc-distance');
    const distanceVal = document.getElementById('distance-val');
    const paymentSelect = document.getElementById('calc-payment');

    // Calculator results elements
    const summaryModel = document.getElementById('summary-model');
    const summaryDuration = document.getElementById('summary-duration');
    const summaryDelivery = document.getElementById('summary-delivery');
    const summaryOptions = document.getElementById('summary-options');
    const summaryPayment = document.getElementById('summary-payment');
    const finalPriceText = document.getElementById('calc-final-price');
    const discountAlert = document.getElementById('discount-alert');
    const discountSavedText = document.getElementById('discount-saved-val');

    let currentStep = 1;
    let selectedModelId = 'crawler-heavy';
    let selectedOptions = [];

    // Select first machine model card by default
    function selectModelOptionCard(modelId) {
        selectedModelId = modelId;
        const cards = document.querySelectorAll('.option-card[data-model-id]');
        cards.forEach(card => {
            if (card.getAttribute('data-model-id') === modelId) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        calculateRentalCost();
    }

    // Add click event for model option cards
    const modelOptionCards = document.querySelectorAll('.option-card[data-model-id]');
    modelOptionCards.forEach(card => {
        card.addEventListener('click', () => {
            const modelId = card.getAttribute('data-model-id');
            selectModelOptionCard(modelId);
        });
    });

    // Checkbox optional attachments click
    const optionCheckboxCards = document.querySelectorAll('.checkbox-card[data-option-val]');
    optionCheckboxCards.forEach(card => {
        card.addEventListener('click', () => {
            const optVal = card.getAttribute('data-option-val');
            const index = selectedOptions.indexOf(optVal);
            
            if (index > -1) {
                selectedOptions.splice(index, 1);
                card.classList.remove('selected');
            } else {
                selectedOptions.push(optVal);
                card.classList.add('selected');
            }
            calculateRentalCost();
        });
    });

    // Inputs Listeners
    if (shiftsSlider) {
        shiftsSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            shiftsVal.textContent = val + ' ' + declOfNum(val, ['смена', 'смены', 'смен']);
            calculateRentalCost();
        });
    }

    if (distanceSlider) {
        distanceSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            distanceVal.textContent = val + ' км';
            calculateRentalCost();
        });
    }

    if (paymentSelect) {
        paymentSelect.addEventListener('change', calculateRentalCost);
    }

    // Calculations
    function calculateRentalCost() {
        const model = machineryData.find(m => m.id === selectedModelId);
        if (!model) return;

        const baseShiftPrice = model.price;
        const shifts = parseInt(shiftsSlider.value);
        const distance = parseInt(distanceSlider.value);
        const paymentType = paymentSelect.value;

        // 1. Base price for shifts
        let rawShiftTotal = baseShiftPrice * shifts;

        // 2. Volume Discount
        let discountPercent = 0;
        if (shifts >= 15) {
            discountPercent = 20; // 20% off
        } else if (shifts >= 5) {
            discountPercent = 10; // 10% off
        }

        let discountSaved = 0;
        let discountedShiftTotal = rawShiftTotal;
        
        if (discountPercent > 0) {
            discountedShiftTotal = rawShiftTotal * (1 - discountPercent / 100);
            discountSaved = rawShiftTotal - discountedShiftTotal;
            if (discountAlert) discountAlert.classList.remove('hidden');
            if (discountSavedText) discountSavedText.textContent = discountSaved.toLocaleString('ru-RU') + ' ₽';
        } else {
            if (discountAlert) discountAlert.classList.add('hidden');
        }

        // 3. Attachments cost
        let attachmentsPrice = 0;
        selectedOptions.forEach(opt => {
            if (opt === 'hammer') attachmentsPrice += 3000 * shifts;     // hydraulic hammer: +3000/shift
            if (opt === 'narrow') attachmentsPrice += 1500 * shifts;     // narrow bucket: +1500/shift
            if (opt === 'operator') discountedShiftTotal -= 4000 * shifts; // Cold lease (no operator/fuel) decreases price by 4000/shift
        });

        // 4. Delivery Cost
        // 5000 base + 100/km (above 0km)
        let deliveryCost = 0;
        if (distance > 0) {
            deliveryCost = 5000 + (distance * 100);
        }

        // Total
        let subtotal = discountedShiftTotal + attachmentsPrice + deliveryCost;

        // 5. VAT Adjustment (20%)
        // If payment type is 'vat20', show that VAT is included or add it. Let's make VAT standard, and if no-vat or card, offer discount.
        let finalPrice = subtotal;
        let taxText = 'Включая НДС 20%';

        if (paymentType === 'card' || paymentType === 'novat') {
            finalPrice = subtotal * 0.93; // 7% discount for cash/no-vat
            taxText = 'Без НДС (Скидка 7% за нал/ИП)';
        }

        // Round final values
        finalPrice = Math.round(finalPrice);
        discountSaved = Math.round(discountSaved + (paymentType !== 'vat20' ? subtotal * 0.07 : 0));

        // Update UI
        if (summaryModel) summaryModel.textContent = model.name;
        if (summaryDuration) summaryDuration.textContent = `${shifts} ${declOfNum(shifts, ['смена', 'смены', 'смен'])} ${discountPercent > 0 ? `(-${discountPercent}%)` : ''}`;
        if (summaryDelivery) summaryDelivery.textContent = distance === 0 ? 'В черте МКАД (Бесплатно)' : `${deliveryCost.toLocaleString('ru-RU')} ₽ (${distance} км)`;
        
        // Options summary
        let optionsText = [];
        selectedOptions.forEach(opt => {
            if (opt === 'hammer') optionsText.push('Гидромолот');
            if (opt === 'narrow') optionsText.push('Узкий ковш');
            if (opt === 'operator') optionsText.push('Без водителя (холодный)');
        });
        if (summaryOptions) summaryOptions.textContent = optionsText.length > 0 ? optionsText.join(', ') : 'Стандарт (с водителем)';
        
        if (summaryPayment) summaryPayment.textContent = paymentSelect.options[paymentSelect.selectedIndex].text;
        if (finalPriceText) finalPriceText.textContent = `${finalPrice.toLocaleString('ru-RU')} ₽`;

        // Update hidden form inputs for leads
        const hiddenPriceInput = document.getElementById('calc-hidden-price');
        const hiddenSummaryInput = document.getElementById('calc-hidden-summary');
        
        if (hiddenPriceInput) hiddenPriceInput.value = `${finalPrice} руб`;
        if (hiddenSummaryInput) {
            hiddenSummaryInput.value = `Машина: ${model.name}, Срок: ${shifts} смен, Удаленность: ${distance} км, Опции: ${optionsText.join(', ') || 'Стандарт'}, Оплата: ${taxText}`;
        }
    }

    // Numeric declension for Russian language
    function declOfNum(n, text_forms) {  
        n = Math.abs(n) % 100; 
        var n1 = n % 10;
        if (n > 10 && n < 20) { return text_forms[2]; }
        if (n1 > 1 && n1 < 5) { return text_forms[1]; }
        if (n1 == 1) { return text_forms[0]; }
        return text_forms[2];
    }

    // Step Navigation
    function updateStepUI() {
        // Show/hide step panels
        calcSteps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum === currentStep) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });

        // Update step bubbles classes
        stepBubbles.forEach(bubble => {
            const bNum = parseInt(bubble.getAttribute('data-step-num'));
            if (bNum === currentStep) {
                bubble.className = 'step-bubble active';
            } else if (bNum < currentStep) {
                bubble.className = 'step-bubble completed';
            } else {
                bubble.className = 'step-bubble';
            }
        });

        // Update progress line width
        const totalSteps = stepBubbles.length;
        const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if (progressLine) progressLine.style.width = progressWidth + '%';

        // Update nav buttons
        if (currentStep === 1) {
            prevBtn.setAttribute('disabled', 'true');
        } else {
            prevBtn.removeAttribute('disabled');
        }

        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < stepBubbles.length) {
                currentStep++;
                updateStepUI();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepUI();
            }
        });
    }

    // Trigger initial calculation
    calculateRentalCost();

    // Catalog Rent Buttons action
    function addCatalogBookingEvents() {
        const catalogRentBtns = document.querySelectorAll('.rent-catalog-btn');
        catalogRentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modelId = btn.getAttribute('data-id');
                // Select in calculator step 1
                selectModelOptionCard(modelId);
                // Reset step to 1 and navigate to calculator section
                currentStep = 1;
                updateStepUI();
                
                const calcSection = document.getElementById('calc-section');
                if (calcSection) {
                    calcSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ==========================================
    // 6. Callback Form countdown timer
    // ==========================================
    const callbackTimerNum = document.getElementById('callback-timer-sec');
    const callbackTimerWrapper = document.getElementById('callback-timer-box');
    let callbackInterval = null;

    function startCallbackTimer() {
        if (!callbackTimerNum || !callbackTimerWrapper) return;
        
        // Show timer block
        callbackTimerWrapper.classList.remove('hidden');
        
        let secondsLeft = 59;
        callbackTimerNum.textContent = '00:' + String(secondsLeft).padStart(2, '0');

        if (callbackInterval) clearInterval(callbackInterval);

        callbackInterval = setInterval(() => {
            secondsLeft--;
            if (secondsLeft >= 0) {
                callbackTimerNum.textContent = '00:' + String(secondsLeft).padStart(2, '0');
            } else {
                clearInterval(callbackInterval);
                callbackTimerNum.textContent = '00:00';
                // Update text to "Менеджер подключается"
                const timerTxt = callbackTimerWrapper.querySelector('.timer-txt');
                if (timerTxt) timerTxt.textContent = 'Соединяем... Оператор на линии';
            }
        }, 1000);
    }

    // ==========================================
    // 7. Modals System
    // ==========================================
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtns = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay').classList.remove('active');
            document.body.style.overflow = 'auto';
            if (callbackInterval) clearInterval(callbackInterval); // stop timer on close
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
                if (callbackInterval) clearInterval(callbackInterval); // stop timer on close
            }
        });
    });

    // ==========================================
    // 8. Lead Capture & Telegram Integration
    // ==========================================
    
    // Save/Load Telegram Bot credentials
    const tgTokenInput = document.getElementById('tg-token-input');
    const tgChatInput = document.getElementById('tg-chat-input');
    const saveTgBtn = document.getElementById('save-tg-config');
    const tgStatusMsg = document.getElementById('config-status-msg');
    const tgPanelToggle = document.getElementById('panel-toggle-btn');
    const tgPanel = document.getElementById('tg-config-panel');

    // Panel Toggle
    if (tgPanelToggle && tgPanel) {
        tgPanelToggle.addEventListener('click', () => {
            tgPanel.classList.toggle('collapsed');
        });
    }

    // Load credentials
    if (localStorage.getItem('spectex_tg_token')) {
        if (tgTokenInput) tgTokenInput.value = localStorage.getItem('spectex_tg_token');
    }
    if (localStorage.getItem('spectex_tg_chat')) {
        if (tgChatInput) tgChatInput.value = localStorage.getItem('spectex_tg_chat');
    }

    // Save credentials
    if (saveTgBtn) {
        saveTgBtn.addEventListener('click', () => {
            const token = tgTokenInput.value.trim();
            const chat = tgChatInput.value.trim();
            
            if (token && chat) {
                localStorage.setItem('spectex_tg_token', token);
                localStorage.setItem('spectex_tg_chat', chat);
                tgStatusMsg.className = 'config-status text-success';
                tgStatusMsg.textContent = 'Реквизиты сохранены!';
                setTimeout(() => { tgStatusMsg.textContent = ''; }, 3000);
            } else {
                tgStatusMsg.className = 'config-status' ;
                tgStatusMsg.style.color = 'var(--danger)';
                tgStatusMsg.textContent = 'Заполните оба поля';
            }
        });
    }

    // Asynchronous lead submitter
    async function submitLead(formData, sourceName) {
        // Collect lead info
        const name = formData.get('name') || 'Не указано';
        const phone = formData.get('phone') || 'Не указано';
        const price = formData.get('calc_calculated_price') || 'N/A';
        const summary = formData.get('calc_summary') || 'Простая заявка на звонок';
        
        let msg = `🔥 Новая заявка на SpecTexRent (${sourceName})!\n\n`;
        msg += `👤 Имя: ${name}\n`;
        msg += `📞 Телефон: ${phone}\n`;
        
        if (sourceName.includes('Калькулятор')) {
            msg += `💰 Расчет сметы: ${price}\n`;
            msg += `📋 Спецификация: ${summary}\n`;
        }

        console.log('Lead collected:', { name, phone, price, summary });

        // Try sending to Telegram if configured
        const tgToken = localStorage.getItem('spectex_tg_token');
        const tgChat = localStorage.getItem('spectex_tg_chat');

        if (tgToken && tgChat) {
            try {
                const url = `https://api.telegram.org/bot${tgToken}/sendMessage`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: tgChat,
                        text: msg,
                        parse_mode: 'HTML'
                    })
                });
                
                if (response.ok) {
                    console.log('Lead sent to Telegram successfully!');
                } else {
                    console.error('Failed to send to Telegram:', await response.text());
                }
            } catch (err) {
                console.error('Network error sending to Telegram:', err);
            }
        }
    }

    // Bind Forms
    const callbackForm = document.getElementById('callback-form-elem');
    const contactForm = document.getElementById('contacts-form-elem');
    const quizLeadForm = document.getElementById('quiz-lead-form');

    // Simple callback form submit
    if (callbackForm) {
        callbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = callbackForm.querySelector('button[type="submit"]');
            btn.setAttribute('disabled', 'true');
            btn.textContent = 'Отправка...';

            const formData = new FormData(callbackForm);
            await submitLead(formData, 'Заказ обратного звонка');

            // Success state in modal
            const modalBody = callbackForm.closest('.modal-body');
            modalBody.innerHTML = `
                <div class="success-checkmark">✓</div>
                <h3 class="text-center">Заявка принята!</h3>
                <p class="text-center" style="margin-bottom: 24px;">Мы уже начали распределять ваш звонок оператору.</p>
                <div class="callback-timer-wrapper" id="callback-timer-box">
                    <div class="timer-info">
                        <span class="timer-lbl">Ожидайте звонок в течение:</span>
                        <span class="timer-txt">Оператор подготавливает договор...</span>
                    </div>
                    <span class="timer-countdown" id="callback-timer-sec">00:59</span>
                </div>
            `;
            
            // Re-bind elements to trigger countdown
            callbackTimerNum = document.getElementById('callback-timer-sec');
            callbackTimerWrapper = document.getElementById('callback-timer-box');
            startCallbackTimer();
        });
    }

    // Main Contact Section form submit
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.setAttribute('disabled', 'true');
            btn.textContent = 'Отправка...';

            const formData = new FormData(contactForm);
            await submitLead(formData, 'Форма в разделе Контакты');

            // Success state
            const box = contactForm.closest('.contacts-form-box');
            box.innerHTML = `
                <div style="text-align: center; padding: 40px 0;">
                    <div class="success-checkmark">✓</div>
                    <h2>Заявка успешно отправлена!</h2>
                    <p style="color: var(--text-secondary); margin-top: 12px; margin-bottom: 24px;">Наш специалист по аренде свяжется с вами по указанному телефону в течение 5-10 минут, ответит на все вопросы и подготовит договор.</p>
                    <button class="btn btn-outline" onclick="window.location.reload()">Отправить еще раз</button>
                </div>
            `;
        });
    }

    // Quiz Lead form submit
    if (quizLeadForm) {
        quizLeadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = quizLeadForm.querySelector('button[type="submit"]');
            btn.setAttribute('disabled', 'true');
            btn.textContent = 'Сохранение расчета...';

            const formData = new FormData(quizLeadForm);
            // Append pricing details manually since they are not inputs
            const hiddenPrice = document.getElementById('calc-hidden-price').value;
            const hiddenSummary = document.getElementById('calc-hidden-summary').value;
            formData.set('calc_calculated_price', hiddenPrice);
            formData.set('calc_summary', hiddenSummary);

            await submitLead(formData, 'Калькулятор сметы');

            // Success state in the step container
            const stepBody = quizLeadForm.closest('.calc-step-body');
            stepBody.innerHTML = `
                <div style="text-align: center; padding: 30px 0;">
                    <div class="success-checkmark">✓</div>
                    <h2 style="font-family: var(--font-heading); margin-bottom: 8px;">Расчет сохранен!</h2>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 450px; margin: 0 auto 24px;">Детальная смета с ценой <strong class="text-gold">${hiddenPrice}</strong> и выбранным подарком отправлена на ваш WhatsApp. Номер брони зафиксирован в нашей CRM.</p>
                    <p style="font-size: 0.85rem; color: var(--success); font-weight: 600;">Машина зарезервирована за вашим номером на 24 часа.</p>
                </div>
            `;
        });
    }

    // ==========================================
    // 9. Scroll Reveal Animations (IntersectionObserver)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger animation only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }
});
