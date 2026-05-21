/**
 * EcoSmart Frontend Configuration
 * This file contains environment-specific configuration for the frontend.
 * For production, update these values or use environment variables.
 */

(function() {
    'use strict';

    // Configuration object
    const EcoSmartConfig = {
        // API Configuration
        api: {
            // Base URL for the backend API
            // Can be overridden by setting window.ECO_SMART_API_URL before loading this script
            baseUrl: window.ECO_SMART_API_URL || 'https://eco-smart-backend-3km1.onrender.com',

            // API endpoints prefix (if any)
            prefix: '',

            // Request timeout in milliseconds
            timeout: 30000,
        },

        // Map Configuration
        map: {
            // Default center coordinates (New Delhi)
            defaultCenter: [28.6139, 77.2090],
            defaultZoom: 13,

            // Truck alert radius in kilometers
            truckAlertRadius: 2,
        },

        // Polling Configuration
        polling: {
            // Interval for real-time updates in milliseconds
            interval: 8000,
        },

        // Feature flags
        features: {
            enableNotifications: true,
            enableLiveTracking: true,
            enableMarketplace: true,
        },
    };

    // Make config available globally
    window.EcoSmartConfig = EcoSmartConfig;
})();