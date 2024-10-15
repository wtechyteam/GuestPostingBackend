const express = require('express');
const axios = require('axios');
const router = express.Router();

//all the 3rd party apis for SEO purposes
router.get('/semrush-traffic', async (req, res) => {
    const { domain } = req.query;  

    try {
        const response = await axios({
            method: 'GET',
            url: `https://semrush-traffic.p.rapidapi.com/url_traffic?url=${domain}`,
            params: {
                domain: domain
            },
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'X-RapidAPI-Host': 'semrush-traffic.p.rapidapi.com'
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching SEMRush Traffic:', error);
        res.status(500).json({ error: 'Failed to fetch SEMRush traffic data' });
    }
});

router.get('/ahrefs-data', async (req, res) => {
    const { domain } = req.query;  
    const { url } = req.query;

    try {
        const response = await axios({
            method: 'GET',
            url: `https://ahrefs2.p.rapidapi.com/broken-links?url=${url}&mode=subdomains`,
            params: {
                target: domain
            },
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'X-RapidAPI-Host': 'ahrefs2.p.rapidapi.com'
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Ahrefs data:', error);
        res.status(500).json({ error: 'Failed to fetch Ahrefs data' });
    }
});

router.get('/seo-api', async (req, res) => {
    const { domain } = req.query;
    try {
        const response = await axios({
            method: 'GET',
            url: `https://seo-api2.p.rapidapi.com/domain-age-checker?domain=${domain}`,
            params: {
                target: domain
            },
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'X-RapidAPI-Host': 'seo-api2.p.rapidapi.com'
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Ahrefs data:', error);
        res.status(500).json({ error: 'Failed to fetch Ahrefs data' });
    }
});

router.get('/moz-da', async (req, res) => {
    const { domain } = req.query;
    try {
        const response = await axios({
            method: 'GET',
            url: `https://moz-da-pa-spam-score.p.rapidapi.com/dapa?domain=${domain}`,
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'X-RapidAPI-Host': 'moz-da-pa-spam-score.p.rapidapi.com'
            }
        });

        console.log('API Response:', response.data); // Log the API response to inspect the format
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching moz-da data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : 'Failed to fetch Moz DA data' });
    }
});

router.get('/majestic-data', async (req, res) => {
    const { url } = req.query;

    try {
        const response = await axios({
            method: 'GET',
            url: 'https://majestic1.p.rapidapi.com/url_metrics',
            params: { url },
            headers: {
                'X-RapidAPI-Key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'X-RapidAPI-Host': 'majestic1.p.rapidapi.com                  '
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Majestic data:', error);
        res.status(500).json({ error: 'Failed to fetch Majestic data' });
    }
});
// **New Route: Domain Metrics**
router.get('/domain-metrics', async (req, res) => {
    const { domain } = req.query; // Extract the domain parameter from the query string
    if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
    }

    try {
        const response = await axios({
            method: 'GET',
            url: `https://domain-metrics-check.p.rapidapi.com/domain-metrics/${domain}/`, // Use the dynamic domain value here
            headers: {
                'x-rapidapi-key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'x-rapidapi-host': 'domain-metrics-check.p.rapidapi.com'
            }
        });
        const { mozDA, majesticTF } = response.data;
        res.status(200).json({ mozDA, majesticTF }); // Return the API response
    } catch (error) {
        console.error('Error fetching Domain Metrics:', error);
        res.status(500).json({ error: 'Failed to fetch Domain Metrics data' });
    }
});

// **Route: Ahrefs Traffic**
router.get('/ahrefs-traffic', async (req, res) => {
    const { url } = req.query; // Extract the URL parameter from the query string
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios({
            method: 'GET',
            url: `https://ahrefs2.p.rapidapi.com/traffic?url=${url}`, // Use the dynamic URL here
            headers: {
                'x-rapidapi-key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'x-rapidapi-host': 'ahrefs2.p.rapidapi.com'
            }
        });
        const {trafficMonthlyAvg} = response.data;
        res.status(200).json({trafficMonthlyAvg}); // Send back the Ahrefs traffic data as a response
    } catch (error) {
        console.error('Error fetching Ahrefs Traffic data:', error);
        res.status(500).json({ error: 'Failed to fetch Ahrefs Traffic data' });
    }
});

// **New Route: Ahrefs Authority**
router.get('/ahrefs-authority', async (req, res) => {
    const { url } = req.query; // Extract the URL parameter from the query string
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios({
            method: 'GET',
            url: `https://ahrefs2.p.rapidapi.com/authority?url=${url}`, // Use the dynamic URL here
            headers: {
                'x-rapidapi-key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'x-rapidapi-host': 'ahrefs2.p.rapidapi.com'
            }
        });

        const { domainRating } = response.data;
        res.status(200).json({ domainRating }); // Send the Ahrefs authority data back as a JSON response
    } catch (error) {
        console.error('Error fetching Ahrefs Authority data:', error);
        res.status(500).json({ error: 'Failed to fetch Ahrefs Authority data' });
    }
});

// **New Route: SEMrush Traffic**
router.get('/semrush-traffics', async (req, res) => {
    const { url } = req.query; // Extract the URL parameter from the query string
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios({
            method: 'GET',
            url: `https://semrush-traffic.p.rapidapi.com/url_traffic?url=${url}`, // Use the dynamic URL here
            headers: {
                'x-rapidapi-key': 'c03af74d49msh71f15fbbf4e3586p17a781jsnc08d45cea357',
                'x-rapidapi-host': 'semrush-traffic.p.rapidapi.com'
            }
        });
        const {srRank} = response.data;
        res.status(200).json({srRank}); // Send the SEMrush traffic data back as a JSON response
    } catch (error) {
        console.error('Error fetching SEMrush Traffic data:', error);
        res.status(500).json({ error: 'Failed to fetch SEMrush Traffic data' });
    }
});

// **Route: Ahrefs DR Checker (using query params)**
router.get('/ahrefs-dr-checker', async (req, res) => {
    const { url } = req.query; // Extract the URL from query parameters

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios({
            method: 'POST',
            url: 'https://ahrefs-dr-rank-checker.p.rapidapi.com/check',
            headers: {
                'x-rapidapi-key': '770cdcf629msh8ac0af84d9825b2p1ba4fdjsn3e5df144492e',
                'x-rapidapi-host': 'ahrefs-dr-rank-checker.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ url })
        });

        // Assuming the response contains success, domainRating, and ahrefsRank
        const { success, data } = response.data;
        const { domainRating, 
            // ahrefsRank
         } = data;

        if (success) {
            // Return the domain rating and Ahrefs rank in your response
            return res.status(200).json({ domainRating
                // , ahrefsRank 
            });
        } else {
            return res.status(500).json({ error: 'Failed to retrieve domain rating' });
        }

    } catch (error) {
        console.error('Error fetching Ahrefs DR data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch Ahrefs DR data' });
    }
});

module.exports = router;
