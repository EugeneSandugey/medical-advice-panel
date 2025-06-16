# Personal Medical Advice Panel

A comprehensive web application for analyzing Kaiser medical records and providing personalized health insights.

## Features

- **PDF Upload & Analysis**: Upload Kaiser medical records in PDF format
- **Health Metrics Dashboard**: View vital signs, lab results, and health trends
- **AI-Powered Insights**: Get personalized health recommendations based on your data
- **Interactive Charts**: Visualize health trends over time
- **Risk Assessment**: Understand your health risks with clear indicators
- **Medication Tracking**: Keep track of current medications and adherence
- **Privacy-First**: All processing happens locally in your browser

## How to Use

1. **Start the application**:
   ```bash
   python3 server.py
   ```
   Or using Python's built-in server:
   ```bash
   python3 -m http.server 8000
   ```

2. **Open in browser**: Navigate to `http://localhost:8000`

3. **Upload medical records**: 
   - Click "Browse Files" or drag and drop PDF files
   - The application will extract and analyze health data

4. **Explore the dashboard**:
   - **Overview**: See your current health status
   - **Trends**: View health metrics over time
   - **Medications**: Track current prescriptions
   - **AI Insights**: Get personalized recommendations
   - **Recommendations**: Lifestyle and preventive care suggestions

## Important Disclaimers

- This tool is for **educational purposes only**
- It does **not** provide medical advice
- Always consult healthcare professionals for medical decisions
- All data processing happens locally - no data is sent to external servers

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PDF Processing**: PDF.js for client-side PDF parsing
- **Charts**: Chart.js for data visualization
- **Privacy**: Zero server-side processing, all data stays local

## Sample Data

If your PDF doesn't contain recognizable medical data, the application will generate sample data for demonstration purposes.

## Browser Compatibility

Works best with modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Security Note

This application processes sensitive medical data locally in your browser. No data is transmitted to any servers. However, always ensure you're running this on a trusted device.