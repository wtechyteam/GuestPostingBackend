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

module.exports = router;
