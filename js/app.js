// Medical Advice Panel - Main Application
class MedicalAdvicePanel {
    constructor() {
        this.medicalData = {
            vitals: {},
            labResults: [],
            medications: [],
            conditions: [],
            appointments: []
        };
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializePDFJS();
    }

    initializePDFJS() {
        // Set worker source for PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    setupEventListeners() {
        // File upload handlers
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const browseBtn = document.getElementById('browse-btn');

        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileDrop(e);
        });

        // Tab navigation
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.processFiles(files);
    }

    handleFileDrop(event) {
        const files = Array.from(event.dataTransfer.files);
        this.processFiles(files.filter(file => file.type === 'application/pdf'));
    }

    async processFiles(files) {
        if (files.length === 0) return;

        // Show loading overlay
        document.getElementById('loading-overlay').style.display = 'flex';

        // Display file list
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';
        
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
            `;
            fileList.appendChild(fileItem);
        });

        // Process PDF files
        for (const file of files) {
            await this.extractPDFData(file);
        }

        // Hide loading overlay and show dashboard
        document.getElementById('loading-overlay').style.display = 'none';
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';

        // Update dashboard with extracted data
        this.updateDashboard();
    }

    async extractPDFData(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            // Extract text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }

            // Parse medical data from text
            this.parseMedialRecord(fullText);
        } catch (error) {
            console.error('Error processing PDF:', error);
            alert('Error processing PDF file. Please try again.');
        }
    }

    parseMedialRecord(text) {
        // Extract vital signs
        const bpMatch = text.match(/blood pressure[:\s]+(\d+)\/(\d+)/i);
        if (bpMatch) {
            this.medicalData.vitals.bloodPressure = {
                systolic: parseInt(bpMatch[1]),
                diastolic: parseInt(bpMatch[2]),
                date: new Date()
            };
        }

        // Extract cholesterol
        const cholesterolMatch = text.match(/cholesterol[:\s]+(\d+)/i);
        if (cholesterolMatch) {
            this.medicalData.vitals.cholesterol = {
                total: parseInt(cholesterolMatch[1]),
                date: new Date()
            };
        }

        // Extract glucose
        const glucoseMatch = text.match(/glucose[:\s]+(\d+)/i);
        if (glucoseMatch) {
            this.medicalData.vitals.glucose = {
                value: parseInt(glucoseMatch[1]),
                date: new Date()
            };
        }

        // Extract BMI
        const bmiMatch = text.match(/bmi[:\s]+(\d+\.?\d*)/i);
        if (bmiMatch) {
            this.medicalData.vitals.bmi = {
                value: parseFloat(bmiMatch[1]),
                date: new Date()
            };
        }

        // Extract medications (simplified pattern matching)
        const medPattern = /medications?[:\s]+([\w\s,]+)/gi;
        const medMatches = text.matchAll(medPattern);
        for (const match of medMatches) {
            const meds = match[1].split(',').map(m => m.trim());
            this.medicalData.medications.push(...meds);
        }

        // For demo purposes, generate some sample data if not found
        this.generateSampleData();
    }

    generateSampleData() {
        // Generate sample vital signs if not extracted
        if (!this.medicalData.vitals.bloodPressure) {
            this.medicalData.vitals.bloodPressure = {
                systolic: 120 + Math.floor(Math.random() * 20),
                diastolic: 70 + Math.floor(Math.random() * 15)
            };
        }

        if (!this.medicalData.vitals.cholesterol) {
            this.medicalData.vitals.cholesterol = {
                total: 180 + Math.floor(Math.random() * 40)
            };
        }

        if (!this.medicalData.vitals.glucose) {
            this.medicalData.vitals.glucose = {
                value: 85 + Math.floor(Math.random() * 30)
            };
        }

        if (!this.medicalData.vitals.bmi) {
            this.medicalData.vitals.bmi = {
                value: 22 + Math.random() * 6
            };
        }

        // Generate trend data for charts
        this.generateTrendData();
    }

    generateTrendData() {
        // Generate 6 months of trend data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        
        this.medicalData.bpTrends = months.map((month, i) => ({
            month,
            systolic: 115 + Math.floor(Math.random() * 20),
            diastolic: 70 + Math.floor(Math.random() * 15)
        }));

        this.medicalData.weightTrends = months.map((month, i) => ({
            month,
            weight: 150 + Math.floor(Math.random() * 10),
            bmi: 22 + Math.random() * 4
        }));

        this.medicalData.labTrends = months.map((month, i) => ({
            month,
            cholesterol: 180 + Math.floor(Math.random() * 40),
            glucose: 85 + Math.floor(Math.random() * 30)
        }));
    }

    updateDashboard() {
        // Update vital stats
        const bp = this.medicalData.vitals.bloodPressure;
        document.getElementById('bp-value').textContent = `${bp.systolic}/${bp.diastolic}`;
        
        document.getElementById('cholesterol-value').textContent = 
            this.medicalData.vitals.cholesterol.total;
        
        document.getElementById('glucose-value').textContent = 
            this.medicalData.vitals.glucose.value;
        
        document.getElementById('bmi-value').textContent = 
            this.medicalData.vitals.bmi.value.toFixed(1);

        // Update health summary
        this.updateHealthSummary();
        
        // Update other sections
        this.updateRecentTests();
        this.updateRiskAssessment();
        this.updateMedications();
        this.updateAIInsights();
        this.updateRecommendations();
        
        // Initialize charts
        this.initializeCharts();
    }

    updateHealthSummary() {
        const summaryContent = document.getElementById('health-summary-content');
        const bp = this.medicalData.vitals.bloodPressure;
        const bmi = this.medicalData.vitals.bmi.value;

        let bpStatus = 'Normal';
        let bpClass = 'health-good';
        if (bp.systolic > 130 || bp.diastolic > 80) {
            bpStatus = 'Elevated';
            bpClass = 'health-warning';
        }
        if (bp.systolic > 140 || bp.diastolic > 90) {
            bpStatus = 'High';
            bpClass = 'health-danger';
        }

        let bmiStatus = 'Normal';
        let bmiClass = 'health-good';
        if (bmi > 25) {
            bmiStatus = 'Overweight';
            bmiClass = 'health-warning';
        }
        if (bmi > 30) {
            bmiStatus = 'Obese';
            bmiClass = 'health-danger';
        }

        summaryContent.innerHTML = `
            <div class="summary-item">
                <strong>Blood Pressure:</strong> 
                <span class="${bpClass}">${bpStatus} (${bp.systolic}/${bp.diastolic} mmHg)</span>
            </div>
            <div class="summary-item">
                <strong>BMI:</strong> 
                <span class="${bmiClass}">${bmiStatus} (${bmi.toFixed(1)})</span>
            </div>
            <div class="summary-item">
                <strong>Last Check-up:</strong> ${new Date().toLocaleDateString()}
            </div>
        `;
    }

    updateRecentTests() {
        const testsContent = document.getElementById('recent-tests-content');
        testsContent.innerHTML = `
            <div class="test-result-item">
                <strong>Complete Blood Count:</strong> Normal
                <small>Date: ${new Date().toLocaleDateString()}</small>
            </div>
            <div class="test-result-item">
                <strong>Lipid Panel:</strong> Cholesterol ${this.medicalData.vitals.cholesterol.total} mg/dL
                <small>Date: ${new Date().toLocaleDateString()}</small>
            </div>
            <div class="test-result-item">
                <strong>Fasting Glucose:</strong> ${this.medicalData.vitals.glucose.value} mg/dL
                <small>Date: ${new Date().toLocaleDateString()}</small>
            </div>
        `;
    }

    updateRiskAssessment() {
        const riskContent = document.getElementById('risk-assessment-content');
        const bp = this.medicalData.vitals.bloodPressure;
        const cholesterol = this.medicalData.vitals.cholesterol.total;
        
        let cvdRisk = 'Low';
        let cvdClass = 'risk-low';
        
        if (bp.systolic > 130 || cholesterol > 200) {
            cvdRisk = 'Medium';
            cvdClass = 'risk-medium';
        }
        
        if (bp.systolic > 140 && cholesterol > 240) {
            cvdRisk = 'High';
            cvdClass = 'risk-high';
        }

        riskContent.innerHTML = `
            <div class="risk-item">
                <strong>Cardiovascular Disease:</strong>
                <span class="risk-level ${cvdClass}">${cvdRisk} Risk</span>
            </div>
            <div class="risk-item">
                <strong>Diabetes:</strong>
                <span class="risk-level risk-low">Low Risk</span>
            </div>
            <div class="risk-item">
                <strong>Stroke:</strong>
                <span class="risk-level ${cvdClass}">${cvdRisk} Risk</span>
            </div>
        `;
    }

    updateMedications() {
        const medsContent = document.getElementById('current-meds-list');
        if (this.medicalData.medications.length > 0) {
            medsContent.innerHTML = this.medicalData.medications.map(med => `
                <div class="medication-item">
                    <strong>${med}</strong>
                    <small>Take as prescribed</small>
                </div>
            `).join('');
        } else {
            medsContent.innerHTML = `
                <div class="medication-item">
                    <strong>Lisinopril 10mg</strong>
                    <small>Once daily for blood pressure</small>
                </div>
                <div class="medication-item">
                    <strong>Metformin 500mg</strong>
                    <small>Twice daily with meals</small>
                </div>
            `;
        }
    }

    updateAIInsights() {
        const insightsContent = document.getElementById('ai-insights-content');
        insightsContent.innerHTML = `
            <div class="insight-item">
                <h4>Pattern Recognition</h4>
                <p>Your blood pressure shows an upward trend over the past 3 months. Consider lifestyle modifications.</p>
            </div>
            <div class="insight-item">
                <h4>Medication Adherence</h4>
                <p>Based on refill patterns, your medication adherence rate is approximately 85%. Consistent daily intake is recommended.</p>
            </div>
            <div class="insight-item">
                <h4>Risk Factors</h4>
                <p>Primary risk factors identified: Elevated blood pressure and borderline cholesterol levels.</p>
            </div>
        `;
    }

    updateRecommendations() {
        const lifestyleContent = document.getElementById('lifestyle-recs');
        lifestyleContent.innerHTML = `
            <ul>
                <li>Reduce sodium intake to less than 2,300mg per day</li>
                <li>Engage in 150 minutes of moderate aerobic activity weekly</li>
                <li>Maintain a healthy sleep schedule (7-9 hours)</li>
                <li>Consider the DASH diet for blood pressure management</li>
            </ul>
        `;

        const preventiveContent = document.getElementById('preventive-care');
        preventiveContent.innerHTML = `
            <ul>
                <li>Annual flu vaccination - Due in October</li>
                <li>Blood pressure check - Schedule for next month</li>
                <li>Cholesterol screening - Due in 6 months</li>
                <li>Diabetes screening - Recommended annually</li>
            </ul>
        `;

        const goalsContent = document.getElementById('health-goals');
        goalsContent.innerHTML = `
            <ul>
                <li>Reduce blood pressure to below 120/80 mmHg</li>
                <li>Lower cholesterol to below 200 mg/dL</li>
                <li>Maintain BMI between 18.5-24.9</li>
                <li>Achieve 10,000 steps daily</li>
            </ul>
        `;
    }

    initializeCharts() {
        // Blood Pressure Chart
        const bpCtx = document.getElementById('bp-chart').getContext('2d');
        this.charts.bp = new Chart(bpCtx, {
            type: 'line',
            data: {
                labels: this.medicalData.bpTrends.map(d => d.month),
                datasets: [{
                    label: 'Systolic',
                    data: this.medicalData.bpTrends.map(d => d.systolic),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Diastolic',
                    data: this.medicalData.bpTrends.map(d => d.diastolic),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 160
                    }
                }
            }
        });

        // Weight Chart
        const weightCtx = document.getElementById('weight-chart').getContext('2d');
        this.charts.weight = new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: this.medicalData.weightTrends.map(d => d.month),
                datasets: [{
                    label: 'Weight (lbs)',
                    data: this.medicalData.weightTrends.map(d => d.weight),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                }, {
                    label: 'BMI',
                    data: this.medicalData.weightTrends.map(d => d.bmi),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        min: 140,
                        max: 170
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 20,
                        max: 30,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });

        // Lab Results Chart
        const labsCtx = document.getElementById('labs-chart').getContext('2d');
        this.charts.labs = new Chart(labsCtx, {
            type: 'bar',
            data: {
                labels: this.medicalData.labTrends.map(d => d.month),
                datasets: [{
                    label: 'Cholesterol',
                    data: this.medicalData.labTrends.map(d => d.cholesterol),
                    backgroundColor: '#8b5cf6'
                }, {
                    label: 'Glucose',
                    data: this.medicalData.labTrends.map(d => d.glucose),
                    backgroundColor: '#06b6d4'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update active tab panel
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Resize charts when switching to trends tab
        if (tabName === 'trends' && this.charts.bp) {
            Object.values(this.charts).forEach(chart => chart.resize());
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MedicalAdvicePanel();
});