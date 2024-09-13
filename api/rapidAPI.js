const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/semrush-traffic', async (req, res) => {
    const { domain } = req.query;  // Get domain from the request query

    try {
        // Make a request to the SEMRushTraffic API on RapidAPI
        const response = await axios({
            method: 'GET',
            url: `https://semrush-traffic.p.rapidapi.com/url_traffic?url=${domain}`,
            params: {
                domain: domain
            },
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357', // Replace with your RapidAPI key
                'X-RapidAPI-Host': 'semrush-traffic.p.rapidapi.com'   // Replace with the host name of the API
            }
        });

        // Send the SEMRush data back to the client
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching SEMRush Traffic:', error);
        res.status(500).json({ error: 'Failed to fetch SEMRush traffic data' });
    }
});

router.get('/ahrefs-data', async (req, res) => {
    const { domain } = req.query;  // Get domain from the request query
    const { url } = req.query;

    try {
        // Make a request to the Ahrefs API on RapidAPI
        const response = await axios({
            method: 'GET',
            url: `https://ahrefs2.p.rapidapi.com/broken-links?url=${url}&mode=subdomains`,  // Use the correct endpoint from RapidAPI
            params: {
                target: domain
            },
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357', // Replace with your RapidAPI key
                'X-RapidAPI-Host': 'ahrefs2.p.rapidapi.com'    // Replace with the Ahrefs API host
            }
        });

        // Send the Ahrefs data back to the client
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Ahrefs data:', error);
        res.status(500).json({ error: 'Failed to fetch Ahrefs data' });
    }
});

router.get('/seo-api', async (req, res) => {
    const { domain } = req.query;  // Get domain from the request query
    try {
        // Make a request to the Ahrefs API on RapidAPI
        const response = await axios({
            method: 'GET',
            url: `https://seo-api2.p.rapidapi.com/domain-age-checker?domain=${domain}`,  // Use the correct endpoint from RapidAPI
            params: {
                target: domain
            },
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357', // Replace with your RapidAPI key
                'X-RapidAPI-Host': 'seo-api2.p.rapidapi.com'    // Replace with the Ahrefs API host
            }
        });

        // Send the Ahrefs data back to the client
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Ahrefs data:', error);
        res.status(500).json({ error: 'Failed to fetch Ahrefs data' });
    }
});

router.get('/moz-da', async (req, res) => {
    const { domain } = req.query;  // Get domain from the request query
    try {
        // Make a request to the Ahrefs API on RapidAPI
        const response = await axios({
            method: 'GET',
            url: `https://moz-da-pa-spam-score.p.rapidapi.com/dapa?domain=${domain}`,  // Use the correct endpoint from RapidAPI
            params: {
                target: domain
            },
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'X-RapidAPI-Host': 'moz-da-pa-spam-score.p.rapidapi.com'    // Replace with the Ahrefs API host
            }
        });

        // Send the Ahrefs data back to the client
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching moz-da data:', error);
        res.status(500).json({ error: 'Failed to fetch Ahrefs data' });
    }
});

router.get('/majestic-data', async (req, res) => {
    const { url } = req.query;  // Get URL from the request query parameter

    try {
        // Make a request to the Majestic API on RapidAPI
        const response = await axios({
            method: 'GET',
            url: 'https://majestic1.p.rapidapi.com/url_metrics',  // Use the correct endpoint from RapidAPI
            params: { url },  // Pass the URL as a parameter
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',  // Replace with your RapidAPI key
                'X-RapidAPI-Host': 'majestic1.p.rapidapi.com                  '
            }
        });

        // Send the Majestic data back to the client
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Majestic data:', error);
        res.status(500).json({ error: 'Failed to fetch Majestic data' });
    }
});

module.exports = router;
